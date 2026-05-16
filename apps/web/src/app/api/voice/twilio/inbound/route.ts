import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { buildGreetingTwiML } from '@fixit247/voice';
import crypto from 'crypto';

export const runtime = 'nodejs';

function validateTwilioSignature(req: Request, body: string): boolean {
  const twilioSignature = req.headers.get('x-twilio-signature');
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken || !twilioSignature) return process.env.NODE_ENV !== 'production';

  const url = process.env.NEXT_PUBLIC_APP_URL + '/api/voice/twilio/inbound';
  const params = Object.fromEntries(new URLSearchParams(body));
  const sortedKeys = Object.keys(params).sort();
  const data = url + sortedKeys.map((k) => k + params[k]).join('');
  const expected = crypto.createHmac('sha1', authToken).update(data).digest('base64');
  return expected === twilioSignature;
}

export async function POST(req: Request) {
  const body = await req.text();
  if (!validateTwilioSignature(req, body)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const params = Object.fromEntries(new URLSearchParams(body));
  const callSid = params.CallSid;
  const from = params.From ?? 'unknown';

  // Create VoiceCall record
  await db.voiceCall.create({
    data: {
      twilioCallSid: callSid,
      phoneNumber: from,
      direction: 'INBOUND',
      status: 'IN_PROGRESS',
      answeredAt: new Date(),
    },
  }).catch(() => null);

  const webhookBase = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fixit247.com.au';
  const twiml = buildGreetingTwiML(webhookBase);

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'text/xml' },
  });
}
