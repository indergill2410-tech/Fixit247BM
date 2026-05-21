import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { id } = await params;

    await db.platformAlert.update({
      where: { id },
      data: { status: 'DISMISSED', dismissedBy: session.id, dismissedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/admin/alerts/:id/dismiss]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
