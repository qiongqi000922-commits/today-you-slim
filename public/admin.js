const basePath = window.location.pathname.replace(/\/$/, "");
const API_TIMEOUT_MS = 20000;
const JF = window.JFShared;

const state = {
  accounts: [],
  summary: null,
  selectedCode: null,
  csrfToken: "",
  adminSession: null,
  authEvents: [],
  loginEvents: [],
  loginSummary: null,
  moderationQueue: null,
  serverStatus: null,
  runtimeEvents: null,
  performanceSummary: null,
  logmealQuota: null,
  deepseekBalance: null,
  qwenUsage: null,
  foodRecognitionPriorityDraft: null,
  activeSection: "overview",
  isRefreshing: false
};

const els = {
  loginView: document.querySelector("#adminLoginView"),
  shell: document.querySelector("#adminShell"),
  loginForm: document.querySelector("#adminLoginForm"),
  username: document.querySelector("#adminUsername"),
  password: document.querySelector("#adminPassword"),
  loginFields: document.querySelector(".login-fields"),
  passwordDivider: document.querySelector("#passwordDivider"),
  passkeyLoginButton: document.querySelector("#passkeyLoginButton"),
  passkeyStatusText: document.querySelector("#passkeyStatusText"),
  loginMessage: document.querySelector("#adminLoginMessage"),
  pullRefresh: document.querySelector("#adminPullRefresh"),
  pullRefreshText: document.querySelector("#adminPullRefreshText"),
  adminIdentity: document.querySelector("#adminIdentity"),
  opsHealthBadge: document.querySelector("#opsHealthBadge"),
  opsHealthText: document.querySelector("#opsHealthText"),
  opsRuntimeBadge: document.querySelector("#opsRuntimeBadge"),
  opsRuntimeText: document.querySelector("#opsRuntimeText"),
  opsStorageBadge: document.querySelector("#opsStorageBadge"),
  opsStorageText: document.querySelector("#opsStorageText"),
  opsQuotaBadge: document.querySelector("#opsQuotaBadge"),
  opsQuotaText: document.querySelector("#opsQuotaText"),
  overviewUpdatedAt: document.querySelector("#overviewUpdatedAt"),
  dashboardHealthTitle: document.querySelector("#dashboardHealthTitle"),
  dashboardHealthMeta: document.querySelector("#dashboardHealthMeta"),
  dashboardHealthList: document.querySelector("#dashboardHealthList"),
  dashboardRiskTitle: document.querySelector("#dashboardRiskTitle"),
  dashboardRiskMeta: document.querySelector("#dashboardRiskMeta"),
  dashboardRiskList: document.querySelector("#dashboardRiskList"),
  dashboardCapacityTitle: document.querySelector("#dashboardCapacityTitle"),
  dashboardCapacityMeta: document.querySelector("#dashboardCapacityMeta"),
  dashboardCapacityBar: document.querySelector("#dashboardCapacityBar"),
  dashboardCapacityList: document.querySelector("#dashboardCapacityList"),
  dashboardAiTitle: document.querySelector("#dashboardAiTitle"),
  dashboardAiMeta: document.querySelector("#dashboardAiMeta"),
  dashboardAiList: document.querySelector("#dashboardAiList"),
  adminSessionMeta: document.querySelector("#adminSessionMeta"),
  csrfStatus: document.querySelector("#csrfStatus"),
  authEventList: document.querySelector("#authEventList"),
  userAuditMeta: document.querySelector("#userAuditMeta"),
  userAuditList: document.querySelector("#userAuditList"),
  serverStatusUpdatedAt: document.querySelector("#serverStatusUpdatedAt"),
  serverRuntimeMeta: document.querySelector("#serverRuntimeMeta"),
  serverRuntimeGrid: document.querySelector("#serverRuntimeGrid"),
  serverStorageMeta: document.querySelector("#serverStorageMeta"),
  serverStorageGrid: document.querySelector("#serverStorageGrid"),
  serverCapacityMeta: document.querySelector("#serverCapacityMeta"),
  serverCapacityProgress: document.querySelector("#serverCapacityProgress"),
  serverCapacityGrid: document.querySelector("#serverCapacityGrid"),
  serverCapacityMessage: document.querySelector("#serverCapacityMessage"),
  pauseRegistrationButton: document.querySelector("#pauseRegistrationButton"),
  openRegistrationButton: document.querySelector("#openRegistrationButton"),
  foodRecognitionConfigMeta: document.querySelector("#foodRecognitionConfigMeta"),
  foodRecognitionPriorityList: document.querySelector("#foodRecognitionPriorityList"),
  foodRecognitionConfigMessage: document.querySelector("#foodRecognitionConfigMessage"),
  saveFoodRecognitionPriorityButton: document.querySelector("#saveFoodRecognitionPriorityButton"),
  runtimeUpdatedAt: document.querySelector("#runtimeUpdatedAt"),
  runtimeOverviewMeta: document.querySelector("#runtimeOverviewMeta"),
  runtimeWarningCount: document.querySelector("#runtimeWarningCount"),
  runtimeErrorCount: document.querySelector("#runtimeErrorCount"),
  runtimeFallbackCount: document.querySelector("#runtimeFallbackCount"),
  runtimeTotalCount: document.querySelector("#runtimeTotalCount"),
  runtimeHourlyChart: document.querySelector("#runtimeHourlyChart"),
  runtimeTopEvents: document.querySelector("#runtimeTopEvents"),
  runtimeAreaMeta: document.querySelector("#runtimeAreaMeta"),
  runtimeAreaList: document.querySelector("#runtimeAreaList"),
  runtimeEventList: document.querySelector("#runtimeEventList"),
  clearRuntimeEventsButton: document.querySelector("#clearRuntimeEventsButton"),
  performanceUpdatedAt: document.querySelector("#performanceUpdatedAt"),
  performanceOverviewMeta: document.querySelector("#performanceOverviewMeta"),
  performanceStartupP95: document.querySelector("#performanceStartupP95"),
  performanceImageCount: document.querySelector("#performanceImageCount"),
  performanceImageP95: document.querySelector("#performanceImageP95"),
  performanceImageErrorCount: document.querySelector("#performanceImageErrorCount"),
  performanceApiErrorCount: document.querySelector("#performanceApiErrorCount"),
  performanceModelP95: document.querySelector("#performanceModelP95"),
  performanceHourlyChart: document.querySelector("#performanceHourlyChart"),
  performanceTopEvents: document.querySelector("#performanceTopEvents"),
  performanceSlowAssetMeta: document.querySelector("#performanceSlowAssetMeta"),
  performanceSlowAssets: document.querySelector("#performanceSlowAssets"),
  performanceRecentEvents: document.querySelector("#performanceRecentEvents"),
  clearPerformanceEventsButton: document.querySelector("#clearPerformanceEventsButton"),
  apiQuotaUpdatedAt: document.querySelector("#apiQuotaUpdatedAt"),
  logmealQuotaUpdatedAt: document.querySelector("#logmealQuotaUpdatedAt"),
  logmealQuotaMeta: document.querySelector("#logmealQuotaMeta"),
  logmealQuotaProgress: document.querySelector("#logmealQuotaProgress"),
  logmealQuotaGrid: document.querySelector("#logmealQuotaGrid"),
  logmealQuotaMessage: document.querySelector("#logmealQuotaMessage"),
  logmealLimitMeta: document.querySelector("#logmealLimitMeta"),
  logmealLimitList: document.querySelector("#logmealLimitList"),
  refreshLogmealQuotaButton: document.querySelector("#refreshLogmealQuotaButton"),
  qwenUsageUpdatedAt: document.querySelector("#qwenUsageUpdatedAt"),
  qwenUsageMeta: document.querySelector("#qwenUsageMeta"),
  qwenUsageProgress: document.querySelector("#qwenUsageProgress"),
  qwenUsageGrid: document.querySelector("#qwenUsageGrid"),
  qwenUsageMessage: document.querySelector("#qwenUsageMessage"),
  qwenUsageRecentList: document.querySelector("#qwenUsageRecentList"),
  refreshQwenUsageButton: document.querySelector("#refreshQwenUsageButton"),
  deepseekBalanceUpdatedAt: document.querySelector("#deepseekBalanceUpdatedAt"),
  deepseekBalanceMeta: document.querySelector("#deepseekBalanceMeta"),
  deepseekBalanceProgress: document.querySelector("#deepseekBalanceProgress"),
  deepseekBalanceGrid: document.querySelector("#deepseekBalanceGrid"),
  deepseekBalanceMessage: document.querySelector("#deepseekBalanceMessage"),
  refreshDeepseekBalanceButton: document.querySelector("#refreshDeepseekBalanceButton"),
  sectionTabs: [...document.querySelectorAll("[data-admin-section]")],
  sectionPanels: [...document.querySelectorAll("[data-admin-section-panel]")],
  logoutButton: document.querySelector("#adminLogoutButton"),
  refreshButton: document.querySelector("#refreshButton"),
  accountSearch: document.querySelector("#accountSearch"),
  accountList: document.querySelector("#accountList"),
  accountMeta: document.querySelector("#accountMeta"),
  accountCount: document.querySelector("#accountCount"),
  activeAccountCount: document.querySelector("#activeAccountCount"),
  totalRecordCount: document.querySelector("#totalRecordCount"),
  totalPhotoCount: document.querySelector("#totalPhotoCount"),
  fullModeCount: document.querySelector("#fullModeCount"),
  basicModeCount: document.querySelector("#basicModeCount"),
  pendingConsentCount: document.querySelector("#pendingConsentCount"),
  frozenAccountCount: document.querySelector("#frozenAccountCount"),
  bannedAccountCount: document.querySelector("#bannedAccountCount"),
  moderationPendingCount: document.querySelector("#moderationPendingCount"),
  moderationReviewingCount: document.querySelector("#moderationReviewingCount"),
  moderationReportCount: document.querySelector("#moderationReportCount"),
  moderationFeedbackCount: document.querySelector("#moderationFeedbackCount"),
  moderationQueueMeta: document.querySelector("#moderationQueueMeta"),
  moderationQueueList: document.querySelector("#moderationQueueList"),
  emptyDetail: document.querySelector("#emptyDetail"),
  accountDetail: document.querySelector("#accountDetail"),
  detailCode: document.querySelector("#detailCode"),
  detailSource: document.querySelector("#detailSource"),
  detailActivity: document.querySelector("#detailActivity"),
  detailQqAvatar: document.querySelector("#detailQqAvatar"),
  detailUniqueId: document.querySelector("#detailUniqueId"),
  detailQqBindId: document.querySelector("#detailQqBindId"),
  detailQqUnionId: document.querySelector("#detailQqUnionId"),
  detailLatestWeight: document.querySelector("#detailLatestWeight"),
  detailWeightChange: document.querySelector("#detailWeightChange"),
  detailRecordCount: document.querySelector("#detailRecordCount"),
  detailPhotoCount: document.querySelector("#detailPhotoCount"),
  moderationStatusBadge: document.querySelector("#moderationStatusBadge"),
  moderationStatusText: document.querySelector("#moderationStatusText"),
  moderationStatusDescription: document.querySelector("#moderationStatusDescription"),
  moderationReason: document.querySelector("#moderationReason"),
  moderationDuration: document.querySelector("#moderationDuration"),
  moderationNote: document.querySelector("#moderationNote"),
  moderationActionMessage: document.querySelector("#moderationActionMessage"),
  moderationHistoryList: document.querySelector("#moderationHistoryList"),
  moderationRelatedList: document.querySelector("#moderationRelatedList"),
  detailPrivacyStatus: document.querySelector("#detailPrivacyStatus"),
  detailPrivacyMode: document.querySelector("#detailPrivacyMode"),
  detailConsentTime: document.querySelector("#detailConsentTime"),
  detailAgreementVersion: document.querySelector("#detailAgreementVersion"),
  detailSensitiveConsent: document.querySelector("#detailSensitiveConsent"),
  consentEventList: document.querySelector("#consentEventList"),
  adminPasskeyMeta: document.querySelector("#adminPasskeyMeta"),
  adminPasskeyList: document.querySelector("#adminPasskeyList"),
  deleteAccountButton: document.querySelector("#deleteAccountButton"),
  recordMeta: document.querySelector("#recordMeta"),
  recordList: document.querySelector("#adminRecordList"),
  photoDialog: document.querySelector("#photoDialog"),
  dialogPhoto: document.querySelector("#dialogPhoto"),
  dialogCaption: document.querySelector("#dialogCaption"),
  closePhotoDialog: document.querySelector("#closePhotoDialog"),
  deleteDialog: document.querySelector("#deleteAccountDialog"),
  deleteForm: document.querySelector("#deleteAccountForm"),
  deleteCode: document.querySelector("#deleteAccountCode"),
  deleteCodeCopyButton: document.querySelector("#deleteAccountCodeCopyButton"),
  deleteInput: document.querySelector("#deleteConfirmInput"),
  deleteMessage: document.querySelector("#deleteAccountMessage"),
  cancelDeleteButton: document.querySelector("#cancelDeleteAccount")
};

const dateFormat = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});

const timeFormat = new Intl.DateTimeFormat("zh-CN", {
  hour: "2-digit",
  minute: "2-digit"
});

const ADMIN_PULL_REFRESH_THRESHOLD = 72;
const ADMIN_PULL_REFRESH_MAX = 112;
let adminPullStartY = null;
let adminPullStartX = null;
let adminPullDistance = 0;

