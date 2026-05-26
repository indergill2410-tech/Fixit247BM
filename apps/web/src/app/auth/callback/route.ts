import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';

async function createDbUser(
  tx: Parameters<Parameters<typeof db.$transaction>[0]>[0],
  userId: string,
  email: string,
  meta: Record<string, unknown>,
  metaRole: string,
) {
  const fullName = (meta.full_name as string | undefined) ?? '';
  const nameParts = fullName.split(' ');
  await tx.user.create({
    data: {
      id: userId,
      email,
      firstName: (meta.firstName as string | undefined) ?? nameParts[0] ?? '',
      lastName: (meta.lastName as string | undefined) ?? nameParts.slice(1).join(' '),
      role: metaRole as never,
      isActive: true,
      emailVerified: new Date(),
    },
  });
  if (metaRole === 'TRADIE') {
    await tx.tradieProfile.create({
      data: { userId, verificationStatus: 'PENDING', onboardingStatus: 'INCOMPLETE', onboardingStep: 0 },
    });
  } else {
    await tx.customerProfile.create({ data: { userId } });
  }
}

function safeRole(raw: string | undefined): 'CUSTOMER' | 'TRADIE' {
  return raw === 'TRADIE' ? 'TRADIE' : 'CUSTOMER';
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code       = searchParams.get('code');
  const tokenHash  = searchParams.get('token_hash');
  const type       = searchParams.get('type');
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard';

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    },
  );

  // ── Email confirmation / magic-link flow ─────────────────────────────────────
  if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as 'signup' | 'recovery' | 'email_change' | 'magiclink',
    });

    if (error || !data.user) {
      logger.error('[auth/callback] verifyOtp failed', error);
      return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
    }

    const { user } = data;
    if (!user.email) return NextResponse.redirect(`${origin}/login?error=email_required`);

    const meta     = user.user_metadata as Record<string, unknown>;
    const metaRole = safeRole(meta.role as string | undefined);

    const existing = await db.user.findFirst({ where: { id: user.id } });
    if (!existing) {
      try {
        await db.$transaction((tx) => createDbUser(tx, user.id, user.email!, meta, metaRole));
      } catch (dbErr: unknown) {
        const isUnique = dbErr instanceof Error && dbErr.message.includes('Unique constraint');
        if (!isUnique) {
          logger.error('[auth/callback] DB create failed (email)', dbErr);
          return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
        }
      }
      const dest = metaRole === 'TRADIE' ? '/tradie/onboarding/business' : '/onboarding';
      return NextResponse.redirect(`${origin}${dest}`);
    }

    // Existing user — password reset or re-verification; send to dashboard
    const dbRole = safeRole(existing.role as string | undefined);
    const dest   = redirectTo !== '/dashboard' ? redirectTo
      : dbRole === 'TRADIE' ? '/tradie/dashboard'
      : '/dashboard';
    return NextResponse.redirect(`${origin}${dest}`);
  }

  // ── Google OAuth flow ────────────────────────────────────────────────────────
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error || !data.user) {
      logger.error('[auth/callback] exchangeCodeForSession failed', error);
      return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
    }

    const { user } = data;
    if (!user.email) return NextResponse.redirect(`${origin}/login?error=email_required`);

    const meta = user.user_metadata as Record<string, unknown>;
    let metaRole = safeRole(meta.role as string | undefined);

    // First Google login — no role persisted yet; pick up the login form's selection.
    if (!meta.role) {
      const rawRole = searchParams.get('googleRole');
      metaRole = safeRole(rawRole ?? undefined);
      const fullName = (meta.full_name as string | undefined) ?? '';
      const [firstName = '', ...rest] = fullName.split(' ');
      await supabase.auth.updateUser({
        data: { role: metaRole, onboardingComplete: false, firstName, lastName: rest.join(' ') },
      });
    }

    const existing = await db.user.findFirst({ where: { id: user.id } });
    if (!existing) {
      try {
        await db.$transaction((tx) => createDbUser(tx, user.id, user.email!, meta, metaRole));
      } catch (dbErr: unknown) {
        const isUnique = dbErr instanceof Error && dbErr.message.includes('Unique constraint');
        if (!isUnique) {
          logger.error('[auth/callback] DB create failed (OAuth)', dbErr);
          return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
        }
      }
      const dest = metaRole === 'TRADIE' ? '/tradie/onboarding/business' : '/onboarding';
      return NextResponse.redirect(`${origin}${dest}`);
    }

    const dbRole = safeRole(existing.role as string | undefined);
    const dest   = redirectTo !== '/dashboard' ? redirectTo
      : dbRole === 'TRADIE'  ? '/tradie/dashboard'
      : dbRole === 'ADMIN' || dbRole === 'SUPER_ADMIN' ? '/admin'
      : '/dashboard';
    return NextResponse.redirect(`${origin}${dest}`);
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
