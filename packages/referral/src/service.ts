import { db } from '@fixit247/database';
import { generateReferralCode } from './codes';
import { applyReferralReward } from './rewards';

export async function createReferralCode(inviterId: string, targetEmail?: string): Promise<string> {
  const code = generateReferralCode();
  await db.referral.create({
    data: {
      inviterId,
      invitedEmail: targetEmail,
      code,
      rewardType: 'CREDITS',
      rewardValue: 20,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
  return code;
}

export async function redeemReferralCode(code: string, newUserId: string): Promise<boolean> {
  const referral = await db.referral.findUnique({ where: { code } });
  if (!referral || referral.status !== 'PENDING') return false;
  if (referral.expiresAt && referral.expiresAt < new Date()) {
    await db.referral.update({ where: { id: referral.id }, data: { status: 'EXPIRED' } });
    return false;
  }
  await db.referral.update({
    where: { id: referral.id },
    data: { invitedUserId: newUserId, status: 'SIGNED_UP', completedAt: new Date() },
  });
  return true;
}

export async function completeReferral(code: string): Promise<void> {
  const referral = await db.referral.findUnique({ where: { code } });
  if (!referral || referral.status !== 'SIGNED_UP') return;
  await db.referral.update({ where: { id: referral.id }, data: { status: 'COMPLETED' } });
  await applyReferralReward(referral.id);
}

export async function getUserReferralStats(userId: string) {
  const [sent, rewarded] = await Promise.all([
    db.referral.count({ where: { inviterId: userId } }),
    db.referral.count({ where: { inviterId: userId, status: 'REWARDED' } }),
  ]);
  // Sum referral credit transactions from the user's wallet
  const wallet = await db.creditsWallet.findUnique({
    where: { userId },
    select: { id: true },
  });
  const totalEarned = wallet
    ? await db.transaction.aggregate({
        where: {
          walletId: wallet.id,
          type: 'CREDIT',
          referenceType: 'referral',
        },
        _sum: { amount: true },
      })
    : { _sum: { amount: null } };

  return { sent, rewarded, totalEarned: Number(totalEarned._sum.amount ?? 0) };
}
