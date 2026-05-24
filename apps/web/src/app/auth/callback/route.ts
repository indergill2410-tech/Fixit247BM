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
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
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
    if (!error) {
      const { user } = data;

      // Google OAuth can omit email — reject rather than crash the DB insert.
      if (!user.email) {
        return NextResponse.redirect(`${origin}/login?error=email_required`);
      }
      const userEmail = user.email;

      const meta = user.user_metadata as Record<string, unknown>;
      const metaRole = (meta.role as string | undefined) ?? 'CUSTOMER';

      const existing = await db.user.findFirst({ where: { id: user.id } });
      if (!existing) {
        const fullName = (meta.full_name as string | undefined) ?? '';
        const nameParts = fullName.split(' ');
        try {
          await db.$transaction(async (tx) => {
            await tx.user.create({
              data: {
                id: user.id,
                email: userEmail,
                firstName: ((meta.firstName as string | undefined) ?? nameParts[0]) || '',
                lastName: (meta.lastName as string | undefined) ?? nameParts.slice(1).join(' '),
                role: metaRole as never,
                isActive: true,
                emailVerified: new Date(),
              },
            });
            if (metaRole === 'TRADIE') {
              await tx.tradieProfile.create({
                data: { userId: user.id, verificationStatus: 'PENDING', onboardingStatus: 'INCOMPLETE', onboardingStep: 0 },
              });
            } else {
              await tx.customerProfile.create({ data: { userId: user.id } });
            }
          });
        } catch (dbErr: unknown) {
          // A concurrent OAuth redirect already created the row — treat as existing user.
          const isUniqueViolation = dbErr instanceof Error && dbErr.message.includes('Unique constraint');
          if (!isUniqueViolation) {
            return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
          }
        }

        // New users go through onboarding (unique-violation path falls through here too,
        // sending the duplicate request through onboarding which will detect completion).
        const onboardingDest = metaRole === 'TRADIE' ? '/tradie/onboarding/business' : '/onboarding/customer';
        return NextResponse.redirect(`${origin}${onboardingDest}`);
      }

      // Use the DB role — not user_metadata — as the authoritative source.
      const dbRole = existing.role as string;
      const dest =
        redirectTo !== '/dashboard'
          ? redirectTo
          : dbRole === 'TRADIE'
          ? '/tradie/dashboard'
          : dbRole === 'ADMIN' || dbRole === 'SUPER_ADMIN'
          ? '/admin'
          : '/dashboard';
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
