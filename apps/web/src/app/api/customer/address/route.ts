import { NextResponse } from 'next/server';
import { requireApiSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';

export async function GET() {
  const session = await requireApiSession();
  if (session instanceof NextResponse) return session;

  try {
    const profile = await db.customerProfile.findUnique({
      where: { userId: session.id },
      select: { defaultAddressId: true },
    });

    if (!profile?.defaultAddressId) {
      return NextResponse.json({ address: null });
    }

    const address = await db.address.findUnique({
      where: { id: profile.defaultAddressId },
      select: { id: true, suburb: true, state: true, latitude: true, longitude: true },
    });

    return NextResponse.json({ address });
  } catch (err) {
    console.error('[GET /api/customer/address]', err);
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
  }
}
