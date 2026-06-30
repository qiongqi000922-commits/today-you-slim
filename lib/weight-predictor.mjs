import crypto from "node:crypto";

const MODEL_VERSION = "2026-06-27.weight-predictor.v1";
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_INPUT_DAYS = 90;
const DEFAULT_HEIGHT_CM = 170;

export const WEIGHT_PREDICTION_MODEL_VERSION = MODEL_VERSION;

const datePartsFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function round(value, decimals = 2) {
  if (!Number.isFinite(value)) return null;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function numberOrNull(value, min = -Infinity, max = Infinity) {
  const number = Number(value);
  return Number.isFinite(number) && number >= min && number <= max ? number : null;
}

function textOrEmpty(value, max = 80) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
}

function isoOrNull(value) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

function dayKeyFromTime(value) {
  const time = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(time.getTime())) return null;
  const parts = Object.fromEntries(datePartsFormatter.formatToParts(time).map((part) => [part.type, part.value]));
  if (!parts.year || !parts.month || !parts.day) return null;
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function dateFromDayKey(dayKey) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dayKey))) return null;
  return new Date(`${dayKey}T00:00:00+08:00`);
}

function addDays(dayKey, days) {
  const date = dateFromDayKey(dayKey);
  if (!date) return null;
  date.setUTCDate(date.getUTCDate() + days);
  return dayKeyFromTime(date);
}

function daysBetween(left, right) {
  const leftDate = dateFromDayKey(left);
  const rightDate = dateFromDayKey(right);
  if (!leftDate || !rightDate) return 0;
  return Math.round((rightDate.getTime() - leftDate.getTime()) / DAY_MS);
}

function stableHash(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 24);
}

function normalizeGender(value) {
  const text = String(value || "").trim().toLowerCase();
  if (["male", "m", "男", "man"].includes(text)) return "male";
  if (["female", "f", "女", "woman"].includes(text)) return "female";
  return "";
}

function ageFromBirthday(birthday, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(birthday || ""))) return null;
  const birth = new Date(`${birthday}T00:00:00+08:00`);
  if (!Number.isFinite(birth.getTime())) return null;
  let age = now.getFullYear() - birth.getFullYear();
  const monthDelta = now.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age >= 8 && age <= 100 ? age : null;
}

function ensureDay(map, date) {
  if (!map.has(date)) {
    map.set(date, {
      date,
      weights: [],
      bodyCount: 0,
      foodCount: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      hasMacros: false,
      foodGrams: 0,
      heartRateAvg: null,
      heartRateMin: null,
      heartRateMax: null,
      heartRateSamples: 0,
      steps: null,
      activeEnergyKcal: null,
      exerciseMinutes: null
    });
  }
  return map.get(date);
}

function aggregateFoodRecord(day, record) {
  const foods = Array.isArray(record.foods) ? record.foods : [];
  for (const food of foods) {
    const calorie = numberOrNull(food.calorie, 0, 20000);
    const grams = numberOrNull(food.grams, 0, 10000);
    const nutrition = food.nutrition && typeof food.nutrition === "object" ? food.nutrition : {};
    const protein = numberOrNull(nutrition.protein ?? food.protein, 0, 500);
    const carbs = numberOrNull(nutrition.carbs ?? food.carbs, 0, 1000);
    const fat = numberOrNull(nutrition.fat ?? food.fat, 0, 500);
    if (calorie !== null) day.calories += calorie;
    if (grams !== null) day.foodGrams += grams;
    if (protein !== null) {
      day.protein += protein;
      day.hasMacros = true;
    }
    if (carbs !== null) {
      day.carbs += carbs;
      day.hasMacros = true;
    }
    if (fat !== null) {
      day.fat += fat;
      day.hasMacros = true;
    }
  }
}

