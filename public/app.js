const APP_PRIMARY_LANGUAGE = ((Array.isArray(navigator.languages) && navigator.languages[0]) || navigator.language || "").toLowerCase();
const APP_LOCALE_CHINESE = /^zh\b/i.test(APP_PRIMARY_LANGUAGE);
const APP_LOCALE_ENGLISH = !APP_LOCALE_CHINESE;

const APP_COPY = APP_LOCALE_ENGLISH
  ? {
    brand: "WellEcho",
    subtitle: "Record your health. Replay your change.",
    profileTitleSuffix: "'s record",
    profileTitle: (name) => `${name}'s record`,
    documentTitle: "WellEcho",
    adminDocumentTitle: "Console · WellEcho",
  }
  : {
    brand: "今天你瘦了吗?",
    subtitle: "每日记录",
    profileTitleSuffix: " 的减肥记录",
    profileTitle: (name) => `${name} 的减肥记录`,
    documentTitle: "今天你瘦了吗?",
    adminDocumentTitle: "管理台 · 今天你瘦了吗?",
  };

function applyLocaleCopy() {
  document.documentElement.lang = APP_LOCALE_ENGLISH ? "en" : "zh-CN";
  document.documentElement.dataset.locale = APP_LOCALE_ENGLISH ? "en" : "zh";
  document.title = document.querySelector(".admin-root") ? APP_COPY.adminDocumentTitle : APP_COPY.documentTitle;
  document.querySelectorAll("[data-i18n-brand]").forEach((element) => {
    element.textContent = APP_COPY.brand;
  });
  document.querySelectorAll("[data-i18n-subtitle]").forEach((element) => {
    element.textContent = APP_COPY.subtitle;
  });
  applyStaticLocale(document.body);
  startLocaleObserver();
}

const STATIC_EN_TEXT = new Map(Object.entries({
  "正在加载": "Loading",
  "首次打开会准备登录和记录数据": "Preparing sign-in and records",
  "下拉刷新": "Pull to refresh",
  "每日记录": "Daily record",
  "Apple 登录": "Sign in with Apple",
  "Apple登录": "Sign in with Apple",
  "qq登录": "Sign in with QQ",
  "QQ登录": "Sign in with QQ",
  "Passkey 登录": "Passkey sign-in",
  "测试账号进入": "Use test account",
  "我的": "Me",
  "社区": "Community",
  "设置": "Settings",
  "拍照记录": "Body record",
  "打开摄像头，登记体重和心情": "Record weight and mood",
  "食物记录": "Food record",
  "拍食物照片，记录摄入卡路里": "Track food calories",
  "回放": "Replay",
  "体重涨跌日历": "Weight change calendar",
  "AI建议": "AI advice",
  "总结我的变化": "Summarize my change",
  "根据体重和心情生成简短分析": "Brief trend insight",
  "总结": "Summarize",
  "全部记录": "All records",
  "正在加载记录": "Loading records",
  "收起": "Collapse",
  "展开": "Expand",
  "向下滚动加载更多": "Scroll down to load more",
  "共享我的变化": "Share my change",
  "关闭时，其他人无法查看你的记录。": "When off, others cannot view your records.",
  "未共享": "Not shared",
  "已共享": "Shared",
  "大家的变化": "Community",
  "人气榜": "Popular",
  "持续行动，也彼此鼓励": "Keep going, encourage each other",
  "周榜": "Week",
  "月榜": "Month",
  "年榜": "Year",
  "总榜": "All",
  "账户": "Account",
  "账户信息": "Account info",
  "待选择": "Pending",
  "登录档案": "Profile",
  "口令账户": "Passcode account",
  "账户资料": "Profile details",
  "查看昵称、性别和生日。": "Name, gender, birthday.",
  "绑定账号": "Linked accounts",
  "管理 Apple ID、QQ 等登录方式。": "Manage Apple ID and QQ.",
  "隐私与数据": "Privacy",
  "隐私协议与使用模式": "Privacy & mode",
  "查看签署状态、协议文件和使用模式。": "Consent and policy settings.",
  "尚未签署": "Unsigned",
  "安全登录": "Secure sign-in",
  "先绑定 QQ 后，可添加手机 Passkey。": "Add a phone Passkey.",
  "未设置": "Not set",
  "注销账户": "Delete account",
  "进入后可查看影响范围并确认操作。": "Review impact first.",
  "帮助与安全": "Help & safety",
  "意见反馈与举报": "Feedback and reports",
  "反馈问题、建议，或提交社区内容举报。": "Feedback and reports.",
  "iOS 测试": "iOS test",
  "健康数据桥接": "Health data bridge",
  "iOS 健康": "iOS Health",
  "健康数据同步": "Health sync",
  "在 App 内自动同步体重和心率，用于高低图与日历。": "Sync weight and heart rate for charts.",
  "检测中": "Checking",
  "同步中": "Syncing",
  "同步正常": "Synced",
  "同步失败": "Failed",
  "最近 30 天": "Recent 30 days",
  "退出账户": "Sign out",
  "Apple ID": "Apple ID",
  "未绑定": "Not linked",
  "可绑定 Apple ID 后用于网页登录。": "Link Apple ID for web sign-in.",
  "可绑定 QQ 后用于网页登录。": "Link QQ for web sign-in.",
  "绑定 Apple": "Link Apple",
  "绑定 QQ": "Link QQ",
  "同步资料": "Sync profile",
  "绑定后可以使用对应账号登录同一个档案；已绑定到其他档案的账号不能重复绑定。": "Linked accounts sign in to this profile. Accounts linked elsewhere cannot be reused.",
  "拍照后会自动识别，并在弹窗中选择食物和重量。": "Recognition starts after capture.",
  "对齐拍照": "Aligned photo",
  "记录饮食": "Food capture",
  "点击打开摄像头": "Tap to open camera",
  "切换镜头": "Switch camera",
  "拍照": "Capture",
  "重拍": "Retake",
  "保存记录": "Save record",
  "加入记录": "Add to record",
  "暂不添加": "Not now",
  "选择食物和重量": "Choose food and weight",
  "识别结果": "Recognition result",
  "正在载入社区资料...": "Loading profile...",
  "正在载入留言...": "Loading comments...",
  "变化回放": "Replay",
  "关闭": "Close",
  "隐私政策": "Privacy Policy",
  "用户协议": "Terms",
  "当前浏览器不支持 Passkey。": "Passkey is unavailable here.",
  "正在打开系统 Passkey 设置...": "Opening Passkey...",
  "Passkey 已添加，下次可以直接用它登录。": "Passkey added.",
  "正在通过 App 添加 Passkey...": "Opening Passkey...",
  "当前浏览器不支持 Passkey，请使用手机系统浏览器或新版桌面浏览器。": "Passkey is unavailable in this browser.",
  "Passkey 会绑定当前 Apple ID 账户，之后可用手机解锁直接登录本站。": "Bind Passkey to this Apple ID.",
  "Passkey 会绑定当前 QQ 账户，之后可用手机解锁直接登录本站。": "Bind Passkey to this QQ account.",
  "请先使用 QQ 或 Apple ID 登录，再添加 Passkey。": "Sign in before adding Passkey."
}));

let localeObserverStarted = false;

function translateStaticValue(value) {
  if (!APP_LOCALE_ENGLISH || !value) return value;
  const trimmed = String(value).trim();
  const translated = STATIC_EN_TEXT.get(trimmed);
  if (!translated) return value;
  return String(value).replace(trimmed, translated);
}

function shouldSkipLocaleNode(node) {
  const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  if (!element) return true;
  return Boolean(element.closest("script, style, svg, canvas, input, textarea, code, pre, [data-no-i18n]"));
}

function applyStaticLocale(root = document.body) {
  if (!APP_LOCALE_ENGLISH || !root) return;
  if (root.nodeType === Node.TEXT_NODE) {
    if (!shouldSkipLocaleNode(root)) {
      const next = translateStaticValue(root.nodeValue);
      if (next !== root.nodeValue) root.nodeValue = next;
    }
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
    return;
  }

  const element = root.nodeType === Node.ELEMENT_NODE ? root : null;
  if (element && shouldSkipLocaleNode(element)) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return shouldSkipLocaleNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const next = translateStaticValue(node.nodeValue);
    if (next !== node.nodeValue) node.nodeValue = next;
  }

  const attrNames = ["aria-label", "title", "placeholder"];
  const elements = root.querySelectorAll ? root.querySelectorAll(attrNames.map((name) => `[${name}]`).join(",")) : [];
  elements.forEach((item) => {
    attrNames.forEach((name) => {
      if (!item.hasAttribute(name)) return;
      const next = translateStaticValue(item.getAttribute(name));
      if (next !== item.getAttribute(name)) item.setAttribute(name, next);
    });
  });
}

function startLocaleObserver() {
  if (!APP_LOCALE_ENGLISH || localeObserverStarted || !document.body) return;
  localeObserverStarted = true;
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData") {
        applyStaticLocale(mutation.target);
      } else {
        mutation.addedNodes.forEach((node) => applyStaticLocale(node));
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}

const state = {
  profile: null,
  records: [],
  historyRecords: [],
  historyOffset: 0,
  historyHasMore: true,
  historyLoading: false,
  historyExpanded: true,
  historyFoodCarouselTimer: null,
  historyFoodScaleRaf: null,
  recordsLoaded: false,
  community: null,
  communityLoading: false,
  communityPanel: "feed",
  communityRankingPeriod: "week",
  communityDetailMemberId: null,
  communityDetail: null,
  communityDetailClosing: false,
  communityDetailCloseTimer: null,
  communityCommentsOpen: false,
  communityLikeBurstMemberId: null,
  communityLikeBurstTimer: null,
  communityFoodCarouselTimer: null,
  communityComposerOpen: false,
  feedbackContext: null,
  feedbackImages: [],
  activeTab: "personal",
  settingsPanel: "overview",
  passkeyStatus: null,
  passkeyPromptQueued: false,
  passkeyPromptVisible: false,
  nativeHealthAvailable: false,
  nativeHealthLoading: false,
  nativeHealthSnapshot: null,
  nativeHealthError: "",
  nativeHealthLoadedDays: 0,
  nativeHealthWeightRecords: [],
  nativeHealthHeartRateRecords: [],
  privacyPromptReason: "initial",
  privacyConsentStep: "full",
  replaySourceElement: null,
  replayRestoreFocus: false,
  replayClosing: false,
  aiSummaryClosing: false,
  aiSummaryAbortController: null,
  aiSummaryTypewriter: null,
  lastForegroundSyncAt: 0,
  foregroundSyncing: false,
  lastInputWasKeyboard: false,
  qqLoginWindow: null,
  appleLoginWindow: null,
  qqLoginSettledAt: 0,
  appleLoginSettledAt: 0,
  testLoginLoading: false,
  qqProfileSyncing: false,
  accountBindingLoading: "",
  profileSaving: false,
  profileEditing: false,
  profileDraft: { gender: "", birthday: "", year: null, month: null, day: null },
  birthdayPickerOpen: false,
  moodAiContext: null,
  environmentContext: null,
  environmentContextAt: 0,
  environmentContextPromise: null,
  isRefreshing: false,
  viewportSettlingTimers: [],
  lastResponsiveViewportWidth: 0,
  stream: null,
  captureMode: "body",
  capturedPhoto: null,
  capturedThumbnail: null,
  capturedPhotoUrl: null,
  foodPendingPhoto: null,
  foodPhotos: [],
  foodItems: [],
  foodSelectionCandidates: [],
  foodSelectionPhotoId: null,
  foodEditingCandidateId: null,
  foodEstimatingCandidateId: null,
  manualFoodSubmitting: false,
  foodAnalyzing: false,
  foodAnalyzeAbortController: null,
  foodAnalyzeRequestId: 0,
  foodAnalysisTaskTimer: null,
  foodAnalysisTaskIndex: 0,
  faceLandmarker: null,
  faceModelPromise: null,
  faceModelReady: false,
  faceModelSource: "",
  faceModelMode: "",
  faceModelError: "",
  isCapturing: false,
  facingMode: "user"
};

const REPLAY_BUILD_VERSION = "20260626-cdnreplay1";
const SOFT_OVERLAY_TRANSITION_MS = 190;
const API_TIMEOUT_MS = 70000;
const MAX_CLIENT_PHOTO_BYTES = 10 * 1024 * 1024;
const FEEDBACK_IMAGE_LIMIT = 6;
const FEEDBACK_IMAGE_MAX_BYTES = Math.floor(1.6 * 1024 * 1024);
const FEEDBACK_IMAGE_MAX_DIMENSION = 1280;
const FEEDBACK_IMAGE_QUALITY = 0.82;
const MAX_FOOD_PHOTOS_PER_RECORD = 6;
const MAX_FOOD_ITEMS_PER_RECORD = 12;
const AI_ENVIRONMENT_CACHE_MS = 10 * 60 * 1000;
const AI_ENVIRONMENT_STORAGE_KEY = "jf_ai_environment_context_v1";
const FOOD_ANALYSIS_TASKS = [
  "上传图片",
  "调用千问视觉",
  "等待千问返回",
  "解析千问返回",
  "整理热量营养"
];
const FOOD_NUTRIENT_SPECS = [
  { key: "protein", aliases: ["protein", "proteins", "PROCNT", "dbz"], label: "蛋白质", unit: "g", primary: true },
  { key: "fat", aliases: ["fat", "fats", "totalFat", "total_fat", "FAT", "zf"], label: "脂肪", unit: "g", primary: true },
  { key: "carbs", aliases: ["carbs", "carbohydrate", "carbohydrates", "totalCarbohydrate", "total_carbohydrate", "CHOCDF", "shhf"], label: "碳水", unit: "g", primary: true },
  { key: "fiber", aliases: ["fiber", "fibers", "dietaryFiber", "dietary_fiber", "FIBTG", "ssxw"], label: "膳食纤维", unit: "g" },
  { key: "sodium", aliases: ["sodium", "salt", "NA", "la"], label: "钠", unit: "mg" },
  { key: "cholesterol", aliases: ["cholesterol", "CHOLE", "dgc"], label: "胆固醇", unit: "mg" },
  { key: "calcium", aliases: ["calcium", "CA", "gai"], label: "钙", unit: "mg" },
  { key: "potassium", aliases: ["potassium", "K", "jia"], label: "钾", unit: "mg" },
  { key: "thiamin", aliases: ["thiamin", "las"], label: "硫胺素", unit: "mg" },
  { key: "riboflavin", aliases: ["riboflavin", "su"], label: "核黄素", unit: "mg" },
  { key: "niacin", aliases: ["niacin", "ys"], label: "烟酸", unit: "mg" },
  { key: "magnesium", aliases: ["magnesium", "MG", "mei"], label: "镁", unit: "mg" },
  { key: "iron", aliases: ["iron", "FE", "tei"], label: "铁", unit: "mg" },
  { key: "zinc", aliases: ["zinc", "ZN", "xin"], label: "锌", unit: "mg" },
  { key: "phosphorus", aliases: ["phosphorus", "P", "ling"], label: "磷", unit: "mg" },
  { key: "manganese", aliases: ["manganese", "meng"], label: "锰", unit: "mg" },
  { key: "copper", aliases: ["copper", "tong"], label: "铜", unit: "mg" },
  { key: "selenium", aliases: ["selenium", "xi"], label: "硒", unit: "μg" },
  { key: "carotene", aliases: ["carotene", "lb"], label: "胡萝卜素", unit: "μg" },
  { key: "retinolEquivalent", aliases: ["retinolEquivalent", "shc"], label: "视黄醇当量", unit: "μg" },
  { key: "vitaminA", aliases: ["vitaminA", "VITA_RAE", "wssa"], label: "维生素A", unit: "μg" },
  { key: "vitaminC", aliases: ["vitaminC", "VITC", "wsfc"], label: "维生素C", unit: "mg" },
  { key: "vitaminE", aliases: ["vitaminE", "TOCPHA", "wsse"], label: "维生素E", unit: "mg" }
];
const FOREGROUND_SYNC_INTERVAL_MS = 15000;
const EDGE_SPRING_MAX = 46;
const EDGE_SPRING_RELEASE_MS = 260;
const EDGE_SPRING_SCROLLABLE_SELECTOR = ".community-detail-content, .community-comments-content, .community-comment-list, .ai-summary-content, .policy-content, .privacy-consent-dialog, .feedback-dialog";
const PAGE_GESTURE_MODAL_SELECTOR = ".community-detail-backdrop, .community-comments-backdrop, .ai-summary-backdrop, .replay-modal-backdrop, .consent-backdrop";
const PAGE_GESTURE_BLOCKING_BODY_CLASSES = [
  "community-consent-open",
  "privacy-consent-open",
  "passkey-prompt-open",
  "policy-open",
  "confirmation-open",
  "feedback-open",
  "food-selection-open",
  "manual-food-open",
  "ai-summary-open",
  "community-detail-open",
  "replay-modal-open"
];
const TEXT_LIMITS = {
  mood: 60,
  comment: 120,
  feedback: 500
};
const QQ_LOGIN_RESULT_KEY = "jf_qq_login_result";
const APPLE_LOGIN_RESULT_KEY = "jf_apple_login_result";
const QQ_LOGIN_RESULT_MAX_AGE_MS = 2 * 60 * 1000;

const passkeyDiagnostics = {
  visibilityChanges: 0,
  focusChanges: 0,
  blurChanges: 0
};

const JF = window.JFShared;
const APP_SCRIPT_PATH = JF.currentScriptPath("app.js");
const APP_BASE_PATH = APP_SCRIPT_PATH.replace(/\/app\.js$/, "");
document.documentElement.dataset.environment = APP_BASE_PATH ? "test" : "production";
document.documentElement.dataset.theme = "glass-red-blue";
document.addEventListener("visibilitychange", () => {
  passkeyDiagnostics.visibilityChanges += 1;
}, { passive: true });
window.addEventListener("focus", () => {
  passkeyDiagnostics.focusChanges += 1;
}, { passive: true });
window.addEventListener("blur", () => {
  passkeyDiagnostics.blurChanges += 1;
}, { passive: true });

const softOverlayTimers = new WeakMap();

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hideInitialLoader() {
  if (!els.initialLoader) return;
  els.initialLoader.classList.add("is-hidden");
  window.setTimeout(() => {
    els.initialLoader?.remove();
  }, prefersReducedMotion() ? 0 : 320);
}

window.setTimeout(() => {
  const loader = document.querySelector("#initialLoader:not(.is-hidden)");
  const detail = document.querySelector("#initialLoaderDetail");
  if (!loader || !detail) return;
  detail.textContent = APP_LOCALE_ENGLISH ? "Still connecting. This can take a moment on first launch." : "仍在连接中，首次打开可能需要稍等片刻";
}, 4200);

function showSoftOverlay(overlay) {
  const timer = softOverlayTimers.get(overlay);
  if (timer) {
    window.clearTimeout(timer);
    softOverlayTimers.delete(overlay);
  }
  overlay.classList.remove("hidden");
  overlay.classList.remove("is-open");

  if (prefersReducedMotion()) {
    overlay.classList.add("is-open");
    return;
  }

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => overlay.classList.add("is-open"));
  });
}

function hideSoftOverlay(overlay, onHidden) {
  const timer = softOverlayTimers.get(overlay);
  if (timer) window.clearTimeout(timer);
  overlay.classList.remove("is-open");

  const finish = () => {
    overlay.classList.add("hidden");
    softOverlayTimers.delete(overlay);
    onHidden?.();
  };

  if (prefersReducedMotion()) {
    finish();
  } else {
    softOverlayTimers.set(overlay, window.setTimeout(finish, SOFT_OVERLAY_TRANSITION_MS));
  }
}

function isImageInteractionTarget(target) {
  return JF.isImageInteractionTarget(target);
}

function isTextEditingTarget(target) {
  return target instanceof Element && Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

function appUrl(pathname) {
  return JF.appUrl(APP_BASE_PATH, pathname);
}

function roundedCoordinate(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 100000) / 100000 : null;
}

function readCachedAiEnvironment() {
  const cached = state.environmentContext;
  if (cached && Date.now() - state.environmentContextAt < AI_ENVIRONMENT_CACHE_MS) {
    return cached;
  }
  try {
    const stored = JSON.parse(window.localStorage.getItem(AI_ENVIRONMENT_STORAGE_KEY) || "null");
    if (stored?.capturedAt && Date.now() - Date.parse(stored.capturedAt) < AI_ENVIRONMENT_CACHE_MS) {
      state.environmentContext = stored;
      state.environmentContextAt = Date.parse(stored.capturedAt);
      return stored;
    }
  } catch {
    // Ignore unavailable or malformed browser storage.
  }
  return null;
}

function cacheAiEnvironment(context) {
  if (!context || typeof context !== "object") return context;
  state.environmentContext = context;
  state.environmentContextAt = Date.now();
  try {
    window.localStorage.setItem(AI_ENVIRONMENT_STORAGE_KEY, JSON.stringify(context));
  } catch {
    // Storage can be disabled; AI still works without a cache.
  }
  return context;
}

function baseAiEnvironmentContext(status = "unavailable") {
  return {
    status,
    capturedAt: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    locale: navigator.language || "",
    location: null
  };
}

function nativeLocationBridge() {
  const bridge = window.WellEchoNative?.location;
  if (!bridge || typeof bridge.getCurrentPosition !== "function") {
    return null;
  }
  return bridge;
}

function getBrowserPosition() {
  const bridge = nativeLocationBridge();
  if (bridge) {
    return bridge.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 5500,
      maximumAge: AI_ENVIRONMENT_CACHE_MS
    });
  }
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 5500,
      maximumAge: AI_ENVIRONMENT_CACHE_MS
    });
  });
}

async function getAiEnvironmentContext({ preferCache = true } = {}) {
  if (preferCache) {
    const cached = readCachedAiEnvironment();
    if (cached) return cached;
  }
  if (!nativeLocationBridge() && (!window.isSecureContext || !navigator.geolocation)) {
    return baseAiEnvironmentContext("unsupported");
  }
  if (state.environmentContextPromise) {
    return state.environmentContextPromise;
  }

  state.environmentContextPromise = (async () => {
    try {
      const nativeLocation = nativeLocationBridge();
      if (!nativeLocation && (!window.isSecureContext || !navigator.geolocation)) {
        return cacheAiEnvironment(baseAiEnvironmentContext("unsupported"));
      }
      if (!nativeLocation) {
        const permission = await navigator.permissions?.query?.({ name: "geolocation" }).catch(() => null);
        if (permission?.state === "denied") {
          return cacheAiEnvironment(baseAiEnvironmentContext("denied"));
        }
      }
      const position = await getBrowserPosition();
      const coords = position.coords || {};
      const context = {
        status: "ok",
        capturedAt: new Date(position.timestamp || Date.now()).toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
        locale: navigator.language || "",
        location: {
          latitude: roundedCoordinate(coords.latitude),
          longitude: roundedCoordinate(coords.longitude),
          accuracyMeters: Number.isFinite(coords.accuracy) ? Math.round(coords.accuracy) : null
        }
      };
      if (context.location.latitude === null || context.location.longitude === null) {
        return cacheAiEnvironment(baseAiEnvironmentContext("unavailable"));
      }
      return cacheAiEnvironment(context);
    } catch (error) {
      const status = error?.code === 1 || error?.name === "NotAllowedError"
        ? "denied"
        : error?.code === 3
          ? "timeout"
          : "unavailable";
      return cacheAiEnvironment(baseAiEnvironmentContext(status));
    } finally {
      state.environmentContextPromise = null;
    }
  })();
  return state.environmentContextPromise;
}

function aiEnvironmentHeader(context) {
  if (!context || typeof context !== "object") return "";
  try {
    return encodeURIComponent(JSON.stringify(context));
  } catch {
    return "";
  }
}

const MEDIAPIPE_IMPORT_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/+esm";
const MEDIAPIPE_WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const FACE_MODEL_LOCAL_URL = appUrl("/models/face_landmarker.task");
const FACE_MODEL_CDN_VERSION = "20260626-face-unified1";
const FACE_MODEL_CDN_BASE = document.querySelector('meta[name="wellecho-model-assets"]')?.content?.trim().replace(/\/+$/g, "") || "";
const FACE_MODEL_CDN_URL = FACE_MODEL_CDN_BASE
  ? `${FACE_MODEL_CDN_BASE}/face_landmarker.task?v=${FACE_MODEL_CDN_VERSION}`
  : "";
const FACE_MODEL_IMPORT_TIMEOUT_MS = 30000;
const FACE_MODEL_WASM_TIMEOUT_MS = 30000;
const FACE_MODEL_DOWNLOAD_TIMEOUT_MS = 35000;
const FACE_MODEL_CREATE_TIMEOUT_MS = 35000;
const FACE_MODEL_MIN_BYTES = 1024 * 1024;
const FACE_MODEL_CACHE_NAME = `wellecho-face-model-${FACE_MODEL_CDN_VERSION}`;

function isWellEchoNativeShell() {
  return Boolean(
    window.__WELLECHO_NATIVE_SHELL__ === true
    || window.WellEchoNative?.__native
    || window.webkit?.messageHandlers?.WellEchoNative
    || /\bWellEcho\b/i.test(navigator.userAgent || "")
  );
}

const FACE_MODEL_URLS = [
  ...new Set([FACE_MODEL_CDN_URL, FACE_MODEL_LOCAL_URL].filter(Boolean))
];

function faceModelUrlsForCurrentRuntime() {
  const urls = isWellEchoNativeShell()
    ? [FACE_MODEL_LOCAL_URL, FACE_MODEL_CDN_URL]
    : [FACE_MODEL_CDN_URL, FACE_MODEL_LOCAL_URL];
  return [...new Set(urls.filter(Boolean))];
}

const els = {
  initialLoader: document.querySelector("#initialLoader"),
  appShell: document.querySelector(".app-shell"),
  loginView: document.querySelector("#loginView"),
  dashboardView: document.querySelector("#dashboardView"),
  communityView: document.querySelector("#communityView"),
  settingsView: document.querySelector("#settingsView"),
  captureView: document.querySelector("#captureView"),
  loginForm: document.querySelector("#loginForm"),
  appleLoginButton: document.querySelector("#appleLoginButton"),
  qqLoginButton: document.querySelector("#qqLoginButton"),
  passkeyLoginButton: document.querySelector("#passkeyLoginButton"),
  codeInput: document.querySelector("#codeInput"),
  loginMessage: document.querySelector("#loginMessage"),
  profileAvatar: document.querySelector("#profileAvatar"),
  profileName: document.querySelector("#profileName"),
  profileTitle: document.querySelector("#profileTitle"),
  profileTitleSuffix: document.querySelector("#profileTitleSuffix"),
  testLoginButton: document.querySelector("#testLoginButton"),
  settingsLogoutButton: document.querySelector("#settingsLogoutButton"),
  settingsOverviewPanel: document.querySelector("#settingsOverviewPanel"),
  accountProfilePanel: document.querySelector("#accountProfilePanel"),
  accountBindingsPanel: document.querySelector("#accountBindingsPanel"),
  privacySettingsPanel: document.querySelector("#privacySettingsPanel"),
  accountDeletionPanel: document.querySelector("#accountDeletionPanel"),
  accountProfileOption: document.querySelector("#accountProfileOption"),
  accountBindingsOption: document.querySelector("#accountBindingsOption"),
  privacySettingsOption: document.querySelector("#privacySettingsOption"),
  passkeySettingsOption: document.querySelector("#passkeySettingsOption"),
  accountDeletionOption: document.querySelector("#accountDeletionOption"),
  feedbackOption: document.querySelector("#feedbackOption"),
  passkeySettingsPanel: document.querySelector("#passkeySettingsPanel"),
  settingsBackButtons: [...document.querySelectorAll("[data-settings-panel]")],
  bottomTabs: document.querySelector("#bottomTabs"),
  personalTabButton: document.querySelector("#personalTabButton"),
  communityTabButton: document.querySelector("#communityTabButton"),
  settingsTabButton: document.querySelector("#settingsTabButton"),
  communityShareToggle: document.querySelector("#communityShareToggle"),
  communityShareStatus: document.querySelector("#communityShareStatus"),
  communityShareCopy: document.querySelector("#communityShareCopy"),
  communityGrid: document.querySelector("#communityGrid"),
  communityMeta: document.querySelector("#communityMeta"),
  communityMessage: document.querySelector("#communityMessage"),
  communityRankingList: document.querySelector("#communityRankingList"),
  rankingPeriods: [...document.querySelectorAll(".ranking-period")],
  communityConsentModal: document.querySelector("#communityConsentModal"),
  declineCommunityShareButton: document.querySelector("#declineCommunityShareButton"),
  acceptCommunityShareButton: document.querySelector("#acceptCommunityShareButton"),
  privacyConsentModal: document.querySelector("#privacyConsentModal"),
  privacyConsentTitle: document.querySelector("#privacyConsentTitle"),
  privacyConsentDescription: document.querySelector("#privacyConsentDescription"),
  privacyHighlights: document.querySelector("#privacyHighlights"),
  fullConsentFields: document.querySelector("#fullConsentFields"),
  agreementConsentCheck: document.querySelector("#agreementConsentCheck"),
  sensitiveConsentCheck: document.querySelector("#sensitiveConsentCheck"),
  privacyConsentMessage: document.querySelector("#privacyConsentMessage"),
  chooseBasicModeButton: document.querySelector("#chooseBasicModeButton"),
  acceptFullModeButton: document.querySelector("#acceptFullModeButton"),
  passkeyPromptModal: document.querySelector("#passkeyPromptModal"),
  passkeyPromptMessage: document.querySelector("#passkeyPromptMessage"),
  dismissPasskeyPromptButton: document.querySelector("#dismissPasskeyPromptButton"),
  startPasskeyPromptButton: document.querySelector("#startPasskeyPromptButton"),
  settingsAccountAvatar: document.querySelector("#settingsAccountAvatar"),
  settingsAccountLabel: document.querySelector("#settingsAccountLabel"),
  settingsQqBinding: document.querySelector("#settingsQqBinding"),
  accountProfileAvatar: document.querySelector("#accountProfileAvatar"),
  accountProfileName: document.querySelector("#accountProfileName"),
  accountProfileBinding: document.querySelector("#accountProfileBinding"),
  accountProfileSummary: document.querySelector("#accountProfileSummary"),
  accountProfileBadge: document.querySelector("#accountProfileBadge"),
  accountBindingsSummary: document.querySelector("#accountBindingsSummary"),
  accountBindingsBadge: document.querySelector("#accountBindingsBadge"),
  appleBindingState: document.querySelector("#appleBindingState"),
  appleBindingHint: document.querySelector("#appleBindingHint"),
  bindAppleAccountButton: document.querySelector("#bindAppleAccountButton"),
  qqBindingState: document.querySelector("#qqBindingState"),
  qqBindingHint: document.querySelector("#qqBindingHint"),
  bindQqAccountButton: document.querySelector("#bindQqAccountButton"),
  accountProfileReadonly: document.querySelector("#accountProfileReadonly"),
  accountProfileForm: document.querySelector("#accountProfileForm"),
  profileGenderText: document.querySelector("#profileGenderText"),
  profileBirthdayText: document.querySelector("#profileBirthdayText"),
  profileGenderButtons: [...document.querySelectorAll("[data-profile-gender]")],
  profileBirthdayToggle: document.querySelector("#profileBirthdayToggle"),
  profileBirthdayPicker: document.querySelector("#profileBirthdayPicker"),
  profileBirthdayDraftText: document.querySelector("#profileBirthdayDraftText"),
  profileBirthdayYear: document.querySelector("#profileBirthdayYear"),
  profileBirthdayMonth: document.querySelector("#profileBirthdayMonth"),
  profileBirthdayDay: document.querySelector("#profileBirthdayDay"),
  profileBirthdayClearButton: document.querySelector("#profileBirthdayClearButton"),
  profileBirthdayDoneButton: document.querySelector("#profileBirthdayDoneButton"),
  editProfileButton: document.querySelector("#editProfileButton"),
  cancelProfileEditButton: document.querySelector("#cancelProfileEditButton"),
  saveProfileButton: document.querySelector("#saveProfileButton"),
  profileSettingsMessage: document.querySelector("#profileSettingsMessage"),
  accountStatusNotice: document.querySelector("#accountStatusNotice"),
  syncQqProfileButton: document.querySelector("#syncQqProfileButton"),
  qqSyncMessage: document.querySelector("#qqSyncMessage"),
  settingsModeBadge: document.querySelector("#settingsModeBadge"),
  privacySignatureStatus: document.querySelector("#privacySignatureStatus"),
  privacySettingsSummary: document.querySelector("#privacySettingsSummary"),
  passkeySettingsStatus: document.querySelector("#passkeySettingsStatus"),
  passkeySettingsSummary: document.querySelector("#passkeySettingsSummary"),
  passkeyDetailBadge: document.querySelector("#passkeyDetailBadge"),
  passkeyStatusDescription: document.querySelector("#passkeyStatusDescription"),
  passkeyBindingState: document.querySelector("#passkeyBindingState"),
  passkeyBindingHint: document.querySelector("#passkeyBindingHint"),
  addPasskeyButton: document.querySelector("#addPasskeyButton"),
  passkeyList: document.querySelector("#passkeyList"),
  passkeySettingsMessage: document.querySelector("#passkeySettingsMessage"),
  nativeHealthStatus: document.querySelector("#nativeHealthStatus"),
  nativeHealthDescription: document.querySelector("#nativeHealthDescription"),
  nativeHealthSyncOption: document.querySelector("#nativeHealthSyncOption"),
  readNativeHealthTodayButton: document.querySelector("#readNativeHealthTodayButton"),
  readNativeHealthRecentButton: document.querySelector("#readNativeHealthRecentButton"),
  nativeHealthSummary: document.querySelector("#nativeHealthSummary"),
  nativeHealthJson: document.querySelector("#nativeHealthJson"),
  privacyStatusDescription: document.querySelector("#privacyStatusDescription"),
  fullModeButton: document.querySelector("#fullModeButton"),
  basicModeButton: document.querySelector("#basicModeButton"),
  privacyAuditSummary: document.querySelector("#privacyAuditSummary"),
  withdrawConsentButton: document.querySelector("#withdrawConsentButton"),
  settingsMessage: document.querySelector("#settingsMessage"),
  policyModal: document.querySelector("#policyModal"),
  policyTitle: document.querySelector("#policyTitle"),
  policyContent: document.querySelector("#policyContent"),
  closePolicyButton: document.querySelector("#closePolicyButton"),
  privacyPolicyTemplate: document.querySelector("#privacyPolicyTemplate"),
  userAgreementTemplate: document.querySelector("#userAgreementTemplate"),
  withdrawConsentModal: document.querySelector("#withdrawConsentModal"),
  withdrawConsentForm: document.querySelector("#withdrawConsentForm"),
  withdrawConsentInput: document.querySelector("#withdrawConsentInput"),
  withdrawConsentMessage: document.querySelector("#withdrawConsentMessage"),
  cancelWithdrawConsentButton: document.querySelector("#cancelWithdrawConsentButton"),
  deleteOwnAccountButton: document.querySelector("#deleteOwnAccountButton"),
  deleteOwnAccountModal: document.querySelector("#deleteOwnAccountModal"),
  deleteOwnAccountForm: document.querySelector("#deleteOwnAccountForm"),
  deleteOwnAccountPhrase: document.querySelector("#deleteOwnAccountPhrase"),
  deleteOwnAccountCopyButton: document.querySelector("#deleteOwnAccountCopyButton"),
  deleteOwnAccountInput: document.querySelector("#deleteOwnAccountInput"),
  deleteOwnAccountMessage: document.querySelector("#deleteOwnAccountMessage"),
  cancelDeleteOwnAccountButton: document.querySelector("#cancelDeleteOwnAccountButton"),
  feedbackModal: document.querySelector("#feedbackModal"),
  feedbackForm: document.querySelector("#feedbackForm"),
  feedbackKicker: document.querySelector("#feedbackKicker"),
  feedbackTitle: document.querySelector("#feedbackTitle"),
  feedbackDescription: document.querySelector("#feedbackDescription"),
  feedbackCategory: document.querySelector("#feedbackCategory"),
  feedbackText: document.querySelector("#feedbackText"),
  feedbackImagesInput: document.querySelector("#feedbackImagesInput"),
  feedbackImageAddButton: document.querySelector("#feedbackImageAddButton"),
  feedbackImagePreviewList: document.querySelector("#feedbackImagePreviewList"),
  feedbackImageMeta: document.querySelector("#feedbackImageMeta"),
  feedbackMessage: document.querySelector("#feedbackMessage"),
  cancelFeedbackButton: document.querySelector("#cancelFeedbackButton"),
  submitFeedbackButton: document.querySelector("#submitFeedbackButton"),
  communityDetailModal: document.querySelector("#communityDetailModal"),
  communityDetailContent: document.querySelector("#communityDetailContent"),
  communityDetailAvatar: document.querySelector("#communityDetailAvatar"),
  communityDetailTitle: document.querySelector("#communityDetailTitle"),
  closeCommunityDetailButton: document.querySelector("#closeCommunityDetailButton"),
  communityCommentsModal: document.querySelector("#communityCommentsModal"),
  communityCommentsContent: document.querySelector("#communityCommentsContent"),
  closeCommunityCommentsButton: document.querySelector("#closeCommunityCommentsButton"),
  communityFeedTabButton: document.querySelector("#communityFeedTabButton"),
  communityRankingTabButton: document.querySelector("#communityRankingTabButton"),
  communityFeedPanel: document.querySelector("#communityFeedPanel"),
  communityRankingPanel: document.querySelector("#communityRankingPanel"),
  replayModal: document.querySelector("#replayModal"),
  replayModalPanel: document.querySelector("#replayModalPanel"),
  replayFrame: document.querySelector("#replayFrame"),
  aiAdviceButton: document.querySelector("#aiAdviceButton"),
  aiSummaryModal: document.querySelector("#aiSummaryModal"),
  aiSummaryContent: document.querySelector("#aiSummaryContent"),
  aiSummaryStatus: document.querySelector("#aiSummaryStatus"),
  aiSummaryOutput: document.querySelector("#aiSummaryOutput"),
  closeAiSummaryButton: document.querySelector("#closeAiSummaryButton"),
  startBodyRecordButton: document.querySelector("#startBodyRecordButton"),
  startFoodRecordButton: document.querySelector("#startFoodRecordButton"),
  backToDashboardButton: document.querySelector("#backToDashboardButton"),
  captureKicker: document.querySelector("#captureKicker"),
  captureTitle: document.querySelector("#captureTitle"),
  captureModeButtons: [...document.querySelectorAll("[data-capture-mode]")],
  cameraStage: document.querySelector("#cameraStage"),
  switchCameraButton: document.querySelector("#switchCameraButton"),
  captureButton: document.querySelector("#captureButton"),
  retakeButton: document.querySelector("#retakeButton"),
  cameraVideo: document.querySelector("#cameraVideo"),
  emptyCamera: document.querySelector("#emptyCamera"),
  cameraHint: document.querySelector("#cameraHint"),
  photoPreview: document.querySelector("#photoPreview"),
  captureCanvas: document.querySelector("#captureCanvas"),
  analysisCanvas: document.querySelector("#analysisCanvas"),
  recordForm: document.querySelector("#recordForm"),
  weightInput: document.querySelector("#weightInput"),
  moodInput: document.querySelector("#moodInput"),
  bodyMoodAiButton: document.querySelector("#bodyMoodAiButton"),
  recordMessage: document.querySelector("#recordMessage"),
  foodRecordPanel: document.querySelector("#foodRecordPanel"),
  foodMoodInput: document.querySelector("#foodMoodInput"),
  foodMoodAiButton: document.querySelector("#foodMoodAiButton"),
  foodPhotoStack: document.querySelector("#foodPhotoStack"),
  foodResultMeta: document.querySelector("#foodResultMeta"),
  foodResultList: document.querySelector("#foodResultList"),
  foodSelectionModal: document.querySelector("#foodSelectionModal"),
  foodSelectionTitle: document.querySelector("#foodSelectionTitle"),
  foodSelectionCopy: document.querySelector("#foodSelectionCopy"),
  foodSelectionList: document.querySelector("#foodSelectionList"),
  foodSelectionSummary: document.querySelector("#foodSelectionSummary"),
  foodSelectionMessage: document.querySelector("#foodSelectionMessage"),
  addManualFoodButton: document.querySelector("#addManualFoodButton"),
  closeFoodSelectionButton: document.querySelector("#closeFoodSelectionButton"),
  cancelFoodSelectionButton: document.querySelector("#cancelFoodSelectionButton"),
  applyFoodSelectionButton: document.querySelector("#applyFoodSelectionButton"),
  manualFoodModal: document.querySelector("#manualFoodModal"),
  manualFoodForm: document.querySelector("#manualFoodForm"),
  manualFoodNameInput: document.querySelector("#manualFoodNameInput"),
  manualFoodMessage: document.querySelector("#manualFoodMessage"),
  cancelManualFoodButton: document.querySelector("#cancelManualFoodButton"),
  submitManualFoodButton: document.querySelector("#submitManualFoodButton"),
  saveFoodRecordButton: document.querySelector("#saveFoodRecordButton"),
  replayButton: document.querySelector("#replayButton"),
  weightChart: document.querySelector("#weightChart"),
  weightCalendar: document.querySelector("#weightCalendar"),
  historyList: document.querySelector("#historyList"),
  historyMeta: document.querySelector("#historyMeta"),
  historyToggleButton: document.querySelector("#historyToggleButton"),
  historyLoader: document.querySelector("#historyLoader"),
  historySentinel: document.querySelector("#historySentinel"),
  pullRefresh: document.querySelector("#pullRefresh"),
  pullRefreshText: document.querySelector("#pullRefreshText")
};

applyLocaleCopy();

const dateTimeFormat = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
});

const communityDateFormat = new Intl.DateTimeFormat("zh-CN", {
  month: "numeric",
  day: "numeric"
});

const communityCardDateTimeFormat = new Intl.DateTimeFormat("zh-CN", {
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});

const communityCommentDateFormat = new Intl.DateTimeFormat("zh-CN", {
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit"
});

function setMessage(element, text, type = "") {
  element.textContent = text;
  element.className = `form-message ${type}`.trim();
}

function consumeQqLoginStatusFromUrl() {
  const url = new URL(window.location.href);
  const status = url.searchParams.get("qq");
  if (!status) return "";
  url.searchParams.delete("qq");
  window.history.replaceState({}, "", url);
  return status;
}

function consumeAppleLoginStatusFromUrl() {
  const url = new URL(window.location.href);
  const status = url.searchParams.get("apple");
  if (!status) return "";
  url.searchParams.delete("apple");
  window.history.replaceState({}, "", url);
  return status;
}

function showQqLoginStatus(status) {
  if (!status) return;
  const messages = {
    ok: ["QQ 登录成功，正在进入...", "success"],
    "sync-ok": ["QQ 资料已同步。", "success"],
    "bind-ok": ["QQ 已绑定。", "success"],
    "bind-unavailable": ["请先登录后再绑定 QQ。", "error"],
    "bind-conflict": ["这个 QQ 已绑定到其他账户，不能重复绑定。", "error"],
    "bind-denied": ["QQ 绑定已取消，请重新尝试。", "error"],
    "bind-state": ["QQ 绑定状态已失效，请重新点击绑定。", "error"],
    "bind-error": ["QQ 绑定失败，请稍后再试。", "error"],
    "sync-unavailable": ["当前账户未绑定 QQ，暂不能同步资料。", "error"],
    "sync-mismatch": ["授权的 QQ 与当前账户不一致，未同步资料。", "error"],
    "sync-denied": ["QQ 资料同步已取消，请重新尝试。", "error"],
    "sync-state": ["QQ 同步状态已失效，请重新点击同步。", "error"],
    "sync-error": ["QQ 资料同步失败，请稍后再试。", "error"],
    setup: ["QQ 登录环境已就绪，等待 QQ 互联 AppID 和 AppKey 配置后启用授权登录。", ""],
    capacity: ["当前服务器容量接近上限，暂时不能注册新用户。已有账户可继续登录。", "error"],
    callback: ["QQ 登录没有返回授权码，请检查 QQ 互联回调地址是否填写完整。", "error"],
    denied: ["QQ 登录已取消或未通过授权，请重新尝试。", "error"],
    state: ["QQ 登录状态已失效，请从本站登录页重新点击 qq登录。", "error"],
    error: ["QQ 登录授权未完成，请稍后再试。", "error"]
  };
  const [message, type] = messages[status] || ["QQ 登录状态未知，请重新点击 qq登录。", ""];
  setMessage(els.loginMessage, message, type);
}

function showAppleLoginStatus(status) {
  if (!status) return;
  const messages = {
    ok: ["Apple 登录成功，正在进入...", "success"],
    "bind-ok": ["Apple ID 已绑定。", "success"],
    "bind-unavailable": ["请先登录后再绑定 Apple ID。", "error"],
    "bind-conflict": ["这个 Apple ID 已绑定到其他账户，不能重复绑定。", "error"],
    "bind-denied": ["Apple 绑定已取消，请重新尝试。", "error"],
    "bind-state": ["Apple 绑定状态已失效，请重新点击绑定。", "error"],
    "bind-error": ["Apple 绑定失败，请稍后再试。", "error"],
    setup: ["Apple 网页登录尚未完成服务端配置。", ""],
    capacity: ["当前服务器容量接近上限，暂时不能注册新用户。已有账户可继续登录。", "error"],
    callback: ["Apple 登录没有返回授权码，请检查 Apple 回调地址配置。", "error"],
    denied: ["Apple 登录已取消或未通过授权，请重新尝试。", "error"],
    state: ["Apple 登录状态已失效，请从本站登录页重新点击 Apple 登录。", "error"],
    error: ["Apple 登录授权未完成，请稍后再试。", "error"]
  };
  const [message, type] = messages[status] || ["Apple 登录状态未知，请重新点击 Apple 登录。", ""];
  setMessage(els.loginMessage, message, type);
}

function isQqSyncStatus(status) {
  return String(status || "").startsWith("sync-");
}

function isBindStatus(status) {
  return String(status || "").startsWith("bind-");
}

function setQqSyncMessage(text, type = "") {
  if (!els.qqSyncMessage) return;
  els.qqSyncMessage.textContent = text;
  els.qqSyncMessage.dataset.type = type;
}

function setProfileSettingsMessage(text, type = "") {
  if (!els.profileSettingsMessage) return;
  els.profileSettingsMessage.textContent = text;
  els.profileSettingsMessage.dataset.type = type;
}

function showQqLoginStatusFromUrl() {
  showQqLoginStatus(consumeQqLoginStatusFromUrl());
}

function showAppleLoginStatusFromUrl() {
  showAppleLoginStatus(consumeAppleLoginStatusFromUrl());
}

function isMobileQqAuthContext() {
  const ua = navigator.userAgent || "";
  return /iPhone|iPad|iPod|Android|Mobile|OpenHarmony|HarmonyOS|ArkWeb/i.test(ua)
    || (window.matchMedia("(pointer: coarse)").matches && Math.min(window.innerWidth, window.innerHeight) <= 900);
}

function qqLoginStartUrl({ popup = false, sync = false, bind = false, mobile = false } = {}) {
  const url = new URL(appUrl("/api/auth/qq/start"), window.location.origin);
  if (popup) {
    url.searchParams.set("popup", "1");
  }
  if (sync) {
    url.searchParams.set("sync", "1");
  }
  if (bind) {
    url.searchParams.set("bind", "1");
  }
  if (mobile) {
    url.searchParams.set("mobile", "1");
  }
  return url.href;
}

function appleLoginStartUrl({ popup = false, bind = false } = {}) {
  const url = new URL(appUrl("/api/auth/apple/start"), window.location.origin);
  if (popup) {
    url.searchParams.set("popup", "1");
  }
  if (bind) {
    url.searchParams.set("bind", "1");
  }
  return url.href;
}

function qqAuthorizationPopupFeatures() {
  const width = Math.min(520, Math.max(360, Math.round(window.innerWidth * 0.92)));
  const height = Math.min(720, Math.max(560, Math.round(window.innerHeight * 0.86)));
  const left = Math.max(0, Math.round((window.screen.width - width) / 2));
  const top = Math.max(0, Math.round((window.screen.height - height) / 2));
  return `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;
}

function openAppleAuthorizationPopup({ bind = false } = {}) {
  const popup = window.open(appleLoginStartUrl({ popup: true, bind }), "apple_login", qqAuthorizationPopupFeatures());
  if (popup) {
    state.appleLoginWindow = popup;
    try {
      popup.focus();
    } catch {}
  }
  return popup;
}

function openQqAuthorizationPopup({ sync = false, bind = false, mobile = false } = {}) {
  const popup = window.open(qqLoginStartUrl({ popup: true, sync, bind, mobile }), "qq_login", qqAuthorizationPopupFeatures());
  if (popup) {
    state.qqLoginWindow = popup;
    try {
      popup.focus();
    } catch {}
  }
  return popup;
}

function watchQqProfileSyncPopup(popup) {
  const timer = window.setInterval(() => {
    if (!state.qqProfileSyncing || state.qqLoginWindow !== popup) {
      window.clearInterval(timer);
      return;
    }

    try {
      if (!popup.closed) return;
    } catch {
      return;
    }

    window.clearInterval(timer);
    state.qqLoginWindow = null;
    state.qqProfileSyncing = false;
    renderSettings();
    setQqSyncMessage("QQ 同步窗口已关闭，未完成同步。", "");
  }, 700);
}

function watchAccountBindingPopup(popup, provider) {
  const label = provider === "apple" ? "Apple" : "QQ";
  const timer = window.setInterval(() => {
    if (state.accountBindingLoading !== provider) {
      window.clearInterval(timer);
      return;
    }
    try {
      if (!popup.closed) return;
    } catch {
      return;
    }
    window.clearInterval(timer);
    if (provider === "apple") {
      state.appleLoginWindow = null;
    } else {
      state.qqLoginWindow = null;
    }
    state.accountBindingLoading = "";
    renderSettings();
    setQqSyncMessage(`${label} 授权窗口已关闭，未完成绑定。`, "");
  }, 700);
}

function closeQqLoginWindow() {
  try {
    if (state.qqLoginWindow && !state.qqLoginWindow.closed) {
      state.qqLoginWindow.close();
    }
  } catch {
    // 有些移动浏览器会拒绝脚本访问授权窗口，忽略即可。
  }
  state.qqLoginWindow = null;
}

function closeAppleLoginWindow() {
  try {
    if (state.appleLoginWindow && !state.appleLoginWindow.closed) {
      state.appleLoginWindow.close();
    }
  } catch {}
  state.appleLoginWindow = null;
}

function postNativeSessionEvent(action, payload = {}) {
  const bridge = window.WellEchoNative?.session;
  if (bridge && typeof bridge.post === "function") {
    try {
      bridge.post({ action, payload, at: new Date().toISOString() });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

async function handleQqLoginResult(status) {
  const normalized = String(status || "");
  if (!normalized) return;
  const now = Date.now();
  if (now - state.qqLoginSettledAt < 700) return;
  state.qqLoginSettledAt = now;
  closeQqLoginWindow();

  if (isBindStatus(normalized)) {
    state.accountBindingLoading = "";
    const messages = {
      "bind-unavailable": ["请先登录后再绑定 QQ。", "error"],
      "bind-conflict": ["这个 QQ 已绑定到其他账户，不能重复绑定。", "error"],
      "bind-denied": ["QQ 绑定已取消，请重新尝试。", "error"],
      "bind-state": ["QQ 绑定状态已失效，请重新点击绑定。", "error"],
      "bind-error": ["QQ 绑定失败，请稍后再试。", "error"]
    };
    if (normalized !== "bind-ok") {
      const [message, type] = messages[normalized] || ["QQ 绑定未完成，请重新尝试。", "error"];
      if (state.profile) {
        renderSettings();
        setQqSyncMessage(message, type);
      } else {
        showLogin();
        showQqLoginStatus(normalized);
      }
      return;
    }
    setQqSyncMessage("QQ 已绑定到当前档案。", "success");
    try {
      const data = await api("/api/me");
      state.profile = data.profile;
      state.community = null;
      await showSettingsView(state.profile, true, "bindings");
      setQqSyncMessage("QQ 已绑定到当前档案。", "success");
    } catch {
      renderSettings();
      setQqSyncMessage("绑定成功，本页刷新失败，请稍后手动刷新。", "error");
    }
    return;
  }

  if (isQqSyncStatus(normalized)) {
    const messages = {
      "sync-unavailable": ["当前账户未绑定 QQ，暂不能同步资料。", "error"],
      "sync-mismatch": ["授权的 QQ 与当前账户不一致，未同步资料。", "error"],
      "sync-denied": ["QQ 资料同步已取消，请重新尝试。", "error"],
      "sync-state": ["QQ 同步状态已失效，请重新点击同步。", "error"],
      "sync-error": ["QQ 资料同步失败，请稍后再试。", "error"]
    };
    state.qqProfileSyncing = false;

    if (normalized !== "sync-ok") {
      const [message, type] = messages[normalized] || ["QQ 资料同步未完成，请重新尝试。", "error"];
      if (state.profile) {
        renderSettings();
        setQqSyncMessage(message, type);
      } else {
        showLogin();
        showQqLoginStatus(normalized);
      }
      return;
    }

    setQqSyncMessage("QQ 头像和昵称已同步。", "success");
    try {
      const data = await api("/api/me");
      state.profile = data.profile;
      state.community = null;
      await showSettingsView(state.profile, true, "bindings");
      setQqSyncMessage("QQ 头像和昵称已同步。", "success");
    } catch {
      if (state.profile) {
        renderSettings();
        setQqSyncMessage("资料已同步，本页刷新失败，请稍后手动刷新。", "error");
      } else {
        showLogin();
        showQqLoginStatus("sync-ok");
      }
    }
    return;
  }

  if (normalized !== "ok") {
    showLogin();
    showQqLoginStatus(normalized);
    return;
  }

  setMessage(els.loginMessage, "QQ 登录成功，正在进入...", "success");
  try {
    const data = await api("/api/me");
    await routeAfterAuthentication(data.profile, false);
    queuePasskeyPromptIfNeeded(data.profile);
  } catch {
    showLogin();
    showQqLoginStatus("ok");
  }
}

async function handleAppleLoginResult(status) {
  const normalized = String(status || "");
  if (!normalized) return;
  const now = Date.now();
  if (now - state.appleLoginSettledAt < 700) return;
  state.appleLoginSettledAt = now;
  closeAppleLoginWindow();

  if (isBindStatus(normalized)) {
    state.accountBindingLoading = "";
    const messages = {
      "bind-unavailable": ["请先登录后再绑定 Apple ID。", "error"],
      "bind-conflict": ["这个 Apple ID 已绑定到其他账户，不能重复绑定。", "error"],
      "bind-denied": ["Apple 绑定已取消，请重新尝试。", "error"],
      "bind-state": ["Apple 绑定状态已失效，请重新点击绑定。", "error"],
      "bind-error": ["Apple 绑定失败，请稍后再试。", "error"]
    };
    if (normalized !== "bind-ok") {
      const [message, type] = messages[normalized] || ["Apple 绑定未完成，请重新尝试。", "error"];
      if (state.profile) {
        renderSettings();
        setQqSyncMessage(message, type);
      } else {
        showLogin();
        showAppleLoginStatus(normalized);
      }
      return;
    }
    setQqSyncMessage("Apple ID 已绑定到当前档案。", "success");
    try {
      const data = await api("/api/me");
      state.profile = data.profile;
      state.community = null;
      await showSettingsView(state.profile, true, "bindings");
      setQqSyncMessage("Apple ID 已绑定到当前档案。", "success");
    } catch {
      renderSettings();
      setQqSyncMessage("绑定成功，本页刷新失败，请稍后手动刷新。", "error");
    }
    return;
  }

  if (normalized !== "ok") {
    showLogin();
    showAppleLoginStatus(normalized);
    return;
  }

  setMessage(els.loginMessage, "Apple 登录成功，正在进入...", "success");
  try {
    const data = await api("/api/me");
    await routeAfterAuthentication(data.profile, false);
    queuePasskeyPromptIfNeeded(data.profile);
  } catch {
    showLogin();
    showAppleLoginStatus("ok");
  }
}

function parseQqLoginResult(value) {
  try {
    const data = JSON.parse(String(value || ""));
    if (data?.type !== "qq-login-result") return null;
    if (!data.status || !Number.isFinite(Number(data.at))) return null;
    if (Date.now() - Number(data.at) > QQ_LOGIN_RESULT_MAX_AGE_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function parseAppleLoginResult(value) {
  try {
    const data = JSON.parse(String(value || ""));
    if (data?.type !== "apple-login-result") return null;
    if (!data.status || !Number.isFinite(Number(data.at))) return null;
    if (Date.now() - Number(data.at) > QQ_LOGIN_RESULT_MAX_AGE_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function consumeStoredQqLoginResult() {
  let result = null;
  try {
    result = parseQqLoginResult(window.localStorage.getItem(QQ_LOGIN_RESULT_KEY));
    if (result) {
      window.localStorage.removeItem(QQ_LOGIN_RESULT_KEY);
    }
  } catch {
    result = null;
  }
  if (result) {
    handleQqLoginResult(result.status);
  }
}

function consumeStoredAppleLoginResult() {
  let result = null;
  try {
    result = parseAppleLoginResult(window.localStorage.getItem(APPLE_LOGIN_RESULT_KEY));
    if (result) {
      window.localStorage.removeItem(APPLE_LOGIN_RESULT_KEY);
    }
  } catch {
    result = null;
  }
  if (result) {
    handleAppleLoginResult(result.status);
  }
}

function startQqLogin(event) {
  event.preventDefault();
  event.currentTarget?.blur();
  window.setTimeout(() => event.currentTarget?.blur(), 0);
  setMessage(els.loginMessage, "正在打开 QQ 授权...", "");
  if (isMobileQqAuthContext()) {
    window.location.href = qqLoginStartUrl({ mobile: true });
    return;
  }

  const popup = openQqAuthorizationPopup();
  if (!popup) {
    window.location.href = qqLoginStartUrl();
    return;
  }
  setMessage(els.loginMessage, "请在 QQ 授权窗口完成登录。", "");
}

function startAppleLogin(event) {
  event.preventDefault();
  event.currentTarget?.blur();
  window.setTimeout(() => event.currentTarget?.blur(), 0);
  setMessage(els.loginMessage, "正在打开 Apple 授权...", "");
  if (isMobileQqAuthContext()) {
    window.location.href = appleLoginStartUrl();
    return;
  }

  const popup = openAppleAuthorizationPopup();
  if (!popup) {
    window.location.href = appleLoginStartUrl();
    return;
  }
  setMessage(els.loginMessage, "请在 Apple 授权窗口完成登录。", "");
}

function testLoginAvailable() {
  return APP_BASE_PATH === "/test";
}

function renderTestLoginButton() {
  if (!els.testLoginButton) return;
  const available = testLoginAvailable();
  els.testLoginButton.classList.toggle("hidden", !available);
  els.testLoginButton.hidden = !available;
  els.testLoginButton.disabled = state.testLoginLoading;
  els.testLoginButton.textContent = state.testLoginLoading ? "正在进入..." : "测试账号进入";
}

async function loginWithTestAccount(event = null) {
  event?.preventDefault();
  event?.currentTarget?.blur();
  if (!testLoginAvailable() || state.testLoginLoading) return;
  state.testLoginLoading = true;
  renderTestLoginButton();
  setMessage(els.loginMessage, "正在进入测试账号...", "");
  try {
    const data = await api("/api/test-login", {
      method: "POST",
      body: "{}"
    });
    setMessage(els.loginMessage, "", "");
    await routeAfterAuthentication(data.profile, false);
  } catch (error) {
    setMessage(els.loginMessage, error.message || "测试账号登录失败。", "error");
  } finally {
    state.testLoginLoading = false;
    renderTestLoginButton();
  }
}

function startAppleAccountBinding(event) {
  event.preventDefault();
  event.currentTarget?.blur();
  if (!state.profile) return;
  state.accountBindingLoading = "apple";
  renderSettings();
  setQqSyncMessage("正在打开 Apple 授权...", "");
  if (isMobileQqAuthContext()) {
    window.location.href = appleLoginStartUrl({ bind: true });
    return;
  }
  const popup = openAppleAuthorizationPopup({ bind: true });
  if (!popup) {
    window.location.href = appleLoginStartUrl({ bind: true });
    return;
  }
  watchAccountBindingPopup(popup, "apple");
  setQqSyncMessage("请在 Apple 授权窗口完成绑定。", "");
}

function startQqAccountBinding(event) {
  event.preventDefault();
  event.currentTarget?.blur();
  if (!state.profile) return;
  state.accountBindingLoading = "qq";
  renderSettings();
  setQqSyncMessage("正在打开 QQ 授权...", "");
  if (isMobileQqAuthContext()) {
    window.location.href = qqLoginStartUrl({ bind: true, mobile: true });
    return;
  }
  const popup = openQqAuthorizationPopup({ bind: true });
  if (!popup) {
    window.location.href = qqLoginStartUrl({ bind: true });
    return;
  }
  watchAccountBindingPopup(popup, "qq");
  setQqSyncMessage("请在 QQ 授权窗口完成绑定。", "");
}

function startQqProfileSync(event) {
  event.preventDefault();
  event.currentTarget.blur();
  if (!state.profile?.qq) {
    setQqSyncMessage("当前账户未绑定 QQ，暂不能同步资料。", "error");
    return;
  }

  state.qqProfileSyncing = true;
  renderSettings();
  setQqSyncMessage("正在打开 QQ 授权...", "");
  if (isMobileQqAuthContext()) {
    window.location.href = qqLoginStartUrl({ sync: true, mobile: true });
    return;
  }

  const popup = openQqAuthorizationPopup({ sync: true });
  if (!popup) {
    window.location.href = qqLoginStartUrl({ sync: true });
    return;
  }
  watchQqProfileSyncPopup(popup);
  setQqSyncMessage("请在 QQ 授权窗口完成资料同步。", "");
}

window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin) return;
  const data = event.data;
  if (!data) return;
  if (data.type === "qq-login-result") {
    handleQqLoginResult(data.status);
  } else if (data.type === "apple-login-result") {
    handleAppleLoginResult(data.status);
  }
});

window.addEventListener("furby-native-ready", () => {
  renderNativeHealthTest();
});

window.addEventListener("storage", (event) => {
  if (event.key === QQ_LOGIN_RESULT_KEY) {
    const result = parseQqLoginResult(event.newValue);
    if (result) {
      handleQqLoginResult(result.status);
    }
  } else if (event.key === APPLE_LOGIN_RESULT_KEY) {
    const result = parseAppleLoginResult(event.newValue);
    if (result) {
      handleAppleLoginResult(result.status);
    }
  }
});

function consumeStoredAuthResults() {
  consumeStoredQqLoginResult();
  consumeStoredAppleLoginResult();
}

window.addEventListener("focus", consumeStoredAuthResults);
window.addEventListener("pageshow", consumeStoredAuthResults);

function requestSignalWithTimeout(controller, externalSignal) {
  return JF.requestSignalWithTimeout(controller, externalSignal);
}

async function api(path, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  const externalSignal = options.signal || null;
  const signal = requestSignalWithTimeout(controller, externalSignal);
  const { signal: _signal, headers: optionHeaders, ...fetchOptions } = options;
  const response = await fetch(appUrl(path), {
    credentials: "same-origin",
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(optionHeaders || {})
    },
    signal
  }).catch((error) => {
    if (error.name === "AbortError") {
      const abortError = new Error(externalSignal?.aborted ? "请求已取消。" : "网络响应超时，请稍后再试。");
      abortError.name = "AbortError";
      abortError.cancelled = Boolean(externalSignal?.aborted);
      throw abortError;
    }
    throw error;
  }).finally(() => {
    window.clearTimeout(timeout);
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "请求失败。");
    error.status = response.status;
    error.canCreate = Boolean(data.canCreate);
    error.privacyRequired = Boolean(data.privacyRequired);
    error.privacy = data.privacy || null;
    error.accountRestricted = Boolean(data.accountRestricted);
    error.accountStatus = data.accountStatus || null;
    if (error.accountStatus) {
      applyAccountStatusUpdate(error.accountStatus);
    }
    throw error;
  }
  return data;
}

function base64urlToBuffer(value) {
  return JF.base64urlToBuffer(value);
}

function bufferToBase64url(buffer) {
  return JF.bufferToBase64url(buffer);
}

function passkeyAttemptId(prefix = "pk") {
  if (window.crypto?.randomUUID) {
    return `${prefix}_${window.crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function passkeyUaBrands() {
  const brands = navigator.userAgentData?.brands || navigator.userAgentData?.uaList || [];
  return Array.isArray(brands)
    ? brands.map((item) => `${item.brand || item.name || ""}/${item.version || ""}`).filter(Boolean).join(",")
    : "";
}

function passkeyRuntimeSnapshot() {
  const userActivation = navigator.userActivation || {};
  const viewport = `${Math.round(window.innerWidth || 0)}x${Math.round(window.innerHeight || 0)}@${Number(window.devicePixelRatio || 1).toFixed(2)}`;
  const screenSize = `${Math.round(window.screen?.width || 0)}x${Math.round(window.screen?.height || 0)}@${Number(window.screen?.pixelDepth || 0)}`;
  return {
    documentHasFocus: typeof document.hasFocus === "function" ? document.hasFocus() : null,
    userActivationActive: Boolean(userActivation.isActive),
    userActivationSeen: Boolean(userActivation.hasBeenActive),
    visibilityChanges: passkeyDiagnostics.visibilityChanges,
    focusChanges: passkeyDiagnostics.focusChanges,
    blurChanges: passkeyDiagnostics.blurChanges,
    clientLanguage: navigator.language || "",
    clientLanguages: Array.isArray(navigator.languages) ? navigator.languages.slice(0, 8) : [],
    clientOnline: navigator.onLine,
    cookieEnabled: navigator.cookieEnabled,
    viewport,
    screen: screenSize,
    uaPlatform: navigator.userAgentData?.platform || "",
    uaMobile: typeof navigator.userAgentData?.mobile === "boolean" ? navigator.userAgentData.mobile : null,
    uaBrands: passkeyUaBrands()
  };
}

function withTimeout(promise, timeoutMs, fallback = null) {
  return Promise.race([
    promise,
    new Promise((resolve) => window.setTimeout(() => resolve(fallback), timeoutMs))
  ]);
}

function withRejectingTimeout(promise, timeoutMs, message) {
  let timer = null;
  return Promise.race([
    promise.finally(() => {
      if (timer) {
        window.clearTimeout(timer);
      }
    }),
    new Promise((_, reject) => {
      timer = window.setTimeout(() => reject(new Error(message)), timeoutMs);
    })
  ]);
}

function currentAppScriptInfo() {
  const script = [...document.scripts].reverse().find((item) => {
    if (!item.src) return false;
    try {
      return new URL(item.src).pathname.endsWith("/app.js");
    } catch {
      return false;
    }
  });
  if (!script?.src) {
    return { path: APP_SCRIPT_PATH, version: "" };
  }
  try {
    const url = new URL(script.src);
    return {
      path: url.pathname,
      version: url.searchParams.get("v") || ""
    };
  } catch {
    return { path: APP_SCRIPT_PATH, version: "" };
  }
}

function clientDiagnosticLog(event, details = {}) {
  const scriptInfo = currentAppScriptInfo();
  const payload = {
    event,
    isSecureContext: window.isSecureContext,
    visibilityState: document.visibilityState,
    clientPlatform: navigator.platform || "",
    clientVendor: navigator.vendor || "",
    clientUserAgent: navigator.userAgent || "",
    appScriptPath: scriptInfo.path,
    appScriptVersion: scriptInfo.version,
    ...passkeyRuntimeSnapshot(),
    ...details
  };
  const body = JSON.stringify(payload);
  const url = appUrl("/api/passkeys/client-log");
  try {
    if (navigator.sendBeacon) {
      const sent = navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      if (sent) return;
    }
  } catch {
    // 诊断日志不能影响用户流程。
  }
  fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  }).catch(() => {});
}

async function collectPasskeyCapabilities() {
  const result = {
    platformAuthenticatorAvailable: null,
    conditionalMediationAvailable: null,
    capabilityError: ""
  };
  try {
    if (typeof window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable === "function") {
      result.platformAuthenticatorAvailable = await withTimeout(
        window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
        700,
        null
      );
    }
    if (typeof window.PublicKeyCredential?.isConditionalMediationAvailable === "function") {
      result.conditionalMediationAvailable = await withTimeout(
        window.PublicKeyCredential.isConditionalMediationAvailable(),
        700,
        null
      );
    }
  } catch (error) {
    result.capabilityError = `${error?.name || "Error"}:${error?.message || ""}`.slice(0, 160);
  }
  return result;
}

function passkeyErrorDetails(error) {
  return {
    errorName: error?.name || "",
    errorClass: error?.constructor?.name || "",
    errorCode: Number.isFinite(Number(error?.code)) ? Number(error.code) : null,
    errorMessage: error?.message || ""
  };
}

function passkeyOptionSummary(options, variant = "primary") {
  const credentials = Array.isArray(options?.allowCredentials) ? options.allowCredentials : [];
  const transports = [...new Set(credentials.flatMap((credential) => credential.transports || []))].slice(0, 12);
  return {
    variant,
    rpId: options?.rpId || options?.rp?.id || "",
    credentialCount: credentials.length,
    transports,
    hasAllowCredentials: Object.prototype.hasOwnProperty.call(options || {}, "allowCredentials"),
    optionKeys: Object.keys(options || {}).sort(),
    timeoutMs: Number.isFinite(Number(options?.timeout)) ? Number(options.timeout) : null,
    userVerification: options?.userVerification || options?.authenticatorSelection?.userVerification || ""
  };
}

function publicKeyCreationOptionsFromJson(options) {
  return JF.publicKeyCreationOptionsFromJson(options);
}

function publicKeyRequestOptionsFromJson(options) {
  return JF.publicKeyRequestOptionsFromJson(options);
}

function credentialToJson(credential) {
  return JF.credentialToJson(credential);
}

function webauthnSupported() {
  return JF.webauthnSupported() && window.isSecureContext;
}

function nativePasskeySupported() {
  return Boolean(nativePasskeyBridge());
}

function nativePasskeyBridge() {
  const bridge = window.WellEchoNative?.passkey;
  if (!bridge?.available || typeof bridge.request !== "function") {
    return null;
  }
  return bridge;
}

function passkeyRegistrationSupported() {
  return webauthnSupported() || nativePasskeySupported();
}

function passkeyErrorMessage(error) {
  return error?.name === "NotAllowedError" ? "Passkey 操作已取消。" : error?.message || "Passkey 操作失败。";
}

function passkeyClientLog(event, details = {}) {
  clientDiagnosticLog(event, {
    logArea: "passkey",
    supported: passkeyRegistrationSupported(),
    nativeSupported: nativePasskeySupported(),
    ...details
  });
}

function faceModelRuntimeSnapshot() {
  const webkitHandlers = Object.keys(window.webkit?.messageHandlers || {}).slice(0, 12);
  const legacyNativeFaceBridge = Boolean(window.WellEchoNative?.face || window.furbyNativeFace);
  return {
    logArea: "face-model",
    nativeMarker: window.__WELLECHO_NATIVE_SHELL__ === true,
    nativeShell: isWellEchoNativeShell(),
    nativeHealthBridge: Boolean(nativeHealthBridge()),
    nativePasskeyBridge: Boolean(nativePasskeyBridge()),
    nativeFaceBridge: nativeFaceSupported(),
    legacyNativeFaceBridge,
    nativePlatform: nativeBridgePlatform(),
    nativeFaceEngine: nativeFaceEngine(),
    webkitHandlers,
    cacheStorageAvailable: Boolean(window.caches?.open),
    faceModelCacheName: FACE_MODEL_CACHE_NAME,
    faceModelReady: Boolean(state.faceModelReady),
    faceModelSource: state.faceModelSource || "",
    faceModelMode: state.faceModelMode || "",
    modelUrlOrder: faceModelUrlsForCurrentRuntime().map((url) => {
      if (url === FACE_MODEL_LOCAL_URL) return "local";
      if (url === FACE_MODEL_CDN_URL) return "cdn";
      return "other";
    }),
    modelUrlCount: faceModelUrlsForCurrentRuntime().length,
    cdnConfigured: Boolean(FACE_MODEL_CDN_URL),
    cdnBase: FACE_MODEL_CDN_BASE,
    localModelUrl: FACE_MODEL_LOCAL_URL,
    importUrl: MEDIAPIPE_IMPORT_URL,
    wasmUrl: MEDIAPIPE_WASM_URL,
    hardwareConcurrency: Number.isFinite(navigator.hardwareConcurrency) ? navigator.hardwareConcurrency : null,
    deviceMemory: Number.isFinite(navigator.deviceMemory) ? navigator.deviceMemory : null
  };
}

function faceModelClientLog(event, details = {}) {
  clientDiagnosticLog(`face_model_${event}`, {
    ...faceModelRuntimeSnapshot(),
    ...details
  });
}

function nativeFaceSupported() {
  return false;
}

function nativeFaceBridge() {
  return null;
}

function nativeBridgePlatform() {
  return String(window.WellEchoNative?.platform || nativeFaceBridge()?.platform || "native");
}

function nativeFaceEngine() {
  return String(nativeFaceBridge()?.engine || "");
}

function faceAlignmentReady() {
  return Boolean(state.faceModelReady && state.faceLandmarker);
}

function modelUrlKind(modelAssetPath) {
  if (modelAssetPath === FACE_MODEL_LOCAL_URL) return "local";
  if (modelAssetPath === FACE_MODEL_CDN_URL) return "cdn";
  return "other";
}

function sameOriginUrl(url) {
  try {
    return new URL(url, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}

async function openFaceModelCache() {
  if (!window.caches?.open) return null;
  try {
    return await window.caches.open(FACE_MODEL_CACHE_NAME);
  } catch {
    return null;
  }
}

async function responseToFaceModelBuffer(response, cacheSource = "") {
  const contentLength = Number(response.headers.get("content-length") || 0);
  const buffer = await response.arrayBuffer();
  if (buffer.byteLength < FACE_MODEL_MIN_BYTES) {
    throw new Error(`模型文件大小异常 (${buffer.byteLength} bytes)`);
  }
  return {
    buffer,
    bytes: buffer.byteLength,
    contentLength: Number.isFinite(contentLength) ? contentLength : 0,
    cacheStatus: cacheSource || response.headers.get("x-cache-lookup") || "",
    contentType: response.headers.get("content-type") || ""
  };
}

async function fetchFaceModelBuffer(modelAssetPath) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), FACE_MODEL_DOWNLOAD_TIMEOUT_MS);
  const cache = await openFaceModelCache();
  try {
    if (cache) {
      const cached = await cache.match(modelAssetPath).catch(() => null);
      if (cached?.ok) {
        try {
          return await responseToFaceModelBuffer(cached, "cache-api");
        } catch (error) {
          await cache.delete(modelAssetPath).catch(() => {});
          faceModelClientLog("cache_invalid", {
            stage: "cache",
            modelUrl: modelAssetPath,
            modelUrlKind: modelUrlKind(modelAssetPath),
            errorMessage: error?.message || String(error || ""),
            severity: "warning"
          });
        }
      }
    }

    const response = await fetch(modelAssetPath, {
      cache: "force-cache",
      credentials: sameOriginUrl(modelAssetPath) ? "same-origin" : "omit",
      signal: controller.signal
    });
    if (!response.ok) {
      throw new Error(`模型文件下载失败 (${response.status})`);
    }
    const responseForCache = response.clone();
    const result = await responseToFaceModelBuffer(response);
    if (cache) {
      cache.put(modelAssetPath, responseForCache).catch(() => {});
    }
    return result;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("模型文件下载超时。");
    }
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

function resetPasskeyLoginButtonState() {
  els.passkeyLoginButton.disabled = false;
  els.passkeyLoginButton.removeAttribute("aria-busy");
  els.passkeyLoginButton.blur();
}

function currentViewportSize() {
  const visualViewport = window.visualViewport;
  return {
    width: Math.max(1, Math.round(visualViewport?.width || window.innerWidth || document.documentElement.clientWidth || 390)),
    height: Math.max(1, Math.round(visualViewport?.height || window.innerHeight || document.documentElement.clientHeight || 844))
  };
}

function layoutViewportWidth() {
  return Math.max(1, Math.round(window.innerWidth || document.documentElement.clientWidth || currentViewportSize().width));
}

function applyViewportMetrics() {
  const { width } = currentViewportSize();
  const root = document.documentElement;
  root.style.setProperty("--app-viewport-width", `${width}px`);

  if (!els.bottomTabs || els.bottomTabs.classList.contains("hidden")) {
    root.style.removeProperty("--bottom-tabs-rendered-height");
    return;
  }

  const renderedHeight = Math.round(els.bottomTabs.getBoundingClientRect().height);
  if (renderedHeight > 0) {
    root.style.setProperty("--bottom-tabs-rendered-height", `${renderedHeight}px`);
  }
}

function scheduleViewportMetricsRefresh() {
  applyViewportMetrics();
  state.viewportSettlingTimers.forEach((timer) => window.clearTimeout(timer));
  state.viewportSettlingTimers = [];

  window.requestAnimationFrame(() => {
    applyViewportMetrics();
  });

  state.viewportSettlingTimers = [80, 240, 520].map((delay) => window.setTimeout(() => {
    applyViewportMetrics();
  }, delay));
}

function nextAnimationFrame() {
  return new Promise((resolve) => window.requestAnimationFrame(resolve));
}

function waitForCameraMetadata(timeout = 2400) {
  const video = els.cameraVideo;
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && video.videoWidth && video.videoHeight) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let settled = false;
    const cleanup = () => {
      video.removeEventListener("loadedmetadata", finish);
      video.removeEventListener("loadeddata", finish);
      video.removeEventListener("canplay", finish);
      video.removeEventListener("resize", finish);
      window.clearTimeout(timer);
    };
    const finish = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };
    const timer = window.setTimeout(finish, timeout);
    video.addEventListener("loadedmetadata", finish, { once: true });
    video.addEventListener("loadeddata", finish, { once: true });
    video.addEventListener("canplay", finish, { once: true });
    video.addEventListener("resize", finish, { once: true });
  });
}

function waitForCameraVideoFrame(timeout = 900) {
  const video = els.cameraVideo;
  if (typeof video.requestVideoFrameCallback !== "function") {
    return nextAnimationFrame().then(nextAnimationFrame);
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve();
    };
    const timer = window.setTimeout(finish, timeout);
    video.requestVideoFrameCallback(finish);
  });
}

async function waitForStableCameraFrame() {
  await waitForCameraMetadata();
  await waitForCameraVideoFrame();
  await nextAnimationFrame();
  const width = els.cameraVideo.videoWidth;
  const height = els.cameraVideo.videoHeight;
  if (!width || !height) {
    throw new Error("摄像头画面尚未准备好，请稍等一秒再拍。");
  }
  return { width, height };
}

function clearCapturedPhoto() {
  if (state.capturedPhotoUrl) {
    URL.revokeObjectURL(state.capturedPhotoUrl);
  }
  state.capturedPhoto = null;
  state.capturedThumbnail = null;
  state.capturedPhotoUrl = null;
  els.photoPreview.removeAttribute("src");
}

function clearPendingFoodPhoto({ restoreLive = true } = {}) {
  if (state.foodPendingPhoto?.url) {
    URL.revokeObjectURL(state.foodPendingPhoto.url);
  }
  state.foodPendingPhoto = null;
  if (state.captureMode === "food") {
    els.photoPreview.removeAttribute("src");
    els.photoPreview.classList.add("hidden");
    if (restoreLive && state.stream) {
      els.cameraVideo.classList.remove("hidden");
      els.emptyCamera.classList.add("hidden");
      els.switchCameraButton.disabled = false;
    }
  }
}

function clearFoodCaptureState() {
  cancelActiveFoodAnalysis();
  closeFoodSelectionModal();
  clearPendingFoodPhoto({ restoreLive: false });
  state.foodSelectionPhotoId = null;
  for (const photo of state.foodPhotos) {
    if (photo.url) URL.revokeObjectURL(photo.url);
  }
  state.foodPhotos = [];
  state.foodItems = [];
  state.foodAnalyzing = false;
  if (els.foodMoodInput) els.foodMoodInput.value = "";
}

function discardFoodSelectionPhoto() {
  const photoId = state.foodSelectionPhotoId;
  if (!photoId) return false;
  const photo = state.foodPhotos.find((item) => item.id === photoId);
  if (photo?.url) URL.revokeObjectURL(photo.url);
  state.foodPhotos = state.foodPhotos.filter((item) => item.id !== photoId);
  state.foodSelectionPhotoId = null;
  return true;
}

function startFoodAnalysisRequest() {
  if (state.foodAnalyzeAbortController) {
    state.foodAnalyzeAbortController.abort();
  }
  const controller = new AbortController();
  const requestId = state.foodAnalyzeRequestId + 1;
  state.foodAnalyzeRequestId = requestId;
  state.foodAnalyzeAbortController = controller;
  return { requestId, signal: controller.signal };
}

function activeFoodAnalysisRequest(requestId) {
  return state.foodAnalyzeRequestId === requestId
    && state.foodAnalyzeAbortController
    && !state.foodAnalyzeAbortController.signal.aborted;
}

function finishFoodAnalysisRequest(requestId) {
  if (state.foodAnalyzeRequestId === requestId) {
    state.foodAnalyzeAbortController = null;
  }
}

function cancelActiveFoodAnalysis() {
  if (state.foodAnalyzeAbortController) {
    state.foodAnalyzeAbortController.abort();
    state.foodAnalyzeAbortController = null;
    state.foodAnalyzeRequestId += 1;
  }
  stopFoodAnalysisTaskProgress();
  state.foodAnalyzing = false;
  state.isCapturing = false;
}

function isFoodAnalysisAbort(error) {
  return error?.name === "AbortError" || error?.cancelled;
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

function canvasToDataUrl(canvas, type = "image/jpeg", quality = 0.86) {
  try {
    return canvas.toDataURL(type, quality);
  } catch (error) {
    throw new Error(error?.message || "照片数据读取失败，请重新拍照。");
  }
}

async function encodeCapturedPhotos() {
  const photo = await canvasToBlob(els.captureCanvas, "image/jpeg", 0.88);
  if (!photo) {
    throw new Error("照片编码失败，请重新拍照。");
  }

  els.analysisCanvas.width = 180;
  els.analysisCanvas.height = 240;
  const thumbnailContext = els.analysisCanvas.getContext("2d");
  thumbnailContext.drawImage(els.captureCanvas, 0, 0, 180, 240);
  const thumbnail = await canvasToBlob(els.analysisCanvas, "image/jpeg", 0.72);
  if (!thumbnail) {
    throw new Error("缩略图生成失败，请重新拍照。");
  }

  return { photo, thumbnail };
}

async function encodeFoodPhoto() {
  const photo = await canvasToBlob(els.captureCanvas, "image/jpeg", 0.9);
  if (!photo) {
    throw new Error("食物照片编码失败，请重新拍照。");
  }

  els.analysisCanvas.width = 240;
  els.analysisCanvas.height = 240;
  const thumbnailContext = els.analysisCanvas.getContext("2d");
  thumbnailContext.drawImage(els.captureCanvas, 0, 0, 240, 240);
  const thumbnail = await canvasToBlob(els.analysisCanvas, "image/jpeg", 0.76);
  if (!thumbnail) {
    throw new Error("食物缩略图生成失败，请重新拍照。");
  }
  return { photo, thumbnail };
}

function privacyStatus() {
  return state.profile?.privacy || {
    mode: "unset",
    fullAccess: false,
    agreementAccepted: false,
    sensitiveInformationAccepted: false,
    currentAgreementVersion: "2026-06-19",
    currentPrivacyPolicyVersion: "2026-06-19"
  };
}

function hasFullMode() {
  return Boolean(privacyStatus().fullAccess);
}

function accountStatus() {
  return state.profile?.accountStatus || { status: "active", message: "" };
}

function accountCanInteract() {
  return accountStatus().status === "active";
}

function accountRestrictedMessage() {
  return accountStatus().message || "账号当前处于限制状态，暂不能执行该操作。";
}

function applyAccountStatusUpdate(status) {
  if (!status || typeof status !== "object" || !state.profile) return;
  state.profile = {
    ...state.profile,
    accountStatus: status
  };
  if (!els.settingsView.classList.contains("hidden")) {
    renderSettings();
  }
  if (!els.communityView.classList.contains("hidden") && state.community) {
    renderCommunity();
  }
}

function hasInteractiveFullMode() {
  return hasFullMode() && accountCanInteract();
}

function privacyModeLabel(mode = privacyStatus().mode) {
  if (mode === "full" && hasFullMode()) return "完整模式";
  if (mode === "basic") return "基础模式";
  return "待选择";
}

function formatConsentTime(value) {
  return value ? dateTimeFormat.format(new Date(value)) : "尚未签署";
}

function genderLabel(value) {
  return {
    male: "男",
    female: "女",
    other: "其他"
  }[value] || "未设置";
}

function birthdayLabel(value) {
  return value ? String(value).replace(/-/g, "/") : "未设置";
}

function currentBirthdayLimit() {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate()
  };
}

function daysInProfileMonth(year, month) {
  const numericYear = Number(year) || currentBirthdayLimit().year;
  const numericMonth = Number(month) || 1;
  return new Date(numericYear, numericMonth, 0).getDate();
}

function clampProfileBirthdayParts(year, month, day) {
  const limit = currentBirthdayLimit();
  let nextYear = Math.min(limit.year, Math.max(1900, Number(year) || limit.year));
  let nextMonth = Math.min(12, Math.max(1, Number(month) || 1));
  let nextDay = Math.min(daysInProfileMonth(nextYear, nextMonth), Math.max(1, Number(day) || 1));
  if (nextYear === limit.year && nextMonth > limit.month) {
    nextMonth = limit.month;
    nextDay = Math.min(nextDay, limit.day);
  }
  if (nextYear === limit.year && nextMonth === limit.month && nextDay > limit.day) {
    nextDay = limit.day;
  }
  return { year: nextYear, month: nextMonth, day: nextDay };
}

function parseProfileBirthday(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return { birthday: "", year: null, month: null, day: null };
  const parts = clampProfileBirthdayParts(Number(match[1]), Number(match[2]), Number(match[3]));
  return {
    birthday: profileBirthdayFromParts(parts),
    ...parts
  };
}

function profileBirthdayFromParts(parts = state.profileDraft) {
  if (!parts?.year || !parts?.month || !parts?.day) return "";
  const { year, month, day } = clampProfileBirthdayParts(parts.year, parts.month, parts.day);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function profileDraftFromProfile() {
  const parsedBirthday = parseProfileBirthday(state.profile?.demographics?.birthday || "");
  return {
    gender: state.profile?.demographics?.gender || "",
    birthday: parsedBirthday.birthday,
    year: parsedBirthday.year,
    month: parsedBirthday.month,
    day: parsedBirthday.day
  };
}

function profileSummaryText(profile = state.profile) {
  const demographics = profile?.demographics || {};
  const gender = genderLabel(demographics.gender);
  const birthday = birthdayLabel(demographics.birthday);
  if (gender === "未设置" && birthday === "未设置") return "尚未填写性别和生日。";
  return `性别 ${gender} · 生日 ${birthday}`;
}

function birthdayPickerButton(value, label, type, selected) {
  return `<button type="button" data-birthday-part="${type}" data-birthday-value="${value}" class="${selected ? "is-selected" : ""}">${escapeAttribute(label)}</button>`;
}

function renderBirthdayPicker() {
  if (!els.profileBirthdayPicker) return;
  const limit = currentBirthdayLimit();
  const draft = state.profileDraft || profileDraftFromProfile();
  const hasBirthday = Boolean(draft.birthday);
  if (!draft.year || !draft.month || !draft.day) {
    const fallback = clampProfileBirthdayParts(limit.year - 25, 1, 1);
    Object.assign(draft, fallback, { birthday: "" });
  }
  const parts = clampProfileBirthdayParts(draft.year, draft.month, draft.day);
  Object.assign(state.profileDraft, parts, { birthday: hasBirthday ? profileBirthdayFromParts(parts) : "" });

  const years = [];
  for (let year = limit.year; year >= 1900; year -= 1) {
    years.push(birthdayPickerButton(year, `${year}年`, "year", year === parts.year));
  }
  const maxMonth = parts.year === limit.year ? limit.month : 12;
  const months = [];
  for (let month = 1; month <= maxMonth; month += 1) {
    months.push(birthdayPickerButton(month, `${month}月`, "month", month === parts.month));
  }
  const maxDay = parts.year === limit.year && parts.month === limit.month
    ? limit.day
    : daysInProfileMonth(parts.year, parts.month);
  const days = [];
  for (let day = 1; day <= maxDay; day += 1) {
    days.push(birthdayPickerButton(day, `${day}日`, "day", day === parts.day));
  }

  els.profileBirthdayYear.innerHTML = years.join("");
  els.profileBirthdayMonth.innerHTML = months.join("");
  els.profileBirthdayDay.innerHTML = days.join("");
  els.profileBirthdayDraftText.textContent = state.profileDraft.birthday ? birthdayLabel(state.profileDraft.birthday) : "未设置";
  els.profileBirthdayToggle.textContent = state.profileDraft.birthday ? birthdayLabel(state.profileDraft.birthday) : "选择生日";
  els.profileBirthdayPicker.classList.toggle("hidden", !state.birthdayPickerOpen);

  for (const column of [els.profileBirthdayYear, els.profileBirthdayMonth, els.profileBirthdayDay]) {
    const selected = column.querySelector(".is-selected");
    if (selected && state.birthdayPickerOpen) {
      window.requestAnimationFrame(() => selected.scrollIntoView({ block: "center", inline: "nearest" }));
    }
  }
}

function setBirthdayDraftPart(part, value) {
  const next = {
    year: state.profileDraft.year,
    month: state.profileDraft.month,
    day: state.profileDraft.day,
    [part]: Number(value)
  };
  const clamped = clampProfileBirthdayParts(next.year, next.month, next.day);
  state.profileDraft = {
    ...state.profileDraft,
    ...clamped,
    birthday: profileBirthdayFromParts(clamped)
  };
  renderAccountProfilePanel();
}

function renderAccountProfilePanel() {
  if (!state.profile || !els.accountProfilePanel) return;
  const demographics = state.profile.demographics || {};
  const editing = Boolean(state.profileEditing);
  const hasIdentity = Boolean(state.profile.qq || state.profile.apple);
  renderAvatar(els.accountProfileAvatar, state.profile);
  els.accountProfileName.textContent = profileDisplayName(state.profile);
  els.accountProfileBinding.textContent = qqBindingLabel(state.profile);
  els.profileGenderText.textContent = genderLabel(demographics.gender);
  els.profileBirthdayText.textContent = birthdayLabel(demographics.birthday);
  els.accountProfileSummary.textContent = profileSummaryText(state.profile);
  els.accountProfileBadge.textContent = editing ? "编辑中" : "只读";
  els.accountProfileBadge.dataset.mode = editing ? "full" : "basic";
  els.accountProfileReadonly.classList.toggle("hidden", editing);
  els.accountProfileForm.classList.toggle("hidden", !editing);
  els.editProfileButton.classList.toggle("hidden", editing);
  els.cancelProfileEditButton.classList.toggle("hidden", !editing);
  els.saveProfileButton.classList.toggle("hidden", !editing);
  els.editProfileButton.disabled = !hasIdentity || state.profileSaving;
  els.cancelProfileEditButton.disabled = state.profileSaving;
  els.saveProfileButton.disabled = state.profileSaving || !hasIdentity;

  for (const button of els.profileGenderButtons) {
    const active = button.dataset.profileGender === (state.profileDraft.gender || "");
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-checked", active ? "true" : "false");
    button.disabled = !editing || state.profileSaving;
  }
  renderBirthdayPicker();
}

function renderAccountBindingsPanel() {
  if (!state.profile || !els.accountBindingsPanel) return;
  const qq = state.profile.qq;
  const apple = state.profile.apple;
  const linkedCount = [qq, apple].filter(Boolean).length;
  const loading = state.accountBindingLoading;
  els.accountBindingsBadge.textContent = linkedCount ? `${linkedCount} 个` : "未绑定";
  els.accountBindingsBadge.dataset.mode = linkedCount ? "full" : "basic";
  els.accountBindingsSummary.textContent = linkedCount
    ? `已绑定 ${linkedCount} 个登录方式。`
    : "管理 Apple ID、QQ 等登录方式。";

  els.appleBindingState.textContent = apple ? "已绑定 Apple ID" : "未绑定 Apple ID";
  els.appleBindingHint.textContent = apple
    ? `绑定标识：${apple.email || apple.bindId || state.profile.accountCode}`
    : "可绑定 Apple ID 后用于网页登录。";
  els.bindAppleAccountButton.disabled = Boolean(apple) || loading === "apple";
  els.bindAppleAccountButton.textContent = loading === "apple"
    ? "绑定中..."
    : apple ? "已绑定" : "绑定 Apple";

  els.qqBindingState.textContent = qq ? "已绑定 QQ" : "未绑定 QQ";
  els.qqBindingHint.textContent = qq
    ? `绑定标识：${qq.bindId || state.profile.accountCode}${qq.unionIdDigest ? " · UnionID 已记录" : ""}`
    : "可绑定 QQ 后用于网页登录。";
  els.bindQqAccountButton.disabled = Boolean(qq) || loading === "qq";
  els.bindQqAccountButton.textContent = loading === "qq"
    ? "绑定中..."
    : qq ? "已绑定" : "绑定 QQ";
}

function startProfileEdit() {
  if (!state.profile?.qq && !state.profile?.apple) {
    setProfileSettingsMessage("当前账户未绑定正式登录方式，暂不能编辑个人资料。", "error");
    return;
  }
  state.profileEditing = true;
  state.profileDraft = profileDraftFromProfile();
  state.birthdayPickerOpen = false;
  setProfileSettingsMessage("", "");
  renderSettings();
}

function cancelProfileEdit() {
  state.profileEditing = false;
  state.profileDraft = profileDraftFromProfile();
  state.birthdayPickerOpen = false;
  setProfileSettingsMessage("", "");
  renderSettings();
}

function renderPrivacyHighlights(items) {
  els.privacyHighlights.innerHTML = items.map((item) => `<span>${escapeAttribute(item)}</span>`).join("");
}

function configurePrivacyConsentStep(step) {
  const isBasicStep = step === "basic";
  state.privacyConsentStep = isBasicStep ? "basic" : "full";
  els.privacyConsentTitle.textContent = isBasicStep ? "使用基础模式" : "隐私协议确认";
  els.privacyConsentDescription.textContent = isBasicStep
    ? "如果你不想进入完整模式，可以选择基础模式。基础模式只允许浏览社区公开内容，不能拍照记录、保存体重、点赞、评论、共享或进行其他个性化操作。"
    : "完整模式会在服务器保存你的照片、体重、心情和记录时间；五官点位只在本机用于照片校正，不会上传或保存。";
  renderPrivacyHighlights(isBasicStep
    ? ["只浏览社区公开内容", "不保存照片和体重记录", "之后进入我的页面可重新签署"]
    : ["可使用拍照记录和回放", "社区公开共享会再次询问", "可随时撤销并清除数据"]);
  els.fullConsentFields.classList.toggle("hidden", isBasicStep);
  els.chooseBasicModeButton.textContent = "不同意并退出";
  els.acceptFullModeButton.textContent = isBasicStep ? "同意基本模式" : "同意并进入";
  els.chooseBasicModeButton.disabled = false;
  updateFullConsentButton();
}

function showPrivacyConsent(reason = "personal") {
  state.privacyPromptReason = reason;
  els.agreementConsentCheck.checked = false;
  els.sensitiveConsentCheck.checked = false;
  configurePrivacyConsentStep("full");
  els.privacyConsentMessage.textContent = privacyStatus().renewalRequired
    ? "协议版本已更新，请重新确认后继续使用完整模式。"
    : "";
  showSoftOverlay(els.privacyConsentModal);
  document.body.classList.add("privacy-consent-open");
  window.setTimeout(() => els.chooseBasicModeButton.focus(), 0);
}

function hidePrivacyConsent() {
  hideSoftOverlay(els.privacyConsentModal, () => {
    document.body.classList.remove("privacy-consent-open");
    maybeShowQueuedPasskeyPrompt();
  });
}

function updateFullConsentButton() {
  if (state.privacyConsentStep === "basic") {
    els.acceptFullModeButton.disabled = false;
    return;
  }
  els.acceptFullModeButton.disabled = !(els.agreementConsentCheck.checked && els.sensitiveConsentCheck.checked);
}

function showBasicModeConsent() {
  els.agreementConsentCheck.checked = false;
  els.sensitiveConsentCheck.checked = false;
  configurePrivacyConsentStep("basic");
  els.privacyConsentMessage.textContent = "";
  window.setTimeout(() => els.acceptFullModeButton.focus(), 0);
}

function showBasicModeOnlyMessage(target = null) {
  const message = hasFullMode() && !accountCanInteract()
    ? accountRestrictedMessage()
    : "基础模式仅可浏览社区，不能点赞、评论、共享或使用个性化功能。";
  const messageTarget = target || document.querySelector("#communityDetailMessage") || els.communityMessage;
  if (messageTarget) {
    messageTarget.textContent = message;
  }
  return message;
}

async function updatePrivacyMode(mode, { fromConsent = false } = {}) {
  const isFull = mode === "full";
  const status = privacyStatus();
  const data = await api("/api/privacy/mode", {
    method: "PUT",
    body: JSON.stringify({
      mode,
      accepted: isFull && els.agreementConsentCheck.checked,
      sensitiveAccepted: isFull && els.sensitiveConsentCheck.checked,
      agreementVersion: status.currentAgreementVersion,
      privacyPolicyVersion: status.currentPrivacyPolicyVersion
    })
  });
  state.profile = data.profile;
  if (!isFull) {
    state.records = [];
    state.historyRecords = [];
    state.recordsLoaded = false;
    state.historyExpanded = false;
  } else {
    state.historyExpanded = true;
  }
  hidePrivacyConsent();
  renderSettings();

  if (isFull) {
    await showDashboard(state.profile);
  } else if (fromConsent || state.activeTab === "personal") {
    await showCommunityView(state.profile);
  } else {
    await showSettingsView(state.profile);
  }
}

function showLogin() {
  if (postNativeSessionEvent("authRequired", { reason: "web-login-view" })) {
    return;
  }
  closeReplayModal(true);
  closeCommunityDetail(true);
  closeQqLoginWindow();
  closeAppleLoginWindow();
  stopCommunityFoodCarousels();
  if (!state.isRefreshing) {
    resetPullRefresh();
  }
  els.loginView.classList.remove("hidden");
  els.dashboardView.classList.add("hidden");
  els.communityView.classList.add("hidden");
  els.settingsView.classList.add("hidden");
  els.captureView.classList.add("hidden");
  els.bottomTabs.classList.add("hidden");
  els.communityConsentModal.classList.add("hidden");
  els.privacyConsentModal.classList.add("hidden");
  els.passkeyPromptModal.classList.add("hidden");
  els.policyModal.classList.add("hidden");
  els.withdrawConsentModal.classList.add("hidden");
  els.deleteOwnAccountModal.classList.add("hidden");
  els.feedbackModal.classList.add("hidden");
  els.aiSummaryModal.classList.add("hidden");
  renderTestLoginButton();
  state.aiSummaryAbortController?.abort();
  state.aiSummaryAbortController = null;
  state.aiSummaryTypewriter?.cancel?.();
  state.aiSummaryTypewriter = null;
  for (const overlay of [
    els.communityConsentModal,
    els.privacyConsentModal,
    els.passkeyPromptModal,
    els.policyModal,
    els.withdrawConsentModal,
    els.deleteOwnAccountModal,
    els.feedbackModal,
    els.aiSummaryModal
  ]) {
    const timer = softOverlayTimers.get(overlay);
    if (timer) {
      window.clearTimeout(timer);
      softOverlayTimers.delete(overlay);
    }
    overlay.classList.remove("is-open");
  }
  document.body.classList.remove("has-bottom-tabs", "is-community-tab", "community-consent-open", "privacy-consent-open", "passkey-prompt-open", "policy-open", "confirmation-open", "feedback-open", "food-selection-open", "manual-food-open", "ai-summary-open", "community-detail-open", "replay-modal-open");
  state.profile = null;
  state.records = [];
  state.historyRecords = [];
  state.historyExpanded = true;
  state.recordsLoaded = false;
  state.community = null;
  state.communityPanel = "feed";
  state.communityDetail = null;
  state.passkeyStatus = null;
  state.passkeyPromptQueued = false;
  state.passkeyPromptVisible = false;
  state.qqProfileSyncing = false;
  state.accountBindingLoading = "";
  state.profileSaving = false;
  state.profileEditing = false;
  state.profileDraft = { gender: "", birthday: "", year: null, month: null, day: null };
  state.birthdayPickerOpen = false;
  state.privacyConsentStep = "full";
}

function updateActiveTab(tab, updateUrl = true) {
  state.activeTab = tab;
  const personalActive = tab === "personal";
  const communityActive = tab === "community";
  const settingsActive = tab === "settings";
  els.personalTabButton.classList.toggle("is-active", personalActive);
  els.personalTabButton.setAttribute("aria-selected", personalActive ? "true" : "false");
  els.communityTabButton.classList.toggle("is-active", communityActive);
  els.communityTabButton.setAttribute("aria-selected", communityActive ? "true" : "false");
  els.settingsTabButton.classList.toggle("is-active", settingsActive);
  els.settingsTabButton.setAttribute("aria-selected", settingsActive ? "true" : "false");
  els.bottomTabs.classList.remove("hidden");
  document.body.classList.add("has-bottom-tabs");
  document.body.classList.toggle("is-community-tab", communityActive);
  scheduleViewportMetricsRefresh();

  if (updateUrl) {
    const url = new URL(window.location.href);
    if (personalActive) {
      url.searchParams.delete("tab");
    } else {
      url.searchParams.set("tab", tab);
    }
    if (!settingsActive) {
      url.searchParams.delete("settings");
    }
    window.history.replaceState({}, "", url);
  }
}

function profileDisplayName(profile = state.profile) {
  if (!profile) return "我的";
  return profile.displayName || profile.qq?.nickname || profile.label || "我的";
}

function profileInitial(profile = state.profile) {
  const [first = "我"] = Array.from(profileDisplayName(profile).trim() || "我");
  return first.toUpperCase();
}

function safeAvatarUrl(profile = state.profile) {
  return profile?.avatarUrl || profile?.qq?.avatarUrl || "";
}

function renderAvatar(element, profile = state.profile) {
  if (!element) return;
  const avatarUrl = safeAvatarUrl(profile);
  renderAvatarElement(element, avatarUrl, profileInitial(profile));
}

function renderAvatarElement(element, avatarUrl, fallbackText) {
  if (!element) return;
  element.replaceChildren();
  element.style.backgroundImage = "";
  if (avatarUrl) {
    const image = document.createElement("img");
    image.src = avatarUrl;
    image.alt = "";
    image.decoding = "async";
    image.referrerPolicy = "no-referrer";
    image.draggable = false;
    element.append(image);
  } else {
    element.textContent = fallbackText || "";
  }
  element.classList.toggle("has-image", Boolean(avatarUrl));
}

function renderProfileIdentity(profile = state.profile) {
  const name = profileDisplayName(profile);
  if (els.profileName) {
    els.profileName.textContent = name;
    if (els.profileTitleSuffix) {
      els.profileTitleSuffix.textContent = APP_COPY.profileTitleSuffix;
    }
  } else if (els.profileTitle) {
    els.profileTitle.textContent = APP_COPY.profileTitle(name);
  }
  renderAvatar(els.profileAvatar, profile);
}

function qqBindingLabel(profile = state.profile) {
  if (profile?.qq && profile?.apple) {
    return APP_LOCALE_ENGLISH ? "QQ and Apple ID linked" : "已绑定 QQ 和 Apple ID";
  }
  if (profile?.qq) {
    return APP_LOCALE_ENGLISH
      ? `QQ: ${profile.qq.bindId || profile.accountCode}`
      : `绑定QQ：${profile.qq.bindId || profile.accountCode}`;
  }
  if (profile?.apple) {
    return APP_LOCALE_ENGLISH
      ? `Apple ID: ${profile.apple.email || profile.apple.bindId || profile.accountCode}`
      : `绑定 Apple ID：${profile.apple.email || profile.apple.bindId || profile.accountCode}`;
  }
  return APP_LOCALE_ENGLISH ? "Legacy account" : "口令账户";
}

function passkeySummaryFromProfile(profile = state.profile) {
  return profile?.passkeys || {
    available: Boolean(profile?.qq || profile?.apple),
    activeCount: 0,
    enabled: false,
    promptAvailable: false
  };
}

function shouldOfferPasskeyPrompt(profile = state.profile) {
  const summary = passkeySummaryFromProfile(profile);
  return Boolean(summary.available && summary.promptAvailable && !summary.enabled && passkeyRegistrationSupported());
}

async function markPasskeyPromptSeen() {
  try {
    const data = await api("/api/passkeys/prompt-seen", { method: "POST", body: "{}" });
    if (data.profile) {
      state.profile = data.profile;
      renderPasskeyStatus();
    }
  } catch {
    // 提示本身不应打断登录流程，失败时由服务端下次继续判断是否需要提醒。
  }
}

function hidePasskeyPrompt() {
  state.passkeyPromptVisible = false;
  hideSoftOverlay(els.passkeyPromptModal, () => {
    document.body.classList.remove("passkey-prompt-open");
  });
}

function showPasskeyPrompt() {
  state.passkeyPromptVisible = true;
  els.passkeyPromptMessage.textContent = "";
  els.startPasskeyPromptButton.disabled = !passkeyRegistrationSupported();
  showSoftOverlay(els.passkeyPromptModal);
  document.body.classList.add("passkey-prompt-open");
  window.setTimeout(() => els.startPasskeyPromptButton.focus(), 0);
  void markPasskeyPromptSeen();
}

function maybeShowQueuedPasskeyPrompt() {
  if (!state.passkeyPromptQueued || !shouldOfferPasskeyPrompt()) {
    return;
  }
  if (
    state.passkeyPromptVisible
    || !els.loginView.classList.contains("hidden")
    || !els.privacyConsentModal.classList.contains("hidden")
    || !els.policyModal.classList.contains("hidden")
  ) {
    return;
  }
  state.passkeyPromptQueued = false;
  showPasskeyPrompt();
}

function queuePasskeyPromptIfNeeded(profile = state.profile) {
  state.passkeyPromptQueued = shouldOfferPasskeyPrompt(profile);
  maybeShowQueuedPasskeyPrompt();
}

function renderPasskeyStatus(status = state.passkeyStatus) {
  const profileSummary = passkeySummaryFromProfile();
  const hasIdentityBinding = status ? Boolean(status.hasIdentityBinding ?? status.hasQqBinding) : Boolean(profileSummary.available);
  const provider = status?.provider || state.profile?.authProvider || "";
  const providerLabel = provider === "apple" ? "Apple ID" : provider === "qq" ? "QQ" : "账号";
  const activeCount = Number.isFinite(status?.activeCount) ? status.activeCount : Number(profileSummary.activeCount || 0);
  const enabled = activeCount > 0;
  const statusText = enabled
    ? (APP_LOCALE_ENGLISH ? `${activeCount}` : `${activeCount} 个`)
    : hasIdentityBinding
      ? (APP_LOCALE_ENGLISH ? "Not set" : "未设置")
      : (APP_LOCALE_ENGLISH ? "Sign in" : "需登录");

  els.passkeySettingsStatus.textContent = statusText;
  els.passkeySettingsStatus.classList.toggle("is-signed", enabled);
  els.passkeyDetailBadge.textContent = statusText;
  els.passkeyDetailBadge.dataset.mode = enabled ? "full" : "basic";
  els.passkeySettingsSummary.textContent = enabled
    ? (APP_LOCALE_ENGLISH ? `${activeCount} Passkey${activeCount > 1 ? "s" : ""} added.` : `已添加 ${activeCount} 个 Passkey，可用于下次直接登录。`)
    : hasIdentityBinding
      ? (APP_LOCALE_ENGLISH ? `No Passkey for this ${providerLabel}.` : `当前 ${providerLabel} 账户还未添加 Passkey。`)
      : (APP_LOCALE_ENGLISH ? "Sign in before adding Passkey." : "必须先登录并绑定账户。");
  els.passkeyStatusDescription.textContent = hasIdentityBinding
    ? (APP_LOCALE_ENGLISH ? `Bind Passkey to this ${providerLabel}.` : `Passkey 会绑定当前 ${providerLabel} 账户，之后可用手机解锁直接登录本站。`)
    : (APP_LOCALE_ENGLISH ? "Passkey is unavailable for this account." : "当前账户不能添加 Passkey。");
  els.passkeyBindingState.textContent = hasIdentityBinding
    ? (APP_LOCALE_ENGLISH ? `${providerLabel} linked` : `已绑定 ${providerLabel}`)
    : (APP_LOCALE_ENGLISH ? "No linked account" : "未绑定账户");
  els.passkeyBindingHint.textContent = hasIdentityBinding
    ? `${APP_LOCALE_ENGLISH ? "ID" : "绑定标识"}：${status?.bindId || state.profile?.qq?.bindId || state.profile?.apple?.email || state.profile?.apple?.bindId || state.profile?.accountCode || "-"}`
    : (APP_LOCALE_ENGLISH ? "Sign in first." : "请先在登录页登录。");
  const passkeySupported = passkeyRegistrationSupported();
  els.addPasskeyButton.disabled = !hasIdentityBinding || !passkeySupported;
  if (!passkeySupported) {
    els.passkeyBindingHint.textContent = APP_LOCALE_ENGLISH ? "Passkey is unavailable in this browser." : "当前浏览器不支持 Passkey，请使用手机系统浏览器或新版桌面浏览器。";
  }

  const credentials = Array.isArray(status?.credentials) ? status.credentials : [];
  els.passkeyList.innerHTML = credentials.length
    ? credentials.map((credential) => `
      <div class="passkey-list-item">
        <span>
          <strong>${escapeAttribute(credential.label || "我的 Passkey")}</strong>
          <small>${APP_LOCALE_ENGLISH ? "Added" : "添加于"} ${formatConsentTime(credential.createdAt)}${credential.lastUsedAt ? ` · ${APP_LOCALE_ENGLISH ? "Used" : "最近使用"} ${formatConsentTime(credential.lastUsedAt)}` : ""}</small>
        </span>
        <button class="passkey-delete-button" type="button" data-passkey-delete="${escapeAttribute(credential.id)}" aria-label="${APP_LOCALE_ENGLISH ? "Remove" : "移除"} ${escapeAttribute(credential.label || "我的 Passkey")}">${communityTrashIconMarkup()}</button>
      </div>
    `).join("")
    : `<div class="passkey-empty">${APP_LOCALE_ENGLISH ? "No Passkeys yet." : "还没有添加 Passkey。"}</div>`;
}

async function showDashboard(profile) {
  closeCommunityDetail(true);
  closeAiSummary(true);
  stopCommunityFoodCarousels();
  if (!state.isRefreshing) {
    resetPullRefresh();
  }
  state.profile = profile;
  renderProfileIdentity(profile);
  els.loginView.classList.add("hidden");
  els.captureView.classList.add("hidden");
  els.communityView.classList.add("hidden");
  els.settingsView.classList.add("hidden");
  els.dashboardView.classList.remove("hidden");
  updateActiveTab("personal");

  if (!hasFullMode()) {
    showPrivacyConsent(privacyStatus().mode === "unset" ? "initial" : "personal");
    return;
  }

  if (!window.isSecureContext) {
    els.cameraHint.textContent = "当前地址不是安全环境，可能只能保存体重；请用 HTTPS 打开以启用摄像头。";
  }

  await loadRecords();
  renderNativeHealthTest();
  window.setTimeout(() => preloadFaceModel(false), 250);
}

const NATIVE_HEALTH_INITIAL_DAYS = 30;
const NATIVE_HEALTH_MAX_DAYS = 30;
const WEIGHT_CALENDAR_DAYS = 30;

function nativeHealthBridge() {
  const bridge = window.WellEchoNative?.health;
  if (!bridge || typeof bridge.readToday !== "function" || typeof bridge.readRecent !== "function") {
    return null;
  }
  return bridge;
}

function formatNativeHealthNumber(value, suffix = "") {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  const formatted = Math.abs(number) >= 100 ? Math.round(number).toString() : number.toFixed(1).replace(/\.0$/, "");
  return `${formatted}${suffix}`;
}

function clampNativeHealthDays(days) {
  return Math.max(1, Math.min(NATIVE_HEALTH_MAX_DAYS, Math.round(Number(days) || NATIVE_HEALTH_INITIAL_DAYS)));
}

function nativeHealthDayTimestamp(dateKey) {
  const text = String(dateKey || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return new Date().toISOString();
  return new Date(`${text}T12:00:00`).toISOString();
}

function nativeHealthRecordDateLabel(snapshot) {
  const range = snapshot?.range || {};
  if (!range.startDate || !range.endDate) return "";
  const sameDay = range.startDate === range.endDate;
  return sameDay ? range.endDate : `${range.startDate} - ${range.endDate}`;
}

function nativeHealthWeightFromDay(day) {
  const weight = Number(day?.weight?.latest);
  return Number.isFinite(weight) && weight > 0 ? Number(weight.toFixed(2)) : null;
}

function nativeHealthHeartRateFromDay(day) {
  const heartRate = day?.heartRate || {};
  const latest = Number(heartRate.latest);
  const min = Number(heartRate.min);
  const max = Number(heartRate.max);
  const avg = Number(heartRate.avg);
  if (![latest, min, max, avg].some(Number.isFinite) && !Number(heartRate.samples)) return null;
  return {
    id: `native-health-heart-${day.date}`,
    type: "native-health-heart-rate",
    source: "healthkit",
    timestamp: nativeHealthDayTimestamp(day.date),
    date: day.date,
    latest: Number.isFinite(latest) ? latest : null,
    min: Number.isFinite(min) ? min : null,
    max: Number.isFinite(max) ? max : null,
    avg: Number.isFinite(avg) ? avg : null,
    samples: Number(heartRate.samples) || 0,
    unit: heartRate.unit || "bpm"
  };
}

function applyNativeHealthSnapshot(snapshot) {
  const days = Array.isArray(snapshot?.recent) ? snapshot.recent : [];
  state.nativeHealthWeightRecords = days
    .map((day) => {
      const weight = nativeHealthWeightFromDay(day);
      if (!Number.isFinite(weight)) return null;
      return {
        id: `native-health-weight-${day.date}`,
        type: "native-health-weight",
        source: "healthkit",
        timestamp: nativeHealthDayTimestamp(day.date),
        weight
      };
    })
    .filter(Boolean);
  state.nativeHealthHeartRateRecords = days.map(nativeHealthHeartRateFromDay).filter(Boolean);
}

function chartWeightRecords() {
  return [...state.records, ...state.nativeHealthWeightRecords]
    .filter((record) => record.type !== "food" && Number.isFinite(record.weight));
}

function nativeHealthDescriptionText(bridge) {
  if (!bridge) {
    return APP_LOCALE_ENGLISH
      ? "Open in the iOS app to sync weight and heart rate."
      : "当前不是 iOS App 环境，真机 App 内会自动同步体重和心率。";
  }
  if (state.nativeHealthLoading) {
    return APP_LOCALE_ENGLISH
      ? `Syncing recent ${clampNativeHealthDays(state.nativeHealthLoadedDays || NATIVE_HEALTH_INITIAL_DAYS)} days...`
      : `正在同步近 ${clampNativeHealthDays(state.nativeHealthLoadedDays || NATIVE_HEALTH_INITIAL_DAYS)} 天体重和心率...`;
  }
  if (state.nativeHealthError) {
    return APP_LOCALE_ENGLISH
      ? `${state.nativeHealthError} Tap to request permission and sync again.`
      : `${state.nativeHealthError} 点击可重新授权并同步。`;
  }
  if (state.nativeHealthLoadedDays > 0) {
    const range = nativeHealthRecordDateLabel(state.nativeHealthSnapshot);
    const weightCount = state.nativeHealthWeightRecords.length;
    const heartCount = state.nativeHealthHeartRateRecords.length;
    return APP_LOCALE_ENGLISH
      ? `Synced ${range || `recent ${state.nativeHealthLoadedDays} days`}. Weight ${weightCount}, heart rate ${heartCount}.`
      : `已同步 ${range || `近 ${state.nativeHealthLoadedDays} 天`}，体重 ${weightCount} 条，心率 ${heartCount} 天。`;
  }
  return APP_LOCALE_ENGLISH
    ? "Tap to request Health permission and sync."
    : "点击可请求健康权限并重新同步。";
}

function renderNativeHealthTest() {
  const bridge = nativeHealthBridge();
  state.nativeHealthAvailable = Boolean(bridge);
  if (els.nativeHealthStatus) {
    const label = state.nativeHealthLoading
      ? (APP_LOCALE_ENGLISH ? "Syncing" : "同步中")
      : !bridge
        ? (APP_LOCALE_ENGLISH ? "Unavailable" : "未检测到")
        : state.nativeHealthError
          ? (APP_LOCALE_ENGLISH ? "Failed" : "同步失败")
          : state.nativeHealthLoadedDays > 0
            ? (APP_LOCALE_ENGLISH ? "Synced" : "同步正常")
            : (APP_LOCALE_ENGLISH ? "Ready" : "可同步");
    els.nativeHealthStatus.textContent = label;
    els.nativeHealthStatus.classList.toggle("is-signed", Boolean(bridge && !state.nativeHealthError));
    els.nativeHealthStatus.dataset.status = state.nativeHealthError ? "error" : bridge ? "active" : "unavailable";
  }
  if (els.nativeHealthDescription) {
    els.nativeHealthDescription.textContent = nativeHealthDescriptionText(bridge);
  }
  if (els.nativeHealthSyncOption) {
    els.nativeHealthSyncOption.disabled = !bridge || state.nativeHealthLoading;
    els.nativeHealthSyncOption.setAttribute("aria-busy", state.nativeHealthLoading ? "true" : "false");
  }
  for (const button of [els.readNativeHealthTodayButton, els.readNativeHealthRecentButton]) {
    if (!button) continue;
    button.disabled = !bridge || state.nativeHealthLoading;
  }
}

async function syncNativeHealthData({ days = NATIVE_HEALTH_INITIAL_DAYS, force = false, interactive = false } = {}) {
  const bridge = nativeHealthBridge();
  const requestedDays = clampNativeHealthDays(days);
  state.nativeHealthAvailable = Boolean(bridge);
  if (!bridge || state.nativeHealthLoading) {
    renderNativeHealthTest();
    return null;
  }
  if (!force && state.nativeHealthLoadedDays >= requestedDays) {
    renderNativeHealthTest();
    return state.nativeHealthSnapshot;
  }
  state.nativeHealthLoading = true;
  state.nativeHealthError = "";
  renderNativeHealthTest();
  try {
    if (interactive && typeof bridge.requestAuthorization === "function") {
      await bridge.requestAuthorization();
    }
    const snapshot = await bridge.readRecent(requestedDays);
    if (!snapshot?.ok) {
      throw new Error(snapshot?.error || (APP_LOCALE_ENGLISH ? "Health sync failed." : "健康数据同步失败。"));
    }
    state.nativeHealthSnapshot = snapshot;
    state.nativeHealthLoadedDays = Math.max(
      state.nativeHealthLoadedDays,
      Number(snapshot.range?.days) || requestedDays
    );
    applyNativeHealthSnapshot(snapshot);
    renderAll();
    return snapshot;
  } catch (error) {
    const message = error.message || (APP_LOCALE_ENGLISH ? "Unable to read Health data." : "读取 iOS 健康数据失败。");
    state.nativeHealthError = message;
    state.nativeHealthSnapshot = {
      ok: false,
      error: message,
      generatedAt: new Date().toISOString()
    };
    return null;
  } finally {
    state.nativeHealthLoading = false;
    renderNativeHealthTest();
  }
}

async function readNativeHealthSnapshot(days = NATIVE_HEALTH_INITIAL_DAYS) {
  return syncNativeHealthData({ days, force: true, interactive: true });
}

function queueNativeHealthStartupSync() {
  renderNativeHealthTest();
}

function renderSettings() {
  if (!state.profile) return;
  const privacy = privacyStatus();
  els.settingsAccountLabel.textContent = profileDisplayName(state.profile);
  els.settingsQqBinding.textContent = qqBindingLabel(state.profile);
  renderAvatar(els.settingsAccountAvatar, state.profile);
  const status = accountStatus();
  const restricted = status.status && status.status !== "active";
  els.accountStatusNotice.hidden = !restricted;
  els.accountStatusNotice.textContent = restricted ? accountRestrictedMessage() : "";
  els.accountStatusNotice.dataset.status = status.status || "active";
  if (els.syncQqProfileButton) {
    const qqBound = Boolean(state.profile.qq);
    els.syncQqProfileButton.disabled = !qqBound || state.qqProfileSyncing;
    els.syncQqProfileButton.textContent = state.qqProfileSyncing ? "同步中..." : "同步 QQ 资料";
  }
  renderAccountProfilePanel();
  renderAccountBindingsPanel();
  els.settingsModeBadge.textContent = privacyModeLabel();
  els.settingsModeBadge.dataset.mode = privacy.fullAccess ? "full" : privacy.mode;
  els.privacySignatureStatus.textContent = privacy.agreementAccepted ? "已签署" : "尚未签署";
  els.privacySignatureStatus.classList.toggle("is-signed", privacy.agreementAccepted);
  els.privacySettingsSummary.textContent = privacy.agreementAccepted
    ? `当前为${privacyModeLabel()}，签署于 ${formatConsentTime(privacy.acceptedAt)}。`
    : "查看协议文件，并选择完整模式或基础模式。";
  els.privacyStatusDescription.textContent = privacy.agreementAccepted
    ? `协议签署于 ${formatConsentTime(privacy.acceptedAt)}，当前使用${privacyModeLabel()}。`
    : "尚未签署完整模式协议，当前只处理登录和必要会话信息。";
  els.fullModeButton.classList.toggle("is-active", privacy.fullAccess);
  els.basicModeButton.classList.toggle("is-active", privacy.mode === "basic" && !privacy.fullAccess);
  els.privacyAuditSummary.innerHTML = `
    <span><small>用户协议</small><strong>${privacy.agreementVersion || "未签署"}</strong></span>
    <span><small>隐私政策</small><strong>${privacy.privacyPolicyVersion || "未签署"}</strong></span>
    <span><small>敏感信息同意</small><strong>${privacy.sensitiveInformationAccepted ? "已确认" : "未确认"}</strong></span>
  `;
  els.withdrawConsentButton.disabled = !privacy.agreementAccepted && !privacy.hasStoredPersonalData;
  renderPasskeyStatus();
  renderNativeHealthTest();
}

async function saveProfileSettings() {
  if ((!state.profile?.qq && !state.profile?.apple) || state.profileSaving) return;
  const gender = state.profileDraft.gender || "";
  const birthday = state.profileDraft.birthday || "";
  state.profileSaving = true;
  renderSettings();
  setProfileSettingsMessage("正在保存个人资料...", "");
  try {
    const data = await api("/api/profile", {
      method: "PATCH",
      body: JSON.stringify({
        gender,
        birthday
      })
    });
    state.profile = data.profile || state.profile;
    state.profileEditing = false;
    state.birthdayPickerOpen = false;
    state.profileDraft = profileDraftFromProfile();
    setProfileSettingsMessage("个人资料已保存。", "success");
  } catch (error) {
    setProfileSettingsMessage(error.message || "个人资料保存失败。", "error");
  } finally {
    state.profileSaving = false;
    renderSettings();
  }
}

function normalizeSettingsPanel(panel) {
  return ["profile", "bindings", "privacy", "passkey", "account"].includes(panel) ? panel : "overview";
}

function showSettingsPanel(panel = "overview", updateUrl = true) {
  const normalized = normalizeSettingsPanel(panel);
  state.settingsPanel = normalized;
  els.settingsOverviewPanel.classList.toggle("hidden", normalized !== "overview");
  els.accountProfilePanel.classList.toggle("hidden", normalized !== "profile");
  els.accountBindingsPanel.classList.toggle("hidden", normalized !== "bindings");
  els.privacySettingsPanel.classList.toggle("hidden", normalized !== "privacy");
  els.passkeySettingsPanel.classList.toggle("hidden", normalized !== "passkey");
  els.accountDeletionPanel.classList.toggle("hidden", normalized !== "account");

  if (normalized !== "profile") {
    state.profileEditing = false;
    state.birthdayPickerOpen = false;
  }

  if (normalized === "passkey") {
    void loadUserPasskeyStatus();
  }

  if (updateUrl && state.activeTab === "settings") {
    const url = new URL(window.location.href);
    if (normalized === "overview") {
      url.searchParams.delete("settings");
    } else {
      url.searchParams.set("settings", normalized);
    }
    window.history.replaceState({}, "", url);
  }
}

async function showSettingsView(profile = state.profile, updateUrl = true, panel = null) {
  if (!profile) return;
  if (!state.isRefreshing) resetPullRefresh();
  state.profile = profile;
  stopCommunityFoodCarousels();
  closeCommunityDetail(true);
  closeCamera();
  els.loginView.classList.add("hidden");
  els.dashboardView.classList.add("hidden");
  els.communityView.classList.add("hidden");
  els.captureView.classList.add("hidden");
  els.settingsView.classList.remove("hidden");
  updateActiveTab("settings", updateUrl);
  renderSettings();
  const requestedPanel = panel || (updateUrl ? new URLSearchParams(window.location.search).get("settings") : null);
  showSettingsPanel(requestedPanel || "overview", updateUrl);
}

function showCommunityConsent() {
  showSoftOverlay(els.communityConsentModal);
  document.body.classList.add("community-consent-open");
  window.setTimeout(() => els.acceptCommunityShareButton.focus(), 0);
}

function hideCommunityConsent() {
  hideSoftOverlay(els.communityConsentModal, () => {
    document.body.classList.remove("community-consent-open");
  });
}

function renderCommunityPanelTabs() {
  const rankingActive = state.communityPanel === "ranking";
  els.communityFeedTabButton.classList.toggle("is-active", !rankingActive);
  els.communityFeedTabButton.setAttribute("aria-selected", rankingActive ? "false" : "true");
  els.communityRankingTabButton.classList.toggle("is-active", rankingActive);
  els.communityRankingTabButton.setAttribute("aria-selected", rankingActive ? "true" : "false");
  els.communityFeedPanel.classList.toggle("hidden", rankingActive);
  els.communityRankingPanel.classList.toggle("hidden", !rankingActive);
}

function setCommunityPanel(panel) {
  const nextPanel = panel === "ranking" ? "ranking" : "feed";
  if (state.communityPanel === nextPanel) {
    return;
  }
  state.communityPanel = nextPanel;
  renderCommunityPanelTabs();
}

function renderCommunityRanking() {
  const rankings = state.community?.rankings || {};
  const members = rankings[state.communityRankingPeriod] || [];
  els.rankingPeriods.forEach((button) => {
    const active = button.dataset.rankingPeriod === state.communityRankingPeriod;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });

  if (!members.length) {
    els.communityRankingList.innerHTML = '<p class="ranking-empty">这个周期还没有互动，第一份鼓励会从这里开始。</p>';
    return;
  }

  els.communityRankingList.innerHTML = members.map((member) => `
    <button class="ranking-item rank-${Math.min(member.rank, 4)}" type="button" data-community-open="${escapeAttribute(member.id)}">
      <span class="ranking-number">${member.rank}</span>
      ${communityAvatarMarkup(member, "ranking-avatar")}
      <span class="ranking-main">
        <strong>${escapeAttribute(communityDisplayName(member))}${member.isSelf ? '<span class="community-self-badge">我</span>' : ""}</strong>
        <small>${member.periodLikeCount} 赞 · ${member.periodCommentCount} 评论 · ${member.periodUpdateCount} 次更新</small>
      </span>
      <span class="ranking-score"><strong>${member.score}</strong><small>人气</small></span>
    </button>
  `).join("");
}

function communityDisplayName(entity) {
  return entity?.alias || entity?.nickname || "QQ用户";
}

function communityAvatarText(entity) {
  const [first = "Q"] = Array.from((entity?.avatarText || communityDisplayName(entity)).trim() || "Q");
  return first.toUpperCase();
}

function communityAvatarMarkup(entity, className) {
  const avatarUrl = entity?.avatarUrl || "";
  const label = communityDisplayName(entity);
  return `
    <span class="${className}${avatarUrl ? " has-image" : ""}" aria-hidden="true">
      ${avatarUrl
        ? `<img src="${escapeAttribute(avatarUrl)}" alt="" loading="lazy" decoding="async">`
        : escapeAttribute(communityAvatarText(entity))}
    </span>
  `;
}

function communityWeightTrendMarkup(member) {
  const trend = member?.weightTrend;
  const dayMs = 24 * 60 * 60 * 1000;
  const dayTime = (day) => Date.parse(`${day}T00:00:00.000Z`);
  const dayKey = (time) => new Date(time).toISOString().slice(0, 10);
  const points = Array.isArray(trend?.points) ? trend.points.filter((point) => (
    typeof point.day === "string"
    && Number.isFinite(dayTime(point.day))
    && Number.isFinite(point.min)
    && Number.isFinite(point.max)
  )) : [];
  if (!points.length) {
    return '<div class="community-weight-mini is-empty" aria-label="暂无共享体重图">暂无体重</div>';
  }

  const sortedPoints = [...points].sort((left, right) => dayTime(left.day) - dayTime(right.day));
  const latestDay = dayTime(sortedPoints.at(-1).day);
  const earliestDay = dayTime(sortedPoints[0].day);
  const dataSpanDays = Math.max(1, Math.round((latestDay - earliestDay) / dayMs) + 1);
  const viewportWidth = Math.max(320, Math.floor(window.visualViewport?.width || window.innerWidth || 390));
  const gridColumns = viewportWidth > 1120 ? 3 : viewportWidth > 760 ? 2 : 1;
  const shellPadding = viewportWidth <= 760 ? 48 : viewportWidth <= 1120 ? 64 : 96;
  const gridGap = 12 * Math.max(0, gridColumns - 1);
  const cardWidth = Math.max(220, (viewportWidth - shellPadding - gridGap) / gridColumns);
  const coverWidth = viewportWidth <= 380 ? 78 : viewportWidth <= 760 ? 92 : 112;
  const chartWidthEstimate = Math.max(124, cardWidth - coverWidth - 34);
  const visibleDayCount = Math.max(7, Math.min(24, Math.round(chartWidthEstimate / 18)));
  const shouldLeftAlign = dataSpanDays <= visibleDayCount && sortedPoints.length < visibleDayCount;
  const startDay = shouldLeftAlign ? earliestDay : latestDay - (visibleDayCount - 1) * dayMs;
  const pointsByDay = new Map(sortedPoints.map((point) => [point.day, point]));
  const visiblePoints = Array.from({ length: visibleDayCount }, (_, index) => {
    const day = dayKey(startDay + index * dayMs);
    return pointsByDay.get(day) || { day, hasRecord: false };
  });
  const recordedPoints = visiblePoints.filter((point) => Number.isFinite(point.min) && Number.isFinite(point.max));
  if (!recordedPoints.length) {
    return '<div class="community-weight-mini is-empty" aria-label="暂无近期高低变化">暂无近期</div>';
  }

  const width = Math.max(112, Math.round(chartWidthEstimate), visibleDayCount * 18);
  const height = 58;
  const padX = 6;
  const padY = 2;
  const min = Math.min(...recordedPoints.map((point) => point.min));
  const max = Math.max(...recordedPoints.map((point) => point.max));
  const span = Math.max(0.1, max - min);
  const paddedMin = min === max ? Math.max(0, min - span * 0.5) : min;
  const paddedMax = min === max ? max + span * 0.5 : max;
  const paddedSpan = Math.max(0.1, paddedMax - paddedMin);
  const xStep = (width - padX * 2) / visibleDayCount;
  const yFor = (value) => height - padY - ((Math.max(paddedMin, Math.min(paddedMax, value)) - paddedMin) / paddedSpan) * (height - padY * 2);
  let previousLatest = null;
  const bars = visiblePoints.map((point, index) => {
    const x = padX + (index + 0.5) * xStep;
    if (!Number.isFinite(point.min) || !Number.isFinite(point.max)) {
      return `<line class="community-weight-empty-tick" x1="${x.toFixed(1)}" y1="${(height - padY - 5).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(height - padY).toFixed(1)}" stroke="var(--chart-axis)" stroke-width="2.4" stroke-linecap="round" vector-effect="non-scaling-stroke"></line>`;
    }
    const topY = yFor(point.max);
    const bottomY = yFor(point.min);
    const color = previousLatest === null || !Number.isFinite(point.latest) || point.latest <= previousLatest
      ? "var(--chart-loss)"
      : "var(--chart-gain)";
    previousLatest = Number.isFinite(point.latest) ? point.latest : previousLatest;
    return `<line x1="${x.toFixed(1)}" y1="${topY.toFixed(1)}" x2="${x.toFixed(1)}" y2="${bottomY.toFixed(1)}" stroke="${color}" stroke-width="4.2" stroke-linecap="round" vector-effect="non-scaling-stroke"></line>`;
  }).join("");
  const trendType = ["loss", "gain", "steady"].includes(trend.trend) ? trend.trend : "steady";
  const changeClass = trendType === "loss" ? " is-loss" : trendType === "gain" ? " is-gain" : "";
  const title = `近 ${visibleDayCount} 天体重高低变化`;

  return `
    <div class="community-weight-mini${changeClass}" title="${escapeAttribute(title)}" aria-label="${escapeAttribute(title)}">
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-hidden="true">${bars}</svg>
    </div>
  `;
}

function communityFoodPreviewMarkup(member) {
  const photos = Array.isArray(member?.foodPhotos) ? member.foodPhotos.filter((photo) => photo?.thumbnailUrl || photo?.photoUrl) : [];
  if (!photos.length) return "";
  const groups = [];
  for (let index = 0; index < photos.length; index += 2) {
    groups.push(photos.slice(index, index + 2));
  }
  const groupMarkup = groups.map((group, groupIndex) => {
    const cells = Array.from({ length: 2 }, (_, index) => group[index] || null);
    return `
      <div class="community-food-group" aria-label="饮食照片第 ${groupIndex + 1} 组">
        ${cells.map((photo, index) => photo ? `
          <figure class="community-food-thumb">
            <img src="${escapeAttribute(photo.thumbnailUrl || photo.photoUrl)}" alt="饮食照片 ${groupIndex * 2 + index + 1}" loading="lazy" decoding="async" draggable="false">
          </figure>
        ` : '<span class="community-food-thumb is-empty" aria-hidden="true"></span>').join("")}
      </div>
    `;
  }).join("");
  return `
    <div class="community-food-preview" aria-label="最近饮食照片">
      <div class="community-food-carousel" data-community-food-carousel>
        ${groupMarkup}
      </div>
      ${groups.length > 1 ? `
        <div class="community-food-dots" aria-hidden="true">
          ${groups.map((_, index) => `<span class="${index === 0 ? "is-active" : ""}"></span>`).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function stopCommunityFoodCarousels() {
  if (state.communityFoodCarouselTimer) {
    window.clearInterval(state.communityFoodCarouselTimer);
    state.communityFoodCarouselTimer = null;
  }
}

function updateCommunityFoodCarousel(carousel, index) {
  if (!carousel) return;
  const groups = [...carousel.querySelectorAll(".community-food-group")];
  if (!groups.length) return;
  const nextIndex = ((index % groups.length) + groups.length) % groups.length;
  carousel.dataset.activeIndex = String(nextIndex);
  carousel.style.setProperty("--community-food-index", String(nextIndex));
  const dots = carousel.parentElement?.querySelectorAll(".community-food-dots span") || [];
  dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === nextIndex));
}

function autoAdvanceCommunityFoodCarousels() {
  if (document.hidden || els.communityView.classList.contains("hidden")) return;
  for (const carousel of document.querySelectorAll("[data-community-food-carousel]")) {
    const groups = carousel.querySelectorAll(".community-food-group");
    if (groups.length < 2) continue;
    const current = Number(carousel.dataset.activeIndex || 0);
    updateCommunityFoodCarousel(carousel, current + 1);
  }
}

function bindCommunityFoodCarousels() {
  stopCommunityFoodCarousels();
  const carousels = [...document.querySelectorAll("[data-community-food-carousel]")];
  let hasCarousel = false;
  for (const carousel of carousels) {
    const groups = carousel.querySelectorAll(".community-food-group");
    updateCommunityFoodCarousel(carousel, 0);
    hasCarousel = hasCarousel || groups.length > 1;
  }
  if (hasCarousel && !prefersReducedMotion()) {
    state.communityFoodCarouselTimer = window.setInterval(autoAdvanceCommunityFoodCarousels, 3200);
  }
}

function communityCardTimeMarkup(member) {
  const date = member?.latestAt ? new Date(member.latestAt) : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  return `<time class="community-card-time" datetime="${escapeAttribute(member.latestAt)}">${communityCardDateTimeFormat.format(date)}</time>`;
}

function communityDetailWeightTrendMarkup(member) {
  const trend = member?.fullWeightTrend || member?.weightTrend;
  const dayMs = 24 * 60 * 60 * 1000;
  const dayTime = (day) => Date.parse(`${day}T00:00:00.000Z`);
  const dayKey = (time) => new Date(time).toISOString().slice(0, 10);
  const points = Array.isArray(trend?.points) ? trend.points.filter((point) => (
    typeof point.day === "string"
    && Number.isFinite(dayTime(point.day))
    && Number.isFinite(point.min)
    && Number.isFinite(point.max)
  )) : [];

  if (!points.length) {
    return `
      <div class="community-detail-weight-chart weight-chart" aria-label="体重高低图">
        <div class="chart-empty">暂无体重高低图</div>
      </div>
    `;
  }

  const sortedPoints = [...points].sort((left, right) => dayTime(left.day) - dayTime(right.day));
  const firstDay = dayTime(sortedPoints[0].day);
  const lastDay = dayTime(sortedPoints.at(-1).day);
  const height = 276;
  const padLeft = 4;
  const padRight = 4;
  const padTop = 56;
  const padBottom = 38;
  const viewportWidth = Math.max(320, Math.floor(window.visualViewport?.width || window.innerWidth || 390));
  const panelWidth = viewportWidth <= 760 ? viewportWidth : Math.min(1040, viewportWidth * 0.92);
  const detailContentWidth = Math.max(300, panelWidth - (viewportWidth <= 760 ? 28 : 48));
  const plotViewportWidth = Math.max(260, detailContentWidth - 48);
  const visibleDays = Math.max(10, Math.round((plotViewportWidth / 390) * 10));
  const dayStep = (plotViewportWidth - padLeft - padRight) / visibleDays;
  const dataDayCount = Math.max(1, Math.round((lastDay - firstDay) / dayMs) + 1);
  const dayCount = Math.max(dataDayCount, visibleDays);
  const width = Math.ceil(Math.max(plotViewportWidth, padLeft + padRight + dayCount * dayStep));
  const chartBottom = height - padBottom;
  const chartHeight = chartBottom - padTop;
  const pointsByDay = new Map(sortedPoints.map((point) => [point.day, point]));
  const recordedPoints = sortedPoints.filter((point) => Number.isFinite(point.min) && Number.isFinite(point.max));
  const pointMinValue = (point) => {
    const weight = Number(point.minWeight);
    return Number.isFinite(weight) ? weight : Number(point.min);
  };
  const pointMaxValue = (point) => {
    const weight = Number(point.maxWeight);
    return Number.isFinite(weight) ? weight : Number(point.max);
  };
  const hasWeightValues = recordedPoints.some((point) => (
    Number.isFinite(Number(point.minWeight)) && Number.isFinite(Number(point.maxWeight))
  ));
  const minValue = Math.min(...recordedPoints.map(pointMinValue));
  const maxValue = Math.max(...recordedPoints.map(pointMaxValue));
  const axisRange = Math.max(0.1, maxValue - minValue);
  const axisPadding = hasWeightValues ? (maxValue === minValue ? 1 : Math.max(axisRange * 0.1, 0.2)) : 0.1;
  const axisMin = Math.max(0, minValue - axisPadding);
  const axisMax = hasWeightValues ? maxValue + axisPadding : Math.min(1, maxValue + axisPadding);
  const axisSpan = Math.max(hasWeightValues ? 0.5 : 0.1, axisMax - axisMin);
  const decimals = axisSpan < 1 ? 2 : axisSpan < 10 ? 1 : 0;
  const ticks = Array.from({ length: 5 }, (_, index) => axisMax - (axisSpan * index) / 4);
  const yFor = (value) => chartBottom - ((Math.max(axisMin, Math.min(axisMax, value)) - axisMin) / axisSpan) * chartHeight;
  const gridLines = ticks.map((tick) => `
    <line x1="0" y1="${yFor(tick).toFixed(1)}" x2="${width}" y2="${yFor(tick).toFixed(1)}" stroke="var(--chart-grid)" />
  `).join("");
  const axisLabels = hasWeightValues ? ticks.map((tick) => `
    <span style="top: ${yFor(tick).toFixed(1)}px">${tick.toFixed(decimals)}</span>
  `).join("") : "";
  let previousLatest = null;
  const bars = Array.from({ length: dayCount }, (_, index) => {
    const time = firstDay + index * dayMs;
    const day = dayKey(time);
    const date = new Date(time);
    const point = pointsByDay.get(day);
    const x = padLeft + (index + 0.5) * dayStep;
    const label = `${date.getMonth() + 1}月${date.getDate()}日`;
    if (!point) {
      return `
        <line class="community-detail-trend-empty-tick" x1="${x.toFixed(1)}" y1="${(chartBottom - 7).toFixed(1)}" x2="${x.toFixed(1)}" y2="${chartBottom.toFixed(1)}" stroke="var(--chart-empty)" stroke-width="2.2" stroke-linecap="round"></line>
        <text class="chart-day-label" x="${x.toFixed(1)}" y="${height - 10}" text-anchor="middle">${date.getDate()}</text>
      `;
    }
    let topY = yFor(pointMaxValue(point));
    let bottomY = yFor(pointMinValue(point));
    if (Math.abs(bottomY - topY) < 7) {
      const centerY = (topY + bottomY) / 2;
      topY = Math.max(padTop, centerY - 3.5);
      bottomY = Math.min(chartBottom, centerY + 3.5);
    }
    const isLoss = previousLatest === null || !Number.isFinite(point.latest) || point.latest <= previousLatest;
    previousLatest = Number.isFinite(point.latest) ? point.latest : previousLatest;
    const color = isLoss ? "var(--chart-loss)" : "var(--chart-gain)";
    const hitWidth = Math.max(24, dayStep * 0.8);
    const minWeight = Number(point.minWeight);
    const maxWeight = Number(point.maxWeight);
    const hasWeightValues = Number.isFinite(minWeight) && Number.isFinite(maxWeight);
    const valueAttrs = hasWeightValues
      ? ` data-min="${minWeight.toFixed(2)}" data-max="${maxWeight.toFixed(2)}"`
      : "";
    const ariaLabel = hasWeightValues
      ? `${label}，最低 ${minWeight.toFixed(2)} kg，最高 ${maxWeight.toFixed(2)} kg`
      : `${label} 有体重高低变化记录`;
    return `
      <line class="chart-weight-bar" data-day="${time}" data-color="${color}" data-base-width="7.2" data-selected-width="9" x1="${x.toFixed(1)}" y1="${topY.toFixed(1)}" x2="${x.toFixed(1)}" y2="${bottomY.toFixed(1)}" stroke="${color}" stroke-width="7.2" stroke-linecap="round" opacity="0.82"></line>
      <rect class="chart-hit-area" data-day="${time}"${valueAttrs} x="${(x - hitWidth / 2).toFixed(1)}" y="${padTop}" width="${hitWidth.toFixed(1)}" height="${chartHeight}" fill="transparent" role="button" tabindex="0" aria-label="${escapeAttribute(ariaLabel)}"></rect>
      <text class="chart-day-label" x="${x.toFixed(1)}" y="${height - 10}" text-anchor="middle">${date.getDate()}</text>
    `;
  }).join("");

  return `
    <div class="community-detail-weight-chart weight-chart" data-default-chart-day="${lastDay}" aria-label="体重高低图">
      ${weightRangeChartMarkup({
        axisLabels,
        bars,
        gridLines,
        baseline: `<line x1="0" y1="${chartBottom}" x2="${width}" y2="${chartBottom}" stroke="var(--chart-axis)" />`,
        width,
        height,
        ariaLabel: "完整体重高低图，点击日期可查看当天最高和最低体重。",
        frameClass: "community-detail-chart-frame"
      })}
    </div>
  `;
}

function renderCommunity() {
  const own = state.community?.own || { decisionMade: false, sharing: false, alias: null };
  const members = state.community?.members || [];
  const fullMode = hasInteractiveFullMode();
  renderCommunityPanelTabs();
  els.communityShareToggle.checked = own.sharing;
  els.communityShareToggle.disabled = !fullMode;
  els.communityShareStatus.textContent = own.sharing ? "已共享" : "未共享";
  els.communityShareCopy.textContent = !fullMode
    ? (hasFullMode() ? accountRestrictedMessage() : "基础模式仅可浏览社区，切换到完整模式后可共享和参与互动。")
    : own.sharing
    ? `共享身份为“${communityDisplayName(own)}”，其他人可以查看你的共享回放。`
    : "关闭时，其他人无法查看你的记录。";
  els.communityMeta.textContent = members.length ? `${members.length} 位成员` : "等待第一份分享";
  renderCommunityRanking();

  if (!members.length) {
    stopCommunityFoodCarousels();
    els.communityGrid.innerHTML = '<div class="community-empty">还没有人共享照片记录。<br>开启共享后，你的变化会以 QQ 昵称出现在这里。</div>';
    return;
  }

  els.communityGrid.innerHTML = members.map((member) => `
    <article class="community-card" role="button" tabindex="0" data-community-open="${escapeAttribute(member.id)}" aria-label="进入 ${escapeAttribute(communityDisplayName(member))} 的资料">
      <div class="community-card-media">
        <div class="community-cover">
          ${member.coverUrl ? `<img src="${escapeAttribute(member.coverUrl)}" alt="${escapeAttribute(communityDisplayName(member))} 的最新记录" loading="lazy" decoding="async">` : "暂无照片"}
        </div>
        ${communityFoodPreviewMarkup(member)}
      </div>
      <div class="community-card-body">
        <div class="community-card-identity">
          <div class="community-card-profile">
            ${communityAvatarMarkup(member, "community-member-avatar")}
            <h3 class="community-alias">${escapeAttribute(communityDisplayName(member))}${member.isSelf ? '<span class="community-self-badge">我</span>' : ""}</h3>
          </div>
          ${communityCardTimeMarkup(member)}
        </div>
        ${member.latestMood ? `<p class="community-card-mood">“${escapeAttribute(member.latestMood)}”</p>` : ""}
        ${communityWeightTrendMarkup(member)}
        <div class="community-card-separator" aria-hidden="true"></div>
        <div class="community-card-footer">
          <span class="community-card-records">${member.recordCount} 条记录</span>
          <div class="community-card-actions" aria-label="互动数据">
            <span>${formatCommunityCount(member.commentCount)} 评论</span>
            <span>${formatCommunityCount(member.likeCount)} 赞</span>
          </div>
        </div>
      </div>
    </article>
  `).join("");
  bindCommunityFoodCarousels();
}

function communityLikeIconMarkup() {
  return `
    <span class="community-like-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M7.8 10.4v9.1"></path>
        <path d="M7.8 11.2 11.4 4c.5-1 2-1 2.5-.1.3.5.3 1.1.1 1.7l-1.1 3.1h5.3c1.3 0 2.3 1.2 2.1 2.5l-.9 5.6a3.3 3.3 0 0 1-3.3 2.8H7.8"></path>
        <path d="M3.7 10.4h4.1v9.1H3.7a1.2 1.2 0 0 1-1.2-1.2v-6.7a1.2 1.2 0 0 1 1.2-1.2Z"></path>
      </svg>
    </span>
  `;
}

function communityCommentIconMarkup() {
  return `
    <span class="community-action-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M5.5 18.2 4 21l3.5-1.2a8.7 8.7 0 0 0 4.5 1.2c4.7 0 8.5-3.2 8.5-7.2S16.7 6.6 12 6.6 3.5 9.8 3.5 13.8c0 1.7.7 3.2 2 4.4Z"></path>
        <path d="M8.5 13.6h.1"></path>
        <path d="M12 13.6h.1"></path>
        <path d="M15.5 13.6h.1"></path>
      </svg>
    </span>
  `;
}

function communityShareIconMarkup() {
  return `
    <span class="community-action-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M8.2 12.8 15.8 17"></path>
        <path d="M15.8 7 8.2 11.2"></path>
        <circle cx="6" cy="12" r="2.6"></circle>
        <circle cx="18" cy="6" r="2.6"></circle>
        <circle cx="18" cy="18" r="2.6"></circle>
      </svg>
    </span>
  `;
}

function communityReportIconMarkup() {
  return `
    <span class="community-action-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M6 20V5.8"></path>
        <path d="M6 5.8c2.7-1.5 5.1 1.3 8 0 1.4-.6 2.7-.5 4 .1v8.2c-1.3-.6-2.6-.7-4-.1-2.9 1.3-5.3-1.5-8 0"></path>
      </svg>
    </span>
  `;
}

function communityTrashIconMarkup() {
  return `
    <span class="community-trash-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M4.8 7h14.4"></path>
        <path d="M9.2 7V5.6c0-.7.6-1.3 1.3-1.3h3c.7 0 1.3.6 1.3 1.3V7"></path>
        <path d="M7.2 7.2 8 18.4c.1.8.7 1.4 1.5 1.4h5c.8 0 1.4-.6 1.5-1.4l.8-11.2"></path>
        <path d="M10.4 10.4v5.8"></path>
        <path d="M13.6 10.4v5.8"></path>
      </svg>
    </span>
  `;
}

function renderCommunityLikeButton(member, variant = "default") {
  const fullMode = hasInteractiveFullMode();
  const likeCount = Number.isFinite(member.likeCount) ? member.likeCount : 0;
  const visibleLikeCount = formatCommunityCount(likeCount);
  const label = !fullMode ? (hasFullMode() ? accountRestrictedMessage() : "基础模式仅可浏览，不能点赞") : member.likedByViewer ? "已点赞" : "点赞";
  const pressed = Boolean(member.likedByViewer);
  const disabled = !fullMode;
  const className = `community-like-button${variant === "social" ? " community-social-button" : ""}${member.likedByViewer ? " is-liked" : ""}${!fullMode ? " is-basic-disabled" : ""}`;
  return `
    <button
      class="${className}"
      type="button"
      ${disabled ? "" : `data-community-like="${escapeAttribute(member.id)}"`}
      data-like-count="${likeCount}"
      aria-pressed="${pressed ? "true" : "false"}"
      aria-label="${escapeAttribute(`${label}，当前 ${likeCount} 个赞`)}"
      ${disabled ? "disabled aria-disabled=\"true\"" : ""}
    >
      ${communityLikeIconMarkup()}
      <span class="community-like-count">${visibleLikeCount}</span>
    </button>
  `;
}

function communityActionIconButton(label, iconMarkup, attributes = "", extraClass = "", count = null) {
  const countMarkup = count === null ? "" : `<span class="community-action-count">${formatCommunityCount(count)}</span>`;
  return `
    <button class="community-social-button community-icon-button${extraClass ? ` ${extraClass}` : ""}" type="button" ${attributes} aria-label="${escapeAttribute(label)}" title="${escapeAttribute(label)}">
      ${iconMarkup}
      ${countMarkup}
    </button>
  `;
}

function updateCommunityLikeButtonVisual(button, liked, count, burst = false) {
  button.classList.toggle("is-liked", liked);
  button.classList.toggle("is-just-liked", burst && liked);
  button.setAttribute("aria-pressed", liked ? "true" : "false");
  button.setAttribute("aria-label", `${liked ? "已点赞" : "点赞"}，当前 ${count} 个赞`);
  button.dataset.likeCount = String(count);
  const countNode = button.querySelector(".community-like-count");
  if (countNode) countNode.textContent = formatCommunityCount(count);
}

function setCommunityLikeButtonBusy(button, liked) {
  button.disabled = true;
  button.classList.add("is-pending");
  button.setAttribute("aria-busy", "true");
  button.setAttribute("aria-label", liked ? "正在点赞" : "正在取消点赞");
}

function settleCommunityLikeButton(button, stats, keepBurst = false) {
  const liked = Boolean(stats.likedByViewer);
  const count = Number.isFinite(stats.likeCount) ? stats.likeCount : Number(button.querySelector(".community-like-count")?.textContent || 0);
  button.disabled = false;
  button.classList.remove("is-pending");
  button.removeAttribute("aria-busy");
  button.classList.toggle("is-liked", liked);
  if (!keepBurst || !liked) {
    button.classList.remove("is-just-liked");
  }
  button.setAttribute("aria-pressed", liked ? "true" : "false");
  button.setAttribute("aria-label", `${liked ? "已点赞" : "点赞"}，当前 ${count} 个赞`);
  button.dataset.likeCount = String(count);
  const countNode = button.querySelector(".community-like-count");
  if (countNode) countNode.textContent = formatCommunityCount(count);
}

function clearCommunityLikeBurst(memberId) {
  if (state.communityLikeBurstMemberId === memberId) {
    state.communityLikeBurstMemberId = null;
  }
  document.querySelectorAll(".community-like-button.is-just-liked").forEach((button) => {
    if (button.dataset.communityLike === memberId) {
      button.classList.remove("is-just-liked");
    }
  });
}

function markCommunityLikeBurst(memberId) {
  state.communityLikeBurstMemberId = memberId;
  if (state.communityLikeBurstTimer) {
    window.clearTimeout(state.communityLikeBurstTimer);
  }
  state.communityLikeBurstTimer = window.setTimeout(() => {
    clearCommunityLikeBurst(memberId);
    state.communityLikeBurstTimer = null;
  }, 720);
}

function updateCommunityMemberStats(member, stats) {
  if (!member) return member;
  const next = { ...member };
  if (Number.isFinite(stats.likeCount)) next.likeCount = stats.likeCount;
  if (Number.isFinite(stats.commentCount)) next.commentCount = stats.commentCount;
  if (typeof stats.likedByViewer === "boolean") next.likedByViewer = stats.likedByViewer;
  if (typeof stats.currentLikeTargetId === "string") next.currentLikeTargetId = stats.currentLikeTargetId;
  return next;
}

function applyCommunityMemberStats(memberId, stats) {
  if (state.communityDetail?.member?.id === memberId) {
    state.communityDetail = {
      ...state.communityDetail,
      member: updateCommunityMemberStats(state.communityDetail.member, stats)
    };
  }
  if (!state.community) return;
  state.community = {
    ...state.community,
    members: (state.community.members || []).map((member) => (
      member.id === memberId ? updateCommunityMemberStats(member, stats) : member
    )),
    rankings: Object.fromEntries(Object.entries(state.community.rankings || {}).map(([period, members]) => [
      period,
      members.map((member) => member.id === memberId ? updateCommunityMemberStats(member, stats) : member)
    ]))
  };
}

async function refreshCommunityAfterInteraction(memberId) {
  try {
    state.community = await api("/api/community");
    renderCommunity();
  } catch {
    // 当前弹窗已用接口返回值更新，列表刷新失败不打断用户操作。
  }
  try {
    await loadCommunityDetail(memberId);
  } catch (error) {
    const message = document.querySelector("#communityDetailMessage");
    if (message) message.textContent = error.message;
  }
}

function renderCommunityDetailProfile(member) {
  const fullMode = hasInteractiveFullMode();
  const basicDisabled = fullMode ? "" : "disabled aria-disabled=\"true\"";
  const restrictedLabel = hasFullMode() ? accountRestrictedMessage() : "基础模式仅可浏览，不能操作";
  return `
    <section class="community-detail-profile">
      <div class="community-detail-media">
        <div class="community-detail-cover">
          ${member.coverUrl ? `<img src="${escapeAttribute(member.coverUrl)}" alt="${escapeAttribute(communityDisplayName(member))} 的最新记录">` : "暂无照片"}
        </div>
      </div>
      <div class="community-detail-summary">
        <p class="community-detail-latest">${member.latestAt ? `最近更新 ${communityDateFormat.format(new Date(member.latestAt))}` : "尚未更新"}</p>
        ${member.latestMood ? `<p class="community-detail-mood">“${escapeAttribute(member.latestMood)}”</p>` : ""}
      </div>
      <div class="community-detail-action-row">
        <button class="secondary-button community-detail-replay" type="button" data-community-replay="${escapeAttribute(member.id)}">回放</button>
        <div class="community-detail-actions" aria-label="社区互动">
          ${renderCommunityLikeButton(member, "social")}
          ${communityActionIconButton(fullMode ? `留言，当前 ${member.commentCount} 条` : restrictedLabel, communityCommentIconMarkup(), fullMode ? `data-community-comment-focus="${escapeAttribute(member.id)}"` : basicDisabled, "community-comment-button", member.commentCount)}
          ${communityActionIconButton(fullMode ? "分享" : restrictedLabel, communityShareIconMarkup(), fullMode ? `data-community-share="${escapeAttribute(member.id)}"` : basicDisabled, "community-share-button")}
          ${!member.isSelf ? communityActionIconButton("举报这个社区档案", communityReportIconMarkup(), `data-community-report-member="${escapeAttribute(member.id)}"`, "community-report-button") : ""}
        </div>
      </div>
    </section>
  `;
}

function renderCommunityCommentItem(comment) {
  return `
    <article class="community-comment-item${comment.isOwn ? " is-own" : ""}">
      ${communityAvatarMarkup(comment, "community-comment-avatar")}
      <div class="community-comment-bubble">
        <div class="community-comment-meta">
          <strong>${escapeAttribute(communityDisplayName(comment))}</strong>
          <time datetime="${escapeAttribute(comment.createdAt)}">${communityCommentDateFormat.format(new Date(comment.createdAt))}</time>
          ${comment.isOwn && hasInteractiveFullMode() ? `<button class="community-comment-delete" type="button" data-comment-delete="${escapeAttribute(comment.id)}" aria-label="删除留言" title="删除留言">${communityTrashIconMarkup()}</button>` : ""}
          ${!comment.isOwn ? `<button class="community-comment-report" type="button" data-comment-report="${escapeAttribute(comment.id)}" aria-label="举报留言" title="举报留言">${communityReportIconMarkup()}</button>` : ""}
        </div>
        <p>${escapeAttribute(comment.text)}</p>
      </div>
    </article>
  `;
}

function renderCommunityCommentEmpty() {
  const message = hasFullMode() ? "来做第一个送出鼓励的人。" : "基础模式可浏览公开留言。";
  return `
    <div class="community-comment-empty" role="status">
      <span class="community-comment-empty-icon" aria-hidden="true">${communityCommentIconMarkup()}</span>
      <strong>还没有留言</strong>
      <small>${message}</small>
    </div>
  `;
}

function renderCommunityComments(comments, { showHeading = true } = {}) {
  const composer = hasInteractiveFullMode()
    ? `
      <form class="community-comment-form is-open" id="communityCommentForm">
        <input id="communityCommentInput" type="text" maxlength="${TEXT_LIMITS.comment}" autocomplete="off" enterkeyhint="send" placeholder="写一句鼓励或回应">
        <button type="submit">发送</button>
      </form>
    `
    : "";
  return `
    <section class="community-comments" aria-labelledby="communityCommentsTitle">
      ${showHeading ? `<div class="community-comments-heading">
        <div>
          <h3 id="communityCommentsTitle">留言板</h3>
        </div>
      </div>` : ""}
      <div class="community-comment-list">
        ${comments.length ? comments.map(renderCommunityCommentItem).join("") : renderCommunityCommentEmpty()}
      </div>
      <p class="community-detail-message" id="communityDetailMessage" aria-live="polite"></p>
      ${composer}
    </section>
  `;
}

function renderCommunityCommentsModal(comments = []) {
  if (!els.communityCommentsContent) return;
  els.communityCommentsContent.innerHTML = renderCommunityComments(Array.isArray(comments) ? comments : [], { showHeading: false });
}

function openCommunityComments({ focusInput = false } = {}) {
  if (!state.communityDetail?.member) return;
  state.communityComposerOpen = true;
  renderCommunityCommentsModal(state.communityDetail.comments || []);
  state.communityCommentsOpen = true;
  document.body.classList.add("community-comments-open");
  showSoftOverlay(els.communityCommentsModal);
  if (focusInput) {
    window.setTimeout(() => document.querySelector("#communityCommentInput")?.focus(), prefersReducedMotion() ? 0 : 180);
  }
}

function closeCommunityComments() {
  if (!els.communityCommentsModal || els.communityCommentsModal.classList.contains("hidden")) return;
  state.communityComposerOpen = false;
  hideSoftOverlay(els.communityCommentsModal, () => {
    state.communityCommentsOpen = false;
    document.body.classList.remove("community-comments-open");
    if (els.communityCommentsContent) {
      els.communityCommentsContent.innerHTML = '<div class="community-detail-loading">正在载入留言...</div>';
    }
  });
}

function communityDetailCalendarMarkup(records) {
  return `
    <div class="weight-calendar" aria-label="最近体重涨跌日历">
      ${weightCalendarInnerMarkup(records, { emptyText: "暂无体重涨跌日历。" })}
    </div>
  `;
}

function renderCommunityDetailRecordsSection(member, records) {
  const visibleRecords = Array.isArray(records) ? records : [];
  const latestText = visibleRecords.length
    ? `最近更新 ${dateTimeFormat.format(new Date(visibleRecords[0].timestamp))}`
    : "按时间自动保存";
  const listMarkup = visibleRecords.length
    ? visibleRecords.map((record) => (
      record.type === "food"
        ? renderFoodHistoryItem(record, { readonly: true })
        : renderBodyHistoryItem(record, { readonly: true })
    )).join("")
    : '<div class="chart-empty">暂无公开记录。</div>';

  return `
    <section class="community-detail-record-area" aria-label="公开变化记录">
      ${communityDetailWeightTrendMarkup(member)}
      ${communityDetailCalendarMarkup(visibleRecords)}
      <section class="history-section community-detail-history-section">
        <div class="section-heading">
          <h2>全部记录</h2>
          <div class="history-heading-actions">
            <span>${latestText}</span>
          </div>
        </div>
        <div class="history-list">${listMarkup}</div>
        <p class="community-detail-message" id="communityDetailMessage" aria-live="polite"></p>
      </section>
    </section>
  `;
}

function renderCommunityDetail({ preserveScroll = false, showDefaultChartDetail = true } = {}) {
  const data = state.communityDetail;
  if (!data?.member) return;
  const member = data.member;
  const detailRecords = Array.isArray(data.records) ? data.records : [];
  const previousScrollTop = preserveScroll ? els.communityDetailContent.scrollTop : 0;
  renderCommunityDetailHeading(member);
  els.communityDetailContent.innerHTML = `
    ${renderCommunityDetailProfile(member)}
    ${renderCommunityDetailRecordsSection(member, detailRecords)}
  `;
  const detailChart = els.communityDetailContent.querySelector(".community-detail-weight-chart");
  bindWeightRangeChartInteractions(detailChart, {
    defaultDay: showDefaultChartDetail ? Number(detailChart?.dataset.defaultChartDay) || null : null
  });
  bindWeightCalendarInteractions(els.communityDetailContent.querySelector(".weight-calendar"));
  bindHistoryFoodGalleries();
  if (preserveScroll) {
    els.communityDetailContent.scrollTop = previousScrollTop;
  }
  if (state.communityCommentsOpen) {
    renderCommunityCommentsModal(data.comments || []);
  }
}

function renderCommunityDetailHeading(member = null) {
  const display = member ? communityDisplayName(member) : "QQ用户";
  els.communityDetailTitle.textContent = display;
  if (els.communityDetailAvatar) {
    const avatarUrl = member?.avatarUrl || "";
    renderAvatarElement(els.communityDetailAvatar, avatarUrl, communityAvatarText(member || { alias: display }));
  }
}

async function loadCommunityDetail(memberId) {
  const data = await api(`/api/community/members/${encodeURIComponent(memberId)}`);
  if (state.communityDetailMemberId !== memberId) return;
  state.communityDetail = data;
  renderCommunityDetail();
}

async function openCommunityDetail(memberId) {
  if (!memberId) return;
  if (state.communityDetailCloseTimer) {
    window.clearTimeout(state.communityDetailCloseTimer);
    state.communityDetailCloseTimer = null;
  }
  state.communityDetailClosing = false;
  state.communityDetailMemberId = memberId;
  state.communityDetail = null;
  state.communityComposerOpen = false;
  closeCommunityComments();
  state.feedbackContext = null;
  const url = new URL(window.location.href);
  url.searchParams.set("tab", "community");
  url.searchParams.set("member", memberId);
  window.history.replaceState({}, "", url);
  renderCommunityDetailHeading();
  els.communityDetailContent.innerHTML = '<div class="community-detail-loading">正在载入社区资料...</div>';
  els.communityDetailModal.classList.remove("hidden");
  document.body.classList.add("community-detail-open");
  window.requestAnimationFrame(() => els.communityDetailModal.classList.add("is-open"));
  try {
    await loadCommunityDetail(memberId);
  } catch (error) {
    els.communityDetailContent.innerHTML = `<div class="community-detail-loading">${escapeAttribute(error.message)}</div>`;
  }
}

function closeCommunityDetail(immediate = false) {
  if (els.communityDetailModal.classList.contains("hidden") || state.communityDetailClosing) return;
  closeCommunityComments();
  state.communityDetailClosing = true;
  els.communityDetailModal.classList.remove("is-open");
  const url = new URL(window.location.href);
  url.searchParams.delete("member");
  window.history.replaceState({}, "", url);
  const finish = () => {
    if (state.communityDetailCloseTimer) {
      window.clearTimeout(state.communityDetailCloseTimer);
      state.communityDetailCloseTimer = null;
    }
    els.communityDetailModal.classList.add("hidden");
    document.body.classList.remove("community-detail-open");
    state.communityDetailMemberId = null;
    state.communityDetail = null;
    state.communityComposerOpen = false;
    state.communityDetailClosing = false;
  };
  if (immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
  else state.communityDetailCloseTimer = window.setTimeout(finish, 360);
}

function createTypewriter(target, scrollContainer) {
  let queue = "";
  let renderedText = "";
  let running = false;
  let rafId = 0;
  let waitUntil = 0;
  let cancelled = false;

  const isNearBottom = () => {
    if (!scrollContainer) return false;
    return scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 84;
  };

  const scrollToBottom = (shouldFollow) => {
    if (!scrollContainer || !shouldFollow) return;
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  };

  const step = (now) => {
    if (cancelled) return;
    if (!queue.length) {
      running = false;
      rafId = 0;
      return;
    }
    if (now < waitUntil) {
      rafId = window.requestAnimationFrame(step);
      return;
    }

    const take = queue.length > 180 ? 5 : queue.length > 80 ? 3 : queue.length > 36 ? 2 : 1;
    const next = queue.slice(0, take);
    queue = queue.slice(take);
    const shouldFollow = isNearBottom();
    renderedText += next;
    target.innerHTML = markdownToHtml(renderedText);
    scrollToBottom(shouldFollow);

    const last = next.at(-1) || "";
    const pause = /[。！？]/.test(last) ? 120
      : /[，、；：]/.test(last) ? 46
        : last === "\n" ? 84
          : queue.length > 80 ? 10
            : 22;
    waitUntil = now + pause;
    rafId = window.requestAnimationFrame(step);
  };

  return {
    enqueue(text) {
      if (!text || cancelled) return;
      queue += text;
      target.classList.add("is-typing");
      if (!running) {
        running = true;
        rafId = window.requestAnimationFrame(step);
      }
    },
    finish() {
      return new Promise((resolve) => {
        const poll = () => {
          if (cancelled || (!queue.length && !running)) {
            target.classList.remove("is-typing");
            resolve();
            return;
          }
          window.setTimeout(poll, 80);
        };
        poll();
      });
    },
    cancel() {
      cancelled = true;
      queue = "";
      renderedText = "";
      target.classList.remove("is-typing");
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = 0;
      running = false;
    }
  };
}

function handleAiSseBlock(block, onEvent) {
  let eventName = "message";
  const dataLines = [];
  for (const line of block.split(/\r?\n/)) {
    if (line.startsWith("event:")) {
      eventName = line.slice(6).trim() || "message";
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trim());
    }
  }
  if (!dataLines.length) return;
  let payload = null;
  try {
    payload = JSON.parse(dataLines.join("\n"));
  } catch {
    return;
  }
  onEvent(eventName, payload);
}

async function streamAiSummary() {
  state.aiSummaryAbortController?.abort();
  const controller = new AbortController();
  state.aiSummaryAbortController = controller;
  state.aiSummaryTypewriter?.cancel?.();
  els.aiSummaryOutput.innerHTML = "";
  els.aiSummaryStatus.classList.add("is-loading");
  els.aiSummaryStatus.textContent = "正在获取定位和天气";
  state.aiSummaryTypewriter = createTypewriter(els.aiSummaryOutput, els.aiSummaryContent);
  const environment = await getAiEnvironmentContext();
  els.aiSummaryStatus.textContent = `正在分析 ${state.records.length} 条记录`;

  const response = await fetch(appUrl("/api/ai-summary"), {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ environment }),
    signal: controller.signal
  }).catch((error) => {
    if (error.name === "AbortError") throw error;
    throw new Error("网络连接不稳定，请稍后再试。");
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error = new Error(data.message || "AI 建议生成失败，请稍后再试。");
    error.privacyRequired = Boolean(data.privacyRequired);
    error.privacy = data.privacy || null;
    throw error;
  }
  if (!response.body) {
    throw new Error("当前浏览器不支持流式展示，请升级后再试。");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let receivedText = false;
  let finishReason = "";

  const onEvent = (eventName, payload) => {
    if (eventName === "meta") {
      els.aiSummaryStatus.textContent = `正在分析 ${payload.recordCount || state.records.length} 条记录`;
      return;
    }
    if (eventName === "delta") {
      receivedText = true;
      els.aiSummaryStatus.textContent = "正在生成结论";
      state.aiSummaryTypewriter.enqueue(payload.text || "");
      return;
    }
    if (eventName === "done") {
      finishReason = payload.finishReason || "";
      return;
    }
    if (eventName === "error") {
      throw new Error(payload.message || "AI 建议生成失败，请稍后再试。");
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split(/\n\n/);
    buffer = blocks.pop() || "";
    for (const block of blocks) {
      handleAiSseBlock(block, onEvent);
    }
  }
  if (buffer.trim()) {
    handleAiSseBlock(buffer, onEvent);
  }
  await state.aiSummaryTypewriter.finish();
  els.aiSummaryStatus.classList.remove("is-loading");
  if (finishReason === "length") {
    els.aiSummaryStatus.textContent = "内容达到长度上限，已展示可用部分。";
  } else {
    els.aiSummaryStatus.textContent = receivedText ? "生成完成" : "没有生成可展示内容，请稍后再试。";
  }
}

function openAiSummary() {
  if (!hasFullMode()) {
    showPrivacyConsent(privacyStatus().mode === "unset" ? "initial" : "personal");
    return;
  }
  if (!accountCanInteract()) {
    window.alert(accountRestrictedMessage());
    return;
  }
  if (!state.records.length) {
    window.alert("先保存几条体重或心情记录，再来生成 AI 建议。");
    return;
  }
  state.aiSummaryClosing = false;
  els.aiSummaryStatus.textContent = "正在准备数据...";
  els.aiSummaryStatus.classList.add("is-loading");
  els.aiSummaryOutput.innerHTML = "";
  els.aiSummaryOutput.classList.remove("is-typing");
  els.aiSummaryModal.classList.remove("hidden");
  document.body.classList.add("ai-summary-open");
  window.requestAnimationFrame(() => els.aiSummaryModal.classList.add("is-open"));
  streamAiSummary().catch((error) => {
    if (error.name === "AbortError") return;
    state.aiSummaryTypewriter?.cancel?.();
    els.aiSummaryOutput.innerHTML = "";
    els.aiSummaryStatus.classList.remove("is-loading");
    els.aiSummaryStatus.textContent = error.message || "AI 建议生成失败，请稍后再试。";
    if (error.privacyRequired) {
      showPrivacyConsent("personal");
    }
  });
}

function closeAiSummary(immediate = false) {
  if (!els.aiSummaryModal || els.aiSummaryModal.classList.contains("hidden") || state.aiSummaryClosing) return;
  state.aiSummaryClosing = true;
  state.aiSummaryAbortController?.abort();
  state.aiSummaryAbortController = null;
  state.aiSummaryTypewriter?.cancel?.();
  state.aiSummaryTypewriter = null;
  els.aiSummaryModal.classList.remove("is-open");
  const finish = () => {
    els.aiSummaryModal.classList.add("hidden");
    document.body.classList.remove("ai-summary-open");
    state.aiSummaryClosing = false;
  };
  if (immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
  else window.setTimeout(finish, 360);
}

async function refreshCommunityInteractions(memberId) {
  state.community = await api("/api/community");
  renderCommunity();
  await loadCommunityDetail(memberId);
}

async function toggleCommunityLike(button) {
  if (button.disabled || button.getAttribute("aria-disabled") === "true") {
    return;
  }
  if (!hasInteractiveFullMode()) {
    showBasicModeOnlyMessage();
    return;
  }
  const memberId = button.dataset.communityLike;
  if (!memberId) return;
  button.blur();
  const wasLiked = button.getAttribute("aria-pressed") === "true";
  const liked = !wasLiked;
  const currentCount = Number(button.dataset.likeCount || button.querySelector(".community-like-count")?.textContent || 0);
  const optimisticCount = Math.max(0, currentCount + (liked ? 1 : -1));
  updateCommunityLikeButtonVisual(button, liked, optimisticCount, liked);
  if (liked) {
    markCommunityLikeBurst(memberId);
  } else if (state.communityLikeBurstMemberId === memberId) {
    clearCommunityLikeBurst(memberId);
  }
  setCommunityLikeButtonBusy(button, liked);
  try {
    const data = await api(`/api/community/members/${encodeURIComponent(memberId)}/like`, {
      method: "PUT",
      body: JSON.stringify({ liked })
    });
    applyCommunityMemberStats(memberId, data);
    settleCommunityLikeButton(button, data, liked);
    window.setTimeout(() => {
      renderCommunity();
      renderCommunityDetail();
      void refreshCommunityAfterInteraction(memberId);
    }, liked ? 540 : 0);
  } catch (error) {
    button.disabled = false;
    button.classList.remove("is-pending");
    button.removeAttribute("aria-busy");
    if (liked && state.communityLikeBurstMemberId === memberId) {
      clearCommunityLikeBurst(memberId);
    }
    updateCommunityLikeButtonVisual(button, wasLiked, currentCount, false);
    const message = document.querySelector("#communityDetailMessage");
    if (message) message.textContent = error.message;
  }
}

async function submitCommunityComment(form) {
  if (!hasInteractiveFullMode()) {
    showBasicModeOnlyMessage();
    return;
  }
  const input = form.querySelector("#communityCommentInput");
  const submitButton = form.querySelector('button[type="submit"]');
  const message = document.querySelector("#communityDetailMessage");
  const memberId = state.communityDetailMemberId;
  const { text, error: textError } = normalizeLimitedText(input.value, TEXT_LIMITS.comment, "评论");
  if (textError) {
    if (message) message.textContent = textError;
    return;
  }
  if (!text || !memberId) return;
  submitButton.blur();
  submitButton.disabled = true;
  if (message) message.textContent = "正在发表...";
  try {
    await api(`/api/community/members/${encodeURIComponent(memberId)}/comments`, {
      method: "POST",
      body: JSON.stringify({ text })
    });
    state.communityComposerOpen = true;
    await refreshCommunityInteractions(memberId);
  } catch (error) {
    submitButton.disabled = false;
    if (message) message.textContent = error.message;
  }
}

async function deleteCommunityComment(commentId) {
  if (!hasInteractiveFullMode()) {
    showBasicModeOnlyMessage();
    return;
  }
  const memberId = state.communityDetailMemberId;
  if (!memberId) return;
  if (!window.confirm("确定删除这条留言吗？")) {
    return;
  }
  try {
    await api(`/api/community/members/${encodeURIComponent(memberId)}/comments/${encodeURIComponent(commentId)}`, { method: "DELETE" });
    await refreshCommunityInteractions(memberId);
  } catch (error) {
    const message = document.querySelector("#communityDetailMessage");
    if (message) message.textContent = error.message;
  }
}

function focusCommunityCommentInput() {
  if (!hasInteractiveFullMode()) {
    showBasicModeOnlyMessage();
    return;
  }
  openCommunityComments({ focusInput: true });
}

async function shareCommunityMember(button) {
  if (!hasInteractiveFullMode()) {
    showBasicModeOnlyMessage();
    return;
  }
  const member = state.communityDetail?.member;
  if (!member) return;
  const shareUrl = new URL(appUrl("/"), window.location.origin);
  shareUrl.searchParams.set("tab", "community");
  shareUrl.searchParams.set("member", member.id);
  const shareData = {
    title: `${communityDisplayName(member)} 的变化`,
    text: `我在「${APP_COPY.brand}」看到 ${communityDisplayName(member)} 的变化记录。`,
    url: shareUrl.href
  };
  const message = document.querySelector("#communityDetailMessage");

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      if (message) message.textContent = "已打开分享面板。";
      return;
    }
    await copyTextToClipboard(shareUrl.href, button);
    if (message) message.textContent = "分享链接已复制。";
  } catch (error) {
    if (error.name === "AbortError") return;
    if (message) message.textContent = "分享失败，请稍后再试。";
  }
}

function openFeedbackModal(context = {}) {
  const type = context.type === "report" ? "report" : "feedback";
  state.feedbackContext = {
    type,
    targetType: context.targetType || (type === "report" ? "member" : "system"),
    targetMemberId: context.targetMemberId || "",
    targetCommentId: context.targetCommentId || ""
  };
  els.feedbackKicker.textContent = type === "report" ? "社区安全" : "帮助与安全";
  els.feedbackTitle.textContent = type === "report" ? "举报内容" : "意见反馈";
  els.feedbackDescription.textContent = type === "report"
    ? "请选择原因并补充说明。我们会在管理台中保留记录并进行处理。"
    : "告诉我们遇到的问题或建议。账号受限时也可以通过这里反馈。";
  els.feedbackCategory.value = context.category || (type === "report" ? "content" : "suggestion");
  els.feedbackText.value = "";
  els.feedbackMessage.textContent = "";
  resetFeedbackImages();
  showSoftOverlay(els.feedbackModal);
  document.body.classList.add("feedback-open");
}

function closeFeedbackModal() {
  hideSoftOverlay(els.feedbackModal, () => {
    document.body.classList.remove("feedback-open");
    state.feedbackContext = null;
    resetFeedbackImages();
  });
}

function feedbackImageId() {
  return window.crypto?.randomUUID?.() || `feedback-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function dataUrlByteLength(dataUrl) {
  const base64 = String(dataUrl || "").split(",")[1]?.replace(/\s/g, "") || "";
  if (!base64) return 0;
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor(base64.length * 3 / 4) - padding);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("图片读取失败，请重新选择。"));
    reader.readAsDataURL(file);
  });
}

function loadDataUrlImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("图片无法解析，请换一张图片。"));
    image.src = dataUrl;
  });
}

function compressCanvasToDataUrl(canvas) {
  let quality = FEEDBACK_IMAGE_QUALITY;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  while (dataUrlByteLength(dataUrl) > FEEDBACK_IMAGE_MAX_BYTES && quality > 0.48) {
    quality = Math.max(0.48, quality - 0.08);
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }
  return dataUrl;
}

async function compressFeedbackImage(dataUrl) {
  const image = await loadDataUrlImage(dataUrl);
  let width = image.naturalWidth || image.width;
  let height = image.naturalHeight || image.height;
  if (!width || !height) throw new Error("图片尺寸不正确。");
  const scale = Math.min(1, FEEDBACK_IMAGE_MAX_DIMENSION / Math.max(width, height));
  width = Math.max(1, Math.round(width * scale));
  height = Math.max(1, Math.round(height * scale));

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * (0.86 ** attempt)));
    canvas.height = Math.max(1, Math.round(height * (0.86 ** attempt)));
    const context = canvas.getContext("2d", { alpha: false });
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const compressed = compressCanvasToDataUrl(canvas);
    if (dataUrlByteLength(compressed) <= FEEDBACK_IMAGE_MAX_BYTES || attempt === 3) {
      return compressed;
    }
  }
  return dataUrl;
}

async function normalizeFeedbackImageFile(file) {
  if (!file || !String(file.type || "").startsWith("image/")) {
    throw new Error("请选择图片文件。");
  }
  const rawDataUrl = await readFileAsDataUrl(file);
  const dataUrl = await compressFeedbackImage(rawDataUrl);
  const size = dataUrlByteLength(dataUrl);
  if (size > FEEDBACK_IMAGE_MAX_BYTES) {
    throw new Error("图片仍然过大，请选择更小的图片。");
  }
  return {
    id: feedbackImageId(),
    name: String(file.name || "feedback.jpg").slice(0, 80),
    type: "image/jpeg",
    size,
    dataUrl
  };
}

function resetFeedbackImages() {
  state.feedbackImages = [];
  if (els.feedbackImagesInput) els.feedbackImagesInput.value = "";
  renderFeedbackImages();
}

function renderFeedbackImages() {
  if (!els.feedbackImagePreviewList) return;
  els.feedbackImagePreviewList.innerHTML = state.feedbackImages.map((image) => `
    <figure class="feedback-image-preview">
      <img src="${image.dataUrl}" alt="${escapeHtml(image.name || "反馈图片")}">
      <button type="button" data-feedback-image-remove="${escapeHtml(image.id)}" aria-label="删除图片">×</button>
    </figure>
  `).join("");
  if (els.feedbackImageMeta) {
    els.feedbackImageMeta.textContent = state.feedbackImages.length
      ? `已选择 ${state.feedbackImages.length}/${FEEDBACK_IMAGE_LIMIT} 张`
      : `最多 ${FEEDBACK_IMAGE_LIMIT} 张，用于辅助定位问题。`;
  }
  if (els.feedbackImageAddButton) {
    els.feedbackImageAddButton.disabled = state.feedbackImages.length >= FEEDBACK_IMAGE_LIMIT;
  }
}

async function addFeedbackImages(files) {
  const list = Array.from(files || []);
  if (!list.length) return;
  const remaining = FEEDBACK_IMAGE_LIMIT - state.feedbackImages.length;
  if (remaining <= 0) {
    els.feedbackMessage.textContent = `最多只能上传 ${FEEDBACK_IMAGE_LIMIT} 张图片。`;
    return;
  }
  const selected = list.slice(0, remaining);
  els.feedbackImageAddButton.disabled = true;
  els.feedbackMessage.textContent = "正在处理图片...";
  try {
    for (const file of selected) {
      state.feedbackImages.push(await normalizeFeedbackImageFile(file));
      renderFeedbackImages();
    }
    if (list.length > remaining) {
      els.feedbackMessage.textContent = `已达到 ${FEEDBACK_IMAGE_LIMIT} 张上限，多余图片未加入。`;
    } else {
      els.feedbackMessage.textContent = "";
    }
  } catch (error) {
    els.feedbackMessage.textContent = error.message;
  } finally {
    if (els.feedbackImagesInput) els.feedbackImagesInput.value = "";
    renderFeedbackImages();
  }
}

async function submitFeedbackForm() {
  const context = state.feedbackContext || { type: "feedback", targetType: "system" };
  const { text, error } = normalizeLimitedText(els.feedbackText.value, TEXT_LIMITS.feedback, "说明");
  if (error) {
    els.feedbackMessage.textContent = error;
    return;
  }
  if (!text) {
    els.feedbackMessage.textContent = "请填写具体说明。";
    return;
  }
  els.submitFeedbackButton.disabled = true;
  els.feedbackMessage.textContent = "正在提交...";
  try {
    await api("/api/feedback", {
      method: "POST",
      body: JSON.stringify({
        ...context,
        category: els.feedbackCategory.value || "other",
        text,
        attachments: state.feedbackImages.map(({ name, type, size, dataUrl }) => ({ name, type, size, dataUrl }))
      })
    });
    els.feedbackMessage.textContent = context.type === "report" ? "举报已提交，我们会尽快处理。" : "反馈已提交，谢谢。";
    window.setTimeout(closeFeedbackModal, 520);
  } catch (submitError) {
    els.feedbackMessage.textContent = submitError.message;
  } finally {
    els.submitFeedbackButton.disabled = false;
  }
}

async function loadCommunity({ force = false } = {}) {
  if (state.communityLoading) {
    return;
  }
  if (state.community && !force) {
    renderCommunity();
    els.communityMessage.textContent = "";
    return;
  }
  state.communityLoading = true;
  els.communityMessage.textContent = "正在载入社区...";
  try {
    const data = await api("/api/community");
    state.community = data;
    renderCommunity();
    els.communityMessage.textContent = "";
    if (hasInteractiveFullMode() && !data.own.decisionMade) {
      showCommunityConsent();
    }
  } catch (error) {
    els.communityMessage.textContent = error.message;
  } finally {
    state.communityLoading = false;
  }
}

async function showCommunityView(profile = state.profile, updateUrl = true) {
  if (!profile) {
    return;
  }
  if (!state.isRefreshing) {
    resetPullRefresh();
  }
  state.profile = profile;
  closeCommunityDetail(true);
  closeCamera();
  els.loginView.classList.add("hidden");
  els.dashboardView.classList.add("hidden");
  els.captureView.classList.add("hidden");
  els.settingsView.classList.add("hidden");
  els.communityView.classList.remove("hidden");
  updateActiveTab("community", updateUrl);
  await loadCommunity();
  const requestedMemberId = new URLSearchParams(window.location.search).get("member");
  if (requestedMemberId && state.communityDetailMemberId !== requestedMemberId) {
    openCommunityDetail(requestedMemberId);
  }
}

async function updateCommunitySharing(sharing) {
  if (!hasInteractiveFullMode()) {
    els.communityShareToggle.checked = state.community?.own?.sharing || false;
    showBasicModeOnlyMessage(els.communityMessage);
    return;
  }
  els.communityShareToggle.disabled = true;
  els.declineCommunityShareButton.disabled = true;
  els.acceptCommunityShareButton.disabled = true;
  els.communityMessage.textContent = "正在更新共享设置...";
  try {
    await api("/api/community/settings", {
      method: "PUT",
      body: JSON.stringify({ sharing })
    });
    hideCommunityConsent();
    state.community = null;
    await loadCommunity();
  } catch (error) {
    els.communityMessage.textContent = error.message;
    if (state.community) {
      els.communityShareToggle.checked = state.community.own.sharing;
    }
  } finally {
    els.communityShareToggle.disabled = false;
    els.declineCommunityShareButton.disabled = false;
    els.acceptCommunityShareButton.disabled = false;
  }
}

function showCaptureView(mode = "body") {
  if (!hasFullMode()) {
    showPrivacyConsent("personal");
    return;
  }
  if (!accountCanInteract()) {
    window.alert(accountRestrictedMessage());
    return;
  }
  if (!state.isRefreshing) {
    resetPullRefresh();
  }
  stopCommunityFoodCarousels();
  forcePageScrollTop();
  els.loginView.classList.add("hidden");
  els.dashboardView.classList.add("hidden");
  els.communityView.classList.add("hidden");
  els.settingsView.classList.add("hidden");
  els.captureView.classList.remove("hidden");
  els.bottomTabs.classList.add("hidden");
  document.body.classList.remove("has-bottom-tabs", "is-community-tab");
  scheduleViewportMetricsRefresh();
  const nextMode = mode === "food" ? "food" : "body";
  resetCaptureFlow(nextMode);
  if (state.captureMode === "body") {
    preloadFaceModel(true);
  }
  window.requestAnimationFrame(forcePageScrollTop);
}

function resetCaptureFlow(mode = "body") {
  clearCapturedPhoto();
  clearPendingFoodPhoto({ restoreLive: false });
  clearFoodCaptureState();
  state.captureMode = mode === "food" ? "food" : "body";
  state.facingMode = state.captureMode === "food" ? "environment" : "user";
  state.isCapturing = false;
  els.weightInput.value = "";
  els.moodInput.value = "";
  if (els.foodMoodInput) els.foodMoodInput.value = "";
  els.weightInput.placeholder = latestKnownWeight() === null ? "首次记录请输入体重" : `留空沿用 ${formatWeight(latestKnownWeight())}`;
  els.recordForm.classList.add("hidden");
  els.foodRecordPanel?.classList.add("hidden");
  els.photoPreview.classList.add("hidden");
  els.retakeButton.disabled = true;
  setMessage(els.recordMessage, "", "");
  syncCaptureModeUi();
  renderFoodCapturePanel();

  if (state.stream) {
    els.cameraVideo.classList.remove("hidden");
    els.emptyCamera.classList.add("hidden");
  } else {
    els.cameraVideo.classList.add("hidden");
    els.emptyCamera.classList.remove("hidden");
    els.switchCameraButton.disabled = true;
  }
  updateCaptureButtonState();
}

async function loadRecords({ force = false } = {}) {
  if (state.recordsLoaded && !force) {
    renderAll();
    if (state.historyExpanded) {
      renderHistory();
      updateHistoryLoader();
    } else {
      renderHistoryCollapsed();
    }
    return;
  }

  const data = await api("/api/records");
  state.records = data.records;
  state.recordsLoaded = true;
  renderAll();
  if (state.historyExpanded) {
    await resetHistory();
  } else {
    renderHistoryCollapsed();
  }
}

const PULL_REFRESH_THRESHOLD = 72;
const PULL_REFRESH_MAX = 112;
let pullStartY = null;
let pullStartX = null;
let pullDistance = 0;

function dashboardIsVisible() {
  return state.profile && (
    !els.dashboardView.classList.contains("hidden")
    || !els.communityView.classList.contains("hidden")
  );
}

function pageIsAtTop() {
  return window.scrollY <= 0 && (document.scrollingElement?.scrollTop || 0) <= 0;
}

function forcePageScrollTop() {
  const scrollingElement = document.scrollingElement || document.documentElement;
  try {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  } catch {
    window.scrollTo(0, 0);
  }
  if (scrollingElement) scrollingElement.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function eventStartedInsideModal(event) {
  return event.target instanceof Element && Boolean(event.target.closest(PAGE_GESTURE_MODAL_SELECTOR));
}

function pageGesturesAreBlocked(event = null) {
  return PAGE_GESTURE_BLOCKING_BODY_CLASSES.some((className) => document.body.classList.contains(className))
    || (event ? eventStartedInsideModal(event) : false);
}

function setPullRefreshDistance(distance) {
  pullDistance = Math.max(0, Math.min(PULL_REFRESH_MAX, distance));
  const ready = pullDistance >= PULL_REFRESH_THRESHOLD;
  document.documentElement.style.setProperty("--pull-distance", `${pullDistance}px`);
  document.documentElement.style.setProperty("--pull-offset", `${(pullDistance * 0.24).toFixed(1)}px`);
  document.documentElement.style.setProperty("--pull-rotation", `${pullDistance * 2}deg`);
  document.body.classList.toggle("is-pulling", pullDistance > 0);
  document.body.classList.toggle("is-pull-ready", ready);
  els.pullRefresh.setAttribute("aria-hidden", pullDistance > 0 ? "false" : "true");
  if (!state.isRefreshing) {
    els.pullRefreshText.textContent = ready ? "松开刷新" : "下拉刷新";
  }
}

function resetPullRefresh() {
  pullStartY = null;
  pullStartX = null;
  setPullRefreshDistance(0);
  document.body.classList.remove("is-refreshing", "is-pull-ready");
}

async function refreshDashboard() {
  if (state.isRefreshing || !dashboardIsVisible()) {
    return;
  }

  state.isRefreshing = true;
  document.body.classList.add("is-refreshing");
  document.body.classList.remove("is-pull-ready");
  setPullRefreshDistance(58);
  els.pullRefreshText.textContent = "正在刷新";

  try {
    if (state.activeTab === "community") {
      state.community = null;
      await loadCommunity({ force: true });
    } else {
      await loadRecords({ force: true });
    }
    els.pullRefreshText.textContent = "刷新完成";
  } catch (error) {
    els.pullRefreshText.textContent = error.message || "刷新失败";
  } finally {
    window.setTimeout(() => {
      state.isRefreshing = false;
      resetPullRefresh();
    }, 520);
  }
}

function currentViewAllowsForegroundSync() {
  return Boolean(
    state.profile
    && document.visibilityState === "visible"
    && els.captureView.classList.contains("hidden")
    && els.loginView.classList.contains("hidden")
  );
}

async function syncActiveViewFromServer({ force = false } = {}) {
  if (!currentViewAllowsForegroundSync() || state.foregroundSyncing || state.isRefreshing) {
    return;
  }
  const now = Date.now();
  if (!force && now - state.lastForegroundSyncAt < FOREGROUND_SYNC_INTERVAL_MS) {
    return;
  }

  state.foregroundSyncing = true;
  state.lastForegroundSyncAt = now;
  try {
    const data = await api("/api/me");
    state.profile = data.profile;
    if (state.activeTab === "community" && !els.communityView.classList.contains("hidden")) {
      state.community = null;
      await loadCommunity({ force: true });
      if (state.communityDetailMemberId) {
        await loadCommunityDetail(state.communityDetailMemberId);
      }
    } else if (state.activeTab === "personal" && !els.dashboardView.classList.contains("hidden") && hasFullMode()) {
      await loadRecords({ force: true });
    } else if (state.activeTab === "settings" && !els.settingsView.classList.contains("hidden")) {
      renderSettings();
    }
  } catch (error) {
    if (error.status === 401) {
      showLogin();
    }
  } finally {
    state.foregroundSyncing = false;
  }
}

function handlePullStart(event) {
  if (pageGesturesAreBlocked(event) || state.isRefreshing || !dashboardIsVisible() || !pageIsAtTop() || event.touches.length !== 1) {
    resetPullRefresh();
    return;
  }
  pullStartY = event.touches[0].clientY;
  pullStartX = event.touches[0].clientX;
}

function handlePullMove(event) {
  if (pageGesturesAreBlocked(event)) {
    resetPullRefresh();
    return;
  }
  if (pullStartY === null || event.touches.length !== 1 || state.isRefreshing) {
    return;
  }

  const deltaY = event.touches[0].clientY - pullStartY;
  const deltaX = event.touches[0].clientX - pullStartX;
  if (Math.abs(deltaX) > Math.max(12, Math.abs(deltaY))) {
    resetPullRefresh();
    return;
  }
  if (deltaY <= 0 || !pageIsAtTop()) {
    setPullRefreshDistance(0);
    return;
  }

  event.preventDefault();
  setPullRefreshDistance(deltaY * 0.52);
}

function handlePullEnd(event) {
  if (pageGesturesAreBlocked(event)) {
    resetPullRefresh();
    return;
  }
  if (pullStartY === null || state.isRefreshing) {
    return;
  }
  const shouldRefresh = pullDistance >= PULL_REFRESH_THRESHOLD;
  pullStartY = null;
  pullStartX = null;
  if (shouldRefresh) {
    void refreshDashboard();
  } else {
    resetPullRefresh();
  }
}

const edgeSpringState = {
  target: null,
  startX: 0,
  startY: 0,
  boundaryY: null,
  active: false,
  horizontalLocked: false,
  releaseTimer: null,
  releaseTarget: null
};

function pageScrollElement() {
  return document.scrollingElement || document.documentElement;
}

function viewportHeight() {
  return window.visualViewport?.height || window.innerHeight;
}

function elementCanScrollVertically(element) {
  if (!(element instanceof Element)) return false;
  const overflowY = window.getComputedStyle(element).overflowY;
  return /(auto|scroll|overlay)/.test(overflowY) && element.scrollHeight > element.clientHeight + 1;
}

function edgeSpringTargetFromEvent(event) {
  if (!(event.target instanceof Element) || isTextEditingTarget(event.target)) {
    return null;
  }
  const chartScroller = event.target.closest(".chart-scroll");
  if (chartScroller && !chartScroller.closest(".community-detail-weight-chart")) {
    return null;
  }

  const innerScroller = event.target.closest(EDGE_SPRING_SCROLLABLE_SELECTOR);
  if (elementCanScrollVertically(innerScroller)) {
    return {
      isPage: false,
      element: innerScroller,
      scrollElement: innerScroller,
      maxScroll: () => Math.max(0, innerScroller.scrollHeight - innerScroller.clientHeight),
      scrollTop: () => innerScroller.scrollTop
    };
  }

  if (eventStartedInsideModal(event) || pageGesturesAreBlocked()) {
    return null;
  }

  const scrollElement = pageScrollElement();
  return {
    isPage: true,
    element: els.appShell,
    scrollElement,
    maxScroll: () => Math.max(0, scrollElement.scrollHeight - viewportHeight()),
    scrollTop: () => window.scrollY || scrollElement.scrollTop || 0
  };
}

function dampEdgeSpringDistance(distance) {
  const sign = Math.sign(distance);
  const absolute = Math.abs(distance);
  return sign * EDGE_SPRING_MAX * (1 - Math.exp(-absolute / 78));
}

function clearEdgeSpringRelease() {
  if (edgeSpringState.releaseTimer) {
    window.clearTimeout(edgeSpringState.releaseTimer);
    edgeSpringState.releaseTimer = null;
  }
  const target = edgeSpringState.releaseTarget;
  if (!target) return;
  if (target.isPage) {
    document.documentElement.classList.remove("is-page-edge-spring-releasing");
    document.documentElement.style.removeProperty("--page-edge-spring-y");
  } else {
    target.element.classList.remove("is-edge-spring-releasing");
    target.element.style.removeProperty("--edge-spring-y");
  }
  edgeSpringState.releaseTarget = null;
}

function setEdgeSpringOffset(target, offset) {
  if (!target?.element) return;
  const value = `${offset.toFixed(1)}px`;
  if (target.isPage) {
    document.documentElement.style.setProperty("--page-edge-spring-y", value);
  } else {
    target.element.style.setProperty("--edge-spring-y", value);
  }
}

function markEdgeSpringDragging(target, dragging) {
  if (!target?.element) return;
  if (target.isPage) {
    document.documentElement.classList.toggle("is-page-edge-spring-dragging", dragging);
  } else {
    target.element.classList.add("edge-spring-target");
    target.element.classList.toggle("is-edge-spring-dragging", dragging);
  }
}

function releaseEdgeSpring() {
  const target = edgeSpringState.target;
  if (!target) return;
  markEdgeSpringDragging(target, false);
  if (target.isPage) {
    document.documentElement.classList.add("is-page-edge-spring-releasing");
  } else {
    target.element.classList.add("is-edge-spring-releasing");
  }
  setEdgeSpringOffset(target, 0);
  edgeSpringState.releaseTarget = target;
  edgeSpringState.releaseTimer = window.setTimeout(() => {
    if (target.isPage) {
      document.documentElement.classList.remove("is-page-edge-spring-releasing");
      document.documentElement.style.removeProperty("--page-edge-spring-y");
    } else {
      target.element.classList.remove("is-edge-spring-releasing");
      target.element.style.removeProperty("--edge-spring-y");
    }
    edgeSpringState.releaseTimer = null;
    edgeSpringState.releaseTarget = null;
  }, EDGE_SPRING_RELEASE_MS);
}

function resetEdgeSpring({ release = true } = {}) {
  if (release && edgeSpringState.active) {
    releaseEdgeSpring();
  } else if (edgeSpringState.target) {
    markEdgeSpringDragging(edgeSpringState.target, false);
    setEdgeSpringOffset(edgeSpringState.target, 0);
  }
  edgeSpringState.target = null;
  edgeSpringState.boundaryY = null;
  edgeSpringState.active = false;
  edgeSpringState.horizontalLocked = false;
}

function handleEdgeSpringStart(event) {
  if (event.touches.length !== 1) {
    resetEdgeSpring({ release: false });
    return;
  }
  const target = edgeSpringTargetFromEvent(event);
  if (!target) {
    resetEdgeSpring({ release: false });
    return;
  }
  clearEdgeSpringRelease();
  edgeSpringState.target = target;
  edgeSpringState.startX = event.touches[0].clientX;
  edgeSpringState.startY = event.touches[0].clientY;
  edgeSpringState.boundaryY = null;
  edgeSpringState.active = false;
  edgeSpringState.horizontalLocked = false;
}

function handleEdgeSpringMove(event) {
  const target = edgeSpringState.target;
  if (!target || event.touches.length !== 1 || state.isRefreshing) {
    return;
  }

  const touch = event.touches[0];
  const deltaX = touch.clientX - edgeSpringState.startX;
  const deltaY = touch.clientY - edgeSpringState.startY;
  if (!edgeSpringState.active && Math.abs(deltaX) > Math.max(14, Math.abs(deltaY) * 1.12)) {
    edgeSpringState.horizontalLocked = true;
    resetEdgeSpring({ release: false });
    return;
  }
  if (edgeSpringState.horizontalLocked) return;

  const scrollTop = target.scrollTop();
  const maxScroll = target.maxScroll();
  const atTop = scrollTop <= 0.5;
  const atBottom = scrollTop >= maxScroll - 0.5;
  const pullingTop = deltaY > 0 && atTop;
  const pullingBottom = deltaY < 0 && atBottom;

  if (target.isPage && pullingTop && dashboardIsVisible()) {
    resetEdgeSpring({ release: false });
    return;
  }

  if (!pullingTop && !pullingBottom) {
    if (edgeSpringState.active) resetEdgeSpring();
    edgeSpringState.boundaryY = null;
    return;
  }

  if (edgeSpringState.boundaryY === null) {
    edgeSpringState.boundaryY = touch.clientY;
  }

  const edgeDelta = touch.clientY - edgeSpringState.boundaryY;
  if ((pullingTop && edgeDelta <= 0) || (pullingBottom && edgeDelta >= 0)) {
    resetEdgeSpring();
    return;
  }

  if (event.cancelable) event.preventDefault();
  edgeSpringState.active = true;
  markEdgeSpringDragging(target, true);
  setEdgeSpringOffset(target, dampEdgeSpringDistance(edgeDelta));
}

function handleEdgeSpringEnd() {
  resetEdgeSpring();
}

function renderAll(highlightId = null) {
  renderReplayButton();
  renderAiAdviceButton();
  renderChart(highlightId);
  renderWeightCalendar();
}

function weightRecords() {
  return state.records.filter((record) => Number.isFinite(record.weight));
}

function photoRecords() {
  return state.records.filter((record) => record.photoUrl);
}

function formatWeight(weight) {
  return Number.isFinite(weight) ? `${weight.toFixed(2)} kg` : "-";
}

function formatCommunityCount(count) {
  const numeric = Number.isFinite(count) ? Math.max(0, Math.round(count)) : 0;
  return numeric > 99 ? "99+" : String(numeric);
}

function latestKnownWeight() {
  const weights = weightRecords();
  return weights.at(-1)?.weight ?? null;
}

function normalizeLimitedText(value, maxLength, label) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (Array.from(text).length > maxLength) {
    return { text: "", error: `${label}最多 ${maxLength} 个字。` };
  }
  return { text, error: "" };
}

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function cssEscape(value) {
  return window.CSS?.escape ? window.CSS.escape(String(value)) : String(value).replace(/[^A-Za-z0-9_-]/g, "\\$&");
}

function safeMarkdownUrl(value) {
  try {
    const url = new URL(String(value || ""), window.location.origin);
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function renderInlineMarkdown(value) {
  let text = escapeAttribute(value);
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  text = text.replace(/(^|[^\*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) => {
    const safeUrl = safeMarkdownUrl(url);
    return safeUrl ? `<img src="${escapeAttribute(safeUrl)}" alt="${alt}" loading="lazy" decoding="async">` : "";
  });
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    const safeUrl = safeMarkdownUrl(url);
    return safeUrl ? `<a href="${escapeAttribute(safeUrl)}" target="_blank" rel="noopener noreferrer">${label}</a>` : label;
  });
  return text;
}

function splitMarkdownTableRow(line) {
  return line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isMarkdownTableSeparator(line) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function renderMarkdownTable(lines, startIndex) {
  const header = splitMarkdownTableRow(lines[startIndex] || "");
  let index = startIndex + 2;
  const rows = [];
  while (index < lines.length && /\|/.test(lines[index]) && lines[index].trim()) {
    rows.push(splitMarkdownTableRow(lines[index]));
    index += 1;
  }
  const table = `
    <div class="markdown-table-wrap">
      <table>
        <thead><tr>${header.map((cell) => `<th>${renderInlineMarkdown(cell)}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map((row) => `<tr>${header.map((_, cellIndex) => `<td>${renderInlineMarkdown(row[cellIndex] || "")}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
  return { html: table, nextIndex: index };
}

function markdownToHtml(markdown) {
  const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let list = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${renderInlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!list) return;
    html.push(`<${list.type}>${list.items.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join("")}</${list.type}>`);
    list = null;
  };

  for (let index = 0; index < lines.length;) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      index += 1;
      continue;
    }

    if (/\|/.test(line) && isMarkdownTableSeparator(lines[index + 1] || "")) {
      flushParagraph();
      flushList();
      const rendered = renderMarkdownTable(lines, index);
      html.push(rendered.html);
      index = rendered.nextIndex;
      continue;
    }

    const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = Math.min(4, heading[1].length + 1);
      html.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
      index += 1;
      continue;
    }

    const quote = trimmed.match(/^>\s+(.+)$/);
    if (quote) {
      flushParagraph();
      flushList();
      html.push(`<blockquote>${renderInlineMarkdown(quote[1])}</blockquote>`);
      index += 1;
      continue;
    }

    const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    if (ordered || unordered) {
      flushParagraph();
      const type = ordered ? "ol" : "ul";
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push((ordered || unordered)[1]);
      index += 1;
      continue;
    }

    paragraph.push(trimmed);
    index += 1;
  }

  flushParagraph();
  flushList();
  return html.join("");
}

async function copyTextToClipboard(text, button = null) {
  const value = String(text || "");
  if (!value) return;

  try {
    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(value);
        copied = true;
      } catch {
        copied = false;
      }
    }

    const legacyCopy = () => {
      const input = document.createElement("textarea");
      input.value = value;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.top = "0";
      input.style.left = "0";
      input.style.width = "1px";
      input.style.height = "1px";
      input.style.opacity = "0";
      document.body.append(input);
      input.focus();
      input.select();
      input.setSelectionRange(0, value.length);
      const copied = document.execCommand("copy");
      input.remove();
      return copied;
    };

    if (!copied) {
      copied = legacyCopy();
    }
    if (!copied) {
      throw new Error("copy failed");
    }

    if (button) {
      button.classList.add("is-copied");
      const previousLabel = button.getAttribute("aria-label") || "复制确认文字";
      button.setAttribute("aria-label", "已复制");
      window.setTimeout(() => {
        button.classList.remove("is-copied");
        button.setAttribute("aria-label", previousLabel);
      }, 1200);
    }
  } catch {
    if (button) {
      button.classList.add("is-copy-failed");
      window.setTimeout(() => button.classList.remove("is-copy-failed"), 1200);
    }
  }
}

function renderReplayButton() {
  els.replayButton.disabled = photoRecords().length === 0;
}

function renderAiAdviceButton() {
  if (!els.aiAdviceButton) return;
  const canAnalyze = hasFullMode() && accountCanInteract() && state.records.some((record) => Number.isFinite(record.weight) || record.mood);
  els.aiAdviceButton.disabled = !canAnalyze;
  els.aiAdviceButton.querySelector(".ai-advice-action").textContent = canAnalyze ? "总结" : "暂无";
}

function localDayStart(time) {
  const date = new Date(time);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function calendarWeightMeta(records) {
  const weights = (Array.isArray(records) ? records : [])
    .filter((record) => record.type !== "food" && Number.isFinite(record.weight))
    .sort((left, right) => new Date(left.timestamp) - new Date(right.timestamp));
  if (!weights.length) return null;

  const dayMs = 24 * 60 * 60 * 1000;
  const latestDay = Math.max(localDayStart(Date.now()), localDayStart(new Date(weights.at(-1).timestamp).getTime()));
  const endDay = latestDay;
  const startDay = endDay - (WEIGHT_CALENDAR_DAYS - 1) * dayMs;
  const latestByDay = new Map();
  for (const record of weights) {
    const day = localDayStart(new Date(record.timestamp).getTime());
    const existing = latestByDay.get(day);
    if (!existing || new Date(record.timestamp) > new Date(existing.timestamp)) {
      latestByDay.set(day, record);
    }
  }

  const comparable = [...latestByDay.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([day, record], index, all) => {
      const previous = all[index - 1]?.[1] || null;
      return {
        day,
        record,
        delta: previous ? record.weight - previous.weight : 0,
        hasPrevious: Boolean(previous)
      };
    });
  const visibleComparable = comparable.filter((entry) => entry.day >= startDay && entry.day <= endDay);

  return {
    dayMs,
    dayCount: WEIGHT_CALENDAR_DAYS,
    startDay,
    selectedDay: visibleComparable.at(-1)?.day ?? null,
    maxAbsDelta: Math.max(0.1, ...visibleComparable.map((entry) => Math.abs(entry.delta))),
    metaByDay: new Map(visibleComparable.map((entry) => [entry.day, entry]))
  };
}

function calendarWeightDirection(meta) {
  if (!meta?.hasPrevious) return "起始记录";
  if (meta.delta > 0.005) return "上涨";
  if (meta.delta < -0.005) return "下降";
  return "持平";
}

function calendarWeightDeltaText(meta) {
  if (!meta?.hasPrevious) return "首条记录";
  return `${meta.delta > 0 ? "+" : ""}${meta.delta.toFixed(2)} kg`;
}

function calendarWeightTitle(day, meta) {
  const date = new Date(day);
  return `${date.getMonth() + 1}月${date.getDate()}日，${formatWeight(meta.record.weight)}，${calendarWeightDirection(meta)}${meta.hasPrevious ? ` ${calendarWeightDeltaText(meta)}` : ""}`;
}

function weightCalendarInnerMarkup(records, { emptyText = "暂无体重涨跌日历。" } = {}) {
  const calendar = calendarWeightMeta(records);
  if (!calendar) {
    return `<div class="calendar-empty">${emptyText}</div>`;
  }

  const weekLabels = ["一", "二", "三", "四", "五", "六", "日"].map((label) => `<span>${label}</span>`).join("");
  const cells = Array.from({ length: calendar.dayCount }, (_, index) => calendar.startDay + index * calendar.dayMs).map((day) => {
    const date = new Date(day);
    const meta = calendar.metaByDay.get(day);
    if (!meta) {
      return `<span class="calendar-day is-empty" aria-label="${date.getMonth() + 1}月${date.getDate()}日无体重记录"><span>${date.getDate()}</span></span>`;
    }
    const isUp = meta.hasPrevious && meta.delta > 0.005;
    const isDown = meta.hasPrevious && meta.delta < -0.005;
    const level = Math.min(1, Math.abs(meta.delta) / calendar.maxAbsDelta);
    const mix = Math.round(46 + level * 44);
    const color = isUp
      ? `color-mix(in srgb, var(--calendar-gain) ${mix}%, rgba(255, 255, 255, 0.72))`
      : isDown
        ? `color-mix(in srgb, var(--calendar-loss) ${mix}%, rgba(255, 255, 255, 0.72))`
        : "var(--calendar-neutral)";
    const selected = day === calendar.selectedDay;
    const title = calendarWeightTitle(day, meta);
    return `
      <button
        class="calendar-day${isUp ? " is-up" : ""}${isDown ? " is-down" : ""}${selected ? " is-selected" : ""}"
        type="button"
        data-calendar-day="${day}"
        data-weight="${meta.record.weight.toFixed(2)}"
        data-delta="${meta.hasPrevious ? meta.delta.toFixed(2) : ""}"
        data-direction="${escapeAttribute(calendarWeightDirection(meta))}"
        style="--day-color: ${color};"
        title="${escapeAttribute(title)}"
        aria-label="${escapeAttribute(title)}"
        aria-pressed="${selected ? "true" : "false"}"
      >
        <span>${date.getDate()}</span>
        <small>${meta.hasPrevious ? calendarWeightDeltaText(meta) : "起始"}</small>
      </button>
    `;
  }).join("");

  return `
    <div class="calendar-head">
      <span>最近 30 天</span>
      <strong>体重涨跌日历</strong>
    </div>
    <div class="calendar-detail is-visible" role="status" aria-live="polite">
      <span class="calendar-detail-date"></span>
      <span>体重 <strong class="calendar-detail-weight"></strong></span>
      <span class="calendar-detail-change"></span>
    </div>
    <div class="calendar-weekdays" aria-hidden="true">${weekLabels}</div>
    <div class="calendar-grid">${cells}</div>
  `;
}

function updateWeightCalendarDetail(container, button) {
  if (!container || !button || button.classList.contains("is-empty")) return;
  const day = Number(button.dataset.calendarDay);
  const date = new Date(day);
  for (const item of container.querySelectorAll(".calendar-day[data-calendar-day]")) {
    const selected = item === button;
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-pressed", selected ? "true" : "false");
  }
  const detail = container.querySelector(".calendar-detail");
  if (!detail) return;
  detail.classList.add("is-visible");
  detail.querySelector(".calendar-detail-date").textContent = `${date.getMonth() + 1}月${date.getDate()}日`;
  detail.querySelector(".calendar-detail-weight").textContent = `${Number(button.dataset.weight).toFixed(2)} kg`;
  const delta = parseNumberLike(button.dataset.delta);
  const direction = button.dataset.direction || "起始记录";
  detail.querySelector(".calendar-detail-change").textContent = Number.isFinite(delta)
    ? `${direction} ${delta > 0 ? "+" : ""}${delta.toFixed(2)} kg`
    : direction;
}

function bindWeightCalendarInteractions(container) {
  if (!container) return;
  const selected = container.querySelector(".calendar-day.is-selected[data-calendar-day]")
    || [...container.querySelectorAll(".calendar-day[data-calendar-day]")].at(-1);
  if (selected) updateWeightCalendarDetail(container, selected);
  if (container.dataset.calendarBound === "1") return;
  container.dataset.calendarBound = "1";
  container.addEventListener("click", (event) => {
    const button = event.target.closest(".calendar-day[data-calendar-day]");
    if (button) updateWeightCalendarDetail(container, button);
  });
  container.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const button = event.target.closest(".calendar-day[data-calendar-day]");
    if (!button) return;
    event.preventDefault();
    updateWeightCalendarDetail(container, button);
  });
}

function calculateWeightAxis(records) {
  const values = records.map((record) => record.weight);
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const dataRange = dataMax - dataMin;
  const padding = dataRange > 0 ? dataRange * 0.1 : 1;
  const min = Math.max(0, dataMin - padding);
  const max = dataMax + padding;
  const span = max - min;
  const decimals = span < 1 ? 2 : span < 10 ? 1 : 0;
  const ticks = Array.from({ length: 5 }, (_, index) => max - (span * index) / 4);

  return { min, max, decimals, ticks, dataMin, dataMax };
}

function weightRangeChartMarkup({
  axisLabels = "",
  bars = "",
  dayLabels = "",
  gridLines = "",
  baseline = "",
  width,
  height,
  ariaLabel,
  frameClass = ""
}) {
  const hasAxis = Boolean(axisLabels);
  const frameClasses = [
    "chart-frame",
    hasAxis ? "" : "has-no-axis",
    frameClass
  ].filter(Boolean).join(" ");

  return `
    <div class="${frameClasses}">
      ${hasAxis ? `<div class="chart-y-axis" aria-hidden="true">${axisLabels}</div>` : ""}
      <div class="chart-scroll">
        <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeAttribute(ariaLabel)}" style="width: ${width}px;">
          ${gridLines}
          ${baseline}
          ${bars}
          ${dayLabels}
        </svg>
      </div>
      <div class="chart-detail" role="status" aria-live="polite" aria-hidden="true">
        <span class="chart-detail-date"></span>
        <span>最高 <strong class="chart-detail-max"></strong></span>
        <span>最低 <strong class="chart-detail-min"></strong></span>
      </div>
    </div>
  `;
}

function bindWeightRangeChartInteractions(container, {
  dateFormatter = (day) => new Date(day).toLocaleDateString("zh-CN", { month: "long", day: "numeric" }),
  defaultDay = null
} = {}) {
  const svg = container?.querySelector("svg");
  const detail = container?.querySelector(".chart-detail");
  const scroller = container?.querySelector(".chart-scroll");
  if (!svg || !detail) return null;

  let detailHideTimer = null;
  const syncBarSelection = (selectedDay = null) => {
    for (const bar of svg.querySelectorAll(".chart-weight-bar")) {
      const selected = selectedDay !== null && Number(bar.dataset.day) === selectedDay;
      const baseWidth = bar.dataset.baseWidth || (bar.classList.contains("is-active") ? "10" : "8");
      bar.classList.toggle("is-selected", selected);
      bar.setAttribute("stroke", bar.dataset.color);
      bar.setAttribute("stroke-width", selected ? bar.dataset.selectedWidth || "11" : baseWidth);
      bar.setAttribute("opacity", selected ? "1" : bar.classList.contains("is-active") ? "1" : "0.76");
    }
  };
  const revealDetail = () => {
    const alreadyVisible = detail.classList.contains("is-visible");
    if (detailHideTimer) {
      window.clearTimeout(detailHideTimer);
      detailHideTimer = null;
    }
    detail.setAttribute("aria-hidden", "false");

    if (alreadyVisible || prefersReducedMotion()) {
      detail.classList.add("is-visible");
      return;
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => detail.classList.add("is-visible"));
    });
  };
  const hideDetail = () => {
    if (!detail.classList.contains("is-visible")) return;
    syncBarSelection(null);
    detail.classList.remove("is-visible");
    detail.setAttribute("aria-hidden", "true");

    if (detailHideTimer) window.clearTimeout(detailHideTimer);
    if (prefersReducedMotion()) {
      detailHideTimer = null;
    } else {
      detailHideTimer = window.setTimeout(() => {
        detailHideTimer = null;
      }, SOFT_OVERLAY_TRANSITION_MS);
    }
  };
  const showDetail = (target) => {
    const day = Number(target.dataset.day);
    const min = Number(target.dataset.min);
    const max = Number(target.dataset.max);

    syncBarSelection(day);

    detail.querySelector(".chart-detail-date").textContent = dateFormatter(day);
    detail.querySelector(".chart-detail-max").textContent = Number.isFinite(max) ? `${max.toFixed(2)} kg` : "--";
    detail.querySelector(".chart-detail-min").textContent = Number.isFinite(min) ? `${min.toFixed(2)} kg` : "--";
    revealDetail();
  };

  svg.addEventListener("click", (event) => {
    const target = event.target.closest(".chart-hit-area");
    if (target) {
      showDetail(target);
    } else {
      hideDetail();
    }
  });
  svg.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    const target = event.target.closest(".chart-hit-area");
    if (target) {
      event.preventDefault();
      showDetail(target);
    }
  });
  svg.addEventListener("focusout", (event) => {
    if (!svg.contains(event.relatedTarget)) hideDetail();
  });
  scroller?.addEventListener("scroll", hideDetail, { passive: true });

  const defaultTarget = defaultDay === null
    ? null
    : svg.querySelector(`.chart-hit-area[data-day="${cssEscape(String(defaultDay))}"]`);
  if (defaultTarget) {
    window.setTimeout(() => showDetail(defaultTarget), 820);
  }

  return { hideDetail };
}

function renderWeightCalendar() {
  els.weightCalendar.innerHTML = weightCalendarInnerMarkup(chartWeightRecords(), {
    emptyText: "保存体重后会出现每日涨跌日历。"
  });
  bindWeightCalendarInteractions(els.weightCalendar);
}

function renderChart(highlightId = null) {
  const weights = [...chartWeightRecords()].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  if (weights.length < 2) {
    els.weightChart.innerHTML = '<div class="chart-empty">至少保存两次体重后会出现变化图。</div>';
    return;
  }

  const viewportWidth = Math.max(320, Math.floor(els.weightChart.clientWidth || 680));
  const height = 276;
  const axisWidth = 48;
  const plotViewportWidth = Math.max(260, viewportWidth - axisWidth);
  const padLeft = 4;
  const padRight = 4;
  const padTop = 56;
  const padBottom = 38;
  const dayMs = 24 * 60 * 60 * 1000;
  const firstDay = localDayStart(new Date(weights[0].timestamp).getTime());
  const lastDay = localDayStart(new Date(weights.at(-1).timestamp).getTime());
  const dayCount = Math.max(1, Math.round((lastDay - firstDay) / dayMs) + 1);
  const visibleDays = Math.max(10, Math.round((plotViewportWidth / 390) * 10));
  const dayStep = (plotViewportWidth - padLeft - padRight) / visibleDays;
  const width = Math.ceil(Math.max(plotViewportWidth, padLeft + padRight + dayCount * dayStep));

  const groupedByDay = new Map();
  for (const record of weights) {
    const time = new Date(record.timestamp).getTime();
    const day = localDayStart(time);
    const index = Math.round((day - firstDay) / dayMs);
    const group = groupedByDay.get(day) || {
      day,
      index,
      min: record.weight,
      max: record.weight,
      latest: record.weight,
      count: 0,
      recordIds: []
    };
    group.min = Math.min(group.min, record.weight);
    group.max = Math.max(group.max, record.weight);
    group.latest = record.weight;
    group.count += 1;
    group.recordIds.push(record.id);
    groupedByDay.set(day, group);
  }

  const groups = [...groupedByDay.values()].sort((a, b) => a.day - b.day);
  const requestedGroup = highlightId ? groups.find((group) => group.recordIds.includes(highlightId)) : null;
  const fallbackGroup = groups.at(-1) || null;
  const defaultHighlightId = requestedGroup
    ? highlightId
    : fallbackGroup?.recordIds?.at(-1) || null;
  const chartBottom = height - padBottom;
  const chartHeight = chartBottom - padTop;
  const axis = calculateWeightAxis(weights);
  const yForWeight = (weight) => {
    const normalizedWeight = Math.max(axis.min, Math.min(axis.max, weight));
    return chartBottom - ((normalizedWeight - axis.min) / (axis.max - axis.min)) * chartHeight;
  };
  const gridLines = axis.ticks.map((tick) => `
    <line x1="0" y1="${yForWeight(tick)}" x2="${width}" y2="${yForWeight(tick)}" stroke="var(--chart-grid)" />
  `).join("");
  const axisLabels = axis.ticks.map((tick) => `
    <span style="top: ${yForWeight(tick)}px">${tick.toFixed(axis.decimals)}</span>
  `).join("");
  const dayLabels = Array.from({ length: dayCount }, (_, index) => {
    const date = new Date(firstDay + index * dayMs);
    const x = padLeft + (index + 0.5) * dayStep;
    return `<text class="chart-day-label" x="${x}" y="${height - 12}" text-anchor="middle">${date.getDate()}</text>`;
  }).join("");

  let previousLatest = null;
  const bars = groups.map((group) => {
    const x = padLeft + (group.index + 0.5) * dayStep;
    const active = defaultHighlightId ? group.recordIds.includes(defaultHighlightId) : false;
    const isLoss = previousLatest === null || group.latest <= previousLatest;
    previousLatest = group.latest;
    const baseColor = isLoss ? "var(--chart-loss)" : "var(--chart-gain)";
    let topY = yForWeight(group.max);
    let bottomY = yForWeight(group.min);
    if (Math.abs(bottomY - topY) < 7) {
      const centerY = (topY + bottomY) / 2;
      topY = Math.max(padTop, centerY - 3.5);
      bottomY = Math.min(chartBottom, centerY + 3.5);
    }
    const dateLabel = new Date(group.day).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" });
    const title = `${dateLabel}，最低 ${group.min.toFixed(2)} kg，最高 ${group.max.toFixed(2)} kg`;
    const hitWidth = Math.max(24, dayStep * 0.72);
    return `
      <line class="chart-weight-bar${active ? " is-active" : ""}" data-day="${group.day}" data-min="${group.min}" data-max="${group.max}" data-color="${baseColor}" data-base-width="7.2" data-selected-width="9" x1="${x}" y1="${topY}" x2="${x}" y2="${bottomY}" stroke="${baseColor}" stroke-width="${active ? 9 : 7.2}" stroke-linecap="round" opacity="${active ? "1" : "0.82"}">
        <title>${escapeAttribute(title)}</title>
      </line>
      <rect class="chart-hit-area" data-day="${group.day}" data-min="${group.min}" data-max="${group.max}" x="${x - hitWidth / 2}" y="${padTop}" width="${hitWidth}" height="${chartHeight}" fill="transparent" role="button" tabindex="0" aria-label="${escapeAttribute(title)}"></rect>
    `;
  }).join("");

  const activeGroup = defaultHighlightId ? groups.find((group) => group.recordIds.includes(defaultHighlightId)) : fallbackGroup;

  els.weightChart.innerHTML = weightRangeChartMarkup({
    axisLabels,
    bars,
    dayLabels,
    gridLines,
    baseline: `<line x1="0" y1="${chartBottom}" x2="${width}" y2="${chartBottom}" stroke="var(--chart-axis)" />`,
    width,
    height,
    ariaLabel: "体重高低图，纵轴在最高和最低记录外各保留数据跨度的百分之十。"
  });
  bindWeightRangeChartInteractions(els.weightChart, { defaultDay: activeGroup?.day ?? null });
  const scroller = els.weightChart.querySelector(".chart-scroll");

  if (scroller) {
    const scrollToRelevantRange = () => {
      const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      const targetScroll = activeGroup
        ? (padLeft + (activeGroup.index + 0.5) * dayStep) - scroller.clientWidth / 2
        : maxScroll;
      scroller.scrollLeft = Math.max(0, Math.min(maxScroll, targetScroll));
    };

    window.requestAnimationFrame(() => {
      scrollToRelevantRange();
      window.requestAnimationFrame(scrollToRelevantRange);
      window.setTimeout(scrollToRelevantRange, 80);
      window.setTimeout(scrollToRelevantRange, 360);
      window.setTimeout(scrollToRelevantRange, 720);
    });
  }
}

function foodRecordCalories(record) {
  return (record.foods || []).reduce((sum, item) => (
    item.calorie !== null && item.calorie !== undefined && item.calorie !== "" && Number.isFinite(Number(item.calorie))
      ? sum + Number(item.calorie)
      : sum
  ), 0);
}

function foodGalleryMarkup(record) {
  const photos = Array.isArray(record.foodPhotos) ? record.foodPhotos : [];
  if (!photos.length) {
    return '<div class="history-food-gallery is-empty">FOOD</div>';
  }
  const isCarousel = photos.length > 1;
  return `
    <div class="history-food-gallery ${isCarousel ? "is-carousel" : "is-single"}" data-history-food-gallery aria-label="${isCarousel ? "食物照片，可横向滑动" : "食物照片"}">
      <div class="history-food-track">
        ${photos.map((photo, index) => `
          <img src="${photo.thumbnailUrl || photo.photoUrl}" alt="食物照片 ${index + 1}" loading="lazy" decoding="async" draggable="false">
        `).join("")}
      </div>
    </div>
  `;
}

function stopHistoryFoodGalleryEffects() {
  if (state.historyFoodCarouselTimer) {
    window.clearInterval(state.historyFoodCarouselTimer);
    state.historyFoodCarouselTimer = null;
  }
  if (state.historyFoodScaleRaf) {
    window.cancelAnimationFrame(state.historyFoodScaleRaf);
    state.historyFoodScaleRaf = null;
  }
}

function updateHistoryFoodGalleryScale() {
  state.historyFoodScaleRaf = null;
  const galleries = [...document.querySelectorAll("[data-history-food-gallery]")];
  if (!galleries.length) return;
  const viewportHeight = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
  const focusY = viewportHeight * 0.48;
  for (const gallery of galleries) {
    const rect = gallery.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const distance = Math.min(1, Math.abs(centerY - focusY) / (viewportHeight * 0.72));
    const scale = 0.965 + (1 - distance) * 0.045;
    gallery.style.setProperty("--history-gallery-scale", scale.toFixed(3));
  }
}

function scheduleHistoryFoodGalleryScale() {
  if (state.historyFoodScaleRaf) return;
  state.historyFoodScaleRaf = window.requestAnimationFrame(updateHistoryFoodGalleryScale);
}

function autoAdvanceHistoryFoodGalleries() {
  if (document.hidden) return;
  const galleries = [...document.querySelectorAll(".history-food-gallery.is-carousel")];
  for (const gallery of galleries) {
    const rect = gallery.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
    const maxScroll = Math.max(0, gallery.scrollWidth - gallery.clientWidth);
    if (maxScroll <= 4) continue;
    const next = gallery.scrollLeft + gallery.clientWidth * 0.92;
    gallery.scrollTo({
      left: next >= maxScroll - 4 ? 0 : next,
      behavior: "smooth"
    });
  }
}

function bindHistoryFoodGalleries() {
  stopHistoryFoodGalleryEffects();
  const carousels = document.querySelectorAll(".history-food-gallery.is-carousel");
  scheduleHistoryFoodGalleryScale();
  if (carousels.length && !prefersReducedMotion()) {
    state.historyFoodCarouselTimer = window.setInterval(autoAdvanceHistoryFoodGalleries, 3600);
  }
}

function renderFoodHistoryItem(record, { readonly = false } = {}) {
  const foods = [...(record.foods || [])].sort((left, right) => (right.calorie ?? -1) - (left.calorie ?? -1));
  const calories = foodRecordCalories(record);
  const nutritionTotal = foods.reduce((summary, item) => {
    const carbohydrate = parseNumberLike(item?.nutrition?.carbs);
    const protein = parseNumberLike(item?.nutrition?.protein);
    if (Number.isFinite(carbohydrate)) summary.carbohydrate += carbohydrate;
    if (Number.isFinite(protein)) summary.protein += protein;
    return summary;
  }, { carbohydrate: 0, protein: 0 });
  return `
    <article class="history-item is-food">
      ${foodGalleryMarkup(record)}
      <div class="history-main">
        <div class="history-head">
          <p class="history-time">${dateTimeFormat.format(new Date(record.timestamp))}</p>
          ${readonly ? "" : `<button class="delete-record-button" type="button" data-record-id="${escapeAttribute(record.id)}" aria-label="删除这条食物记录">${communityTrashIconMarkup()}</button>`}
        </div>
        <p class="history-note">食物记录 · ${(record.foodPhotos || []).length} 张照片</p>
        <div class="history-food-summary">
          <strong>${calories ? `${Math.round(calories)} kcal` : "热量未知"}</strong>
          <span>碳水 ${formatFoodNutrientValue(nutritionTotal.carbohydrate)}g</span>
          <span>蛋白质 ${formatFoodNutrientValue(nutritionTotal.protein)}g</span>
        </div>
        <div class="history-food-list">
          ${foods.length ? foods.map((item) => `
            <div class="history-food-entry">
              <strong>${escapeAttribute(item.name)}</strong>
              <span>${escapeAttribute([
                foodAmountText(item),
                foodCalorieText(item.calorie),
                foodBasicNutritionText(item.nutrition)
              ].filter(Boolean).join(" · "))}</span>
            </div>
          `).join("") : '<span>暂无识别结果</span>'}
        </div>
        ${record.mood ? `<p class="history-mood history-food-mood">“${escapeAttribute(record.mood)}”</p>` : ""}
      </div>
    </article>
  `;
}

function bodyHistoryPhotoMarkup(record) {
  if (record.thumbnailUrl) {
    return `<img class="history-body-photo" src="${record.thumbnailUrl}" alt="记录照片缩略图" loading="lazy" decoding="async" draggable="false">`;
  }
  return `<div class="history-body-photo is-empty">${record.photoUrl ? "PHOTO" : "WEIGHT"}</div>`;
}

function renderBodyHistoryItem(record, { readonly = false } = {}) {
  const hasPhoto = Boolean(record.photoUrl || record.thumbnailUrl);
  return `
    <article class="history-item is-body-record">
      ${bodyHistoryPhotoMarkup(record)}
      <div class="history-main">
        <div class="history-head">
          <p class="history-time">${dateTimeFormat.format(new Date(record.timestamp))}</p>
          ${readonly ? "" : `<button class="delete-record-button" type="button" data-record-id="${escapeAttribute(record.id)}" aria-label="删除这条记录">${communityTrashIconMarkup()}</button>`}
        </div>
        <p class="history-note">体重记录${hasPhoto ? " · 1 张照片" : ""}</p>
        <div class="history-food-summary history-weight-summary">
          <strong>${Number.isFinite(record.weight) ? formatWeight(record.weight) : "体重未知"}</strong>
        </div>
        ${record.mood ? `<p class="history-mood history-food-mood">“${escapeAttribute(record.mood)}”</p>` : ""}
      </div>
    </article>
  `;
}

function renderHistory() {
  if (!state.historyExpanded) {
    renderHistoryCollapsed();
    return;
  }

  els.historyMeta.textContent = state.historyRecords.length
    ? `最近更新 ${dateTimeFormat.format(new Date(state.historyRecords[0].timestamp))}`
    : "按时间自动保存";

  if (!state.historyRecords.length) {
    els.historyList.innerHTML = '<div class="chart-empty">还没有记录。拍一张照片或保存一次体重，变化就开始有证据了。</div>';
    stopHistoryFoodGalleryEffects();
    return;
  }

  els.historyList.innerHTML = state.historyRecords.map((record) => (
    record.type === "food" ? renderFoodHistoryItem(record) : renderBodyHistoryItem(record)
  )).join("");
  bindHistoryFoodGalleries();
  els.historyList.querySelectorAll("[data-history-food-gallery] img").forEach((image) => {
    if (image.complete) return;
    image.addEventListener("load", scheduleHistoryFoodGalleryScale, { once: true });
  });
}

function renderHistoryCollapsed() {
  stopHistoryFoodGalleryEffects();
  state.historyRecords = [];
  state.historyOffset = 0;
  state.historyHasMore = true;
  state.historyLoading = false;
  els.historyToggleButton.textContent = "展开";
  els.historyToggleButton.setAttribute("aria-expanded", "false");
  els.historyToggleButton.disabled = !state.records.length;
  els.historyMeta.textContent = state.records.length
    ? `${state.records.length} 条记录，展开后加载缩略图`
    : "还没有记录";
  els.historyList.innerHTML = "";
  els.historyLoader.classList.add("hidden");
}

function updateHistoryLoader() {
  if (!state.historyExpanded) {
    els.historyLoader.classList.add("hidden");
    return;
  }
  if (state.historyLoading) {
    els.historyLoader.textContent = "正在加载...";
    els.historyLoader.classList.remove("hidden");
    return;
  }
  if (!state.historyHasMore) {
    els.historyLoader.textContent = state.historyRecords.length ? "已经到底了" : "";
    els.historyLoader.classList.toggle("hidden", !state.historyRecords.length);
    return;
  }
  els.historyLoader.textContent = "向下滚动加载更多";
  els.historyLoader.classList.remove("hidden");
}

async function loadNextHistoryPage() {
  if (!state.historyExpanded || state.historyLoading || !state.historyHasMore) {
    return;
  }

  state.historyLoading = true;
  updateHistoryLoader();
  try {
    const data = await api(`/api/records?view=history&limit=10&offset=${state.historyOffset}`);
    state.historyRecords.push(...data.records);
    state.historyOffset += data.records.length;
    state.historyHasMore = data.hasMore;
    renderHistory();
  } finally {
    state.historyLoading = false;
    updateHistoryLoader();
  }
}

async function resetHistory() {
  state.historyRecords = [];
  state.historyOffset = 0;
  state.historyHasMore = true;
  els.historyList.innerHTML = "";
  els.historyToggleButton.textContent = "收起";
  els.historyToggleButton.setAttribute("aria-expanded", "true");
  els.historyToggleButton.disabled = false;
  if (state.historyExpanded) {
    await loadNextHistoryPage();
  } else {
    renderHistoryCollapsed();
  }
}

async function toggleHistory() {
  state.historyExpanded = !state.historyExpanded;
  if (state.historyExpanded) {
    await resetHistory();
  } else {
    renderHistoryCollapsed();
  }
}

function closeCamera() {
  if (state.stream) {
    state.stream.getTracks().forEach((track) => track.stop());
    state.stream = null;
  }
  els.cameraStage.classList.remove("is-active");
  els.switchCameraButton.disabled = true;
  updateCaptureButtonState();
}

function syncCaptureModeUi() {
  const isFoodMode = state.captureMode === "food";
  els.captureView.classList.toggle("is-food-mode", isFoodMode);
  els.cameraStage.classList.toggle("is-food-mode", isFoodMode);
  if (els.captureKicker) els.captureKicker.textContent = isFoodMode ? "食物记录" : "拍照记录";
  if (els.captureTitle) els.captureTitle.textContent = isFoodMode ? "记录饮食" : "对齐拍照";
  els.captureModeButtons.forEach((button) => {
    const selected = button.dataset.captureMode === state.captureMode;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", selected ? "true" : "false");
  });
  els.retakeButton.textContent = isFoodMode ? "清空" : "重拍";
  els.recordForm.classList.toggle("hidden", isFoodMode || !state.capturedPhoto);
  els.foodRecordPanel?.classList.toggle("hidden", !isFoodMode);
}

async function setCaptureMode(mode) {
  const nextMode = mode === "food" ? "food" : "body";
  if (state.captureMode === nextMode) return;

  const hadStream = Boolean(state.stream);
  clearCapturedPhoto();
  clearPendingFoodPhoto({ restoreLive: false });
  state.isCapturing = false;
  els.recordForm.classList.add("hidden");
  els.photoPreview.classList.add("hidden");
  els.retakeButton.disabled = true;
  setMessage(els.recordMessage, "", "");
  state.captureMode = nextMode;
  state.facingMode = nextMode === "food" ? "environment" : "user";
  syncCaptureModeUi();
  renderFoodCapturePanel();
  if (hadStream) {
    closeCamera();
    await openCamera();
  } else {
    applyCameraOrientation();
    updateCaptureButtonState();
    if (nextMode === "body") {
      preloadFaceModel(true);
    }
  }
}

function applyCameraOrientation() {
  const isFrontCamera = state.facingMode === "user";
  const isFoodMode = state.captureMode === "food";
  els.cameraVideo.classList.toggle("mirrored", isFrontCamera);
  els.cameraStage.classList.toggle("is-active", Boolean(state.stream));
  els.cameraStage.setAttribute("aria-label", state.stream ? "摄像头已打开" : "点击打开摄像头");
  if (isFoodMode) {
    els.cameraHint.textContent = state.stream
      ? "摄像头已打开。拍照后会自动识别食物和营养。"
      : "点击拍照画面打开摄像头，拍照后自动识别食物和营养。";
  } else {
    els.cameraHint.textContent = state.stream
      ? "摄像头已打开。请保持稳定，拍照后会自动校正画面。"
      : "点击拍照画面打开摄像头，拍照后会自动校正画面。";
  }
}

function updateCaptureButtonState() {
  if (state.isCapturing) {
    els.captureButton.disabled = true;
    els.captureButton.textContent = state.captureMode === "food"
      ? (state.foodAnalyzing ? "识别中..." : "处理中...")
      : "校正中...";
    updateMoodAiButtons();
    return;
  }

  if (state.captureMode === "food") {
    if (state.foodPendingPhoto) {
      els.captureButton.textContent = "处理中...";
      els.captureButton.disabled = state.foodAnalyzing;
      return;
    }
    const reachedLimit = state.foodPhotos.length >= MAX_FOOD_PHOTOS_PER_RECORD;
    els.captureButton.textContent = reachedLimit ? "已达上限" : "拍照";
    els.captureButton.disabled = !state.stream || state.foodAnalyzing || reachedLimit;
    updateMoodAiButtons();
    return;
  }

  const ready = faceAlignmentReady();
  const canRetryModel = !ready && Boolean(state.faceModelError) && !state.faceModelPromise;
  els.captureButton.textContent = ready ? "拍照" : (canRetryModel ? "重试模型" : "模型加载中");
  els.captureButton.disabled = !state.stream || (!ready && !canRetryModel) || Boolean(state.capturedPhoto);
  updateMoodAiButtons();
}

function latestFoodMoodPhoto() {
  const photos = Array.isArray(state.foodPhotos) ? state.foodPhotos : [];
  return photos.length ? photos[photos.length - 1]?.photo || null : state.foodPendingPhoto?.photo || null;
}

function updateMoodAiButtons() {
  const busy = Boolean(state.moodAiContext);
  if (els.bodyMoodAiButton) {
    const isBusy = state.moodAiContext === "body";
    els.bodyMoodAiButton.disabled = busy || !state.capturedPhoto || state.captureMode !== "body";
    els.bodyMoodAiButton.classList.toggle("is-loading", isBusy);
    els.bodyMoodAiButton.textContent = isBusy ? "生成中" : "AI";
    els.bodyMoodAiButton.setAttribute("aria-busy", isBusy ? "true" : "false");
  }
  if (els.foodMoodAiButton) {
    const isBusy = state.moodAiContext === "food";
    els.foodMoodAiButton.disabled = busy || !latestFoodMoodPhoto() || state.captureMode !== "food" || state.foodAnalyzing;
    els.foodMoodAiButton.classList.toggle("is-loading", isBusy);
    els.foodMoodAiButton.textContent = isBusy ? "生成中" : "AI";
    els.foodMoodAiButton.setAttribute("aria-busy", isBusy ? "true" : "false");
  }
}

function preloadFaceModel(showStatus) {
  if (faceAlignmentReady()) {
    updateCaptureButtonState();
    faceModelClientLog("preload_skip_ready", { stage: "preload", showStatus: Boolean(showStatus) });
    return state.faceLandmarker;
  }

  if (showStatus) {
    els.cameraHint.textContent = "正在加载端侧五官模型，首次打开可能需要几秒。";
  }

  faceModelClientLog("preload_start", { stage: "preload", showStatus: Boolean(showStatus) });
  return ensureFaceLandmarker()
    .then((faceLandmarker) => {
      if (showStatus && !state.stream) {
        els.cameraHint.textContent = "模型已就绪，点击拍照画面打开摄像头。";
      }
      updateCaptureButtonState();
      faceModelClientLog("preload_success", { stage: "preload", showStatus: Boolean(showStatus) });
      return faceLandmarker;
    })
    .catch((error) => {
      if (showStatus) {
        els.cameraHint.textContent = error.message || "端侧模型加载失败，请刷新后重试。";
      }
      updateCaptureButtonState();
      faceModelClientLog("preload_failure", {
        stage: "preload",
        showStatus: Boolean(showStatus),
        errorName: error?.name || "",
        errorClass: error?.constructor?.name || "",
        errorMessage: error?.message || String(error || "")
      });
      return null;
    });
}

async function openCamera() {
  try {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("当前浏览器不支持摄像头调用。");
    }

    closeCamera();
    const isFoodMode = state.captureMode === "food";
    const videoConstraints = {
      width: { ideal: isFoodMode ? 1280 : 1080 },
      height: { ideal: isFoodMode ? 1280 : 1440 },
      aspectRatio: { ideal: isFoodMode ? 1 : 0.75 },
      facingMode: { ideal: state.facingMode }
    };

    state.stream = await navigator.mediaDevices.getUserMedia({
      video: videoConstraints,
      audio: false
    });

    els.cameraVideo.srcObject = state.stream;
    await els.cameraVideo.play();
    await waitForStableCameraFrame();
    els.cameraVideo.classList.remove("hidden");
    els.emptyCamera.classList.add("hidden");
    els.photoPreview.classList.add("hidden");
    els.switchCameraButton.disabled = false;
    els.retakeButton.disabled = true;
    clearCapturedPhoto();
    applyCameraOrientation();
    updateCaptureButtonState();
    if (state.captureMode === "body") {
      preloadFaceModel(true);
    }
  } catch (error) {
    if (state.stream) {
      state.stream.getTracks().forEach((track) => track.stop());
    }
    state.stream = null;
    els.cameraStage.classList.remove("is-active");
    els.cameraVideo.classList.add("hidden");
    els.emptyCamera.classList.remove("hidden");
    els.switchCameraButton.disabled = true;
    updateCaptureButtonState();
    els.cameraHint.textContent = error.message || "摄像头打开失败。";
  }
}

async function ensureFaceLandmarker() {
  if (state.faceLandmarker) {
    faceModelClientLog("ensure_cached", { stage: "ensure" });
    return state.faceLandmarker;
  }

  if (!state.faceModelPromise) {
    const attemptId = passkeyAttemptId("face");
    const attemptStart = performance.now();
    const nativeShell = isWellEchoNativeShell();
    state.faceModelError = "";
    faceModelClientLog("ensure_start", {
      attemptId,
      stage: "ensure",
      useModelBuffer: nativeShell,
      timeoutMs: FACE_MODEL_CREATE_TIMEOUT_MS
    });
    state.faceModelPromise = (async () => {
      let stepStart = performance.now();
      let FaceLandmarker;
      let FilesetResolver;
      try {
        faceModelClientLog("import_start", { attemptId, stage: "import", timeoutMs: FACE_MODEL_IMPORT_TIMEOUT_MS });
        ({ FaceLandmarker, FilesetResolver } = await withRejectingTimeout(
          import(MEDIAPIPE_IMPORT_URL),
          FACE_MODEL_IMPORT_TIMEOUT_MS,
          "端侧模型运行库加载超时，请检查网络后重试。"
        ));
        faceModelClientLog("import_success", {
          attemptId,
          stage: "import",
          elapsedMs: Math.round(performance.now() - stepStart)
        });
      } catch (error) {
        faceModelClientLog("import_failure", {
          attemptId,
          stage: "import",
          elapsedMs: Math.round(performance.now() - stepStart),
          errorName: error?.name || "",
          errorClass: error?.constructor?.name || "",
          errorMessage: error?.message || String(error || "")
        });
        throw error;
      }

      stepStart = performance.now();
      let vision;
      try {
        faceModelClientLog("wasm_start", { attemptId, stage: "wasm", timeoutMs: FACE_MODEL_WASM_TIMEOUT_MS });
        vision = await withRejectingTimeout(
          FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL),
          FACE_MODEL_WASM_TIMEOUT_MS,
          "端侧模型 WASM 加载超时，请检查网络后重试。"
        );
        faceModelClientLog("wasm_success", {
          attemptId,
          stage: "wasm",
          elapsedMs: Math.round(performance.now() - stepStart)
        });
      } catch (error) {
        faceModelClientLog("wasm_failure", {
          attemptId,
          stage: "wasm",
          elapsedMs: Math.round(performance.now() - stepStart),
          errorName: error?.name || "",
          errorClass: error?.constructor?.name || "",
          errorMessage: error?.message || String(error || "")
        });
        throw error;
      }

      let lastError = null;
      const modelUrls = faceModelUrlsForCurrentRuntime();
      for (const [index, modelAssetPath] of modelUrls.entries()) {
        const hasFallback = index < modelUrls.length - 1;
        let activeStage = "create";
        let usedModelBuffer = false;
        try {
          let modelAssetBuffer = null;
          if (nativeShell) {
            activeStage = "download";
            stepStart = performance.now();
            faceModelClientLog("download_start", {
              attemptId,
              stage: "download",
              modelUrl: modelAssetPath,
              modelUrlKind: modelUrlKind(modelAssetPath),
              modelUrlIndex: index,
              modelUrlCount: modelUrls.length,
              timeoutMs: FACE_MODEL_DOWNLOAD_TIMEOUT_MS
            });
            const download = await fetchFaceModelBuffer(modelAssetPath);
            modelAssetBuffer = new Uint8Array(download.buffer);
            usedModelBuffer = true;
            faceModelClientLog("download_success", {
              attemptId,
              stage: "download",
              modelUrl: modelAssetPath,
              modelUrlKind: modelUrlKind(modelAssetPath),
              modelUrlIndex: index,
              modelUrlCount: modelUrls.length,
              elapsedMs: Math.round(performance.now() - stepStart),
              modelBytes: download.bytes,
              modelContentLength: download.contentLength,
              modelCacheStatus: download.cacheStatus,
              modelContentType: download.contentType
            });
          }
          activeStage = "create";
          stepStart = performance.now();
          faceModelClientLog("create_start", {
            attemptId,
            stage: "create",
            modelUrl: modelAssetPath,
            modelUrlKind: modelUrlKind(modelAssetPath),
            modelUrlIndex: index,
            modelUrlCount: modelUrls.length,
            useModelBuffer: Boolean(modelAssetBuffer),
            timeoutMs: FACE_MODEL_CREATE_TIMEOUT_MS
          });
          state.faceLandmarker = await withRejectingTimeout(
            FaceLandmarker.createFromOptions(vision, {
              baseOptions: modelAssetBuffer
                ? { modelAssetBuffer }
                : { modelAssetPath },
              runningMode: "IMAGE",
              numFaces: 1,
              minFaceDetectionConfidence: 0.45,
              minFacePresenceConfidence: 0.45
            }),
            FACE_MODEL_CREATE_TIMEOUT_MS,
            hasFallback
              ? "端侧五官模型下载超时，正在尝试备用地址。"
              : "端侧五官模型加载超时，请刷新后重试。"
          );
          state.faceModelReady = true;
          state.faceModelSource = modelAssetPath;
          state.faceModelMode = "mediapipe";
          state.faceModelError = "";
          faceModelClientLog("create_success", {
            attemptId,
            stage: "create",
            modelUrl: modelAssetPath,
            modelUrlKind: modelUrlKind(modelAssetPath),
            modelUrlIndex: index,
            modelUrlCount: modelUrls.length,
            useModelBuffer: Boolean(modelAssetBuffer),
            elapsedMs: Math.round(performance.now() - stepStart),
            totalElapsedMs: Math.round(performance.now() - attemptStart)
          });
          return state.faceLandmarker;
        } catch (error) {
          lastError = error;
          faceModelClientLog(`${activeStage}_failure`, {
            attemptId,
            stage: activeStage,
            modelUrl: modelAssetPath,
            modelUrlKind: modelUrlKind(modelAssetPath),
            modelUrlIndex: index,
            modelUrlCount: modelUrls.length,
            useModelBuffer: usedModelBuffer,
            elapsedMs: Math.round(performance.now() - stepStart),
            totalElapsedMs: Math.round(performance.now() - attemptStart),
            hasFallback,
            errorName: error?.name || "",
            errorClass: error?.constructor?.name || "",
            errorMessage: error?.message || String(error || "")
          });
          if (hasFallback) {
            console.warn("Face model load failed, trying fallback:", error.message);
          }
        }
      }
      throw lastError || new Error("端侧模型加载失败，请刷新后重试。");
    })().catch((error) => {
      state.faceModelPromise = null;
      state.faceModelReady = false;
      state.faceModelError = error?.message || String(error || "端侧模型加载失败。");
      faceModelClientLog("ensure_failure", {
        attemptId,
        stage: "ensure",
        totalElapsedMs: Math.round(performance.now() - attemptStart),
        errorName: error?.name || "",
        errorClass: error?.constructor?.name || "",
        errorMessage: error?.message || String(error || "")
      });
      throw error;
    });
  } else {
    faceModelClientLog("ensure_join_existing", { stage: "ensure" });
  }

  return state.faceModelPromise;
}

function averageLandmarks(landmarks, indices, width, height) {
  return indices.reduce((point, index) => {
    point.x += landmarks[index].x * width;
    point.y += landmarks[index].y * height;
    return point;
  }, { x: 0, y: 0 });
}

function finishAverage(point, count) {
  return {
    x: point.x / count,
    y: point.y / count
  };
}

function outputPointToSource(point, targetCenter, featureCenter, scale, eyeAngle, mirrored) {
  let dx = point.x - targetCenter.x;
  const dy = point.y - targetCenter.y;

  if (mirrored) {
    dx = -dx;
  }

  const unscaledX = dx / scale;
  const unscaledY = dy / scale;
  const cos = Math.cos(eyeAngle);
  const sin = Math.sin(eyeAngle);

  return {
    x: featureCenter.x + unscaledX * cos - unscaledY * sin,
    y: featureCenter.y + unscaledX * sin + unscaledY * cos
  };
}

function outputFitsSource(outputWidth, outputHeight, sourceWidth, sourceHeight, targetCenter, featureCenter, scale, eyeAngle) {
  const margin = 2;
  const outputCorners = [
    { x: 0, y: 0 },
    { x: outputWidth, y: 0 },
    { x: outputWidth, y: outputHeight },
    { x: 0, y: outputHeight }
  ];
  const mirrored = state.facingMode === "user";

  return outputCorners.every((corner) => {
    const sourcePoint = outputPointToSource(corner, targetCenter, featureCenter, scale, eyeAngle, mirrored);
    return sourcePoint.x >= margin
      && sourcePoint.x <= sourceWidth - margin
      && sourcePoint.y >= margin
      && sourcePoint.y <= sourceHeight - margin;
  });
}

function createAlignedFacePhoto(analysisCanvas, landmarks) {
  const sourceWidth = analysisCanvas.width;
  const sourceHeight = analysisCanvas.height;
  const outputWidth = 900;
  const outputHeight = 1200;
  const context = els.captureCanvas.getContext("2d");
  const leftEye = finishAverage(averageLandmarks(landmarks, [33, 133, 159, 145], sourceWidth, sourceHeight), 4);
  const rightEye = finishAverage(averageLandmarks(landmarks, [263, 362, 386, 374], sourceWidth, sourceHeight), 4);
  const eyeAngle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
  const featureIndices = [
    33, 133, 159, 145, 246, 161, 163, 7,
    263, 362, 386, 374, 466, 388, 390, 249,
    70, 63, 105, 66, 107, 336, 296, 334, 293, 300,
    1, 2, 4, 5, 6, 98, 327, 168, 195,
    61, 291, 0, 17, 13, 14, 78, 308
  ];
  const featureXs = featureIndices.map((index) => landmarks[index].x * sourceWidth);
  const featureYs = featureIndices.map((index) => landmarks[index].y * sourceHeight);
  const minFeatureX = Math.min(...featureXs);
  const maxFeatureX = Math.max(...featureXs);
  const minFeatureY = Math.min(...featureYs);
  const maxFeatureY = Math.max(...featureYs);
  const featureWidth = maxFeatureX - minFeatureX;
  const featureHeight = maxFeatureY - minFeatureY;

  if (!Number.isFinite(featureWidth) || !Number.isFinite(featureHeight) || featureWidth < 20 || featureHeight < 20) {
    throw new Error("五官点位不够清晰，请调整光线后重拍。");
  }

  const featureCenter = {
    x: (minFeatureX + maxFeatureX) / 2,
    y: (minFeatureY + maxFeatureY) / 2
  };
  const cropWidth = Math.max(featureWidth * 2, featureHeight * 2 * (outputWidth / outputHeight));
  const cropHeight = Math.max(featureHeight * 2, cropWidth * (outputHeight / outputWidth));
  const scale = Math.min(outputWidth / cropWidth, outputHeight / cropHeight);
  const targetCenter = {
    x: outputWidth / 2,
    y: outputHeight / 2
  };

  if (!outputFitsSource(outputWidth, outputHeight, sourceWidth, sourceHeight, targetCenter, featureCenter, scale, eyeAngle)) {
    throw new Error("脸部离画面边缘太近，当前范围不够裁切，请退远一点或居中后重拍。");
  }

  els.captureCanvas.width = outputWidth;
  els.captureCanvas.height = outputHeight;
  context.save();
  context.fillStyle = "#111816";
  context.fillRect(0, 0, outputWidth, outputHeight);
  context.translate(targetCenter.x, targetCenter.y);
  if (state.facingMode === "user") {
    context.scale(-1, 1);
  }
  context.rotate(-eyeAngle);
  context.scale(scale, scale);
  context.drawImage(analysisCanvas, -featureCenter.x, -featureCenter.y);
  context.restore();
}

async function switchCamera() {
  state.facingMode = state.facingMode === "user" ? "environment" : "user";
  clearCapturedPhoto();
  els.switchCameraButton.disabled = true;
  els.retakeButton.disabled = true;
  els.photoPreview.classList.add("hidden");
  els.cameraHint.textContent = "正在切换镜头...";
  updateCaptureButtonState();

  await openCamera();
}

function foodCalorieText(value, { per100 = false } = {}) {
  const numeric = parseNumberLike(value);
  return Number.isFinite(numeric)
    ? `${numeric.toFixed(numeric % 1 === 0 ? 0 : 1)} kcal${per100 ? "/100g" : ""}`
    : "热量未知";
}

function parseNumberLike(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const match = String(value).match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeFoodTextValue(value, maxLength = 60) {
  const seen = new Set();
  const pick = (input) => {
    if (input === null || input === undefined || input === "") return "";
    if (typeof input === "string" || typeof input === "number") return String(input);
    if (Array.isArray(input)) {
      for (const item of input) {
        const text = pick(item);
        if (text) return text;
      }
      return "";
    }
    if (typeof input === "object") {
      if (seen.has(input)) return "";
      seen.add(input);
      const keys = [
        "name", "foodName", "food_name", "displayName", "display_name", "label", "title",
        "category", "type", "foodType", "food_type", "foodGroup", "food_group",
        "description", "text", "value", "名称", "类别", "类型"
      ];
      for (const key of keys) {
        const text = pick(input[key]);
        if (text) return text;
      }
    }
    return "";
  };
  const cleaned = pick(value)
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
  return /^\[object\s+Object\]$/i.test(cleaned) ? "" : cleaned;
}

function parseBooleanLike(value) {
  if (value === true || value === false) return value;
  if (value === 1 || value === "1") return true;
  if (value === 0 || value === "0") return false;
  const text = String(value ?? "").trim().toLowerCase();
  if (["true", "yes", "y"].includes(text)) return true;
  if (["false", "no", "n"].includes(text)) return false;
  return null;
}

function normalizeFoodNutrition(value) {
  const source = value && typeof value === "object" ? value : {};
  const sources = [source, source.totalNutrients, source.nutrients, source.nutritionalInfo, source.nutritional_info]
    .filter((item) => item && typeof item === "object" && !Array.isArray(item));
  return Object.fromEntries(FOOD_NUTRIENT_SPECS.flatMap(({ key, aliases }) => {
    const raw = aliases
      .flatMap((alias) => sources.map((item) => item[alias]))
      .find((candidate) => candidate !== null && candidate !== undefined && candidate !== "");
    const parsed = raw && typeof raw === "object" && !Array.isArray(raw)
      ? parseNumberLike(raw.quantity ?? raw.amount ?? raw.value ?? raw.total)
      : parseNumberLike(raw);
    return Number.isFinite(parsed) ? [[key, Math.max(0, Math.round(parsed * 10) / 10)]] : [];
  }));
}

function roundFoodNumber(value, digits = 1) {
  if (!Number.isFinite(value)) return null;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function normalizeFoodPortions(value) {
  const parsed = parseNumberLike(value);
  if (!Number.isFinite(parsed)) return 1;
  const clamped = Math.min(50, Math.max(0, parsed));
  return Math.round(clamped * 1000) / 1000;
}

function normalizeFoodGrams(value, fallback = 100) {
  const parsed = parseNumberLike(value);
  const base = Number.isFinite(parsed) ? parsed : fallback;
  const clamped = Math.min(5000, Math.max(0, base));
  return clamped <= 0 ? 0 : roundFoodNumber(clamped, 1);
}

function stepFoodGrams(value, step) {
  const current = normalizeFoodGrams(value, 0);
  const direction = step >= 0 ? 1 : -1;
  if (direction > 0) {
    return Math.min(5000, Math.floor(current / 50) * 50 + 50);
  }
  return Math.max(0, Math.ceil(current / 50) * 50 - 50);
}

function foodGramInputValue(value) {
  const grams = normalizeFoodGrams(value, 0);
  return Number.isFinite(grams) ? String(grams).replace(/\.0$/, "") : "0";
}

function scaleFoodNutrition(nutrition, portions) {
  const factor = normalizeFoodPortions(portions);
  return Object.fromEntries(Object.entries(nutrition || {}).flatMap(([field, value]) => (
    Number.isFinite(value) ? [[field, roundFoodNumber(value * factor, 1)]] : []
  )));
}

function foodCaloriesForPortions(unitCalories, portions) {
  return Number.isFinite(unitCalories) ? roundFoodNumber(unitCalories * normalizeFoodPortions(portions), 1) : null;
}

function foodAmountText(item) {
  const grams = parseNumberLike(item?.grams);
  const portions = normalizeFoodPortions(item?.portionUnits);
  const effectiveGrams = Number.isFinite(grams) ? grams : portions * 100;
  return `约 ${Math.round(effectiveGrams)}g`;
}

function formatFoodNutrientValue(value) {
  return Number.isFinite(value) ? value.toFixed(value % 1 === 0 ? 0 : 1) : "";
}

function foodNutritionEntries(nutritionValue = {}) {
  const nutrition = nutritionValue || {};
  return FOOD_NUTRIENT_SPECS.flatMap((spec) => {
    const value = parseNumberLike(nutrition[spec.key]);
    return Number.isFinite(value) ? [{ ...spec, value }] : [];
  });
}

function foodNutritionText(item, nutritionValue = item?.nutrition, { primaryOnly = true } = {}) {
  const nutrition = nutritionValue || {};
  return FOOD_NUTRIENT_SPECS
    .filter((spec) => !primaryOnly || spec.primary)
    .map((spec) => {
      const value = parseNumberLike(nutrition[spec.key]);
      return Number.isFinite(value) ? `${spec.label} ${formatFoodNutrientValue(value)}${spec.unit}` : "";
    })
    .filter(Boolean)
    .join(" · ");
}

function foodNutritionChipsMarkup(nutritionValue, className = "food-nutrition-grid") {
  const entries = foodNutritionEntries(nutritionValue);
  if (!entries.length) return "";
  return `
    <div class="${className}" aria-label="完整营养数据">
      ${entries.map((item) => `
        <span><b>${escapeAttribute(item.label)}</b>${escapeAttribute(formatFoodNutrientValue(item.value))}${escapeAttribute(item.unit)}</span>
      `).join("")}
    </div>
  `;
}

function hasFoodCalorieData(item) {
  const unitCalorie = parseNumberLike(item?.unitCalorie ?? item?.caloriePer100g ?? item?.per100Calorie ?? item?.calorie);
  const calorie = parseNumberLike(item?.calorie);
  return Number.isFinite(unitCalorie) || Number.isFinite(calorie);
}

function foodDataScore(item) {
  let score = 0;
  if (hasFoodCalorieData(item)) score += 4;
  if (parseNumberLike(item?.unitNutrition?.carbs ?? item?.nutrition?.carbs) !== null) score += 1;
  if (parseNumberLike(item?.unitNutrition?.protein ?? item?.nutrition?.protein) !== null) score += 1;
  if (item?.nutritionSource === "local") score += 3;
  return score;
}

function normalizeFoodRecognitionSource(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 32);
}

function foodRecognitionSourceLabel(source) {
  return {
    qwen_vl: "千问视觉"
  }[normalizeFoodRecognitionSource(source)] || "";
}

function sortFoodCandidates(left, right) {
  const calorieDiff = Number(hasFoodCalorieData(right)) - Number(hasFoodCalorieData(left));
  if (calorieDiff) return calorieDiff;
  const leftRank = Number.isFinite(left?.recognitionRank) ? left.recognitionRank : 999;
  const rightRank = Number.isFinite(right?.recognitionRank) ? right.recognitionRank : 999;
  if (leftRank !== rightRank) return leftRank - rightRank;
  const scoreDiff = foodDataScore(right) - foodDataScore(left);
  if (scoreDiff) return scoreDiff;
  return (right.trust ?? -1) - (left.trust ?? -1);
}

function foodMetaText(item) {
  return [
    foodAmountText(item),
    item?.category && item.category !== "未知结果" ? item.category : "",
    Number.isFinite(item?.unitCalorie) ? `每100g ${foodCalorieText(item.unitCalorie, { per100: false })}` : "",
    foodNutritionText(item)
  ].filter(Boolean).join(" · ");
}

function mergeFoodItems(items) {
  const normalized = Array.isArray(items) ? items : [];
  state.foodItems = [...state.foodItems, ...normalized]
    .map((item) => {
      const gramsInput = parseNumberLike(item.grams ?? item.estimatedGrams ?? item.servingGrams);
      const grams = normalizeFoodGrams(gramsInput, 100);
      const portionUnits = normalizeFoodPortions(item.portionUnits ?? item.servings ?? item.quantity ?? (grams ? grams / 100 : 1));
      const unitCalorie = parseNumberLike(item.unitCalorie ?? item.caloriePer100g ?? item.per100Calorie ?? item.calorie);
      const calorie = parseNumberLike(item.calorie) ?? foodCaloriesForPortions(unitCalorie, portionUnits);
      const trust = parseNumberLike(item.trust);
      const hasCalorie = parseBooleanLike(item.hasCalorie);
      const category = normalizeFoodTextValue([
        item.category,
        item.type,
        item.foodType,
        item.food_type,
        item.foodGroup,
        item.food_group
      ], 40);
      const unitNutrition = normalizeFoodNutrition(item.unitNutrition || item.nutrition || item);
      const nutrition = item.unitNutrition
        ? scaleFoodNutrition(unitNutrition, portionUnits)
        : normalizeFoodNutrition(item.nutrition || item);
      return {
        id: item.id || cryptoRandomId(),
        name: normalizeFoodTextValue([
          item.name,
          item.foodName,
          item.food_name,
          item.displayName,
          item.display_name,
          item.label,
          item.title
        ], 60),
        category,
        portionUnits,
        grams: roundFoodNumber(portionUnits * 100, 1),
        unitCalorie: Number.isFinite(unitCalorie) ? unitCalorie : null,
        calorie: Number.isFinite(calorie) ? calorie : null,
        trust: Number.isFinite(trust) ? trust : null,
        hasCalorie: hasCalorie ?? (Number.isFinite(calorie) && (!category || category !== "未知结果")),
        unitNutrition,
        nutrition,
        recognitionSource: normalizeFoodRecognitionSource(item.recognitionSource),
        recognitionRank: Number.isFinite(Number(item.recognitionRank)) ? Number(item.recognitionRank) : 999
      };
    })
    .filter((item) => item.name && normalizeFoodPortions(item.portionUnits) > 0 && hasFoodCalorieData(item))
    .sort((left, right) => (right.calorie ?? -1) - (left.calorie ?? -1))
    .slice(0, MAX_FOOD_ITEMS_PER_RECORD);
}

function normalizeFoodCandidate(item, index = 0) {
  const category = normalizeFoodTextValue([
    item?.category,
    item?.type,
    item?.foodType,
    item?.food_type,
    item?.foodGroup,
    item?.food_group
  ], 40);
  const unitCalorie = parseNumberLike(item?.unitCalorie ?? item?.caloriePer100g ?? item?.per100Calorie ?? item?.calorie);
  const unitNutrition = normalizeFoodNutrition(item?.unitNutrition || item?.nutrition || item);
  const trust = parseNumberLike(item?.trust);
  const grams = normalizeFoodGrams(item?.grams ?? item?.estimatedGrams ?? item?.servingGrams, 100);
  return {
    id: cryptoRandomId(),
    name: normalizeFoodTextValue([
      item?.name,
      item?.foodName,
      item?.food_name,
      item?.displayName,
      item?.display_name,
      item?.label,
      item?.title
    ], 60),
    category,
    unitCalorie: Number.isFinite(unitCalorie) ? unitCalorie : null,
    unitNutrition,
    trust: Number.isFinite(trust) ? trust : null,
    hasCalorie: parseBooleanLike(item?.hasCalorie) ?? (Number.isFinite(unitCalorie) && category !== "未知结果"),
    nutritionSource: item?.nutritionSource || "",
    recognitionSource: normalizeFoodRecognitionSource(item?.recognitionSource),
    recognitionRank: Number.isFinite(Number(item?.recognitionRank)) ? Number(item.recognitionRank) : 999,
    libraryKey: item?.libraryKey || "",
    portionUnits: normalizeFoodPortions(grams / 100),
    selected: index === 0
  };
}

function foodCandidateTotals(candidate) {
  const portionUnits = normalizeFoodPortions(candidate?.portionUnits);
  return {
    portionUnits,
    grams: roundFoodNumber(portionUnits * 100, 1),
    calorie: foodCaloriesForPortions(candidate?.unitCalorie, portionUnits),
    nutrition: scaleFoodNutrition(candidate?.unitNutrition || {}, portionUnits)
  };
}

function foodNutritionBrief(nutrition) {
  const text = foodNutritionText(null, nutrition, { primaryOnly: true });
  return text || "营养数据未知";
}

function foodBasicNutritionText(nutritionValue = {}) {
  const carbs = parseNumberLike(nutritionValue?.carbs);
  const protein = parseNumberLike(nutritionValue?.protein);
  return [
    Number.isFinite(carbs) ? `碳水 ${formatFoodNutrientValue(carbs)}g` : "",
    Number.isFinite(protein) ? `蛋白质 ${formatFoodNutrientValue(protein)}g` : ""
  ].filter(Boolean).join(" · ");
}

function foodCandidateSummaryText(candidate) {
  const totals = foodCandidateTotals(candidate);
  return [
    `约 ${Math.round(totals.grams)}g`,
    Number.isFinite(totals.calorie) ? foodCalorieText(totals.calorie) : "热量待补充"
  ].filter(Boolean).join(" · ");
}

function foodResultMetricMarkup(item) {
  const grams = parseNumberLike(item?.grams) ?? normalizeFoodPortions(item?.portionUnits) * 100;
  const calorie = parseNumberLike(item?.calorie);
  return `
    <div class="food-result-metrics" aria-label="食物数据">
      <strong>${Number.isFinite(calorie) ? `${Math.round(calorie)} kcal` : "热量未知"}</strong>
      <span>${Number.isFinite(grams) ? `约 ${Math.round(grams)}g` : foodAmountText(item)}</span>
    </div>
  `;
}

function selectedFoodTotals() {
  const selected = state.foodSelectionCandidates.filter((candidate) => candidate.selected);
  return selected.reduce((summary, candidate) => {
    const totals = foodCandidateTotals(candidate);
    summary.selectedCount += 1;
    if (totals.portionUnits <= 0) return summary;
    if (!Number.isFinite(totals.calorie) || totals.calorie <= 0) {
      summary.needsData += 1;
      return summary;
    }
    summary.count += 1;
    summary.grams += totals.grams || 0;
    if (Number.isFinite(totals.calorie)) summary.calorie += totals.calorie;
    for (const [field, value] of Object.entries(totals.nutrition || {})) {
      if (Number.isFinite(value)) {
        summary.nutrition[field] = roundFoodNumber((summary.nutrition[field] || 0) + value, 1);
      }
    }
    return summary;
  }, { selectedCount: 0, count: 0, needsData: 0, grams: 0, calorie: 0, nutrition: {} });
}

function updateFoodSelectionSummary() {
  if (!els.foodSelectionSummary || !els.applyFoodSelectionButton) return;
  const summary = selectedFoodTotals();
  const hasSelection = summary.count > 0 && summary.grams > 0 && summary.calorie > 0;
  els.applyFoodSelectionButton.disabled = !hasSelection;
  els.foodSelectionSummary.textContent = hasSelection
    ? [
        `已选 ${summary.count} 项`,
        summary.calorie > 0 ? `${Math.round(summary.calorie)} kcal` : "热量未知"
      ].filter(Boolean).join(" · ")
    : summary.needsData
      ? "已选食物缺少热量，请先编辑补充"
      : summary.selectedCount ? "重量为 0 时不会添加，请输入大于 0 的重量" : "请选择食物";
}

function renderFoodSelectionCandidate(candidate) {
  const portionValue = normalizeFoodPortions(candidate.portionUnits);
  const gramsValue = foodGramInputValue(portionValue * 100);
  const isEditing = state.foodEditingCandidateId === candidate.id;
  const isEstimating = state.foodEstimatingCandidateId === candidate.id;
  const estimatingLocked = Boolean(state.foodEstimatingCandidateId) && !isEstimating;
  const hasData = Number.isFinite(candidate.unitCalorie);
  const sourceLabel = foodRecognitionSourceLabel(candidate.recognitionSource);
  return `
    <article class="food-selection-item ${candidate.selected ? "is-selected" : ""} ${hasData ? "" : "needs-data"}" data-food-selection-row="${escapeAttribute(candidate.id)}">
      ${sourceLabel ? `<span class="food-source-badge">${escapeAttribute(sourceLabel)}</span>` : ""}
      <label class="food-selection-check">
        <input type="checkbox" data-food-selection-toggle="${escapeAttribute(candidate.id)}" ${candidate.selected ? "checked" : ""}>
        <span>
          <strong>${escapeAttribute(candidate.name)}</strong>
          <em>${candidate.nutritionSource === "local" ? "本地数据" : (candidate.category && candidate.category !== "未知结果" ? escapeAttribute(candidate.category) : "类别未知")}</em>
        </span>
      </label>
      <div class="food-selection-data">
        <button class="food-selection-edit-button" type="button" data-food-selection-edit="${escapeAttribute(candidate.id)}">编辑</button>
        <button class="food-selection-ai-button ${isEstimating ? "is-loading" : ""}" type="button" data-food-selection-ai="${escapeAttribute(candidate.id)}" ${estimatingLocked || isEstimating ? "disabled" : ""} ${isEstimating ? 'aria-busy="true"' : ""}>${isEstimating ? "补全中" : "AI补全"}</button>
        <span>${Number.isFinite(candidate.unitCalorie) ? foodCalorieText(candidate.unitCalorie, { per100: true }) : "热量待补充"}</span>
      </div>
      <div class="food-portion-control" aria-label="${escapeAttribute(candidate.name)} 重量">
        <button type="button" data-food-selection-step="${escapeAttribute(candidate.id)}" data-step="-50" aria-label="减少50克">-</button>
        <input type="number" inputmode="numeric" min="0" max="5000" step="1" value="${gramsValue}" data-food-selection-amount="${escapeAttribute(candidate.id)}" aria-label="重量克数">
        <button type="button" data-food-selection-step="${escapeAttribute(candidate.id)}" data-step="50" aria-label="增加50克">+</button>
        <small>g</small>
      </div>
      ${isEditing ? `
        <div class="food-candidate-editor" data-food-editor="${escapeAttribute(candidate.id)}">
          <label>
            <span>每100g热量</span>
            <input type="number" inputmode="decimal" min="0" max="2000" step="1" value="${Number.isFinite(candidate.unitCalorie) ? candidate.unitCalorie : ""}" data-food-edit-calorie="${escapeAttribute(candidate.id)}" placeholder="例如 180">
          </label>
          <label>
            <span>碳水/100g</span>
            <input type="number" inputmode="decimal" min="0" max="200" step="0.1" value="${Number.isFinite(parseNumberLike(candidate.unitNutrition?.carbs)) ? candidate.unitNutrition.carbs : ""}" data-food-edit-carbs="${escapeAttribute(candidate.id)}" placeholder="选填">
          </label>
          <label>
            <span>脂肪/100g</span>
            <input type="number" inputmode="decimal" min="0" max="200" step="0.1" value="${Number.isFinite(parseNumberLike(candidate.unitNutrition?.fat)) ? candidate.unitNutrition.fat : ""}" data-food-edit-fat="${escapeAttribute(candidate.id)}" placeholder="选填">
          </label>
          <label>
            <span>蛋白质/100g</span>
            <input type="number" inputmode="decimal" min="0" max="200" step="0.1" value="${Number.isFinite(parseNumberLike(candidate.unitNutrition?.protein)) ? candidate.unitNutrition.protein : ""}" data-food-edit-protein="${escapeAttribute(candidate.id)}" placeholder="选填">
          </label>
          <div class="food-candidate-editor-actions">
            <button class="secondary-button" type="button" data-food-edit-ai="${escapeAttribute(candidate.id)}" ${isEstimating ? "disabled" : ""}>${isEstimating ? "AI估算中" : "AI估算"}</button>
            <button class="secondary-button" type="button" data-food-edit-cancel="${escapeAttribute(candidate.id)}">取消</button>
            <button type="button" data-food-edit-save="${escapeAttribute(candidate.id)}">确认</button>
          </div>
        </div>
      ` : ""}
    </article>
  `;
}

function renderFoodSelectionModal() {
  if (!els.foodSelectionList) return;
  els.foodSelectionList.innerHTML = state.foodSelectionCandidates.length
    ? state.foodSelectionCandidates.map(renderFoodSelectionCandidate).join("")
    : '<div class="food-empty-state">没有可选择的识别结果。</div>';
  updateFoodSelectionSummary();
}

function foodLoadingDotsMarkup() {
  return '<span class="food-loading-dots" aria-hidden="true"><i></i><i></i><i></i></span>';
}

function renderFoodAnalysisTaskProgress() {
  const taskIndex = Math.min(Math.max(state.foodAnalysisTaskIndex, 0), FOOD_ANALYSIS_TASKS.length - 1);
  const task = FOOD_ANALYSIS_TASKS[taskIndex] || "分析食物";
  const taskText = `正在执行：${task}`;
  const taskNode = document.querySelector("#foodAnalysisTaskText");
  if (taskNode) {
    taskNode.innerHTML = `${escapeAttribute(taskText)}${foodLoadingDotsMarkup()}`;
  }
  if (els.foodSelectionSummary) {
    els.foodSelectionSummary.textContent = taskText;
  }
}

function stopFoodAnalysisTaskProgress() {
  if (state.foodAnalysisTaskTimer) {
    window.clearInterval(state.foodAnalysisTaskTimer);
    state.foodAnalysisTaskTimer = null;
  }
}

function startFoodAnalysisTaskProgress() {
  stopFoodAnalysisTaskProgress();
  state.foodAnalysisTaskIndex = 0;
  renderFoodAnalysisTaskProgress();
  state.foodAnalysisTaskTimer = window.setInterval(() => {
    if (state.foodAnalysisTaskIndex < FOOD_ANALYSIS_TASKS.length - 1) {
      state.foodAnalysisTaskIndex += 1;
      renderFoodAnalysisTaskProgress();
    }
    if (state.foodAnalysisTaskIndex >= FOOD_ANALYSIS_TASKS.length - 1) {
      stopFoodAnalysisTaskProgress();
    }
  }, 1450);
}

function openFoodSelectionLoadingModal() {
  state.foodSelectionCandidates = [];
  if (els.foodSelectionTitle) {
    els.foodSelectionTitle.textContent = "千问正在识别";
  }
  if (els.foodSelectionCopy) {
    els.foodSelectionCopy.textContent = "正在调用千问视觉识别图片中的食物，并估算重量、热量和基础营养。";
  }
  if (els.foodSelectionList) {
    els.foodSelectionList.innerHTML = `
      <div class="food-selection-loading">
        <span class="food-selection-spinner" aria-hidden="true"></span>
        <strong id="foodAnalysisTaskText">正在执行：上传图片${foodLoadingDotsMarkup()}</strong>
        <p>千问返回后，将在这里选择食物并按 50g 调整重量。</p>
      </div>
    `;
  }
  if (els.foodSelectionSummary) {
    els.foodSelectionSummary.textContent = "正在执行：上传图片";
  }
  if (els.foodSelectionMessage) {
    els.foodSelectionMessage.textContent = "";
  }
  if (els.applyFoodSelectionButton) {
    els.applyFoodSelectionButton.disabled = true;
  }
  if (els.addManualFoodButton) {
    els.addManualFoodButton.disabled = true;
  }
  if (els.foodSelectionModal?.classList.contains("hidden")) {
    showSoftOverlay(els.foodSelectionModal);
  }
  document.body.classList.add("food-selection-open");
  startFoodAnalysisTaskProgress();
}

function renderFoodSelectionEmpty(message = "没有识别到可用的热量和营养数据，可以换角度再拍一张。") {
  stopFoodAnalysisTaskProgress();
  state.foodSelectionCandidates = [];
  if (els.foodSelectionTitle) {
    els.foodSelectionTitle.textContent = "识别结果";
  }
  if (els.foodSelectionCopy) {
    els.foodSelectionCopy.textContent = "未命中营养的数据会排在后面，可编辑或使用 AI 补全后加入记录。";
  }
  if (els.foodSelectionList) {
    els.foodSelectionList.innerHTML = `<div class="food-empty-state">${escapeAttribute(message)}</div>`;
  }
  if (els.foodSelectionSummary) {
    els.foodSelectionSummary.textContent = "暂无可添加食物";
  }
  if (els.foodSelectionMessage) {
    els.foodSelectionMessage.textContent = "";
  }
  if (els.applyFoodSelectionButton) {
    els.applyFoodSelectionButton.disabled = true;
  }
  if (els.addManualFoodButton) {
    els.addManualFoodButton.disabled = false;
  }
  if (els.foodSelectionModal?.classList.contains("hidden")) {
    showSoftOverlay(els.foodSelectionModal);
  }
  document.body.classList.add("food-selection-open");
}

function updateFoodSelectionRow(candidate) {
  const row = els.foodSelectionList?.querySelector(`[data-food-selection-row="${cssEscape(candidate.id)}"]`);
  if (!row) return;
  row.classList.toggle("is-selected", Boolean(candidate.selected));
  const input = row.querySelector(`[data-food-selection-amount="${cssEscape(candidate.id)}"]`);
  if (input && document.activeElement !== input) {
    input.value = foodGramInputValue(normalizeFoodPortions(candidate.portionUnits) * 100);
  }
}

function openFoodSelectionModal(items) {
  stopFoodAnalysisTaskProgress();
  state.foodSelectionCandidates = (Array.isArray(items) ? items : [])
    .map(normalizeFoodCandidate)
    .filter((candidate) => candidate.name)
    .sort(sortFoodCandidates)
    .slice(0, MAX_FOOD_ITEMS_PER_RECORD);

  state.foodSelectionCandidates.forEach((candidate) => {
    candidate.selected = true;
  });

  if (!state.foodSelectionCandidates.length) {
    renderFoodSelectionEmpty();
    setMessage(els.recordMessage, "没有识别到明确食物，可以换角度再拍一张。", "");
    return;
  }

  if (els.foodSelectionTitle) {
    els.foodSelectionTitle.textContent = "选择食物和重量";
  }
  if (els.foodSelectionCopy) {
    els.foodSelectionCopy.textContent = "千问已返回识别结果，默认全选。可手动输入任意克数；使用 -/+ 后会切换到 50g 倍数。";
  }
  if (els.foodSelectionMessage) els.foodSelectionMessage.textContent = "";
  if (els.addManualFoodButton) els.addManualFoodButton.disabled = false;
  renderFoodSelectionModal();
  if (els.foodSelectionModal?.classList.contains("hidden")) {
    showSoftOverlay(els.foodSelectionModal);
  }
  document.body.classList.add("food-selection-open");
}

async function fetchFoodNutritionLibraryEntry(name, category = "") {
  const query = new URLSearchParams({
    name,
    category
  });
  const data = await api(`/api/food/nutrition-library?${query.toString()}`, {
    method: "GET"
  });
  return data.item || null;
}

function openManualFoodModal() {
  if (!els.foodSelectionModal || els.foodSelectionModal.classList.contains("hidden")) return;
  if (!els.manualFoodModal || !els.manualFoodForm || !els.manualFoodNameInput) return;
  els.manualFoodForm.reset();
  if (els.manualFoodMessage) els.manualFoodMessage.textContent = "";
  showSoftOverlay(els.manualFoodModal);
  document.body.classList.add("manual-food-open");
  window.setTimeout(() => els.manualFoodNameInput.focus(), 0);
}

function closeManualFoodModal({ refocus = true, force = false } = {}) {
  if (!els.manualFoodModal || els.manualFoodModal.classList.contains("hidden")) return;
  if (state.manualFoodSubmitting && !force) return;
  hideSoftOverlay(els.manualFoodModal, () => {
    document.body.classList.remove("manual-food-open");
    if (refocus && !els.foodSelectionModal?.classList.contains("hidden")) {
      els.addManualFoodButton?.focus();
    }
  });
}

async function addManualFoodCandidate(input) {
  if (!els.foodSelectionModal || els.foodSelectionModal.classList.contains("hidden")) return false;
  const name = normalizeFoodTextValue([input], 60);
  if (!name) {
    if (els.foodSelectionMessage) els.foodSelectionMessage.textContent = "请输入食物名称。";
    return false;
  }
  let savedEntry = null;
  if (els.addManualFoodButton) els.addManualFoodButton.disabled = true;
  if (els.foodSelectionMessage) els.foodSelectionMessage.textContent = "正在查找个人营养库...";
  try {
    savedEntry = await fetchFoodNutritionLibraryEntry(name, "手动新增");
  } catch (error) {
    savedEntry = null;
  } finally {
    if (els.addManualFoodButton) els.addManualFoodButton.disabled = false;
  }
  if (!els.foodSelectionModal || els.foodSelectionModal.classList.contains("hidden")) return false;
  const savedGrams = normalizeFoodGrams(savedEntry?.defaultGrams, 0);
  const hasSavedCalorie = Number.isFinite(parseNumberLike(savedEntry?.unitCalorie));
  const candidate = normalizeFoodCandidate({
    name,
    category: savedEntry?.category || "手动新增",
    grams: savedGrams > 0 ? savedGrams : 100,
    unitCalorie: savedEntry?.unitCalorie,
    unitNutrition: savedEntry?.unitNutrition,
    recognitionSource: "manual",
    nutritionSource: savedEntry ? "local" : "manual",
    libraryKey: savedEntry?.key || ""
  }, 0);
  candidate.selected = true;
  state.foodSelectionCandidates.forEach((item) => {
    item.selected = false;
  });
  state.foodSelectionCandidates.unshift(candidate);
  state.foodSelectionCandidates = state.foodSelectionCandidates.slice(0, MAX_FOOD_ITEMS_PER_RECORD);
  state.foodEditingCandidateId = hasSavedCalorie ? null : candidate.id;
  renderFoodSelectionModal();
  if (els.foodSelectionTitle) els.foodSelectionTitle.textContent = "选择食物和重量";
  if (els.foodSelectionCopy) {
    els.foodSelectionCopy.textContent = hasSavedCalorie
      ? "已套用个人营养库数据，可继续调整重量。"
      : "可以手动填写营养，也可以用 AI 补全后确认。";
  }
  if (els.foodSelectionMessage) {
    els.foodSelectionMessage.textContent = hasSavedCalorie
      ? `已沿用上次保存的营养和 ${Math.round(foodCandidateTotals(candidate).grams)}g 分量。`
      : "已新增食物，请补充每100g营养数据。";
  }
  return true;
}

async function submitManualFood(event) {
  event.preventDefault();
  const name = normalizeFoodTextValue([els.manualFoodNameInput?.value], 60);
  if (!name) {
    if (els.manualFoodMessage) els.manualFoodMessage.textContent = "请输入食物名称。";
    els.manualFoodNameInput?.focus();
    return;
  }
  if (els.submitManualFoodButton) els.submitManualFoodButton.disabled = true;
  if (els.cancelManualFoodButton) els.cancelManualFoodButton.disabled = true;
  if (els.manualFoodMessage) els.manualFoodMessage.textContent = "正在查找个人营养库...";
  state.manualFoodSubmitting = true;
  try {
    const added = await addManualFoodCandidate(name);
    if (added) {
      closeManualFoodModal({ refocus: false, force: true });
    } else if (els.manualFoodMessage) {
      els.manualFoodMessage.textContent = "暂时无法添加，请稍后再试。";
    }
  } finally {
    state.manualFoodSubmitting = false;
    if (els.submitManualFoodButton) els.submitManualFoodButton.disabled = false;
    if (els.cancelManualFoodButton) els.cancelManualFoodButton.disabled = false;
  }
}

function closeFoodSelectionModal({ keepPhoto = false } = {}) {
  if (!els.foodSelectionModal || els.foodSelectionModal.classList.contains("hidden")) return;
  closeManualFoodModal({ refocus: false, force: true });
  stopFoodAnalysisTaskProgress();
  if (!keepPhoto) {
    cancelActiveFoodAnalysis();
  }
  hideSoftOverlay(els.foodSelectionModal, () => {
    document.body.classList.remove("food-selection-open");
    const discardedPhoto = keepPhoto ? false : discardFoodSelectionPhoto();
    state.foodSelectionCandidates = [];
    state.foodEditingCandidateId = null;
    state.foodEstimatingCandidateId = null;
    state.foodAnalyzing = false;
    state.isCapturing = false;
    if (els.foodSelectionMessage) els.foodSelectionMessage.textContent = "";
    if (discardedPhoto) {
      renderFoodCapturePanel();
      updateCaptureButtonState();
    }
  });
}

function applyFoodSelection() {
  const selected = state.foodSelectionCandidates.filter((candidate) => {
    const totals = foodCandidateTotals(candidate);
    return candidate.selected && totals.portionUnits > 0 && Number.isFinite(totals.calorie) && totals.calorie > 0;
  });
  if (!selected.length) {
    if (els.foodSelectionMessage) els.foodSelectionMessage.textContent = "请至少选择一个重量大于 0 且包含热量数据的食物。";
    return;
  }

  const items = selected.map((candidate) => {
    const totals = foodCandidateTotals(candidate);
    return {
      id: cryptoRandomId(),
      name: candidate.name,
      category: candidate.category,
      portionUnits: totals.portionUnits,
      grams: totals.grams,
	      unitCalorie: candidate.unitCalorie,
	      calorie: totals.calorie,
	      trust: candidate.trust,
	      hasCalorie: candidate.hasCalorie,
	      unitNutrition: candidate.unitNutrition,
	      nutrition: totals.nutrition,
	      recognitionSource: candidate.recognitionSource,
	      recognitionRank: candidate.recognitionRank
	    };
  });

  mergeFoodItems(items);
  state.foodSelectionPhotoId = null;
  closeFoodSelectionModal({ keepPhoto: true });
  renderFoodCapturePanel();
  setMessage(els.recordMessage, `已加入 ${items.length} 项食物，可继续拍照或保存记录。`, "success");
}

async function saveFoodNutritionLibraryEntry(candidate, source = "manual") {
  const data = await api("/api/food/nutrition-library", {
    method: "PUT",
    body: JSON.stringify({
      name: candidate.name,
      category: candidate.category,
      unitCalorie: candidate.unitCalorie,
      unitNutrition: candidate.unitNutrition,
      defaultGrams: foodCandidateTotals(candidate).grams,
      source
    })
  });
  return data.item;
}

async function requestFoodNutritionEstimate(candidate) {
  const data = await api("/api/food/nutrition-estimate", {
    method: "POST",
    body: JSON.stringify({
      name: candidate.name,
      category: candidate.category
    })
  });
  return data.item || {};
}

function applyFoodCandidateNutrition(candidate, { unitCalorie, unitNutrition = {}, nutritionSource = "" }) {
  const calorie = parseNumberLike(unitCalorie);
  const nutrition = normalizeFoodNutrition(unitNutrition);
  if (Number.isFinite(calorie)) {
    candidate.unitCalorie = Math.max(0, roundFoodNumber(calorie, 1));
    candidate.hasCalorie = true;
  }
  if (Object.keys(nutrition).length) {
    candidate.unitNutrition = {
      ...(candidate.unitNutrition || {}),
      ...nutrition
    };
  }
  if (nutritionSource) {
    candidate.nutritionSource = nutritionSource;
  }
}

async function estimateFoodCandidateWithAi(candidate) {
  state.foodEstimatingCandidateId = candidate.id;
  renderFoodSelectionModal();
  if (els.foodSelectionMessage) els.foodSelectionMessage.textContent = "正在用 AI 估算每100g营养...";
  try {
    const item = await requestFoodNutritionEstimate(candidate);
    applyFoodCandidateNutrition(candidate, {
      unitCalorie: item.unitCalorie,
      unitNutrition: item.unitNutrition,
      nutritionSource: "deepseek"
    });
    state.foodEditingCandidateId = candidate.id;
    if (els.foodSelectionMessage) els.foodSelectionMessage.textContent = "AI 已填入估算值，请确认后保存。";
  } catch (error) {
    if (els.foodSelectionMessage) els.foodSelectionMessage.textContent = error.message || "AI 估算失败，请手动填写。";
  } finally {
    state.foodEstimatingCandidateId = null;
    renderFoodSelectionModal();
  }
}

async function autoCompleteFoodCandidateWithAi(candidate) {
  if (state.foodEstimatingCandidateId) return;
  state.foodEstimatingCandidateId = candidate.id;
  renderFoodSelectionModal();
  if (els.foodSelectionMessage) els.foodSelectionMessage.textContent = `正在为「${candidate.name}」补全营养数据...`;
  try {
    const item = await requestFoodNutritionEstimate(candidate);
    applyFoodCandidateNutrition(candidate, {
      unitCalorie: item.unitCalorie,
      unitNutrition: item.unitNutrition,
      nutritionSource: "deepseek"
    });
    if (!Number.isFinite(candidate.unitCalorie) || candidate.unitCalorie <= 0) {
      throw new Error("AI 暂时没有补全到可用营养，请进入编辑手动填写。");
    }
    const saved = await saveFoodNutritionLibraryEntry(candidate, "deepseek");
    candidate.libraryKey = saved?.key || candidate.libraryKey;
    candidate.nutritionSource = "local";
    candidate.selected = true;
    state.foodSelectionCandidates.sort(sortFoodCandidates);
    if (els.foodSelectionMessage) els.foodSelectionMessage.textContent = "AI 已补全并保存到个人营养库。";
  } catch (error) {
    if (els.foodSelectionMessage) els.foodSelectionMessage.textContent = error.message || "AI 补全失败，请稍后再试。";
  } finally {
    state.foodEstimatingCandidateId = null;
    renderFoodSelectionModal();
  }
}

async function confirmFoodCandidateEdit(candidate) {
  const row = els.foodSelectionList?.querySelector(`[data-food-selection-row="${cssEscape(candidate.id)}"]`);
  if (!row) return;
  const unitCalorie = parseNumberLike(row.querySelector(`[data-food-edit-calorie="${cssEscape(candidate.id)}"]`)?.value);
  const carbs = parseNumberLike(row.querySelector(`[data-food-edit-carbs="${cssEscape(candidate.id)}"]`)?.value);
  const fat = parseNumberLike(row.querySelector(`[data-food-edit-fat="${cssEscape(candidate.id)}"]`)?.value);
  const protein = parseNumberLike(row.querySelector(`[data-food-edit-protein="${cssEscape(candidate.id)}"]`)?.value);
  if (!Number.isFinite(unitCalorie) || unitCalorie <= 0) {
    if (els.foodSelectionMessage) els.foodSelectionMessage.textContent = "请填写大于 0 的每100g热量。";
    return;
  }
  const unitNutrition = {};
  if (Number.isFinite(carbs)) unitNutrition.carbs = carbs;
  if (Number.isFinite(fat)) unitNutrition.fat = fat;
  if (Number.isFinite(protein)) unitNutrition.protein = protein;
  applyFoodCandidateNutrition(candidate, {
    unitCalorie,
    unitNutrition,
    nutritionSource: candidate.nutritionSource === "deepseek" ? "deepseek" : "local"
  });
  try {
    const saved = await saveFoodNutritionLibraryEntry(candidate, candidate.nutritionSource === "deepseek" ? "deepseek" : "manual");
    candidate.libraryKey = saved?.key || candidate.libraryKey;
    candidate.nutritionSource = "local";
    state.foodEditingCandidateId = null;
    state.foodSelectionCandidates.sort(sortFoodCandidates);
    renderFoodSelectionModal();
    if (els.foodSelectionMessage) els.foodSelectionMessage.textContent = "已保存到本地营养库，并更新当前候选。";
  } catch (error) {
    if (els.foodSelectionMessage) els.foodSelectionMessage.textContent = error.message || "保存营养数据失败。";
  }
}

function cryptoRandomId() {
  return window.crypto?.randomUUID?.() || `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function renderFoodCapturePanel() {
  if (!els.foodRecordPanel) return;
  const isFoodMode = state.captureMode === "food";
  els.foodRecordPanel.classList.toggle("hidden", !isFoodMode);
  if (!isFoodMode) return;

  els.foodPhotoStack.innerHTML = state.foodPhotos.length
    ? state.foodPhotos.map((photo, index) => `
      <figure class="food-capture-thumb" style="--stack-index: ${index};">
        <img src="${escapeAttribute(photo.url)}" alt="食物照片 ${index + 1}" draggable="false">
        <button class="food-photo-delete-button" type="button" data-food-photo-id="${escapeAttribute(photo.id)}" aria-label="删除食物照片 ${index + 1}">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12"></path>
            <path d="M18 6 6 18"></path>
          </svg>
        </button>
      </figure>
    `).join("")
    : '<div class="food-empty-state">还没有食物照片</div>';

  const recognizedCount = state.foodItems.length;
  const total = state.foodItems.reduce((sum, item) => (
    Number.isFinite(item.calorie) ? sum + item.calorie : sum
  ), 0);
  els.foodResultMeta.textContent = state.foodAnalyzing
    ? "千问正在识别食物和营养..."
    : recognizedCount
      ? `${recognizedCount} 项已加入，热量和营养按选择重量计算。`
      : state.foodPendingPhoto
        ? "照片处理中，即将开始识别。"
        : "拍照后会自动识别，并在弹窗中选择食物和重量。";

  els.foodResultList.innerHTML = recognizedCount
    ? state.foodItems.map((item) => `
      <article class="food-result-item">
        <div>
          <strong>${escapeAttribute(item.name)}</strong>
          <span>${item.hasCalorie ? foodCalorieText(item.calorie) : "未包含热量数据"}</span>
          ${foodMetaText(item) ? `<p class="food-nutrition-line">${escapeAttribute(foodMetaText(item))}</p>` : ""}
          ${foodNutritionChipsMarkup(item.nutrition)}
        </div>
        ${foodResultMetricMarkup(item)}
        <button class="food-delete-button" type="button" data-food-id="${escapeAttribute(item.id)}" aria-label="删除 ${escapeAttribute(item.name)}">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16"></path>
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
            <path d="M6 7l1 13h10l1-13"></path>
            <path d="M9 7V4h6v3"></path>
          </svg>
        </button>
      </article>
    `).join("")
    : '<div class="food-empty-state">识别结果会显示在这里。</div>';

  els.saveFoodRecordButton.disabled = state.foodAnalyzing || !state.foodItems.length;
  els.saveFoodRecordButton.textContent = recognizedCount ? `保存食物记录` : "等待识别";
  els.retakeButton.disabled = state.foodAnalyzing || (!state.foodPendingPhoto && !state.foodPhotos.length && !state.foodItems.length);
  els.retakeButton.textContent = state.foodPendingPhoto ? "重拍" : "清空";
  els.foodRecordPanel.style.setProperty("--food-calories", String(Math.round(total)));
  updateMoodAiButtons();
}

async function analyzeFoodPhoto(photo, { signal } = {}) {
  const data = await api("/api/food/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "image/jpeg"
    },
    signal,
    body: photo
  });
  return data.foods || [];
}

async function requestAiMood(context = "body") {
  const normalizedContext = context === "food" ? "food" : "body";
  const photo = normalizedContext === "food" ? latestFoodMoodPhoto() : state.capturedPhoto;
  const moodInput = normalizedContext === "food" ? els.foodMoodInput : els.moodInput;
  const userInput = String(moodInput?.value || "").replace(/\s+/g, " ").trim();
  if (!photo) {
    setMessage(els.recordMessage, normalizedContext === "food" ? "请先添加一张食物照片。" : "请先完成拍照。", "error");
    return;
  }
  state.moodAiContext = normalizedContext;
  updateMoodAiButtons();
  setMessage(els.recordMessage, "正在获取定位和天气上下文...", "");
  try {
    const environment = await getAiEnvironmentContext();
    setMessage(els.recordMessage, userInput ? "正在结合你的输入生成一句话心情..." : "正在生成一句话心情...", "");
    const headers = {
      "Content-Type": "image/jpeg",
      "X-AI-Mood-Context": normalizedContext
    };
    if (userInput) {
      headers["X-AI-Mood-User-Input"] = encodeURIComponent(userInput);
    }
    const environmentHeader = aiEnvironmentHeader(environment);
    if (environmentHeader) {
      headers["X-AI-Environment"] = environmentHeader;
    }
    const data = await api("/api/ai-mood", {
      method: "POST",
      headers,
      body: photo
    });
    const mood = String(data.mood || "").trim();
    if (!mood) {
      throw new Error("AI 暂时没有生成可用心情。");
    }
    if (normalizedContext === "food") {
      if (els.foodMoodInput) els.foodMoodInput.value = mood;
    } else {
      els.moodInput.value = mood;
    }
    setMessage(els.recordMessage, "一句话心情已生成，可继续修改。", "success");
  } catch (error) {
    setMessage(els.recordMessage, error.message || "AI 心情生成失败。", "error");
  } finally {
    state.moodAiContext = null;
    updateMoodAiButtons();
  }
}

async function captureFoodPhoto() {
  if (!state.stream) {
    setMessage(els.recordMessage, "请先打开摄像头。", "error");
    return;
  }
  if (state.foodPhotos.length >= MAX_FOOD_PHOTOS_PER_RECORD) {
    setMessage(els.recordMessage, `每条食物记录最多 ${MAX_FOOD_PHOTOS_PER_RECORD} 张照片。`, "error");
    return;
  }

  state.isCapturing = true;
  state.foodAnalyzing = true;
  els.switchCameraButton.disabled = true;
  updateCaptureButtonState();
  setMessage(els.recordMessage, "正在调用千问识别食物和营养...", "");

  let photoEntry = null;
  let analysisRequest = null;
  try {
    const { width, height } = await waitForStableCameraFrame();
    const side = Math.min(width, height);
    const sx = (width - side) / 2;
    const sy = (height - side) / 2;
    els.captureCanvas.width = 900;
    els.captureCanvas.height = 900;
    const context = els.captureCanvas.getContext("2d");
    context.save();
    context.fillStyle = "#f5f8f5";
    context.fillRect(0, 0, 900, 900);
    if (state.facingMode === "user") {
      context.translate(900, 0);
      context.scale(-1, 1);
    }
    context.drawImage(els.cameraVideo, sx, sy, side, side, 0, 0, 900, 900);
    context.restore();

    const encoded = await encodeFoodPhoto();
    if (encoded.photo.size > MAX_CLIENT_PHOTO_BYTES) {
      throw new Error("单张照片必须小于 10MB。");
    }
    photoEntry = {
      id: cryptoRandomId(),
      photo: encoded.photo,
      thumbnail: encoded.thumbnail,
      url: URL.createObjectURL(encoded.photo)
    };
    state.foodPhotos.push(photoEntry);
    state.foodSelectionPhotoId = photoEntry.id;
    renderFoodCapturePanel();
    openFoodSelectionLoadingModal();
    setMessage(els.recordMessage, "千问正在识别食物和营养，稍后请选择食物和重量。", "");

    analysisRequest = startFoodAnalysisRequest();
    const foods = await analyzeFoodPhoto(photoEntry.photo, { signal: analysisRequest.signal });
    if (!activeFoodAnalysisRequest(analysisRequest.requestId)) {
      return;
    }
    if (foods.length) {
      openFoodSelectionModal(foods);
      setMessage(els.recordMessage, `识别到 ${foods.length} 项，请在弹窗中选择食物和重量。`, "success");
    } else {
      renderFoodSelectionEmpty();
      setMessage(els.recordMessage, "没有识别到可用的热量和营养数据，可以换角度再拍一张。", "");
    }
  } catch (error) {
    if (analysisRequest && isFoodAnalysisAbort(error)) {
      return;
    }
    if (photoEntry?.url) URL.revokeObjectURL(photoEntry.url);
    if (photoEntry?.id) {
      state.foodPhotos = state.foodPhotos.filter((photo) => photo.id !== photoEntry.id);
      if (state.foodSelectionPhotoId === photoEntry.id) {
        state.foodSelectionPhotoId = null;
      }
    }
    if (photoEntry) {
      renderFoodSelectionEmpty(error.message || "食物识别失败，请稍后重试。");
    }
    setMessage(els.recordMessage, error.message || "食物识别失败，请重拍。", "error");
  } finally {
    if (analysisRequest) {
      finishFoodAnalysisRequest(analysisRequest.requestId);
    }
    if (!analysisRequest || state.foodAnalyzeRequestId === analysisRequest.requestId) {
      state.isCapturing = false;
      state.foodAnalyzing = false;
    }
    if (state.stream) {
      els.switchCameraButton.disabled = false;
    }
    renderFoodCapturePanel();
    updateCaptureButtonState();
  }
}

async function confirmPendingFoodPhoto() {
  if (!state.foodPendingPhoto) return;
  if (state.foodPhotos.length >= MAX_FOOD_PHOTOS_PER_RECORD) {
    setMessage(els.recordMessage, `每条食物记录最多 ${MAX_FOOD_PHOTOS_PER_RECORD} 张照片。`, "error");
    return;
  }

  const photoEntry = state.foodPendingPhoto;
  state.foodPendingPhoto = null;
  state.foodPhotos.push(photoEntry);
  els.photoPreview.removeAttribute("src");
  els.photoPreview.classList.add("hidden");
  if (state.stream) {
    els.cameraVideo.classList.remove("hidden");
    els.emptyCamera.classList.add("hidden");
    els.switchCameraButton.disabled = false;
  }

  state.isCapturing = true;
  state.foodAnalyzing = true;
  renderFoodCapturePanel();
  updateCaptureButtonState();
  setMessage(els.recordMessage, "千问正在识别食物和营养...", "");

  let analysisRequest = null;
  try {
    analysisRequest = startFoodAnalysisRequest();
    const foods = await analyzeFoodPhoto(photoEntry.photo, { signal: analysisRequest.signal });
    if (!activeFoodAnalysisRequest(analysisRequest.requestId)) {
      return;
    }
    if (foods.length) {
      openFoodSelectionModal(foods);
      setMessage(els.recordMessage, `识别到 ${foods.length} 项，请选择食物和重量。`, "success");
    } else {
      setMessage(els.recordMessage, "没有识别到明确食物，可以换角度再拍一张。", "");
    }
  } catch (error) {
    if (analysisRequest && isFoodAnalysisAbort(error)) {
      return;
    }
    setMessage(els.recordMessage, error.message || "食物识别失败，请稍后重试。", "error");
  } finally {
    if (analysisRequest) {
      finishFoodAnalysisRequest(analysisRequest.requestId);
    }
    if (!analysisRequest || state.foodAnalyzeRequestId === analysisRequest.requestId) {
      state.isCapturing = false;
      state.foodAnalyzing = false;
    }
    renderFoodCapturePanel();
    updateCaptureButtonState();
  }
}

async function capturePhoto() {
  if (state.captureMode === "food") {
    await captureFoodPhoto();
    return;
  }

  if (!state.stream) {
    setMessage(els.recordMessage, "请先打开摄像头。", "error");
    return;
  }

  state.isCapturing = true;
  updateCaptureButtonState();
  setMessage(els.recordMessage, "正在本机识别五官点位并校正照片...", "");

  try {
    const { width, height } = await waitForStableCameraFrame();
    els.analysisCanvas.width = width;
    els.analysisCanvas.height = height;
    els.analysisCanvas.getContext("2d").drawImage(els.cameraVideo, 0, 0, width, height);

    const faceLandmarker = await ensureFaceLandmarker();
    if (faceLandmarker) {
      const result = faceLandmarker.detect(els.analysisCanvas);
      const landmarks = result.faceLandmarks?.[0];

      if (!landmarks) {
        throw new Error("没有检测到清晰五官，请调整光线和脸部位置后再拍。");
      }

      createAlignedFacePhoto(els.analysisCanvas, landmarks);
    } else {
      throw new Error("端侧五官模型未就绪，请稍后重试。");
    }

    clearCapturedPhoto();
    const encoded = await encodeCapturedPhotos();
    state.capturedPhoto = encoded.photo;
    state.capturedThumbnail = encoded.thumbnail;
    state.capturedPhotoUrl = URL.createObjectURL(state.capturedPhoto);
    els.photoPreview.src = state.capturedPhotoUrl;
    els.photoPreview.classList.remove("hidden");
    els.cameraVideo.classList.add("hidden");
    els.emptyCamera.classList.add("hidden");
    els.recordForm.classList.remove("hidden");
    els.retakeButton.disabled = false;
    const fallbackWeight = latestKnownWeight();
    const weightHint = Number.isFinite(fallbackWeight) ? `可留空沿用上次 ${formatWeight(fallbackWeight)}。` : "首次记录请填写体重。";
    setMessage(els.recordMessage, `照片已按五官点位自动校正，${weightHint}`, "success");
    els.weightInput.focus();
  } catch (error) {
    clearCapturedPhoto();
    els.recordForm.classList.add("hidden");
    els.photoPreview.classList.add("hidden");
    els.cameraVideo.classList.toggle("hidden", !state.stream);
    els.emptyCamera.classList.toggle("hidden", Boolean(state.stream));
    els.retakeButton.disabled = true;
    setMessage(els.recordMessage, error.message || "五官点位校正失败，请重新拍。", "error");
  } finally {
    state.isCapturing = false;
    updateCaptureButtonState();
  }
}

function retakePhoto() {
  if (state.captureMode === "food") {
    if (state.foodPendingPhoto) {
      clearPendingFoodPhoto();
    } else {
      clearFoodCaptureState();
    }
    renderFoodCapturePanel();
    setMessage(els.recordMessage, "", "");
    updateCaptureButtonState();
    return;
  }

  clearCapturedPhoto();
  els.recordForm.classList.add("hidden");
  els.weightInput.value = "";
  els.moodInput.value = "";
  els.photoPreview.classList.add("hidden");
  els.cameraVideo.classList.toggle("hidden", !state.stream);
  els.emptyCamera.classList.toggle("hidden", Boolean(state.stream));
  els.retakeButton.disabled = true;
  setMessage(els.recordMessage, "", "");
  updateCaptureButtonState();
}

async function deleteRecord(recordId) {
  if (!recordId) {
    return;
  }
  const record = state.historyRecords.find((item) => item.id === recordId)
    || state.records.find((item) => item.id === recordId);

  const description = record
    ? `${dateTimeFormat.format(new Date(record.timestamp))}${Number.isFinite(record.weight) ? `，${formatWeight(record.weight)}` : ""}`
    : "这条记录";
  if (!window.confirm(`确定删除这条记录吗？\n${description}`)) {
    return;
  }

  try {
    await api(`/api/records/${encodeURIComponent(recordId)}`, {
      method: "DELETE"
    });
    state.recordsLoaded = false;
    state.historyExpanded = true;
    await loadRecords({ force: true });
  } catch (error) {
    setMessage(els.recordMessage, error.message, "error");
  }
}

async function saveRecord(event) {
  event.preventDefault();
  const weight = els.weightInput.value.trim();
  const { text: mood, error: moodError } = normalizeLimitedText(els.moodInput.value, TEXT_LIMITS.mood, "一句话心情");
  const fallbackWeight = latestKnownWeight();
  const effectiveWeight = weight || (Number.isFinite(fallbackWeight) ? String(fallbackWeight) : "");

  if (moodError) {
    setMessage(els.recordMessage, moodError, "error");
    return;
  }

  if (!state.capturedPhoto) {
    setMessage(els.recordMessage, "请先完成拍照。", "error");
    return;
  }

  if (state.capturedPhoto.size > MAX_CLIENT_PHOTO_BYTES) {
    setMessage(els.recordMessage, "单张照片必须小于 10MB。", "error");
    return;
  }

  if (!effectiveWeight) {
    setMessage(els.recordMessage, "首次记录请登记体重。", "error");
    return;
  }

  const numericWeight = Number(effectiveWeight);
  if (!Number.isFinite(numericWeight) || numericWeight <= 0 || numericWeight > 500) {
    setMessage(els.recordMessage, "请输入合理的体重。", "error");
    return;
  }

  const submitButton = els.recordForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  setMessage(els.recordMessage, "正在保存...", "");
  let pendingRecordId = null;
  let uploadComplete = false;

  try {
    const saved = await api("/api/records", {
      method: "POST",
      headers: {
        "Content-Type": "image/jpeg",
        "X-Record-Weight": effectiveWeight,
        "X-Record-Mood": encodeURIComponent(mood)
      },
      body: state.capturedPhoto
    });
    pendingRecordId = saved.record.id;
    await api(`/api/records/${encodeURIComponent(pendingRecordId)}/thumbnail`, {
      method: "POST",
      headers: {
        "Content-Type": "image/jpeg"
      },
      body: state.capturedThumbnail
    });
    uploadComplete = true;

    clearCapturedPhoto();
    els.weightInput.value = "";
    els.moodInput.value = "";
    closeCamera();
    resetCaptureFlow();
    state.recordsLoaded = false;
    state.historyExpanded = true;
    await showDashboard(state.profile);
  } catch (error) {
    if (pendingRecordId && !uploadComplete) {
      await api(`/api/records/${encodeURIComponent(pendingRecordId)}`, { method: "DELETE" }).catch(() => {});
    }
    setMessage(els.recordMessage, error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
}

async function saveFoodRecord() {
  const { text: mood, error: moodError } = normalizeLimitedText(els.foodMoodInput?.value || "", TEXT_LIMITS.mood, "一句话心情");
  if (moodError) {
    setMessage(els.recordMessage, moodError, "error");
    return;
  }
  const validFoodItems = state.foodItems.filter((item) => {
    const calorie = parseNumberLike(item.calorie);
    return normalizeFoodPortions(item.portionUnits) > 0 && Number.isFinite(calorie) && calorie > 0;
  });
  if (!validFoodItems.length) {
    setMessage(els.recordMessage, "请至少保留一个包含热量数据的食物。", "error");
    return;
  }
  if (state.foodPendingPhoto) {
    setMessage(els.recordMessage, "当前照片仍在处理中，请稍后再保存。", "error");
    return;
  }

  els.saveFoodRecordButton.disabled = true;
  els.captureButton.disabled = true;
  els.retakeButton.disabled = true;
  setMessage(els.recordMessage, "正在保存食物记录...", "");
  let pendingRecordId = null;

  try {
    const saved = await api("/api/food-records", {
      method: "POST",
      body: JSON.stringify({
        mood,
        foods: validFoodItems.map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          portionUnits: item.portionUnits,
	          grams: item.grams,
	          unitCalorie: item.unitCalorie,
	          calorie: item.calorie,
	          trust: item.trust,
	          hasCalorie: item.hasCalorie,
	          unitNutrition: item.unitNutrition,
	          nutrition: item.nutrition,
	          recognitionSource: item.recognitionSource,
	          recognitionRank: item.recognitionRank
	        }))
      })
    });
    pendingRecordId = saved.record.id;

    for (const photo of state.foodPhotos) {
      const uploaded = await api(`/api/food-records/${encodeURIComponent(pendingRecordId)}/photos`, {
        method: "POST",
        headers: {
          "Content-Type": "image/jpeg"
        },
        body: photo.photo
      });
      if (uploaded.photo?.id && photo.thumbnail) {
        await api(`/api/food-records/${encodeURIComponent(pendingRecordId)}/photos/${encodeURIComponent(uploaded.photo.id)}/thumbnail`, {
          method: "POST",
          headers: {
            "Content-Type": "image/jpeg"
          },
          body: photo.thumbnail
        });
      }
    }

    clearFoodCaptureState();
    if (els.foodMoodInput) els.foodMoodInput.value = "";
    closeCamera();
    resetCaptureFlow();
    state.recordsLoaded = false;
    state.historyExpanded = true;
    await showDashboard(state.profile);
  } catch (error) {
    if (pendingRecordId) {
      await api(`/api/records/${encodeURIComponent(pendingRecordId)}`, { method: "DELETE" }).catch(() => {});
    }
    setMessage(els.recordMessage, error.message, "error");
  } finally {
    renderFoodCapturePanel();
    updateCaptureButtonState();
  }
}

function openReplayModal(replayUrl, focusElement) {
  if (!els.replayModal.classList.contains("hidden")) {
    return;
  }

  state.replaySourceElement = focusElement;
  state.replayRestoreFocus = state.lastInputWasKeyboard;
  state.replayClosing = false;
  focusElement?.blur();
  els.replayModal.classList.remove("hidden");
  els.replayModal.classList.remove("is-open");

  document.body.classList.add("replay-modal-open");
  els.replayFrame.src = replayUrl;
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => els.replayModal.classList.add("is-open"));
  });
}

function closeReplayModal(immediate = false) {
  if (els.replayModal.classList.contains("hidden") || state.replayClosing) {
    return;
  }
  state.replayClosing = true;
  els.replayModal.classList.remove("is-open");
  document.body.classList.remove("replay-modal-open");

  const finish = () => {
    els.replayModal.classList.add("hidden");
    els.replayFrame.removeAttribute("src");
    els.replayFrame.src = "about:blank";
    state.replayClosing = false;
    const sourceElement = state.replaySourceElement;
    const shouldRestoreFocus = state.replayRestoreFocus;
    state.replaySourceElement = null;
    state.replayRestoreFocus = false;
    if (shouldRestoreFocus) {
      sourceElement?.focus({ preventScroll: true });
    }
  };

  if (immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finish();
  } else {
    window.setTimeout(finish, 300);
  }
}

function openPersonalReplay() {
  if (!photoRecords().length) return;
  const replayUrl = new URL(appUrl("/replay.html"), window.location.origin);
  replayUrl.searchParams.set("v", REPLAY_BUILD_VERSION);
  replayUrl.searchParams.set("embedded", "1");
  openReplayModal(replayUrl.href, els.replayButton);
}

function openCommunityReplay(memberId, focusElement) {
  const replayUrl = new URL(appUrl("/replay.html"), window.location.origin);
  replayUrl.searchParams.set("v", REPLAY_BUILD_VERSION);
  replayUrl.searchParams.set("community", memberId);
  replayUrl.searchParams.set("embedded", "1");
  openReplayModal(replayUrl.href, focusElement);
}

function openPolicy(documentType) {
  const isAgreement = documentType === "agreement";
  els.policyTitle.textContent = isAgreement ? "用户协议" : "隐私政策";
  const template = isAgreement ? els.userAgreementTemplate : els.privacyPolicyTemplate;
  els.policyContent.replaceChildren(template.content.cloneNode(true));
  showSoftOverlay(els.policyModal);
  document.body.classList.add("policy-open");
  window.setTimeout(() => els.closePolicyButton.focus(), 0);
}

function closePolicy() {
  hideSoftOverlay(els.policyModal, () => {
    document.body.classList.remove("policy-open");
  });
}

function showConfirmationModal(modal, input, message) {
  input.value = "";
  message.textContent = "";
  showSoftOverlay(modal);
  document.body.classList.add("confirmation-open");
  window.setTimeout(() => input.focus(), 0);
}

function hideConfirmationModal(modal) {
  hideSoftOverlay(modal, () => {
    if (
      els.withdrawConsentModal.classList.contains("hidden")
      && els.deleteOwnAccountModal.classList.contains("hidden")
    ) {
      document.body.classList.remove("confirmation-open");
    }
  });
}

async function withdrawConsent(event) {
  event.preventDefault();
  const confirmation = els.withdrawConsentInput.value;
  if (confirmation !== "撤销并清除我的数据") {
    els.withdrawConsentMessage.textContent = "确认文字不一致。";
    return;
  }
  const submitButton = els.withdrawConsentForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  els.withdrawConsentMessage.textContent = "正在清除个人数据...";
  try {
    const data = await api("/api/privacy/withdraw", {
      method: "POST",
      body: JSON.stringify({ confirmation })
    });
    state.profile = data.profile;
    state.records = [];
    state.historyRecords = [];
    state.recordsLoaded = false;
    state.historyExpanded = false;
    state.community = null;
    hideConfirmationModal(els.withdrawConsentModal);
    await showSettingsView(state.profile);
    els.settingsMessage.textContent = `已撤销签署并清除 ${data.deleted.recordCount} 条记录，账户当前为基础模式。`;
  } catch (error) {
    els.withdrawConsentMessage.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
}

async function deleteOwnAccount(event) {
  event.preventDefault();
  const confirmation = els.deleteOwnAccountInput.value;
  const required = `我将删除所有数据并注销${state.profile?.accountCode || ""}`;
  if (confirmation !== required) {
    els.deleteOwnAccountMessage.textContent = "确认文字不一致。";
    return;
  }
  const submitButton = els.deleteOwnAccountForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  els.deleteOwnAccountMessage.textContent = "正在永久注销账户...";
  try {
    await api("/api/account", {
      method: "DELETE",
      body: JSON.stringify({ confirmation })
    });
    hideConfirmationModal(els.deleteOwnAccountModal);
    showLogin();
    setMessage(els.loginMessage, "账户及全部数据已永久删除。", "success");
  } catch (error) {
    els.deleteOwnAccountMessage.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
}

async function loadUserPasskeyStatus() {
  if (!state.profile) return null;
  try {
    const status = await api("/api/passkeys/status");
    state.passkeyStatus = status;
    if (state.profile) {
      state.profile = {
        ...state.profile,
        passkeys: {
          available: Boolean(status.hasIdentityBinding ?? status.hasQqBinding),
          activeCount: status.activeCount,
          enabled: status.passkeyLoginEnabled,
          promptAvailable: status.promptAvailable
        }
      };
    }
    renderPasskeyStatus(status);
    return status;
  } catch (error) {
    els.passkeySettingsMessage.textContent = error.message;
    renderPasskeyStatus();
    return null;
  }
}

async function deleteUserPasskey(credentialId, button = null) {
  const id = String(credentialId || "");
  if (!id) return;
  const confirmed = window.confirm("确定移除这个 Passkey 吗？\n移除后它将不能再登录本站；手机系统里保存的 Passkey 需要到设备设置中手动删除。");
  if (!confirmed) return;

  if (button) {
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
  }
  els.passkeySettingsMessage.textContent = "正在移除 Passkey...";
  try {
    const data = await api(`/api/passkeys/${encodeURIComponent(id)}`, {
      method: "DELETE",
      body: "{}"
    });
    state.profile = data.profile || state.profile;
    state.passkeyStatus = data.status;
    renderPasskeyStatus(data.status);
    els.passkeySettingsMessage.textContent = "Passkey 已移除。";
  } catch (error) {
    els.passkeySettingsMessage.textContent = error.message;
  } finally {
    if (button) {
      button.disabled = false;
      button.removeAttribute("aria-busy");
      button.blur();
    }
    await loadUserPasskeyStatus();
  }
}

async function addUserPasskey({ source = "settings" } = {}) {
  const isPrompt = source === "prompt";
  const messageElement = isPrompt ? els.passkeyPromptMessage : els.passkeySettingsMessage;
  const triggerButton = isPrompt ? els.startPasskeyPromptButton : els.addPasskeyButton;
  if (!passkeyRegistrationSupported()) {
    messageElement.textContent = "当前浏览器不支持 Passkey。";
    return;
  }
  triggerButton.disabled = true;
  messageElement.textContent = "正在打开系统 Passkey 设置...";
  const startedAt = Date.now();
  const attemptId = passkeyAttemptId("register");
  let stage = "register_options";
  try {
    const capabilities = await collectPasskeyCapabilities();
    const label = `手机 Passkey ${new Date().toLocaleDateString("zh-CN")}`;
    if (nativePasskeySupported()) {
      stage = "native_register";
      passkeyClientLog("register_native_start", { attemptId, source, stage, ...capabilities });
      messageElement.textContent = "正在通过 App 添加 Passkey...";
      const data = await nativePasskeyBridge().request("register", { label, source });
      state.profile = data.profile || state.profile;
      state.passkeyStatus = data.status;
      renderPasskeyStatus(data.status);
      messageElement.textContent = "Passkey 已添加，下次可以直接用它登录。";
      if (isPrompt) {
        window.setTimeout(hidePasskeyPrompt, 520);
      }
      return;
    }
    passkeyClientLog("register_start", { attemptId, source, stage, ...capabilities });
    const options = await api("/api/passkeys/register/options", {
      method: "POST",
      body: JSON.stringify({ label })
    });
    stage = "navigator_create";
    passkeyClientLog("register_options_received", {
      attemptId,
      source,
      stage,
      ...passkeyOptionSummary({
        ...(options.publicKey || {}),
        rpId: options.publicKey?.rp?.id || "",
        allowCredentials: options.publicKey?.excludeCredentials || []
      }, "create"),
      elapsedMs: Date.now() - startedAt
    });
    passkeyClientLog("register_create_start", {
      attemptId,
      source,
      stage,
      elapsedMs: Date.now() - startedAt
    });
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCreationOptionsFromJson(options.publicKey)
    });

    stage = "register_verify";
    passkeyClientLog("register_credential_created", {
      attemptId,
      source,
      stage,
      credentialType: credential?.type || "",
      elapsedMs: Date.now() - startedAt
    });
    const data = await api("/api/passkeys/register/verify", {
      method: "POST",
      body: JSON.stringify({ credential: credentialToJson(credential) })
    });
    state.profile = data.profile || state.profile;
    state.passkeyStatus = data.status;
    renderPasskeyStatus(data.status);
    messageElement.textContent = "Passkey 已添加，下次可以直接用它登录。";
    if (isPrompt) {
      window.setTimeout(hidePasskeyPrompt, 520);
    }
  } catch (error) {
    messageElement.textContent = passkeyErrorMessage(error);
    passkeyClientLog("register_failed", {
      attemptId,
      source,
      stage,
      elapsedMs: Date.now() - startedAt,
      ...passkeyErrorDetails(error)
    });
  } finally {
    triggerButton.disabled = false;
    await loadUserPasskeyStatus();
  }
}

async function loginWithUserPasskey(event = null) {
  event?.preventDefault();
  event?.currentTarget?.blur();
  els.passkeyLoginButton.blur();
  if (!webauthnSupported()) {
    setMessage(els.loginMessage, "当前浏览器不支持 Passkey，请使用 QQ 登录。", "error");
    passkeyClientLog("login_unsupported", { source: "login", stage: "support_check" });
    return;
  }
  els.passkeyLoginButton.disabled = true;
  els.passkeyLoginButton.setAttribute("aria-busy", "true");
  setMessage(els.loginMessage, "正在验证 Passkey...", "");
  const startedAt = Date.now();
  const attemptId = passkeyAttemptId("login");
  let stage = "login_options";
  try {
    const capabilities = await collectPasskeyCapabilities();
    passkeyClientLog("login_start", { attemptId, source: "login", stage, ...capabilities });
    const options = await api("/api/passkeys/login/options", { method: "POST", body: "{}" });
    stage = "navigator_get";
    passkeyClientLog("login_options_received", {
      attemptId,
      source: "login",
      stage,
      ...passkeyOptionSummary(options.publicKey, "primary"),
      elapsedMs: Date.now() - startedAt
    });
    passkeyClientLog("login_get_start", {
      attemptId,
      source: "login",
      stage,
      elapsedMs: Date.now() - startedAt
    });
    const credential = await navigator.credentials.get({
      publicKey: publicKeyRequestOptionsFromJson(options.publicKey)
    });

    stage = "login_verify";
    passkeyClientLog("login_credential_received", {
      attemptId,
      source: "login",
      stage,
      elapsedMs: Date.now() - startedAt
    });
    const data = await api("/api/passkeys/login/verify", {
      method: "POST",
      body: JSON.stringify({ credential: credentialToJson(credential) })
    });
    setMessage(els.loginMessage, "", "");
    await routeAfterAuthentication(data.profile);
    queuePasskeyPromptIfNeeded(data.profile);
  } catch (error) {
    setMessage(els.loginMessage, passkeyErrorMessage(error), "error");
    passkeyClientLog("login_failed", {
      attemptId,
      source: "login",
      stage,
      elapsedMs: Date.now() - startedAt,
      ...passkeyErrorDetails(error)
    });
  } finally {
    resetPasskeyLoginButtonState();
    window.setTimeout(resetPasskeyLoginButtonState, 0);
    window.setTimeout(resetPasskeyLoginButtonState, 700);
  }
}

async function logout() {
  closeCamera();
  await api("/api/logout", { method: "POST", body: "{}" }).catch(() => {});
  if (!postNativeSessionEvent("logout", { reason: "user-logout" })) {
    showLogin();
  }
}

async function routeAfterAuthentication(profile, respectUrl = true) {
  state.profile = profile;
  if (accountStatus().status === "banned") {
    await showSettingsView(profile, respectUrl, "overview");
    return;
  }
  const privacy = privacyStatus();
  if (privacy.mode === "unset" || privacy.renewalRequired) {
    await showDashboard(profile);
    return;
  }
  if (!privacy.fullAccess) {
    await showCommunityView(profile, respectUrl);
    return;
  }
  const requestedTab = new URLSearchParams(window.location.search).get("tab");
  if (requestedTab === "community") {
    await showCommunityView(profile, respectUrl);
  } else if (requestedTab === "settings") {
    await showSettingsView(profile, respectUrl);
  } else {
    await showDashboard(profile);
  }
}

els.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage(els.loginMessage, "请选择登录方式继续。", "");
});

els.appleLoginButton?.addEventListener("click", startAppleLogin);
els.qqLoginButton.addEventListener("click", startQqLogin);
els.passkeyLoginButton.addEventListener("click", loginWithUserPasskey);
els.testLoginButton?.addEventListener("click", loginWithTestAccount);
els.bindAppleAccountButton?.addEventListener("click", startAppleAccountBinding);
els.bindQqAccountButton?.addEventListener("click", startQqAccountBinding);
els.syncQqProfileButton?.addEventListener("click", startQqProfileSync);
els.editProfileButton?.addEventListener("click", startProfileEdit);
els.cancelProfileEditButton?.addEventListener("click", cancelProfileEdit);
els.saveProfileButton?.addEventListener("click", saveProfileSettings);
for (const button of els.profileGenderButtons) {
  button.addEventListener("click", () => {
    if (!state.profileEditing || state.profileSaving) return;
    state.profileDraft.gender = button.dataset.profileGender || "";
    renderAccountProfilePanel();
  });
}
els.profileBirthdayToggle?.addEventListener("click", () => {
  if (!state.profileEditing || state.profileSaving) return;
  state.birthdayPickerOpen = !state.birthdayPickerOpen;
  renderAccountProfilePanel();
});
els.profileBirthdayPicker?.addEventListener("click", (event) => {
  const partButton = event.target.closest("[data-birthday-part]");
  if (!partButton || !state.profileEditing || state.profileSaving) return;
  event.preventDefault();
  setBirthdayDraftPart(partButton.dataset.birthdayPart, partButton.dataset.birthdayValue);
});
els.profileBirthdayClearButton?.addEventListener("click", () => {
  if (!state.profileEditing || state.profileSaving) return;
  state.profileDraft = {
    ...state.profileDraft,
    birthday: "",
    year: null,
    month: null,
    day: null
  };
  renderAccountProfilePanel();
});
els.profileBirthdayDoneButton?.addEventListener("click", () => {
  state.birthdayPickerOpen = false;
  renderAccountProfilePanel();
});
els.settingsLogoutButton.addEventListener("click", logout);
els.personalTabButton.addEventListener("click", (event) => {
  event.currentTarget.blur();
  if (state.activeTab !== "personal" || els.dashboardView.classList.contains("hidden")) {
    showDashboard(state.profile);
  }
});
els.communityTabButton.addEventListener("click", (event) => {
  event.currentTarget.blur();
  if (state.activeTab !== "community" || els.communityView.classList.contains("hidden")) {
    showCommunityView();
  }
});
els.settingsTabButton.addEventListener("click", (event) => {
  event.currentTarget.blur();
  if (state.activeTab !== "settings" || els.settingsView.classList.contains("hidden")) {
    showSettingsView(state.profile, true, "overview");
  } else {
    showSettingsPanel("overview");
  }
});
els.accountProfileOption.addEventListener("click", () => showSettingsPanel("profile"));
els.accountBindingsOption?.addEventListener("click", () => showSettingsPanel("bindings"));
els.privacySettingsOption.addEventListener("click", () => showSettingsPanel("privacy"));
els.passkeySettingsOption.addEventListener("click", () => showSettingsPanel("passkey"));
els.accountDeletionOption.addEventListener("click", () => showSettingsPanel("account"));
els.feedbackOption.addEventListener("click", () => openFeedbackModal({ type: "feedback", targetType: "system" }));
els.nativeHealthSyncOption?.addEventListener("click", () => {
  const days = Math.max(state.nativeHealthLoadedDays || 0, NATIVE_HEALTH_INITIAL_DAYS);
  syncNativeHealthData({ days, force: true, interactive: true }).catch(() => {});
});
els.readNativeHealthTodayButton?.addEventListener("click", () => readNativeHealthSnapshot(1));
els.readNativeHealthRecentButton?.addEventListener("click", () => readNativeHealthSnapshot(30));
for (const button of els.settingsBackButtons) {
  button.addEventListener("click", () => showSettingsPanel(button.dataset.settingsPanel || "overview"));
}
els.agreementConsentCheck.addEventListener("change", updateFullConsentButton);
els.sensitiveConsentCheck.addEventListener("change", updateFullConsentButton);
els.chooseBasicModeButton.addEventListener("click", async () => {
  if (state.privacyConsentStep === "full") {
    showBasicModeConsent();
    return;
  }
  els.chooseBasicModeButton.disabled = true;
  els.acceptFullModeButton.disabled = true;
  els.privacyConsentMessage.textContent = "正在退出...";
  try {
    await logout();
  } catch (error) {
    els.privacyConsentMessage.textContent = error.message;
    els.chooseBasicModeButton.disabled = false;
    updateFullConsentButton();
  }
});
els.acceptFullModeButton.addEventListener("click", async () => {
  const mode = state.privacyConsentStep === "basic" ? "basic" : "full";
  els.acceptFullModeButton.disabled = true;
  els.privacyConsentMessage.textContent = mode === "basic" ? "正在进入基础模式..." : "正在保存你的选择...";
  try {
    await updatePrivacyMode(mode, { fromConsent: true });
  } catch (error) {
    els.privacyConsentMessage.textContent = error.message;
    updateFullConsentButton();
  }
});
els.fullModeButton.addEventListener("click", () => {
  if (hasFullMode()) {
    els.settingsMessage.textContent = "当前已经是完整模式。";
  } else {
    showPrivacyConsent("settings");
  }
});
els.basicModeButton.addEventListener("click", async () => {
  if (privacyStatus().mode === "basic" && !hasFullMode()) {
    els.settingsMessage.textContent = "当前已经是基础模式。";
    return;
  }
  els.basicModeButton.disabled = true;
  els.settingsMessage.textContent = "正在切换模式...";
  try {
    await updatePrivacyMode("basic");
    els.settingsMessage.textContent = "已切换到基础模式，个人数据会保留但不可访问，社区共享已关闭。";
  } catch (error) {
    els.settingsMessage.textContent = error.message;
  } finally {
    els.basicModeButton.disabled = false;
  }
});
els.addPasskeyButton.addEventListener("click", () => addUserPasskey());
els.passkeyList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-passkey-delete]");
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  deleteUserPasskey(button.dataset.passkeyDelete, button);
});
els.dismissPasskeyPromptButton.addEventListener("click", hidePasskeyPrompt);
els.startPasskeyPromptButton.addEventListener("click", () => addUserPasskey({ source: "prompt" }));
document.addEventListener("click", (event) => {
  const copyButton = event.target.closest("[data-copy-text]");
  if (copyButton) {
    event.preventDefault();
    event.stopPropagation();
    copyTextToClipboard(copyButton.dataset.copyText, copyButton);
    return;
  }

  const policyButton = event.target.closest("[data-policy-document]");
  if (policyButton) openPolicy(policyButton.dataset.policyDocument);
});
els.closePolicyButton.addEventListener("click", closePolicy);
els.policyModal.addEventListener("click", (event) => {
  if (event.target === els.policyModal) closePolicy();
});
els.withdrawConsentButton.addEventListener("click", () => {
  showConfirmationModal(els.withdrawConsentModal, els.withdrawConsentInput, els.withdrawConsentMessage);
});
els.withdrawConsentForm.addEventListener("submit", withdrawConsent);
els.cancelWithdrawConsentButton.addEventListener("click", () => hideConfirmationModal(els.withdrawConsentModal));
els.deleteOwnAccountButton.addEventListener("click", () => {
  const phrase = `我将删除所有数据并注销${state.profile?.accountCode || ""}`;
  els.deleteOwnAccountPhrase.textContent = phrase;
  els.deleteOwnAccountCopyButton.dataset.copyText = phrase;
  showConfirmationModal(els.deleteOwnAccountModal, els.deleteOwnAccountInput, els.deleteOwnAccountMessage);
});
els.deleteOwnAccountForm.addEventListener("submit", deleteOwnAccount);
els.cancelDeleteOwnAccountButton.addEventListener("click", () => hideConfirmationModal(els.deleteOwnAccountModal));
els.communityShareToggle.addEventListener("change", () => updateCommunitySharing(els.communityShareToggle.checked));
els.declineCommunityShareButton.addEventListener("click", () => updateCommunitySharing(false));
els.acceptCommunityShareButton.addEventListener("click", () => updateCommunitySharing(true));
els.communityFeedTabButton.addEventListener("click", (event) => {
  event.currentTarget.blur();
  setCommunityPanel("feed");
});
els.communityRankingTabButton.addEventListener("click", (event) => {
  event.currentTarget.blur();
  setCommunityPanel("ranking");
});
els.communityGrid.addEventListener("click", (event) => {
  if (event.target.closest("[data-community-food-carousel]")) return;
  const card = event.target.closest("[data-community-open]");
  if (card) openCommunityDetail(card.dataset.communityOpen);
});
els.communityGrid.addEventListener("keydown", (event) => {
  const card = event.target.closest("[data-community-open]");
  if (card && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openCommunityDetail(card.dataset.communityOpen);
  }
});
els.communityRankingList.addEventListener("click", (event) => {
  const item = event.target.closest("[data-community-open]");
  if (item) openCommunityDetail(item.dataset.communityOpen);
});
els.rankingPeriods.forEach((button) => button.addEventListener("click", (event) => {
  event.currentTarget.blur();
  if (state.communityRankingPeriod === button.dataset.rankingPeriod) {
    return;
  }
  state.communityRankingPeriod = button.dataset.rankingPeriod;
  renderCommunityRanking();
}));
els.closeCommunityDetailButton.addEventListener("click", (event) => {
  event.currentTarget.blur();
  closeCommunityDetail();
});
els.communityDetailModal.addEventListener("click", (event) => {
  if (event.target === els.communityDetailModal) closeCommunityDetail();
});
els.communityDetailContent.addEventListener("click", (event) => {
  const likeButton = event.target.closest("[data-community-like]");
  if (likeButton) {
    toggleCommunityLike(likeButton);
    return;
  }
  const replayButton = event.target.closest("[data-community-replay]");
  if (replayButton) {
    replayButton.blur();
    openCommunityReplay(replayButton.dataset.communityReplay, replayButton);
    return;
  }
  const commentButton = event.target.closest("[data-community-comment-focus]");
  if (commentButton) {
    commentButton.blur();
    openCommunityComments({ focusInput: true });
    return;
  }
  const shareButton = event.target.closest("[data-community-share]");
  if (shareButton) {
    shareButton.blur();
    shareCommunityMember(shareButton);
    return;
  }
  const reportMemberButton = event.target.closest("[data-community-report-member]");
  if (reportMemberButton) {
    reportMemberButton.blur();
    openFeedbackModal({
      type: "report",
      targetType: "member",
      targetMemberId: reportMemberButton.dataset.communityReportMember,
      category: "content"
    });
    return;
  }
});
els.closeCommunityCommentsButton?.addEventListener("click", (event) => {
  event.currentTarget.blur();
  closeCommunityComments();
});
els.communityCommentsModal?.addEventListener("click", (event) => {
  if (event.target === els.communityCommentsModal) closeCommunityComments();
});
els.communityCommentsContent?.addEventListener("click", (event) => {
  const reportCommentButton = event.target.closest("[data-comment-report]");
  if (reportCommentButton) {
    reportCommentButton.blur();
    openFeedbackModal({
      type: "report",
      targetType: "comment",
      targetMemberId: state.communityDetailMemberId,
      targetCommentId: reportCommentButton.dataset.commentReport,
      category: "harassment"
    });
    return;
  }
  const deleteButton = event.target.closest("[data-comment-delete]");
  if (deleteButton) {
    deleteButton.blur();
    deleteCommunityComment(deleteButton.dataset.commentDelete);
  }
});
els.communityCommentsContent?.addEventListener("submit", (event) => {
  if (event.target.matches("#communityCommentForm")) {
    event.preventDefault();
    submitCommunityComment(event.target);
  }
});

els.feedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitFeedbackForm();
});
els.cancelFeedbackButton.addEventListener("click", closeFeedbackModal);
els.feedbackImageAddButton?.addEventListener("click", () => {
  els.feedbackImagesInput?.click();
});
els.feedbackImagesInput?.addEventListener("change", () => {
  addFeedbackImages(els.feedbackImagesInput.files);
});
els.feedbackImagePreviewList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-feedback-image-remove]");
  if (!button) return;
  const id = button.dataset.feedbackImageRemove;
  state.feedbackImages = state.feedbackImages.filter((image) => image.id !== id);
  renderFeedbackImages();
});
els.feedbackModal.addEventListener("click", (event) => {
  if (event.target === els.feedbackModal) closeFeedbackModal();
});

function handleRecordEntryClick(mode) {
  if (!accountCanInteract()) {
    window.alert(accountRestrictedMessage());
    return;
  }
  showCaptureView(mode);
}

els.startBodyRecordButton?.addEventListener("click", () => handleRecordEntryClick("body"));
els.startFoodRecordButton?.addEventListener("click", () => handleRecordEntryClick("food"));
els.backToDashboardButton.addEventListener("click", () => {
  closeCamera();
  resetCaptureFlow();
  showDashboard(state.profile);
});
els.cameraStage.addEventListener("click", (event) => {
  if (event.target.closest("button")) {
    return;
  }

  if (!state.stream) {
    openCamera();
  }
});
els.cameraStage.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && !state.stream) {
    event.preventDefault();
    openCamera();
  }
});
els.switchCameraButton.addEventListener("click", switchCamera);
els.captureButton.addEventListener("click", capturePhoto);
els.retakeButton.addEventListener("click", retakePhoto);
els.bodyMoodAiButton?.addEventListener("click", () => requestAiMood("body"));
els.foodMoodAiButton?.addEventListener("click", () => requestAiMood("food"));
els.recordForm.addEventListener("submit", saveRecord);
els.saveFoodRecordButton?.addEventListener("click", saveFoodRecord);
els.addManualFoodButton?.addEventListener("click", () => {
  els.addManualFoodButton.blur();
  openManualFoodModal();
});
els.manualFoodForm?.addEventListener("submit", submitManualFood);
els.cancelManualFoodButton?.addEventListener("click", () => closeManualFoodModal());
els.manualFoodModal?.addEventListener("click", (event) => {
  if (event.target === els.manualFoodModal) closeManualFoodModal();
});
els.closeFoodSelectionButton?.addEventListener("click", () => closeFoodSelectionModal());
els.cancelFoodSelectionButton?.addEventListener("click", () => closeFoodSelectionModal());
els.applyFoodSelectionButton?.addEventListener("click", applyFoodSelection);
els.foodSelectionModal?.addEventListener("click", (event) => {
  if (event.target === els.foodSelectionModal) closeFoodSelectionModal();
});
els.foodSelectionList?.addEventListener("change", (event) => {
  const toggle = event.target.closest("[data-food-selection-toggle]");
  if (toggle) {
    const candidate = state.foodSelectionCandidates.find((item) => item.id === toggle.dataset.foodSelectionToggle);
    if (candidate) {
      candidate.selected = toggle.checked;
      updateFoodSelectionRow(candidate);
      updateFoodSelectionSummary();
    }
    return;
  }

  const input = event.target.closest("[data-food-selection-amount]");
  if (input) {
    const candidate = state.foodSelectionCandidates.find((item) => item.id === input.dataset.foodSelectionAmount);
    if (candidate) {
      const grams = normalizeFoodGrams(input.value, 0);
      candidate.portionUnits = normalizeFoodPortions(grams / 100);
      input.value = foodGramInputValue(candidate.portionUnits * 100);
      updateFoodSelectionRow(candidate);
      updateFoodSelectionSummary();
    }
  }
});
els.foodSelectionList?.addEventListener("input", (event) => {
  const input = event.target.closest("[data-food-selection-amount]");
  if (!input) return;
  const candidate = state.foodSelectionCandidates.find((item) => item.id === input.dataset.foodSelectionAmount);
  const value = parseNumberLike(input.value);
  if (candidate && Number.isFinite(value) && value >= 0) {
    const grams = normalizeFoodGrams(value, 0);
    candidate.portionUnits = normalizeFoodPortions(grams / 100);
    updateFoodSelectionSummary();
  }
});
els.foodSelectionList?.addEventListener("click", (event) => {
  const quickAiButton = event.target.closest("[data-food-selection-ai]");
  if (quickAiButton) {
    quickAiButton.blur();
    const candidate = state.foodSelectionCandidates.find((item) => item.id === quickAiButton.dataset.foodSelectionAi);
    if (candidate) autoCompleteFoodCandidateWithAi(candidate);
    return;
  }

  const editButton = event.target.closest("[data-food-selection-edit]");
  if (editButton) {
    editButton.blur();
    state.foodEditingCandidateId = editButton.dataset.foodSelectionEdit;
    renderFoodSelectionModal();
    return;
  }

  const editCancel = event.target.closest("[data-food-edit-cancel]");
  if (editCancel) {
    editCancel.blur();
    state.foodEditingCandidateId = null;
    renderFoodSelectionModal();
    return;
  }

  const editSave = event.target.closest("[data-food-edit-save]");
  if (editSave) {
    editSave.blur();
    const candidate = state.foodSelectionCandidates.find((item) => item.id === editSave.dataset.foodEditSave);
    if (candidate) confirmFoodCandidateEdit(candidate);
    return;
  }

  const editAi = event.target.closest("[data-food-edit-ai]");
  if (editAi) {
    editAi.blur();
    const candidate = state.foodSelectionCandidates.find((item) => item.id === editAi.dataset.foodEditAi);
    if (candidate) estimateFoodCandidateWithAi(candidate);
    return;
  }

  const stepButton = event.target.closest("[data-food-selection-step]");
  if (!stepButton) return;
  stepButton.blur();
  const candidate = state.foodSelectionCandidates.find((item) => item.id === stepButton.dataset.foodSelectionStep);
  if (!candidate) return;
  const step = parseNumberLike(stepButton.dataset.step) || 0;
  const grams = stepFoodGrams(normalizeFoodPortions(candidate.portionUnits) * 100, step);
  candidate.portionUnits = normalizeFoodPortions(grams / 100);
  updateFoodSelectionRow(candidate);
  updateFoodSelectionSummary();
});
els.foodPhotoStack?.addEventListener("click", (event) => {
  const button = event.target.closest(".food-photo-delete-button");
  if (!button) return;
  button.blur();
  const id = button.dataset.foodPhotoId;
  const photo = state.foodPhotos.find((item) => item.id === id);
  if (photo?.url) URL.revokeObjectURL(photo.url);
  state.foodPhotos = state.foodPhotos.filter((item) => item.id !== id);
  renderFoodCapturePanel();
  updateCaptureButtonState();
});
els.foodResultList?.addEventListener("click", (event) => {
  const button = event.target.closest(".food-delete-button");
  if (!button) return;
  const id = button.dataset.foodId;
  state.foodItems = state.foodItems.filter((item) => item.id !== id);
  renderFoodCapturePanel();
});
els.captureModeButtons.forEach((button) => {
  button.addEventListener("click", () => setCaptureMode(button.dataset.captureMode));
});
els.replayButton.addEventListener("click", openPersonalReplay);
els.aiAdviceButton?.addEventListener("click", () => {
  els.aiAdviceButton.blur();
  openAiSummary();
});
els.closeAiSummaryButton?.addEventListener("click", (event) => {
  event.currentTarget.blur();
  closeAiSummary();
});
els.aiSummaryModal?.addEventListener("click", (event) => {
  if (event.target === els.aiSummaryModal) closeAiSummary();
});
els.historyToggleButton.addEventListener("click", () => {
  toggleHistory().catch(() => {
    state.historyLoading = false;
    els.historyLoader.textContent = "加载失败，请重试";
  });
});
els.replayModal.addEventListener("click", (event) => {
  if (event.target === els.replayModal) {
    closeReplayModal();
  }
});
window.addEventListener("message", (event) => {
  if (event.origin === window.location.origin && event.data?.type === "close-replay-modal") {
    closeReplayModal();
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    void syncActiveViewFromServer();
  }
});
window.addEventListener("focus", () => {
  void syncActiveViewFromServer();
});
window.addEventListener("online", () => {
  void syncActiveViewFromServer({ force: true });
});
window.addEventListener("scroll", scheduleHistoryFoodGalleryScale, { passive: true });
document.addEventListener("pointerdown", () => {
  state.lastInputWasKeyboard = false;
}, true);
document.addEventListener("dragstart", (event) => {
  if (isImageInteractionTarget(event.target)) event.preventDefault();
}, true);
document.addEventListener("contextmenu", (event) => {
  if (isImageInteractionTarget(event.target)) event.preventDefault();
}, true);
document.addEventListener("keydown", (event) => {
  state.lastInputWasKeyboard = true;
  if (event.key === "Escape") {
    if (!els.manualFoodModal.classList.contains("hidden")) closeManualFoodModal();
    else if (!els.replayModal.classList.contains("hidden")) closeReplayModal();
    else if (!els.aiSummaryModal.classList.contains("hidden")) closeAiSummary();
    else if (!els.communityCommentsModal.classList.contains("hidden")) closeCommunityComments();
    else if (!els.communityDetailModal.classList.contains("hidden")) closeCommunityDetail();
    else if (!els.policyModal.classList.contains("hidden")) closePolicy();
    else if (!els.withdrawConsentModal.classList.contains("hidden")) hideConfirmationModal(els.withdrawConsentModal);
    else if (!els.deleteOwnAccountModal.classList.contains("hidden")) hideConfirmationModal(els.deleteOwnAccountModal);
    else if (!els.foodSelectionModal.classList.contains("hidden")) closeFoodSelectionModal();
    else if (!els.feedbackModal.classList.contains("hidden")) closeFeedbackModal();
  }
});
els.historyList.addEventListener("click", (event) => {
  const button = event.target.closest(".delete-record-button");
  if (button) {
    event.preventDefault();
    event.stopPropagation();
    deleteRecord(button.dataset.recordId);
  }
});

const historyObserver = new IntersectionObserver((entries) => {
  if (!hasFullMode() || !state.historyExpanded || els.dashboardView.classList.contains("hidden")) {
    return;
  }
  if (entries.some((entry) => entry.isIntersecting)) {
    loadNextHistoryPage().catch(() => {
      state.historyLoading = false;
      els.historyLoader.textContent = "加载失败，请继续下拉重试";
    });
  }
}, { rootMargin: "240px 0px" });
historyObserver.observe(els.historySentinel);

document.addEventListener("touchstart", handlePullStart, { passive: true });
document.addEventListener("touchmove", handlePullMove, { passive: false });
document.addEventListener("touchend", handlePullEnd, { passive: true });
document.addEventListener("touchcancel", resetPullRefresh, { passive: true });
document.addEventListener("touchstart", handleEdgeSpringStart, { passive: true });
document.addEventListener("touchmove", handleEdgeSpringMove, { passive: false });
document.addEventListener("touchend", handleEdgeSpringEnd, { passive: true });
document.addEventListener("touchcancel", handleEdgeSpringEnd, { passive: true });

let chartResizeTimer = null;
function handleViewportChange() {
  scheduleViewportMetricsRefresh();
  if (!state.profile) {
    return;
  }

  const nextWidth = layoutViewportWidth();
  if (state.lastResponsiveViewportWidth && Math.abs(nextWidth - state.lastResponsiveViewportWidth) < 8) {
    return;
  }

  window.clearTimeout(chartResizeTimer);
  chartResizeTimer = window.setTimeout(() => {
    const settledWidth = layoutViewportWidth();
    if (state.lastResponsiveViewportWidth && Math.abs(settledWidth - state.lastResponsiveViewportWidth) < 8) {
      return;
    }
    state.lastResponsiveViewportWidth = settledWidth;

    if (!els.dashboardView.classList.contains("hidden")) {
      renderChart();
      scheduleHistoryFoodGalleryScale();
    } else if (!els.communityView.classList.contains("hidden")) {
      renderCommunity();
      if (state.communityDetailMemberId) {
        renderCommunityDetail({ preserveScroll: true, showDefaultChartDetail: false });
      }
    }
  }, 260);
}

window.addEventListener("resize", handleViewportChange, { passive: true });
window.addEventListener("orientationchange", () => {
  scheduleViewportMetricsRefresh();
  handleViewportChange();
}, { passive: true });
window.visualViewport?.addEventListener("resize", handleViewportChange, { passive: true });
window.visualViewport?.addEventListener("scroll", () => {
  scheduleViewportMetricsRefresh();
}, { passive: true });
state.lastResponsiveViewportWidth = layoutViewportWidth();
scheduleViewportMetricsRefresh();

(async function init() {
  const qqStatus = consumeQqLoginStatusFromUrl();
  const appleStatus = consumeAppleLoginStatusFromUrl();
  consumeStoredAuthResults();
  try {
    const data = await api("/api/me");
    await routeAfterAuthentication(data.profile, false);
    queuePasskeyPromptIfNeeded(data.profile);
    if (isQqSyncStatus(qqStatus) || isBindStatus(qqStatus)) {
      await handleQqLoginResult(qqStatus);
    }
    if (isBindStatus(appleStatus)) {
      await handleAppleLoginResult(appleStatus);
    }
  } catch {
    showLogin();
    showQqLoginStatus(qqStatus);
    showAppleLoginStatus(appleStatus);
  } finally {
    hideInitialLoader();
  }
})();
