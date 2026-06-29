import { spawnSync } from "node:child_process";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

function nowIso() {
  return new Date().toISOString();
}

function sqlString(value) {
  return `'${String(value ?? "").replace(/'/g, "''")}'`;
}

function sqlNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? String(number) : String(fallback);
}

function sqlNullableNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? String(number) : "NULL";
}

function sqlValue(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return sqlNullableNumber(value);
  if (typeof value === "boolean") return value ? "1" : "0";
  return sqlString(value);
}

function jsonPayload(value) {
  try {
    return JSON.stringify(value ?? null);
  } catch {
    return "null";
  }
}

function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function runSqlite(sqlitePath, dbPath, sql, { readonly = false } = {}) {
  void readonly;
  const args = ["-batch", dbPath];
  const result = spawnSync(sqlitePath, args, {
    input: sql,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    const message = (result.stderr || result.stdout || "sqlite execution failed").trim();
    const error = new Error(message);
    error.statusCode = 500;
    throw error;
  }
  return result.stdout || "";
}

export function sqliteAvailable(sqlitePath = "sqlite3") {
  const result = spawnSync(sqlitePath, ["-version"], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024
  });
  return !result.error && result.status === 0;
}

export async function ensureLocalDatabase({ dbPath, sqlitePath = "sqlite3" }) {
  await fsp.mkdir(path.dirname(dbPath), { recursive: true });
  runSqlite(sqlitePath, dbPath, `
PRAGMA journal_mode=WAL;
PRAGMA synchronous=NORMAL;
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS json_documents (
  key TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  file_path TEXT NOT NULL,
  byte_length INTEGER NOT NULL DEFAULT 0,
  sha256 TEXT NOT NULL,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS accounts (
  code TEXT PRIMARY KEY,
  display_name TEXT,
  provider TEXT,
  record_count INTEGER NOT NULL DEFAULT 0,
  photo_count INTEGER NOT NULL DEFAULT 0,
  latest_record_at TEXT,
  latest_weight REAL,
  privacy_mode TEXT,
  moderation_status TEXT,
  updated_at TEXT NOT NULL,
  payload TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS records (
  code TEXT NOT NULL,
  record_id TEXT NOT NULL,
  type TEXT NOT NULL,
  timestamp TEXT,
  weight REAL,
  mood TEXT,
  photo_count INTEGER NOT NULL DEFAULT 0,
  calorie REAL,
  protein REAL,
  carbs REAL,
  fat REAL,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (code, record_id)
);
CREATE TABLE IF NOT EXISTS operational_events (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL,
  payload TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_records_code_time ON records(code, timestamp);
CREATE INDEX IF NOT EXISTS idx_records_type_time ON records(type, timestamp);
CREATE INDEX IF NOT EXISTS idx_operational_events_level_time ON operational_events(level, created_at);
`);
}

function metaSql(entries, at) {
  return Object.entries(entries || {}).map(([key, value]) => `
INSERT INTO meta (key, value, updated_at)
VALUES (${sqlString(key)}, ${sqlString(String(value ?? ""))}, ${sqlString(at)})
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = excluded.updated_at;
`).join("\n");
}

function datasetSql(datasets, at) {
  return (datasets || []).map((dataset) => {
    const payload = jsonPayload(dataset.value);
    return `
INSERT INTO json_documents (key, category, file_path, byte_length, sha256, payload, updated_at)
VALUES (
  ${sqlString(dataset.key)},
  ${sqlString(dataset.category || "application")},
  ${sqlString(dataset.filePath || "")},
  ${Buffer.byteLength(payload, "utf8")},
  ${sqlString(sha256(payload))},
  ${sqlString(payload)},
  ${sqlString(at)}
)
ON CONFLICT(key) DO UPDATE SET
  category = excluded.category,
  file_path = excluded.file_path,
  byte_length = excluded.byte_length,
  sha256 = excluded.sha256,
  payload = excluded.payload,
  updated_at = excluded.updated_at;
`;
  }).join("\n");
}

