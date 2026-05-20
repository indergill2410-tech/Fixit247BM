import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import {
  processConversationTurn,
  buildResponseTwiML,
  buildEmergencyTwiML,
  buildTransferTwiML,
  generateJobSummary,
} from '@fixit247/voice';
import type { ConversationContext, ConversationTurn } from '@fixit247/voice';
import { logger } from '@/lib/logger';
import crypto from 'crypto';

export const runtime = 'nodejs';

function validateTwilioSignature(req: Request, body: string, urlPath: string): boolean {
  const twilioSignature = req.headers.get('x-twilio-signature');
  const authToken = process.env['TWILIO_AUTH_TOKEN'];

  if (!authToken) {
    logger.warn('TWILIO_AUTH_TOKEN not set — skipping signature validation');
    return true;
  }
  if (!twilioSignature) {
    return process.env['NODE_ENV'] !== 'production';
  }

  const base = (process.env['NEXT_PUBLIC_APP_URL'] ?? '').replace(/\/$/, '');
  const url = `${base}${urlPath}`;
  const params = Object.fromEntries(new URLSearchParams(body));
  const sortedKeys = Object.keys(params).sort();
  const data = url + sortedKeys.map((k) => `${k}${params[k] ?? ''}`).join('');
  const expected = crypto.createHmac('sha1', authToken).update(data).digest('base64');
  const valid = expected === twilioSignature;
  if (!valid) logger.warn('Twilio gather: signature mismatch', { url });
  return valid;
}

