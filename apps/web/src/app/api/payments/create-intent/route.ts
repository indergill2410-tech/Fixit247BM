import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';
import { stripe, calculateJobPricing } from '@fixit247/payments';

const Schema = z.object({
  jobId: z.string().uuid(),
  agreedPrice: z.number().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    if (session.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { jobId, agreedPrice } = Schema.parse(body);

    const job = await db.job.findUnique({
      where: { id: jobId },
      include: {
        tradie: { include: { user: true } },
        customer: { include: { user: true } },
      },
    });

    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    if (job.status !== 'CLAIMED') return NextResponse.json({ error: 'Job is not in CLAIMED state' }, { status: 409 });
    if (!job.tradie?.stripeAccountId) return NextResponse.json({ error: 'Tradie not set up for payments' }, { status: 422 });

    const pricing = calculateJobPricing({
      baseAmount: agreedPrice,
      complexity: (job.complexity as 'SIMPLE' | 'MEDIUM' | 'COMPLEX') ?? 'MEDIUM',
      priority: (job.priority as 'STANDARD' | 'URGENT' | 'EMERGENCY'),
    });

    // Get or create Stripe customer for this user
    let stripeCustomerId = (await db.payment.findFirst({ where: { customerId: job.customerId }, select: { stripeCustomerId: true } }))?.stripeCustomerId ?? null;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: job.customer.user.email,
        name: `${job.customer.user.firstName} ${job.customer.user.lastName}`,
        metadata: { userId: job.customer.userId },
      });
      stripeCustomerId = customer.id;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(pricing.totalCustomerPayment * 100),
      currency: 'aud',
      customer: stripeCustomerId,
      application_fee_amount: Math.round(pricing.platformFee * 100),
      transfer_data: { destination: job.tradie.stripeAccountId },
      capture_method: 'manual',
      metadata: {
        jobId,
        customerId: job.customerId,
        tradieId: job.tradieId ?? '',
        platform: 'fixit247',
      },
    });

    // Upsert payment record
    await db.payment.upsert({
      where: { jobId },
      create: {
        jobId,
        customerId: job.customerId,
        tradieId: job.tradieId!,
        amount: pricing.totalCustomerPayment,
        platformFee: pricing.platformFee,
        tradieAmount: pricing.tradieAmount,
        stripePaymentIntentId: paymentIntent.id,
        stripeCustomerId,
        status: 'PENDING',
      },
      update: {
        amount: pricing.totalCustomerPayment,
        platformFee: pricing.platformFee,
        tradieAmount: pricing.tradieAmount,
        stripePaymentIntentId: paymentIntent.id,
        stripeCustomerId,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      pricing,
    });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid data', details: err.errors }, { status: 400 });
    console.error('[POST /api/payments/create-intent]', err);
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
