import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { z } from 'zod';
import { requireApiSession } from '@/lib/auth/session';

const schema = z.object({ code: z.string().min(1) });

export async function POST(req: NextRequest) {
  // Must be authenticated — the caller can only redeem on their own account.
  const session = await requireApiSession();
  if (session instanceof NextResponse) return session;

  const parsed = schema.safeParse(await req.json() as unknown);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const { code } = parsed.data;

  // Use the authenticated user's ID — not a caller-supplied UUID.
  const newUserId = session.id;

  const referral = await db.referral.findUnique({ where: { code } });
  if (!referral || referral.status !== 'PENDING') return NextResponse.json({ redeemed: false, reason: 'invalid' });
  if (referral.expiresAt && referral.expiresAt < new Date()) {
    await db.referral.update({ where: { code }, data: { status: 'EXPIRED' } });
    return NextResponse.json({ redeemed: false, reason: 'expired' });
  }

  // Prevent a user from redeeming their own referral code
  if (referral.inviterId === newUserId) {
    return NextResponse.json({ redeemed: false, reason: 'self_referral' }, { status: 400 });
  }

  // Atomic check-and-set: only update if status is still PENDING, preventing TOCTOU
  // race where two concurrent requests both pass the status check above.
  const updated = await db.referral.updateMany({
    where: { code, status: 'PENDING' },
    data: { invitedUserId: newUserId, status: 'SIGNED_UP', completedAt: new Date() },
  });

  if (updated.count === 0) {
    return NextResponse.json({ redeemed: false, reason: 'already_redeemed' });
  }
  return NextResponse.json({ redeemed: true });
}
