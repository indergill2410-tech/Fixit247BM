import { db } from '@fixit247/database';

export type GrowthEventPayload = {
  userId?: string;
  sessionId?: string;
  eventType: string;
  page?: string;
  referrer?: string;
  suburb?: string;
  metadata?: Record<string, unknown>;
  ipHash?: string;
};

export async function trackEvent(payload: GrowthEventPayload): Promise<void> {
  await db.growthEvent.create({
    data: {
      userId: payload.userId,
      sessionId: payload.sessionId,
      eventType: payload.eventType as any,
      page: payload.page,
      referrer: payload.referrer,
      suburb: payload.suburb,
      metadata: payload.metadata ?? {},
      ipHash: payload.ipHash,
    },
  });
}

export async function trackBatch(events: GrowthEventPayload[]): Promise<void> {
  await db.growthEvent.createMany({
    data: events.map((e) => ({
      userId: e.userId,
      sessionId: e.sessionId,
      eventType: e.eventType as any,
      page: e.page,
      referrer: e.referrer,
      suburb: e.suburb,
      metadata: e.metadata ?? {},
      ipHash: e.ipHash,
    })),
  });
}
