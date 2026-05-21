import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';

const SendSchema = z.object({
  content: z.string().min(1).max(2000),
  type: z.enum(['TEXT', 'IMAGE', 'FILE', 'VOICE']).default('TEXT'),
  mediaUrl: z.string().url().optional(),
  receiverId: z.string().uuid().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const session = await requireSession();
    const { jobId } = await params;
    const cursor = req.nextUrl.searchParams.get('cursor');
    const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? '50'), 100);

    // Verify user is a participant in this job
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

    const messages = await db.message.findMany({
      where: {
        jobId,
        deletedAt: null,
        ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Mark unread messages as delivered for the current user
    const unreadIds = messages
      .filter((m) => m.receiverId === session.id && !m.deliveredAt)
      .map((m) => m.id);

    if (unreadIds.length > 0) {
      await db.message.updateMany({
        where: { id: { in: unreadIds } },
        data: { deliveredAt: new Date(), status: 'DELIVERED' },
      });
    }

    return NextResponse.json({
      messages: messages.reverse(),
      nextCursor: messages.length === limit ? messages[0]?.createdAt.toISOString() : null,
    });
  } catch (err) {
    console.error('[GET /api/messages/:jobId]', err);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const session = await requireSession();
    const { jobId } = await params;
    const body = await req.json();
    const { content, type, mediaUrl, receiverId } = SendSchema.parse(body);

    // Rate limit: max 30 messages per minute per user per job
    const oneMinuteAgo = new Date(Date.now() - 60_000);
    const recentCount = await db.message.count({
      where: { jobId, senderId: session.id, createdAt: { gte: oneMinuteAgo } },
    });
    if (recentCount >= 30) {
      return NextResponse.json({ error: 'Rate limit exceeded. Max 30 messages per minute.' }, { status: 429 });
    }

    // Verify participant
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

    const message = await db.message.create({
      data: {
        jobId,
        senderId: session.id,
        receiverId: receiverId ?? (job.customerId === session.id ? job.tradieId : job.customerId) ?? undefined,
        content,
        type: type as never,
        status: 'SENT',
        mediaUrl,
        mediaType: type !== 'TEXT' ? type.toLowerCase() : undefined,
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    console.error('[POST /api/messages/:jobId]', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
