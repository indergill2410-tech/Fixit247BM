import { db } from '@fixit247/database';
import type { Prisma } from '@fixit247/database';
import type { JobComplexity, JobPriority } from './pricing';
import { calculateCreditCost } from './pricing';

export interface WalletBalance {
  balance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
}

export async function getWalletBalance(userId: string): Promise<WalletBalance> {
  const wallet = await db.creditsWallet.findUnique({ where: { userId } });
  if (!wallet) return { balance: 0, lifetimeEarned: 0, lifetimeSpent: 0 };
  return {
    balance: Number(wallet.balance),
    lifetimeEarned: Number(wallet.lifetimeEarned),
    lifetimeSpent: Number(wallet.lifetimeSpent),
  };
}

export async function deductCreditsForJob(opts: {
  userId: string;
  tradieProfileId: string;
  jobId: string;
  complexity: JobComplexity;
  priority: JobPriority;
  subscriptionTier?: string;
}): Promise<{ success: boolean; creditsDeducted: number; balanceAfter: number; error?: string }> {
  const creditCost = calculateCreditCost(opts.complexity, opts.priority, opts.subscriptionTier);

  return db.$transaction(async (tx: Prisma.TransactionClient) => {
    const wallet = await tx.creditsWallet.findUnique({ where: { userId: opts.userId } });
    const currentBalance = Number(wallet?.balance ?? 0);

    if (currentBalance < creditCost) {
      return { success: false, creditsDeducted: 0, balanceAfter: currentBalance, error: 'Insufficient credits' };
    }

    const balanceAfter = currentBalance - creditCost;

    await tx.creditsWallet.update({
      where: { userId: opts.userId },
      data: {
        balance: { decrement: creditCost },
        lifetimeSpent: { increment: creditCost },
      },
    });

    await tx.creditLedger.create({
      data: {
        tradieId: opts.tradieProfileId,
        type: 'JOB_DEDUCTION',
        credits: -creditCost,
        balanceAfter,
        jobId: opts.jobId,
        description: `Credits deducted for job acceptance (${opts.complexity} ${opts.priority})`,
      },
    });

    return { success: true, creditsDeducted: creditCost, balanceAfter };
  });
}

export async function addCredits(opts: {
  userId: string;
  tradieProfileId: string;
  credits: number;
  type: 'PURCHASE' | 'BONUS' | 'REFUND' | 'ADMIN_ADJUSTMENT' | 'REFERRAL' | 'SUBSCRIPTION_CREDIT';
  description: string;
  referenceId?: string;
  packageId?: string;
}): Promise<{ balanceAfter: number }> {
  return db.$transaction(async (tx: Prisma.TransactionClient) => {
    const wallet = await tx.creditsWallet.upsert({
      where: { userId: opts.userId },
      create: {
        userId: opts.userId,
        balance: opts.credits,
        lifetimeEarned: opts.credits,
        lifetimeSpent: 0,
      },
      update: {
        balance: { increment: opts.credits },
        lifetimeEarned: { increment: opts.credits },
      },
    });

    const balanceAfter = Number(wallet.balance);

    await tx.creditLedger.create({
      data: {
        tradieId: opts.tradieProfileId,
        type: opts.type as never,
        credits: opts.credits,
        balanceAfter,
        description: opts.description,
        ...(opts.referenceId !== undefined && { referenceId: opts.referenceId }),
        ...(opts.packageId !== undefined && { packageId: opts.packageId }),
      },
    });

    return { balanceAfter };
  });
}

export async function getCreditHistory(
  tradieProfileId: string,
  limit = 20,
  offset = 0
) {
  const [entries, total] = await Promise.all([
    db.creditLedger.findMany({
      where: { tradieId: tradieProfileId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    db.creditLedger.count({ where: { tradieId: tradieProfileId } }),
  ]);
  return { entries, total };
}

export async function getAvailableCreditPackages() {
  return db.creditPackage.findMany({
    where: { isActive: true },
    orderBy: [{ displayOrder: 'asc' }, { priceAud: 'asc' }],
  });
}
