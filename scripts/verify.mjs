import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

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

for (const file of filesToCheck) {
  if (!existsSync(file)) {
    console.error(`Missing expected file: ${file}`);
    process.exit(1);
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
      console.error(`${file} is missing ${pattern}`);
      process.exit(1);
    }
  }
}

console.log("Verification passed.");
