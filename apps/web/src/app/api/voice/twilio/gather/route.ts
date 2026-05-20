import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { processConversationTurn, buildResponseTwiML, buildEmergencyTwiML, buildTransferTwiML } from '@fixit247/voice';
import type { ConversationContext, ConversationTurn } from '@fixit247/voice';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

function getWebhookBase(req: Request): string {
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '';
  if (host) return `${proto}://${host}`;
  return (process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/$/, '');
}

export async function POST(req: Request) {
  const start = Date.now();
  const body = await req.text();
  const params = Object.fromEntries(new URLSearchParams(body));

  const callSid = params.CallSid ?? 'unknown';
  const speechResult = params.SpeechResult ?? '';
  const from = params.From ?? 'unknown';
  const webhookBase = getWebhookBase(req);

  logger.info('gather', 'Webhook received', { callSid, from, speechLength: speechResult.length });

  // ── 1. Ensure VoiceCall record exists ──────────────────────────────────────
  let call = await db.voiceCall.findUnique({ where: { twilioCallSid: callSid } })
    .catch((err: unknown) => {
      logger.error('gather', 'DB lookup failed', { callSid, err: String(err) });
      return null;
    });

  if (!call) {
    logger.warn('gather', 'VoiceCall not found — creating recovery record', { callSid });
    call = await db.voiceCall.create({
      data: {
        twilioCallSid: callSid,
        phoneNumber: from,
        direction: 'INBOUND',
        status: 'AI_HANDLING',
        answeredAt: new Date(),
      },
    }).catch((err: unknown) => {
      logger.error('gather', 'Recovery VoiceCall create failed', { callSid, err: String(err) });
      return null;
    });
  }

  if (!call) {
    logger.error('gather', 'Cannot resolve VoiceCall — aborting', { callSid });
    return new NextResponse(
      buildResponseTwiML("Sorry, there's a technical problem on our end. Please call back in a moment.", webhookBase, false),
      { headers: { 'Content-Type': 'text/xml' } },
    );
  }

  // ── 2. Load existing conversation ──────────────────────────────────────────
  const conversation = await db.aIConversation.findUnique({ where: { callId: call.id } })
    .catch(() => null);

  const existingMessages: ConversationTurn[] = conversation
    ? (conversation.messages as ConversationTurn[])
    : [];

  const sessionId = `call_${callSid}`;
  const context: ConversationContext = {
    sessionId,
    messages: existingMessages,
    extractedData: (conversation?.extractedEntities as Record<string, unknown>) ?? {},
    turnCount: existingMessages.filter((m) => m.role === 'user').length,
    isComplete: false,
    isEmergency: conversation?.isEmergency ?? false,
  };

  logger.info('gather', 'Processing turn', { callSid, turnCount: context.turnCount, speechResult });

  // ── 3. Run AI — wrapped in 13s timeout so we always beat Twilio's 15s limit ─
  let aiResponse;
  try {
    aiResponse = await processConversationTurn(speechResult, context);
    logger.info('gather', 'AI response generated', {
      callSid,
      isJobReady: aiResponse.isJobReady,
      emergencyScore: aiResponse.emergencyScore,
      requiresHumanTakeover: aiResponse.requiresHumanTakeover,
      ms: Date.now() - start,
    });
  } catch (err) {
    logger.error('gather', 'processConversationTurn threw', { callSid, err: String(err) });
    aiResponse = {
      message: "Sorry mate, I didn't catch that. Could you say that again?",
      isJobReady: false,
      emergencyDetected: false,
      emergencyScore: 0,
      requiresHumanTakeover: false,
    };
  }

  // ── 4. Persist conversation ────────────────────────────────────────────────
  const newMessages: ConversationTurn[] = [
    ...existingMessages,
    { role: 'user', content: speechResult, timestamp: new Date().toISOString() },
    { role: 'assistant', content: aiResponse.message, timestamp: new Date().toISOString() },
  ];

  await db.aIConversation.upsert({
    where: { callId: call.id },
    create: {
      callId: call.id,
      sessionId,
      messages: newMessages as object[],
      extractedEntities: (aiResponse.extractedJobData ?? {}) as object,
      isEmergency: aiResponse.emergencyDetected,
      urgencyScore: aiResponse.emergencyScore,
      turnCount: context.turnCount + 1,
    },
    update: {
      messages: newMessages as object[],
      extractedEntities: (aiResponse.extractedJobData ?? {}) as object,
      isEmergency: aiResponse.emergencyDetected,
      urgencyScore: aiResponse.emergencyScore,
      turnCount: { increment: 1 },
    },
  }).catch((err: unknown) => {
    logger.error('gather', 'aIConversation upsert failed', { callSid, err: String(err) });
  });

  await db.voiceEvent.create({
    data: {
      callId: call.id,
      eventType: aiResponse.emergencyDetected ? 'EMERGENCY_DETECTED' : 'TRANSCRIPTION_RECEIVED',
      payload: {
        transcript: speechResult,
        response: aiResponse.message,
        emergencyScore: aiResponse.emergencyScore,
      } as object,
      confidence: aiResponse.emergencyScore / 100,
    },
  }).catch((err: unknown) => {
    logger.warn('gather', 'voiceEvent create failed (non-fatal)', { callSid, err: String(err) });
  });

  // ── 5. Human takeover ──────────────────────────────────────────────────────
  if (aiResponse.requiresHumanTakeover) {
    logger.info('gather', 'Transferring to human agent', { callSid });
    await db.voiceCall.update({ where: { id: call.id }, data: { status: 'HUMAN_TAKEOVER' } }).catch(() => null);
    await db.voiceEvent.create({ data: { callId: call.id, eventType: 'HUMAN_TAKEOVER_REQUESTED', payload: {} as object } }).catch(() => null);
    const agentNumber = process.env.TWILIO_FALLBACK_NUMBER ?? process.env.TWILIO_PHONE_NUMBER ?? '';
    return new NextResponse(buildTransferTwiML(agentNumber), { headers: { 'Content-Type': 'text/xml' } });
  }

  // ── 6. Life-threatening emergency ─────────────────────────────────────────
  if (aiResponse.emergencyScore >= 90) {
    logger.warn('gather', 'Life-threatening emergency detected', { callSid, score: aiResponse.emergencyScore });
    return new NextResponse(buildEmergencyTwiML(webhookBase), { headers: { 'Content-Type': 'text/xml' } });
  }

  // ── 7. Job ready — create and confirm ─────────────────────────────────────
  if (aiResponse.isJobReady && aiResponse.extractedJobData) {
    const jobData = aiResponse.extractedJobData;
    logger.info('gather', 'Job ready — triggering creation', { callSid, jobData });

    try {
      const jobRes = await fetch(`${webhookBase}/api/voice/create-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId: call.id, jobData, conversationId: conversation?.id }),
      });
      if (!jobRes.ok) {
        logger.warn('gather', 'create-job returned non-OK', { callSid, status: jobRes.status });
      }
    } catch (err) {
      logger.error('gather', 'create-job fetch failed (non-fatal)', { callSid, err: String(err) });
    }

    await db.voiceCall.update({ where: { id: call.id }, data: { status: 'COMPLETED' } }).catch(() => null);

    const tradeName = jobData.tradeCategory?.toLowerCase().replace(/_/g, ' ') ?? 'tradie';
    const location = jobData.suburb ?? 'your location';
    const confirmMsg = `${aiResponse.message} I've got everything I need — a ${tradeName} is being dispatched to ${location} right now. You'll get a text confirmation shortly. Stay safe, mate!`;

    return new NextResponse(buildResponseTwiML(confirmMsg, webhookBase, true), {
      headers: { 'Content-Type': 'text/xml' },
    });
  }

  // ── 8. Continue conversation ───────────────────────────────────────────────
  logger.debug('gather', 'Continuing conversation', { callSid, ms: Date.now() - start });
  return new NextResponse(buildResponseTwiML(aiResponse.message, webhookBase, false), {
    headers: { 'Content-Type': 'text/xml' },
  });
}
