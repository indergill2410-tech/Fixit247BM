import type { Role } from '@fixit247/database';

export type { Role };

// ─── DateTime alias ───────────────────────────────────────────────────────────

/** Prisma returns Date objects; aliased for readability */
type DateTime = Date;

// ─── Core Auth Interfaces ─────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  emailVerified: DateTime | null;
  phone: string | null;
  phoneVerified: boolean;
  role: Role;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  isActive: boolean;
  onboardingComplete: boolean;
  lastLoginAt: DateTime | null;
  loginCount: number;
  lastIpAddress: string | null;
  deletedAt: DateTime | null;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  /** Unix timestamp in seconds */
  expiresAt: number;
}

// ─── Credential Types ─────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  /** Only CUSTOMER and TRADIE may self-register */
  role: Extract<Role, 'CUSTOMER' | 'TRADIE'>;
  phone?: string;
}

export interface PasswordResetCredentials {
  token: string;
  newPassword: string;
}

export interface ChangePasswordCredentials {
  currentPassword: string;
  newPassword: string;
}

// ─── Device Information ───────────────────────────────────────────────────────

export interface DeviceInfo {
  ipAddress: string;
  userAgent: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop' | 'unknown';
}

// ─── Permissions ──────────────────────────────────────────────────────────────

export type Permission =
  // ── Jobs ──────────────────────────────────────────────────────────────────
  | 'jobs:create'
  | 'jobs:read'
  | 'jobs:read:own'
  | 'jobs:update'
  | 'jobs:update:own'
  | 'jobs:delete'
  | 'jobs:delete:own'
  | 'jobs:assign'
  | 'jobs:cancel'
  | 'jobs:cancel:own'
  | 'jobs:close'
  // ── Quotes / Claims ───────────────────────────────────────────────────────
  | 'quotes:create'
  | 'quotes:read'
  | 'quotes:read:own'
  | 'quotes:accept'
  | 'quotes:reject'
  | 'quotes:delete'
  // ── Payments ──────────────────────────────────────────────────────────────
  | 'payments:initiate'
  | 'payments:release'
  | 'payments:refund'
  | 'payments:view'
  | 'payments:view:own'
  // ── Reviews ───────────────────────────────────────────────────────────────
  | 'reviews:create'
  | 'reviews:read'
  | 'reviews:update:own'
  | 'reviews:delete'
  | 'reviews:moderate'
  | 'reviews:respond'
  // ── User management ───────────────────────────────────────────────────────
  | 'users:read'
  | 'users:read:own'
  | 'users:update:own'
  | 'users:manage'
  | 'users:delete'
  | 'users:suspend'
  | 'users:reinstate'
  // ── Tradie management ─────────────────────────────────────────────────────
  | 'tradies:read'
  | 'tradies:verify'
  | 'tradies:suspend'
  | 'tradies:update:own'
  | 'tradies:manage:documents'
  | 'tradies:manage:availability'
  // ── Admin & platform ──────────────────────────────────────────────────────
  | 'admin:access'
  | 'platform:configure'
  | 'platform:manage:categories'
  | 'platform:manage:fees'
  // ── Reports ───────────────────────────────────────────────────────────────
  | 'reports:view'
  | 'reports:export'
  | 'reports:financial'
  // ── Disputes ──────────────────────────────────────────────────────────────
  | 'disputes:create'
  | 'disputes:read'
  | 'disputes:resolve'
  | 'disputes:escalate'
  // ── Notifications ─────────────────────────────────────────────────────────
  | 'notifications:read:own'
  | 'notifications:manage'
  // ── Subscriptions ─────────────────────────────────────────────────────────
  | 'subscriptions:manage:own'
  | 'subscriptions:manage:all'
  // ── Verification ──────────────────────────────────────────────────────────
  | 'verification:submit'
  | 'verification:review'
  | 'verification:approve'
  | 'verification:reject'
  // ── Messages ──────────────────────────────────────────────────────────────
  | 'messages:send'
  | 'messages:read:own'
  | 'messages:delete'
  // ── Wallet / Credits ──────────────────────────────────────────────────────
  | 'wallet:view:own'
  | 'wallet:manage'
  // ── Audit logs ────────────────────────────────────────────────────────────
  | 'audit:read'
  | 'audit:export';
