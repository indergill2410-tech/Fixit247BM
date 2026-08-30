import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';
import { createRetellPhoneCall } from '@/lib/retell';
import {
  checkAustralianTelemarketingWindow,
  isContactSuppressed,
  normaliseAustralianPhoneNumber,
} from '@/lib/sales-compliance';

export const runtime = 'nodejs';

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

function optionalText(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export async function POST(req: Request) {
  if (!authorised(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (process.env.AI_SALES_ENABLED !== 'true') {
    return NextResponse.json(
      { error: 'AI sales calling is disabled by configuration.' },
      { status: 503 },
    );
  }

  const callingWindow = checkAustralianTelemarketingWindow();
  if (!callingWindow.allowed) {
    return NextResponse.json({ error: callingWindow.reason }, { status: 409 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const toNumber = normaliseAustralianPhoneNumber(String(body.toNumber ?? ''));
  const configuredFrom = process.env.RETELL_FROM_NUMBER ?? process.env.TWILIO_PHONE_NUMBER ?? '';
  const fromNumber = normaliseAustralianPhoneNumber(configuredFrom);

  if (!toNumber) {
    return NextResponse.json({ error: 'A valid Australian destination number is required.' }, { status: 400 });
  }
  if (!fromNumber) {
    return NextResponse.json({ error: 'RETELL_FROM_NUMBER is not configured as a valid +61 number.' }, { status: 503 });
  }

  if (await isContactSuppressed(toNumber)) {
    logger.info('[retell-outbound] Suppressed contact blocked', { toNumber });
    return NextResponse.json({ error: 'Contact is suppressed from sales calling.' }, { status: 409 });
  }

  const leadId = optionalText(body.leadId);
  const campaignId = optionalText(body.campaignId);
  const dynamicVariables: Record<string, string | number | boolean> = {
    first_name: optionalText(body.firstName) ?? 'there',
    company_name: optionalText(body.companyName) ?? '',
    role_title: optionalText(body.roleTitle) ?? '',
    suburb: optionalText(body.suburb) ?? '',
    booking_url: process.env.AI_SALES_BOOKING_URL ?? '',
    ...(typeof body.dynamicVariables === 'object' && body.dynamicVariables
      ? Object.fromEntries(
          Object.entries(body.dynamicVariables as Record<string, unknown>).filter(
            (entry): entry is [string, string | number | boolean] =>
              ['string', 'number', 'boolean'].includes(typeof entry[1]),
          ),
        )
      : {}),
  };

  try {
    if (leadId) {
      const matching = await db.$queryRaw<Array<{ phone_number: string; status: string }>>`
        SELECT phone_number, status
        FROM sales_leads
        WHERE id = CAST(${leadId} AS UUID)
        LIMIT 1
      `;

      const lead = matching[0];
      if (!lead) {
        return NextResponse.json({ error: 'Sales lead not found.' }, { status: 404 });
      }

      const leadPhone = normaliseAustralianPhoneNumber(lead.phone_number);
      if (leadPhone !== toNumber) {
        return NextResponse.json({ error: 'Destination number does not match the sales lead.' }, { status: 409 });
      }
      if (lead.status === 'DO_NOT_CALL') {
        return NextResponse.json({ error: 'Sales lead is marked do-not-call.' }, { status: 409 });
      }
    }

    const retellCall = await createRetellPhoneCall({
      fromNumber,
      toNumber,
      metadata: {
        sales_lead_id: leadId ?? null,
        sales_campaign_id: campaignId ?? null,
        source: 'fixit247-ai-sales',
      },
      dynamicVariables,
    });

    if (leadId) {
      await db.$executeRaw`
        UPDATE sales_leads
        SET status = 'DIALING', last_contact_at = NOW(), updated_at = NOW()
        WHERE id = CAST(${leadId} AS UUID)
          AND status <> 'DO_NOT_CALL'
      `;
    }

    logger.info('[retell-outbound] Call created', {
      leadId,
      campaignId,
      toNumber,
      retellCallId: retellCall.call_id,
    });

    return NextResponse.json({
      ok: true,
      callId: retellCall.call_id ?? null,
      callStatus: retellCall.call_status ?? 'registered',
    });
  } catch (error) {
    logger.error('[retell-outbound] Failed to create outbound call', {
      leadId,
      campaignId,
      toNumber,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to create call.' },
      { status: 502 },
    );
  }
}
