import crypto from "node:crypto";
import { Readable } from "node:stream";

const DEFAULT_SIGNED_URL_TTL_SECONDS = 60 * 60 * 24;

function envBool(value, fallback = false) {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text) return fallback;
  return !["0", "false", "no", "off"].includes(text);
}

function positiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function trimSlashes(value) {
  return String(value || "").trim().replace(/^\/+|\/+$/g, "");
}

function normalizeBaseUrl(value) {
  const text = String(value || "").trim().replace(/\/+$/g, "");
  if (!text) return "";
  try {
    const url = new URL(text);
    if (!["http:", "https:"].includes(url.protocol)) return "";
    return url.href.replace(/\/+$/g, "");
  } catch {
    return "";
  }
}

function normalizeMediaPrefix(value) {
  const prefix = trimSlashes(value || "photos")
    .split("/")
    .map((part) => part.replace(/[^A-Za-z0-9._-]/g, "-"))
    .filter(Boolean)
    .join("/");
  return prefix || "photos";
}

function normalizeFilename(value) {
  const filename = String(value || "").trim().split(/[\\/]/g).pop() || "";
  if (!/^[A-Za-z0-9._-]{1,220}$/.test(filename)) return "";
  return filename;
}

function normalizeCode(value) {
  const code = String(value || "").trim();
  return /^[A-Za-z0-9_-]{1,80}$/.test(code) ? code : "";
}

function encodePathSegment(value) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

function encodeObjectPath(key) {
  return `/${String(key || "")
    .split("/")
    .filter((segment) => segment.length > 0)
    .map(encodePathSegment)
    .join("/")}`;
}

function sha1Hex(value) {
  return crypto.createHash("sha1").update(value).digest("hex");
}

function hmacSha1Hex(key, value) {
  return crypto.createHmac("sha1", key).update(value).digest("hex");
}

function canonicalizePairs(source) {
  return Object.entries(source || {})
    .map(([key, value]) => [String(key).trim().toLowerCase(), String(value ?? "").trim()])
    .filter(([key]) => key)
    .sort(([left], [right]) => left.localeCompare(right));
}

function canonicalList(pairs) {
  return pairs.map(([key]) => key).join(";");
}

function canonicalString(pairs) {
  return pairs
    .map(([key, value]) => `${encodePathSegment(key)}=${encodePathSegment(value)}`)
    .join("&");
}

export function mediaStorageConfigFromEnv(env = process.env) {
  const secretId = String(env.COS_SECRET_ID || env.TENCENT_COS_SECRET_ID || "").trim();
  const secretKey = String(env.COS_SECRET_KEY || env.TENCENT_COS_SECRET_KEY || "").trim();
  const bucket = String(env.COS_BUCKET || "").trim();
  const region = String(env.COS_REGION || "ap-shanghai").trim();
  const appId = String(env.COS_APP_ID || "").trim();
  const cdnBaseUrl = normalizeBaseUrl(env.COS_CDN_BASE_URL || env.MEDIA_CDN_BASE_URL || "");
  const urlMode = String(env.MEDIA_URL_MODE || "api").trim().toLowerCase();
  const enabled = envBool(env.COS_ENABLED, false) && Boolean(secretId && secretKey && bucket && region);

  return {
    enabled,
    secretId,
    secretKey,
    bucket,
    appId,
    region,
    prefix: normalizeMediaPrefix(env.COS_MEDIA_PREFIX || "photos"),
    cdnBaseUrl,
    urlMode: ["api", "signed-cdn", "signed-cos", "public-cdn", "public-cos"].includes(urlMode) ? urlMode : "api",
    signedUrlTtlSeconds: positiveNumber(env.MEDIA_SIGNED_URL_TTL_SECONDS, DEFAULT_SIGNED_URL_TTL_SECONDS),
    uploadFallbackLocal: envBool(env.MEDIA_UPLOAD_FALLBACK_LOCAL, true),
    keepLocalCopy: envBool(env.MEDIA_KEEP_LOCAL_COPY, false),
    requestTimeoutMs: positiveNumber(env.COS_REQUEST_TIMEOUT_MS, 20 * 1000)
  };
}

