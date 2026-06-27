import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const filesToCheck = [
  "server.mjs",
  "public/shared.js",
  "public/app.js",
  "public/admin.js",
  "public/replay.js",
  "deploy/security-smoke-test.mjs"
];

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: false
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

for (const file of filesToCheck) {
  if (!existsSync(file)) {
    fail(`Missing expected file: ${file}`);
  }
  run(process.execPath, ["--check", file]);
}

const htmlFiles = [
  ["public/index.html", /shared\.js\?v=[^"']+/, /app\.js\?v=[^"']+/],
  ["public/admin.html", /\.\.\/shared\.js\?v=[^"']+/, /\.\/app\.js\?v=[^"']+/],
  ["public/replay.html", /shared\.js\?v=[^"']+/, /replay\.js\?v=[^"']+/]
];

for (const [file, sharedPattern, entryPattern] of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const pattern of [sharedPattern, entryPattern]) {
    if (!pattern.test(html)) {
      fail(`${file} is missing ${pattern}`);
    }
  }
}

function stripUrlSuffix(value) {
  return String(value || "").split(/[?#]/, 1)[0];
}

function versionedAssetExpected(reference) {
  const pathname = stripUrlSuffix(reference).toLowerCase();
  return /\.(css|js|png|svg|ico|webmanifest)$/.test(pathname);
}

function localAssetPath(htmlFile, reference) {
  const cleanReference = stripUrlSuffix(reference);
  if (!cleanReference || /^(?:https?:|data:|blob:|mailto:|tel:|#)/i.test(cleanReference)) {
    return null;
  }

  if (cleanReference.startsWith("/")) {
    return path.join("public", cleanReference.slice(1));
  }

  if (htmlFile === "public/admin.html") {
    const adminMappedAssets = {
      "./styles.css": "public/admin.css",
      "styles.css": "public/admin.css",
      "./app.js": "public/admin.js",
      "app.js": "public/admin.js",
      "../shared.js": "public/shared.js"
    };
    if (adminMappedAssets[cleanReference]) {
      return adminMappedAssets[cleanReference];
    }
  }

  return path.normalize(path.join(path.dirname(htmlFile), cleanReference));
}

function htmlAssetReferences(html) {
  const references = [];
  const patterns = [
    /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi,
    /<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(html))) {
      references.push(match[1]);
    }
  }
  return references;
}

for (const [file] of htmlFiles) {
  const html = readFileSync(file, "utf8");
  for (const reference of htmlAssetReferences(html)) {
    if (versionedAssetExpected(reference) && !/[?&]v=/.test(reference)) {
      fail(`${file} references an unversioned cacheable asset: ${reference}`);
    }
    const assetPath = localAssetPath(file, reference);
    if (!assetPath) continue;
    if (!assetPath.startsWith("public/") || !existsSync(assetPath)) {
      fail(`${file} references missing asset ${reference} -> ${assetPath}`);
    }
  }
}

const forbiddenFragments = [
  ["public/index.html", "jf_theme_preference_v1"],
  ["public/index.html", "theme-choice"],
  ["public/app.js", "jf_theme_preference_v1"],
  ["public/app.js", "renderThemeSettings"],
  ["public/app.js", "themeChoice"],
  ["public/styles.css", "theme-choice"],
  ["public/styles.css", "glass-red-green"],
  ["public/styles.css", "glass-blue-green"],
  ["public/styles.css", 'data-theme="classic"']
];

for (const [file, fragment] of forbiddenFragments) {
  if (readFileSync(file, "utf8").includes(fragment)) {
    fail(`${file} contains removed theme code: ${fragment}`);
  }
}

console.log("Verification passed.");
