import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import {
  processConversationTurn,
  buildResponseTwiML,
  buildEmergencyTwiML,
  buildTransferTwiML,
  generateJobSummary,
  sendBookingConfirmationSms,
  sendTradieAlertSms,
  sendEmergencyAdminAlertSms,
  findOrCreateGuestCustomer,
} from '@fixit247/voice';
import type { ConversationContext, ConversationTurn } from '@fixit247/voice';
import { logger } from '@/lib/logger';
import crypto from 'crypto';

export const runtime = 'nodejs';

const APP_BASE = (process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://fixit247bm.onrender.com').replace(/\/$/, '');

function extractPathname(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url.split('?')[0] ?? '/api/voice/twilio/gather';
  }
}

function validateTwilioSignature(req: Request, body: string): boolean {
  const twilioSignature = req.headers.get('x-twilio-signature');
  const authToken = process.env['TWILIO_AUTH_TOKEN'];

  if (!authToken) {
    logger.warn('[gather] TWILIO_AUTH_TOKEN not set — skipping signature validation');
    return true;
  }
  if (!twilioSignature) {
    if (process.env['NODE_ENV'] === 'production') {
      logger.warn('[gather] No x-twilio-signature in production — rejecting');
      return false;
    }
    return true;
  }

  const pathname = extractPathname(req.url);
  const url = `${APP_BASE}${pathname}`;
  const params = Object.fromEntries(new URLSearchParams(body));
  const sortedKeys = Object.keys(params).sort();
  const data = url + sortedKeys.map((k) => `${k}${params[k] ?? ''}`).join('');
  const expected = crypto.createHmac('sha1', authToken).update(data).digest('base64');
  const valid = expected === twilioSignature;
  logger.info('[gather] Signature check', { url, valid });
  return valid;
}

