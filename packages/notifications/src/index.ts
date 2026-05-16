export { notify, notifyMany, markRead, markAllRead, getUnreadCount } from './service';
export { renderTemplate } from './templates';
export { getPreferences, shouldSendChannel, isQuietHours } from './preferences';
export { notificationQueue } from './queue';
export * from './automation';
export type { NotifyOptions } from './service';
export type { NotifData } from './templates';
