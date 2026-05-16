import { db } from '@fixit247/database';

export interface AttributionMetrics {
  cac: number;
  ltv: number;
  ltvCacRatio: number;
  conversionRate: number;
  avgJobsPerUser: number;
}

export async function calculatePlatformCAC(days = 30): Promise<number> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const [campaignSpend, newUsers] = await Promise.all([
    db.marketingCampaign.aggregate({
      where: { sentAt: { gte: since } },
      _sum: { costSpent: true },
    }),
    db.user.count({ where: { createdAt: { gte: since } } }),
  ]);
  const spend = Number(campaignSpend._sum.costSpent ?? 0);
  return newUsers > 0 ? Math.round((spend / newUsers) * 100) / 100 : 0;
}

export async function estimateUserLTV(userId: string): Promise<number> {
  // Jobs are linked to CustomerProfile, which links to User
  const customerProfile = await db.customerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!customerProfile) return 0;

  const jobs = await db.job.findMany({
    where: { customerId: customerProfile.id, status: 'COMPLETED' },
    select: { payment: { select: { amount: true } } },
  });
  const totalRevenue = jobs.reduce((sum, j) => sum + (j.payment ? Number(j.payment.amount) : 0), 0);
  const avgOrderValue = jobs.length > 0 ? totalRevenue / jobs.length : 0;
  const estimatedJobsPerYear = Math.max(jobs.length * 2, 3);
  // 15% platform take rate applied to estimate platform LTV
  return Math.round(avgOrderValue * estimatedJobsPerYear * 0.15);
}