function setMessage(text, type = "") {
  els.loginMessage.textContent = text;
  els.loginMessage.className = `form-message ${type}`.trim();
}

function base64urlToBuffer(value) {
  return JF.base64urlToBuffer(value);
}

function bufferToBase64url(buffer) {
  return JF.bufferToBase64url(buffer);
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
  return JF.webauthnSupported();
}

async function api(path, options = {}) {
  const method = String(options.method || "GET").toUpperCase();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  const response = await fetch(`${basePath}/api${path}`, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(state.csrfToken && method !== "GET" ? { "X-CSRF-Token": state.csrfToken } : {}),
      ...(options.headers || {})
    },
    signal: options.signal || controller.signal,
    ...options
  }).catch((error) => {
    if (error.name === "AbortError") {
      throw new Error("网络响应超时，请稍后再试。");
    }
    throw error;
  }).finally(() => {
    window.clearTimeout(timeout);
  });
  const data = await response.json().catch(() => ({}));
  if (data.csrfToken) {
    state.csrfToken = data.csrfToken;
  }
  if (!response.ok) {
    const error = new Error(data.message || "请求失败。");
    error.status = response.status;
    throw error;
  }
  return data;
}

function formatWeight(weight) {
  return Number.isFinite(weight) ? `${weight.toFixed(2)} kg` : "-";
}

function formatFoodValue(value, unit = "", digits = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  const rounded = Math.abs(number - Math.round(number)) < 0.05
    ? String(Math.round(number))
    : number.toFixed(digits);
  return `${rounded}${unit}`;
}

function formatChange(change) {
  if (!Number.isFinite(change)) return "-";
  return `${change > 0 ? "+" : ""}${change.toFixed(2)} kg`;
}

function formatDate(value) {
  return value ? dateFormat.format(new Date(value)) : "暂无记录";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function trashIconMarkup() {
  return `
    <span class="admin-trash-icon" aria-hidden="true">
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

function accountDisplayCode(account) {
  return account.displayCode || account.code;
}

function accountSearchText(account) {
  return [
    account.code,
    account.displayCode,
    account.uniqueId,
    account.qqNickname,
    account.qqBindId,
    account.qqUnionIdDigest
  ].filter(Boolean).join(" ").toLowerCase();
}

function currentSelectedAccount() {
  return state.accounts.find((account) => account.code === state.selectedCode) || null;
}

function accountInitial(account) {
  const label = account.qqNickname || accountDisplayCode(account) || "Q";
  const [first = "Q"] = Array.from(label.trim());
  return first.toUpperCase();
}

function renderQqAvatar(element, account) {
  if (!element) return;
  const avatarUrl = account.qqAvatarUrl || "";
  element.textContent = avatarUrl ? "" : accountInitial(account);
  element.style.backgroundImage = avatarUrl ? `url("${avatarUrl.replace(/"/g, "%22")}")` : "";
  element.classList.toggle("has-image", Boolean(avatarUrl));
  element.classList.toggle("is-hidden", account.source !== "qq");
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

    button?.classList.add("is-copied");
    window.setTimeout(() => button?.classList.remove("is-copied"), 1200);
  } catch {
    button?.classList.add("is-copy-failed");
    window.setTimeout(() => button?.classList.remove("is-copy-failed"), 1200);
  }
}

function showLogin() {
  resetAdminPullRefresh();
  els.loginView.classList.remove("hidden");
  els.shell.classList.add("hidden");
  state.accounts = [];
  state.summary = null;
  state.selectedCode = null;
  state.csrfToken = "";
  state.adminSession = null;
  state.authEvents = [];
  state.loginEvents = [];
  state.loginSummary = null;
  state.moderationQueue = null;
  state.serverStatus = null;
  state.runtimeEvents = null;
  state.performanceSummary = null;
  state.logmealQuota = null;
  state.deepseekBalance = null;
  state.qwenUsage = null;
  setAdminSection("overview");
}

function showShell() {
  els.loginView.classList.add("hidden");
  els.shell.classList.remove("hidden");
  setAdminSection(state.activeSection || "overview");
}

function renderPasskeyStatus(status = {}) {
  if (!webauthnSupported()) {
    els.passkeyStatusText.textContent = "当前浏览器不支持 Passkey。";
    els.passkeyLoginButton.disabled = true;
    return;
  }

  els.passkeyLoginButton.disabled = !status.passkeyLoginEnabled;
  els.loginFields.classList.toggle("hidden", !status.passwordLoginEnabled);
  els.passwordDivider.classList.toggle("hidden", !status.passwordLoginEnabled);
  els.username.required = Boolean(status.passwordLoginEnabled);
  els.password.required = Boolean(status.passwordLoginEnabled);

  if (status.passkeyLoginEnabled) {
    els.passkeyStatusText.textContent = "";
  } else if (status.pendingCount) {
    els.passkeyStatusText.textContent = `有 ${status.pendingCount} 个待确认 Passkey。`;
  } else {
    els.passkeyStatusText.textContent = "还没有可用的管理员 Passkey。";
  }
}

async function loadPasskeyStatus() {
  try {
    const status = await api("/passkeys/status");
    renderPasskeyStatus(status);
  } catch (error) {
    els.passkeyStatusText.textContent = error.message;
  }
}

async function loginWithPasskey() {
  els.passkeyLoginButton.blur();
  if (!webauthnSupported()) {
    setMessage("当前浏览器不支持 Passkey。", "error");
    return;
  }
  els.passkeyLoginButton.disabled = true;
  els.passkeyLoginButton.setAttribute("aria-busy", "true");
  setMessage("正在验证 Passkey...");
  try {
    const options = await api("/passkeys/login/options", { method: "POST", body: "{}" });
    const credential = await navigator.credentials.get({
      publicKey: publicKeyRequestOptionsFromJson(options.publicKey)
    });
    const data = await api("/passkeys/login/verify", {
      method: "POST",
      body: JSON.stringify({ credential: credentialToJson(credential) })
    });
    state.adminSession = data.session;
    renderSecurity();
    setMessage("");
    showShell();
    await loadSecurity();
    await loadAccounts({ preserveSelection: false });
    await loadModerationQueue();
    await loadServerStatus();
    await loadRuntimeEvents();
    await loadPerformanceSummary();
    await loadApiQuota();
  } catch (error) {
    setMessage(error.name === "NotAllowedError" ? "Passkey 操作已取消。" : error.message, "error");
  } finally {
    els.passkeyLoginButton.disabled = false;
    els.passkeyLoginButton.removeAttribute("aria-busy");
    els.passkeyLoginButton.blur();
    await loadPasskeyStatus();
  }
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  return `${dateFormat.format(date)} ${timeFormat.format(date)}`;
}

function formatBytes(bytes) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value < 0) return "-";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = value;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  const precision = unitIndex <= 1 ? 0 : 1;
  return `${size.toFixed(precision)} ${units[unitIndex]}`;
}

function formatMs(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return "-";
  if (number >= 60000) return `${(number / 60000).toFixed(1)} 分钟`;
  if (number >= 1000) return `${(number / 1000).toFixed(1)} 秒`;
  return `${Math.round(number)} ms`;
}

function formatDuration(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value < 0) return "-";
  const days = Math.floor(value / 86400);
  const hours = Math.floor((value % 86400) / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  if (days > 0) return `${days} 天 ${hours} 小时`;
  if (hours > 0) return `${hours} 小时 ${minutes} 分`;
  return `${Math.max(1, minutes)} 分钟`;
}

function formatPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  return `${(number * 100).toFixed(1)}%`;
}

function formatNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  return new Intl.NumberFormat("zh-CN").format(number);
}

function formatMoney(value, currency = "CNY", fallback = "") {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback || "-";
  const code = String(currency || "CNY").toUpperCase();
  const prefix = code === "USD" ? "$" : code === "CNY" ? "¥" : `${code} `;
  return `${prefix}${number.toFixed(2)}`;
}

function metricMarkup(label, value, meta = "") {
  return `
    <div class="server-metric">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      ${meta ? `<small>${escapeHtml(meta)}</small>` : ""}
    </div>
  `;
}

function dashboardRowMarkup(label, value, meta = "", tone = "neutral") {
  return `
    <div class="dashboard-row" data-tone="${escapeHtml(tone)}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      ${meta ? `<small>${escapeHtml(meta)}</small>` : ""}
    </div>
  `;
}

function setOpsStatus(kind, label, value, tone = "neutral") {
  const badge = els[`ops${kind}Badge`];
  const text = els[`ops${kind}Text`];
  const item = badge?.closest(".ops-status-item");
  if (badge) badge.textContent = label;
  if (text) text.textContent = value;
  if (item) item.dataset.tone = tone;
}

function dashboardToneFromCounts({ errors = 0, warnings = 0, pending = 0 } = {}) {
  if (errors > 0) return "danger";
  if (warnings > 0 || pending > 0) return "warning";
  return "good";
}

function renderOperationsDashboard() {
  if (!els.dashboardHealthList) return;

  const summary = state.summary || {};
  const server = state.serverStatus || {};
  const capacity = server.capacity || {};
  const registration = capacity.registration || {};
  const disk = capacity.disk || {};
  const runtimeSummary = state.runtimeEvents?.summary || {};
  const performanceSummary = state.performanceSummary?.summary || {};
  const moderation = state.moderationQueue || {};
  const loginSummary = state.loginSummary || {};
  const qwen = state.qwenUsage || {};
  const qwenToday = qwen.today || {};
  const deepseek = state.deepseekBalance || {};
  const qwenSuccessRate = Number(qwen.averages?.successRate);
  const diskUsedRatio = Number.isFinite(disk.usedRatio)
    ? disk.usedRatio
    : (disk.total ? disk.used / disk.total : 0);
  const thresholdRatio = registration.threshold
    ? Math.max(0, Math.min(1, (registration.currentUsers || 0) / registration.threshold))
    : 0;
  const warningCount = runtimeSummary.last24hWarning || 0;
  const errorCount = runtimeSummary.last24hError || 0;
  const fallbackCount = runtimeSummary.fallback || 0;
  const experienceErrorCount = (performanceSummary.imageErrorCount || 0)
    + (performanceSummary.apiErrorCount || 0)
    + (performanceSummary.modelErrorCount || 0);
  const pendingModeration = (moderation.pending || 0) + (moderation.reviewing || 0);
  const accountRisk = (summary.frozenCount || 0) + (summary.bannedCount || 0);
  const failedLogins = loginSummary.failure || 0;
  const hasServerStatus = Boolean(state.serverStatus);
  const hasQwenUsage = Boolean(state.qwenUsage);
  const healthTone = dashboardToneFromCounts({
    errors: errorCount + experienceErrorCount,
    warnings: warningCount + fallbackCount + accountRisk,
    pending: pendingModeration
  });
  const healthTitle = healthTone === "danger"
    ? "需要处理"
    : healthTone === "warning"
      ? "有待关注"
      : "运行正常";

  if (els.overviewUpdatedAt) {
    const timestamps = [
      server.at,
      state.runtimeEvents?.at,
      state.performanceSummary?.at,
      state.qwenUsage?.at,
      state.deepseekBalance?.at
    ].map((value) => new Date(value).getTime()).filter((value) => Number.isFinite(value));
    els.overviewUpdatedAt.textContent = timestamps.length ? `更新于 ${formatDateTime(Math.max(...timestamps))}` : "等待刷新";
  }

  setOpsStatus("Health", "健康", healthTitle, healthTone);
  setOpsStatus(
    "Runtime",
    "运行",
    `${errorCount} 错误 / ${experienceErrorCount} 体验`,
    dashboardToneFromCounts({ errors: errorCount + experienceErrorCount, warnings: warningCount + fallbackCount })
  );
  setOpsStatus(
    "Storage",
    "容量",
    disk.total ? `磁盘 ${formatPercent(diskUsedRatio)}` : "等待服务器",
    !disk.total ? "neutral" : diskUsedRatio >= 0.85 ? "danger" : diskUsedRatio >= 0.72 ? "warning" : "good"
  );
  setOpsStatus(
    "Quota",
    "AI",
    hasQwenUsage && qwen.configured ? `千问 ${formatNumber(qwenToday.requests || 0)} 次` : "等待用量",
    !hasQwenUsage ? "neutral" : qwen.configured === false ? "warning" : "good"
  );

  els.dashboardHealthTitle.textContent = healthTitle;
  els.dashboardHealthMeta.textContent = server.process?.nodeVersion
    ? `${server.process.nodeVersion} · 运行 ${formatDuration(server.process.uptimeSeconds)}`
    : "管理台会按日志、容量、治理队列综合判断。";
  els.dashboardHealthList.innerHTML = [
    dashboardRowMarkup("新用户注册", hasServerStatus ? (registration.open ? "开放" : "暂停") : "等待服务器", registration.thresholdReached ? "容量阈值触发" : "可在服务器状态中调整", !hasServerStatus ? "neutral" : registration.open ? "good" : "warning"),
    dashboardRowMarkup("账号规模", `${formatNumber(summary.accountCount || 0)} 个`, `有记录 ${formatNumber(summary.activeAccountCount || 0)} 个`, "neutral"),
    dashboardRowMarkup("记录资产", `${formatNumber(summary.recordCount || 0)} 条`, `${formatNumber(summary.photoCount || 0)} 张照片`, "neutral"),
    dashboardRowMarkup("体验采样", `${formatNumber(performanceSummary.last24h || 0)} 条`, `启动 P95 ${formatMs(performanceSummary.startupP95Ms)}`, experienceErrorCount ? "warning" : "neutral")
  ].join("");

  els.dashboardRiskTitle.textContent = pendingModeration || errorCount || experienceErrorCount
    ? `${pendingModeration + errorCount + experienceErrorCount} 项待看`
    : "暂无阻塞";
  els.dashboardRiskMeta.textContent = `失败登录 ${formatNumber(failedLogins)} · 体验错误 ${formatNumber(experienceErrorCount)} · 冻结/封禁 ${formatNumber(accountRisk)}`;
  els.dashboardRiskList.innerHTML = [
    dashboardRowMarkup("运行错误", `${formatNumber(errorCount)} 条`, "最近 24 小时", errorCount ? "danger" : "good"),
    dashboardRowMarkup("告警/兜底", `${formatNumber(warningCount + fallbackCount)} 条`, "最近 24 小时", warningCount + fallbackCount ? "warning" : "good"),
    dashboardRowMarkup("体验错误", `${formatNumber(experienceErrorCount)} 条`, `图片 ${formatNumber(performanceSummary.imageErrorCount || 0)} / API ${formatNumber(performanceSummary.apiErrorCount || 0)} / 模型 ${formatNumber(performanceSummary.modelErrorCount || 0)}`, experienceErrorCount ? "danger" : "good"),
    dashboardRowMarkup("反馈举报", `${formatNumber(pendingModeration)} 条`, "待处理与处理中", pendingModeration ? "warning" : "good")
  ].join("");

  els.dashboardCapacityTitle.textContent = registration.threshold
    ? `${formatNumber(registration.currentUsers || 0)} / ${formatNumber(registration.threshold)}`
    : "未设置阈值";
  els.dashboardCapacityMeta.textContent = registration.remainingSlots != null
    ? `剩余 ${formatNumber(registration.remainingSlots)} 个注册名额`
    : "根据服务器容量动态估算。";
  if (els.dashboardCapacityBar) {
    els.dashboardCapacityBar.style.width = `${Math.round(thresholdRatio * 100)}%`;
  }
  els.dashboardCapacityList.innerHTML = [
    dashboardRowMarkup("磁盘已用", disk.total ? formatBytes(disk.used) : "-", disk.total ? `总量 ${formatBytes(disk.total)}` : "", diskUsedRatio >= 0.85 ? "danger" : diskUsedRatio >= 0.72 ? "warning" : "neutral"),
    dashboardRowMarkup("照片占用", formatBytes(capacity.data?.photoBytes), `${formatNumber(capacity.data?.photoCount || 0)} 张`, "neutral"),
    dashboardRowMarkup("每日限制", `${capacity.limits?.dailyBodyRecordsPerUser || 20} + ${capacity.limits?.dailyFoodRecordsPerUser || 20}`, "拍照/食物记录", "neutral")
  ].join("");

  els.dashboardAiTitle.textContent = qwen.configured ? "千问运行中" : "等待配置";
  els.dashboardAiMeta.textContent = Number.isFinite(qwenSuccessRate)
    ? `千问成功率 ${formatPercent(qwenSuccessRate)}`
    : "食物识别与一句话心情依赖千问视觉。";
  els.dashboardAiList.innerHTML = [
    dashboardRowMarkup("千问今日", `${formatNumber(qwenToday.requests || 0)} 次`, `Token ${formatNumber(qwenToday.totalTokens || 0)}`, qwen.configured === false ? "warning" : "neutral"),
    dashboardRowMarkup("DeepSeek", deepseek.configured ? "已配置" : "未配置", "用于 AI 总结", deepseek.configured === false ? "warning" : "good"),
    dashboardRowMarkup("识别策略", "千问视觉", "食物、照片心情、营养补全", "good")
  ].join("");
}

