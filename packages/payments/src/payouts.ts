import { stripe } from './stripe';
import { db } from '@fixit247/database';
import type { Prisma } from '@fixit247/database';

export async function releaseJobPayment(jobId: string): Promise<{ payoutId: string }> {
  const payment = await db.payment.findUnique({ where: { jobId } });
  if (!payment) throw new Error('Payment not found');
  if (!payment.stripePaymentIntentId) throw new Error('No payment intent');
  if (payment.status !== 'HELD_IN_ESCROW') throw new Error('Payment not in escrow');

  // Capture the held payment intent (releases funds)
  await stripe.paymentIntents.capture(payment.stripePaymentIntentId);

  const payout = await db.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.payment.update({
      where: { jobId },
      data: { status: 'RELEASED', releasedAt: new Date() },
    });

    return tx.payout.create({
      data: {
        tradieId: payment.tradieId,
        jobId,
        amount: payment.tradieAmount,
        status: 'PROCESSING',
      },
    });
  });

  return { payoutId: payout.id };
}

export async function holdPayout(payoutId: string, reason: string, adminId: string): Promise<void> {
  await db.payout.update({
    where: { id: payoutId },
    data: { isHeld: true, heldReason: reason, heldBy: adminId, status: 'HELD' },
  });
}

export async function releasePayout(payoutId: string): Promise<void> {
  await db.payout.update({
    where: { id: payoutId },
    data: { isHeld: false, heldReason: null, heldBy: null, status: 'PROCESSING' },
  });
}

export async function getPayoutHistory(tradieId: string, limit = 20, offset = 0) {
  const [payouts, total] = await Promise.all([
    db.payout.findMany({
      where: { tradieId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    db.payout.count({ where: { tradieId } }),
  ]);
  return { payouts, total };
}
