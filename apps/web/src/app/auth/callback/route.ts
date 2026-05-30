import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getDashboardTarget, normalizeRedirectTarget, toRedirectUrl } from '@/lib/auth/redirects';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectTo = normalizeRedirectTarget(searchParams.get('redirectTo'), origin);

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      },
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const meta = data.user.user_metadata as Record<string, unknown>;
      let role = meta.role as string | undefined;

      // Google OAuth users have no role metadata on first sign-in.
      // The login form passes the user's selection as googleRole; persist it.
      if (!role) {
        const googleRole = searchParams.get('googleRole') ?? 'CUSTOMER';
        const fullName = (meta.full_name as string | undefined) ?? '';
        const [firstName = '', ...rest] = fullName.split(' ');
        const lastName = rest.join(' ');
        await supabase.auth.updateUser({
          data: { role: googleRole, onboardingComplete: false, firstName, lastName },
        });
        role = googleRole;
      }

      const dest =
        redirectTo !== '/dashboard'
          ? redirectTo
          : getDashboardTarget(role);
      return NextResponse.redirect(toRedirectUrl(dest, origin));
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