function authEventLabel(action) {
  return {
    login_success: "登录成功",
    login_failed: "登录失败",
    login_locked: "失败锁定",
    logout: "退出登录",
    passkey_pending: "Passkey 待确认",
    passkey_registered: "Passkey 已登记",
    passkey_success: "Passkey 登录",
    passkey_failed: "Passkey 失败",
    password_disabled: "密码已停用",
    account_moderation_updated: "账号治理",
    moderation_item_updated: "工单处理",
    registration_gate_updated: "注册闸门"
  }[action] || action;
}

function loginAuditLabel(action) {
  return {
    qq_login_success: "QQ 登录成功",
    qq_login_failed: "QQ 登录失败",
    qq_login_denied: "QQ 授权取消",
    qq_login_missing_code: "QQ 回调异常",
    qq_login_state_failed: "QQ 状态失效",
    registration_capacity_blocked: "容量拦截",
    qq_profile_sync_success: "QQ 资料同步",
    qq_sync_failed: "QQ 同步失败",
    qq_sync_denied: "QQ 同步取消",
    qq_sync_state_failed: "QQ 同步状态失效",
    qq_sync_mismatch: "QQ 同步不匹配",
    passkey_login_success: "Passkey 登录成功",
    passkey_login_failed: "Passkey 登录失败"
  }[action] || action;
}

function moderationStatusLabel(status) {
  return {
    active: "正常",
    frozen: "冻结",
    banned: "封禁",
    pending: "待处理",
    reviewing: "处理中",
    resolved: "已处理",
    dismissed: "已忽略"
  }[status] || status || "-";
}

function moderationTypeLabel(type) {
  return type === "report" ? "举报" : "反馈";
}

function moderationCategoryLabel(category) {
  return {
    spam: "垃圾信息",
    harassment: "骚扰攻击",
    illegal: "违法违规",
    privacy: "隐私侵权",
    impersonation: "冒用身份",
    security: "安全风险",
    underage: "未成年人保护",
    bug: "功能异常",
    suggestion: "建议优化",
    account: "账户问题",
    content: "内容问题",
    other: "其他"
  }[category] || category || "其他";
}

function setAdminSection(section) {
  const normalized = ["overview", "server", "runtime", "performance", "quota", "accounts", "moderation", "security"].includes(section) ? section : "overview";
  state.activeSection = normalized;
  if (els.shell) {
    els.shell.dataset.activeSection = normalized;
  }
  els.sectionTabs.forEach((button) => {
    const active = button.dataset.adminSection === normalized;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });
  els.sectionPanels.forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.adminSectionPanel !== normalized);
  });
}

function renderSecurity() {
  const session = state.adminSession;
  els.adminIdentity.textContent = session?.username ? `管理员 ${session.username}` : "管理员";
  els.adminSessionMeta.textContent = session
    ? `空闲至 ${formatDateTime(session.idleExpiresAt)}`
    : "未登录";
  els.csrfStatus.textContent = state.csrfToken ? "CSRF 已启用" : "等待令牌";

  if (!state.authEvents.length) {
    els.authEventList.innerHTML = '<div class="empty-list">暂无认证事件</div>';
  } else {
    els.authEventList.innerHTML = state.authEvents.map((event) => `
      <div class="auth-event">
        <span><strong>${escapeHtml(authEventLabel(event.action))}</strong><small>${formatDateTime(event.at)}</small></span>
        <span><small>账号</small><strong>${escapeHtml(event.username || "-")}</strong></span>
        <span><small>IP</small><code>${escapeHtml(event.ipAddress || event.networkDigest || "-")}</code></span>
        <span><small>设备摘要</small><code>${escapeHtml(event.deviceDigest || "-")}</code></span>
      </div>
    `).join("");
  }

  const summary = state.loginSummary || {};
  els.userAuditMeta.textContent = `保留 ${summary.total || state.loginEvents.length || 0} 条 · 成功 ${summary.success || 0} · 失败 ${summary.failure || 0} · IP ${summary.uniqueIpCount || 0}`;
  if (!state.loginEvents.length) {
    els.userAuditList.innerHTML = '<div class="empty-list">暂无用户登录轨迹</div>';
    renderOperationsDashboard();
    return;
  }

  els.userAuditList.innerHTML = state.loginEvents.map((event) => `
    <article class="user-audit-item ${event.status === "success" ? "is-success" : "is-failure"}">
      <div class="user-audit-main">
        <strong>${escapeHtml(loginAuditLabel(event.action))}</strong>
        <span>${formatDateTime(event.at)} · ${escapeHtml(event.method || "-")}</span>
      </div>
      <div class="user-audit-account">
        <small>账户</small>
        <strong>${escapeHtml(event.accountDisplay || event.accountCode || "-")}</strong>
      </div>
      <div>
        <small>IP</small>
        <code>${escapeHtml(event.ipAddress || "-")}</code>
      </div>
      <div>
        <small>代理链</small>
        <code>${escapeHtml(event.forwardedFor || event.realIp || "-")}</code>
      </div>
      <div class="user-audit-device">
        <small>设备</small>
        <span>${escapeHtml(event.userAgent || "-")}</span>
      </div>
      <div>
        <small>来源</small>
        <span>${escapeHtml(event.referer || event.origin || "-")}</span>
      </div>
      <div>
        <small>摘要</small>
        <code>${escapeHtml(event.networkDigest || "-")} / ${escapeHtml(event.userAgentDigest || "-")}</code>
      </div>
      <div>
        <small>细节</small>
        <span>${escapeHtml(event.detail || "-")}</span>
      </div>
    </article>
  `).join("");
  renderOperationsDashboard();
}

function renderServerStatus() {
  if (!els.serverRuntimeGrid) return;
  const status = state.serverStatus;
  if (!status) {
    els.serverStatusUpdatedAt.textContent = "等待刷新";
    els.serverRuntimeGrid.innerHTML = '<div class="empty-list">暂无服务器状态</div>';
    els.serverStorageGrid.innerHTML = "";
    els.serverCapacityGrid.innerHTML = "";
    renderFoodRecognitionConfig(null);
    renderOperationsDashboard();
    return;
  }

  const capacity = status.capacity || {};
  const registration = capacity.registration || {};
  const limits = capacity.limits || {};
  const data = capacity.data || {};
  const disk = capacity.disk || {};
  const reference = capacity.reference || {};
  const memory = status.memory || {};
  const processInfo = status.process || {};
  const cpu = status.cpu || {};
  const systemMemoryRatio = memory.total ? memory.used / memory.total : 0;
  const diskUsedRatio = Number.isFinite(disk.usedRatio) ? disk.usedRatio : (disk.total ? disk.used / disk.total : 0);
  const thresholdRatio = registration.threshold
    ? Math.min(1, Math.max(0, registration.currentUsers / registration.threshold))
    : 0;

  els.serverStatusUpdatedAt.textContent = `更新于 ${formatDateTime(status.at)}`;
  els.serverRuntimeMeta.textContent = `${processInfo.nodeVersion || "Node"} · PID ${processInfo.pid || "-"}`;
  els.serverRuntimeGrid.innerHTML = [
    metricMarkup("运行时长", formatDuration(processInfo.uptimeSeconds)),
    metricMarkup("CPU", `${cpu.count || "-"} 核`, cpu.model || ""),
    metricMarkup("负载", Array.isArray(cpu.loadAverage) ? cpu.loadAverage.map((item) => Number(item).toFixed(2)).join(" / ") : "-"),
    metricMarkup("进程内存", formatBytes(memory.process?.rss), `Heap ${formatBytes(memory.process?.heapUsed)}`)
  ].join("");

  els.serverStorageMeta.textContent = `磁盘使用 ${formatPercent(diskUsedRatio)} · 内存使用 ${formatPercent(systemMemoryRatio)}`;
  els.serverStorageGrid.innerHTML = [
    metricMarkup("磁盘可用", formatBytes(disk.available), `总量 ${formatBytes(disk.total)}`),
    metricMarkup("磁盘已用", formatBytes(disk.used), formatPercent(diskUsedRatio)),
    metricMarkup("照片占用", formatBytes(data.photoBytes), `${data.photoCount || 0} 张`),
    metricMarkup("数据文件", formatBytes(data.jsonBytes), `${data.recordCount || 0} 条记录`),
    metricMarkup("系统内存", formatBytes(memory.used), `可用 ${formatBytes(memory.free)}`)
  ].join("");

  els.serverCapacityMeta.textContent = registration.open ? "新用户注册开放" : "新用户注册已暂停";
  els.serverCapacityProgress.style.width = `${Math.round(thresholdRatio * 100)}%`;
  els.serverCapacityGrid.innerHTML = [
    metricMarkup("当前账户", String(registration.currentUsers || 0)),
    metricMarkup("注册阈值", String(registration.threshold || "-"), `极限估算 ${registration.estimatedMaxUsers || "-"} 人`),
    metricMarkup("剩余名额", String(registration.remainingSlots || 0)),
    metricMarkup("基准月用量", formatBytes(reference.monthlyBytes), reference.source === "reference" ? `${reference.photoCount || 0} 张 / ${reference.days || "-"} 天` : "默认估算"),
    metricMarkup("拍照记录", `${limits.dailyBodyRecordsPerUser || 20} 条/人/天`),
    metricMarkup("食物记录", `${limits.dailyFoodRecordsPerUser || 20} 条/人/天`),
    metricMarkup("单张限制", formatBytes(limits.maxPhotoBytes))
  ].join("");

  if (registration.manuallyPaused) {
    els.serverCapacityMessage.textContent = "管理员已手动暂停新用户注册，已有用户仍可正常登录和使用。";
  } else if (registration.autoPaused || registration.thresholdReached) {
    els.serverCapacityMessage.textContent = "账户数已接近容量阈值，系统自动关闭新用户注册；扩容后可手动开放。";
  } else {
    els.serverCapacityMessage.textContent = "系统会以当前存储容量和基准用户月用量估算承载人数，达到 3/4 阈值后自动暂停新注册。";
  }

  els.pauseRegistrationButton.disabled = !registration.open && registration.manuallyPaused;
  els.openRegistrationButton.disabled = registration.thresholdReached || registration.open;
  renderFoodRecognitionConfig(status.appConfig?.foodRecognition || null);
  renderOperationsDashboard();
}

