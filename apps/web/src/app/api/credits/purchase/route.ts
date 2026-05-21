import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';
import { stripe, addCredits } from '@fixit247/payments';
import { logger } from '@/lib/logger';

const Schema = z.object({
  packageId: z.string().uuid(),
  paymentMethodId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    if (session.role !== 'TRADIE') {
      return NextResponse.json({ error: 'Only tradies can purchase credits' }, { status: 403 });
    }

    const body = await req.json();
    const { packageId, paymentMethodId } = Schema.parse(body);

    const pkg = await db.creditPackage.findUnique({ where: { id: packageId, isActive: true } });
    if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 404 });

    const tradieProfile = await db.tradieProfile.findUnique({ where: { userId: session.id } });
    if (!tradieProfile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    // Charge the payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(pkg.priceAud) * 100),
      currency: 'aud',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: {
        type: 'credit_purchase',
        userId: session.id,
        packageId,
        credits: String(pkg.credits + pkg.bonusCredits),
      },
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/tradie/wallet`,
    });

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: 'Payment did not succeed', status: paymentIntent.status }, { status: 402 });
    }

    const totalCredits = pkg.credits + pkg.bonusCredits;
    await addCredits({
      userId: session.id,
      tradieProfileId: tradieProfile.id,
      credits: totalCredits,
      type: 'PURCHASE',
      description: `Purchased ${pkg.credits} credits${pkg.bonusCredits > 0 ? ` + ${pkg.bonusCredits} bonus` : ''} — ${pkg.name}`,
      referenceId: paymentIntent.id,
      packageId,
    });

    const balance = await db.creditsWallet.findUnique({ where: { userId: session.id } });

    return NextResponse.json({
      success: true,
      creditsAdded: totalCredits,
      newBalance: Number(balance?.balance ?? 0),
    });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid data', details: err.errors }, { status: 400 });
    logger.error('[POST /api/credits/purchase]', err);
    return NextResponse.json({ error: 'Failed to purchase credits' }, { status: 500 });
  }
}
