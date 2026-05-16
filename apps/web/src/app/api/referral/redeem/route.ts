import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { z } from 'zod';

const schema = z.object({ code: z.string(), newUserId: z.string().uuid() });

export async function POST(req: Request) {
  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  const { code, newUserId } = body.data;

  const referral = await db.referral.findUnique({ where: { code } });
  if (!referral || referral.status !== 'PENDING') return NextResponse.json({ redeemed: false });
  if (referral.expiresAt && referral.expiresAt < new Date()) {
    await db.referral.update({ where: { code }, data: { status: 'EXPIRED' } });
    return NextResponse.json({ redeemed: false, reason: 'expired' });
  }

  await db.referral.update({
    where: { code },
    data: { invitedUserId: newUserId, status: 'SIGNED_UP', completedAt: new Date() },
  });
  return NextResponse.json({ redeemed: true });
}
