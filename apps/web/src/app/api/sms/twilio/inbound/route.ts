import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';
import crypto from 'crypto';

export const runtime = 'nodejs';

const APP_BASE = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://fixit247.com.au').replace(/\/$/, '');

// ── Twilio signature validation ────────────────────────────────────────────
function validateTwilioSignature(req: Request, body: string): boolean {
  const twilioSignature = req.headers.get('x-twilio-signature');
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!authToken) {
    logger.error('[sms-inbound] TWILIO_AUTH_TOKEN not set — rejecting inbound webhook');
    return false;
  }

  if (!twilioSignature) {
    logger.warn('[sms-inbound] No x-twilio-signature header — rejecting');
    return false;
  }

  let webhookPath: string;
  try {
    const url = new URL(req.url);
    webhookPath = `${url.pathname}${url.search}`;
  } catch {
    webhookPath = req.url || '/api/sms/twilio/inbound';
  }

  const url = `${APP_BASE}${webhookPath}`;
  const params = Object.fromEntries(new URLSearchParams(body));
  const sortedKeys = Object.keys(params).sort();
  const data = url + sortedKeys.map((k) => `${k}${params[k] ?? ''}`).join('');
  const expected = crypto.createHmac('sha1', authToken).update(data).digest('base64');
  const valid = expected === twilioSignature;

  logger.info('[sms-inbound] Signature check', { url, valid });
  return valid;
}

// ── TwiML helpers ──────────────────────────────────────────────────────────
function replyTwiML(message: string): NextResponse {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${message}</Message>
</Response>`;
  return new NextResponse(xml, { headers: { 'Content-Type': 'text/xml; charset=utf-8' } });
}

function emptyTwiML(): NextResponse {
  return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response/>`, {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
  });
}

// ── GET: liveness probe ───────────────────────────────────────────────────
export function GET() {
  return NextResponse.json({
    status: 'ok',
    route: 'sms-twilio-inbound',
    webhookBase: APP_BASE,
    env: {
      TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? 'set' : 'MISSING',
      TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? 'set' : 'MISSING',
      TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER ?? 'MISSING',
    },
  });
}

// ── POST: Twilio sends inbound SMS here ───────────────────────────────────
export async function POST(req: Request) {
  let body = '';
  try {
    body = await req.text();
  } catch (err) {
    logger.error('[sms-inbound] Failed to read request body', { error: String(err) });
    return emptyTwiML();
  }

  logger.info('[sms-inbound] POST received', { url: req.url, bodyLength: body.length });

  if (!validateTwilioSignature(req, body)) {
    logger.error('[sms-inbound] Invalid Twilio signature — rejecting');
    return new NextResponse('Forbidden', { status: 403 });
  }

  const params = new URLSearchParams(body);
  const from = params.get('From') ?? 'unknown';
  const to = params.get('To') ?? process.env.TWILIO_PHONE_NUMBER ?? 'unknown';
  const messageBody = params.get('Body') ?? '';
  const messageSid = params.get('MessageSid') ?? 'unknown';

  logger.info('[sms-inbound] SMS received', { messageSid, from, to, body: messageBody });

  // Persist as a Notification so it appears in the admin dashboard
  try {
    // Try to find a user with this phone number to link the notification
    const user = await db.user.findFirst({
      where: { phone: from },
      select: { id: true },
    });

    if (user) {
      await db.notification.create({
        data: {
          userId: user.id,
          type: 'SYSTEM_ALERT',
          title: `SMS from ${from}`,
          body: messageBody,
          data: { messageSid, from, to },
          channel: 'SMS',
          status: 'PENDING',
        },
      });
      logger.info('[sms-inbound] User notification persisted', { messageSid, userId: user.id });
    } else {
      await db.platformAlert.create({
        data: {
          type: 'SYSTEM_ERROR',
          severity: 'INFO',
          title: `Inbound SMS from ${from}`,
          message: messageBody || 'Inbound SMS received without message body.',
          data: { messageSid, from, to },
        },
      });
      logger.info('[sms-inbound] Platform alert persisted', { messageSid });
    }
  } catch (err) {
    // Non-fatal — always reply to Twilio
    logger.error('[sms-inbound] DB write failed', {
      messageSid,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  // Auto-reply so the sender gets immediate confirmation
  const autoReply =
    `Thanks for contacting Fixit 24/7! ` +
    `We've received your message and will get back to you shortly. ` +
    `For urgent jobs call us or book at fixit247.com.au`;

  return replyTwiML(autoReply);
}
