const FRAME_INTERVAL_MS = 300;
const JF = window.JFShared;
const REPLAY_SCRIPT_PATH = JF.currentScriptPath("replay.js");
const APP_BASE_PATH = REPLAY_SCRIPT_PATH.replace(/\/replay\.js$/, "");
const REPLAY_PARAMS = new URLSearchParams(window.location.search);
const COMMUNITY_MEMBER_ID = REPLAY_PARAMS.get("community");
const EMBEDDED = REPLAY_PARAMS.get("embedded") === "1";
const DANMAKU_TRACK_COUNT = 6;
const DANMAKU_MAX_PER_TRACK = 1;
const DANMAKU_DISPATCH_MS = 120;
const DANMAKU_DURATION_SECONDS = 4.8;
const DANMAKU_EDGE_GAP_PX = 18;
const DANMAKU_ITEM_GAP_PX = 36;
const DANMAKU_TRACK_TOP_PX = 7;
const DANMAKU_TRACK_GAP_PX = 23;
const API_TIMEOUT_MS = 20000;
const PHOTO_DECODE_TIMEOUT_MS = 15000;
const PHOTO_DECODE_RETRY_DELAYS = [350, 900];
document.documentElement.dataset.environment = APP_BASE_PATH ? "test" : "production";
document.documentElement.dataset.embedded = EMBEDDED ? "true" : "false";

function appUrl(pathname) {
  return JF.appUrl(APP_BASE_PATH, pathname);
}

function isImageInteractionTarget(target) {
  return JF.isImageInteractionTarget(target);
}

const state = {
  records: [],
  index: 0,
  timer: null,
  playing: false,
  userInteracted: false,
  communityComments: [],
  danmakuQueue: [],
  danmakuTracks: Array.from({ length: DANMAKU_TRACK_COUNT }, () => 0),
  danmakuTrackNextAt: Array.from({ length: DANMAKU_TRACK_COUNT }, () => 0),
  danmakuNextTrack: 0,
  danmakuCommentCursor: 0,
  danmakuMixFlip: false,
  danmakuDispatchTimer: null,
  objectUrls: []
};

const els = {
  loading: document.querySelector("#replayLoading"),
  content: document.querySelector("#replayContent"),
  empty: document.querySelector("#replayEmpty"),
  emptyMessage: document.querySelector("#emptyMessage"),
  photo: document.querySelector("#replayPhoto"),
  moodDanmakuLayer: document.querySelector("#moodDanmakuLayer"),
  title: document.querySelector("#replayTitle"),
  date: document.querySelector("#replayDate"),
  weight: document.querySelector("#replayWeight"),
  change: document.querySelector("#weightChange"),
  current: document.querySelector("#frameCurrent"),
  total: document.querySelector("#frameTotal"),
  timeline: document.querySelector("#replayTimeline"),
  timelineStart: document.querySelector("#timelineStart"),
  timelineCurrent: document.querySelector("#timelineCurrent"),
  timelineEnd: document.querySelector("#timelineEnd"),
  playbackButton: document.querySelector("#playbackButton"),
  closeButton: document.querySelector("#closeReplayButton"),
  returnButton: document.querySelector("#returnButton")
};

const fullDateFormat = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
});

const shortDateFormat = new Intl.DateTimeFormat("zh-CN", {
  month: "numeric",
  day: "numeric"
});

const compactDateTimeFormat = new Intl.DateTimeFormat("zh-CN", {
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});

async function api(path) {
  return JF.fetchJson(appUrl(path), {
    timeoutMs: API_TIMEOUT_MS,
    errorMessage: "记录载入失败。"
  });
}

