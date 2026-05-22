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

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(payload, sig);
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object;
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
        const pi = event.data.object;
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
        await handleSubscriptionUpdated(event.data.object);
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
        await handleTransferCreated(event.data.object);
        break;
      case 'account.updated':
        await handleConnectedAccountUpdated(event.data.object);
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
