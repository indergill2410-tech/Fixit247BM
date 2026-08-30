import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';
import { type RetellCall, verifyRetellSignature } from '@/lib/retell';

export const runtime = 'nodejs';

type RetellToolRequest = {
  call?: RetellCall;
  args?: Record<string, unknown>;
};

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

  const leadId =
    typeof body.call?.metadata?.sales_lead_id === 'string'
      ? body.call.metadata.sales_lead_id
      : undefined;
  const preferredTime =
    typeof body.args?.preferred_time === 'string' ? new Date(body.args.preferred_time) : null;

  if (!leadId) {
    return NextResponse.json(
      { success: false, message: 'This call is not linked to a sales lead.' },
      { status: 400 },
    );
  }
  if (!preferredTime || Number.isNaN(preferredTime.getTime()) || preferredTime <= new Date()) {
    return NextResponse.json(
      { success: false, message: 'A valid future callback time is required.' },
      { status: 400 },
    );
  }

  try {
    const updated = await db.$executeRaw`
      UPDATE sales_leads
      SET
        status = 'NURTURE',
        next_contact_at = ${preferredTime},
        notes = CONCAT_WS(E'\n', NULLIF(notes, ''), ${`Callback requested during AI call ${body.call?.call_id ?? ''}`}),
        updated_at = NOW()
      WHERE id = CAST(${leadId} AS UUID)
        AND status <> 'DO_NOT_CALL'
    `;

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'The lead could not be scheduled for callback.' },
        { status: 404 },
      );
    }

    logger.info('[retell-tool] Callback scheduled', {
      leadId,
      preferredTime: preferredTime.toISOString(),
      retellCallId: body.call?.call_id,
    });

    return NextResponse.json({
      success: true,
      callback_time: preferredTime.toISOString(),
      message: 'Callback saved successfully. Confirm the date and time with the person before ending the call.',
    });
  } catch (error) {
    logger.error('[retell-tool] Failed to schedule callback', {
      leadId,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ success: false, message: 'Unable to save the callback.' }, { status: 500 });
  }
}
