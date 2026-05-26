import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { registerSchema } from '@/lib/validators/auth';
import { rateLimit, rateLimitResponse, LIMITS } from '@/lib/api/rate-limit';
import { createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const rl = await rateLimit(request, LIMITS.register);
  if (!rl.success) return rateLimitResponse(rl);
  const body = await request.json() as unknown;
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  const { email, password, firstName, lastName, role } = parsed.data;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll(c: { name: string; value: string; options: Record<string, unknown> }[]) { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } } },
  );

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { firstName, lastName, role, onboardingComplete: false },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    const status = error.message.includes('already registered') ? 409 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }

  // Write role to app_metadata (service-role only — not user-writable) so it
  // cannot be changed by a browser-console call to supabase.auth.updateUser().
  if (data.user?.id) {
    const admin = createServiceRoleClient();
    await admin.auth.admin.updateUserById(data.user.id, {
      app_metadata: { role },
    });
  }

  return NextResponse.json({ userId: data.user?.id, requiresVerification: !data.session }, { status: 201 });
}
