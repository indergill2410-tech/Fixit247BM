import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireApiSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const session = await requireApiSession();
    if (session instanceof NextResponse) return session;
    const { jobId } = await params;

    const job = await db.job.findUnique({
      where: { id: jobId },
      select: { customerId: true, tradieId: true, status: true },
    });
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

    const isParticipant =
      job.customerId === session.id ||
      job.tradieId === session.id ||
      ['ADMIN', 'SUPER_ADMIN'].includes(session.role);
    if (!isParticipant) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Only share location during active job phases
    const activeStatuses = ['CLAIMED', 'EN_ROUTE', 'ARRIVED', 'IN_PROGRESS'];
    if (!activeStatuses.includes(job.status)) {
      return NextResponse.json({ location: null, reason: 'Job not active' });
    }

    if (!job.tradieId) return NextResponse.json({ location: null, reason: 'No tradie assigned' });

    const tradieProfile = await db.tradieProfile.findUnique({
      where: { userId: job.tradieId },
      select: { id: true },
    });

    const latest = tradieProfile ? await db.locationTracking.findFirst({
      where: { tradieId: tradieProfile.id, jobId },
      orderBy: { createdAt: 'desc' },
    }) : null;

    return NextResponse.json({
      location: latest
        ? {
            lat: Number(latest.latitude),
            lng: Number(latest.longitude),
            accuracy: latest.accuracy,
            heading: latest.heading,
            speed: latest.speed,
            timestamp: latest.createdAt.toISOString(),
          }
        : null,
    });
  } catch (err) {
    logger.error('[GET /api/tracking/:jobId]', err);
    return NextResponse.json({ error: 'Failed to fetch location' }, { status: 500 });
  }
}
