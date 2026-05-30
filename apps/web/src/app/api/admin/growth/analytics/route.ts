import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';

export async function GET(req: Request) {
  const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
  if (session instanceof NextResponse) return session;
  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get('days') ?? '30');
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [
    topSuburbs,
    underservedSuburbs,
    signupEvents,
    jobEvents,
    referralEvents,
    totalGrowthEvents,
  ] = await Promise.all([
    db.suburbMetrics.findMany({ orderBy: { demandScore: 'desc' }, take: 10 }),
    db.suburbMetrics.findMany({ where: { isUnderserved: true }, orderBy: { expansionPriority: 'desc' }, take: 10 }),
    db.growthEvent.count({ where: { eventType: 'SIGNUP_COMPLETED', createdAt: { gte: since } } }),
    db.growthEvent.count({ where: { eventType: 'JOB_STARTED', createdAt: { gte: since } } }),
    db.growthEvent.count({ where: { eventType: 'REFERRAL_CONVERTED', createdAt: { gte: since } } }),
    db.growthEvent.count({ where: { createdAt: { gte: since } } }),
  ]);

  return NextResponse.json({
    topSuburbs,
    underservedSuburbs,
    funnelMetrics: { signups: signupEvents, jobs: jobEvents, referrals: referralEvents, totalEvents: totalGrowthEvents },
  });
}
