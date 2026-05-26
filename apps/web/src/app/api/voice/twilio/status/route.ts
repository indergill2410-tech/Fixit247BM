import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';
import crypto from 'crypto';

export const runtime = 'nodejs';

const APP_BASE = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://fixit247bm.onrender.com').replace(/\/$/, '');

function extractPathname(url: string): string {
  try { return new URL(url).pathname; } catch { return url.split('?')[0] ?? '/api/voice/twilio/status'; }
}

function validateTwilioSignature(req: Request, body: string): boolean {
  const twilioSignature = req.headers.get('x-twilio-signature');
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) { logger.warn('[status] TWILIO_AUTH_TOKEN not set — skipping'); return true; }
  if (!twilioSignature) {
    if (process.env.NODE_ENV === 'production') { logger.warn('[status] No x-twilio-signature in prod — rejecting'); return false; }
    return true;
  }
  const url = `${APP_BASE}${extractPathname(req.url)}`;
  const params = Object.fromEntries(new URLSearchParams(body));
  const data = url + Object.keys(params).sort().map((k) => `${k}${params[k] ?? ''}`).join('');
  const expected = crypto.createHmac('sha1', authToken).update(data).digest('base64');
  const valid = expected === twilioSignature;
  logger.info('[status] Signature check', { url, valid });
  return valid;
}

// Twilio calls this URL to report the final status of a call.
// Set as "Status Callback URL" in Twilio phone number config.
export async function POST(req: Request) {
  const body = await req.text();

  if (!validateTwilioSignature(req, body)) {
    logger.error('[status] Signature invalid — ignoring');
    return new NextResponse('OK', { status: 200 }); // Always 200 to Twilio to prevent retries
  }

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
