import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireRole('ADMIN');
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