function formatWeight(weight) {
  if (!Number.isFinite(weight)) return "-";
  return EMBEDDED ? `${weight.toFixed(2)}kg` : `${weight.toFixed(2)} kg`;
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function decodePhotoOnce(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    let settled = false;
    const timeout = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      image.onload = null;
      image.onerror = null;
      reject(new Error("照片下载超时。"));
    }, PHOTO_DECODE_TIMEOUT_MS);

    function finish(error = null) {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      if (error) reject(error);
      else resolve();
    }

    image.decoding = "async";
    image.onload = async () => {
      if (typeof image.decode === "function") {
        try {
          await image.decode();
        } catch {
          // Some mobile WebViews report decode races after a successful load.
        }
      }
      finish();
    };
    image.onerror = () => finish(new Error("照片解码失败。"));
    image.src = url;
  });
}

async function decodePhoto(url) {
  let lastError = null;
  for (let attempt = 0; attempt <= PHOTO_DECODE_RETRY_DELAYS.length; attempt += 1) {
    try {
      await decodePhotoOnce(url);
      return;
    } catch (error) {
      lastError = error;
      const delay = PHOTO_DECODE_RETRY_DELAYS[attempt];
      if (delay) {
        await wait(delay);
      }
    }
  }
  throw lastError || new Error("照片解码失败。");
}

async function preparePhotoSources(records) {
  let nextIndex = 0;
  let completed = 0;
  let failed = 0;
  els.loading.textContent = `正在下载 0/${records.length}`;

  async function worker() {
    while (nextIndex < records.length) {
      const index = nextIndex;
      nextIndex += 1;
      const record = records[index];
      try {
        await decodePhoto(record.photoUrl);
        record.preloadedPhotoUrl = record.photoUrl;
      } catch (error) {
        failed += 1;
        record.preloadError = error.message || `第 ${index + 1} 张照片载入失败。`;
      }
      completed += 1;
      els.loading.textContent = failed
        ? `正在下载 ${completed}/${records.length}，已跳过 ${failed} 张`
        : `正在下载 ${completed}/${records.length}`;
    }
  }

  const workers = Array.from({ length: Math.min(3, records.length) }, () => worker());
  await Promise.all(workers);
  const loadedRecords = records.filter((record) => record.preloadedPhotoUrl);
  if (!loadedRecords.length) {
    throw new Error("照片下载失败，请稍后重试。");
  }
  return loadedRecords;
}

function releasePhotoSources() {
  for (const objectUrl of state.objectUrls) {
    URL.revokeObjectURL(objectUrl);
  }
  state.objectUrls = [];
}

function stopPlayback(completed = false) {
  if (state.timer) {
    window.clearInterval(state.timer);
    state.timer = null;
  }
  state.playing = false;
  els.playbackButton.textContent = completed ? "重新播放" : "继续播放";
}

function updateTimelineProgress() {
  const max = Math.max(1, state.records.length - 1);
  const progress = (state.index / max) * 100;
  els.timeline.style.setProperty("--progress", `${progress}%`);
}

function clearMoodDanmaku() {
  els.moodDanmakuLayer.replaceChildren();
  state.danmakuQueue = [];
  state.danmakuTracks = Array.from({ length: DANMAKU_TRACK_COUNT }, () => 0);
  state.danmakuTrackNextAt = Array.from({ length: DANMAKU_TRACK_COUNT }, () => 0);
  state.danmakuNextTrack = 0;
  state.danmakuCommentCursor = 0;
  state.danmakuMixFlip = false;
  if (state.danmakuDispatchTimer) {
    window.clearInterval(state.danmakuDispatchTimer);
    state.danmakuDispatchTimer = null;
  }
}

function createMoodDanmakuMessage(item, track) {
  const type = item?.type === "comment" ? "comment" : "owner";
  const message = document.createElement("span");
  message.className = `mood-danmaku is-${type} is-measuring`;
  message.textContent = item?.text || "";
  message.style.setProperty("--danmaku-top", `${DANMAKU_TRACK_TOP_PX + track * DANMAKU_TRACK_GAP_PX}px`);
  return message;
}

