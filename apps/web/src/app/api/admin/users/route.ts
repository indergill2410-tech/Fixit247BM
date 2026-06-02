import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = req.nextUrl;
    const role = searchParams.get('role');
    const isActiveParam = searchParams.get('isActive');
    const search = searchParams.get('search');
    const limit = Math.min(Number(searchParams.get('limit') ?? '50'), 100);
    const offset = Number(searchParams.get('offset') ?? '0');

    const where: Record<string, unknown> = {};
    if (role && role !== 'ALL') where.role = role;
    if (isActiveParam !== null && isActiveParam !== '') where.isActive = isActiveParam === 'true';
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where: where as never,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          tradieProfile: { select: { businessName: true, verificationStatus: true, avgRating: true } },
        },
      }),
      db.user.count({ where: where as never }),
    ]);

    return NextResponse.json({ users, total });
  } catch (err) {
    logger.error('[GET /api/admin/users]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