function accountSql(accounts, at) {
  return (accounts || []).map((account) => `
INSERT INTO accounts (
  code, display_name, provider, record_count, photo_count, latest_record_at,
  latest_weight, privacy_mode, moderation_status, updated_at, payload
)
VALUES (
  ${sqlString(account.code)},
  ${sqlValue(account.displayName)},
  ${sqlValue(account.provider)},
  ${sqlNumber(account.recordCount)},
  ${sqlNumber(account.photoCount)},
  ${sqlValue(account.latestRecordAt)},
  ${sqlNullableNumber(account.latestWeight)},
  ${sqlValue(account.privacyMode)},
  ${sqlValue(account.moderationStatus)},
  ${sqlString(at)},
  ${sqlString(jsonPayload(account.payload ?? account))}
);
`).join("\n");
}

function recordSql(records, at) {
  return (records || []).map((record) => `
INSERT INTO records (
  code, record_id, type, timestamp, weight, mood, photo_count,
  calorie, protein, carbs, fat, payload, updated_at
)
VALUES (
  ${sqlString(record.code)},
  ${sqlString(record.recordId)},
  ${sqlString(record.type || "body")},
  ${sqlValue(record.timestamp)},
  ${sqlNullableNumber(record.weight)},
  ${sqlValue(record.mood)},
  ${sqlNumber(record.photoCount)},
  ${sqlNullableNumber(record.calorie)},
  ${sqlNullableNumber(record.protein)},
  ${sqlNullableNumber(record.carbs)},
  ${sqlNullableNumber(record.fat)},
  ${sqlString(jsonPayload(record.payload ?? record))},
  ${sqlString(at)}
);
`).join("\n");
}

export async function mirrorApplicationSnapshot({
  dbPath,
  sqlitePath = "sqlite3",
  backupDir,
  datasets = [],
  accounts = [],
  records = [],
  meta = {}
}) {
  const at = nowIso();
  await ensureLocalDatabase({ dbPath, sqlitePath });
  if (backupDir) {
    await fsp.mkdir(backupDir, { recursive: true });
  }
  const snapshotMeta = {
    ...meta,
    lastMirrorAt: at,
    datasetCount: datasets.length,
    accountCount: accounts.length,
    recordCount: records.length
  };
  const eventId = `mirror_${Date.now()}_${crypto.randomBytes(5).toString("hex")}`;
  runSqlite(sqlitePath, dbPath, `
BEGIN IMMEDIATE;
DELETE FROM json_documents;
${datasetSql(datasets, at)}
DELETE FROM accounts;
${accountSql(accounts, at)}
DELETE FROM records;
${recordSql(records, at)}
${metaSql(snapshotMeta, at)}
INSERT INTO operational_events (id, category, level, message, created_at, payload)
VALUES (
  ${sqlString(eventId)},
  'database',
  'info',
  'local mirror refreshed',
  ${sqlString(at)},
  ${sqlString(jsonPayload({ datasetCount: datasets.length, accountCount: accounts.length, recordCount: records.length }))}
);
DELETE FROM operational_events WHERE id NOT IN (
  SELECT id FROM operational_events ORDER BY created_at DESC LIMIT 500
);
COMMIT;
PRAGMA wal_checkpoint(PASSIVE);
`);
  return {
    ok: true,
    at,
    dbPath,
    datasetCount: datasets.length,
    accountCount: accounts.length,
    recordCount: records.length
  };
}

