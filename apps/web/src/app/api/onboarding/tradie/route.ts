import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { db } from '@fixit247/database';
import type { TradeCategory } from '@fixit247/database';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const tradieOnboardingPayload = z.object({
  business: z.object({
    businessName: z.string(),
    abn: z.string().optional(),
    phone: z.string(),
    trades: z.array(z.string()),
    serviceSuburbs: z.array(z.string()),
    serviceRadiusKm: z.number(),
    bio: z.string().optional(),
  }).optional(),
  verification: z.object({
    hasLicense: z.boolean(),
    licenceType: z.string().optional(),
    licenceNumber: z.string().optional(),
    licenceState: z.string().optional(),
    hasInsurance: z.boolean(),
    insurer: z.string().optional(),
    policyNumber: z.string().optional(),
  }).optional(),
  profile: z.object({
    yearsExperience: z.number(),
    hourlyRate: z.number().optional(),
    calloutFee: z.number().optional(),
  }).optional(),
});

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll(c: { name: string; value: string; options: Record<string, unknown> }[]) { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } } },
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Only TRADIE-role accounts may submit tradie onboarding data.
  const appMeta = (user.app_metadata ?? {}) as Record<string, unknown>;
  const userMeta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const role = (appMeta.role ?? userMeta.role) as string | undefined;
  if (role !== 'TRADIE') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json() as unknown;
  const parsed = tradieOnboardingPayload.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  const { business, verification, profile } = parsed.data;

  try {
    await db.$transaction(async (tx) => {
      await tx.user.upsert({
        where: { id: user.id },
        create: {
          id: user.id,
          email: user.email ?? '',
          firstName: ((user.user_metadata as Record<string, unknown>).firstName as string | undefined) ?? '',
          lastName: ((user.user_metadata as Record<string, unknown>).lastName as string | undefined) ?? '',
          role: 'TRADIE',
          phone: business?.phone,
        },
        update: { phone: business?.phone },
      });

      await tx.tradieProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          businessName: business?.businessName,
          abn: business?.abn ?? null,
          bio: business?.bio,
          trades: (business?.trades ?? []) as TradeCategory[],
          serviceRadiusKm: business?.serviceRadiusKm ?? 25,
          yearsExperience: profile?.yearsExperience,
          hourlyRate: profile?.hourlyRate,
          calloutFee: profile?.calloutFee,
          onboardingStatus: 'PENDING_REVIEW',
          onboardingStep: 4,
          verificationStatus: 'PENDING',
        },
        update: {
          businessName: business?.businessName,
          bio: business?.bio,
          trades: (business?.trades ?? []) as TradeCategory[],
          yearsExperience: profile?.yearsExperience,
          hourlyRate: profile?.hourlyRate,
          calloutFee: profile?.calloutFee,
          onboardingStatus: 'PENDING_REVIEW',
          verificationStatus: 'PENDING',
        },
      });

      const tradieProfile = await tx.tradieProfile.findUniqueOrThrow({ where: { userId: user.id } });

      if (verification?.hasLicense && verification.licenceNumber) {
        // upsert prevents duplicate rows when the form is resubmitted
        const existingLicence = await tx.licence.findFirst({
          where: { tradieId: tradieProfile.id, licenceNumber: verification.licenceNumber },
        });
        if (!existingLicence) {
          await tx.licence.create({
            data: {
              tradieId: tradieProfile.id,
              licenceType: verification.licenceType ?? 'TRADE',
              licenceNumber: verification.licenceNumber,
              state: verification.licenceState ?? '',
              status: 'PENDING',
            },
          });
        }
      }

      if (verification?.hasInsurance && verification.insurer) {
        const existingInsurance = await tx.insurance.findFirst({
          where: { tradieId: tradieProfile.id, policyNumber: verification.policyNumber ?? '' },
        });
        if (!existingInsurance) {
          await tx.insurance.create({
            data: {
              tradieId: tradieProfile.id,
              insurer: verification.insurer,
              policyNumber: verification.policyNumber ?? '',
              coverType: 'PUBLIC_LIABILITY',
              coverAmount: 5000000,
              expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
              status: 'PENDING',
            },
          });
        }
      }
    });

    // Award 10 free credits to the tradie on first onboarding completion
    await db.creditsWallet.upsert({
      where: { userId: user.id },
      create: { userId: user.id, balance: 10, lifetimeEarned: 10, lifetimeSpent: 0 },
      update: {}, // do not overwrite an existing wallet balance
    });

    await supabase.auth.updateUser({ data: { onboardingComplete: true } });
    return NextResponse.json({ success: true, freeCreditsAwarded: 10 });
  } catch (err) {
    logger.error('Tradie onboarding error:', err);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
