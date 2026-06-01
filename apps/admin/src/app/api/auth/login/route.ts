import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { z } from 'zod';
import type { Role } from '@fixit247/auth';
import { db } from '@fixit247/database';

const ADMIN_ROLES: Role[] = ['ADMIN', 'SUPER_ADMIN'];

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function json(data: Record<string, unknown>, status = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: {
      'Cache-Control': 'private, no-store',
      Pragma: 'no-cache',
    },
  });
}

function isAdminRole(role: unknown): role is Role {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

export async function POST(request: NextRequest) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return json({ error: 'Invalid request body', code: 'invalid_request' }, 400);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return json({ error: 'Authentication is not configured.', code: 'auth_misconfigured' }, 503);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return json({ error: 'Invalid email or password.', code: 'invalid_credentials' }, 401);
  }

  let role: Role | undefined;
  let active = true;
  let hasDbProfile = false;
  try {
    const user = await db.user.findFirst({
      where: { id: data.user.id },
      select: { role: true, isActive: true },
    });
    if (user) {
      role = user.role;
      active = user.isActive;
      hasDbProfile = true;
    }
  } catch {
    await supabase.auth.signOut();
    return json({ error: 'Admin database is temporarily unavailable.', code: 'profile_unavailable' }, 503);
  }

  const appMeta = data.user.app_metadata as Record<string, unknown>;
  role ??= isAdminRole(appMeta.role) ? appMeta.role : undefined;

  if (!hasDbProfile && role) {
    active = true;
  }

  if (!active || !role || !ADMIN_ROLES.includes(role)) {
    await supabase.auth.signOut();
    return json({ error: 'Your account does not have admin access.', code: 'access_denied' }, 403);
  }

  return json({ redirectTo: '/dashboard', role });
}