export async function backupLocalDatabase({
  dbPath,
  backupDir,
  sqlitePath = "sqlite3",
  label = "manual",
  maxBackups = 24
}) {
  await ensureLocalDatabase({ dbPath, sqlitePath });
  await fsp.mkdir(backupDir, { recursive: true });
  runSqlite(sqlitePath, dbPath, "PRAGMA wal_checkpoint(FULL);");
  const safeLabel = String(label || "manual").replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 32) || "manual";
  const stamp = nowIso().replace(/[:.]/g, "-");
  const backupPath = path.join(backupDir, `wellecho-${safeLabel}-${stamp}.sqlite3`);
  await fsp.copyFile(dbPath, backupPath);
  const at = nowIso();
  runSqlite(sqlitePath, dbPath, metaSql({
    lastBackupAt: at,
    lastBackupPath: backupPath
  }, at));

  const backups = await listDatabaseBackups(backupDir);
  const stale = backups.slice(maxBackups);
  await Promise.all(stale.map((item) => fsp.rm(item.path, { force: true }).catch(() => {})));
  return {
    ok: true,
    at,
    backupPath,
    sizeBytes: (await fsp.stat(backupPath)).size,
    backupCount: Math.min(backups.length, maxBackups)
  };
}

async function listDatabaseBackups(backupDir) {
  try {
    const entries = await fsp.readdir(backupDir, { withFileTypes: true });
    const files = await Promise.all(entries
      .filter((entry) => entry.isFile() && /^wellecho-.+\.sqlite3$/.test(entry.name))
      .map(async (entry) => {
        const fullPath = path.join(backupDir, entry.name);
        const stats = await fsp.stat(fullPath);
        return {
          name: entry.name,
          path: fullPath,
          sizeBytes: stats.size,
          modifiedAt: stats.mtime.toISOString()
        };
      }));
    return files.sort((left, right) => Date.parse(right.modifiedAt) - Date.parse(left.modifiedAt));
  } catch {
    return [];
  }
}

function parseKeyValueRows(output) {
  return String(output || "").trim().split(/\r?\n/g).filter(Boolean).reduce((map, line) => {
    const [key, ...rest] = line.split("\t");
    map[key] = rest.join("\t");
    return map;
  }, {});
}

function queryScalarMap(sqlitePath, dbPath, sql) {
  const output = runSqlite(sqlitePath, dbPath, `.mode tabs\n${sql}`, { readonly: true });
  return parseKeyValueRows(output);
}

export async function localDatabaseStatus({ dbPath, backupDir, sqlitePath = "sqlite3" }) {
  const available = sqliteAvailable(sqlitePath);
  const exists = Boolean(dbPath && fs.existsSync(dbPath));
  const backups = backupDir ? await listDatabaseBackups(backupDir) : [];
  const status = {
    ok: available,
    enabled: true,
    available,
    sqlitePath,
    dbPath,
    backupDir,
    exists,
    sizeBytes: exists ? fs.statSync(dbPath).size : 0,
    updatedAt: nowIso(),
    tables: {},
    lastMirrorAt: null,
    lastBackupAt: null,
    backupCount: backups.length,
    latestBackup: backups[0] || null,
    backups: backups.slice(0, 12),
    message: available ? "SQLite is available." : "sqlite3 command is not available."
  };
  if (!available || !exists) {
    return status;
  }

  try {
    status.tables = Object.fromEntries(Object.entries(queryScalarMap(sqlitePath, dbPath, `
SELECT 'json_documents', COUNT(*) FROM json_documents;
SELECT 'accounts', COUNT(*) FROM accounts;
SELECT 'records', COUNT(*) FROM records;
SELECT 'operational_events', COUNT(*) FROM operational_events;
`)).map(([key, value]) => [key, Number(value) || 0]));
  } catch (error) {
    status.ok = false;
    status.message = error.message;
  }

  try {
    const meta = queryScalarMap(sqlitePath, dbPath, `
SELECT key, value FROM meta WHERE key IN ('lastMirrorAt', 'lastBackupAt', 'lastBackupPath', 'datasetCount', 'accountCount', 'recordCount');
`);
    status.lastMirrorAt = meta.lastMirrorAt || null;
    status.lastBackupAt = meta.lastBackupAt || null;
    status.lastBackupPath = meta.lastBackupPath || null;
    status.meta = meta;
  } catch {
    status.meta = {};
  }
  return status;
}
