import { stripe } from './stripe';
import { db } from '@fixit247/database';

export interface RefundRequest {
  jobId: string;
  reason: string;
  amount?: number; // partial refund; omit for full
  requestedBy: string;
}

export async function initiateRefund(req: RefundRequest): Promise<{ refundId: string; amount: number }> {
  const payment = await db.payment.findUnique({ where: { jobId: req.jobId } });
  if (!payment?.stripePaymentIntentId) throw new Error('No payment to refund');

  const refundAmount = req.amount ?? Number(payment.amount);

  // Idempotency key ties the refund to the specific payment intent.
  // Using Date.now() suffix allows a new refund attempt after the first
  // succeeds (e.g. partial refund followed by another), while still
  // deduplicating rapid retries within the same second.
  const refund = await stripe.refunds.create(
    {
      payment_intent: payment.stripePaymentIntentId,
      amount: Math.round(refundAmount * 100),
      reason: 'requested_by_customer',
      refund_application_fee: true,
      reverse_transfer: true,
      metadata: { jobId: req.jobId, reason: req.reason, requestedBy: req.requestedBy },
    },
    { idempotencyKey: `refund_${payment.stripePaymentIntentId}_${Date.now()}` },
  );

  await db.payment.update({
    where: { jobId: req.jobId },
    data: {
      status: 'REFUNDED',
      refundedAt: new Date(),
      refundAmount: refundAmount,
      refundReason: req.reason,
    },
  });

  return { refundId: refund.id, amount: refundAmount };
}

export function calculateCancellationFee(opts: {
  agreedPrice: number;
  isEmergency: boolean;
  minutesSinceAccepted: number;
}): number {
  // No fee if cancelled within 5 minutes of accepting (change of mind)
  if (opts.minutesSinceAccepted <= 5) return 0;

  // Emergency jobs: 20% cancellation fee if tradie is en-route
  if (opts.isEmergency && opts.minutesSinceAccepted > 10) {
    return Math.round(opts.agreedPrice * 0.20 * 100) / 100;
  }

  // Standard: 10% after 30 minutes
  if (opts.minutesSinceAccepted > 30) {
    return Math.round(opts.agreedPrice * 0.10 * 100) / 100;
  }

  return 0;
}
