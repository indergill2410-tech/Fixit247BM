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
}) {
  return stripe.paymentIntents.create({
    amount: Math.round(opts.amount * 100),
    currency: opts.currency,
    customer: opts.customerId,
    application_fee_amount: Math.round(opts.platformFee * 100),
    transfer_data: { destination: opts.connectedAccountId },
    metadata: opts.metadata,
    capture_method: 'manual',
  });
}

export async function capturePaymentIntent(paymentIntentId: string) {
  return stripe.paymentIntents.capture(paymentIntentId);
}

export async function refundPayment(paymentIntentId: string, amount?: number) {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    ...(amount !== undefined && { amount: Math.round(amount * 100) }),
    refund_application_fee: true,
    reverse_transfer: true,
  });
}

export async function constructWebhookEvent(payload: string | Buffer, sig: string) {
  const secret = process.env['STRIPE_WEBHOOK_SECRET'];
  if (!secret) throw new Error('Missing STRIPE_WEBHOOK_SECRET');
  return stripe.webhooks.constructEvent(payload, sig, secret);
}
