import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@fixit247/payments';
import {
  handlePaymentIntentSucceeded,
  handlePaymentIntentFailed,
  handleSubscriptionUpdated,
  handleTransferCreated,
  handleConnectedAccountUpdated,
} from '@fixit247/payments';
import type Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(payload, sig) as Stripe.Event;
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'transfer.created':
        await handleTransferCreated(event.data.object as Stripe.Transfer);
        break;
      case 'account.updated':
        await handleConnectedAccountUpdated(event.data.object as Stripe.Account);
        break;
      default:
        // Unhandled event — acknowledged but not processed
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`[Webhook] Error handling ${event.type}:`, err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
