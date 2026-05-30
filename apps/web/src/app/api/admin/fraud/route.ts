import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';

export async function GET(req: NextRequest) {
  try {
    const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
    if (session instanceof NextResponse) return session;

    const status = req.nextUrl.searchParams.get('status') ?? 'PENDING';
    const severity = req.nextUrl.searchParams.get('severity');
    const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? '50'), 100);

    const flags = await db.fraudFlag.findMany({
      where: {
        status: { in: status === 'ALL' ? ['PENDING', 'UNDER_REVIEW', 'ESCALATED', 'AUTO_SUSPENDED'] : [status] } as never,
        ...(severity ? { severity: severity as never } : {}),
      },
      orderBy: [{ severity: 'desc' }, { createdAt: 'asc' }],
      take: limit,
      select: { id: true, userId: true, type: true, severity: true, riskScore: true, status: true, title: true, description: true, evidence: true, jobId: true, autoDetected: true, createdAt: true, updatedAt: true },
    });

    const counts = await db.fraudFlag.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    return NextResponse.json({ flags, counts, total: flags.length });
  } catch (err) {
    console.error('[GET /api/admin/fraud]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
