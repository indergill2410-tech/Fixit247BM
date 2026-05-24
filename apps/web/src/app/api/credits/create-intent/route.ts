import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { stripe } from '@fixit247/payments';
import { z } from 'zod';

const Schema = z.object({ packageId: z.string().uuid() });

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    if (session.role !== 'TRADIE') {
      return NextResponse.json({ error: 'Only tradies can purchase credits' }, { status: 403 });
    }

    const { packageId } = Schema.parse(await req.json());
    const pkg = await db.creditPackage.findUnique({ where: { id: packageId, isActive: true } });
    if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 404 });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(pkg.priceAud) * 100),
      currency: 'aud',
      metadata: {
        type: 'credit_purchase',
        userId: session.id,
        packageId,
        credits: String(pkg.credits + pkg.bonusCredits),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      credits: pkg.credits + pkg.bonusCredits,
    });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    console.error('[POST /api/credits/create-intent]', err);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
