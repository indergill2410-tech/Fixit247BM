import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';
import { z } from 'zod';
import { logger } from '@/lib/logger';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
    if (session instanceof NextResponse) return session;
    const { id } = await params;

    const [ticket, messages] = await Promise.all([
      db.supportTicket.findUnique({ where: { id } }),
      db.supportMessage.findMany({ where: { ticketId: id }, orderBy: { createdAt: 'asc' } }),
    ]);

    if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    return NextResponse.json({ ticket, messages });
  } catch (err) {
    logger.error('[GET /api/admin/support/:id/messages]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
    if (session instanceof NextResponse) return session;
    const { id } = await params;
    const { content } = z.object({ content: z.string().min(1) }).parse(await req.json());

    const [message] = await db.$transaction([
      db.supportMessage.create({ data: { ticketId: id, senderId: session.id, isAdmin: true, content } }),
      db.supportTicket.update({ where: { id }, data: { status: 'IN_PROGRESS', assignedTo: session.id } }),
    ]);

    return NextResponse.json({ message }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    logger.error('[POST /api/admin/support/:id/messages]', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
