import type { CookieStore } from './supabase';
import { createServerClient } from './supabase';
import { hasPermission, hasRole } from './permissions';
import type { AuthSession, AuthUser, Permission } from './types';
import type { Role } from './types';

// ─── Session error types ──────────────────────────────────────────────────────

export class AuthenticationError extends Error {
  readonly code = 'UNAUTHENTICATED';
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  readonly code = 'FORBIDDEN';
  constructor(message = 'Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

// ─── Session helpers ──────────────────────────────────────────────────────────

/**
 * Map a raw Supabase user object to our AuthUser shape.
 * Role is sourced from app_metadata (service-role-only writeable) with a
 * fallback to user_metadata for accounts pre-dating this change.
 */
function mapSupabaseUser(raw: {
  id: string;
  email?: string;
  email_confirmed_at?: string | null;
  phone?: string | null;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
}): AuthUser {
  const appMeta = raw.app_metadata ?? {};
  const meta = raw.user_metadata ?? {};
  const role = ((appMeta.role ?? meta.role) as Role | undefined) ?? 'CUSTOMER';

  return {
    id: raw.id,
    email: raw.email ?? '',
    emailVerified: raw.email_confirmed_at
      ? new Date(raw.email_confirmed_at)
      : null,
    phone: raw.phone ?? null,
    phoneVerified: Boolean(meta.phone_verified ?? false),
    role,
    firstName: String(meta.first_name ?? meta.firstName ?? ''),
    lastName: String(meta.last_name ?? meta.lastName ?? ''),
    avatarUrl: meta.avatar_url ? String(meta.avatar_url) : null,
    isActive: Boolean(meta.is_active ?? true),
    onboardingComplete: Boolean(meta.onboarding_complete ?? meta.onboardingComplete ?? false),
    lastLoginAt: meta.last_login_at
      ? new Date(String(meta.last_login_at))
      : null,
    loginCount: Number(meta.login_count ?? 0),
    lastIpAddress: meta.last_ip_address
      ? String(meta.last_ip_address)
      : null,
    deletedAt: meta.deleted_at ? new Date(String(meta.deleted_at)) : null,
    createdAt: new Date(raw.created_at),
    updatedAt: raw.updated_at ? new Date(raw.updated_at) : new Date(raw.created_at),
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Retrieve the current server-side session, or null if the user is not
 * authenticated (or the session has expired).
 */
export async function getServerSession(
  cookieStore: CookieStore,
): Promise<AuthSession | null> {
  const supabase = createServerClient(cookieStore);

  // getUser() makes a network request to verify the JWT with the Auth server,
  // catching revoked sessions that getSession() (local-only) would miss.
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return null;

  // Still need access/refresh tokens — getSession() is fine for token retrieval
  // now that we've already verified the user above.
  const { data: { session } } = await supabase.auth.getSession();

  return {
    user: mapSupabaseUser(user),
    accessToken: session?.access_token ?? '',
    refreshToken: session?.refresh_token ?? '',
    expiresAt: session?.expires_at ?? 0,
  };
}

/**
 * Like getServerSession but throws AuthenticationError if there is no session.
 * Use in route handlers / server actions that require authentication.
 */
export async function requireServerSession(
  cookieStore: CookieStore,
): Promise<AuthSession> {
  const session = await getServerSession(cookieStore);
  if (!session) {
    throw new AuthenticationError();
  }
  return session;
}

/**
 * Require the user to hold at minimum `requiredRole` (checked via
 * ROLE_HIERARCHY).  Throws AuthenticationError if unauthenticated, or
 * AuthorizationError if the role is insufficient.
 */
export async function requireRole(
  cookieStore: CookieStore,
  requiredRole: Role,
): Promise<AuthSession> {
  const session = await requireServerSession(cookieStore);

  if (!hasRole(session.user.role, requiredRole)) {
    throw new AuthorizationError(
      `Role '${session.user.role}' does not meet the required role '${requiredRole}'`,
    );
  }

  return session;
}

/**
 * Require the user to hold a specific permission.
 * Throws AuthenticationError if unauthenticated, or AuthorizationError if the
 * permission is not granted for the user's role.
 */
export async function requirePermission(
  cookieStore: CookieStore,
  permission: Permission,
): Promise<AuthSession> {
  const session = await requireServerSession(cookieStore);

  if (!hasPermission(session.user.role, permission)) {
    throw new AuthorizationError(
      `Role '${session.user.role}' does not have permission '${permission}'`,
    );
  }

  return session;
}

/**
 * Attempt to refresh the access token using the stored refresh token.
 * Returns the new session, or null if the refresh fails.
 */
export async function refreshSession(
  cookieStore: CookieStore,
): Promise<AuthSession | null> {
  const supabase = createServerClient(cookieStore);

  const {
    data: { session },
    error,
  } = await supabase.auth.refreshSession();

  if (error || !session?.user) {
    return null;
  }

  return {
    user: mapSupabaseUser(session.user),
    accessToken: session.access_token,
    refreshToken: session.refresh_token ?? '',
    expiresAt: session.expires_at ?? 0,
  };
}

/**
 * Sign out the current user and clear all session cookies.
 */
export async function invalidateSession(
  cookieStore: CookieStore,
): Promise<void> {
  const supabase = createServerClient(cookieStore);
  await supabase.auth.signOut();
}