function foodRecognitionSourceLabel(source, options = []) {
  const matched = options.find((item) => item.id === source);
  return matched?.label || {
    tianapi_nutrient: "天营养",
    logmeal: "LogMeal",
    qwen_vl: "千问视觉",
    tianapi_food: "天接口"
  }[source] || source;
}

function foodRecognitionPriorityConfig() {
  return state.serverStatus?.appConfig?.foodRecognition || { sourceOptions: [], priority: [] };
}

function currentFoodRecognitionPriority() {
  const config = foodRecognitionPriorityConfig();
  return state.foodRecognitionPriorityDraft
    ? [...state.foodRecognitionPriorityDraft]
    : [...(config.priority || [])];
}

function renderFoodRecognitionConfig(config = foodRecognitionPriorityConfig()) {
  if (!els.foodRecognitionPriorityList) return;
  if (!config || !Array.isArray(config.priority)) {
    els.foodRecognitionConfigMeta.textContent = "等待刷新";
    els.foodRecognitionPriorityList.innerHTML = '<div class="empty-list">暂无食物识别配置</div>';
    els.foodRecognitionConfigMessage.textContent = "";
    els.saveFoodRecognitionPriorityButton.disabled = true;
    return;
  }

  const options = config.sourceOptions || [];
  const priority = currentFoodRecognitionPriority();
  els.foodRecognitionConfigMeta.textContent = config.updatedAt
    ? `更新于 ${formatDateTime(config.updatedAt)}`
    : "默认策略";
  els.foodRecognitionPriorityList.innerHTML = priority.map((source, index) => `
    <article class="food-priority-item">
      <span class="food-priority-rank">${index + 1}</span>
      <div>
        <strong>${escapeHtml(foodRecognitionSourceLabel(source, options))}</strong>
        <small>${escapeHtml(source)}</small>
      </div>
      <div class="food-priority-actions">
        <button class="secondary-button" type="button" data-food-priority-move="${escapeHtml(source)}" data-direction="-1" ${index === 0 ? "disabled" : ""}>上移</button>
        <button class="secondary-button" type="button" data-food-priority-move="${escapeHtml(source)}" data-direction="1" ${index === priority.length - 1 ? "disabled" : ""}>下移</button>
      </div>
    </article>
  `).join("");
  const isDirty = Boolean(state.foodRecognitionPriorityDraft);
  els.foodRecognitionConfigMessage.textContent = isDirty ? "优先级已调整，保存后对下一次识别生效。" : "当前食物识别只调用千问视觉。";
  els.saveFoodRecognitionPriorityButton.disabled = !isDirty;
}

function renderApiQuotaUpdatedAt() {
  if (!els.apiQuotaUpdatedAt) return;
  const timestamps = [state.qwenUsage?.at, state.deepseekBalance?.at]
    .map((value) => new Date(value).getTime())
    .filter((value) => Number.isFinite(value));
  if (!timestamps.length) {
    els.apiQuotaUpdatedAt.textContent = "等待刷新";
    return;
  }
  els.apiQuotaUpdatedAt.textContent = `更新于 ${formatDateTime(Math.max(...timestamps))}`;
}

function renderQwenUsage() {
  if (!els.qwenUsageGrid) return;
  renderApiQuotaUpdatedAt();
  const usage = state.qwenUsage;
  if (!usage) {
    els.qwenUsageUpdatedAt.textContent = "等待刷新";
    els.qwenUsageMeta.textContent = "-";
    els.qwenUsageGrid.innerHTML = '<div class="empty-list">暂无千问用量</div>';
    els.qwenUsageRecentList.innerHTML = "";
    els.qwenUsageMessage.textContent = "";
    if (els.qwenUsageProgress) els.qwenUsageProgress.style.width = "0%";
    renderOperationsDashboard();
    return;
  }

  if (!usage.configured) {
    els.qwenUsageUpdatedAt.textContent = "未配置";
    els.qwenUsageMeta.textContent = "API Key 未启用";
    els.qwenUsageGrid.innerHTML = '<div class="empty-list">服务器还没有配置千问 API Key。</div>';
    els.qwenUsageRecentList.innerHTML = "";
    els.qwenUsageMessage.textContent = "请在服务器环境变量中配置 ALIYUN_QWEN_API_KEY。";
    if (els.qwenUsageProgress) els.qwenUsageProgress.style.width = "0%";
    renderOperationsDashboard();
    return;
  }

  const totals = usage.totals || {};
  const today = usage.today || {};
  const last7Days = usage.last7Days || {};
  const successRate = Number(usage.averages?.successRate);
  const progress = Number.isFinite(successRate) ? Math.max(0, Math.min(1, successRate)) : 0;
  els.qwenUsageUpdatedAt.textContent = `更新于 ${formatDateTime(usage.at)}`;
  els.qwenUsageMeta.textContent = usage.model || "千问视觉";
  if (els.qwenUsageProgress) {
    els.qwenUsageProgress.style.width = `${Math.round(progress * 100)}%`;
  }
  els.qwenUsageGrid.innerHTML = [
    metricMarkup("今日调用", `${formatNumber(today.requests)} 次`, `成功 ${formatNumber(today.success)} 次`),
    metricMarkup("今日 Token", formatNumber(today.totalTokens), `图片 ${formatNumber(today.imageTokens)}`),
    metricMarkup("7日调用", `${formatNumber(last7Days.requests)} 次`, `Token ${formatNumber(last7Days.totalTokens)}`),
    metricMarkup("总调用", `${formatNumber(totals.requests)} 次`, `成功 ${formatNumber(totals.success)} 次`),
    metricMarkup("成功率", Number.isFinite(successRate) ? formatPercent(successRate) : "-"),
    metricMarkup("平均耗时", Number.isFinite(usage.averages?.latencyMs) ? `${formatNumber(usage.averages.latencyMs)} ms` : "-")
  ].join("");
  const recent = Array.isArray(usage.recent) ? usage.recent.slice(0, 5) : [];
  els.qwenUsageRecentList.innerHTML = recent.length
    ? recent.map((item) => `
      <article class="quota-limit-item">
        <span>${escapeHtml(formatDateTime(item.at))} · ${item.ok ? "成功" : "失败"} · ${escapeHtml(item.model || usage.model || "千问")}</span>
        <strong>${escapeHtml(item.ok ? `${formatNumber(item.foodCount)} 项食物 · ${formatNumber(item.usage?.totalTokens)} token · ${formatNumber(item.latencyMs)} ms` : item.message || "调用失败")}</strong>
      </article>
    `).join("")
    : '<div class="empty-list compact">暂无调用记录</div>';
  els.qwenUsageMessage.textContent = usage.note || "这里统计本站服务端实际收到的千问响应 usage 字段。";
  renderOperationsDashboard();
}

function renderLogmealQuota() {
  if (!els.logmealQuotaGrid) return;
  renderApiQuotaUpdatedAt();
  const quota = state.logmealQuota;
  if (!quota) {
    els.logmealQuotaUpdatedAt.textContent = "等待刷新";
    els.logmealQuotaMeta.textContent = "-";
    els.logmealQuotaGrid.innerHTML = '<div class="empty-list">暂无额度数据</div>';
    els.logmealLimitList.innerHTML = "";
    els.logmealQuotaMessage.textContent = "";
    if (els.logmealQuotaProgress) els.logmealQuotaProgress.style.width = "0%";
    return;
  }

  if (!quota.configured) {
    els.logmealQuotaUpdatedAt.textContent = "未配置";
    els.logmealQuotaMeta.textContent = "Company Token 未启用";
    els.logmealQuotaGrid.innerHTML = '<div class="empty-list">服务器还没有配置 LogMeal company token。</div>';
    els.logmealLimitList.innerHTML = "";
    els.logmealQuotaMessage.textContent = quota.message || "请在服务器环境变量中配置 LOGMEAL_COMPANY_TOKEN。";
    if (els.logmealQuotaProgress) els.logmealQuotaProgress.style.width = "0%";
    return;
  }

  const credits = quota.credits || {};
  const rateLimit = quota.rateLimit || {};
  const limitations = quota.limitations || {};
  const total = Number(credits.total);
  const remaining = Number(credits.remaining);
  const used = Number(credits.used);
  const remainingRatio = Number.isFinite(total) && total > 0 && Number.isFinite(remaining)
    ? Math.max(0, Math.min(1, remaining / total))
    : null;

  els.logmealQuotaUpdatedAt.textContent = `更新于 ${formatDateTime(quota.at)}${quota.cached ? " · 缓存" : ""}`;
  els.logmealQuotaMeta.textContent = quota.tokenType === "company" ? "Company Token" : "User Token";
  if (els.logmealQuotaProgress) {
    els.logmealQuotaProgress.style.width = `${Math.round((remainingRatio ?? 0) * 100)}%`;
  }
  els.logmealQuotaGrid.innerHTML = [
    metricMarkup("剩余额度", formatNumber(remaining), Number.isFinite(total) ? `总量 ${formatNumber(total)}` : ""),
    metricMarkup("已用额度", formatNumber(used), Number.isFinite(credits.usedRatio) ? `已用 ${formatPercent(credits.usedRatio)}` : ""),
    metricMarkup("日请求剩余", formatNumber(rateLimit.remaining), Number.isFinite(rateLimit.limit) ? `上限 ${formatNumber(rateLimit.limit)}` : "Company Token 通常无此项"),
    metricMarkup("重置等待", Number.isFinite(rateLimit.resetSeconds) ? formatDuration(rateLimit.resetSeconds) : "-"),
    metricMarkup("令牌类型", quota.tokenType === "company" ? "公司级" : "用户级", quota.userId ? `User-ID ${quota.userId}` : ""),
    metricMarkup("查询状态", String(quota.thirdPartyStatus || "-"), quota.cached ? "使用缓存" : "实时返回")
  ].join("");

  const limitRows = [
    ["日限制", limitations.daily],
    ["月限制", limitations.monthly],
    ["秒级限制", limitations.perSecond]
  ].filter(([, value]) => value);
  els.logmealLimitList.innerHTML = limitRows.length
    ? limitRows.map(([label, value]) => `
      <article class="quota-limit-item">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </article>
    `).join("")
    : '<div class="empty-list">暂无限制说明</div>';
  const cacheText = quota.cached
    ? `当前显示缓存数据，缓存至 ${formatDateTime(quota.cacheExpiresAt)}。`
    : `查询结果会缓存 ${quota.cacheTtlSeconds || 300} 秒，避免频繁调用 LogMeal。`;
  els.logmealQuotaMessage.textContent = Number.isFinite(remaining)
    ? `${cacheText} 当前剩余 ${formatNumber(remaining)} 次额度。`
    : cacheText;
}

function preferredDeepseekBalance(balances) {
  if (!Array.isArray(balances) || !balances.length) return null;
  return balances.find((item) => item.currency === "CNY")
    || balances.find((item) => item.currency === "USD")
    || balances[0];
}

function renderDeepseekBalance() {
  if (!els.deepseekBalanceGrid) return;
  renderApiQuotaUpdatedAt();
  const balance = state.deepseekBalance;
  if (!balance) {
    els.deepseekBalanceUpdatedAt.textContent = "等待刷新";
    els.deepseekBalanceMeta.textContent = "-";
    els.deepseekBalanceGrid.innerHTML = '<div class="empty-list">暂无 DeepSeek 数据</div>';
    els.deepseekBalanceMessage.textContent = "";
    if (els.deepseekBalanceProgress) els.deepseekBalanceProgress.style.width = "0%";
    renderOperationsDashboard();
    return;
  }

  if (!balance.configured) {
    els.deepseekBalanceUpdatedAt.textContent = "未配置";
    els.deepseekBalanceMeta.textContent = "API Key 未启用";
    els.deepseekBalanceGrid.innerHTML = '<div class="empty-list">服务器还没有配置 DeepSeek API Key。</div>';
    els.deepseekBalanceMessage.textContent = balance.message || "请在服务器环境变量中配置 DEEPSEEK_API_KEY。";
    if (els.deepseekBalanceProgress) els.deepseekBalanceProgress.style.width = "0%";
    renderOperationsDashboard();
    return;
  }

  const primary = preferredDeepseekBalance(balance.balances);
  const total = Number(primary?.totalBalance);
  const granted = Number(primary?.grantedBalance);
  const toppedUp = Number(primary?.toppedUpBalance);
  const totalText = formatMoney(total, primary?.currency, primary?.raw?.totalBalance);
  const grantedText = formatMoney(granted, primary?.currency, primary?.raw?.grantedBalance);
  const toppedUpText = formatMoney(toppedUp, primary?.currency, primary?.raw?.toppedUpBalance);
  const toppedRatio = Number.isFinite(total) && total > 0 && Number.isFinite(toppedUp)
    ? Math.max(0, Math.min(1, toppedUp / total))
    : Number.isFinite(total) && total > 0
      ? 1
      : 0;

  els.deepseekBalanceUpdatedAt.textContent = `更新于 ${formatDateTime(balance.at)}${balance.cached ? " · 缓存" : ""}`;
  els.deepseekBalanceMeta.textContent = balance.isAvailable ? "可调用" : "余额不足";
  if (els.deepseekBalanceProgress) {
    els.deepseekBalanceProgress.style.width = `${Math.round(toppedRatio * 100)}%`;
  }
  els.deepseekBalanceGrid.innerHTML = [
    metricMarkup("可用余额", totalText, primary?.currency || ""),
    metricMarkup("充值余额", toppedUpText),
    metricMarkup("赠送余额", grantedText),
    metricMarkup("调用状态", balance.isAvailable ? "可用" : "不可用"),
    metricMarkup("当前模型", balance.model || "-"),
    metricMarkup("查询状态", String(balance.thirdPartyStatus || "-"), balance.cached ? "使用缓存" : "实时返回")
  ].join("");

  const otherBalances = (balance.balances || []).filter((item) => item !== primary);
  const currencyHint = otherBalances.length
    ? ` 另有 ${otherBalances.map((item) => `${item.currency} ${formatMoney(item.totalBalance, item.currency, item.raw?.totalBalance)}`).join(" / ")}。`
    : "";
  const cacheText = balance.cached
    ? `当前显示缓存数据，缓存至 ${formatDateTime(balance.cacheExpiresAt)}。`
    : `查询结果会缓存 ${balance.cacheTtlSeconds || 300} 秒，避免频繁调用 DeepSeek。`;
  els.deepseekBalanceMessage.textContent = `${cacheText} 当前 DeepSeek 余额 ${totalText}。${currencyHint}`;
  renderOperationsDashboard();
}

