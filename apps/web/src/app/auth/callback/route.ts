import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createServiceRoleClient } from '@/lib/supabase/server';

// Only CUSTOMER and TRADIE may self-register via Google OAuth.
// Any other value in the URL param is silently clamped to CUSTOMER.
function sanitiseGoogleRole(raw: string | null): 'CUSTOMER' | 'TRADIE' {
  return raw === 'TRADIE' ? 'TRADIE' : 'CUSTOMER';
}

// Ensure the post-login redirect stays on this origin (no open redirect).
function sanitiseRedirectTo(raw: string | null): string {
  if (!raw) return '/dashboard';
  // Must start with / but not // (which browsers treat as protocol-relative)
  return raw.startsWith('/') && !raw.startsWith('//') ? raw : '/dashboard';
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectTo = sanitiseRedirectTo(searchParams.get('redirectTo'));

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
      const appMeta = (data.user.app_metadata ?? {}) as Record<string, unknown>;
      const userMeta = (data.user.user_metadata ?? {}) as Record<string, unknown>;
      let role = (appMeta.role ?? userMeta.role) as string | undefined;

      // Google OAuth users have no role on first sign-in.
      // The login form passes the user's selection as googleRole — validate and persist
      // to app_metadata (service-role only, not user-writable).
      if (!role) {
        const googleRole = sanitiseGoogleRole(searchParams.get('googleRole'));
        const fullName = (userMeta.full_name as string | undefined) ?? '';
        const [firstName = '', ...rest] = fullName.split(' ');
        const lastName = rest.join(' ');

        const admin = createServiceRoleClient();
        await admin.auth.admin.updateUserById(data.user.id, {
          app_metadata: { role: googleRole },
        });
        // Keep user_metadata in sync for client-side JWT reads
        await supabase.auth.updateUser({
          data: { role: googleRole, onboardingComplete: false, firstName, lastName },
        });
        role = googleRole;
      }

      const dest =
        redirectTo !== '/dashboard'
          ? redirectTo
          : role === 'TRADIE'
          ? '/tradie/dashboard'
          : role === 'ADMIN' || role === 'SUPER_ADMIN'
          ? '/admin'
          : '/dashboard';
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
