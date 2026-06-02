import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const status = req.nextUrl.searchParams.get('status') ?? 'PENDING';
    const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? '50'), 200);
    const offset = Number(req.nextUrl.searchParams.get('offset') ?? '0');

    const where = status === 'ALL' ? {} : { verificationStatus: status as never };

    const [profiles, total] = await Promise.all([
      db.tradieProfile.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        take: limit,
        skip: offset,
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          licences: true,
          insurances: true,
        },
      }),
      db.tradieProfile.count({ where }),
    ]);

    return NextResponse.json({ profiles, total });
  } catch (err) {
    logger.error('[GET /api/admin/verifications]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
