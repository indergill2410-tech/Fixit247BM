import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { constructWebhookEvent } from '@fixit247/payments';
import {
  handlePaymentIntentSucceeded,
  handlePaymentIntentFailed,
  handleSubscriptionUpdated,
  handleTransferCreated,
  handleConnectedAccountUpdated,
  handleInvoicePaymentFailed,
} from '@fixit247/payments';
import { db } from '@fixit247/database';
import { notify } from '@fixit247/notifications';
import type Stripe from 'stripe';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

/**
 * Durably record a Stripe event ID in the DB before processing.
 * Returns true if the event was already recorded (duplicate — skip it).
 * Uses a unique primary key on eventId, so concurrent instances are safe.
 */
async function claimEvent(eventId: string, eventType: string): Promise<boolean> {
  try {
    await db.stripeProcessedEvent.create({ data: { eventId, eventType } });
    return false; // successfully claimed — first time we've seen this
  } catch {
    // Unique constraint violation → already processed
    return true;
  }
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

  // --- DB-durable webhook deduplication ------------------------------------
  // Stripe retries failed webhooks — we must be idempotent.
  // claimEvent() does an atomic INSERT; a unique constraint violation means
  // this event was already handled (possibly by another instance or after a
  // restart), so we can safely acknowledge and skip.
  const isDuplicate = await claimEvent(event.id, event.type);
  if (isDuplicate) {
    logger.info(`[Webhook] Skipping duplicate event ${event.id} (${event.type})`);
    return NextResponse.json({ received: true });
  }
  // -------------------------------------------------------------------------

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as unknown as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(pi);
        if (pi.metadata.jobId) {
          const job = await db.job.findUnique({
            where: { id: pi.metadata.jobId },
            select: {
              title: true,
              customer: { select: { userId: true } },
              tradie: { select: { businessName: true } },
            },
          });
          if (job) {
            const amount = (pi.amount / 100).toFixed(2);
            const tradieName = job.tradie?.businessName ?? 'Your tradie';
            void notify({
              userId: job.customer.userId,
              jobId: pi.metadata.jobId,
              type: 'PAYMENT_HELD',
              data: { amount, tradieName, jobTitle: job.title },
            });
          }
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as unknown as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(pi);
        if (pi.metadata.jobId) {
          const job = await db.job.findUnique({
            where: { id: pi.metadata.jobId },
            select: { title: true, customer: { select: { userId: true } } },
          });
          if (job) {
            void notify({
              userId: job.customer.userId,
              jobId: pi.metadata.jobId,
              type: 'PAYMENT_FAILED',
              data: { jobTitle: job.title },
            });
          }
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionUpdated(event.data.object as unknown as Stripe.Subscription);
        break;
      case 'invoice.payment_failed': {
        await handleInvoicePaymentFailed(event.data.object);
        const userId = (event.data.object as { subscription_details?: { metadata?: { userId?: string } } })
          .subscription_details?.metadata?.userId;
        if (userId) {
          void notify({ userId, type: 'SYSTEM_ALERT', data: { title: 'Subscription payment failed', body: 'Your subscription payment failed. Please update your payment method to keep your account active.' } });
        }
        break;
      }
      case 'transfer.created':
        await handleTransferCreated(event.data.object as unknown as Stripe.Transfer);
        break;
      case 'account.updated':
        await handleConnectedAccountUpdated(event.data.object as unknown as Stripe.Account);
        break;
      default:
        // Unhandled event — acknowledged but not processed
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    // Processing failed — delete the claim so Stripe can retry and succeed next time
    await db.stripeProcessedEvent.delete({ where: { eventId: event.id } }).catch(() => null);
    logger.error(`[Webhook] Error handling ${event.type}:`, err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
