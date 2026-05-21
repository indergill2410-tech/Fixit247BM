import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { db } from '@fixit247/database';
import { customerOnboardingSchema } from '@/lib/validators/onboarding';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll(c: { name: string; value: string; options: Record<string, unknown> }[]) { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } } },
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json() as unknown;
  const parsed = customerOnboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 });
  }

  const { firstName, lastName, phone, street, suburb, postcode, state, notifyBySms, notifyByEmail, emergencyContactName, emergencyContactPhone } = parsed.data;

  try {
    await db.$transaction(async (tx) => {
      await tx.user.upsert({
        where: { id: user.id },
        create: { id: user.id, email: user.email!, firstName, lastName, role: 'CUSTOMER', phone },
        update: { firstName, lastName, phone },
      });

      const profile = await tx.customerProfile.upsert({
        where: { userId: user.id },
        create: { userId: user.id, suburb, postcode, state: state as string, notifyBySms, notifyByEmail, emergencyContactName, emergencyContactPhone },
        update: { suburb, postcode, state: state as string, notifyBySms, notifyByEmail },
      });

      await tx.address.create({
        data: {
          userId: user.id,
          street,
          suburb,
          city: suburb,
          state: state as string,
          postcode,
          isDefault: true,
          customerProfileId: profile.id,
        },
      });
    });

    // Award 5 referral/welcome credits to the customer on first onboarding completion
    await db.creditsWallet.upsert({
      where: { userId: user.id },
      create: { userId: user.id, balance: 5, lifetimeEarned: 5, lifetimeSpent: 0 },
      update: {}, // do not overwrite an existing wallet balance
    });

    await supabase.auth.updateUser({ data: { firstName, lastName, onboardingComplete: true } });
    return NextResponse.json({ success: true, freeCreditsAwarded: 5 });
  } catch (err) {
    logger.error('Customer onboarding error:', err);
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
  }
}
