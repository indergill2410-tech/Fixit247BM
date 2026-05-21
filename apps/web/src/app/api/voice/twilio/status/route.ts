import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

// Twilio calls this URL to report the final status of a call.
// Set as "Status Callback URL" in Twilio phone number config.
export async function POST(req: Request) {
  const body = await req.text();
  const params = Object.fromEntries(new URLSearchParams(body));

  const callSid = params.CallSid;
  const callStatus = params.CallStatus; // completed, busy, no-answer, failed, canceled
  const callDuration = params.CallDuration; // seconds as string

  logger.info('Twilio status callback', { callSid, callStatus, callDuration });

  if (!callSid) {
    return new NextResponse('OK', { status: 200 });
  }

  // Prisma CallStatus enum has no MISSED — map unanswered calls to ABANDONED
  const statusMap: Record<string, string> = {
    completed: 'COMPLETED',
    busy: 'ABANDONED',
    'no-answer': 'ABANDONED',
    failed: 'FAILED',
    canceled: 'ABANDONED',
  };
  const dbStatus = statusMap[callStatus ?? ''];

  try {
    const call = await db.voiceCall.findUnique({ where: { twilioCallSid: callSid } });
    if (call) {
      await db.voiceCall.update({
        where: { id: call.id },
        data: {
          endedAt: new Date(),
          ...(dbStatus && { status: dbStatus as never }),
          ...(callDuration && { duration: parseInt(callDuration, 10) }),
        },
      });

      await db.voiceEvent.create({
        data: {
          callId: call.id,
          eventType: 'CALL_ENDED',
          payload: { callStatus, callDuration } as never,
        },
      });

      logger.info('VoiceCall status updated', { callSid, dbStatus, duration: callDuration });
    }
  } catch (err) {
    logger.error('Failed to update call status', {
      callSid,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  // Always return 200 to Twilio — non-200 causes retries
  return new NextResponse('OK', { status: 200 });
}
