import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';

export async function GET() {
  const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
  if (session instanceof NextResponse) return session;

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalCalls24h,
    emergencyCalls24h,
    completedCalls24h,
    humanTakeovers24h,
    avgDuration,
    callsByStatus,
  ] = await Promise.all([
    db.voiceCall.count({ where: { startedAt: { gte: since24h } } }),
    db.voiceCall.count({ where: { startedAt: { gte: since24h }, conversation: { isEmergency: true } } }),
    db.voiceCall.count({ where: { startedAt: { gte: since24h }, status: 'COMPLETED' } }),
    db.voiceCall.count({ where: { startedAt: { gte: since24h }, status: 'HUMAN_TAKEOVER' } }),
    db.voiceCall.aggregate({ where: { duration: { not: null }, startedAt: { gte: since7d } }, _avg: { duration: true } }),
    db.voiceCall.groupBy({ by: ['status'], _count: { id: true }, where: { startedAt: { gte: since7d } } }),
  ]);

  return NextResponse.json({
    stats: {
      totalCalls24h,
      emergencyCalls24h,
      completedCalls24h,
      humanTakeovers24h,
      avgDurationSeconds: Math.round(avgDuration._avg.duration ?? 0),
      callsByStatus,
    },
  });
}
