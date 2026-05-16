// ─── Auth package barrel export ───────────────────────────────────────────────

// Types & permission definitions
export * from './types';
export * from './permissions';

// Supabase client factories
export {
  createBrowserClient,
  createServerClient,
  createServiceRoleClient,
  // Legacy aliases kept for backward compatibility
  supabase,
  createServiceClient,
} from './supabase';
export type { CookieStore } from './supabase';

// Server-side session utilities
export {
  getServerSession,
  requireServerSession,
  requireRole,
  requirePermission,
  refreshSession,
  invalidateSession,
  AuthenticationError,
  AuthorizationError,
} from './session';

// Audit logging
export { logAuthEvent, getAuditLogs } from './audit';
export type { AuditAction, AuditLogEntry, LogAuthEventOptions } from './audit';

// Rate limiting
export {
  RateLimiter,
  loginLimiter,
  registerLimiter,
  passwordResetLimiter,
  checkLoginRateLimit,
  checkRegisterRateLimit,
  checkPasswordResetRateLimit,
  LOGIN_LIMIT,
  LOGIN_WINDOW_MS,
  REGISTER_LIMIT,
  REGISTER_WINDOW_MS,
  PASSWORD_RESET_LIMIT,
  PASSWORD_RESET_WINDOW_MS,
} from './rate-limiter';
export type { RateLimitResult } from './rate-limiter';