async function loadLogmealQuota({ force = false } = {}) {
  try {
    const data = await api(`/logmeal-quota${force ? "?refresh=1" : ""}`);
    state.logmealQuota = data;
    renderLogmealQuota();
  } catch (error) {
    if (error.status === 401) {
      showLogin();
      return;
    }
    state.logmealQuota = null;
    if (els.logmealQuotaGrid) {
      els.logmealQuotaUpdatedAt.textContent = "查询失败";
      els.logmealQuotaMeta.textContent = "-";
      els.logmealQuotaGrid.innerHTML = `<div class="empty-list">${escapeHtml(error.message)}</div>`;
      els.logmealLimitList.innerHTML = "";
      els.logmealQuotaMessage.textContent = "无法读取 LogMeal 额度，请稍后重试。";
      if (els.logmealQuotaProgress) els.logmealQuotaProgress.style.width = "0%";
    }
  }
}

async function loadDeepseekBalance({ force = false } = {}) {
  try {
    const data = await api(`/deepseek-balance${force ? "?refresh=1" : ""}`);
    state.deepseekBalance = data;
    renderDeepseekBalance();
  } catch (error) {
    if (error.status === 401) {
      showLogin();
      return;
    }
    state.deepseekBalance = null;
    if (els.deepseekBalanceGrid) {
      els.deepseekBalanceUpdatedAt.textContent = "查询失败";
      els.deepseekBalanceMeta.textContent = "-";
      els.deepseekBalanceGrid.innerHTML = `<div class="empty-list">${escapeHtml(error.message)}</div>`;
      els.deepseekBalanceMessage.textContent = "无法读取 DeepSeek 用量，请稍后重试。";
      if (els.deepseekBalanceProgress) els.deepseekBalanceProgress.style.width = "0%";
    }
    renderApiQuotaUpdatedAt();
    renderOperationsDashboard();
  }
}

async function loadQwenUsage() {
  try {
    const data = await api("/qwen-usage");
    state.qwenUsage = data;
    renderQwenUsage();
  } catch (error) {
    if (error.status === 401) {
      showLogin();
      return;
    }
    state.qwenUsage = null;
    if (els.qwenUsageGrid) {
      els.qwenUsageUpdatedAt.textContent = "查询失败";
      els.qwenUsageMeta.textContent = "-";
      els.qwenUsageGrid.innerHTML = `<div class="empty-list">${escapeHtml(error.message)}</div>`;
      els.qwenUsageRecentList.innerHTML = "";
      els.qwenUsageMessage.textContent = "无法读取千问用量，请稍后重试。";
      if (els.qwenUsageProgress) els.qwenUsageProgress.style.width = "0%";
    }
    renderApiQuotaUpdatedAt();
    renderOperationsDashboard();
  }
}

async function loadApiQuota({ force = false } = {}) {
  await Promise.all([
    loadQwenUsage({ force }),
    loadDeepseekBalance({ force })
  ]);
}

function moveFoodRecognitionPriority(source, direction) {
  const priority = currentFoodRecognitionPriority();
  const index = priority.indexOf(source);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= priority.length) return;
  [priority[index], priority[nextIndex]] = [priority[nextIndex], priority[index]];
  state.foodRecognitionPriorityDraft = priority;
  renderFoodRecognitionConfig();
}

async function saveFoodRecognitionPriority(button) {
  const priority = currentFoodRecognitionPriority();
  if (!priority.length) return;
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "正在保存";
  if (els.foodRecognitionConfigMessage) {
    els.foodRecognitionConfigMessage.textContent = "正在保存食物识别优先级...";
  }
  try {
    const data = await api("/app-config/food-recognition", {
      method: "PATCH",
      body: JSON.stringify({ priority })
    });
    state.serverStatus = data;
    state.foodRecognitionPriorityDraft = null;
    renderServerStatus();
    await loadSecurity();
    if (els.foodRecognitionConfigMessage) {
      els.foodRecognitionConfigMessage.textContent = "已保存，下一次识别会按新顺序展示。";
    }
  } catch (error) {
    if (els.foodRecognitionConfigMessage) {
      els.foodRecognitionConfigMessage.textContent = error.message;
    }
    renderFoodRecognitionConfig();
  } finally {
    button.textContent = originalText;
    button.blur();
  }
}

async function loadServerStatus() {
  try {
    const data = await api("/server-status");
    state.serverStatus = data;
    state.foodRecognitionPriorityDraft = null;
    renderServerStatus();
  } catch (error) {
    if (error.status === 401) {
      showLogin();
      return;
    }
    state.serverStatus = null;
    if (els.serverRuntimeGrid) {
      els.serverRuntimeGrid.innerHTML = `<div class="empty-list">${escapeHtml(error.message)}</div>`;
      els.serverStorageGrid.innerHTML = "";
      els.serverCapacityGrid.innerHTML = "";
      renderFoodRecognitionConfig(null);
    }
    renderOperationsDashboard();
  }
}

function runtimeLevelLabel(level) {
  return {
    info: "信息",
    warning: "警告",
    error: "错误"
  }[level] || "事件";
}

function runtimeAreaLabel(area) {
  return {
    ai: "AI",
    client: "客户端",
    "face-model": "人脸模型",
    passkey: "Passkey",
    safety: "内容安全",
    security: "安全防护",
    storage: "对象存储",
    system: "系统"
  }[area] || area || "系统";
}

function runtimeDetailsText(details) {
  if (!details) return "";
  try {
    return JSON.stringify(details, null, 2).slice(0, 900);
  } catch {
    return String(details).slice(0, 900);
  }
}

function renderRuntimeEvents() {
  const data = state.runtimeEvents;
  if (!els.runtimeEventList) return;
  if (!data) {
    els.runtimeUpdatedAt.textContent = "等待刷新";
    els.runtimeOverviewMeta.textContent = "-";
    els.runtimeWarningCount.textContent = "0";
    els.runtimeErrorCount.textContent = "0";
    els.runtimeFallbackCount.textContent = "0";
    els.runtimeTotalCount.textContent = "0";
    els.runtimeHourlyChart.innerHTML = '<div class="empty-list">暂无运行事件</div>';
    els.runtimeTopEvents.innerHTML = "";
    els.runtimeAreaMeta.textContent = "暂无数据";
    els.runtimeAreaList.innerHTML = '<div class="empty-list">暂无模块告警</div>';
    els.runtimeEventList.innerHTML = '<div class="empty-list">暂无运行事件</div>';
    renderOperationsDashboard();
    return;
  }

  const summary = data.summary || {};
  els.runtimeUpdatedAt.textContent = `更新于 ${formatDateTime(data.at)}`;
  els.runtimeOverviewMeta.textContent = `最近 24 小时 ${summary.last24h || 0} 条`;
  els.runtimeWarningCount.textContent = summary.last24hWarning || 0;
  els.runtimeErrorCount.textContent = summary.last24hError || 0;
  els.runtimeFallbackCount.textContent = summary.fallback || 0;
  els.runtimeTotalCount.textContent = summary.total || 0;

  const hourly = Array.isArray(data.hourly) ? data.hourly : [];
  const maxCount = Math.max(1, ...hourly.map((item) => item.total || 0));
  els.runtimeHourlyChart.innerHTML = hourly.length
    ? hourly.map((item) => {
      const height = Math.max(8, Math.round(((item.total || 0) / maxCount) * 84));
      const levelClass = item.error ? "is-error" : item.warning ? "is-warning" : "";
      return `
        <div class="runtime-chart-column" title="${escapeHtml(item.label)} · ${item.total || 0} 条">
          <span class="runtime-chart-bar ${levelClass}" style="height:${height}%"></span>
          <small>${escapeHtml(item.label.slice(0, 2))}</small>
        </div>
      `;
    }).join("")
    : '<div class="empty-list">暂无趋势数据</div>';

  const topEvents = Array.isArray(data.byEvent) ? data.byEvent : [];
  els.runtimeTopEvents.innerHTML = topEvents.length
    ? topEvents.map((item) => `
      <span class="runtime-event-chip ${item.level === "error" ? "is-error" : item.level === "warning" ? "is-warning" : ""}">
        ${escapeHtml(item.event)} <strong>${item.total || 0}</strong>
      </span>
    `).join("")
    : "";

  const areas = Array.isArray(data.byArea) ? data.byArea : [];
  els.runtimeAreaMeta.textContent = areas.length ? `${areas.length} 个模块` : "暂无数据";
  els.runtimeAreaList.innerHTML = areas.length
    ? areas.map((item) => `
      <article class="runtime-area-item ${item.error ? "is-error" : item.warning ? "is-warning" : ""}">
        <div>
          <strong>${escapeHtml(runtimeAreaLabel(item.area))}</strong>
          <span>${escapeHtml(item.area)} · 最近 ${formatDateTime(item.latestAt)}</span>
        </div>
        <div>
          <span>${item.total || 0} 条</span>
          <strong>${item.error || 0} 错误 / ${item.warning || 0} 警告</strong>
        </div>
      </article>
    `).join("")
    : '<div class="empty-list">暂无模块告警</div>';

  const recent = Array.isArray(data.recent) ? data.recent : [];
  els.runtimeEventList.innerHTML = recent.length
    ? recent.map((event) => {
      const details = runtimeDetailsText(event.details);
      return `
        <article class="runtime-event-item ${event.level === "error" ? "is-error" : event.level === "warning" ? "is-warning" : ""}">
          <div class="runtime-event-topline">
            <span class="runtime-level-badge">${escapeHtml(runtimeLevelLabel(event.level))}</span>
            <strong>${escapeHtml(runtimeAreaLabel(event.area))}</strong>
            <time>${formatDateTime(event.at)}</time>
          </div>
          <div class="runtime-event-title">
            <strong>${escapeHtml(event.event || "runtime_event")}</strong>
            <span>${escapeHtml(event.source || "server")}</span>
          </div>
          <p>${escapeHtml(event.message || "")}</p>
          ${details ? `<pre>${escapeHtml(details)}</pre>` : ""}
        </article>
      `;
    }).join("")
    : '<div class="empty-list">暂无运行事件</div>';
  renderOperationsDashboard();
}

async function loadRuntimeEvents() {
  try {
    const data = await api("/runtime-events");
    state.runtimeEvents = data;
    renderRuntimeEvents();
  } catch (error) {
    if (error.status === 401) {
      showLogin();
      return;
    }
    state.runtimeEvents = null;
    if (els.runtimeEventList) {
      els.runtimeUpdatedAt.textContent = "查询失败";
      els.runtimeOverviewMeta.textContent = "-";
      els.runtimeHourlyChart.innerHTML = `<div class="empty-list">${escapeHtml(error.message)}</div>`;
      els.runtimeAreaList.innerHTML = "";
      els.runtimeEventList.innerHTML = "";
    }
    renderOperationsDashboard();
  }
}

async function clearRuntimeEvents(button) {
  if (!window.confirm("确定清空运行日志吗？这只会清空监控事件，不影响用户数据。")) return;
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "正在清空";
  try {
    const data = await api("/runtime-events/clear", {
      method: "POST",
      body: JSON.stringify({})
    });
    state.runtimeEvents = data;
    renderRuntimeEvents();
    await loadSecurity();
  } catch (error) {
    state.runtimeEvents = state.runtimeEvents || { recent: [] };
    renderRuntimeEvents();
    if (els.runtimeEventList) {
      els.runtimeEventList.insertAdjacentHTML("afterbegin", `<div class="empty-list">${escapeHtml(error.message)}</div>`);
    }
  } finally {
    button.textContent = originalText;
    button.disabled = false;
    button.blur();
  }
}

