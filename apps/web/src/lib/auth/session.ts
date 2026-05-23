import { getSupabaseServerClient } from '@/lib/supabase/server';
import { db } from '@fixit247/database';
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

export async function getSession(): Promise<SessionUser | null> {
  const supabase = await getSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  // Role MUST come from the database — never trust user_metadata which the
  // client can manipulate directly via supabase.auth.updateUser().
  const dbUser = await db.user.findFirst({ where: { id: user.id } });
  if (!dbUser) return null;

  const meta = user.user_metadata as Record<string, unknown>;
  return {
    id: user.id,
    email: user.email ?? '',
    role: dbUser.role as unknown as Role,
    firstName: dbUser.firstName || (meta.firstName as string | undefined) ?? '',
    lastName: dbUser.lastName || (meta.lastName as string | undefined) ?? '',
    avatarUrl: (meta.avatarUrl as string | null | undefined) ?? null,
    onboardingComplete: dbUser.onboardingComplete,
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
