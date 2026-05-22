import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const Schema = z.object({
  jobId: z.string().uuid(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  accuracy: z.number().optional(),
  heading: z.number().optional(),
  speed: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    if (session.role !== 'TRADIE') {
      return NextResponse.json({ error: 'Only tradies can post location updates' }, { status: 403 });
    }

    const body = await req.json();
    const { jobId, lat, lng, accuracy, heading, speed } = Schema.parse(body);

    const tradieProfile = await db.tradieProfile.findUnique({
      where: { userId: session.id },
      select: { id: true },
    });
    if (!tradieProfile) return NextResponse.json({ error: 'Tradie profile not found' }, { status: 404 });

    // Persist location point
    await db.locationTracking.create({
      data: {
        tradieId: tradieProfile.id,
        jobId,
        latitude: lat,
        longitude: lng,
        accuracy: accuracy ?? null,
        heading: heading ?? null,
        speed: speed ?? null,
      },
    });

    // Update current position on realtime status
    await db.tradieRealtimeStatus.updateMany({
      where: { tradieId: tradieProfile.id },
      data: { currentLatitude: lat, currentLongitude: lng },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    logger.error('[POST /api/tracking/update]', err);
    return NextResponse.json({ error: 'Failed to store location' }, { status: 500 });
  }
}