export function createCosMediaStorage(config = mediaStorageConfigFromEnv()) {
  const cosHost = config.bucket && config.region
    ? `${config.bucket}.cos.${config.region}.myqcloud.com`
    : "";
  const cosBaseUrl = cosHost ? `https://${cosHost}` : "";

  function objectKeyFor(code, filename) {
    const safeCode = normalizeCode(code);
    const safeFilename = normalizeFilename(filename);
    if (!safeCode || !safeFilename) return "";
    return `${config.prefix}/${safeCode}/${safeFilename}`;
  }

  function authorization({ method, key, expires = config.signedUrlTtlSeconds, query = {} }) {
    const begin = Math.max(0, Math.floor(Date.now() / 1000) - 60);
    const end = begin + Math.max(1, Math.floor(expires));
    const signTime = `${begin};${end}`;
    const keyTime = signTime;
    const headers = canonicalizePairs({ host: cosHost });
    const params = canonicalizePairs(query);
    const headerList = canonicalList(headers);
    const paramList = canonicalList(params);
    const httpString = [
      String(method || "get").toLowerCase(),
      encodeObjectPath(key),
      canonicalString(params),
      canonicalString(headers),
      ""
    ].join("\n");
    const stringToSign = [
      "sha1",
      signTime,
      sha1Hex(httpString),
      ""
    ].join("\n");
    const signKey = hmacSha1Hex(config.secretKey, keyTime);
    const signature = hmacSha1Hex(signKey, stringToSign);
    return [
      ["q-sign-algorithm", "sha1"],
      ["q-ak", config.secretId],
      ["q-sign-time", signTime],
      ["q-key-time", keyTime],
      ["q-header-list", headerList],
      ["q-url-param-list", paramList],
      ["q-signature", signature]
    ];
  }

  function authorizationHeader(args) {
    return authorization(args).map(([key, value]) => `${key}=${value}`).join("&");
  }

  function authorizationQuery(args) {
    return authorization(args)
      .map(([key, value]) => `${encodePathSegment(key)}=${encodePathSegment(value)}`)
      .join("&");
  }

  function objectUrl(key, baseUrl = cosBaseUrl) {
    return `${baseUrl}${encodeObjectPath(key)}`;
  }

  function signedUrl(key, { method = "GET", ttlSeconds = config.signedUrlTtlSeconds, baseUrl = "" } = {}) {
    if (!config.enabled || !key) return "";
    const targetBaseUrl = baseUrl || cosBaseUrl;
    if (!targetBaseUrl) return "";
    return `${objectUrl(key, targetBaseUrl)}?${authorizationQuery({ method, key, expires: ttlSeconds })}`;
  }

  function publicUrl(key, { method = "GET", ttlSeconds = config.signedUrlTtlSeconds } = {}) {
    if (!config.enabled || !key) return "";
    if (config.urlMode === "signed-cdn" && config.cdnBaseUrl) {
      return signedUrl(key, { method, ttlSeconds, baseUrl: config.cdnBaseUrl });
    }
    if (config.urlMode === "signed-cos") {
      return signedUrl(key, { method, ttlSeconds, baseUrl: cosBaseUrl });
    }
    if (config.urlMode === "public-cdn" && config.cdnBaseUrl) {
      return objectUrl(key, config.cdnBaseUrl);
    }
    if (config.urlMode === "public-cos") {
      return objectUrl(key, cosBaseUrl);
    }
    return "";
  }

  async function cosFetch(method, key, { body = null, contentType = "", signal = null } = {}) {
    if (!config.enabled || !key) {
      throw new Error("COS storage is not configured.");
    }
    const controller = signal ? null : new AbortController();
    const timeout = controller
      ? setTimeout(() => controller.abort(), config.requestTimeoutMs)
      : null;
    try {
      const headers = {
        Authorization: authorizationHeader({ method, key })
      };
      if (contentType) {
        headers["Content-Type"] = contentType;
      }
      return await fetch(objectUrl(key), {
        method,
        headers,
        body,
        signal: signal || controller.signal
      });
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }

  async function responseTextSafe(response) {
    try {
      return (await response.text()).slice(0, 500);
    } catch {
      return "";
    }
  }

  async function uploadBuffer(key, buffer, contentType = "application/octet-stream") {
    const response = await cosFetch("PUT", key, { body: buffer, contentType });
    if (!response.ok) {
      const text = await responseTextSafe(response);
      throw new Error(`COS 上传失败：${response.status} ${text || response.statusText}`);
    }
    return true;
  }

  async function deleteObject(key) {
    if (!config.enabled || !key) return false;
    const response = await cosFetch("DELETE", key).catch((error) => {
      console.warn("COS 删除请求失败：", error.message);
      return null;
    });
    return Boolean(response && (response.ok || response.status === 404));
  }

  async function objectExists(key) {
    if (!config.enabled || !key) return false;
    const response = await cosFetch("HEAD", key);
    if (response.ok) return true;
    if (response.status === 404) return false;
    const text = await responseTextSafe(response);
    throw new Error(`COS 检查失败：${response.status} ${text || response.statusText}`);
  }

  async function openReadStream(key) {
    if (!config.enabled || !key) return null;
    const response = await cosFetch("GET", key);
    if (response.status === 404) return null;
    if (!response.ok) {
      const text = await responseTextSafe(response);
      throw new Error(`COS 读取失败：${response.status} ${text || response.statusText}`);
    }
    return {
      contentType: response.headers.get("content-type") || "",
      contentLength: response.headers.get("content-length") || "",
      stream: Readable.fromWeb(response.body)
    };
  }

  function cspSource() {
    if (config.cdnBaseUrl) {
      try {
        const url = new URL(config.cdnBaseUrl);
        return `${url.protocol}//${url.host}`;
      } catch {
        return "";
      }
    }
    return cosBaseUrl;
  }

  return {
    enabled: config.enabled,
    config,
    cosHost,
    cosBaseUrl,
    objectKeyFor,
    signedUrl,
    publicUrl,
    uploadBuffer,
    deleteObject,
    objectExists,
    openReadStream,
    cspSource,
    shouldKeepLocalCopy: () => Boolean(config.keepLocalCopy),
    shouldFallbackLocal: () => Boolean(config.uploadFallbackLocal),
    shouldRedirect: () => ["signed-cdn", "signed-cos", "public-cdn", "public-cos"].includes(config.urlMode)
  };
}
