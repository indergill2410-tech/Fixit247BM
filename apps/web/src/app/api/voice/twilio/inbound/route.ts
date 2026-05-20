import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { buildGreetingTwiML } from '@fixit247/voice';
import crypto from 'crypto';

export const runtime = 'nodejs';

function getWebhookUrl(req: Request): string {
  // Render (and most reverse-proxy hosts) set X-Forwarded-Proto/Host.
  // Twilio signs against the public-facing HTTPS URL, not the internal one.
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '';
  if (host) return `${proto}://${host}/api/voice/twilio/inbound`;
  // fallback to the configured env var (must not have a trailing slash)
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/$/, '');
  return `${base}/api/voice/twilio/inbound`;
}

function validateTwilioSignature(req: Request, body: string): boolean {
  const twilioSignature = req.headers.get('x-twilio-signature');
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken || !twilioSignature) return process.env.NODE_ENV !== 'production';

  const url = getWebhookUrl(req);
  const params = Object.fromEntries(new URLSearchParams(body));
  const sortedKeys = Object.keys(params).sort();
  const data = url + sortedKeys.map((k) => k + params[k]).join('');
  const expected = crypto.createHmac('sha1', authToken).update(data).digest('base64');
  return expected === twilioSignature;
}

export async function POST(req: Request) {
  const body = await req.text();
  if (!validateTwilioSignature(req, body)) {
    console.error('[inbound] Twilio signature validation failed');
    return new NextResponse('Forbidden', { status: 403 });
  }

  const params = Object.fromEntries(new URLSearchParams(body));
  const callSid = params.CallSid;
  const from = params.From ?? 'unknown';

  const dbError = await db.voiceCall.create({
    data: {
      twilioCallSid: callSid,
      phoneNumber: from,
      direction: 'INBOUND',
      status: 'AI_HANDLING',
      answeredAt: new Date(),
    },
  }).then(() => null).catch((err: unknown) => err);

  if (dbError) {
    console.error('[inbound] voiceCall.create failed:', dbError);
  }

  // Derive webhookBase the same way signature validation does so gather actions
  // always point to the correct public URL.
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '';
  const webhookBase = host
    ? `${proto}://${host}`
    : (process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/$/, '');

  const twiml = buildGreetingTwiML(webhookBase);
  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'text/xml' },
  });
}
