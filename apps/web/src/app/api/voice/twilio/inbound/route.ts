import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { buildGreetingTwiML } from '@fixit247/voice';
import { logger } from '@/lib/logger';
import { checkEnvOnce } from '@/lib/api/env-check';
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
    // Allow in dev, reject in prod
    return process.env['NODE_ENV'] !== 'production';
  }

  const base = (process.env['NEXT_PUBLIC_APP_URL'] ?? '').replace(/\/$/, '');
  const url = `${base}${urlPath}`;
  const params = Object.fromEntries(new URLSearchParams(body));
  const sortedKeys = Object.keys(params).sort();
  const data = url + sortedKeys.map((k) => `${k}${params[k] ?? ''}`).join('');
  const expected = crypto.createHmac('sha1', authToken).update(data).digest('base64');
  const valid = expected === twilioSignature;
  if (!valid) logger.warn('Twilio signature mismatch', { url, twilioSignature });
  return valid;
}

export async function POST(req: Request) {
  checkEnvOnce();
  const body = await req.text();

  if (!validateTwilioSignature(req, body, '/api/voice/twilio/inbound')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const params = Object.fromEntries(new URLSearchParams(body));
  const callSid = params['CallSid'];
  const from = params['From'] ?? 'unknown';
  const to = params['To'] ?? 'unknown';

  logger.info('Inbound call', { callSid, from, to });

  if (!callSid) {
    logger.error('Inbound: missing CallSid');
    return new NextResponse('Bad Request', { status: 400 });
  }

  try {
    await db.voiceCall.create({
      data: {
        twilioCallSid: callSid,
        phoneNumber: from,
        direction: 'INBOUND',
        status: 'AI_HANDLING',
        answeredAt: new Date(),
      },
    });
    logger.info('VoiceCall created', { callSid });
  } catch (err) {
    // Log but don't drop the call — caller must still hear a response
    logger.error('Failed to persist VoiceCall', {
      callSid,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  const webhookBase = (process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://fixit247bm.onrender.com').replace(/\/$/, '');
  const twiml = buildGreetingTwiML(webhookBase);

  logger.info('Returning greeting TwiML', { callSid });

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
  });
}
