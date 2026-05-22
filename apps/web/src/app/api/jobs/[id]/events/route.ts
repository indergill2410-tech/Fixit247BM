import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    const { id: jobId } = await params;

    const job = await db.job.findUnique({
      where: { id: jobId },
      select: { customerId: true, tradieId: true },
    });
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

    const isParticipant =
      job.customerId === session.id ||
      job.tradieId === session.id ||
      ['ADMIN', 'SUPER_ADMIN'].includes(session.role);
    if (!isParticipant) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const events = await db.jobEvent.findMany({
      where: { jobId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ events });
  } catch (err) {
    logger.error('[GET /api/jobs/:id/events]', err);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
