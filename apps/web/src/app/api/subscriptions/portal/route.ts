import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { createBillingPortalSession, cancelSubscription } from '@fixit247/payments';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await (req.json() as Promise<{ action?: string }>).catch(() => ({} as { action?: string }));
    const action = body.action;

    if (action === 'cancel') {
      await cancelSubscription(session.id);
      return NextResponse.json({ success: true });
    }

    // Get Stripe customer ID from a payment record
    const payment = await db.payment.findFirst({
      where: { customerId: { not: undefined } },
      select: { stripeCustomerId: true },
    });

    const stripeCustomerId = payment?.stripeCustomerId;
    if (!stripeCustomerId) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 404 });
    }

    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/tradie/subscription`;
    const url = await createBillingPortalSession(stripeCustomerId, returnUrl);

    return NextResponse.json({ url });
  } catch (err) {
    logger.error('[POST /api/subscriptions/portal]', err);
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}
