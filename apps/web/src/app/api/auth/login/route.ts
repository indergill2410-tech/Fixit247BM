import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { rateLimit, rateLimitResponse, LIMITS } from '@/lib/api/rate-limit';
import { resolveLoginRedirect } from '@/lib/auth/server-login';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  redirectTo: z.string().optional(),
});

function getOrigin(request: NextRequest): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL;
  if (siteUrl) return siteUrl.replace(/\/$/, '');

  const proto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim()
    ?? new URL(request.url).protocol.replace(':', '');
  const host = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
    ?? request.headers.get('host');
  return host ? `${proto}://${host}` : new URL(request.url).origin;
}

function json(data: Record<string, unknown>, status = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: {
      'Cache-Control': 'private, no-store',
      Pragma: 'no-cache',
    },
  });
}

export async function POST(request: NextRequest) {
  const rl = await rateLimit(request, LIMITS.login);
  if (!rl.success) return rateLimitResponse(rl);

  const body = await request.json() as unknown;
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return json(
      { error: 'Invalid request body' },
      400,
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return json(
      { error: 'Authentication is not configured. Please contact support.', code: 'auth_misconfigured' },
      503,
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    const message = error?.message ?? '';
    if (message.includes('Email not confirmed')) {
      return json({ error: 'Please verify your email first', code: 'email_not_confirmed' }, 403);
    }
    return json({ error: 'Invalid email or password', code: 'invalid_credentials' }, 401);
  }

  // Increment login counter — fire-and-forget, never block the auth response
  void supabase.rpc('increment_login_count', { user_id: data.user.id });

  const result = await resolveLoginRedirect({
    userId: data.user.id,
    email: data.user.email,
    appMetadata: data.user.app_metadata,
    userMetadata: data.user.user_metadata,
    requestedRedirectTo: parsed.data.redirectTo,
    origin: getOrigin(request),
  });

  if (!result.ok) {
    await supabase.auth.signOut();
    return json({ error: result.error, code: result.code }, result.status);
  }

  return json({
    role: result.role,
    redirectTo: result.redirectTo,
  });
}
