import { db } from '@fixit247/database';
import { calculateTrustScore, type TrustInputs, type TrustScoreResult } from './scorer';

export async function recalculateTrustScore(
  tradieId: string,
  reason: string,
  jobId?: string,
  adminId?: string
): Promise<TrustScoreResult> {
  const [profile, stats, disputes, refunds] = await Promise.all([
    db.tradieProfile.findUnique({
      where: { id: tradieId },
      select: {
        rating: true,
        totalJobs: true,
        completedJobs: true,
        cancelledJobs: true,
        responseTimeAvg: true,
        isVerified: true,
        verificationLevel: true,
        trustScore: true,
      },
    }),
    db.job.groupBy({
      by: ['status'],
      where: { tradieId },
      _count: { id: true },
    }),
    db.dispute.count({ where: { tradieId, status: { in: ['OPEN', 'UNDER_REVIEW', 'RESOLVED_CUSTOMER'] } } }),
    db.payout.count({ where: { tradieId, status: 'FAILED' } }),
  ]);

  if (!profile) throw new Error(`Tradie profile not found: ${tradieId}`);

  const totalJobs = profile.totalJobs ?? 0;
  const completedJobs = profile.completedJobs ?? 0;
  const cancelledJobs = profile.cancelledJobs ?? 0;

  const lastJob = await db.job.findFirst({
    where: { tradieId, status: 'COMPLETED' },
    orderBy: { completedAt: 'desc' },
    select: { completedAt: true },
  });

  const repeatCustomers = await db.job.groupBy({
    by: ['customerId'],
    where: { tradieId, status: 'COMPLETED' },
    having: { customerId: { _count: { gt: 1 } } },
  });

  const emergencyJobs = await db.job.count({ where: { tradieId, isEmergency: true } });
  const emergencyCompleted = await db.job.count({ where: { tradieId, isEmergency: true, status: 'COMPLETED' } });

  const daysSinceLastJob = lastJob?.completedAt
    ? Math.floor((Date.now() - lastJob.completedAt.getTime()) / 86_400_000)
    : 365;

  const inputs: TrustInputs = {
    tradieId,
    avgRating: profile.rating ? Number(profile.rating) : 0,
    completionRate: totalJobs > 0 ? completedJobs / totalJobs : 0,
    cancellationRate: totalJobs > 0 ? cancelledJobs / totalJobs : 0,
    avgResponseTimeMinutes: profile.responseTimeAvg ? Number(profile.responseTimeAvg) : 30,
    totalJobs,
    repeatCustomerRate: completedJobs > 0 ? repeatCustomers.length / completedJobs : 0,
    emergencyCompletionRate: emergencyJobs > 0 ? emergencyCompleted / emergencyJobs : 0,
    disputeRate: totalJobs > 0 ? disputes / totalJobs : 0,
    refundRate: totalJobs > 0 ? refunds / totalJobs : 0,
    verificationLevel: (profile.verificationLevel as TrustInputs['verificationLevel']) ?? 'NONE',
    daysSinceLastJob,
  };

  const result = calculateTrustScore(inputs);

  // Persist score + history in transaction
  await db.$transaction([
    db.tradieProfile.update({
      where: { id: tradieId },
      data: { trustScore: result.score },
    }),
    db.trustScoreHistory.create({
      data: {
        tradieId,
        score: result.score,
        previousScore: profile.trustScore ?? null,
        reason,
        jobId: jobId ?? null,
        adminId: adminId ?? null,
        metadata: result.breakdown as never,
      },
    }),
  ]);

  return result;
}

export async function adminOverrideTrustScore(
  tradieId: string,
  newScore: number,
  reason: string,
  adminId: string
): Promise<void> {
  const profile = await db.tradieProfile.findUnique({ where: { id: tradieId }, select: { trustScore: true } });

  await db.$transaction([
    db.tradieProfile.update({ where: { id: tradieId }, data: { trustScore: newScore } }),
    db.trustScoreHistory.create({
      data: {
        tradieId,
        score: newScore,
        previousScore: profile?.trustScore ?? null,
        reason: `Admin override: ${reason}`,
        adminId,
      },
    }),
    db.adminAuditLog.create({
      data: {
        adminId,
        action: 'TRUST_SCORE_OVERRIDE',
        entity: 'TradieProfile',
        entityId: tradieId,
        metadata: { newScore, reason } as never,
      },
    }),
  ]);
}

export async function getTrustHistory(tradieId: string, limit = 20) {
  return db.trustScoreHistory.findMany({
    where: { tradieId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}
