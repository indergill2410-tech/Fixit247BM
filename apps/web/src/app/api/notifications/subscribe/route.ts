import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const SubscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

/**
 * POST /api/notifications/subscribe
 * Save a Web Push subscription for the authenticated user.
 *
 * If a subscription with the same endpoint already exists it is REPLACED —
 * browsers can regenerate keys (new p256dh/auth) for the same endpoint, and
 * stale keys cause silent push failures. We remove-then-append so the stored
 * object always has the most recent keys.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json() as unknown;
    const sub = SubscriptionSchema.parse(body);

    // Ensure the preference row exists.
    await db.notificationPreference.upsert({
      where: { userId: session.id },
      create: { userId: session.id },
      update: {},
    });

    // Remove any existing entry for this endpoint, then append the fresh subscription.
    // This handles re-registration (same endpoint, new crypto keys) correctly.
    await db.$executeRaw`
      UPDATE notification_preferences
      SET push_subscriptions = (
        SELECT COALESCE(jsonb_agg(elem), '[]'::jsonb)
        FROM jsonb_array_elements(COALESCE(push_subscriptions, '[]'::jsonb)) elem
        WHERE elem->>'endpoint' != ${sub.endpoint}
      ) || ${JSON.stringify([sub])}::jsonb
      WHERE "userId" = ${session.id}::uuid
    `;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid subscription', details: err.errors }, { status: 400 });
    }
    logger.error('[POST /api/notifications/subscribe]', err);
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}

/**
 * DELETE /api/notifications/subscribe
 * Remove a Web Push subscription for the authenticated user.
 * Body: { endpoint: string }
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json() as { endpoint?: string };
    const endpoint = body.endpoint;

    if (!endpoint || typeof endpoint !== 'string') {
      return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
    }

    await db.$executeRaw`
      UPDATE notification_preferences
      SET push_subscriptions = COALESCE(
        (
          SELECT jsonb_agg(elem)
          FROM jsonb_array_elements(COALESCE(push_subscriptions, '[]'::jsonb)) AS elem
          WHERE elem->>'endpoint' != ${endpoint}
        ),
        '[]'::jsonb
      )
      WHERE "userId" = ${session.id}::uuid
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error('[DELETE /api/notifications/subscribe]', err);
    return NextResponse.json({ error: 'Failed to remove subscription' }, { status: 500 });
  }
}
