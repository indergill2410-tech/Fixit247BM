import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { db } from '@fixit247/database';
import type { Role } from '@fixit247/auth';
import { logger } from '@/lib/logger';

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

export async function getSession(): Promise<SessionUser | null> {
  const supabase = await getSupabaseServerClient();
  // Use getUser() (server-verified) rather than getSession() (local-only JWT read)
  // so revoked tokens are caught immediately.
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error != null || !user) return null;

  // Role MUST come from the database — never trust user_metadata which the
  // client can manipulate directly via supabase.auth.updateUser().
  let dbUser: Awaited<ReturnType<typeof db.user.findFirst>>;
  try {
    dbUser = await db.user.findFirst({ where: { id: user.id } });
  } catch (dbErr) {
    logger.error('[getSession] DB lookup failed', dbErr);
    return null;
  }
  if (!dbUser) {
    // User authenticated in Supabase but no DB row yet (auth callback may not have run).
    // Return a provisional session so we don't loop between /login ↔ /dashboard.
    // onboardingComplete=false routes them to onboarding where the DB user gets created.
    const meta = user.user_metadata as Record<string, unknown>;
    const role = (meta.role === 'TRADIE' ? 'TRADIE' : 'CUSTOMER') as Role;
    return {
      id: user.id,
      email: user.email ?? '',
      role,
      firstName: (meta.firstName as string | undefined) ?? '',
      lastName: (meta.lastName as string | undefined) ?? '',
      avatarUrl: null,
      onboardingComplete: false,
      emailVerified: !!user.email_confirmed_at,
    };
  }

  const meta = (user.user_metadata as Record<string, unknown> | null) ?? {};
  return {
    id: user.id,
    email: user.email ?? '',
    role: dbUser.role as unknown as Role,
    firstName: dbUser.firstName || ((meta.firstName as string | undefined) ?? ''),
    lastName: dbUser.lastName || ((meta.lastName as string | undefined) ?? ''),
    avatarUrl: (meta.avatarUrl as string | null | undefined) ?? null,
    onboardingComplete: dbUser.onboardingComplete,
    emailVerified: !!user.email_confirmed_at,
  };
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) redirect('/login');
  return session;
}

// API-safe variant: returns a 401 JSON response instead of redirecting.
// Usage: const s = await requireApiSession(); if (s instanceof NextResponse) return s;
export async function requireApiSession(): Promise<SessionUser | NextResponse> {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return session;
}

export async function requireApiRole(role: Role | Role[]): Promise<SessionUser | NextResponse> {
  const session = await requireApiSession();
  if (session instanceof NextResponse) return session;

  const roles = Array.isArray(role) ? role : [role];
  if (!roles.includes(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return session;
}

export async function requireRole(role: Role | Role[]): Promise<SessionUser> {
  const session = await requireSession();
  const roles = Array.isArray(role) ? role : [role];
  if (!roles.includes(session.role)) redirect('/unauthorized');
  return session;
}

export async function requireOnboarding(): Promise<SessionUser> {
  const session = await requireSession();
  if (!session.onboardingComplete) {
    const path = session.role === 'TRADIE' ? '/tradie/onboarding/business' : '/onboarding';
    redirect(path);
  }
  return session;
}
