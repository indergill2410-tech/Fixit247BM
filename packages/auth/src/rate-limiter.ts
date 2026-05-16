// ─── Rate Limiter ─────────────────────────────────────────────────────────────
//
// Simple in-process token-bucket style rate limiter backed by a Map.
// Suitable for development and low-traffic deployments.
// For production multi-instance deployments, replace with a Redis-backed
// implementation (e.g. @upstash/ratelimit).

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

/** 5 login attempts per IP per 15 minutes */
export const loginLimiter = new RateLimiter();
export const LOGIN_LIMIT = 5;
export const LOGIN_WINDOW_MS = 15 * 60 * 1000;

/**
 * Check login rate limit for a given IP address.
 */
export function checkLoginRateLimit(ipAddress: string): RateLimitResult {
  return loginLimiter.check(ipAddress, LOGIN_LIMIT, LOGIN_WINDOW_MS);
}

/** 3 registrations per IP per hour */
export const registerLimiter = new RateLimiter();
export const REGISTER_LIMIT = 3;
export const REGISTER_WINDOW_MS = 60 * 60 * 1000;

/**
 * Check registration rate limit for a given IP address.
 */
export function checkRegisterRateLimit(ipAddress: string): RateLimitResult {
  return registerLimiter.check(ipAddress, REGISTER_LIMIT, REGISTER_WINDOW_MS);
}

/** 3 password-reset requests per email per hour */
export const passwordResetLimiter = new RateLimiter();
export const PASSWORD_RESET_LIMIT = 3;
export const PASSWORD_RESET_WINDOW_MS = 60 * 60 * 1000;

/**
 * Check password-reset rate limit for a given email address.
 */
export function checkPasswordResetRateLimit(email: string): RateLimitResult {
  return passwordResetLimiter.check(
    email,
    PASSWORD_RESET_LIMIT,
    PASSWORD_RESET_WINDOW_MS,
  );
}
