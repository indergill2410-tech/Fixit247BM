import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireApiSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireApiSession();
    if (session instanceof NextResponse) return session;
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
    console.error('[GET /api/jobs/[id]]', err);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}