function performanceTypeLabel(type) {
  return {
    startup: "页面启动",
    "app-ready": "首页就绪",
    "login-ready": "登录页就绪",
    api: "接口请求",
    "api-error": "接口失败",
    image: "图片下载",
    "image-error": "图片失败",
    model: "模型下载",
    "model-error": "模型失败",
    resource: "资源加载",
    "runtime-warning": "客户端警告"
  }[type] || type || "体验事件";
}

function performanceDetailText(details) {
  if (!details) return "";
  try {
    return JSON.stringify(details, null, 2).slice(0, 900);
  } catch {
    return String(details).slice(0, 900);
  }
}

function performancePathLabel(item) {
  const path = item?.path || item?.apiPath || item?.key || "unknown";
  return String(path).replace(/^https?:\/\/[^/]+/i, "").slice(0, 120);
}

function renderPerformanceSummary() {
  const data = state.performanceSummary;
  if (!els.performanceRecentEvents) return;
  if (!data) {
    els.performanceUpdatedAt.textContent = "等待刷新";
    els.performanceOverviewMeta.textContent = "-";
    els.performanceStartupP95.textContent = "-";
    els.performanceImageCount.textContent = "0";
    els.performanceImageP95.textContent = "-";
    els.performanceImageErrorCount.textContent = "0";
    els.performanceApiErrorCount.textContent = "0";
    els.performanceModelP95.textContent = "-";
    els.performanceHourlyChart.innerHTML = '<div class="empty-list">暂无体验数据</div>';
    els.performanceTopEvents.innerHTML = "";
    els.performanceSlowAssetMeta.textContent = "暂无数据";
    els.performanceSlowAssets.innerHTML = '<div class="empty-list">暂无慢资源</div>';
    els.performanceRecentEvents.innerHTML = '<div class="empty-list">暂无体验事件</div>';
    renderOperationsDashboard();
    return;
  }

  const summary = data.summary || {};
  els.performanceUpdatedAt.textContent = `更新于 ${formatDateTime(data.at)}`;
  els.performanceOverviewMeta.textContent = `最近 24 小时 ${formatNumber(summary.last24h || 0)} 条 · ${formatNumber(summary.uniqueUsers || 0)} 个账户`;
  els.performanceStartupP95.textContent = formatMs(summary.startupP95Ms);
  els.performanceImageCount.textContent = formatNumber(summary.imageCount || 0);
  els.performanceImageP95.textContent = formatMs(summary.imageP95Ms);
  els.performanceImageErrorCount.textContent = formatNumber(summary.imageErrorCount || 0);
  els.performanceApiErrorCount.textContent = formatNumber(summary.apiErrorCount || 0);
  els.performanceModelP95.textContent = formatMs(summary.modelP95Ms);

  const hourly = Array.isArray(data.hourly) ? data.hourly : [];
  const maxCount = Math.max(1, ...hourly.map((item) => item.total || 0));
  els.performanceHourlyChart.innerHTML = hourly.length
    ? hourly.map((item) => {
      const height = Math.max(8, Math.round(((item.total || 0) / maxCount) * 84));
      const levelClass = item.error ? "is-error" : item.image ? "is-warning" : "";
      return `
        <div class="runtime-chart-column" title="${escapeHtml(item.label)} · ${item.total || 0} 条">
          <span class="runtime-chart-bar ${levelClass}" style="height:${height}%"></span>
          <small>${escapeHtml(item.label.slice(0, 2))}</small>
        </div>
      `;
    }).join("")
    : '<div class="empty-list">暂无趋势数据</div>';

  const topEvents = [
    ["启动", summary.startupCount || 0, ""],
    ["图片失败", summary.imageErrorCount || 0, summary.imageErrorCount ? "is-error" : ""],
    ["API失败", summary.apiErrorCount || 0, summary.apiErrorCount ? "is-error" : ""],
    ["缓存命中", `${Math.round((summary.cacheHitRate || 0) * 100)}%`, ""],
    ["图片总耗时", formatMs(summary.imageTotalDurationMs || 0), ""],
    ["传输", formatBytes(summary.imageTotalTransferBytes || 0), ""]
  ];
  els.performanceTopEvents.innerHTML = topEvents.map(([label, value, className]) => `
    <span class="runtime-event-chip ${className}">
      ${escapeHtml(label)} <strong>${escapeHtml(String(value))}</strong>
    </span>
  `).join("");

  const slowPaths = [
    ...(data.images?.byPath || []).map((item) => ({ ...item, type: "图片" })),
    ...(data.models?.byPath || []).map((item) => ({ ...item, type: "模型" })),
    ...(data.api?.byPath || []).map((item) => ({ ...item, type: "接口" }))
  ].sort((left, right) => (right.errorCount || 0) - (left.errorCount || 0) || (right.avgMs || 0) - (left.avgMs || 0)).slice(0, 16);
  els.performanceSlowAssetMeta.textContent = slowPaths.length ? `${slowPaths.length} 条重点路径` : "暂无数据";
  els.performanceSlowAssets.innerHTML = slowPaths.length
    ? slowPaths.map((item) => `
      <article class="runtime-area-item ${item.errorCount ? "is-error" : item.avgMs >= 3000 ? "is-warning" : ""}">
        <div>
          <strong>${escapeHtml(item.type)} · ${escapeHtml(performancePathLabel(item))}</strong>
          <span>${formatNumber(item.count || 0)} 次 · 平均 ${formatMs(item.avgMs)} · 传输 ${formatBytes(item.totalBytes || 0)}</span>
        </div>
        <div>
          <span>${item.errorCount || 0} 失败</span>
          <strong>总耗时 ${formatMs(item.totalMs || 0)}</strong>
        </div>
      </article>
    `).join("")
    : '<div class="empty-list">暂无慢资源</div>';

  const recent = Array.isArray(data.warnings) && data.warnings.length ? data.warnings : (Array.isArray(data.recent) ? data.recent : []);
  els.performanceRecentEvents.innerHTML = recent.length
    ? recent.slice(0, 80).map((event) => {
      const details = performanceDetailText(event.details);
      const isError = event.ok === false || String(event.type || "").endsWith("-error") || Number(event.status) >= 400;
      return `
        <article class="runtime-event-item ${isError ? "is-error" : Number(event.durationMs || event.totalMs) >= 5000 ? "is-warning" : ""}">
          <div class="runtime-event-topline">
            <span class="runtime-level-badge">${escapeHtml(performanceTypeLabel(event.type))}</span>
            <strong>${escapeHtml(event.accountDisplay || event.userCode || "匿名")}</strong>
            <time>${formatDateTime(event.at)}</time>
          </div>
          <div class="runtime-event-title">
            <strong>${escapeHtml(event.page || "app")}</strong>
            <span>${escapeHtml(event.source || "web")} · ${formatMs(event.durationMs ?? event.totalMs)}${event.status ? ` · ${event.status}` : ""}</span>
          </div>
          ${details ? `<pre>${escapeHtml(details)}</pre>` : ""}
        </article>
      `;
    }).join("")
    : '<div class="empty-list">暂无体验事件</div>';
  renderOperationsDashboard();
}

async function loadPerformanceSummary() {
  try {
    const data = await api("/performance-summary");
    state.performanceSummary = data;
    renderPerformanceSummary();
  } catch (error) {
    if (error.status === 401) {
      showLogin();
      return;
    }
    state.performanceSummary = null;
    if (els.performanceRecentEvents) {
      els.performanceUpdatedAt.textContent = "查询失败";
      els.performanceOverviewMeta.textContent = "-";
      els.performanceHourlyChart.innerHTML = `<div class="empty-list">${escapeHtml(error.message)}</div>`;
      els.performanceSlowAssets.innerHTML = "";
      els.performanceRecentEvents.innerHTML = "";
    }
    renderOperationsDashboard();
  }
}

async function clearPerformanceEvents(button) {
  if (!window.confirm("确定清空体验监控数据吗？这只会清空性能事件，不影响用户数据。")) return;
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "正在清空";
  try {
    const data = await api("/performance-events/clear", {
      method: "POST",
      body: JSON.stringify({})
    });
    state.performanceSummary = data;
    renderPerformanceSummary();
    await loadSecurity();
  } catch (error) {
    renderPerformanceSummary();
    if (els.performanceRecentEvents) {
      els.performanceRecentEvents.insertAdjacentHTML("afterbegin", `<div class="empty-list">${escapeHtml(error.message)}</div>`);
    }
  } finally {
    button.textContent = originalText;
    button.disabled = false;
    button.blur();
  }
}

async function updateRegistrationGate(action, button) {
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = action === "pause" ? "正在暂停" : "正在开放";
  try {
    await api("/server-registration", {
      method: "PATCH",
      body: JSON.stringify({ action })
    });
    await loadServerStatus();
    await loadSecurity();
  } catch (error) {
    if (els.serverCapacityMessage) {
      els.serverCapacityMessage.textContent = error.message;
    }
  } finally {
    button.textContent = originalText;
    button.blur();
    renderServerStatus();
  }
}

function renderModerationAttachments(attachments) {
  const list = Array.isArray(attachments) ? attachments : [];
  if (!list.length) return "";
  return `
    <div class="moderation-attachments" aria-label="反馈图片">
      ${list.map((attachment, index) => `
        <a href="${escapeHtml(attachment.url || "#")}" target="_blank" rel="noopener" title="${escapeHtml(attachment.name || `图片 ${index + 1}`)}">
          <img src="${escapeHtml(attachment.url || "")}" alt="${escapeHtml(attachment.name || `反馈图片 ${index + 1}`)}" loading="lazy">
        </a>
      `).join("")}
    </div>
  `;
}

function renderModerationQueue() {
  const queue = state.moderationQueue || { items: [], pending: 0, reviewing: 0, reports: 0, feedback: 0, total: 0 };
  els.moderationPendingCount.textContent = String(queue.pending || 0);
  els.moderationReviewingCount.textContent = String(queue.reviewing || 0);
  els.moderationReportCount.textContent = String(queue.reports || 0);
  els.moderationFeedbackCount.textContent = String(queue.feedback || 0);
  els.moderationQueueMeta.textContent = `${queue.total || 0} 条 · 待处理 ${queue.pending || 0}`;
  const items = queue.items || [];
  if (!items.length) {
    els.moderationQueueList.innerHTML = '<div class="empty-list">暂无反馈或举报</div>';
    renderOperationsDashboard();
    return;
  }
  els.moderationQueueList.innerHTML = items.map((item) => `
    <article class="moderation-item is-${escapeHtml(item.status || "pending")}">
      <div class="moderation-item-main">
        <strong>${escapeHtml(moderationTypeLabel(item.type))}</strong>
        <span>${escapeHtml(moderationCategoryLabel(item.category))} · ${formatDateTime(item.createdAt)}</span>
        <p>${escapeHtml(item.text || "-")}</p>
        ${item.snapshot ? `<em>内容快照：${escapeHtml(item.snapshot)}</em>` : ""}
        ${renderModerationAttachments(item.attachments)}
      </div>
      <div class="moderation-item-meta">
        <span><small>提交人</small><strong>${escapeHtml(item.reporterDisplay || item.reporterCode || "-")}</strong></span>
        <span><small>目标</small><strong>${escapeHtml(item.targetDisplay || item.targetType || "-")}</strong></span>
        <span><small>状态</small><strong>${escapeHtml(moderationStatusLabel(item.status))}</strong></span>
      </div>
      <div class="moderation-item-actions">
        <button class="secondary-button" type="button" data-moderation-item="${escapeHtml(item.id)}" data-moderation-status="reviewing">处理中</button>
        <button class="secondary-button" type="button" data-moderation-item="${escapeHtml(item.id)}" data-moderation-status="resolved">已处理</button>
        <button class="secondary-button" type="button" data-moderation-item="${escapeHtml(item.id)}" data-moderation-status="dismissed">忽略</button>
      </div>
    </article>
  `).join("");
  renderOperationsDashboard();
}

async function loadModerationQueue() {
  try {
    const data = await api("/moderation");
    state.moderationQueue = data.queue;
    renderModerationQueue();
  } catch (error) {
    if (error.status === 401) {
      showLogin();
      return;
    }
    els.moderationQueueList.innerHTML = `<div class="empty-list">${escapeHtml(error.message)}</div>`;
    renderOperationsDashboard();
  }
}

async function loadSecurity() {
  try {
    const data = await api("/security");
    state.adminSession = data.session;
    state.authEvents = data.events || [];
    state.loginEvents = data.loginEvents || [];
    state.loginSummary = data.loginSummary || null;
    renderSecurity();
  } catch (error) {
    if (error.status === 401) {
      showLogin();
      return;
    }
    state.loginSummary = null;
    state.loginEvents = [];
    state.authEvents = [];
    renderOperationsDashboard();
  }
}

function resetDetail() {
  state.selectedCode = null;
  els.accountDetail.classList.add("hidden");
  els.emptyDetail.classList.remove("hidden");
}

function renderSummary(summary) {
  summary = summary || {};
  state.summary = summary;
  els.accountCount.textContent = String(summary.accountCount || 0);
  els.activeAccountCount.textContent = String(summary.activeAccountCount || 0);
  els.totalRecordCount.textContent = String(summary.recordCount || 0);
  els.totalPhotoCount.textContent = String(summary.photoCount || 0);
  els.fullModeCount.textContent = String(summary.fullModeCount || 0);
  els.basicModeCount.textContent = String(summary.basicModeCount || 0);
  els.pendingConsentCount.textContent = String(summary.pendingConsentCount || 0);
  els.frozenAccountCount.textContent = String(summary.frozenCount || 0);
  els.bannedAccountCount.textContent = String(summary.bannedCount || 0);
  renderOperationsDashboard();
}

