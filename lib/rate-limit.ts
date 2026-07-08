interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const store = new Map<string, number[]>();

let cleanupScheduled = false;

function scheduleCleanup() {
  if (cleanupScheduled) return;
  cleanupScheduled = true;
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of store) {
      const filtered = timestamps.filter((t) => now - t < 60_000 * 15);
      if (filtered.length === 0) {
        store.delete(key);
      } else {
        store.set(key, filtered);
      }
    }
  }, 60_000);
}

export function rateLimit(
  ip: string,
  config: RateLimitConfig,
): { allowed: boolean; retryAfterMs?: number } {
  scheduleCleanup();

  const now = Date.now();
  const key = `${ip}:${config.windowMs}`;
  const timestamps = store.get(key) ?? [];

  const windowStart = now - config.windowMs;
  const recent = timestamps.filter((t) => t > windowStart);

  if (recent.length >= config.maxRequests) {
    const oldest = recent[0];
    const retryAfterMs = oldest + config.windowMs - now;
    return { allowed: false, retryAfterMs };
  }

  recent.push(now);
  store.set(key, recent);
  return { allowed: true };
}
