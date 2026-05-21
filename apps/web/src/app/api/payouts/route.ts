import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { getPayoutHistory } from '@fixit247/payments';

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const tradieProfile = await db.tradieProfile.findUnique({ where: { userId: session.id } });
    if (!tradieProfile) return NextResponse.json({ payouts: [], total: 0 });

    const result = await getPayoutHistory(tradieProfile.id, limit, offset);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[GET /api/payouts]', err);
    return NextResponse.json({ error: 'Failed to fetch payouts' }, { status: 500 });
  }
}
