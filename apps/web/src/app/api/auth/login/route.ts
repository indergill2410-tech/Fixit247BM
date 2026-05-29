import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { rateLimit, rateLimitResponse, LIMITS } from '@/lib/api/rate-limit';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  const rl = await rateLimit(request, LIMITS.login);
  if (!rl.success) return rateLimitResponse(rl);

  const body = await request.json() as unknown;
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
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

  if (error ?? !data.user) {
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 },
    );
  }

  // Increment login counter — fire-and-forget, never block the auth response
  void supabase.rpc('increment_login_count', { user_id: data.user.id });

  const role = (data.user.user_metadata as { role?: string }).role ?? 'CUSTOMER';
  return NextResponse.json({ role });
}
