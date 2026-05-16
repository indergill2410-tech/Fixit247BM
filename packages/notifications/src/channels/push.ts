// Web Push scaffold — wire up with web-push npm + VAPID keys when ready.
export async function sendPushNotification(opts: {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}): Promise<void> {
  // TODO: fetch push subscription from DB, call webpush.sendNotification()
  console.log(`[push] uid=${opts.userId} "${opts.title}"`);
}
