import { db } from '@fixit247/database';

export interface RewardResult {
  inviterCredits: number;
  invitedCredits: number;
  subscriptionDiscount?: number;
}

export async function calculateReferralReward(referralId: string): Promise<RewardResult> {
  const referral = await db.referral.findUniqueOrThrow({ where: { id: referralId } });
  // Default rewards
  const inviterCredits = referral.rewardType === 'CREDITS' ? Number(referral.rewardValue) : 0;
  const invitedCredits = referral.rewardType === 'CREDITS' ? Math.round(Number(referral.rewardValue) * 0.5) : 0;
  return { inviterCredits, invitedCredits };
}

async function creditUserWallet(tx: Parameters<Parameters<typeof db.$transaction>[0]>[0], userId: string, amount: number, description: string): Promise<void> {
  const wallet = await tx.creditsWallet.upsert({
    where: { userId },
    create: { userId, balance: 0, lifetimeEarned: 0, lifetimeSpent: 0 },
    update: {},
  });
  const newBalance = Number(wallet.balance) + amount;
  await tx.creditsWallet.update({
    where: { userId },
    data: {
      balance: { increment: amount },
      lifetimeEarned: { increment: amount },
    },
  });
  await tx.transaction.create({
    data: {
      walletId: wallet.id,
      type: 'CREDIT',
      amount,
      balanceAfter: newBalance,
      description,
      referenceType: 'referral',
    },
  });
}

export async function applyReferralReward(referralId: string): Promise<void> {
  const referral = await db.referral.findUniqueOrThrow({
    where: { id: referralId },
    include: { inviter: true },
  });
  if (referral.status === 'REWARDED') return;

  const { inviterCredits, invitedCredits } = await calculateReferralReward(referralId);

  await db.$transaction(async (tx) => {
    // Credit inviter
    if (inviterCredits > 0) {
      await creditUserWallet(tx, referral.inviterId, inviterCredits, 'Referral reward for inviting a new user');
    }
    // Credit invited user
    if (invitedCredits > 0 && referral.invitedUserId) {
      await creditUserWallet(tx, referral.invitedUserId, invitedCredits, 'Welcome bonus from referral sign-up');
    }
    await tx.referral.update({
      where: { id: referralId },
      data: { status: 'REWARDED', rewardedAt: new Date() },
    });
  });
}
