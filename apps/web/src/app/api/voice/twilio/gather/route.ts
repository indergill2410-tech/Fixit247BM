import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { processConversationTurn, buildResponseTwiML, buildEmergencyTwiML, buildTransferTwiML } from '@fixit247/voice';
import type { ConversationContext, ConversationTurn } from '@fixit247/voice';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.text();
  const params = Object.fromEntries(new URLSearchParams(body));
  const callSid = params.CallSid;
  const speechResult = params.SpeechResult ?? '';
  const webhookBase = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fixit247.com.au';

  // Load or create conversation
  const call = await db.voiceCall.findUnique({ where: { twilioCallSid: callSid } });
  if (!call) {
    return new NextResponse(buildResponseTwiML("Sorry, I've lost track of our call. Please call back.", webhookBase, false), {
      headers: { 'Content-Type': 'text/xml' },
    });
  }

  // Load existing conversation
  let conversation = await db.aIConversation.findUnique({ where: { callId: call.id } });
  const existingMessages: ConversationTurn[] = conversation
    ? (conversation.messages as ConversationTurn[])
    : [];

  const sessionId = `call_${callSid}`;
  const context: ConversationContext = {
    sessionId,
    messages: existingMessages,
    extractedData: (conversation?.extractedEntities as any) ?? {},
    turnCount: existingMessages.filter((m) => m.role === 'user').length,
    isComplete: false,
    isEmergency: conversation?.isEmergency ?? false,
  };

  // Process the user's speech
  const aiResponse = await processConversationTurn(speechResult, context);

  // Update messages
  const newMessages: ConversationTurn[] = [
    ...existingMessages,
    { role: 'user', content: speechResult, timestamp: new Date().toISOString() },
    { role: 'assistant', content: aiResponse.message, timestamp: new Date().toISOString() },
  ];

  // Upsert conversation
  await db.aIConversation.upsert({
    where: { callId: call.id },
    create: {
      callId: call.id,
      sessionId,
      messages: newMessages as any,
      extractedEntities: aiResponse.extractedJobData as any ?? {},
      isEmergency: aiResponse.emergencyDetected,
      urgencyScore: aiResponse.emergencyScore,
      turnCount: context.turnCount + 1,
    },
    update: {
      messages: newMessages as any,
      extractedEntities: aiResponse.extractedJobData as any ?? {},
      isEmergency: aiResponse.emergencyDetected,
      urgencyScore: aiResponse.emergencyScore,
      turnCount: { increment: 1 },
    },
  });

  // Log voice event
  await db.voiceEvent.create({
    data: {
      callId: call.id,
      eventType: aiResponse.emergencyDetected ? 'EMERGENCY_DETECTED' : 'TRANSCRIPTION_RECEIVED',
      payload: { transcript: speechResult, response: aiResponse.message, emergencyScore: aiResponse.emergencyScore } as any,
      confidence: aiResponse.emergencyScore / 100,
    },
  });

  // Human takeover
  if (aiResponse.requiresHumanTakeover) {
    await db.voiceCall.update({ where: { id: call.id }, data: { status: 'HUMAN_TAKEOVER' } });
    await db.voiceEvent.create({ data: { callId: call.id, eventType: 'HUMAN_TAKEOVER_REQUESTED', payload: {} as any } });
    const agentNumber = process.env.TWILIO_FALLBACK_NUMBER ?? '+611800000000';
    return new NextResponse(buildTransferTwiML(agentNumber), { headers: { 'Content-Type': 'text/xml' } });
  }

  // Life-threatening emergency TwiML
  if (aiResponse.emergencyScore >= 90) {
    return new NextResponse(buildEmergencyTwiML(webhookBase), { headers: { 'Content-Type': 'text/xml' } });
  }

  // Job ready — create job and confirm
  if (aiResponse.isJobReady && aiResponse.extractedJobData) {
    const jobData = aiResponse.extractedJobData;

    // Trigger job creation via internal API
    try {
      await fetch(`${webhookBase}/api/voice/create-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId: call.id, jobData, conversationId: conversation?.id }),
      });
    } catch { /* non-blocking */ }

    await db.voiceCall.update({ where: { id: call.id }, data: { status: 'COMPLETED' } });

    return new NextResponse(
      buildResponseTwiML(
        `${aiResponse.message} I've got everything I need — a ${jobData.tradeCategory?.toLowerCase() ?? 'tradie'} is being dispatched to ${jobData.suburb ?? 'your location'} right now.`,
        webhookBase,
        true,
      ),
      { headers: { 'Content-Type': 'text/xml' } },
    );
  }

  return new NextResponse(buildResponseTwiML(aiResponse.message, webhookBase, false), {
    headers: { 'Content-Type': 'text/xml' },
  });
}