async function notifyNearbyTradies(
  jobId: string,
  category: string,
  suburb: string | null | undefined,
  isEmergency: boolean,
  description: string,
): Promise<void> {
  try {
    // Find available tradies in this trade category (limit to 10 nearest for now)
    const tradies = await db.tradieProfile.findMany({
      where: {
        isAvailable: true,
        ...(isEmergency && { isEmergencyAvailable: true }),
        trades: { has: category as never },
        verificationStatus: 'VERIFIED',
      },
      include: { user: { select: { id: true, phone: true, firstName: true } } },
      take: 10,
    });

    logger.info('[gather] Notifying tradies of new job', {
      jobId,
      category,
      tradieCount: tradies.length,
    });

    await Promise.allSettled(
      tradies.map(async (tradie) => {
        // In-app notification
        await db.notification.create({
          data: {
            userId: tradie.userId,
            jobId,
            type: isEmergency ? 'JOB_CREATED' : 'JOB_CREATED',
            title: isEmergency ? `🚨 Emergency ${category.replace(/_/g, ' ')} Job` : `New ${category.replace(/_/g, ' ')} Job`,
            body: `${suburb ? `In ${suburb} — ` : ''}${description.slice(0, 120)}`,
            status: 'PENDING',
            channel: 'IN_APP',
            data: { jobId, category, suburb, isEmergency } as never,
          },
        });

        // SMS alert if tradie has phone
        if (tradie.user.phone) {
          await sendTradieAlertSms(tradie.user.phone, {
            category,
            suburb,
            isEmergency,
            description,
          }).catch(() => null);
        }
      }),
    );
  } catch (err) {
    logger.error('[gather] Failed to notify tradies', {
      jobId,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

async function createJobFromCallData(
  call: { id: string; phoneNumber: string; customerId: string | null },
  conversationId: string | undefined,
  jobData: {
    name?: string | null;
    issue?: string | null;
    tradeCategory?: string | null;
    suburb?: string | null;
    address?: string | null;
    isEmergency?: boolean;
    urgencyScore?: number;
  },
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
    const description = await generateJobSummary(context).catch(
      () => jobData.issue ?? 'Emergency service required',
    );

    const CATEGORY_MAP: Record<string, string> = {
      PLUMBING: 'PLUMBING',
      ELECTRICAL: 'ELECTRICAL',
      LOCKSMITH: 'LOCKSMITH',
      HVAC: 'HVAC',
      ROOFING: 'ROOFING',
      GLAZING: 'GLAZING',
      PEST_CONTROL: 'PEST_CONTROL',
      CARPENTRY: 'CARPENTRY',
      PLASTERING: 'PLASTERING',
      GENERAL_MAINTENANCE: 'GENERAL_MAINTENANCE',
    };
    const category = CATEGORY_MAP[jobData.tradeCategory ?? ''] ?? 'GENERAL_MAINTENANCE';

    // Resolve customer — use existing profile, or create guest account
    let customerProfileId: string | null = null;
    let resolvedUserId: string | null = call.customerId;

    if (resolvedUserId) {
      const profile = await db.customerProfile.findUnique({ where: { userId: resolvedUserId } });
      customerProfileId = profile?.id ?? null;
    }

    if (!customerProfileId) {
      const user = await db.user.findFirst({ where: { phone: call.phoneNumber } });
      if (user) {
        resolvedUserId = user.id;
        const profile = await db.customerProfile.findUnique({ where: { userId: user.id } });
        customerProfileId = profile?.id ?? null;
      }
    }

    // Still no profile — create a guest account so no call ever goes unbooked
    if (!customerProfileId) {
      logger.info('[gather] No existing customer — creating guest account', {
        callId: call.id,
        phone: call.phoneNumber,
      });
      const guest = await findOrCreateGuestCustomer(call.phoneNumber, jobData.name);
      if (guest) {
        customerProfileId = guest.customerProfileId;
        resolvedUserId = guest.userId;
      }
    }

    if (!customerProfileId) {
      logger.error('[gather] Could not resolve or create customer profile', { callId: call.id });
      return null;
    }

    // Create address if suburb provided
    let addressId: string | undefined;
    if (jobData.suburb && resolvedUserId) {
      const address = await db.address.create({
        data: {
          userId: resolvedUserId,
          street: jobData.address ?? 'To be confirmed',
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

    await db.voiceCall.update({
      where: { id: call.id },
      data: { jobId: job.id, status: 'COMPLETED' },
    });

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

      // Alert admin for critical emergencies
      if (urgency >= 85) {
        const adminPhone = process.env['TWILIO_FALLBACK_NUMBER'];
        if (adminPhone) {
          sendEmergencyAdminAlertSms(adminPhone, {
            callerPhone: call.phoneNumber,
            riskLevel: urgency >= 90 ? 'LIFE-THREATENING' : 'CRITICAL',
            score: urgency,
            description,
          }).catch(() => null);
        }
      }
    }

    await db.voiceEvent.create({
      data: {
        callId: call.id,
        eventType: 'JOB_CREATED',
        payload: { jobId: job.id } as never,
      },
    });

    // SMS confirmation to customer (fire-and-forget)
    sendBookingConfirmationSms(call.phoneNumber, {
      name: jobData.name,
      category,
      suburb: jobData.suburb,
      isEmergency: jobData.isEmergency ?? false,
      jobRef: job.id.slice(0, 8).toUpperCase(),
    }).catch(() => null);

    // Notify nearby available tradies (fire-and-forget)
    notifyNearbyTradies(job.id, category, jobData.suburb, jobData.isEmergency ?? false, description).catch(
      () => null,
    );

    logger.info('[gather] Voice job created successfully', {
      jobId: job.id,
      callId: call.id,
      category,
      isEmergency: jobData.isEmergency,
    });
    return job.id;
  } catch (err) {
    logger.error('[gather] Failed to create voice job', {
      callId: call.id,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

function gatherErrorTwiml(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${APP_BASE}/api/voice/twilio/gather" method="POST"
    speechTimeout="auto" language="en-AU">
    <Say voice="Polly.Nicole" language="en-AU">${message}</Say>
  </Gather>
  <Say voice="Polly.Nicole" language="en-AU">Sorry, I didn't catch that. Please call back if the issue persists.</Say>
  <Hangup/>
</Response>`;
}

export async function POST(req: Request) {
  let body = '';
  try {
    body = await req.text();
  } catch (err) {
    logger.error('[gather] Failed to read request body', { error: String(err) });
    return new NextResponse(gatherErrorTwiml('Sorry, something went wrong. Please try again.'), {
      headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    });
  }

  logger.info('[gather] POST received', { url: req.url, bodyLength: body.length });

  if (!validateTwilioSignature(req, body)) {
    logger.error('[gather] Signature invalid — returning TwiML rejection');
    return new NextResponse(gatherErrorTwiml("Sorry, we couldn't verify this call. Please try again."), {
      headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    });
  }

  const params = Object.fromEntries(new URLSearchParams(body));
  const callSid = params['CallSid'];
  const speechResult = (params['SpeechResult'] ?? '').trim();
  const webhookBase = APP_BASE;

  logger.info('[gather] Speech received', {
    callSid,
    speechLength: speechResult.length,
    speech: speechResult.slice(0, 80),
  });

  if (!callSid) {
    logger.error('[gather] Missing CallSid');
    return new NextResponse(
      buildResponseTwiML('Sorry, there was a technical issue. Please call back.', webhookBase, false),
      { headers: { 'Content-Type': 'text/xml; charset=utf-8' } },
    );
  }

  if (!speechResult) {
    logger.info('[gather] No speech detected, prompting again', { callSid });
    return new NextResponse(
      buildResponseTwiML(
        "Sorry, I didn't catch that — go ahead and describe what's happening.",
        webhookBase,
        false,
      ),
      { headers: { 'Content-Type': 'text/xml; charset=utf-8' } },
    );
  }

  // Load call record
  let call;
  try {
    call = await db.voiceCall.findUnique({ where: { twilioCallSid: callSid } });
  } catch (err) {
    logger.error('[gather] DB lookup failed', {
      callSid,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  if (!call) {
    logger.warn('[gather] Call record not found — creating recovery record', { callSid });
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
      logger.error('[gather] Recovery record creation failed — continuing without DB', {
        callSid,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Load conversation history
  let conversation = null;
  const existingMessages: ConversationTurn[] = [];

  if (call) {
    try {
      conversation = await db.aIConversation.findUnique({ where: { callId: call.id } });
      if (conversation) {
        existingMessages.push(...(conversation.messages as ConversationTurn[]));
      }
    } catch (err) {
      logger.error('[gather] Failed to load conversation', {
        callSid,
        error: err instanceof Error ? err.message : String(err),
      });
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

  // Run AI turn
  let aiResponse;
  try {
    aiResponse = await processConversationTurn(speechResult, context);
    logger.info('[gather] AI response generated', {
      callSid,
      turn: context.turnCount + 1,
      isJobReady: aiResponse.isJobReady,
      emergencyScore: aiResponse.emergencyScore,
    });
  } catch (err) {
    logger.error('[gather] OpenAI call failed', {
      callSid,
      error: err instanceof Error ? err.message : String(err),
    });
    return new NextResponse(
      buildResponseTwiML(
        "Sorry, I'm having a brief technical issue. Let me transfer you to our team.",
        webhookBase,
        false,
      ),
      { headers: { 'Content-Type': 'text/xml; charset=utf-8' } },
    );
  }

  // Build updated message history
  const newMessages: ConversationTurn[] = [
    ...existingMessages,
    { role: 'user', content: speechResult, timestamp: new Date().toISOString() },
    { role: 'assistant', content: aiResponse.message, timestamp: new Date().toISOString() },
  ];

  // Persist conversation
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
      logger.error('[gather] Failed to persist conversation', {
        callSid,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // Human takeover
  if (aiResponse.requiresHumanTakeover) {
    logger.info('[gather] Human takeover triggered', { callSid });
    if (call) {
      await db.voiceCall
        .update({ where: { id: call.id }, data: { status: 'HUMAN_TAKEOVER' } })
        .catch(() => null);
      await db.voiceEvent
        .create({
          data: { callId: call.id, eventType: 'HUMAN_TAKEOVER_REQUESTED', payload: {} as never },
        })
        .catch(() => null);
    }
    const agentNumber = process.env['TWILIO_FALLBACK_NUMBER'] ?? '';
    if (agentNumber) {
      return new NextResponse(buildTransferTwiML(agentNumber), {
        headers: { 'Content-Type': 'text/xml; charset=utf-8' },
      });
    }
    // No agent number configured — fall through to emergency TwiML
    return new NextResponse(
      buildResponseTwiML(
        "I'm getting our team to call you back right away. We'll have someone contact you within 5 minutes. Stay safe.",
        webhookBase,
        true,
      ),
      { headers: { 'Content-Type': 'text/xml; charset=utf-8' } },
    );
  }

  // Life-threatening emergency → bypass job flow, play safety instructions immediately
  if (aiResponse.emergencyScore >= 90) {
    logger.info('[gather] Life-threatening emergency detected', {
      callSid,
      score: aiResponse.emergencyScore,
    });
    return new NextResponse(buildEmergencyTwiML(webhookBase), {
      headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    });
  }

  // Job ready — create job, send SMS, notify tradies
  if (aiResponse.isJobReady && aiResponse.extractedJobData && call) {
    const jobData = aiResponse.extractedJobData;
    const jobId = await createJobFromCallData(
      { id: call.id, phoneNumber: call.phoneNumber, customerId: call.customerId },
      conversation?.id,
      jobData,
      newMessages,
    );

    const category = jobData.tradeCategory?.toLowerCase().replace(/_/g, ' ') ?? 'tradie';
    const suburb = jobData.suburb ?? 'your area';
    const name = jobData.name ? ` ${jobData.name.split(' ')[0]}` : '';

    const urgencySuffix = jobData.isEmergency
      ? "We're treating this as urgent — they'll be with you as fast as possible."
      : "No worries — you're all sorted.";
    const confirmMsg = jobId
      ? `Perfect${name}! I've booked a ${category} for ${suburb}. You'll get a text confirmation shortly and the tradie will call you soon. ${urgencySuffix}`
      : `${aiResponse.message} Your request is logged and our team will call you back shortly. Sorry for any inconvenience.`;

    return new NextResponse(buildResponseTwiML(confirmMsg, webhookBase, true), {
      headers: { 'Content-Type': 'text/xml; charset=utf-8' },
    });
  }

  // Continue conversation
  return new NextResponse(buildResponseTwiML(aiResponse.message, webhookBase, false), {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
  });
}
