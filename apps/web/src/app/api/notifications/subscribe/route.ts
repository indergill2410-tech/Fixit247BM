import { NextRequest, NextResponse } from 'next/server';
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
 * Subscriptions are stored as a JSON array in the notification_preferences
 * table's push_subscriptions column (avoids a schema migration).
 */
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const sub = SubscriptionSchema.parse(body);

    // Ensure the preference row exists.
    await db.notificationPreference.upsert({
      where: { userId: session.id },
      create: { userId: session.id },
      update: {},
    });

    // Append the new subscription (deduplicating by endpoint).
    await db.$executeRaw`
      UPDATE notification_preferences
      SET push_subscriptions = COALESCE(push_subscriptions, '[]'::jsonb)
        || CASE
             WHEN push_subscriptions @> ${JSON.stringify([{ endpoint: sub.endpoint }])}::jsonb
             THEN '[]'::jsonb
             ELSE ${JSON.stringify([sub])}::jsonb
           END
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
    const endpoint = body?.endpoint;

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
