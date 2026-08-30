import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';
import {
  normaliseRetellTranscript,
  type RetellCall,
  type RetellWebhookPayload,
  verifyRetellSignature,
} from '@/lib/retell';

export const runtime = 'nodejs';

function callDurationSeconds(call: RetellCall): number | undefined {
  if (typeof call.duration_ms === 'number' && Number.isFinite(call.duration_ms)) {
    return Math.max(0, Math.round(call.duration_ms / 1000));
  }

  if (
    typeof call.start_timestamp === 'number' &&
    typeof call.end_timestamp === 'number' &&
    call.end_timestamp >= call.start_timestamp
  ) {
    return Math.round((call.end_timestamp - call.start_timestamp) / 1000);
  }

  return undefined;
}

function callStatus(event: string, call: RetellCall) {
  if (event === 'call_started') return 'AI_HANDLING' as const;

  const failureReasons = new Set([
    'dial_busy',
    'dial_failed',
    'dial_no_answer',
    'invalid_destination',
    'telephony_provider_permission_denied',
    'telephony_provider_unavailable',
    'sip_routing_error',
    'concurrency_limit_reached',
    'no_valid_payment',
    'error_retell',
    'error_unknown',
  ]);

  if (call.disconnection_reason && failureReasons.has(call.disconnection_reason)) {
    return 'FAILED' as const;
  }

  return 'COMPLETED' as const;
}

function asOptionalString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

