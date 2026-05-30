import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { requireApiSession } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    const session = await requireApiSession();
    if (session instanceof NextResponse) return session;
    const { jobId } = await req.json();

    const job = await db.job.findUnique({
      where: { id: jobId },
      include: { claims: { where: { isAccepted: true }, take: 1 } },
    });
    if (!job || job.status !== 'COMPLETED') return NextResponse.json({ error: 'Job not eligible' }, { status: 400 });

    const tradieId = job.claims[0]?.tradieId;
    if (!tradieId) return NextResponse.json({ error: 'No tradie found' }, { status: 400 });

    const request = await db.reviewRequest.upsert({
      where: { jobId_customerId: { jobId, customerId: job.customerId } },
      create: {
        jobId,
        customerId: job.customerId,
        tradieId,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      update: {},
    });

    return NextResponse.json({ request });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
