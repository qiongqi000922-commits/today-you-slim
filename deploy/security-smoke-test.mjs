const target = String(process.env.TARGET_URL || "http://127.0.0.1:3200").replace(/\/+$/, "");
const hitCount = Number(process.env.HIT_COUNT || 30);
const concurrency = Number(process.env.CONCURRENCY || 4);
const endpoint = `${target}/api/passkeys/client-log`;

let cursor = 0;
const statusCounts = new Map();

async function oneRequest(index) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: "security_smoke",
      attemptId: `smoke-${Date.now()}-${index}`,
      stage: "rate-limit",
      source: "local"
    })
  });
  statusCounts.set(response.status, (statusCounts.get(response.status) || 0) + 1);
  await response.text().catch(() => "");
}

async function worker() {
  while (cursor < hitCount) {
    const index = cursor;
    cursor += 1;
    await oneRequest(index).catch((error) => {
      const key = `error:${error.name || "unknown"}`;
      statusCounts.set(key, (statusCounts.get(key) || 0) + 1);
    });
  }
}

await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker));

console.log(`Target: ${endpoint}`);
console.log(`Requests: ${hitCount}`);
console.log(Object.fromEntries([...statusCounts.entries()].sort()));