async function persistSalesLink(input: {
  voiceCallId: string;
  call: RetellCall;
  event: string;
}) {
  const metadata = input.call.metadata ?? {};
  const leadId = asOptionalString(metadata.sales_lead_id);
  const campaignId = asOptionalString(metadata.sales_campaign_id);
  const analysis = input.call.call_analysis;
  const outcome = asOptionalString(analysis?.custom_analysis_data?.outcome);
  const sentiment = asOptionalString(analysis?.user_sentiment);
  const summary = asOptionalString(analysis?.call_summary);
  const retellCallId = asOptionalString(input.call.call_id);
  const disconnect = asOptionalString(input.call.disconnection_reason);
  const transferDestination = asOptionalString(input.call.transfer_destination);
  const successful = typeof analysis?.call_successful === 'boolean' ? analysis.call_successful : null;

  try {
    await db.$executeRaw`
      INSERT INTO sales_call_links (
        voice_call_id,
        retell_call_id,
        lead_id,
        campaign_id,
        outcome,
        sentiment,
        successful,
        summary,
        disconnection_reason,
        transfer_destination,
        analysis_metadata,
        created_at,
        updated_at
      )
      VALUES (
        CAST(${input.voiceCallId} AS UUID),
        ${retellCallId},
        CASE WHEN ${leadId} IS NULL THEN NULL ELSE CAST(${leadId} AS UUID) END,
        CASE WHEN ${campaignId} IS NULL THEN NULL ELSE CAST(${campaignId} AS UUID) END,
        ${outcome},
        ${sentiment},
        ${successful},
        ${summary},
        ${disconnect},
        ${transferDestination},
        ${JSON.stringify({ event: input.event, analysis: analysis ?? null })}::jsonb,
        NOW(),
        NOW()
      )
      ON CONFLICT (voice_call_id)
      DO UPDATE SET
        retell_call_id = COALESCE(EXCLUDED.retell_call_id, sales_call_links.retell_call_id),
        lead_id = COALESCE(EXCLUDED.lead_id, sales_call_links.lead_id),
        campaign_id = COALESCE(EXCLUDED.campaign_id, sales_call_links.campaign_id),
        outcome = COALESCE(EXCLUDED.outcome, sales_call_links.outcome),
        sentiment = COALESCE(EXCLUDED.sentiment, sales_call_links.sentiment),
        successful = COALESCE(EXCLUDED.successful, sales_call_links.successful),
        summary = COALESCE(EXCLUDED.summary, sales_call_links.summary),
        disconnection_reason = COALESCE(EXCLUDED.disconnection_reason, sales_call_links.disconnection_reason),
        transfer_destination = COALESCE(EXCLUDED.transfer_destination, sales_call_links.transfer_destination),
        analysis_metadata = EXCLUDED.analysis_metadata,
        updated_at = NOW()
    `;

    if (leadId) {
      const status =
        input.event === 'call_started'
          ? 'CONNECTED'
          : analysis?.call_successful
            ? outcome === 'booked_meeting' || outcome === 'callback_booked'
              ? 'BOOKED'
              : 'QUALIFIED'
            : 'NURTURE';

      await db.$executeRaw`
        UPDATE sales_leads
        SET
          status = ${status},
          last_contact_at = NOW(),
          updated_at = NOW()
        WHERE id = CAST(${leadId} AS UUID)
          AND status <> 'DO_NOT_CALL'
      `;
    }
  } catch (error) {
    // Voice-call persistence remains useful even if the sales migration has not yet been applied.
    logger.error('[retell-webhook] Failed to persist sales attribution', {
      retellCallId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export function GET() {
  return NextResponse.json({
    status: 'ok',
    route: 'retell-webhook',
    retellApiKey: process.env.RETELL_API_KEY ? 'set' : 'MISSING',
  });
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-retell-signature');

  if (!verifyRetellSignature(rawBody, signature)) {
    logger.warn('[retell-webhook] Invalid signature');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: RetellWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as RetellWebhookPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { event, call } = payload;
  const twilioCallSid = call.telephony_identifier?.twilio_call_sid;

  if (!event || !call || !twilioCallSid) {
    logger.warn('[retell-webhook] Missing event/call/Twilio identifier', {
      event,
      retellCallId: call?.call_id,
    });
    return new NextResponse(null, { status: 204 });
  }

  const phoneNumber =
    call.direction === 'inbound'
      ? call.from_number ?? 'unknown'
      : call.to_number ?? 'unknown';
  const transcript = normaliseRetellTranscript(call);
  const recordingUrl = call.scrubbed_recording_url ?? call.recording_url;
  const duration = callDurationSeconds(call);
  const status = callStatus(event, call);
  const now = new Date();

  try {
    const voiceCall = await db.voiceCall.upsert({
      where: { twilioCallSid },
      create: {
        twilioCallSid,
        phoneNumber,
        direction: call.direction === 'inbound' ? 'INBOUND' : 'OUTBOUND',
        status,
        answeredAt: event === 'call_started' ? now : undefined,
        endedAt: event === 'call_ended' || event === 'call_analyzed' ? now : undefined,
        duration,
        transcript,
        recordingUrl,
        metadata: {
          provider: 'retell',
          retellCallId: call.call_id ?? null,
          retellEvent: event,
          disconnectionReason: call.disconnection_reason ?? null,
          transferDestination: call.transfer_destination ?? null,
          callAnalysis: call.call_analysis ?? null,
          sourceMetadata: call.metadata ?? {},
        },
      },
      update: {
        phoneNumber,
        status,
        answeredAt: event === 'call_started' ? now : undefined,
        endedAt: event === 'call_ended' || event === 'call_analyzed' ? now : undefined,
        duration,
        transcript,
        recordingUrl,
        metadata: {
          provider: 'retell',
          retellCallId: call.call_id ?? null,
          retellEvent: event,
          disconnectionReason: call.disconnection_reason ?? null,
          transferDestination: call.transfer_destination ?? null,
          callAnalysis: call.call_analysis ?? null,
          sourceMetadata: call.metadata ?? {},
        },
      },
    });

    await persistSalesLink({ voiceCallId: voiceCall.id, call, event });

    logger.info('[retell-webhook] Call event persisted', {
      event,
      retellCallId: call.call_id,
      twilioCallSid,
      voiceCallId: voiceCall.id,
    });
  } catch (error) {
    logger.error('[retell-webhook] Persistence failed', {
      event,
      retellCallId: call.call_id,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Persistence failed' }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