function compactNativeWorkout(item) {
  const startAt = isoOrNull(item?.startAt ?? item?.start);
  const endAt = isoOrNull(item?.endAt ?? item?.end);
  if (!startAt || !endAt) return null;
  return {
    id: textOrEmpty(item?.id, 96) || stableHash(["workout", startAt, endAt, item?.activityType, item?.sourceName]),
    activityType: numberOrNull(item?.activityType, 0, 100000),
    activityName: textOrEmpty(item?.activityName || item?.name || item?.type, 40) || "健身",
    startAt,
    endAt,
    durationMinutes: numberOrNull(item?.durationMinutes, 0, 1440),
    activeEnergyKcal: numberOrNull(item?.activeEnergyKcal ?? item?.energyKcal, 0, 10000),
    distanceKm: numberOrNull(item?.distanceKm, 0, 500),
    sourceName: textOrEmpty(item?.sourceName, 60)
  };
}

function compactNativeSleep(item) {
  const startAt = isoOrNull(item?.startAt ?? item?.start);
  const endAt = isoOrNull(item?.endAt ?? item?.end);
  if (!startAt || !endAt) return null;
  return {
    id: textOrEmpty(item?.id, 96) || stableHash(["sleep", startAt, endAt, item?.sourceName]),
    startAt,
    endAt,
    asleepMinutes: numberOrNull(item?.asleepMinutes ?? item?.sleepMinutes, 0, 1440),
    inBedMinutes: numberOrNull(item?.inBedMinutes, 0, 1440),
    sourceName: textOrEmpty(item?.sourceName, 60)
  };
}

