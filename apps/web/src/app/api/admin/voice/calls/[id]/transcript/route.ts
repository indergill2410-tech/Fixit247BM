import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
  if (session instanceof NextResponse) return session;
  const { id } = await params;

  const call = await db.voiceCall.findUnique({
    where: { id },
    include: {
      customer: { select: { firstName: true, lastName: true, phone: true, email: true } },
      events: { orderBy: { createdAt: 'asc' } },
      conversation: true,
      assessment: true,
    },
  });
  if (!call) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ call });
}
