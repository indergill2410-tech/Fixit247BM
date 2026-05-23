import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const session = await requireSession();
    if (session.role !== 'TRADIE') {
      return NextResponse.json({ error: 'Tradies only' }, { status: 403 });
    }

    const tradieProfile = await db.tradieProfile.findUnique({ where: { userId: session.id } });
    if (!tradieProfile) return NextResponse.json({ offers: [] });

    const offers = await db.jobMatchingQueue.findMany({
      where: {
        tradieId: tradieProfile.id,
        status: 'PENDING',
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      include: {
        job: {
          include: {
            address: { select: { suburb: true, state: true, postcode: true, latitude: true, longitude: true } },
          },
        },
      },
      orderBy: [{ job: { isEmergency: 'desc' } }, { matchScore: 'desc' }],
    });

    return NextResponse.json({ offers });
  } catch (err) {
    logger.error('[GET /api/jobs/offers]', err);
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}
