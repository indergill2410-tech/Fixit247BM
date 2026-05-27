import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { z } from 'zod';
import crypto from 'crypto';
import { getSession } from '@/lib/auth/session';

// Pre-login events are legitimate — unauthenticated visitors generate funnel analytics.
const ANON_EVENT_TYPES = new Set([
  'page_view', 'search', 'signup_started', 'referral_clicked', 'emergency_tapped',
]);

// eventType whitelist — prevents arbitrary strings from polluting the table.
const ALLOWED_EVENT_TYPES = [
  'page_view', 'search', 'job_view', 'tradie_view',
  'signup_started', 'signup_completed', 'login', 'booking_started',
  'booking_completed', 'referral_clicked', 'emergency_tapped',
] as const;

const schema = z.object({
  eventType: z.enum(ALLOWED_EVENT_TYPES),
  page: z.string().max(500).optional(),
  referrer: z.string().max(500).optional(),
  suburb: z.string().max(100).optional(),
  sessionId: z.string().max(100).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    const data = schema.parse(body);

    // Pre-login events (page_view, signup_started etc.) are allowed anonymously.
    // Post-login events require a valid session to prevent unauthenticated bot pollution.
    if (!ANON_EVENT_TYPES.has(data.eventType)) {
      const session = await getSession();
      if (!session) return NextResponse.json({ ok: false }, { status: 401 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16);

    await db.growthEvent.create({
      data: {
        eventType: data.eventType as never,
        page: data.page,
        referrer: data.referrer,
        suburb: data.suburb,
        sessionId: data.sessionId,
        metadata: (data.metadata ?? {}) as never,
        ipHash,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
