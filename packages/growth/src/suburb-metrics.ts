import { db } from '@fixit247/database';

export async function recalculateSuburbMetrics(suburb: string, state: string): Promise<void> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Count jobs and tradies active in this suburb via the Address relation
  const [jobCount, completedJobs, activeTradies] = await Promise.all([
    db.job.count({
      where: { address: { suburb, state }, createdAt: { gte: thirtyDaysAgo } },
    }),
    db.job.count({
      where: { address: { suburb, state }, status: 'COMPLETED', createdAt: { gte: thirtyDaysAgo } },
    }),
    db.job.groupBy({
      by: ['tradieId'],
      where: {
        address: { suburb, state },
        tradieId: { not: null },
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
  ]);

  const tradieCount = activeTradies.length;
  const conversionRate = jobCount > 0 ? completedJobs / jobCount : 0;
  const demandScore = Math.min(100, jobCount * 5);
  const supplyScore = Math.min(100, tradieCount * 10);
  const isUnderserved = demandScore > 40 && supplyScore < 30;
  const expansionPriority = isUnderserved ? Math.round((demandScore - supplyScore) / 10) : 0;

  await db.suburbMetrics.upsert({
    where: { suburb_state: { suburb, state } },
    create: {
      suburb,
      state,
      demandScore,
      supplyScore,
      conversionRate,
      jobCount30d: jobCount,
      tradieCount,
      isUnderserved,
      expansionPriority,
      lastCalculatedAt: new Date(),
    },
    update: {
      demandScore,
      supplyScore,
      conversionRate,
      jobCount30d: jobCount,
      tradieCount,
      isUnderserved,
      expansionPriority,
      lastCalculatedAt: new Date(),
    },
  });
}

export async function getUnderservedSuburbs(limit = 20) {
  return db.suburbMetrics.findMany({
    where: { isUnderserved: true },
    orderBy: { expansionPriority: 'desc' },
    take: limit,
  });
}

export async function getTopSuburbsByDemand(limit = 20) {
  return db.suburbMetrics.findMany({
    orderBy: { demandScore: 'desc' },
    take: limit,
  });
}
