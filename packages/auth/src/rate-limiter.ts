// ─── Rate Limiter ─────────────────────────────────────────────────────────────
//
// In-process token-bucket rate limiter, with automatic fallback to Upstash Redis
// when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN env vars are set.
// The Upstash path is safe for multi-instance/serverless deployments.

interface RateLimitRecord {
  count: number;
  windowStart: number;
}

export interface RateLimitResult {
  /** True if the request is allowed */
  allowed: boolean;
  /** Remaining requests in the current window */
  remaining: number;
  /** Total allowed requests per window */
  limit: number;
  /** Milliseconds until the window resets */
  resetInMs: number;
}

// ─── RateLimiter class ────────────────────────────────────────────────────────

export class RateLimiter {
  private readonly store = new Map<string, RateLimitRecord>();

  /**
   * Check whether `key` is within the rate limit.
   *
   * @param key       Unique key (e.g. IP address, email)
   * @param limit     Maximum number of requests allowed per window
   * @param windowMs  Window duration in milliseconds
   */
  check(key: string, limit: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || now - record.windowStart >= windowMs) {
      // New window — reset counter
      this.store.set(key, { count: 1, windowStart: now });
      return {
        allowed: true,
        remaining: limit - 1,
        limit,
        resetInMs: windowMs,
      };
    }

    if (record.count >= limit) {
      const resetInMs = windowMs - (now - record.windowStart);
      return { allowed: false, remaining: 0, limit, resetInMs };
    }

    record.count += 1;
    const resetInMs = windowMs - (now - record.windowStart);
    return {
      allowed: true,
      remaining: limit - record.count,
      limit,
      resetInMs,
    };
  }

  /**
   * Reset the counter for a key (e.g. after a successful login).
   */
  reset(key: string): void {
    this.store.delete(key);
  }

  /**
   * Remove all expired windows to prevent unbounded memory growth.
   * Call this periodically (e.g. via setInterval) in long-lived processes.
   */
  purgeExpired(windowMs: number): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now - record.windowStart >= windowMs) {
        this.store.delete(key);
      }
    }
  }
}

// ─── Pre-configured limiters ──────────────────────────────────────────────────

// ─── Upstash-backed checker (lazily initialised) ─────────────────────────────

interface UpstashLimiter {
  limit(key: string): Promise<{ success: boolean; remaining: number; reset: number; limit: number }>;
}

async function makeUpstashLimiter(tokens: number, windowSeconds: number): Promise<UpstashLimiter | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const [{ Redis }, { Ratelimit }] = await Promise.all([
      import('@upstash/redis'),
      import('@upstash/ratelimit'),
    ]);
    const redis = new Redis({ url, token });
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(tokens, `${windowSeconds}s`),
      analytics: false,
    });
    return limiter as unknown as UpstashLimiter;
  } catch {
    return null;
  }
}

async function checkWithUpstash(
  getUpstash: () => Promise<UpstashLimiter | null>,
  fallback: RateLimiter,
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const limiter = await getUpstash();
  if (limiter) {
    const result = await limiter.limit(key);
    return {
      allowed: result.success,
      remaining: result.remaining,
      limit: result.limit,
      resetInMs: Math.max(0, result.reset - Date.now()),
    };
  }
  return fallback.check(key, limit, windowMs);
}

// ─── Pre-configured limiters ──────────────────────────────────────────────────
// Each limiter is lazily initialised on first use and cached for subsequent calls.

// Returns a getter that caches a successful Upstash limiter permanently but clears
// the cache on transient failure (null result despite env vars being set) so the
// next request retries — preventing a cold-start hiccup from permanently bypassing
// distributed rate limiting for the process lifetime.
function makeUpstashGetter(tokens: number, windowSeconds: number): () => Promise<UpstashLimiter | null> {
  let cached: Promise<UpstashLimiter | null> | undefined;

  return async function getUpstash(): Promise<UpstashLimiter | null> {
    cached ??= makeUpstashLimiter(tokens, windowSeconds);
    const limiter = await cached;
    const hasConfig = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
    if (limiter === null && hasConfig) {
      // Transient failure — retry next time rather than permanently falling back.
      cached = undefined;
    }
    return limiter;
  };
}

export const LOGIN_LIMIT = 5;
export const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const _loginFallback = new RateLimiter();
const _getLoginUpstash = makeUpstashGetter(LOGIN_LIMIT, LOGIN_WINDOW_MS / 1000);

export async function checkLoginRateLimit(ipAddress: string): Promise<RateLimitResult> {
  return checkWithUpstash(_getLoginUpstash, _loginFallback, `login:${ipAddress}`, LOGIN_LIMIT, LOGIN_WINDOW_MS);
}

export const REGISTER_LIMIT = 3;
export const REGISTER_WINDOW_MS = 60 * 60 * 1000;
const _registerFallback = new RateLimiter();
const _getRegisterUpstash = makeUpstashGetter(REGISTER_LIMIT, REGISTER_WINDOW_MS / 1000);

export async function checkRegisterRateLimit(ipAddress: string): Promise<RateLimitResult> {
  return checkWithUpstash(_getRegisterUpstash, _registerFallback, `register:${ipAddress}`, REGISTER_LIMIT, REGISTER_WINDOW_MS);
}

export const PASSWORD_RESET_LIMIT = 3;
export const PASSWORD_RESET_WINDOW_MS = 60 * 60 * 1000;
const _pwResetFallback = new RateLimiter();
const _getPwResetUpstash = makeUpstashGetter(PASSWORD_RESET_LIMIT, PASSWORD_RESET_WINDOW_MS / 1000);

export async function checkPasswordResetRateLimit(email: string): Promise<RateLimitResult> {
  return checkWithUpstash(_getPwResetUpstash, _pwResetFallback, `pwreset:${email}`, PASSWORD_RESET_LIMIT, PASSWORD_RESET_WINDOW_MS);
}
