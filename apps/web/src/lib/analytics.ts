// Server-side growth event tracker
export async function trackGrowthEvent(payload: {
  userId?: string;
  eventType: string;
  page?: string;
  suburb?: string;
  metadata?: Record<string, unknown>;
  request?: Request;
}) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) return;
    await fetch(`${baseUrl}/api/growth/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Non-blocking — analytics failures should never break the app
  }
}
