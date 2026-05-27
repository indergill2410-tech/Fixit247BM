import { PostHog } from 'posthog-node';

let _client: PostHog | null = null;

export function getPostHogServer(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;

  if (!_client) {
    _client = new PostHog(key, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
      flushAt: 1,
      flushInterval: 0, // flush immediately in serverless
    });
  }
  return _client;
}

/** Fire-and-forget server-side event. Safe to call from Server Components and Route Handlers. */
export function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>,
): void {
  const client = getPostHogServer();
  if (!client) return;
  // flushAt:1 + flushInterval:0 means the SDK flushes immediately after each capture
  client.capture({ distinctId, event, properties });
}
