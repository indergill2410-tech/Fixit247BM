import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { buildGreetingTwiML } from '@fixit247/voice';
import { logger } from '@/lib/logger';
import crypto from 'crypto';

export const runtime = 'nodejs';

function getWebhookBase(req: Request): string {
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '';
  if (host) return `${proto}://${host}`;
  return (process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/$/, '');
}

function validateTwilioSignature(req: Request, body: string): boolean {
  const twilioSignature = req.headers.get('x-twilio-signature');
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!authToken || !twilioSignature) {
    // In dev/staging allow through; in production reject
    return process.env.NODE_ENV !== 'production';
  }

  // Build the exact URL Twilio signed — uses forwarded host so it works behind Render's proxy
  const webhookBase = getWebhookBase(req);
  const url = `${webhookBase}/api/voice/twilio/inbound`;

  const params = Object.fromEntries(new URLSearchParams(body));
  const sortedKeys = Object.keys(params).sort();
  const data = url + sortedKeys.map((k) => k + params[k]).join('');
  const expected = crypto.createHmac('sha1', authToken).update(data).digest('base64');

  const valid = expected === twilioSignature;
  if (!valid) {
    logger.warn('inbound', 'Signature mismatch', { url, expected: expected.slice(0, 8) + '…' });
  }
  return valid;
}

export async function POST(req: Request) {
  const body = await req.text();

  if (!validateTwilioSignature(req, body)) {
    logger.error('inbound', 'Twilio signature validation failed — rejecting request');
    return new NextResponse('Forbidden', { status: 403 });
  }

  const params = Object.fromEntries(new URLSearchParams(body));
  const callSid = params.CallSid;
  const from = params.From ?? 'unknown';
  const to = params.To ?? 'unknown';

  logger.info('inbound', 'Inbound call received', { callSid, from, to });

  const dbResult = await db.voiceCall.create({
    data: {
      twilioCallSid: callSid,
      phoneNumber: from,
      direction: 'INBOUND',
      status: 'AI_HANDLING',
      answeredAt: new Date(),
    },
  }).then((r) => ({ ok: true as const, id: r.id }))
    .catch((err: unknown) => ({ ok: false as const, err: String(err) }));

  if (!dbResult.ok) {
    logger.error('inbound', 'voiceCall.create failed', { callSid, err: dbResult.err });
  } else {
    logger.info('inbound', 'VoiceCall created', { callSid, recordId: dbResult.id });
  }

  const webhookBase = getWebhookBase(req);
  logger.debug('inbound', 'Responding with greeting TwiML', { webhookBase });

  return new NextResponse(buildGreetingTwiML(webhookBase), {
    headers: { 'Content-Type': 'text/xml' },
  });
}
