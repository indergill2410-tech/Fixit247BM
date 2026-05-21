import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';

const Schema = z.object({
  messageId: z.string().uuid().optional(), // if omitted, mark all in job as read
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const session = await requireSession();
    const { jobId } = await params;
    const body = await req.json().catch(() => ({}));
    const { messageId } = Schema.parse(body);

    const now = new Date();
    const where = messageId
      ? { id: messageId, jobId, receiverId: session.id, readAt: null }
      : { jobId, receiverId: session.id, readAt: null };

    await db.message.updateMany({
      where,
      data: { readAt: now, status: 'READ' },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/messages/:jobId/read]', err);
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 });
  }
}
