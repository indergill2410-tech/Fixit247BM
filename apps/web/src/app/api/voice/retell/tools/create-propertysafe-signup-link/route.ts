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
  url.searchParams.set('utm_medium', 'retell');
  url.searchParams.set('utm_campaign', 'propertysafe_acquisition');
  url.searchParams.set('ps_ref', token);
  return url.toString();
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
    return NextResponse.json(
      { success: false, message: 'No sales lead is attached to this call.' },
      { status: 400 },
    );
  }

  try {
    const rows = await db.$queryRaw<Array<{
      id: string;
      status: string;
      propertysafe_stage: string;
      signup_tracking_token: string;
      signup_link_sent_at: Date | null;
    }>>`
      SELECT id, status, propertysafe_stage, signup_tracking_token, signup_link_sent_at
      FROM sales_leads
      WHERE id = CAST(${leadId} AS UUID)
      LIMIT 1
    `;

    const lead = rows[0];
    if (!lead) {
      return NextResponse.json({ success: false, message: 'Sales lead not found.' }, { status: 404 });
    }
    if (lead.status === 'DO_NOT_CALL') {
      return NextResponse.json(
        { success: false, message: 'This contact is on the do-not-call list. Do not send or pitch.' },
        { status: 409 },
      );
    }

    const signupUrl = buildSignupUrl(lead.signup_tracking_token);

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
          jsonb_build_object('channel', 'voice', 'retell_call_id', ${body.call?.call_id ?? null})
        )
      `;
    }

    logger.info('[retell-tool] PropertySafe signup link created', {
      leadId,
      retellCallId: body.call?.call_id,
    });

    return NextResponse.json({
      success: true,
      signup_url: signupUrl,
      message: 'The tracked PropertySafe signup link is ready. Ask whether the prospect wants it by SMS or email.',
    });
  } catch (error) {
    logger.error('[retell-tool] Failed to create PropertySafe signup link', {
      leadId,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { success: false, message: 'Unable to create the PropertySafe signup link.' },
      { status: 500 },
    );
  }
}
