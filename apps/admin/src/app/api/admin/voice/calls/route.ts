import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';

export async function GET(req: Request) {
  const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
  if (session instanceof NextResponse) return session;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);

  const calls = await db.voiceCall.findMany({
    where: status ? { status: status as never } : {},
    include: {
      customer: { select: { firstName: true, lastName: true, phone: true } },
      events: { orderBy: { createdAt: 'desc' }, take: 5 },
      conversation: { select: { status: true, isEmergency: true, urgencyScore: true, turnCount: true } },
      assessment: { select: { riskLevel: true, emergencyScore: true } },
    },
    orderBy: { startedAt: 'desc' },
    take: limit,
  });

  const stats = await db.voiceCall.groupBy({
    by: ['status'],
    _count: { id: true },
  });

  return NextResponse.json({ calls, stats });
}
