import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
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

    // Verify the requesting user has access to this job
    const isAdmin = session.role === 'ADMIN' || session.role === 'SUPER_ADMIN';
    if (!isAdmin) {
      const [customerProfile, tradieProfile] = await Promise.all([
        db.customerProfile.findUnique({ where: { userId: session.id } }),
        db.tradieProfile.findUnique({ where: { userId: session.id } }),
      ]);
      const isOwner = job.customerId === customerProfile?.id;
      const isAssignedTradie = job.tradieId != null && job.tradieId === tradieProfile?.id;
      const hasClaim = tradieProfile
        ? (await db.jobClaim.count({ where: { jobId: id, tradieId: tradieProfile.id } })) > 0
        : false;
      if (!isOwner && !isAssignedTradie && !hasClaim) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    return NextResponse.json({ job });
  } catch (err) {
    console.error('[GET /api/jobs/[id]]', err);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}
