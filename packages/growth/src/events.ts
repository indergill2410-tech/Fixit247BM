import { db } from '@fixit247/database';
import type { GrowthEventType, Prisma } from '@fixit247/database';

export type GrowthEventPayload = {
  userId?: string;
  sessionId?: string;
  eventType: GrowthEventType;
  page?: string;
  referrer?: string;
  suburb?: string;
  metadata?: Record<string, unknown>;
  ipHash?: string;
};

function toGrowthEventInput(event: GrowthEventPayload): Prisma.GrowthEventCreateManyInput {
  return {
    userId: event.userId ?? null,
    sessionId: event.sessionId ?? null,
    eventType: event.eventType,
    page: event.page ?? null,
    referrer: event.referrer ?? null,
    suburb: event.suburb ?? null,
    metadata: (event.metadata ?? {}) as Prisma.InputJsonObject,
    ipHash: event.ipHash ?? null,
  };
}

export async function trackEvent(payload: GrowthEventPayload): Promise<void> {
  await db.growthEvent.create({
    data: toGrowthEventInput(payload),
  });
}

export async function trackBatch(events: GrowthEventPayload[]): Promise<void> {
  await db.growthEvent.createMany({
    data: events.map(toGrowthEventInput),
  });
}