function nextAvailableDanmakuTrack(now = performance.now()) {
  for (let offset = 0; offset < DANMAKU_TRACK_COUNT; offset += 1) {
    const track = (state.danmakuNextTrack + offset) % DANMAKU_TRACK_COUNT;
    if (state.danmakuTracks[track] < DANMAKU_MAX_PER_TRACK && state.danmakuTrackNextAt[track] <= now) {
      return track;
    }
  }
  return -1;
}

function prepareDanmakuMotion(message, track) {
  const layerWidth = Math.max(1, Math.round(els.moodDanmakuLayer.getBoundingClientRect().width));
  const messageWidth = Math.max(1, Math.ceil(message.getBoundingClientRect().width));
  const travelDistance = layerWidth + messageWidth + DANMAKU_EDGE_GAP_PX * 2;
  const visibleSpeed = travelDistance / DANMAKU_DURATION_SECONDS;
  const nextGap = ((messageWidth + DANMAKU_ITEM_GAP_PX) / visibleSpeed) * 1000;

  message.style.setProperty("--danmaku-start", `${layerWidth + DANMAKU_EDGE_GAP_PX}px`);
  message.style.setProperty("--danmaku-end", `${-messageWidth - DANMAKU_EDGE_GAP_PX}px`);
  message.style.setProperty("--danmaku-duration", `${DANMAKU_DURATION_SECONDS}s`);
  state.danmakuTrackNextAt[track] = performance.now() + Math.max(420, nextGap);

  window.requestAnimationFrame(() => {
    message.classList.remove("is-measuring");
  });
}

function stopMoodDanmakuDispatcherIfIdle() {
  const hasActiveMessages = state.danmakuTracks.some((count) => count > 0);
  if (!state.danmakuQueue.length && !hasActiveMessages && state.danmakuDispatchTimer) {
    window.clearInterval(state.danmakuDispatchTimer);
    state.danmakuDispatchTimer = null;
  }
}

function dispatchMoodDanmaku() {
  if (!state.danmakuQueue.length) {
    stopMoodDanmakuDispatcherIfIdle();
    return;
  }

  const track = nextAvailableDanmakuTrack();
  if (track < 0) return;

  const item = state.danmakuQueue.shift();
  const message = createMoodDanmakuMessage(item, track);
  state.danmakuTracks[track] += 1;
  state.danmakuNextTrack = (track + 1) % DANMAKU_TRACK_COUNT;
  message.addEventListener("animationend", () => {
    message.remove();
    state.danmakuTracks[track] = Math.max(0, state.danmakuTracks[track] - 1);
    if (state.danmakuQueue.length) {
      window.setTimeout(dispatchMoodDanmaku, 80);
    } else {
      stopMoodDanmakuDispatcherIfIdle();
    }
  }, { once: true });
  els.moodDanmakuLayer.append(message);
  prepareDanmakuMotion(message, track);
}

function startMoodDanmakuDispatcher() {
  if (!state.danmakuDispatchTimer) {
    state.danmakuDispatchTimer = window.setInterval(dispatchMoodDanmaku, DANMAKU_DISPATCH_MS);
  }
  dispatchMoodDanmaku();
}

function formatCommunityCommentDanmaku(comment) {
  const alias = typeof comment.alias === "string" && comment.alias.trim()
    ? comment.alias.trim()
    : "QQ用户";
  const text = typeof comment.text === "string" ? comment.text.trim() : "";
  return text ? `${alias}: ${text}` : "";
}

function nextCommunityCommentDanmakuItems(limit) {
  if (!COMMUNITY_MEMBER_ID || limit <= 0 || !state.communityComments.length) {
    return [];
  }

  const items = [];
  while (items.length < limit && state.danmakuCommentCursor < state.communityComments.length) {
    const text = formatCommunityCommentDanmaku(state.communityComments[state.danmakuCommentCursor]);
    state.danmakuCommentCursor += 1;
    if (text) items.push({ type: "comment", text });
  }
  return items;
}

