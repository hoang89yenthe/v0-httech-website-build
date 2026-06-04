type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

// Dọn dẹp entry hết hạn mỗi 10 phút để tránh memory leak trong môi trường
// long-running (Docker, self-hosted). Trên Vercel Serverless mỗi invocation
// là stateless nên interval này không chạy — cần Upstash Redis để rate-limit
// thực sự có hiệu lực trong môi trường serverless.
const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 10 * 60_000);
// Không giữ process sống chỉ vì interval này
if (typeof cleanup === "object" && cleanup !== null && "unref" in cleanup) {
  (cleanup as NodeJS.Timeout).unref();
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (entry.count >= limit) {
    return { allowed: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allowed: true, retryAfterSec: 0 };
}
