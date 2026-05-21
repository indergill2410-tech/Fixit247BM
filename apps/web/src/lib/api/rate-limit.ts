import { type NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store — single-instance only. Use Redis in multi-instance production.
const store = new Map<string, RateLimitEntry>();

// Prune expired entries every 5 minutes to avoid memory leaks
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) store.delete(key);
    }
  },
  5 * 60 * 1000,
);

export interface RateLimitOptions {
  /** Max requests per window */
  limit: number;
  /** Window duration in seconds */
  windowSecs: number;
  /** Key suffix to namespace different limits */
  key?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

export function rateLimit(req: NextRequest, opts: RateLimitOptions): RateLimitResult {
  const { limit, windowSecs, key = 'default' } = opts;
  const ip = getClientIp(req);
  const storeKey = `rl:${key}:${ip}`;
  const now = Date.now();
  const windowMs = windowSecs * 1000;

  const entry = store.get(storeKey);

  if (!entry || entry.resetAt <= now) {
    const newEntry: RateLimitEntry = { count: 1, resetAt: now + windowMs };
    store.set(storeKey, newEntry);
    return { success: true, limit, remaining: limit - 1, resetAt: newEntry.resetAt };
  }

  if (entry.count >= limit) {
    return { success: false, limit, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, limit, remaining: limit - entry.count, resetAt: entry.resetAt };
}

export function rateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    { error: 'Too many requests. Please slow down.', code: 'TOO_MANY_REQUESTS' },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
        'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
      },
    },
  );
}

/** Preconfigured limits for common route types */
export const LIMITS = {
  auth: { limit: 10, windowSecs: 60, key: 'auth' },
  // Login: 5 attempts per 15 minutes per IP
  login: { limit: 5, windowSecs: 15 * 60, key: 'login' },
  // Register: 3 attempts per hour per IP
  register: { limit: 3, windowSecs: 60 * 60, key: 'register' },
  api: { limit: 60, windowSecs: 60, key: 'api' },
  webhook: { limit: 200, windowSecs: 60, key: 'webhook' },
  ai: { limit: 20, windowSecs: 60, key: 'ai' },
  voice: { limit: 30, windowSecs: 60, key: 'voice' },
  // Jobs POST: 10 per hour per user
  jobsCreate: { limit: 10, windowSecs: 60 * 60, key: 'jobs-create' },
  // Payment intent: 5 per hour per user
  paymentIntent: { limit: 5, windowSecs: 60 * 60, key: 'payment-intent' },
} satisfies Record<string, RateLimitOptions>;

/**
 * Rate-limit by a user ID rather than IP address.
 * Use for authenticated endpoints where per-user throttling is appropriate.
 */
export function rateLimitByUser(userId: string, opts: RateLimitOptions): RateLimitResult {
  const { limit, windowSecs, key = 'default' } = opts;
  const storeKey = `rl:${key}:user:${userId}`;
  const now = Date.now();
  const windowMs = windowSecs * 1000;

  const entry = store.get(storeKey);

  if (!entry || entry.resetAt <= now) {
    const newEntry: RateLimitEntry = { count: 1, resetAt: now + windowMs };
    store.set(storeKey, newEntry);
    return { success: true, limit, remaining: limit - 1, resetAt: newEntry.resetAt };
  }

  if (entry.count >= limit) {
    return { success: false, limit, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, limit, remaining: limit - entry.count, resetAt: entry.resetAt };
}