function compactHealthDay(day) {
  const date = String(day?.date || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const weight = day.weight && typeof day.weight === "object" ? day.weight : {};
  const heart = day.heartRate && typeof day.heartRate === "object" ? day.heartRate : {};
  const activity = day.activity && typeof day.activity === "object" ? day.activity : {};
  const rawWorkouts = Array.isArray(day.workouts) ? day.workouts : [];
  const rawSleep = Array.isArray(day.sleep) ? day.sleep : Array.isArray(day.sleeps) ? day.sleeps : [];
  const compact = {
    date,
    weightKg: numberOrNull(weight.latest ?? day.weightKg, 20, 500),
    heartRateAvgBpm: numberOrNull(heart.avg ?? day.heartRateAvgBpm, 20, 240),
    heartRateMinBpm: numberOrNull(heart.min ?? day.heartRateMinBpm, 20, 240),
    heartRateMaxBpm: numberOrNull(heart.max ?? day.heartRateMaxBpm, 20, 240),
    heartRateLatestBpm: numberOrNull(heart.latest ?? day.heartRateLatestBpm, 20, 240),
    heartRateSamples: numberOrNull(heart.samples ?? day.heartRateSamples, 0, 200000),
    steps: numberOrNull(activity.steps ?? day.steps, 0, 200000),
    activeEnergyKcal: numberOrNull(activity.activeEnergyKcal ?? day.activeEnergyKcal, 0, 10000),
    exerciseMinutes: numberOrNull(activity.exerciseMinutes ?? day.exerciseMinutes, 0, 1440),
    workouts: rawWorkouts.map(compactNativeWorkout).filter(Boolean).slice(0, 80),
    sleep: rawSleep.map(compactNativeSleep).filter(Boolean).slice(0, 40)
  };
  return compact;
}

function flattenNativeHealthItems(days, field) {
  return days
    .flatMap((day) => (Array.isArray(day[field]) ? day[field] : []).map((item) => ({ ...item, date: day.date })))
    .sort((left, right) => String(left.startAt || left.endAt).localeCompare(String(right.startAt || right.endAt)));
}

export function compactNativeHealthSnapshot(snapshot, { maxDays = 30 } = {}) {
  const rawDays = Array.isArray(snapshot?.recent)
    ? snapshot.recent
    : Array.isArray(snapshot?.days)
      ? snapshot.days
      : Array.isArray(snapshot?.snapshot?.recent)
        ? snapshot.snapshot.recent
        : [];
  const days = rawDays
    .map(compactHealthDay)
    .filter(Boolean)
    .sort((left, right) => left.date.localeCompare(right.date))
    .slice(-Math.max(1, Math.min(120, Math.round(Number(maxDays) || 30))));
  const workouts = flattenNativeHealthItems(days, "workouts");
  const sleep = flattenNativeHealthItems(days, "sleep");
  return {
    version: MODEL_VERSION,
    source: "ios_health",
    updatedAt: new Date().toISOString(),
    range: {
      start: days[0]?.date || null,
      end: days.at(-1)?.date || null,
      days: days.length
    },
    days,
    workouts,
    sleep
  };
}

export function sanitizeNativeHealthStore(value) {
  const users = {};
  const source = value && typeof value === "object" && value.users && typeof value.users === "object"
    ? value.users
    : {};
  for (const [code, entry] of Object.entries(source)) {
    if (!/^[A-Za-z0-9_-]{6,32}$/.test(code)) continue;
    const days = Array.isArray(entry?.days)
      ? entry.days.map(compactHealthDay).filter(Boolean).sort((a, b) => a.date.localeCompare(b.date)).slice(-30)
      : [];
    const workouts = flattenNativeHealthItems(days, "workouts");
    const sleep = flattenNativeHealthItems(days, "sleep");
    users[code] = {
      version: String(entry?.version || MODEL_VERSION),
      source: String(entry?.source || "ios_health").slice(0, 32),
      updatedAt: Number.isFinite(Date.parse(entry?.updatedAt)) ? new Date(entry.updatedAt).toISOString() : new Date().toISOString(),
      range: {
        start: days[0]?.date || null,
        end: days.at(-1)?.date || null,
        days: days.length
      },
      days,
      workouts,
      sleep
    };
  }
  return { users };
}

export function sanitizeWeightPredictionStore(value) {
  const users = {};
  const source = value && typeof value === "object" && value.users && typeof value.users === "object"
    ? value.users
    : {};
  for (const [code, entry] of Object.entries(source)) {
    if (!/^[A-Za-z0-9_-]{6,32}$/.test(code) || !entry || typeof entry !== "object") continue;
    const tomorrow = entry.tomorrow && typeof entry.tomorrow === "object" ? entry.tomorrow : null;
    users[code] = {
      version: String(entry.version || MODEL_VERSION),
      userCode: code,
      status: ["queued", "updating", "ready", "insufficient", "error"].includes(entry.status) ? entry.status : "insufficient",
      updatedAt: Number.isFinite(Date.parse(entry.updatedAt)) ? new Date(entry.updatedAt).toISOString() : new Date().toISOString(),
      queuedAt: Number.isFinite(Date.parse(entry.queuedAt)) ? new Date(entry.queuedAt).toISOString() : null,
      reason: String(entry.reason || "").slice(0, 80),
      sourceHash: String(entry.sourceHash || "").slice(0, 80),
      dataWindow: entry.dataWindow && typeof entry.dataWindow === "object" ? entry.dataWindow : {},
      state: entry.state && typeof entry.state === "object" ? entry.state : {},
      tomorrow: tomorrow ? {
        date: String(tomorrow.date || ""),
        lower: numberOrNull(tomorrow.lower, 20, 500),
        upper: numberOrNull(tomorrow.upper, 20, 500),
        expected: numberOrNull(tomorrow.expected, 20, 500),
        confidence: numberOrNull(tomorrow.confidence, 0, 1),
        width: numberOrNull(tomorrow.width, 0, 20),
        status: String(tomorrow.status || "ready")
      } : null,
      diagnostics: entry.diagnostics && typeof entry.diagnostics === "object" ? entry.diagnostics : {}
    };
  }
  return { users };
}

export function buildWeightPredictionInput({
  code,
  records = [],
  profile = {},
  health = null,
  now = new Date()
} = {}) {
  const nowDate = now instanceof Date ? now : new Date(now);
  const today = dayKeyFromTime(nowDate) || dayKeyFromTime(new Date());
  const minDate = addDays(today, -MAX_INPUT_DAYS + 1);
  const daily = new Map();

  for (const record of Array.isArray(records) ? records : []) {
    const date = dayKeyFromTime(record.timestamp);
    if (!date || (minDate && date < minDate)) continue;
    const day = ensureDay(daily, date);
    if (record?.type === "food") {
      day.foodCount += 1;
      aggregateFoodRecord(day, record);
      continue;
    }
    const weight = numberOrNull(record?.weight, 20, 500);
    if (weight !== null) {
      day.weights.push({ value: weight, source: "record" });
      day.bodyCount += 1;
    }
  }

  const healthDays = Array.isArray(health?.days) ? health.days : [];
  for (const healthDay of healthDays) {
    const date = String(healthDay?.date || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || (minDate && date < minDate)) continue;
    const day = ensureDay(daily, date);
    if (healthDay.weightKg !== null && healthDay.weightKg !== undefined) {
      const weight = numberOrNull(healthDay.weightKg, 20, 500);
      if (weight !== null) day.weights.push({ value: weight, source: "health" });
    }
    day.heartRateAvg = numberOrNull(healthDay.heartRateAvgBpm, 20, 240);
    day.heartRateMin = numberOrNull(healthDay.heartRateMinBpm, 20, 240);
    day.heartRateMax = numberOrNull(healthDay.heartRateMaxBpm, 20, 240);
    day.heartRateSamples = numberOrNull(healthDay.heartRateSamples, 0, 200000) || 0;
    day.steps = numberOrNull(healthDay.steps, 0, 200000);
    day.activeEnergyKcal = numberOrNull(healthDay.activeEnergyKcal, 0, 10000);
    day.exerciseMinutes = numberOrNull(healthDay.exerciseMinutes, 0, 1440);
  }

  const days = [...daily.values()].sort((left, right) => left.date.localeCompare(right.date)).map((day) => {
    const weights = day.weights.map((item) => item.value);
    return {
      ...day,
      weightMin: weights.length ? Math.min(...weights) : null,
      weightMax: weights.length ? Math.max(...weights) : null,
      weightLatest: weights.length ? weights.at(-1) : null,
      hasHealthWeight: day.weights.some((item) => item.source === "health")
    };
  });

  const demographics = profile?.demographics && typeof profile.demographics === "object"
    ? profile.demographics
    : profile;
  const gender = normalizeGender(demographics.gender);
  const age = numberOrNull(demographics.age, 8, 100) || ageFromBirthday(demographics.birthday, nowDate) || 30;
  const heightCm = numberOrNull(demographics.heightCm ?? demographics.height, 120, 230) || (gender === "female" ? 165 : DEFAULT_HEIGHT_CM);

  return {
    version: MODEL_VERSION,
    userCode: String(code || ""),
    generatedAt: nowDate.toISOString(),
    today,
    profile: { gender, age, heightCm },
    days
  };
}

function mean(values) {
  const clean = values.filter(Number.isFinite);
  return clean.length ? clean.reduce((sum, value) => sum + value, 0) / clean.length : null;
}

function std(values) {
  const avg = mean(values);
  if (avg === null || values.length < 2) return null;
  return Math.sqrt(values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / (values.length - 1));
}

function estimateBmr({ gender, age, heightCm }, weightKg) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === "male") return base + 5;
  if (gender === "female") return base - 161;
  return base - 78;
}

