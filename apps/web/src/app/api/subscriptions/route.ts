import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { z } from 'zod';
import { createSubscription, getCurrentSubscription, SUBSCRIPTION_PLANS } from '@fixit247/payments';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const session = await requireSession();
    const subscription = await getCurrentSubscription(session.id);
    const plans = SUBSCRIPTION_PLANS;
    return NextResponse.json({ subscription, plans });
  } catch (err) {
    logger.error('[GET /api/subscriptions]', err);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}

const CreateSchema = z.object({
  tier: z.enum(['BASIC', 'PROFESSIONAL', 'ELITE']),
  stripeCustomerId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const { tier, stripeCustomerId } = CreateSchema.parse(body);

    const result = await createSubscription({
      userId: session.id,
      stripeCustomerId,
      tier,
    });

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid data', details: err.errors }, { status: 400 });
    logger.error('[POST /api/subscriptions]', err);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}
