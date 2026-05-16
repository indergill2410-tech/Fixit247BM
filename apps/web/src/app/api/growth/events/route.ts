import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { z } from 'zod';
import crypto from 'crypto';

const schema = z.object({
  eventType: z.string(),
  page: z.string().optional(),
  referrer: z.string().optional(),
  suburb: z.string().optional(),
  sessionId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);

    await db.growthEvent.create({
      data: {
        eventType: data.eventType as any,
        page: data.page,
        referrer: data.referrer,
        suburb: data.suburb,
        sessionId: data.sessionId,
        metadata: data.metadata ?? {},
        ipHash,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
