import type { Role } from '@fixit247/auth';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';
import { getDashboardTarget, normalizeRedirectTarget } from './redirects';

const CUSTOMER_ONBOARDING = '/onboarding';
const TRADIE_ONBOARDING = '/tradie/onboarding/business';

type Metadata = Record<string, unknown> | null | undefined;

export interface LoginRedirectInput {
  userId: string;
  email: string | undefined;
  appMetadata: Metadata;
  userMetadata: Metadata;
  requestedRedirectTo: string | null | undefined;
  origin: string;
}

export type LoginRedirectResult =
  | {
      ok: true;
      role: Role;
      redirectTo: string;
    }
  | {
      ok: false;
      status: 403 | 503;
      error: string;
      code: 'account_inactive' | 'profile_unavailable';
    };

function isRole(value: unknown): value is Role {
  return value === 'CUSTOMER' || value === 'TRADIE' || value === 'ADMIN' || value === 'SUPER_ADMIN';
}

function metadataRole(appMetadata: Metadata, userMetadata: Metadata): Role {
  const appRole = appMetadata?.role;
  if (isRole(appRole)) return appRole;

  const userRole = userMetadata?.role;
  return userRole === 'TRADIE' ? 'TRADIE' : 'CUSTOMER';
}

function isDashboardTarget(target: string): boolean {
  return target === '/dashboard' || target === '/tradie/dashboard' || target.endsWith('/dashboard');
}

function isRoleAllowedTarget(role: Role, target: string): boolean {
  if (target.startsWith('http')) {
    return role === 'ADMIN' || role === 'SUPER_ADMIN';
  }
  if (target.startsWith('/tradie')) return role === 'TRADIE';
  if (target.startsWith('/admin')) return role === 'ADMIN' || role === 'SUPER_ADMIN';
  return role === 'CUSTOMER';
}

function onboardingTarget(role: Role): string | null {
  if (role === 'TRADIE') return TRADIE_ONBOARDING;
  if (role === 'CUSTOMER') return CUSTOMER_ONBOARDING;
  return null;
}

function isDemoAccount(email: string | undefined): boolean {
  return Boolean(email?.toLowerCase().includes('@demo.fixit247.'));
}

export async function resolveLoginRedirect(input: LoginRedirectInput): Promise<LoginRedirectResult> {
  let user: { role: Role; onboardingComplete: boolean; isActive: boolean } | null = null;

  try {
    user = await db.user.findFirst({
      where: { id: input.userId },
      select: { role: true, onboardingComplete: true, isActive: true },
    });
  } catch (error) {
    logger.error('[auth/login] DB profile lookup failed', error);
    return {
      ok: false,
      status: 503,
      code: 'profile_unavailable',
      error: 'Fixit247 is connected to auth, but the app database is temporarily unavailable. Please try again in a minute.',
    };
  }

  if (user && !user.isActive) {
    return {
      ok: false,
      status: 403,
      code: 'account_inactive',
      error: 'This account is not active. Please contact Fixit247 support.',
    };
  }

  const role = user?.role ?? metadataRole(input.appMetadata, input.userMetadata);
  const defaultTarget = getDashboardTarget(role);
  const safeRedirect = normalizeRedirectTarget(input.requestedRedirectTo, input.origin);
  const requestedTarget =
    safeRedirect !== '/dashboard' && isRoleAllowedTarget(role, safeRedirect)
      ? safeRedirect
      : defaultTarget;

  const needsOnboarding = user ? !user.onboardingComplete && !isDemoAccount(input.email) : false;
  const onboarding = onboardingTarget(role);
  const redirectTo =
    needsOnboarding && onboarding && isDashboardTarget(requestedTarget)
      ? onboarding
      : requestedTarget;

  return { ok: true, role, redirectTo };
}