async function createJobFromCallData(
  call: { id: string; phoneNumber: string; customerId: string | null },
  conversationId: string | undefined,
  jobData: { issue?: string | null; tradeCategory?: string | null; suburb?: string | null; isEmergency?: boolean; urgencyScore?: number },
  messages: ConversationTurn[],
): Promise<string | null> {
  try {
    const context: ConversationContext = {
      sessionId: `call_${call.id}`,
      messages,
      extractedData: {},
      turnCount: messages.length,
      isComplete: true,
      isEmergency: jobData.isEmergency ?? false,
    };
    const description = await generateJobSummary(context).catch(() => jobData.issue ?? 'Emergency service required');

    const CATEGORY_MAP: Record<string, string> = {
      PLUMBING: 'PLUMBING', ELECTRICAL: 'ELECTRICAL', LOCKSMITH: 'LOCKSMITH',
      HVAC: 'HVAC', ROOFING: 'ROOFING', GLAZING: 'GLAZING',
      PEST_CONTROL: 'PEST_CONTROL', CARPENTRY: 'CARPENTRY',
      PLASTERING: 'PLASTERING', GENERAL_MAINTENANCE: 'GENERAL_MAINTENANCE',
    };
    const category = CATEGORY_MAP[jobData.tradeCategory ?? ''] ?? 'GENERAL_MAINTENANCE';

    // Find customer profile
    let customerProfileId: string | null = null;
    const userId = call.customerId;
    if (userId) {
      const profile = await db.customerProfile.findUnique({ where: { userId } });
      customerProfileId = profile?.id ?? null;
    }
    if (!customerProfileId) {
      // Try phone lookup
      const user = await db.user.findFirst({ where: { phone: call.phoneNumber } });
      if (user) {
        const profile = await db.customerProfile.findUnique({ where: { userId: user.id } });
        customerProfileId = profile?.id ?? null;
      }
    }

    if (!customerProfileId) {
      logger.warn('No customer profile for voice job — skipping job creation', { callId: call.id });
      return null;
    }

    // Create address if suburb provided
    let addressId: string | undefined;
    if (jobData.suburb && userId) {
      const address = await db.address.create({
        data: {
          userId,
          street: 'To be confirmed',
          suburb: jobData.suburb,
          city: jobData.suburb,
          state: 'NSW',
          postcode: '0000',
          country: 'AU',
        },
      });
      addressId = address.id;
    }

    const job = await db.job.create({
      data: {
        title: `${jobData.isEmergency ? 'EMERGENCY: ' : ''}${category.replace(/_/g, ' ')} — Voice Booking`,
        description,
        category: category as never,
        status: 'OPEN',
        priority: jobData.isEmergency ? 'EMERGENCY' : 'URGENT',
        isEmergency: jobData.isEmergency ?? false,
        customerId: customerProfileId,
        ...(addressId && { addressId }),
      },
    });

    await db.voiceCall.update({ where: { id: call.id }, data: { jobId: job.id, status: 'COMPLETED' } });

    if (conversationId) {
      await db.aIConversation.update({
        where: { id: conversationId },
        data: { jobId: job.id, status: 'JOB_CREATED' },
      });
    }

    if (jobData.isEmergency && (jobData.urgencyScore ?? 0) > 0) {
      const urgency = jobData.urgencyScore ?? 50;
      await db.emergencyAssessment.create({
        data: {
          jobId: job.id,
          callId: call.id,
          riskLevel: urgency >= 85 ? 'CRITICAL' : urgency >= 60 ? 'HIGH' : 'MEDIUM',
          emergencyScore: urgency,
          detectedKeywords: [],
          recommendedAction: 'Auto-dispatched via voice AI',
          safetyInstructions: [],
          autoDispatch: true,
        },
      });
    }

    await db.voiceEvent.create({
      data: { callId: call.id, eventType: 'JOB_CREATED', payload: { jobId: job.id } as never },
    });

    logger.info('Voice job created', { jobId: job.id, callId: call.id, category });
    return job.id;
  } catch (err) {
    logger.error('Failed to create voice job', {
      callId: call.id,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

export async function POST(req: Request) {
  const body = await req.text();

  if (!validateTwilioSignature(req, body, '/api/voice/twilio/gather')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const params = Object.fromEntries(new URLSearchParams(body));
  const callSid = params['CallSid'];
  const speechResult = (params['SpeechResult'] ?? '').trim();
  const webhookBase = (process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://fixit247bm.onrender.com').replace(/\/$/, '');

  logger.info('Gather received', { callSid, speechLength: speechResult.length });

  if (!callSid) {
    logger.error('Gather: missing CallSid');
    return new NextResponse(
      buildResponseTwiML("Sorry, there was a technical issue. Please call back.", webhookBase, false),
      { headers: { 'Content-Type': 'text/xml; charset=utf-8' } },
    );
  }

  if (!speechResult) {
    // No speech detected — prompt again
    logger.info('Gather: no speech detected, prompting again', { callSid });
    return new NextResponse(
      buildResponseTwiML("Sorry, I didn't catch that. Go ahead and describe what's happening.", webhookBase, false),
      { headers: { 'Content-Type': 'text/xml; charset=utf-8' } },
    );
  }

  let call;
  try {
    call = await db.voiceCall.findUnique({ where: { twilioCallSid: callSid } });
  } catch (err) {
    logger.error('Gather: DB lookup failed', { callSid, error: err instanceof Error ? err.message : String(err) });
  }

  if (!call) {
    // Call record missing (DB failure or race condition) — create it now and continue
    logger.warn('Gather: call record not found, creating recovery record', { callSid });
    try {
      call = await db.voiceCall.create({
        data: {
          twilioCallSid: callSid,
          phoneNumber: params['From'] ?? 'unknown',
          direction: 'INBOUND',
          status: 'AI_HANDLING',
          answeredAt: new Date(),
        },
      });
    } catch (err) {
      logger.error('Gather: recovery record creation failed — continuing without DB', {
        callSid,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Load existing conversation
  let conversation = null;
  const existingMessages: ConversationTurn[] = [];

  if (call) {
    try {
      conversation = await db.aIConversation.findUnique({ where: { callId: call.id } });
      if (conversation) {
        existingMessages.push(...(conversation.messages as ConversationTurn[]));
      }
    } catch (err) {
      logger.error('Gather: failed to load conversation', { callSid, error: err instanceof Error ? err.message : String(err) });
    }
  }

  const sessionId = `call_${callSid}`;
  const context: ConversationContext = {
    sessionId,
    messages: existingMessages,
    extractedData: (conversation?.extractedEntities as Record<string, unknown>) ?? {},
    turnCount: existingMessages.filter((m) => m.role === 'user').length,
    isComplete: false,
    isEmergency: conversation?.isEmergency ?? false,
  };

  // Call OpenAI
  let aiResponse;
  try {
    aiResponse = await processConversationTurn(speechResult, context);
    logger.info('AI response generated', {
      callSid,
      turn: context.turnCount + 1,
      isJobReady: aiResponse.isJobReady,
      emergencyScore: aiResponse.emergencyScore,
    });
  } catch (err) {
    logger.error('OpenAI call failed', { callSid, error: err instanceof Error ? err.message : String(err) });
    return new NextResponse(
      buildResponseTwiML("Sorry, I'm having a technical issue. Please hold while I transfer you.", webhookBase, false),
      { headers: { 'Content-Type': 'text/xml; charset=utf-8' } },
    );
  }

  // Persist updated conversation
  const newMessages: ConversationTurn[] = [
    ...existingMessages,
    { role: 'user', content: speechResult, timestamp: new Date().toISOString() },
    { role: 'assistant', content: aiResponse.message, timestamp: new Date().toISOString() },
  ];

  if (call) {
    try {
      conversation = await db.aIConversation.upsert({
        where: { callId: call.id },
        create: {
          callId: call.id,
          sessionId,
          messages: newMessages as never,
          extractedEntities: (aiResponse.extractedJobData as never) ?? {},
          isEmergency: aiResponse.emergencyDetected,
          urgencyScore: aiResponse.emergencyScore,
          turnCount: 1,
        },
        update: {
          messages: newMessages as never,
          extractedEntities: (aiResponse.extractedJobData as never) ?? {},
          isEmergency: aiResponse.emergencyDetected,
          urgencyScore: aiResponse.emergencyScore,
          turnCount: { increment: 1 },
        },
      });

      await db.voiceEvent.create({
        data: {
          callId: call.id,
          eventType: aiResponse.emergencyDetected ? 'EMERGENCY_DETECTED' : 'TRANSCRIPTION_RECEIVED',
          payload: {
            transcript: speechResult,
            response: aiResponse.message,
            emergencyScore: aiResponse.emergencyScore,
          } as never,
          confidence: aiResponse.emergencyScore / 100,
        },
      });
    } catch (err) {
      logger.error('Gather: failed to persist conversation', { callSid, error: err instanceof Error ? err.message : String(err) });
    }
  }

  // Human takeover
  if (aiResponse.requiresHumanTakeover) {
    logger.info('Human takeover triggered', { callSid });
    if (call) {
      await db.voiceCall.update({ where: { id: call.id }, data: { status: 'HUMAN_TAKEOVER' } }).catch(() => null);
      await db.voiceEvent.create({ data: { callId: call.id, eventType: 'HUMAN_TAKEOVER_REQUESTED', payload: {} as never } }).catch(() => null);
    }
    const agentNumber = process.env['TWILIO_FALLBACK_NUMBER'] ?? '';
    if (agentNumber) {
      return new NextResponse(buildTransferTwiML(agentNumber), { headers: { 'Content-Type': 'text/xml; charset=utf-8' } });
    }
  }

  // Life-threatening emergency
  if (aiResponse.emergencyScore >= 90) {
    logger.info('Life-threatening emergency detected', { callSid, score: aiResponse.emergencyScore });
    return new NextResponse(buildEmergencyTwiML(webhookBase), { headers: { 'Content-Type': 'text/xml; charset=utf-8' } });
  }

  // Job ready — create inline (no self-fetch)
  if (aiResponse.isJobReady && aiResponse.extractedJobData && call) {
    const jobData = aiResponse.extractedJobData;
    const jobId = await createJobFromCallData(
      { id: call.id, phoneNumber: call.phoneNumber, customerId: call.customerId },
      conversation?.id,
      jobData,
      newMessages,
    );

    const category = jobData.tradeCategory?.toLowerCase().replace(/_/g, ' ') ?? 'tradie';
    const suburb = jobData.suburb ?? 'your location';
    const confirmMsg = jobId
      ? `${aiResponse.message} I've booked a ${category} for ${suburb} — you'll get an SMS confirmation shortly.`
      : `${aiResponse.message} Your request is logged and our team will call you back shortly.`;

    return new NextResponse(
      buildResponseTwiML(confirmMsg, webhookBase, true),
      { headers: { 'Content-Type': 'text/xml; charset=utf-8' } },
    );
  }

  return new NextResponse(
    buildResponseTwiML(aiResponse.message, webhookBase, false),
    { headers: { 'Content-Type': 'text/xml; charset=utf-8' } },
  );
}
