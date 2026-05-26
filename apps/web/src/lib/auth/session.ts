import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { Role } from '@fixit247/auth';

export interface SessionUser {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  onboardingComplete: boolean;
  emailVerified: boolean;
}

// Resolve role: app_metadata is authoritative (service-role-only writeable).
// user_metadata is kept as a fallback for accounts pre-dating this change.
function resolveRole(user: { app_metadata?: Record<string, unknown> | null; user_metadata?: Record<string, unknown> | null }): Role {
  const appRole = (user.app_metadata as Record<string, unknown> | undefined)?.role;
  const userRole = (user.user_metadata as Record<string, unknown> | undefined)?.role;
  return ((appRole ?? userRole) as Role | undefined) ?? 'CUSTOMER';
}

export async function getSession(): Promise<SessionUser | null> {
  const supabase = await getSupabaseServerClient();
  // Use getUser() (server-verified) rather than getSession() (local-only JWT read)
  // so revoked tokens are caught immediately.
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  return {
    id: user.id,
    email: user.email ?? '',
    role: resolveRole(user),
    firstName: (meta.firstName as string | undefined) ?? '',
    lastName: (meta.lastName as string | undefined) ?? '',
    avatarUrl: (meta.avatarUrl as string | null | undefined) ?? null,
    onboardingComplete: (meta.onboardingComplete as boolean | undefined) ?? false,
    emailVerified: !!user.email_confirmed_at,
  };
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    const { redirect } = await import('next/navigation');
    redirect('/login');
  }
  return session!;
}

// API-safe variant: returns a 401 JSON response instead of redirecting.
// Usage: const s = await requireApiSession(); if (s instanceof NextResponse) return s;
export async function requireApiSession(): Promise<SessionUser | NextResponse> {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return session;
}

export async function requireRole(role: Role | Role[]): Promise<SessionUser> {
  const session = await requireSession();
  const roles = Array.isArray(role) ? role : [role];
  if (!roles.includes(session.role)) {
    const { redirect } = await import('next/navigation');
    redirect('/unauthorized');
  }
  return session;
}

export async function requireOnboarding(): Promise<SessionUser> {
  const session = await requireSession();
  if (!session.onboardingComplete) {
    const { redirect } = await import('next/navigation');
    const path = session.role === 'TRADIE' ? '/tradie/onboarding/business' : '/onboarding';
    redirect(path);
  }
  return session;
}
