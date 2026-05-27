import { db } from '@fixit247/database';
import { renderTemplate, type NotifData } from './templates';
import { sendEmailNotification } from './channels/email';
import { sendPushNotification } from './channels/push';
import { getPreferences, shouldSendChannel } from './preferences';
import { notificationQueue } from './queue';

export interface NotifyOptions {
  userId: string;
  jobId?: string;
  type: string;
  data?: NotifData;
  title?: string;
  body?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  io?: any;
}

export async function notify(opts: NotifyOptions): Promise<void> {
  const { userId, jobId, type, data = {}, io } = opts;
  const { title, subject, body } = renderTemplate(type, data);
  const resolvedTitle = opts.title ?? title;
  const resolvedBody = opts.body ?? body;

  const notif = await db.notification.create({
    data: { userId, jobId: jobId ?? null, type: type as never, title: resolvedTitle, body: resolvedBody, data: data as never, status: 'PENDING', channel: 'IN_APP' },
  });

  if (io) {
    // Dynamic import so the realtime package is only needed at runtime
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
    const { ROOMS } = require('@fixit247/realtime') as { ROOMS: { user: (id: string) => string } };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    io.to(ROOMS.user(userId)).emit('notification:new', {
      id: notif.id, type, title: resolvedTitle, body: resolvedBody, jobId, data, createdAt: notif.createdAt.toISOString(),
    });
  }

  await db.notification.update({ where: { id: notif.id }, data: { status: 'SENT', sentAt: new Date() } });

  const prefs = await getPreferences(userId);
  const user = await db.user.findUnique({ where: { id: userId }, select: { email: true } });

  if (user?.email && shouldSendChannel(prefs, type, 'email')) {
    notificationQueue.enqueue(() => sendEmailNotification({ to: user.email!, title: resolvedTitle, ...(subject ? { subject } : {}), body: resolvedBody, type, data }));
  }
  if (shouldSendChannel(prefs, type, 'push')) {
    notificationQueue.enqueue(() => sendPushNotification({ userId, title: resolvedTitle, body: resolvedBody, data }));
  }
}

export async function notifyMany(userIds: string[], opts: Omit<NotifyOptions, 'userId'>): Promise<void> {
  await Promise.all(userIds.map((userId) => notify({ ...opts, userId })));
}

export async function markRead(notifId: string, userId: string): Promise<void> {
  await db.notification.updateMany({ where: { id: notifId, userId }, data: { readAt: new Date(), status: 'READ' } });
}

export async function markAllRead(userId: string): Promise<void> {
  await db.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date(), status: 'READ' } });
}

export async function getUnreadCount(userId: string): Promise<number> {
  return db.notification.count({ where: { userId, readAt: null } });
}
