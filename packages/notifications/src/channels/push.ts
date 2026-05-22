import webpush from 'web-push';

let _vapidInitialized = false;
function ensureVapid(): boolean {
  if (_vapidInitialized) return true;
  const pub = process.env['NEXT_PUBLIC_VAPID_PUBLIC_KEY'];
  const priv = process.env['VAPID_PRIVATE_KEY'];
  if (!pub || !priv) return false;
  webpush.setVapidDetails(
    'mailto:' + (process.env['EMAIL_FROM'] ?? 'noreply@fixit247.com.au'),
    pub,
    priv,
  );
  _vapidInitialized = true;
  return true;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  data?: Record<string, unknown>;
}

/**
 * Push subscription shape stored as JSON in the DB.
 * Mirrors the browser PushSubscription serialisation.
 */
export interface StoredPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export async function sendPushNotification(
  userId: string,
  payload: PushPayload,
): Promise<void> {
  if (!ensureVapid()) return;

  // Lazy-import db so this module can be used outside Next.js without
  // pulling in the full Prisma client at import-time.
  const { db } = await import('@fixit247/database');

  // Fetch all push subscriptions for this user stored in their CustomerProfile.
  // We store subscriptions as a JSON array in NotificationPreference.metadata
  // (avoids a schema migration while the PushSubscription table doesn't exist yet).
  const preference = await db.notificationPreference.findUnique({
    where: { userId },
    select: { userId: true },
  });

  if (!preference) return;

  // Retrieve raw record with metadata JSON using Prisma's $queryRaw so we
  // don't have to add a typed field to the generated client.
  const rows = await db.$queryRaw<Array<{ push_subscriptions: unknown }>>`
    SELECT push_subscriptions
    FROM notification_preferences
    WHERE "userId" = ${userId}::uuid
  `;

  const raw = rows[0]?.push_subscriptions;
  if (!raw) return;

  const subscriptions: StoredPushSubscription[] = Array.isArray(raw)
    ? (raw as StoredPushSubscription[])
    : [];

  if (subscriptions.length === 0) return;

  const notificationPayload = JSON.stringify({
    title: payload.title,
    body: payload.body,
    url: payload.url ?? '/',
    ...(payload.data ?? {}),
  });

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
        },
        notificationPayload,
      ),
    ),
  );

  // Collect expired / invalid subscription endpoints to remove (HTTP 410 Gone).
  const expiredEndpoints = new Set<string>();
  results.forEach((result, idx) => {
    if (
      result.status === 'rejected' &&
      result.reason &&
      typeof result.reason === 'object' &&
      'statusCode' in result.reason &&
      result.reason.statusCode === 410
    ) {
      expiredEndpoints.add(subscriptions[idx]!.endpoint);
    }
  });

  if (expiredEndpoints.size > 0) {
    const remaining = subscriptions.filter(
      (s) => !expiredEndpoints.has(s.endpoint),
    );
    await db.$executeRaw`
      UPDATE notification_preferences
      SET push_subscriptions = ${JSON.stringify(remaining)}::jsonb
      WHERE "userId" = ${userId}::uuid
    `;
  }
}
