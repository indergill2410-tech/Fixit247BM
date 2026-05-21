import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

// Twilio calls this URL when the primary webhook (inbound) fails.
// Set as "Fallback URL" in Twilio phone number config.
export async function POST(req: Request) {
  const body = await req.text();
  const params = Object.fromEntries(new URLSearchParams(body));

  const callSid = params.CallSid;
  const errorCode = params.ErrorCode;
  const errorUrl = params.ErrorUrl;

  logger.error('Twilio fallback triggered — primary webhook failed', {
    callSid,
    errorCode,
    errorUrl,
  });

  // Return a simple TwiML that tells the caller to try again
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Nicole" language="en-AU">
    Sorry, we're experiencing a technical issue right now. Please call back in a moment, or visit fixit247.com.au for help. We apologise for the inconvenience.
  </Say>
  <Hangup/>
</Response>`;

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
  });
}
