import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';
import { type RetellCall, verifyRetellSignature } from '@/lib/retell';

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
  url.searchParams.set('utm_medium', 'email');
  url.searchParams.set('utm_campaign', 'propertysafe_acquisition');
  url.searchParams.set('ps_ref', token);
  return url.toString();
}

async function sendResendEmail(input: { to: string; firstName?: string | null; signupUrl: string }) {
  if (process.env.PROPERTYSAFE_EMAIL_ENABLED !== 'true') {
    throw new Error('PropertySafe sales email is disabled until the Fixit247 sending domain is verified');
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.PROPERTYSAFE_EMAIL_FROM ?? process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new Error('Resend API key/from address is not configured');

  const firstLine = input.firstName ? `Hi ${input.firstName},` : 'Hi,';
  const text = `${firstLine}\n\nYou asked for the PropertySafe link from Fixit247.\n\nJoin PropertySafe: ${input.signupUrl}\n\nPropertySafe is free to get started and helps keep property maintenance requests and history organised. When you need a trade, you can also post a standard job through Fixit247 for free and request up to three obligation-free quotes.\n\nIf you no longer want sales follow-up from us, reply and ask us to stop.`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: 'Your PropertySafe link',
      text,
    }),
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    const message = typeof payload.message === 'string' ? payload.message : `Resend failed with HTTP ${response.status}`;
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
  if (!leadId) return NextResponse.json({ success: false, message: 'No sales lead is attached to this call.' }, { status: 400 });

  try {
    const rows = await db.$queryRaw<Array<{
      id: string;
      first_name: string | null;
      email: string | null;
      status: string;
      signup_tracking_token: string;
      signup_link_sent_at: Date | null;
    }>>`
      SELECT id, first_name, email, status, signup_tracking_token, signup_link_sent_at
      FROM sales_leads
      WHERE id = CAST(${leadId} AS UUID)
      LIMIT 1
    `;

    const lead = rows[0];
    if (!lead) return NextResponse.json({ success: false, message: 'Sales lead not found.' }, { status: 404 });
    if (lead.status === 'DO_NOT_CALL') return NextResponse.json({ success: false, message: 'This contact is on the do-not-call list.' }, { status: 409 });

    const explicitEmail = typeof body.args?.email === 'string' && body.args.email.trim() ? body.args.email.trim() : undefined;
    const email = explicitEmail ?? lead.email ?? undefined;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ success: false, message: 'A valid email address is required.' }, { status: 400 });
    }

    const signupUrl = buildSignupUrl(lead.signup_tracking_token);
    await sendResendEmail({ to: email, firstName: lead.first_name, signupUrl });

    await db.$executeRaw`
      UPDATE sales_leads
      SET email = COALESCE(email, ${email}),
          propertysafe_stage = CASE WHEN propertysafe_stage IN ('NEW', 'QUALIFIED') THEN 'LINK_SENT' ELSE propertysafe_stage END,
          signup_link_sent_at = COALESCE(signup_link_sent_at, NOW()),
          status = CASE WHEN status IN ('NEW', 'READY', 'DIALING', 'CONNECTED') THEN 'QUALIFIED' ELSE status END,
          updated_at = NOW()
      WHERE id = CAST(${leadId} AS UUID)
    `;

    if (!lead.signup_link_sent_at) {
      await db.$executeRaw`
        INSERT INTO propertysafe_activation_events (lead_id, event_type, metadata)
        VALUES (
          CAST(${leadId} AS UUID),
          'SIGNUP_LINK_SENT',
          jsonb_build_object('channel', 'email', 'retell_call_id', ${body.call?.call_id ?? null})
        )
      `;
    }

    return NextResponse.json({
      success: true,
      signup_url: signupUrl,
      message: 'PropertySafe signup link sent by email. Confirm briefly and continue only if the prospect wants help getting started.',
    });
  } catch (error) {
    logger.error('[retell-tool] Failed to send PropertySafe signup email', {
      leadId,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unable to send the PropertySafe email.' },
      { status: 500 },
    );
  }
}
