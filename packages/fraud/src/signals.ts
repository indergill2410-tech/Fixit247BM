import { db } from '@fixit247/database';

export interface FraudSignal {
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskContribution: number; // 0-100 added to total risk score
  title: string;
  description: string;
  evidence?: Record<string, unknown>;
}

// Check for excessive cancellations in past 30 days
export async function checkExcessiveCancellations(userId: string): Promise<FraudSignal | null> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000);
  const [cancelled, total] = await Promise.all([
    db.job.count({ where: { customerId: userId, status: 'CANCELLED', updatedAt: { gte: thirtyDaysAgo } } }),
    db.job.count({ where: { customerId: userId, createdAt: { gte: thirtyDaysAgo } } }),
  ]);
  if (total < 3) return null;
  const rate = cancelled / total;
  if (rate < 0.5) return null;
  return {
    type: 'EXCESSIVE_CANCELLATIONS',
    severity: rate >= 0.8 ? 'HIGH' : 'MEDIUM',
    riskContribution: Math.round(rate * 40),
    title: 'Excessive cancellation rate',
    description: `${cancelled}/${total} jobs cancelled in the last 30 days (${Math.round(rate * 100)}%)`,
    evidence: { cancelledCount: cancelled, totalCount: total, rate },
  };
}

// Check for repeated refund requests
export async function checkRefundAbuse(userId: string): Promise<FraudSignal | null> {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 86_400_000);
  const refundCount = await db.payment.count({
    where: { job: { customerId: userId }, status: 'REFUNDED', createdAt: { gte: ninetyDaysAgo } },
  });
  if (refundCount < 3) return null;
  return {
    type: 'EXCESSIVE_REFUNDS',
    severity: refundCount >= 5 ? 'HIGH' : 'MEDIUM',
    riskContribution: Math.min(50, refundCount * 8),
    title: 'Repeated refund requests',
    description: `${refundCount} refunds in the last 90 days`,
    evidence: { refundCount },
  };
}

// Check for duplicate/multi accounts (same email domain + phone pattern)
export async function checkMultiAccount(userId: string): Promise<FraudSignal | null> {
  const user = await db.user.findUnique({ where: { id: userId }, select: { email: true, phone: true, createdAt: true } });
  if (!user) return null;

  const phonePrefix = user.phone?.slice(0, 8);
  if (!phonePrefix) return null;

  const similar = await db.user.count({
    where: {
      id: { not: userId },
      phone: { startsWith: phonePrefix },
      createdAt: { gte: new Date(Date.now() - 180 * 86_400_000) },
    },
  });

  if (similar === 0) return null;
  return {
    type: 'MULTI_ACCOUNT',
    severity: similar >= 3 ? 'HIGH' : 'MEDIUM',
    riskContribution: Math.min(60, similar * 15),
    title: 'Possible multi-account',
    description: `${similar} accounts with similar phone prefix created in the last 6 months`,
    evidence: { similarCount: similar, phonePrefix },
  };
}

// Check for suspicious review patterns (many 5-star reviews in short window)
export async function checkFakeReviews(tradieId: string): Promise<FraudSignal | null> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 86_400_000);
  const recentHighRatings = await db.review.count({
    where: {
      job: { tradieId },
      rating: { gte: 5 },
      createdAt: { gte: sevenDaysAgo },
    },
  });
  if (recentHighRatings < 8) return null;
  return {
    type: 'FAKE_REVIEW',
    severity: 'MEDIUM',
    riskContribution: 25,
    title: 'Suspicious review velocity',
    description: `${recentHighRatings} 5-star ratings received in 7 days`,
    evidence: { recentHighRatings },
  };
}

// Check for rapid job posting (possible fake jobs)
export async function checkFakeJobs(userId: string): Promise<FraudSignal | null> {
  const oneHourAgo = new Date(Date.now() - 3_600_000);
  const recentJobs = await db.job.count({ where: { customerId: userId, createdAt: { gte: oneHourAgo } } });
  if (recentJobs < 5) return null;
  return {
    type: 'FAKE_JOB',
    severity: recentJobs >= 10 ? 'CRITICAL' : 'HIGH',
    riskContribution: Math.min(80, recentJobs * 8),
    title: 'Suspicious job posting velocity',
    description: `${recentJobs} jobs posted in the last hour`,
    evidence: { recentJobs },
  };
}
