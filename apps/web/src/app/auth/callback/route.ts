import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from '@fixit247/database';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard';

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
      const { user } = data;
      const meta = user.user_metadata as Record<string, unknown>;
      const role = (meta.role as string | undefined) ?? 'CUSTOMER';

      // Ensure DB User + profile exist for both Google OAuth and email/password flows
      const existing = await db.user.findFirst({ where: { id: user.id } });
      if (!existing) {
        const fullName = (meta.full_name as string | undefined) ?? '';
        const nameParts = fullName.split(' ');
        await db.$transaction(async (tx) => {
          await tx.user.create({
            data: {
              id: user.id,
              email: user.email!,
              firstName: (meta.firstName as string | undefined) ?? nameParts[0] ?? '',
              lastName: (meta.lastName as string | undefined) ?? nameParts.slice(1).join(' ') ?? '',
              role: role as never,
              isActive: true,
              emailVerified: new Date(),
            },
          });
          if (role === 'TRADIE') {
            await tx.tradieProfile.create({
              data: { userId: user.id, verificationStatus: 'PENDING', onboardingStatus: 'INCOMPLETE', onboardingStep: 0 },
            });
          } else {
            await tx.customerProfile.create({ data: { userId: user.id } });
          }
        });

        // New users go through onboarding
        const onboardingDest = role === 'TRADIE' ? '/tradie/onboarding/business' : '/onboarding/customer';
        return NextResponse.redirect(`${origin}${onboardingDest}`);
      }

      const dest =
        redirectTo !== '/dashboard'
          ? redirectTo
          : role === 'TRADIE'
          ? '/tradie/dashboard'
          : role === 'ADMIN'
          ? '/admin'
          : '/dashboard';
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
