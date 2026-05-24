import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { getSession } from '@/lib/auth/session';
import { processConversationTurn } from '@fixit247/voice';
import type { ConversationContext, ConversationTurn } from '@fixit247/voice';
import { z } from 'zod';
import crypto from 'crypto';

// POST — start or continue a conversation
export async function POST(req: Request) {
  const session = await getSession().catch(() => null);
  const body = z.object({
    sessionId: z.string().optional(),
    message: z.string().min(1).max(1000),
  }).parse(await req.json());

  const sessionId = body.sessionId ?? crypto.randomUUID();

  // Load existing conversation
  const existing = await db.aIConversation.findUnique({ where: { sessionId } });
  const existingMessages: ConversationTurn[] = existing ? (existing.messages as ConversationTurn[]) : [];

  const context: ConversationContext = {
    sessionId,
    messages: existingMessages,
    extractedData: (existing?.extractedEntities as any) ?? {},
    turnCount: existingMessages.filter((m) => m.role === 'user').length,
    isComplete: false,
    isEmergency: existing?.isEmergency ?? false,
  };

  const aiResponse = await processConversationTurn(body.message, context);

  const newMessages: ConversationTurn[] = [
    ...existingMessages,
    { role: 'user', content: body.message, timestamp: new Date().toISOString() },
    { role: 'assistant', content: aiResponse.message, timestamp: new Date().toISOString() },
  ];

  // Upsert conversation
  const conversation = await db.aIConversation.upsert({
    where: { sessionId },
    create: {
      sessionId,
      messages: newMessages as any,
      extractedEntities: aiResponse.extractedJobData as any ?? {},
      isEmergency: aiResponse.emergencyDetected,
      urgencyScore: aiResponse.emergencyScore,
      turnCount: 1,
      ...(session?.id && {}),
    },
    update: {
      messages: newMessages as any,
      extractedEntities: aiResponse.isJobReady && aiResponse.extractedJobData ? aiResponse.extractedJobData as any : undefined,
      isEmergency: aiResponse.emergencyDetected,
      urgencyScore: aiResponse.emergencyScore,
      turnCount: { increment: 1 },
      ...(aiResponse.isJobReady && { status: 'JOB_CREATED' }),
    },
  });

  return NextResponse.json({
    sessionId,
    message: aiResponse.message,
    isJobReady: aiResponse.isJobReady,
    extractedJobData: aiResponse.extractedJobData,
    emergencyDetected: aiResponse.emergencyDetected,
    emergencyScore: aiResponse.emergencyScore,
    safetyInstructions: aiResponse.safetyInstructions,
    conversationId: conversation.id,
  });
}

// GET — get conversation by sessionId (auth required)
export async function GET(req: Request) {
  const session = await getSession().catch(() => null);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });

  const conversation = await db.aIConversation.findUnique({ where: { sessionId } });
  if (!conversation) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ conversation });
}
