import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

type ActivationEvent = 'SIGNED_UP' | 'PROPERTY_ADDED' | 'FIRST_JOB_POSTED';

const stageRank: Record<ActivationEvent, number> = {
  SIGNED_UP: 3,
  PROPERTY_ADDED: 4,
  FIRST_JOB_POSTED: 5,
};

const stageRankAll: Record<string, number> = {
  NEW: 0,
  QUALIFIED: 1,
  LINK_SENT: 2,
  SIGNED_UP: 3,
  PROPERTY_ADDED: 4,
  FIRST_JOB_POSTED: 5,
};

function constantTimeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function authorised(req: Request): boolean {
  const expected = process.env.AI_SALES_INTERNAL_KEY;
  const supplied = req.headers.get('x-fixit-sales-key');
  return Boolean(expected && supplied && constantTimeEqual(expected, supplied));
}

export async function POST(req: Request) {
  if (!authorised(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const eventType = typeof body.eventType === 'string' ? body.eventType.toUpperCase() as ActivationEvent : undefined;
  if (!eventType || !(eventType in stageRank)) {
    return NextResponse.json({ error: 'eventType must be SIGNED_UP, PROPERTY_ADDED or FIRST_JOB_POSTED.' }, { status: 400 });
  }

  const leadId = typeof body.leadId === 'string' && body.leadId.trim() ? body.leadId.trim() : undefined;
  const trackingToken = typeof body.trackingToken === 'string' && body.trackingToken.trim() ? body.trackingToken.trim() : undefined;
  if (!leadId && !trackingToken) {
    return NextResponse.json({ error: 'leadId or trackingToken is required.' }, { status: 400 });
  }

  try {
    const rows = leadId
      ? await db.$queryRaw<Array<{ id: string; propertysafe_stage: string }>>`
          SELECT id, propertysafe_stage
          FROM sales_leads
          WHERE id = CAST(${leadId} AS UUID)
          LIMIT 1
        `
      : await db.$queryRaw<Array<{ id: string; propertysafe_stage: string }>>`
          SELECT id, propertysafe_stage
          FROM sales_leads
          WHERE signup_tracking_token = CAST(${trackingToken!} AS UUID)
          LIMIT 1
        `;

    const lead = rows[0];
    if (!lead) return NextResponse.json({ error: 'Sales lead not found.' }, { status: 404 });

    const currentRank = stageRankAll[lead.propertysafe_stage] ?? 0;
    const incomingRank = stageRank[eventType];
    const accountId = typeof body.propertysafeAccountId === 'string' && body.propertysafeAccountId.trim()
      ? body.propertysafeAccountId.trim()
      : null;
    const source = typeof body.source === 'string' && body.source.trim() ? body.source.trim() : 'propertysafe-app';
    const metadata = typeof body.metadata === 'object' && body.metadata !== null ? body.metadata : {};

    if (incomingRank > currentRank) {
      if (eventType === 'SIGNED_UP') {
        await db.$executeRaw`
          UPDATE sales_leads
          SET propertysafe_stage = 'SIGNED_UP',
              signed_up_at = COALESCE(signed_up_at, NOW()),
              propertysafe_account_id = COALESCE(${accountId}, propertysafe_account_id),
              activation_source = COALESCE(activation_source, ${source}),
              status = CASE WHEN status <> 'DO_NOT_CALL' THEN 'WON' ELSE status END,
              updated_at = NOW()
          WHERE id = CAST(${lead.id} AS UUID)
        `;
      }

      if (eventType === 'PROPERTY_ADDED') {
        await db.$executeRaw`
          UPDATE sales_leads
          SET propertysafe_stage = 'PROPERTY_ADDED',
              signed_up_at = COALESCE(signed_up_at, NOW()),
              first_property_added_at = COALESCE(first_property_added_at, NOW()),
              propertysafe_account_id = COALESCE(${accountId}, propertysafe_account_id),
              activation_source = COALESCE(activation_source, ${source}),
              status = CASE WHEN status <> 'DO_NOT_CALL' THEN 'WON' ELSE status END,
              updated_at = NOW()
          WHERE id = CAST(${lead.id} AS UUID)
        `;
      }

      if (eventType === 'FIRST_JOB_POSTED') {
        await db.$executeRaw`
          UPDATE sales_leads
          SET propertysafe_stage = 'FIRST_JOB_POSTED',
              signed_up_at = COALESCE(signed_up_at, NOW()),
              first_property_added_at = COALESCE(first_property_added_at, NOW()),
              first_job_posted_at = COALESCE(first_job_posted_at, NOW()),
              propertysafe_account_id = COALESCE(${accountId}, propertysafe_account_id),
              activation_source = COALESCE(activation_source, ${source}),
              status = CASE WHEN status <> 'DO_NOT_CALL' THEN 'WON' ELSE status END,
              updated_at = NOW()
          WHERE id = CAST(${lead.id} AS UUID)
        `;
      }
    }

    await db.$executeRaw`
      INSERT INTO propertysafe_activation_events (lead_id, event_type, metadata)
      VALUES (
        CAST(${lead.id} AS UUID),
        ${eventType},
        ${JSON.stringify({ source, ...metadata })}::jsonb
      )
    `;

    logger.info('[propertysafe-activation] Funnel event recorded', {
      leadId: lead.id,
      eventType,
      previousStage: lead.propertysafe_stage,
    });

    return NextResponse.json({
      ok: true,
      leadId: lead.id,
      eventType,
      stageAdvanced: incomingRank > currentRank,
    });
  } catch (error) {
    logger.error('[propertysafe-activation] Failed to record event', {
      eventType,
      leadId,
      trackingToken,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: 'Unable to record PropertySafe activation.' }, { status: 500 });
  }
}