function frameDanmakuItems(record, append) {
  const mood = typeof record.mood === "string" ? record.mood.trim() : "";
  const ownerItem = mood ? { type: "owner", text: mood } : null;
  const remainingComments = Math.max(0, state.communityComments.length - state.danmakuCommentCursor);
  const remainingFrames = Math.max(1, state.records.length - state.index);
  const distributedCommentLimit = Math.ceil(remainingComments / remainingFrames);
  const commentLimit = Math.min(ownerItem ? 2 : 3, Math.max(ownerItem ? 1 : 2, distributedCommentLimit));
  const commentItems = nextCommunityCommentDanmakuItems(commentLimit);

  if (ownerItem && commentItems.length) {
    const mixed = state.danmakuMixFlip
      ? [commentItems[0], ownerItem, ...commentItems.slice(1)]
      : [ownerItem, commentItems[0], ...commentItems.slice(1)];
    state.danmakuMixFlip = !state.danmakuMixFlip;
    return mixed;
  }

  return ownerItem ? [ownerItem] : commentItems;
}

function showMoodDanmaku(record, append = false) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    append = false;
  }
  if (!append) {
    clearMoodDanmaku();
  }
  const items = frameDanmakuItems(record, append);
  if (!items.length) {
    return;
  }

  if (reducedMotion) {
    for (const [index, item] of items.slice(0, DANMAKU_TRACK_COUNT).entries()) {
      const message = createMoodDanmakuMessage(item, index);
      message.classList.remove("is-measuring");
      els.moodDanmakuLayer.append(message);
    }
    return;
  }

  state.danmakuQueue.push(...items);
  startMoodDanmakuDispatcher();
}

function enqueueRemainingCommunityComments() {
  const remaining = Math.max(0, state.communityComments.length - state.danmakuCommentCursor);
  if (!remaining) return;
  const items = nextCommunityCommentDanmakuItems(Math.min(remaining, 24));
  if (!items.length) return;
  state.danmakuQueue.push(...items);
  startMoodDanmakuDispatcher();
}

function renderFrame(index, appendMood = false) {
  state.index = Math.max(0, Math.min(index, state.records.length - 1));
  const record = state.records[state.index];
  const firstWeight = state.records.find((item) => Number.isFinite(item.weight))?.weight;
  const weightChange = Number.isFinite(record.weight) && Number.isFinite(firstWeight)
    ? Math.round((record.weight - firstWeight) * 100) / 100
    : null;

  els.photo.src = record.preloadedPhotoUrl || record.photoUrl;
  els.date.dateTime = record.timestamp;
  els.date.textContent = EMBEDDED
    ? compactDateTimeFormat.format(new Date(record.timestamp))
    : fullDateFormat.format(new Date(record.timestamp));
  els.date.title = fullDateFormat.format(new Date(record.timestamp));
  els.weight.textContent = formatWeight(record.weight);
  els.current.textContent = String(state.index + 1);
  els.timeline.value = String(state.index);
  els.timelineCurrent.textContent = shortDateFormat.format(new Date(record.timestamp));
  showMoodDanmaku(record, appendMood);

  els.change.className = "weight-change";
  if (weightChange === null || weightChange === 0) {
    const changeText = weightChange === 0 ? "起始体重" : "暂无体重";
    els.change.textContent = EMBEDDED ? (weightChange === 0 ? "起始" : "暂无") : changeText;
    els.change.title = changeText;
  } else if (weightChange < 0) {
    els.change.classList.add("loss");
    const changeText = `较首次 ${weightChange.toFixed(2)} kg`;
    els.change.textContent = EMBEDDED ? `${weightChange.toFixed(2)}kg` : changeText;
    els.change.title = changeText;
  } else {
    els.change.classList.add("gain");
    const changeText = `较首次 +${weightChange.toFixed(2)} kg`;
    els.change.textContent = EMBEDDED ? `+${weightChange.toFixed(2)}kg` : changeText;
    els.change.title = changeText;
  }

  updateTimelineProgress();
}

