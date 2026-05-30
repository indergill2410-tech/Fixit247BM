import { NextResponse } from 'next/server';
import { requireApiRole } from '@/lib/auth/session';
import { db } from '@fixit247/database';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireApiRole(['ADMIN', 'SUPER_ADMIN']);
  if (session instanceof NextResponse) return session;
  const { id } = await params;

  const call = await db.voiceCall.update({
    where: { id },
    data: { status: 'HUMAN_TAKEOVER', assignedAgentId: session.id },
  });

  await db.voiceEvent.create({
    data: { callId: id, eventType: 'HUMAN_TOOK_OVER', payload: { agentId: session.id } as any },
  });

  return NextResponse.json({ call, success: true });
}
