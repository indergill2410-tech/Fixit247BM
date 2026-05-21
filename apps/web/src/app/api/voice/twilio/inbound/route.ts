import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { buildGreetingTwiML } from '@fixit247/voice';
import { logger } from '@/lib/logger';
import { checkEnvOnce } from '@/lib/api/env-check';
import crypto from 'crypto';

export const runtime = 'nodejs';

const APP_BASE = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://fixit247bm.onrender.com').replace(/\/$/, '');

// Simple in-memory rate limiter: max 5 calls per phone per 10 minutes
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_CALLS = 5;

function isRateLimited(phoneNumber: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(phoneNumber);
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    rateLimitMap.set(phoneNumber, { count: 1, windowStart: now });
    // Prune old entries to avoid unbounded growth
    if (rateLimitMap.size > 10_000) {
      for (const [k, v] of rateLimitMap) {
        if (now - v.windowStart > RATE_WINDOW_MS) rateLimitMap.delete(k);
      }
    }
    return false;
  }
  entry.count += 1;
  if (entry.count > RATE_MAX_CALLS) {
    logger.warn('[inbound] Rate limit exceeded', { phoneNumber, count: entry.count });
    return true;
  }
  return false;
}

function errorTwiml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Nicole" language="en-AU">Sorry, we experienced a technical issue. Please call back in a moment. Fixit 24/7 apologises for the inconvenience.</Say>
  <Hangup/>
</Response>`;
}

function extractPathname(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    // req.url is relative (e.g. "/api/voice/twilio/inbound") — split off query string
    return url.split('?')[0] ?? '/api/voice/twilio/inbound';
  }
}

function validateTwilioSignature(req: Request, body: string): boolean {
  const twilioSignature = req.headers.get('x-twilio-signature');
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!authToken) {
    logger.warn('[inbound] TWILIO_AUTH_TOKEN not set — skipping signature validation');
    return true;
  }

  if (!twilioSignature) {
    if (process.env.NODE_ENV === 'production') {
      logger.warn('[inbound] No x-twilio-signature — likely not a Twilio request');
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

  logger.info('[inbound] Signature check', { url, valid });
  return valid;
}

// GET: quick liveness check — curl https://fixit247bm.onrender.com/api/voice/twilio/inbound
export function GET() {
  checkEnvOnce();
  return NextResponse.json({
    status: 'ok',
    route: 'twilio-inbound',
    webhookBase: APP_BASE,
    env: {
      TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? 'set' : 'MISSING',
      TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? 'set' : 'MISSING',
      TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER ?? 'MISSING',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'set' : 'MISSING',
      DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'MISSING',
    },
  });
}

export async function POST(req: Request) {
  checkEnvOnce();

  let body = '';
  try {
    body = await req.text();
  } catch (err) {
    logger.error('[inbound] Failed to read request body', { error: String(err) });
    return new NextResponse(errorTwiml(), { headers: { 'Content-Type': 'text/xml; charset=utf-8' } });
  }

  logger.info('[inbound] POST received', { url: req.url, bodyLength: body.length });

  if (!validateTwilioSignature(req, body)) {
    logger.error('[inbound] Signature invalid — returning TwiML rejection so caller hears voice');
    return new NextResponse(errorTwiml(), { headers: { 'Content-Type': 'text/xml; charset=utf-8' } });
  }

  const params = Object.fromEntries(new URLSearchParams(body));
  const callSid = params.CallSid;
  const from = params.From ?? 'unknown';
  const to = params.To ?? 'unknown';

  logger.info('[inbound] Call received', { callSid, from, to });

  if (!callSid) {
    logger.error('[inbound] Missing CallSid — returning error TwiML');
    return new NextResponse(errorTwiml(), { headers: { 'Content-Type': 'text/xml; charset=utf-8' } });
  }

  // Rate limit: politely reject spam callers
  if (from !== 'unknown' && isRateLimited(from)) {
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Nicole" language="en-AU">You've reached the call limit for this period. Please try again in 10 minutes or visit fixit247.com.au to book online.</Say>
  <Hangup/>
</Response>`,
      { headers: { 'Content-Type': 'text/xml; charset=utf-8' } },
    );
  }

  // Persist call record — errors are non-fatal, caller must hear a response regardless
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
    logger.info('[inbound] VoiceCall persisted', { callSid });
  } catch (err) {
    logger.error('[inbound] DB write failed — continuing without persistence', {
      callSid,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  try {
    const twiml = buildGreetingTwiML(APP_BASE);
    logger.info('[inbound] Returning greeting TwiML', { callSid, twimlLength: twiml.length });
    return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml; charset=utf-8' } });
  } catch (err) {
    logger.error('[inbound] buildGreetingTwiML failed', { callSid, error: String(err) });
    return new NextResponse(errorTwiml(), { headers: { 'Content-Type': 'text/xml; charset=utf-8' } });
  }
}
