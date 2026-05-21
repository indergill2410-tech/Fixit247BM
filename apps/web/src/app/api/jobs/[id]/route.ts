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
    await requireSession();
    const { id } = await params;

    const job = await db.job.findUnique({
      where: { id },
      include: {
        address: true,
        aiInsight: true,
        images: true,
        timeline: { orderBy: { createdAt: 'asc' } },
        matchingQueue: {
          where: { status: { in: ['SENT', 'ACCEPTED'] } },
          take: 5,
        },
        claims: {
          where: { isAccepted: true },
          include: { tradie: { include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } } } },
        },
        payment: true,
        review: true,
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (err) {
    logger.error('[GET /api/jobs/[id]]', err);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}