function renderAccountModeration(account, moderationEvents = [], moderationItems = []) {
  const moderation = account.moderation || { status: "active", reasonLabel: "其他原因" };
  const status = moderation.status || "active";
  els.moderationStatusBadge.textContent = moderationStatusLabel(status);
  els.moderationStatusBadge.dataset.status = status;
  els.moderationStatusText.textContent = `${moderationStatusLabel(status)} · ${moderation.reasonLabel || "其他原因"}`;
  if (status === "active") {
    els.moderationStatusDescription.textContent = "账号可正常登录、记录和参与社区。";
  } else if (status === "frozen") {
    els.moderationStatusDescription.textContent = moderation.until
      ? `账号写操作受限，至 ${formatDateTime(moderation.until)}。`
      : "账号写操作受限，需要管理员恢复。";
  } else {
    els.moderationStatusDescription.textContent = "账号已从社区隐藏，记录和互动功能停止。";
  }

  els.moderationReason.value = moderation.reason || "other";
  els.moderationNote.value = "";
  els.moderationActionMessage.textContent = "";
  els.moderationHistoryList.innerHTML = moderationEvents.length
    ? moderationEvents.slice(0, 8).map((event) => `
      <div class="moderation-history-item">
        <strong>${escapeHtml(moderationStatusLabel(event.status))}</strong>
        <span>${escapeHtml(moderationCategoryLabel(event.reason))} · ${formatDateTime(event.at)} · ${escapeHtml(event.operator || "-")}</span>
        ${event.until ? `<small>至 ${formatDateTime(event.until)}</small>` : ""}
        ${event.note ? `<p>${escapeHtml(event.note)}</p>` : ""}
      </div>
    `).join("")
    : '<div class="empty-list compact">暂无治理记录</div>';
  els.moderationRelatedList.innerHTML = moderationItems.length
    ? `
      <div class="moderation-related-heading">相关反馈/举报</div>
      ${moderationItems.slice(0, 6).map((item) => `
        <div class="moderation-related-item">
          <strong>${escapeHtml(moderationTypeLabel(item.type))} · ${escapeHtml(moderationStatusLabel(item.status))}</strong>
          <span>${escapeHtml(item.text || "-")}</span>
        </div>
      `).join("")}
    `
    : "";
}

function privacyModeLabel(privacy) {
  if (privacy?.fullAccess) return "完整模式";
  if (privacy?.mode === "basic") return "基础模式";
  return "待选择";
}

function privacyEventLabel(action) {
  return {
    accept_full: "同意完整模式",
    choose_basic: "选择基础模式",
    switch_basic: "切换基础模式",
    withdraw_and_clear: "撤销签署并清除数据"
  }[action] || action;
}

function renderAccounts() {
  const query = els.accountSearch.value.trim().toLowerCase();
  const filtered = state.accounts.filter((account) => accountSearchText(account).includes(query));
  els.accountMeta.textContent = `${filtered.length} 个`;

  if (!filtered.length) {
    els.accountList.innerHTML = '<div class="empty-list">没有匹配的账户</div>';
    return;
  }

  els.accountList.innerHTML = filtered.map((account) => `
    <button class="account-item${account.code === state.selectedCode ? " is-active" : ""}" type="button" data-code="${escapeHtml(account.code)}">
      <span class="account-code">${escapeHtml(accountDisplayCode(account))}</span>
        <span class="account-item-meta">
          <span>${account.recordCount} 条 · ${account.photoCount} 张照片</span>
          <span>${formatDate(account.latestRecordAt)} · ${privacyModeLabel(account.privacy)}</span>
          ${account.moderation?.status && account.moderation.status !== "active" ? `<span class="account-status-chip is-${escapeHtml(account.moderation.status)}">${escapeHtml(moderationStatusLabel(account.moderation.status))}</span>` : ""}
          ${account.source === "qq" ? `<span>绑定QQ ${escapeHtml(account.qqBindId || "-")}</span>` : ""}
        </span>
    </button>
  `).join("");
}

async function loadAccounts({ preserveSelection = true } = {}) {
  els.refreshButton.disabled = true;
  try {
    const data = await api("/accounts");
    state.accounts = data.accounts;
    renderSummary(data.summary);
    renderAccounts();

    if (preserveSelection && state.selectedCode && state.accounts.some((account) => account.code === state.selectedCode)) {
      await selectAccount(state.selectedCode);
      return;
    }

    const firstActive = state.accounts.find((account) => account.recordCount > 0) || state.accounts[0];
    if (firstActive) {
      await selectAccount(firstActive.code);
    }
  } catch (error) {
    if (error.status === 401) {
      showLogin();
      setMessage("管理会话已过期，请重新登录。", "error");
      return;
    }
    els.accountList.innerHTML = `<div class="empty-list">${escapeHtml(error.message)}</div>`;
    renderOperationsDashboard();
  } finally {
    els.refreshButton.disabled = false;
  }
}

function adminShellVisible() {
  return !els.shell.classList.contains("hidden") && els.loginView.classList.contains("hidden");
}

function adminPageIsAtTop() {
  return (window.scrollY || document.documentElement.scrollTop || 0) <= 1;
}

function adminPullTargetIsBlocked(target) {
  return target instanceof Element && Boolean(target.closest("dialog, .account-list, .record-list, .auth-event-list, .user-audit-list, .runtime-event-list, .runtime-area-list"));
}

function setAdminPullRefreshDistance(distance) {
  adminPullDistance = Math.max(0, Math.min(ADMIN_PULL_REFRESH_MAX, distance));
  const ready = adminPullDistance >= ADMIN_PULL_REFRESH_THRESHOLD;
  document.documentElement.style.setProperty("--admin-pull-offset", `${(adminPullDistance * 0.24).toFixed(1)}px`);
  document.documentElement.style.setProperty("--admin-pull-rotation", `${adminPullDistance * 2}deg`);
  document.body.classList.toggle("is-admin-pulling", adminPullDistance > 0);
  document.body.classList.toggle("is-admin-pull-ready", ready);
  els.pullRefresh?.setAttribute("aria-hidden", adminPullDistance > 0 ? "false" : "true");
  if (!state.isRefreshing && els.pullRefreshText) {
    els.pullRefreshText.textContent = ready ? "松开刷新" : "下拉刷新";
  }
}

function resetAdminPullRefresh() {
  adminPullStartY = null;
  adminPullStartX = null;
  setAdminPullRefreshDistance(0);
  document.body.classList.remove("is-admin-refreshing", "is-admin-pull-ready");
}

async function refreshAdminData({ fromPull = false } = {}) {
  if (state.isRefreshing || !adminShellVisible()) return;
  state.isRefreshing = true;
  document.body.classList.add("is-admin-refreshing");
  document.body.classList.remove("is-admin-pull-ready");
  if (fromPull) {
    setAdminPullRefreshDistance(58);
    if (els.pullRefreshText) els.pullRefreshText.textContent = "正在刷新";
  }

  try {
    await loadSecurity();
    await loadAccounts();
    await loadModerationQueue();
    await loadServerStatus();
    await loadRuntimeEvents();
    await loadPerformanceSummary();
    await loadApiQuota();
    if (fromPull && els.pullRefreshText) els.pullRefreshText.textContent = "刷新完成";
  } catch (error) {
    if (fromPull && els.pullRefreshText) {
      els.pullRefreshText.textContent = error.message || "刷新失败";
    }
  } finally {
    window.setTimeout(() => {
      state.isRefreshing = false;
      resetAdminPullRefresh();
    }, fromPull ? 520 : 0);
  }
}

function handleAdminPullStart(event) {
  if (
    state.isRefreshing
    || !adminShellVisible()
    || !adminPageIsAtTop()
    || event.touches.length !== 1
    || adminPullTargetIsBlocked(event.target)
  ) {
    resetAdminPullRefresh();
    return;
  }
  adminPullStartY = event.touches[0].clientY;
  adminPullStartX = event.touches[0].clientX;
}

function handleAdminPullMove(event) {
  if (adminPullStartY === null || event.touches.length !== 1 || state.isRefreshing) return;

  const deltaY = event.touches[0].clientY - adminPullStartY;
  const deltaX = event.touches[0].clientX - adminPullStartX;
  if (Math.abs(deltaX) > Math.max(12, Math.abs(deltaY))) {
    resetAdminPullRefresh();
    return;
  }
  if (deltaY <= 0 || !adminPageIsAtTop()) {
    setAdminPullRefreshDistance(0);
    return;
  }

  event.preventDefault();
  setAdminPullRefreshDistance(deltaY * 0.52);
}

function handleAdminPullEnd() {
  if (adminPullStartY === null || state.isRefreshing) return;
  const shouldRefresh = adminPullDistance >= ADMIN_PULL_REFRESH_THRESHOLD;
  adminPullStartY = null;
  adminPullStartX = null;
  if (shouldRefresh) {
    void refreshAdminData({ fromPull: true });
  } else {
    resetAdminPullRefresh();
  }
}

function renderAccountDetail(account, records, privacyEvents = [], moderationEvents = [], moderationItems = []) {
  els.emptyDetail.classList.add("hidden");
  els.accountDetail.classList.remove("hidden");
  els.detailCode.textContent = accountDisplayCode(account);
  els.detailSource.textContent = account.source === "preset" ? "预置账户" : account.source === "qq" ? "QQ账户" : "新建账户";
  els.detailActivity.textContent = account.latestRecordAt
    ? `${formatDate(account.firstRecordAt)} 开始记录 · 最近更新 ${formatDate(account.latestRecordAt)}`
    : "该账户尚未产生记录";
  els.detailUniqueId.textContent = account.uniqueId || account.code;
  els.detailQqBindId.textContent = account.qqBindId || "-";
  els.detailQqUnionId.textContent = account.qqUnionIdDigest || "-";
  renderQqAvatar(els.detailQqAvatar, account);
  els.detailLatestWeight.textContent = formatWeight(account.latestWeight);
  els.detailWeightChange.textContent = formatChange(account.weightChange);
  els.detailWeightChange.style.color = Number.isFinite(account.weightChange)
    ? account.weightChange <= 0 ? "var(--green)" : "var(--coral)"
    : "";
  els.detailRecordCount.textContent = String(account.recordCount);
  els.detailPhotoCount.textContent = String(account.photoCount);
  renderAccountModeration(account, moderationEvents, moderationItems);
  const privacy = account.privacy || {};
  els.detailPrivacyStatus.textContent = privacy.agreementAccepted ? "已签署" : "未签署";
  els.detailPrivacyMode.textContent = privacyModeLabel(privacy);
  els.detailConsentTime.textContent = privacy.acceptedAt ? `${dateFormat.format(new Date(privacy.acceptedAt))} ${timeFormat.format(new Date(privacy.acceptedAt))}` : "-";
  els.detailAgreementVersion.textContent = privacy.agreementVersion || "-";
  els.detailSensitiveConsent.textContent = privacy.sensitiveInformationAccepted ? "已单独同意" : "未同意";
  els.consentEventList.innerHTML = privacyEvents.length
    ? privacyEvents.map((event) => {
      const date = new Date(event.at);
      return `
        <div class="consent-event">
          <span><strong>${escapeHtml(privacyEventLabel(event.action))}</strong><small>${dateFormat.format(date)} ${timeFormat.format(date)}</small></span>
          <span><small>模式</small><strong>${event.mode === "full" ? "完整" : "基础"}</strong></span>
          <span><small>网络摘要</small><code>${escapeHtml(event.networkDigest || "-")}</code></span>
          <span><small>设备摘要</small><code>${escapeHtml(event.deviceDigest || "-")}</code></span>
        </div>
      `;
    }).join("")
    : '<div class="empty-list">暂无隐私选择记录</div>';

  const passkeys = Array.isArray(account.passkeys) ? account.passkeys : [];
  els.adminPasskeyMeta.textContent = `${passkeys.length} 个`;
  els.adminPasskeyList.innerHTML = passkeys.length
    ? passkeys.map((credential) => `
      <div class="admin-passkey-item">
        <span>
          <strong>${escapeHtml(credential.label || "用户 Passkey")}</strong>
          <small>摘要 ${escapeHtml(credential.idDigest || "-")} · 添加于 ${formatDate(credential.createdAt)}${credential.lastUsedAt ? ` · 最近使用 ${formatDate(credential.lastUsedAt)}` : ""}</small>
        </span>
        <button class="admin-passkey-delete" type="button" data-admin-passkey-delete="${escapeHtml(credential.id)}" aria-label="撤销 ${escapeHtml(credential.label || "用户 Passkey")}">${trashIconMarkup()}</button>
      </div>
    `).join("")
    : '<div class="empty-list">暂无 Passkey 绑定</div>';

  els.recordMeta.textContent = `${records.length} 条，按时间倒序`;

  if (!records.length) {
    els.recordList.innerHTML = '<div class="empty-list">还没有记录</div>';
    return;
  }

  els.recordList.innerHTML = records.map((record) => {
    const date = new Date(record.timestamp);
    const isFood = record.type === "food";
    const caption = isFood
      ? `${dateFormat.format(date)} ${timeFormat.format(date)} · 食物记录`
      : `${dateFormat.format(date)} ${timeFormat.format(date)} · ${formatWeight(record.weight)}`;
    const foodPhotos = Array.isArray(record.foodPhotos) ? record.foodPhotos : [];
    const visibleFoodPhotos = foodPhotos.slice(0, 4);
    const photo = isFood
      ? visibleFoodPhotos.length
        ? `
          <div class="admin-record-food-photos ${visibleFoodPhotos.length === 1 ? "is-single" : ""}" aria-label="食物照片 ${foodPhotos.length} 张">
            ${visibleFoodPhotos.map((item, index) => {
              const url = item.photoUrl || "";
              const thumb = item.thumbnailUrl || item.photoUrl || "";
              return `
                <button class="admin-record-photo admin-record-food-photo" type="button" data-photo-url="${escapeHtml(url)}" data-caption="${escapeHtml(`${caption} · 第 ${index + 1} 张`)}" aria-label="查看 ${escapeHtml(caption)} 的第 ${index + 1} 张照片">
                  <img src="${escapeHtml(thumb)}" alt="食物照片" loading="lazy">
                  ${index === 3 && foodPhotos.length > 4 ? `<span class="admin-record-photo-more">+${foodPhotos.length - 4}</span>` : ""}
                </button>
              `;
            }).join("")}
          </div>
        `
        : '<div class="admin-record-placeholder">无食物图</div>'
      : record.photoUrl
        ? `<button class="admin-record-photo" type="button" data-photo-url="${escapeHtml(record.photoUrl)}" data-caption="${escapeHtml(caption)}" aria-label="查看 ${escapeHtml(caption)} 的照片"><img src="${escapeHtml(record.photoUrl)}" alt="记录照片" loading="lazy"></button>`
        : '<div class="admin-record-placeholder">无照片</div>';
    const foods = Array.isArray(record.foods) ? record.foods : [];
    const foodNames = foods.map((item) => item.name).filter(Boolean).slice(0, 4).join("、");
    const nutrition = record.foodNutrition || {};
    const summary = isFood
      ? `
        <div class="record-weight record-food-summary">
          <strong>${formatFoodValue(record.foodCalories, " kcal", 0)}</strong>
          <small>蛋白 ${formatFoodValue(nutrition.protein, "g")} · 碳水 ${formatFoodValue(nutrition.carbs, "g")} · 脂肪 ${formatFoodValue(nutrition.fat, "g")}</small>
        </div>
      `
      : `<div class="record-weight">${formatWeight(record.weight)}</div>`;
    return `
      <article class="admin-record ${isFood ? "is-food-record" : ""}">
        ${photo}
        <div class="record-time">
          <strong>${dateFormat.format(date)}</strong>
          <span>${timeFormat.format(date)}</span>
          ${isFood ? `<small>${escapeHtml(foodNames || "食物记录")}</small>` : record.mood ? `<small>${escapeHtml(record.mood)}</small>` : ""}
        </div>
        ${summary}
        <div class="record-type">${isFood ? `${foods.length || 0} 项 · ${record.photoCount || 0} 张` : record.hasPhoto ? "照片记录" : "体重记录"}</div>
      </article>
    `;
  }).join("");
}

