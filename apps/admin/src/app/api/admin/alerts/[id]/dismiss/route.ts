import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
    if (session instanceof NextResponse) return session;
    const { id } = await params;

    await db.platformAlert.update({
      where: { id },
      data: { status: 'DISMISSED', dismissedBy: session.id, dismissedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error('[PATCH /api/admin/alerts/:id/dismiss]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
