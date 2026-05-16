import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { getSession } from '@/lib/auth/session';

export async function GET() {
  const session = await getSession().catch(() => null);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let referral = await db.referral.findFirst({
    where: { inviterId: session.userId, status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
  });

  if (!referral) {
    const code = `FX${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    referral = await db.referral.create({
      data: {
        inviterId: session.userId,
        code,
        rewardType: 'CREDITS',
        rewardValue: 20,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    });
  }

  const [sentCount, rewarded, totalEarned] = await Promise.all([
    db.referral.count({ where: { inviterId: session.userId } }),
    db.referral.count({ where: { inviterId: session.userId, status: 'REWARDED' } }),
    db.creditLedger.aggregate({ where: { userId: session.userId, type: 'REFERRAL_BONUS' }, _sum: { amount: true } }).catch(() => ({ _sum: { amount: null } })),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fixit247.com.au';
  return NextResponse.json({
    code: referral.code,
    link: `${siteUrl}/auth/register?ref=${referral.code}`,
    stats: { sent: sentCount, rewarded, totalEarned: Number(totalEarned._sum.amount ?? 0) },
  });
}
