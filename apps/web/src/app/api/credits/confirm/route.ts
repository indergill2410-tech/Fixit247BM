import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { stripe, addCredits } from '@fixit247/payments';
import { z } from 'zod';

const Schema = z.object({ paymentIntentId: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const { paymentIntentId } = Schema.parse(await req.json());

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (pi.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 });
    }
    if (pi.metadata.userId !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Idempotency: check if credits already added for this payment intent
    const existing = await db.creditLedger.findFirst({ where: { referenceId: paymentIntentId } });
    if (existing) {
      const balance = await db.creditsWallet.findUnique({ where: { userId: session.id } });
      return NextResponse.json({ success: true, creditsAdded: 0, newBalance: Number(balance?.balance ?? 0) });
    }

    const packageId = pi.metadata.packageId;
    const credits = parseInt(pi.metadata.credits, 10);
    const pkg = await db.creditPackage.findUnique({ where: { id: packageId } });

    const tradieProfile = await db.tradieProfile.findUnique({ where: { userId: session.id } });
    if (!tradieProfile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const { balanceAfter } = await addCredits({
      userId: session.id,
      tradieProfileId: tradieProfile.id,
      credits,
      type: 'PURCHASE',
      description: `Purchased ${credits} credits${pkg ? ` — ${pkg.name}` : ''}`,
      referenceId: paymentIntentId,
      packageId,
    });

    return NextResponse.json({ success: true, creditsAdded: credits, newBalance: balanceAfter });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    console.error('[POST /api/credits/confirm]', err);
    return NextResponse.json({ error: 'Failed to confirm credits' }, { status: 500 });
  }
}
