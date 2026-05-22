import { stripe } from './stripe';

export async function createConnectedAccount(email: string): Promise<string> {
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'AU',
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: 'individual',
    settings: {
      payouts: { schedule: { interval: 'weekly', weekly_anchor: 'monday' } },
    },
  });
  return account.id;
}

export async function createOnboardingLink(
  accountId: string,
  returnUrl: string,
  refreshUrl: string,
): Promise<string> {
  const link = await stripe.accountLinks.create({
    account: accountId,
    return_url: returnUrl,
    refresh_url: refreshUrl,
    type: 'account_onboarding',
  });
  return link.url;
}

export async function createPaymentIntent(opts: {
  amount: number;
  currency: string;
  customerId: string;
  connectedAccountId: string;
  platformFee: number;
  metadata: Record<string, string>;
  jobId?: string;
}) {
  // Idempotency key prevents double-charges if the request is retried
  const idempotencyKey = opts.jobId
    ? `pi_${opts.jobId}_${opts.customerId}`
    : undefined;

  return stripe.paymentIntents.create(
    {
      amount: Math.round(opts.amount * 100),
      currency: opts.currency,
      customer: opts.customerId,
      application_fee_amount: Math.round(opts.platformFee * 100),
      transfer_data: { destination: opts.connectedAccountId },
      metadata: opts.metadata,
      capture_method: 'manual',
    },
    idempotencyKey ? { idempotencyKey } : undefined,
  );
}

export async function capturePaymentIntent(paymentIntentId: string) {
  // Idempotency key prevents double-capture if the request is retried
  return stripe.paymentIntents.capture(
    paymentIntentId,
    {},
    { idempotencyKey: `capture_${paymentIntentId}` },
  );
}

export async function refundPayment(paymentIntentId: string, amount?: number) {
  // Idempotency key uses a timestamp suffix so partial refunds can be retried
  // independently, but a given retry window won't create duplicate refunds
  return stripe.refunds.create(
    {
      payment_intent: paymentIntentId,
      ...(amount !== undefined && { amount: Math.round(amount * 100) }),
      refund_application_fee: true,
      reverse_transfer: true,
    },
    { idempotencyKey: `refund_${paymentIntentId}_${Date.now()}` },
  );
}

export function constructWebhookEvent(payload: string | Buffer, sig: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error('Missing STRIPE_WEBHOOK_SECRET');
  return stripe.webhooks.constructEvent(payload, sig, secret);
}