function startPlayback() {
  if (state.records.length < 2) {
    enqueueRemainingCommunityComments();
    els.playbackButton.disabled = true;
    els.playbackButton.textContent = "仅一张照片";
    return;
  }

  if (state.index >= state.records.length - 1) {
    clearMoodDanmaku();
    renderFrame(0);
  }

  if (state.timer) window.clearInterval(state.timer);
  state.playing = true;
  els.playbackButton.textContent = "暂停";
  state.timer = window.setInterval(() => {
    const nextIndex = state.index + 1;
    if (nextIndex >= state.records.length) {
      enqueueRemainingCommunityComments();
      stopPlayback(true);
      return;
    }
    renderFrame(nextIndex, true);
  }, FRAME_INTERVAL_MS);
}

function togglePlayback() {
  state.userInteracted = true;
  if (state.playing) {
    stopPlayback(false);
  } else {
    startPlayback();
  }
}

async function prepareAutoPlayback() {
  if (state.records.length < 2) {
    startPlayback();
    return;
  }

  if (state.userInteracted) {
    els.playbackButton.textContent = "开始播放";
  } else {
    startPlayback();
  }
}

function closeReplay() {
  if (EMBEDDED && window.parent !== window) {
    window.parent.postMessage({ type: "close-replay-modal" }, window.location.origin);
    return;
  }
  window.close();
  window.setTimeout(() => {
    window.location.href = COMMUNITY_MEMBER_ID ? appUrl("/?tab=community") : appUrl("/");
  }, 50);
}

async function init() {
  try {
    let recordData;
    if (COMMUNITY_MEMBER_ID) {
      recordData = await api(`/api/community/members/${encodeURIComponent(COMMUNITY_MEMBER_ID)}/records`);
      document.title = `${recordData.member.alias} · 社区回放`;
      els.title.textContent = `${recordData.member.alias} 的变化`;
    } else {
      const [profileData, ownRecordData] = await Promise.all([api("/api/me"), api("/api/records")]);
      document.title = `${profileData.profile.label} · 变化回放`;
      recordData = ownRecordData;
    }
    const photoRecords = recordData.records
      .filter((record) => record.photoUrl)
      .sort((left, right) => new Date(left.timestamp) - new Date(right.timestamp));
    state.communityComments = Array.isArray(recordData.comments) ? recordData.comments : [];

    if (!photoRecords.length) {
      els.loading.classList.add("hidden");
      els.empty.classList.remove("hidden");
      return;
    }

    state.records = await preparePhotoSources(photoRecords);
    els.total.textContent = String(state.records.length);
    els.timeline.max = String(state.records.length - 1);
    els.timelineStart.textContent = shortDateFormat.format(new Date(state.records[0].timestamp));
    els.timelineEnd.textContent = shortDateFormat.format(new Date(state.records.at(-1).timestamp));
    renderFrame(0);
    els.loading.classList.add("hidden");
    els.content.classList.remove("hidden");
    void prepareAutoPlayback();
  } catch (error) {
    releasePhotoSources();
    els.loading.classList.add("hidden");
    els.emptyMessage.textContent = error.status === 401 ? "登录已失效，请返回首页重新登录。" : error.message;
    els.returnButton.textContent = "返回首页";
    els.empty.classList.remove("hidden");
  }
}

els.timeline.addEventListener("input", () => {
  state.userInteracted = true;
  if (state.playing) {
    stopPlayback(false);
  } else if (state.records.length > 1) {
    els.playbackButton.textContent = "继续播放";
  }
  renderFrame(Number(els.timeline.value));
});
els.playbackButton.addEventListener("click", togglePlayback);
els.closeButton.addEventListener("click", closeReplay);
els.returnButton.addEventListener("click", closeReplay);
document.addEventListener("dragstart", (event) => {
  if (isImageInteractionTarget(event.target)) event.preventDefault();
}, true);
document.addEventListener("contextmenu", (event) => {
  if (isImageInteractionTarget(event.target)) event.preventDefault();
}, true);
window.addEventListener("beforeunload", () => {
  stopPlayback(false);
  releasePhotoSources();
});

init();
