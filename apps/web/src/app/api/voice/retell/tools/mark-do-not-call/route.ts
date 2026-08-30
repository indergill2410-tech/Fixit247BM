import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { type RetellCall, verifyRetellSignature } from '@/lib/retell';
import { normaliseAustralianPhoneNumber, suppressContact } from '@/lib/sales-compliance';

export const runtime = 'nodejs';

type RetellToolRequest = {
  name?: string;
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

  const explicitPhone = typeof body.args?.phone_number === 'string' ? body.args.phone_number : undefined;
  const callPhone =
    body.call?.direction === 'inbound'
      ? body.call.from_number
      : body.call?.direction === 'outbound'
        ? body.call.to_number
        : undefined;
  const phoneNumber = normaliseAustralianPhoneNumber(explicitPhone ?? callPhone ?? '');

  if (!phoneNumber) {
    return NextResponse.json(
      { success: false, message: 'Unable to identify the Australian phone number.' },
      { status: 400 },
    );
  }

  const reason =
    typeof body.args?.reason === 'string' && body.args.reason.trim()
      ? body.args.reason.trim()
      : 'Recipient requested no further sales calls';

  try {
    await suppressContact({ phoneNumber, reason, source: 'retell-agent' });
    logger.info('[retell-tool] Contact suppressed', {
      phoneNumber,
      retellCallId: body.call?.call_id,
    });

    return NextResponse.json({
      success: true,
      message: 'The number has been added to the Fixit247 do-not-call list. Do not make any further sales pitch; acknowledge the request politely and end the call.',
    });
  } catch (error) {
    logger.error('[retell-tool] Failed to suppress contact', {
      phoneNumber,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ success: false, message: 'Unable to save the do-not-call request.' }, { status: 500 });
  }
}
