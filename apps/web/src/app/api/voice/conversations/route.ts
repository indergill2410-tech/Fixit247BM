import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import type { Prisma } from '@fixit247/database';
import { getSession } from '@/lib/auth/session';
import { processConversationTurn } from '@fixit247/voice';
import type { ConversationContext, ConversationTurn, ExtractedJobData } from '@fixit247/voice';
import { z } from 'zod';
import crypto from 'crypto';
import { LIMITS, rateLimit, rateLimitResponse } from '@/lib/api/rate-limit';

const ConversationBodySchema = z.object({
  sessionId: z.string().uuid().optional(),
  message: z.string().trim().min(1).max(1000),
});

const ConversationQuerySchema = z.object({
  sessionId: z.string().uuid(),
});

const MAX_CONVERSATION_MESSAGES = 50;

// POST — start or continue a conversation
export async function POST(req: NextRequest) {
  const rl = rateLimit(req, LIMITS.voice);
  if (!rl.success) return rateLimitResponse(rl);

  try {
    const body = ConversationBodySchema.parse(await req.json());

    // Only resume conversations that already exist; new calls always get a server-generated UUID.
    const existing = body.sessionId
      ? await db.aIConversation.findUnique({ where: { sessionId: body.sessionId } })
      : null;
    const sessionId = existing?.sessionId ?? crypto.randomUUID();
    const existingMessages: ConversationTurn[] = existing ? (existing.messages as ConversationTurn[]) : [];

    if (existingMessages.length >= MAX_CONVERSATION_MESSAGES) {
      return NextResponse.json({ error: 'Conversation limit reached. Please start a new booking.' }, { status: 409 });
    }

    const context: ConversationContext = {
      sessionId,
      messages: existingMessages,
      extractedData: (existing?.extractedEntities ?? {}) as Partial<ExtractedJobData>,
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
        messages: newMessages as unknown as Prisma.InputJsonValue,
        extractedEntities: (aiResponse.extractedJobData ?? {}) as unknown as Prisma.InputJsonValue,
        isEmergency: aiResponse.emergencyDetected,
        urgencyScore: aiResponse.emergencyScore,
        turnCount: 1,
      },
      update: {
        messages: newMessages as unknown as Prisma.InputJsonValue,
        extractedEntities: aiResponse.isJobReady && aiResponse.extractedJobData
          ? aiResponse.extractedJobData as unknown as Prisma.InputJsonValue
          : undefined,
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
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid conversation input', details: err.errors }, { status: 400 });
    }
    console.error('[POST /api/voice/conversations]', err);
    return NextResponse.json({ error: 'Conversation failed' }, { status: 500 });
  }
}

// GET — get conversation by sessionId
export async function GET(req: NextRequest) {
  const rl = rateLimit(req, LIMITS.voice);
  if (!rl.success) return rateLimitResponse(rl);

  if (!(await getSession().catch(() => null))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const parsed = ConversationQuerySchema.safeParse({
    sessionId: searchParams.get('sessionId'),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Missing or invalid sessionId' }, { status: 400 });
  }

  const conversation = await db.aIConversation.findUnique({
    where: { sessionId: parsed.data.sessionId },
    select: {
      id: true,
      sessionId: true,
      status: true,
      isEmergency: true,
      urgencyScore: true,
      turnCount: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!conversation) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ conversation });
}
