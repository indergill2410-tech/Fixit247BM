import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireApiSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';

const AvailabilitySchema = z.object({
  onlineStatus: z.enum(['ONLINE', 'OFFLINE', 'BUSY', 'EMERGENCY_ONLY', 'AWAY']),
  currentLatitude: z.number().optional(),
  currentLongitude: z.number().optional(),
  travelRadiusKm: z.number().int().min(1).max(200).optional(),
  isAutoAccept: z.boolean().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireApiSession();
    if (session instanceof NextResponse) return session;
    if (session.role !== 'TRADIE') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const tradieProfile = await db.tradieProfile.findUnique({ where: { userId: session.id } });
    if (!tradieProfile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const body = await req.json();
    const data = AvailabilitySchema.parse(body);

    const status = await db.tradieRealtimeStatus.upsert({
      where: { tradieId: tradieProfile.id },
      create: {
        tradieId: tradieProfile.id,
        onlineStatus: data.onlineStatus as any,
        lastHeartbeatAt: new Date(),
        currentLatitude: data.currentLatitude,
        currentLongitude: data.currentLongitude,
        travelRadiusKm: data.travelRadiusKm ?? 25,
        isAutoAccept: data.isAutoAccept ?? false,
      },
      update: {
        onlineStatus: data.onlineStatus as any,
        lastHeartbeatAt: new Date(),
        currentLatitude: data.currentLatitude,
        currentLongitude: data.currentLongitude,
        ...(data.travelRadiusKm !== undefined && { travelRadiusKm: data.travelRadiusKm }),
        ...(data.isAutoAccept !== undefined && { isAutoAccept: data.isAutoAccept }),
      },
    });

    // Also sync to TradieProfile for persistent state
    await db.tradieProfile.update({
      where: { id: tradieProfile.id },
      data: {
        isAvailable: data.onlineStatus === 'ONLINE',
        isEmergencyAvailable: data.onlineStatus === 'ONLINE' || data.onlineStatus === 'EMERGENCY_ONLY',
      },
    });

    return NextResponse.json({ status });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: err.errors }, { status: 400 });
    }
    console.error('[PATCH /api/availability]', err);
    return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireApiSession();
    if (session instanceof NextResponse) return session;
    if (session.role !== 'TRADIE') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const tradieProfile = await db.tradieProfile.findUnique({ where: { userId: session.id } });
    if (!tradieProfile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const status = await db.tradieRealtimeStatus.findUnique({
      where: { tradieId: tradieProfile.id },
    });

    return NextResponse.json({ status });
  } catch (err) {
    console.error('[GET /api/availability]', err);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}
