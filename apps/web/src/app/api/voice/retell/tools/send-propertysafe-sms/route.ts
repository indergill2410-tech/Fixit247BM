import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';
import { type RetellCall, verifyRetellSignature } from '@/lib/retell';
import { isContactSuppressed, normaliseAustralianPhoneNumber } from '@/lib/sales-compliance';

export const runtime = 'nodejs';

type RetellToolRequest = {
  call?: RetellCall;
  args?: Record<string, unknown>;
};

function getLeadId(body: RetellToolRequest): string | undefined {
  const explicit = body.args?.lead_id;
  if (typeof explicit === 'string' && explicit.trim()) return explicit.trim();
  const metadataId = body.call?.metadata?.sales_lead_id;
  return typeof metadataId === 'string' && metadataId.trim() ? metadataId.trim() : undefined;
}

function buildSignupUrl(token: string): string {
  const base = process.env.PROPERTYSAFE_SIGNUP_URL ?? 'https://www.fixit247.com.au/propertysafe';
  const url = new URL(base);
  url.searchParams.set('utm_source', 'ai_voice');
  url.searchParams.set('utm_medium', 'sms');
  url.searchParams.set('utm_campaign', 'propertysafe_acquisition');
  url.searchParams.set('ps_ref', token);
  return url.toString();
}

async function sendTwilioSms(to: string, body: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_SMS_FROM_NUMBER ?? process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !from) {
    throw new Error('Twilio SMS credentials/from number are not configured');
  }

  const params = new URLSearchParams({ To: to, From: from, Body: body });
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      cache: 'no-store',
    },
  );

  const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    const message = typeof payload.message === 'string' ? payload.message : `Twilio SMS failed with HTTP ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  if (!verifyRetellSignature(rawBody, req.headers.get('x-retell-signature'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: RetellToolRequest;
  try {
    body = JSON.parse(rawBody) as RetellToolRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const leadId = getLeadId(body);
  if (!leadId) {
    return NextResponse.json({ success: false, message: 'No sales lead is attached to this call.' }, { status: 400 });
  }

  try {
    const rows = await db.$queryRaw<Array<{
      id: string;
      phone_number: string;
      first_name: string | null;
      status: string;
      signup_tracking_token: string;
      signup_link_sent_at: Date | null;
    }>>`
      SELECT id, phone_number, first_name, status, signup_tracking_token, signup_link_sent_at
      FROM sales_leads
      WHERE id = CAST(${leadId} AS UUID)
      LIMIT 1
    `;

    const lead = rows[0];
    if (!lead) return NextResponse.json({ success: false, message: 'Sales lead not found.' }, { status: 404 });
    if (lead.status === 'DO_NOT_CALL') {
      return NextResponse.json({ success: false, message: 'This contact is on the do-not-call list.' }, { status: 409 });
    }

    const phoneNumber = normaliseAustralianPhoneNumber(lead.phone_number);
    if (!phoneNumber) {
      return NextResponse.json({ success: false, message: 'The lead does not have a valid Australian mobile number.' }, { status: 400 });
    }
    if (await isContactSuppressed(phoneNumber)) {
      return NextResponse.json({ success: false, message: 'This contact is suppressed from sales messaging.' }, { status: 409 });
    }

    const signupUrl = buildSignupUrl(lead.signup_tracking_token);
    const greeting = lead.first_name ? `Hi ${lead.first_name}, ` : '';
    const sms = `${greeting}here’s the PropertySafe link from Fixit247: ${signupUrl} PropertySafe is free to get started. You can also post a standard trade job free and request up to 3 obligation-free quotes. Reply STOP to opt out.`;

    const sent = await sendTwilioSms(phoneNumber, sms);

    if (!lead.signup_link_sent_at) {
      await db.$executeRaw`
        UPDATE sales_leads
        SET propertysafe_stage = CASE
              WHEN propertysafe_stage IN ('NEW', 'QUALIFIED') THEN 'LINK_SENT'
              ELSE propertysafe_stage
            END,
            signup_link_sent_at = NOW(),
            status = CASE
              WHEN status IN ('NEW', 'READY', 'DIALING', 'CONNECTED') THEN 'QUALIFIED'
              ELSE status
            END,
            updated_at = NOW()
        WHERE id = CAST(${leadId} AS UUID)
      `;

      await db.$executeRaw`
        INSERT INTO propertysafe_activation_events (lead_id, event_type, metadata)
        VALUES (
          CAST(${leadId} AS UUID),
          'SIGNUP_LINK_SENT',
          jsonb_build_object('channel', 'sms', 'retell_call_id', ${body.call?.call_id ?? null})
        )
      `;
    }

    logger.info('[retell-tool] PropertySafe signup SMS sent', {
      leadId,
      phoneNumber,
      retellCallId: body.call?.call_id,
      twilioMessageSid: typeof sent.sid === 'string' ? sent.sid : undefined,
    });

    return NextResponse.json({
      success: true,
      signup_url: signupUrl,
      message: 'PropertySafe signup link sent by SMS. Confirm briefly and continue only if the prospect wants help getting started.',
    });
  } catch (error) {
    logger.error('[retell-tool] Failed to send PropertySafe signup SMS', {
      leadId,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ success: false, message: 'Unable to send the PropertySafe SMS.' }, { status: 500 });
  }
}