async function selectAccount(code) {
  state.selectedCode = code;
  renderAccounts();
  els.emptyDetail.classList.add("hidden");
  els.accountDetail.classList.remove("hidden");
  els.recordList.innerHTML = '<div class="empty-list">正在读取记录...</div>';

  try {
    const data = await api(`/accounts/${encodeURIComponent(code)}`);
    if (state.selectedCode !== code) return;
    renderAccountDetail(data.account, data.records, data.privacyEvents || [], data.moderationEvents || [], data.moderationItems || []);
  } catch (error) {
    if (error.status === 401) {
      showLogin();
      return;
    }
    els.recordList.innerHTML = `<div class="empty-list">${escapeHtml(error.message)}</div>`;
  }
}

async function revokeAdminUserPasskey(credentialId, button = null) {
  const code = state.selectedCode;
  if (!code || !credentialId) return;
  const confirmed = window.confirm("确定撤销这个 Passkey 吗？撤销后该设备将不能再直接登录这个账户。");
  if (!confirmed) return;

  if (button) {
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
  }
  try {
    await api(`/accounts/${encodeURIComponent(code)}/passkeys/${encodeURIComponent(credentialId)}`, {
      method: "DELETE",
      body: "{}"
    });
    await loadSecurity();
    await selectAccount(code);
  } catch (error) {
    window.alert(error.message);
  } finally {
    if (button) {
      button.disabled = false;
      button.removeAttribute("aria-busy");
      button.blur();
    }
  }
}

async function updateAccountModeration(action, button = null) {
  const code = state.selectedCode;
  if (!code) return;
  const actionLabel = { freeze: "冻结", ban: "封禁", restore: "恢复" }[action] || "处理";
  if (action !== "restore") {
    const confirmed = window.confirm(`确定${actionLabel}这个账户吗？该操作会立即影响用户功能。`);
    if (!confirmed) return;
  }
  if (button) {
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
  }
  els.moderationActionMessage.textContent = `正在${actionLabel}账户...`;
  try {
    const durationValue = els.moderationDuration.value;
    const body = {
      action,
      reason: els.moderationReason.value || "other",
      note: els.moderationNote.value.trim()
    };
    if (durationValue) {
      body.durationDays = Number(durationValue);
    }
    await api(`/accounts/${encodeURIComponent(code)}/moderation`, {
      method: "PATCH",
      body: JSON.stringify(body)
    });
    await loadAccounts();
    await selectAccount(code);
    els.moderationActionMessage.textContent = `已${actionLabel}账户。`;
    await loadModerationQueue();
  } catch (error) {
    els.moderationActionMessage.textContent = error.message;
  } finally {
    if (button) {
      button.disabled = false;
      button.removeAttribute("aria-busy");
      button.blur();
    }
  }
}

async function updateModerationItemStatus(itemId, status, button = null) {
  if (!itemId || !status) return;
  if (button) {
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
  }
  try {
    const data = await api(`/moderation/items/${encodeURIComponent(itemId)}`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    state.moderationQueue = data.queue;
    renderModerationQueue();
    if (state.selectedCode) {
      await selectAccount(state.selectedCode);
    }
  } catch (error) {
    window.alert(error.message);
  } finally {
    if (button) {
      button.disabled = false;
      button.removeAttribute("aria-busy");
      button.blur();
    }
  }
}

els.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (els.loginFields.classList.contains("hidden")) {
    await loginWithPasskey();
    return;
  }
  const submitButton = els.loginForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  setMessage("正在登录...");

  try {
    const data = await api("/login", {
      method: "POST",
      body: JSON.stringify({
        username: els.username.value.trim() || "admin",
        password: els.password.value
      })
    });
    els.password.value = "";
    state.adminSession = data.session;
    renderSecurity();
    setMessage("");
    showShell();
    await loadSecurity();
    await loadAccounts({ preserveSelection: false });
    await loadModerationQueue();
    await loadServerStatus();
    await loadRuntimeEvents();
    await loadPerformanceSummary();
    await loadApiQuota();
  } catch (error) {
    setMessage(error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
});

els.passkeyLoginButton.addEventListener("click", (event) => {
  event.preventDefault();
  event.currentTarget.blur();
  loginWithPasskey();
});

els.logoutButton.addEventListener("click", async () => {
  await api("/logout", { method: "POST", body: "{}" }).catch(() => {});
  showLogin();
  await loadPasskeyStatus();
});

els.refreshButton.addEventListener("click", async () => {
  els.refreshButton.blur();
  await refreshAdminData();
});
els.pauseRegistrationButton?.addEventListener("click", () => {
  updateRegistrationGate("pause", els.pauseRegistrationButton);
});
els.openRegistrationButton?.addEventListener("click", () => {
  updateRegistrationGate("open", els.openRegistrationButton);
});
els.foodRecognitionPriorityList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-food-priority-move]");
  if (!button) return;
  button.blur();
  moveFoodRecognitionPriority(button.dataset.foodPriorityMove, Number(button.dataset.direction) || 0);
});
els.saveFoodRecognitionPriorityButton?.addEventListener("click", () => {
  saveFoodRecognitionPriority(els.saveFoodRecognitionPriorityButton);
});
els.refreshLogmealQuotaButton?.addEventListener("click", async () => {
  const button = els.refreshLogmealQuotaButton;
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "正在刷新";
  try {
    await loadLogmealQuota({ force: true });
  } finally {
    button.textContent = originalText;
    button.disabled = false;
    button.blur();
  }
});
els.refreshQwenUsageButton?.addEventListener("click", async () => {
  const button = els.refreshQwenUsageButton;
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "正在刷新";
  try {
    await loadQwenUsage();
  } finally {
    button.textContent = originalText;
    button.disabled = false;
    button.blur();
  }
});
els.refreshDeepseekBalanceButton?.addEventListener("click", async () => {
  const button = els.refreshDeepseekBalanceButton;
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "正在刷新";
  try {
    await loadDeepseekBalance({ force: true });
  } finally {
    button.textContent = originalText;
    button.disabled = false;
    button.blur();
  }
});
els.clearRuntimeEventsButton?.addEventListener("click", () => {
  clearRuntimeEvents(els.clearRuntimeEventsButton);
});
els.clearPerformanceEventsButton?.addEventListener("click", () => {
  clearPerformanceEvents(els.clearPerformanceEventsButton);
});
els.sectionTabs.forEach((button) => {
  button.addEventListener("click", () => {
    setAdminSection(button.dataset.adminSection);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-jump-section]");
  if (!button) return;
  event.preventDefault();
  setAdminSection(button.dataset.jumpSection);
  window.scrollTo({ top: 0, behavior: "smooth" });
});
els.accountSearch.addEventListener("input", renderAccounts);
els.accountList.addEventListener("click", (event) => {
  const button = event.target.closest(".account-item");
  if (button) selectAccount(button.dataset.code);
});

els.accountDetail.addEventListener("click", (event) => {
  const button = event.target.closest("[data-admin-passkey-delete]");
  if (button) {
    event.preventDefault();
    event.stopPropagation();
    revokeAdminUserPasskey(button.dataset.adminPasskeyDelete, button);
    return;
  }
  const moderationButton = event.target.closest("[data-account-moderation-action]");
  if (moderationButton) {
    event.preventDefault();
    event.stopPropagation();
    updateAccountModeration(moderationButton.dataset.accountModerationAction, moderationButton);
  }
});

els.moderationQueueList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-moderation-item]");
  if (!button) return;
  event.preventDefault();
  updateModerationItemStatus(button.dataset.moderationItem, button.dataset.moderationStatus, button);
});

els.recordList.addEventListener("click", (event) => {
  const button = event.target.closest(".admin-record-photo");
  if (!button) return;
  els.dialogPhoto.src = button.dataset.photoUrl;
  els.dialogCaption.textContent = button.dataset.caption;
  els.photoDialog.showModal();
});

els.deleteAccountButton.addEventListener("click", () => {
  if (!state.selectedCode) return;
  const confirmCode = accountDisplayCode(currentSelectedAccount() || { code: state.selectedCode });
  els.deleteCode.textContent = confirmCode;
  els.deleteCodeCopyButton.dataset.copyText = confirmCode;
  els.deleteInput.value = "";
  els.deleteMessage.textContent = "";
  els.deleteDialog.showModal();
  els.deleteInput.focus();
});

document.addEventListener("click", (event) => {
  const copyButton = event.target.closest("[data-copy-text]");
  if (!copyButton) return;
  event.preventDefault();
  event.stopPropagation();
  copyTextToClipboard(copyButton.dataset.copyText, copyButton);
});

els.cancelDeleteButton.addEventListener("click", () => els.deleteDialog.close());
els.deleteDialog.addEventListener("click", (event) => {
  if (event.target === els.deleteDialog) els.deleteDialog.close();
});

els.deleteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const code = state.selectedCode;
  const confirmCode = accountDisplayCode(currentSelectedAccount() || { code });
  if (!code) {
    els.deleteDialog.close();
    return;
  }

  if (els.deleteInput.value !== confirmCode && els.deleteInput.value !== code) {
    els.deleteMessage.textContent = "输入的账户ID不一致。";
    return;
  }

  const submitButton = els.deleteForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  els.deleteMessage.textContent = "正在删除账户...";

  try {
    await api(`/accounts/${encodeURIComponent(code)}`, {
      method: "DELETE",
      body: JSON.stringify({ confirmCode: els.deleteInput.value })
    });
    els.deleteDialog.close();
    resetDetail();
    await loadAccounts({ preserveSelection: false });
  } catch (error) {
    els.deleteMessage.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});

els.closePhotoDialog.addEventListener("click", () => els.photoDialog.close());
els.photoDialog.addEventListener("click", (event) => {
  if (event.target === els.photoDialog) els.photoDialog.close();
});

document.addEventListener("touchstart", handleAdminPullStart, { passive: true });
document.addEventListener("touchmove", handleAdminPullMove, { passive: false });
document.addEventListener("touchend", handleAdminPullEnd, { passive: true });
document.addEventListener("touchcancel", resetAdminPullRefresh, { passive: true });

(async function init() {
  try {
    const data = await api("/me");
    state.adminSession = data.session;
	    renderSecurity();
	    showShell();
	    await loadSecurity();
	    await loadAccounts({ preserveSelection: false });
	    await loadModerationQueue();
	    await loadServerStatus();
	    await loadRuntimeEvents();
	    await loadPerformanceSummary();
	    await loadApiQuota();
	  } catch {
    showLogin();
    await loadPasskeyStatus();
  }
})();
