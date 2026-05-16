import { db } from '@fixit247/database';
import {
  checkExcessiveCancellations,
  checkRefundAbuse,
  checkMultiAccount,
  checkFakeReviews,
  checkFakeJobs,
} from './signals';
import { calculateFraudRisk, type FraudRiskResult } from './scorer';

export async function runFraudCheck(userId: string, context: 'customer' | 'tradie'): Promise<FraudRiskResult> {
  const signalChecks = context === 'customer'
    ? [
        checkExcessiveCancellations(userId),
        checkRefundAbuse(userId),
        checkMultiAccount(userId),
        checkFakeJobs(userId),
      ]
    : [
        checkMultiAccount(userId),
        checkFakeReviews(userId),
      ];

  const signalResults = await Promise.allSettled(signalChecks);
  const signals = signalResults
    .filter((r): r is PromiseFulfilledResult<NonNullable<Awaited<ReturnType<typeof checkExcessiveCancellations>>>> =>
      r.status === 'fulfilled' && r.value !== null
    )
    .map((r) => r.value);

  const result = calculateFraudRisk(signals);

  // Auto-create fraud flag if risk is significant
  if (result.riskScore >= 40 && signals.length > 0) {
    const topSignal = signals[0]!;
    const existingFlag = await db.fraudFlag.findFirst({
      where: { userId, type: topSignal.type as never, status: { in: ['PENDING', 'UNDER_REVIEW'] } },
    });

    if (!existingFlag) {
      await db.fraudFlag.create({
        data: {
          userId,
          type: topSignal.type as never,
          severity: result.severity as never,
          riskScore: result.riskScore,
          title: topSignal.title,
          description: topSignal.description,
          evidence: { signals: signals.map((s) => ({ type: s.type, description: s.description, evidence: s.evidence })) } as never,
          autoDetected: true,
          status: result.recommendation === 'SUSPEND' ? 'AUTO_SUSPENDED' : 'PENDING',
        },
      });

      // Auto-suspend if critically high risk
      if (result.recommendation === 'SUSPEND') {
        await db.user.update({ where: { id: userId }, data: { isActive: false } });
      }
    }
  }

  return result;
}

export async function resolveFraudFlag(
  flagId: string,
  adminId: string,
  resolution: 'RESOLVED_SAFE' | 'RESOLVED_FRAUD' | 'ESCALATED',
  notes?: string
): Promise<void> {
  await db.$transaction([
    db.fraudFlag.update({
      where: { id: flagId },
      data: {
        status: resolution as never,
        reviewedBy: adminId,
        reviewedAt: new Date(),
        resolvedAt: resolution !== 'ESCALATED' ? new Date() : null,
        description: notes ? `${notes}` : undefined,
      },
    }),
    db.adminAuditLog.create({
      data: {
        adminId,
        action: `FRAUD_FLAG_${resolution}`,
        entity: 'FraudFlag',
        entityId: flagId,
        metadata: { resolution, notes } as never,
      },
    }),
  ]);
}

export async function getFraudQueue(limit = 50) {
  return db.fraudFlag.findMany({
    where: { status: { in: ['PENDING', 'UNDER_REVIEW'] } },
    orderBy: [{ severity: 'desc' }, { createdAt: 'asc' }],
    take: limit,
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  });
}
