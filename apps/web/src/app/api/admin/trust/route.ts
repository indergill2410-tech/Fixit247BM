import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';

export async function GET(req: NextRequest) {
  try {
    const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
    if (session instanceof NextResponse) return session;

    const tier = req.nextUrl.searchParams.get('tier'); // BRONZE|SILVER|GOLD|PLATINUM
    const minScore = Number(req.nextUrl.searchParams.get('minScore') ?? '0');
    const maxScore = Number(req.nextUrl.searchParams.get('maxScore') ?? '100');
    const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? '50'), 100);

    const tierRange = tier === 'PLATINUM' ? { gte: 90 } : tier === 'GOLD' ? { gte: 75, lt: 90 } : tier === 'SILVER' ? { gte: 55, lt: 75 } : tier === 'BRONZE' ? { lt: 55 } : { gte: minScore, lte: maxScore };

    const tradies = await db.tradieProfile.findMany({
      where: { trustScore: tierRange },
      orderBy: { trustScore: 'desc' },
      take: limit,
      select: {
        id: true, trustScore: true, avgRating: true, totalJobsCompleted: true, verificationStatus: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    const distribution = await db.tradieProfile.groupBy({
      by: ['trustScore'],
      _count: { id: true },
    });

    return NextResponse.json({ tradies, total: tradies.length, distribution });
  } catch (err) {
    console.error('[GET /api/admin/trust]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
