import { db } from '@fixit247/database';
import { addCredits } from './credits';
import { SUBSCRIPTION_PLANS } from './subscriptions';
import type Stripe from 'stripe';

export async function handlePaymentIntentSucceeded(event: Stripe.PaymentIntent): Promise<void> {
  const jobId = event.metadata.jobId;
  if (!jobId) return;

  await db.payment.updateMany({
    where: { stripePaymentIntentId: event.id },
    data: { status: 'HELD_IN_ESCROW', paidAt: new Date() },
  });

  await db.jobEvent.create({
    data: {
      jobId,
      type: 'PAYMENT_RECEIVED',
      metadata: { paymentIntentId: event.id, amount: event.amount },
    },
  });
}

export async function handlePaymentIntentFailed(event: Stripe.PaymentIntent): Promise<void> {
  const jobId = event.metadata.jobId;
  if (!jobId) return;

  await db.payment.updateMany({
    where: { stripePaymentIntentId: event.id },
    data: { status: 'FAILED' },
  });
}

export async function handleSubscriptionUpdated(event: Stripe.Subscription): Promise<void> {
  const userId = event.metadata.userId;
  const tier = (event.metadata.tier) ?? 'FREE';
  if (!userId) return;

  const isActive = event.status === 'active' || event.status === 'trialing';

  await db.subscription.updateMany({
    where: { stripeSubscriptionId: event.id },
    data: {
      status: isActive ? 'ACTIVE' : 'CANCELLED',
      currentPeriodStart: new Date(event.current_period_start * 1000),
      currentPeriodEnd: new Date(event.current_period_end * 1000),
      cancelAtPeriodEnd: event.cancel_at_period_end,
    },
  });

  // Grant monthly bonus credits on renewal
  if (isActive && tier in SUBSCRIPTION_PLANS) {
    const plan = SUBSCRIPTION_PLANS[tier as keyof typeof SUBSCRIPTION_PLANS];
    if (plan.monthlyBonusCredits > 0) {
      const tradieProfile = await db.tradieProfile.findUnique({ where: { userId } });
      if (tradieProfile) {
        await addCredits({
          userId,
          tradieProfileId: tradieProfile.id,
          credits: plan.monthlyBonusCredits,
          type: 'SUBSCRIPTION_CREDIT',
          description: `Monthly bonus credits — ${plan.name} plan`,
        });
      }
    }
  }
}

export async function handleTransferCreated(event: Stripe.Transfer): Promise<void> {
  if (!event.metadata.payoutId) return;

  await db.payout.updateMany({
    where: { id: event.metadata.payoutId },
    data: {
      stripeTransferId: event.id,
      status: 'PAID',
      processedAt: new Date(),
    },
  });
}

export async function handleConnectedAccountUpdated(event: Stripe.Account): Promise<void> {
  if (event.details_submitted && event.charges_enabled) {
    await db.tradieProfile.updateMany({
      where: { stripeAccountId: event.id },
      data: { stripeOnboardingDone: true },
    });
  }
}

export async function handleInvoicePaymentFailed(event: Stripe.Invoice): Promise<void> {
  const subscriptionId = typeof event.subscription === 'string'
    ? event.subscription
    : event.subscription?.id;

  if (!subscriptionId) return;

  await db.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: 'PAST_DUE' as never },
  });
}
