import { NextResponse } from 'next/server';
import { requireApiSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { getWalletBalance, getAvailableCreditPackages } from '@fixit247/payments';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const session = await requireApiSession();
    if (session instanceof NextResponse) return session;

    const [balance, packages] = await Promise.all([
      getWalletBalance(session.id),
      getAvailableCreditPackages(),
    ]);

    // Subscription info
    const subscription = await db.subscription.findUnique({
      where: { userId: session.id },
      select: { tier: true, status: true, currentPeriodEnd: true },
    });

    return NextResponse.json({ balance, packages, subscription });
  } catch (err) {
    logger.error('[GET /api/credits/balance]', err);
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 });
  }
}
