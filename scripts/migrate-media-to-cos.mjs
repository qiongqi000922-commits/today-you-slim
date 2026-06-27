#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCosMediaStorage, mediaStorageConfigFromEnv } from "../lib/cos-media.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, "data");
const PHOTO_DIR = path.join(DATA_DIR, "photos");
const CONCURRENCY = Math.max(1, Math.min(8, Number(process.env.COS_MIGRATION_CONCURRENCY) || 3));
const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force");

const storage = createCosMediaStorage(mediaStorageConfigFromEnv(process.env));

if (!storage.enabled) {
  console.error("COS is not configured. Set COS_ENABLED=1, COS_BUCKET, COS_REGION, COS_SECRET_ID and COS_SECRET_KEY.");
  process.exit(1);
}

function contentTypeFor(filename) {
  const ext = path.extname(filename).toLowerCase();
  if ([".jpg", ".jpeg"].includes(ext)) return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

async function collectPhotoFiles() {
  const result = [];
  const codeDirs = await fs.readdir(PHOTO_DIR, { withFileTypes: true }).catch((error) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  for (const codeDir of codeDirs) {
    if (!codeDir.isDirectory()) continue;
    const code = codeDir.name;
    const directory = path.join(PHOTO_DIR, code);
    const files = await fs.readdir(directory, { withFileTypes: true }).catch(() => []);
    for (const file of files) {
      if (!file.isFile()) continue;
      const objectKey = storage.objectKeyFor(code, file.name);
      if (!objectKey) {
        result.push({ code, filename: file.name, skipped: true, reason: "invalid-name" });
        continue;
      }
      const fullPath = path.join(directory, file.name);
      const stat = await fs.stat(fullPath);
      result.push({
        code,
        filename: file.name,
        objectKey,
        fullPath,
        size: stat.size,
        contentType: contentTypeFor(file.name)
      });
    }
  }
  return result;
}

async function runPool(items, worker) {
  let index = 0;
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (index < items.length) {
      const current = items[index++];
      await worker(current);
    }
  });
  await Promise.all(workers);
}

const files = await collectPhotoFiles();
const stats = {
  total: files.length,
  uploaded: 0,
  skipped: 0,
  existed: 0,
  failed: 0,
  bytesUploaded: 0
};

await runPool(files, async (file) => {
  if (file.skipped) {
    stats.skipped += 1;
    console.warn(`skip ${file.code}/${file.filename}: ${file.reason}`);
    return;
  }
  try {
    if (!FORCE && await storage.objectExists(file.objectKey)) {
      stats.existed += 1;
      return;
    }
    if (DRY_RUN) {
      stats.skipped += 1;
      console.log(`dry-run ${file.code}/${file.filename} -> ${file.objectKey}`);
      return;
    }
    const buffer = await fs.readFile(file.fullPath);
    await storage.uploadBuffer(file.objectKey, buffer, file.contentType);
    stats.uploaded += 1;
    stats.bytesUploaded += file.size;
    if (stats.uploaded % 20 === 0) {
      console.log(`uploaded ${stats.uploaded}/${stats.total}`);
    }
  } catch (error) {
    stats.failed += 1;
    console.error(`failed ${file.code}/${file.filename}: ${error.message}`);
  }
});

console.log(JSON.stringify({
  ok: stats.failed === 0,
  dryRun: DRY_RUN,
  force: FORCE,
  concurrency: CONCURRENCY,
  ...stats
}, null, 2));

if (stats.failed > 0) {
  process.exitCode = 1;
}
