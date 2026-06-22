(function initJfShared(global) {
  const DEFAULT_TIMEOUT_MS = 20000;

  function currentScriptPath(fallbackFile = "") {
    const current = document.currentScript;
    if (current?.src) return new URL(current.src).pathname;
    if (fallbackFile) {
      const suffix = `/${fallbackFile.replace(/^\/+/, "")}`;
      const script = [...document.scripts].reverse().find((item) => {
        if (!item.src) return false;
        return new URL(item.src).pathname.endsWith(suffix);
      });
      if (script?.src) return new URL(script.src).pathname;
    }
    return fallbackFile ? `/${fallbackFile.replace(/^\/+/, "")}` : "/";
  }

  function basePathFromScript(fileName) {
    const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return currentScriptPath(fileName).replace(new RegExp(`/${escaped}$`), "");
  }

  function appUrl(basePath, pathname) {
    const normalized = String(pathname || "/").startsWith("/") ? String(pathname || "/") : `/${pathname}`;
    return `${basePath || ""}${normalized}`;
  }

  function requestSignalWithTimeout(controller, externalSignal) {
    if (!externalSignal) return controller.signal;
    if (externalSignal.aborted) {
      controller.abort();
      return controller.signal;
    }
    if (typeof AbortSignal !== "undefined" && typeof AbortSignal.any === "function") {
      return AbortSignal.any([controller.signal, externalSignal]);
    }
    externalSignal.addEventListener("abort", () => controller.abort(), { once: true });
    return controller.signal;
  }

  async function fetchJson(url, options = {}) {
    const controller = new AbortController();
    const timeoutMs = Number.isFinite(options.timeoutMs) ? options.timeoutMs : DEFAULT_TIMEOUT_MS;
    const timeout = global.setTimeout(() => controller.abort(), timeoutMs);
    const externalSignal = options.signal || null;
    const signal = requestSignalWithTimeout(controller, externalSignal);
    const {
      timeoutMs: _timeoutMs,
      errorMessage = "请求失败。",
      timeoutMessage = "网络响应超时，请稍后再试。",
      cancelledMessage = "请求已取消。",
      signal: _signal,
      ...fetchOptions
    } = options;

    const response = await fetch(url, {
      credentials: "same-origin",
      ...fetchOptions,
      signal
    }).catch((error) => {
      if (error.name === "AbortError") {
        const abortError = new Error(externalSignal?.aborted ? cancelledMessage : timeoutMessage);
        abortError.name = "AbortError";
        abortError.cancelled = Boolean(externalSignal?.aborted);
        throw abortError;
      }
      throw error;
    }).finally(() => {
      global.clearTimeout(timeout);
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.message || errorMessage);
      error.status = response.status;
      error.payload = data;
      throw error;
    }
    return data;
  }

  function base64urlToBuffer(value) {
    const normalized = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const binary = global.atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes.buffer;
  }

  function bufferToBase64url(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }
    return global.btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  function publicKeyCreationOptionsFromJson(options) {
    return {
      ...options,
      challenge: base64urlToBuffer(options.challenge),
      user: {
        ...options.user,
        id: base64urlToBuffer(options.user.id)
      },
      excludeCredentials: (options.excludeCredentials || []).map((credential) => ({
        ...credential,
        id: base64urlToBuffer(credential.id)
      }))
    };
  }

  function publicKeyRequestOptionsFromJson(options) {
    return {
      ...options,
      challenge: base64urlToBuffer(options.challenge),
      allowCredentials: (options.allowCredentials || []).map((credential) => ({
        ...credential,
        id: base64urlToBuffer(credential.id)
      }))
    };
  }

  function credentialToJson(credential) {
    const response = credential.response;
    const result = {
      id: credential.id,
      rawId: bufferToBase64url(credential.rawId),
      type: credential.type,
      response: {
        clientDataJSON: bufferToBase64url(response.clientDataJSON)
      }
    };
    if (response.attestationObject) {
      result.response.attestationObject = bufferToBase64url(response.attestationObject);
      if (typeof response.getTransports === "function") {
        result.response.transports = response.getTransports();
      }
    }
    if (response.authenticatorData) {
      result.response.authenticatorData = bufferToBase64url(response.authenticatorData);
      result.response.signature = bufferToBase64url(response.signature);
      if (response.userHandle) {
        result.response.userHandle = bufferToBase64url(response.userHandle);
      }
    }
    return result;
  }

  function webauthnSupported() {
    return Boolean(global.PublicKeyCredential && navigator.credentials?.create && navigator.credentials?.get);
  }

  function isImageInteractionTarget(target) {
    return target instanceof Element && Boolean(target.closest("img"));
  }

  global.JFShared = {
    appUrl,
    base64urlToBuffer,
    basePathFromScript,
    bufferToBase64url,
    credentialToJson,
    currentScriptPath,
    fetchJson,
    isImageInteractionTarget,
    publicKeyCreationOptionsFromJson,
    publicKeyRequestOptionsFromJson,
    requestSignalWithTimeout,
    webauthnSupported
  };
})(window);
