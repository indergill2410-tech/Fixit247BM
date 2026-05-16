import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createConnectedAccount, createOnboardingLink } from '@fixit247/payments';
import { db } from '@fixit247/database';

export async function POST() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    { cookies: { getAll() { return cookieStore.getAll(); }, setAll(c) { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } } },
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const tradieProfile = await db.tradieProfile.findUnique({ where: { userId: user.id } });
  if (!tradieProfile) return NextResponse.json({ error: 'Tradie profile not found' }, { status: 404 });

  let stripeAccountId = tradieProfile.stripeAccountId;
  if (!stripeAccountId) {
    stripeAccountId = await createConnectedAccount(user.email!);
    await db.tradieProfile.update({ where: { id: tradieProfile.id }, data: { stripeAccountId } });
  }

  const appUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000';
  const url = await createOnboardingLink(
    stripeAccountId,
    `${appUrl}/tradie/dashboard?stripe=success`,
    `${appUrl}/tradie/onboarding/business?stripe=refresh`,
  );

  return NextResponse.json({ url });
}
