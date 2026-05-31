import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireApiSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { getCreditHistory } from '@fixit247/payments';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const session = await requireApiSession();
    if (session instanceof NextResponse) return session;
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const tradieProfile = await db.tradieProfile.findUnique({ where: { userId: session.id } });
    if (!tradieProfile) return NextResponse.json({ entries: [], total: 0 });

    const result = await getCreditHistory(tradieProfile.id, limit, offset);
    return NextResponse.json(result);
  } catch (err) {
    logger.error('[GET /api/credits/history]', err);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
