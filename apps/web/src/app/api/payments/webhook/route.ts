import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { constructWebhookEvent } from '@fixit247/payments';
import {
  handlePaymentIntentSucceeded,
  handlePaymentIntentFailed,
  handleSubscriptionUpdated,
  handleTransferCreated,
  handleConnectedAccountUpdated,
} from '@fixit247/payments';
import { db } from '@fixit247/database';
import type Stripe from 'stripe';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

/**
 * In-memory deduplication guard for non-payment webhook events.
 * Stripe retries webhooks on failure, so we must be idempotent.
 *
 * For payment_intent events the Payment row's unique stripePaymentIntentId
 * field provides a durable DB-level guard (see handlePaymentIntentSucceeded).
 * This Map covers the remaining event types for the lifetime of the process.
 * TTL is 24 hours — well beyond Stripe's retry window.
 */
const processedEvents = new Map<string, number>();
const EVENT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function isEventAlreadyProcessed(eventId: string): boolean {
  const ts = processedEvents.get(eventId);
  if (ts === undefined) return false;
  // Clean up expired entries while we're here
  if (Date.now() - ts > EVENT_TTL_MS) {
    processedEvents.delete(eventId);
    return false;
  }
  return true;
}

function markEventProcessed(eventId: string): void {
  processedEvents.set(eventId, Date.now());
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(payload, sig);
  } catch (err) {
    logger.error('[Webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // --- Webhook deduplication -----------------------------------------------
  // payment_intent events: use the DB's unique stripePaymentIntentId constraint
  // as a durable guard so we survive process restarts.
  if (
    event.type === 'payment_intent.succeeded' ||
    event.type === 'payment_intent.payment_failed'
  ) {
    const pi = event.data.object as unknown as Stripe.PaymentIntent;
    const existing = await db.payment.findUnique({
      where: { stripePaymentIntentId: pi.id },
      select: { status: true },
    });
    // If payment is already past PENDING it means this event was handled before.
    if (existing && existing.status !== 'PENDING') {
      logger.info(`[Webhook] Skipping already-processed event ${event.id} (${event.type})`);
      return NextResponse.json({ received: true });
    }
  } else {
    // All other event types: use the in-memory Map guard.
    if (isEventAlreadyProcessed(event.id)) {
      logger.info(`[Webhook] Skipping duplicate event ${event.id} (${event.type})`);
      return NextResponse.json({ received: true });
    }
  }
  // -------------------------------------------------------------------------

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionUpdated(event.data.object as unknown as Stripe.Subscription);
        markEventProcessed(event.id);
        break;
      case 'transfer.created':
        await handleTransferCreated(event.data.object as unknown as Stripe.Transfer);
        markEventProcessed(event.id);
        break;
      case 'account.updated':
        await handleConnectedAccountUpdated(event.data.object as unknown as Stripe.Account);
        markEventProcessed(event.id);
        break;
      default:
        // Unhandled event — acknowledged but not processed
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    logger.error(`[Webhook] Error handling ${event.type}:`, err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
