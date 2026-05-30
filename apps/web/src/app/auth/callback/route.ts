import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createServiceRoleClient } from '@/lib/supabase/server';
import { getDashboardTarget, normalizeRedirectTarget } from '@/lib/auth/redirects';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';

async function createDbUser(
  tx: Parameters<Parameters<typeof db.$transaction>[0]>[0],
  userId: string,
  email: string,
  meta: Record<string, unknown>,
  metaRole: 'CUSTOMER' | 'TRADIE',
) {
  const fullName = (meta.full_name as string | undefined) ?? '';
  const nameParts = fullName.split(' ');
  await tx.user.create({
    data: {
      id: userId,
      email,
      firstName: (meta.firstName as string | undefined) ?? nameParts[0] ?? '',
      lastName: (meta.lastName as string | undefined) ?? nameParts.slice(1).join(' '),
      role: metaRole,
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

// Only CUSTOMER and TRADIE may self-register. Any other value is clamped to CUSTOMER.
function safeRole(raw: string | undefined): 'CUSTOMER' | 'TRADIE' {
  return raw === 'TRADIE' ? 'TRADIE' : 'CUSTOMER';
}

function redirectToTarget(origin: string, target: string): NextResponse {
  return NextResponse.redirect(target.startsWith('http') ? target : `${origin}${target}`);
}

export async function GET(request: NextRequest) {
  try {
    return await handleCallback(request);
  } catch (err) {
    logger.error('[auth/callback] unhandled error', err);
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }
}

// Use NEXT_PUBLIC_SITE_URL so redirects work correctly behind Render's reverse proxy.
// request.url can contain the internal container address (e.g. http://0.0.0.0:PORT)
// when the proxy doesn't rewrite the Host header before the route handler sees it.
function getOrigin(request: NextRequest): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL;
  if (siteUrl) {
    return siteUrl.replace(/\/$/, '');
  }
  // Fallback: reconstruct from forwarded headers (standard reverse-proxy headers)
  const proto = request.headers.get('x-forwarded-proto')?.split(',')[0].trim() ?? new URL(request.url).protocol.replace(':', '');
  const host = request.headers.get('x-forwarded-host')?.split(',')[0].trim() ?? request.headers.get('host');
  if (host) return `${proto}://${host}`;
  return new URL(request.url).origin;
}

async function handleCallback(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = getOrigin(request);
  const code       = searchParams.get('code');
  const tokenHash  = searchParams.get('token_hash');
  const type       = searchParams.get('type');
  const redirectTo = normalizeRedirectTarget(searchParams.get('redirectTo'), origin);

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
    const dbRole = existing.role;
    const dest   = redirectTo !== '/dashboard' ? redirectTo
      : getDashboardTarget(dbRole);
    return redirectToTarget(origin, dest);
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

      // Single admin call writes both app_metadata (tamper-proof) and user_metadata
      // (client-readable JWT) in one round-trip, eliminating partial-failure states.
      try {
        const admin = createServiceRoleClient();
        await admin.auth.admin.updateUserById(user.id, {
          app_metadata: { role: metaRole },
          user_metadata: { ...meta, role: metaRole, onboardingComplete: false, firstName, lastName: rest.join(' ') },
        });
      } catch (metaErr) {
        logger.error('[auth/callback] app_metadata write failed — role will repair on next login', metaErr);
      }
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

    const dbRole = existing.role;
    const dest   = redirectTo !== '/dashboard' ? redirectTo
      : getDashboardTarget(dbRole);
    return redirectToTarget(origin, dest);
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
} // end handleCallback