function activityFactorFromSteps(avgSteps) {
  if (!Number.isFinite(avgSteps)) return 1.32;
  if (avgSteps >= 10000) return 1.55;
  if (avgSteps >= 7000) return 1.45;
  if (avgSteps >= 4000) return 1.35;
  return 1.25;
}

function ema(values, alpha = 0.25) {
  if (!values.length) return null;
  let current = values[0];
  for (let index = 1; index < values.length; index += 1) {
    current = alpha * values[index] + (1 - alpha) * current;
  }
  return current;
}

export function computeWeightPrediction(input, previousState = {}) {
  const days = Array.isArray(input?.days) ? input.days : [];
  const weightDays = days.filter((day) => Number.isFinite(day.weightLatest));
  const foodDays = days.filter((day) => day.calories > 0);
  const macroDays = foodDays.filter((day) => day.hasMacros);
  const heartDays = days.filter((day) => Number.isFinite(day.heartRateAvg) || day.heartRateSamples > 0);
  const activityDays = days.filter((day) => Number.isFinite(day.steps) || Number.isFinite(day.activeEnergyKcal));
  const lastWeightDay = weightDays.at(-1);
  const latestWeight = lastWeightDay?.weightLatest;
  const tomorrowDate = lastWeightDay?.date ? addDays(lastWeightDay.date, 1) : addDays(input?.today, 1);
  const dataWindow = {
    startDate: days[0]?.date || null,
    endDate: days.at(-1)?.date || null,
    weightDays: weightDays.length,
    bodyRecordDays: days.filter((day) => day.bodyCount > 0).length,
    foodRecordDays: foodDays.length,
    healthDays: days.filter((day) => day.hasHealthWeight || day.heartRateSamples > 0 || Number.isFinite(day.steps)).length
  };
  const sourceHash = stableHash({ days, profile: input.profile });

  if (!Number.isFinite(latestWeight) || weightDays.length < 2 || !tomorrowDate) {
    return {
      version: MODEL_VERSION,
      userCode: input?.userCode || "",
      status: "insufficient",
      updatedAt: new Date().toISOString(),
      reason: "insufficient_weight_data",
      sourceHash,
      dataWindow,
      state: previousState && typeof previousState === "object" ? previousState : {},
      tomorrow: null,
      diagnostics: { message: "至少需要两天体重数据才会生成预测。" }
    };
  }

  const recentWeights = weightDays.map((day) => day.weightLatest);
  const trendWeight = ema(recentWeights, 0.28);
  const residuals = recentWeights.map((value, index) => {
    const partialTrend = ema(recentWeights.slice(0, index + 1), 0.28);
    return value - partialTrend;
  }).slice(-14);
  const weightNoiseStd = clamp(
    0.78 * (Number(previousState.weightNoiseStd) || 0.28) + 0.22 * (std(residuals) || 0.22),
    0.12,
    1.6
  );

  const recentWindow = days.filter((day) => daysBetween(day.date, lastWeightDay.date) >= -6 && day.date <= lastWeightDay.date);
  const avgCalories7d = mean(recentWindow.filter((day) => day.calories > 0).map((day) => day.calories));
  const avgCarbs7d = mean(recentWindow.filter((day) => day.carbs > 0).map((day) => day.carbs));
  const avgFoodGrams7d = mean(recentWindow.filter((day) => day.foodGrams > 0).map((day) => day.foodGrams));
  const avgSteps7d = mean(recentWindow.map((day) => day.steps).filter(Number.isFinite));
  const avgActiveEnergy7d = mean(recentWindow.map((day) => day.activeEnergyKcal).filter(Number.isFinite));

  const bmr = estimateBmr(input.profile || {}, latestWeight);
  const estimatedTdee = Math.max(1100, bmr * activityFactorFromSteps(avgSteps7d) + (avgActiveEnergy7d || 0) * 0.35);
  const caloriesForModel = Number.isFinite(avgCalories7d) ? avgCalories7d : estimatedTdee;
  const calorieDeficit = estimatedTdee - caloriesForModel;

  let userEfficiency = clamp(Number(previousState.userEfficiency) || 0.82, 0.35, 1.25);
  const twoWeekAgo = weightDays.findLast
    ? weightDays.findLast((day) => daysBetween(day.date, lastWeightDay.date) <= -13)
    : [...weightDays].reverse().find((day) => daysBetween(day.date, lastWeightDay.date) <= -13);
  if (twoWeekAgo && foodDays.length >= 7) {
    const calibrationDays = days.filter((day) => day.date >= twoWeekAgo.date && day.date <= lastWeightDay.date);
    const energyDelta = calibrationDays.reduce((sum, day) => {
      if (day.calories <= 0) return sum;
      const dayTdee = estimatedTdee + ((day.steps || 0) - (avgSteps7d || 0)) * 0.025;
      return sum + (dayTdee - day.calories) / 7700;
    }, 0);
    const actualLoss = twoWeekAgo.weightLatest - latestWeight;
    if (Math.abs(energyDelta) >= 0.18) {
      const observed = clamp(actualLoss / energyDelta, 0.35, 1.25);
      userEfficiency = clamp(userEfficiency * 0.82 + observed * 0.18, 0.35, 1.25);
    }
  }

  const yesterday = addDays(lastWeightDay.date, -1);
  const todayFeatures = days.find((day) => day.date === lastWeightDay.date);
  const yesterdayFeatures = days.find((day) => day.date === yesterday);
  const carbDelta = Number.isFinite(todayFeatures?.carbs) && Number.isFinite(avgCarbs7d)
    ? todayFeatures.carbs - avgCarbs7d
    : 0;
  const gramDelta = Number.isFinite(todayFeatures?.foodGrams) && Number.isFinite(avgFoodGrams7d)
    ? todayFeatures.foodGrams - avgFoodGrams7d
    : 0;
  const heartStress = Number.isFinite(todayFeatures?.heartRateAvg) && Number.isFinite(yesterdayFeatures?.heartRateAvg)
    ? todayFeatures.heartRateAvg - yesterdayFeatures.heartRateAvg
    : 0;

  const carbWaterSensitivity = clamp(Number(previousState.carbWaterSensitivity) || 0.0018, 0.0006, 0.005);
  const carbWaterAdjustment = clamp(carbDelta * carbWaterSensitivity, -0.24, 0.34);
  const gutAdjustment = clamp(gramDelta / 2600, -0.24, 0.36);
  const stressAdjustment = clamp(heartStress * 0.012, -0.12, 0.18);
  const energyAdjustment = -(calorieDeficit / 7700) * userEfficiency;
  const driftAdjustment = clamp((latestWeight - trendWeight) * -0.18, -0.18, 0.18);
  const expected = latestWeight + energyAdjustment + carbWaterAdjustment + gutAdjustment + stressAdjustment + driftAdjustment;

  const dataCompleteness = clamp(
    Math.min(1, weightDays.length / 7) * 0.35
    + Math.min(1, foodDays.length / 7) * 0.30
    + Math.min(1, macroDays.length / 7) * 0.10
    + Math.min(1, heartDays.length / 7) * 0.10
    + Math.min(1, activityDays.length / 7) * 0.05,
    0,
    0.9
  );
  const volatility = std(weightDays.slice(-10).map((day) => day.weightLatest)) || weightNoiseStd;
  const missingPenalty = 1 - dataCompleteness;
  const width = clamp(0.22 + weightNoiseStd * 0.62 + volatility * 0.18 + missingPenalty * 0.36, 0.28, 1.35);
  const confidence = clamp(0.34 + dataCompleteness * 0.58 - Math.min(0.22, volatility * 0.08), 0.22, 0.88);

  return {
    version: MODEL_VERSION,
    userCode: input?.userCode || "",
    status: "ready",
    updatedAt: new Date().toISOString(),
    reason: "data_update",
    sourceHash,
    dataWindow,
    state: {
      trendWeight: round(trendWeight, 3),
      userEfficiency: round(userEfficiency, 3),
      weightNoiseStd: round(weightNoiseStd, 3),
      carbWaterSensitivity: round(carbWaterSensitivity, 5),
      samples: weightDays.length,
      updatedAt: new Date().toISOString()
    },
    tomorrow: {
      date: tomorrowDate,
      lower: round(expected - width, 2),
      upper: round(expected + width, 2),
      expected: round(expected, 2),
      confidence: round(confidence, 2),
      width: round(width, 2),
      status: "ready"
    },
    diagnostics: {
      dataCompleteness: round(dataCompleteness, 3),
      estimatedTdee: round(estimatedTdee, 0),
      averageCalories7d: round(avgCalories7d, 0),
      averageSteps7d: round(avgSteps7d, 0),
      calorieDeficit: round(calorieDeficit, 0),
      energyAdjustment: round(energyAdjustment, 3),
      carbWaterAdjustment: round(carbWaterAdjustment, 3),
      gutAdjustment: round(gutAdjustment, 3),
      stressAdjustment: round(stressAdjustment, 3),
      driftAdjustment: round(driftAdjustment, 3)
    }
  };
}

export function publicWeightPrediction(entry) {
  if (!entry || typeof entry !== "object") return null;
  return {
    version: entry.version || MODEL_VERSION,
    status: entry.status || "insufficient",
    updatedAt: entry.updatedAt || null,
    queuedAt: entry.queuedAt || null,
    reason: entry.reason || "",
    dataWindow: entry.dataWindow || {},
    tomorrow: entry.tomorrow ? {
      date: entry.tomorrow.date,
      lowerKg: entry.tomorrow.lower,
      upperKg: entry.tomorrow.upper,
      expectedKg: entry.tomorrow.expected,
      lower: entry.tomorrow.lower,
      upper: entry.tomorrow.upper,
      expected: entry.tomorrow.expected,
      confidence: entry.tomorrow.confidence,
      width: entry.tomorrow.width,
      status: entry.tomorrow.status || "ready"
    } : null
  };
}
