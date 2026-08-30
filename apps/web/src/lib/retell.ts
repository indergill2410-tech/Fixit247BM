import crypto from 'crypto';

const RETELL_API_BASE = 'https://api.retellai.com';
const WEBHOOK_TOLERANCE_MS = 5 * 60 * 1000;

export type RetellCall = {
  call_id?: string;
  call_status?: string;
  direction?: 'inbound' | 'outbound';
  from_number?: string;
  to_number?: string;
  start_timestamp?: number;
  end_timestamp?: number;
  duration_ms?: number;
  transcript?: string;
  transcript_object?: Array<{
    role?: string;
    content?: string;
    words?: Array<{ word?: string }>;
  }>;
  recording_url?: string;
  scrubbed_recording_url?: string;
  disconnection_reason?: string;
  transfer_destination?: string | null;
  metadata?: Record<string, unknown>;
  telephony_identifier?: {
    twilio_call_sid?: string;
    [key: string]: unknown;
  };
  call_analysis?: {
    call_summary?: string;
    call_successful?: boolean;
    user_sentiment?: string;
    in_voicemail?: boolean;
    custom_analysis_data?: Record<string, unknown>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export type RetellWebhookPayload = {
  event: string;
  call: RetellCall;
};

export function verifyRetellSignature(rawBody: string, signature: string | null): boolean {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey || !signature) return false;

  const match = /^v=(\d+),d=([0-9a-fA-F]+)$/.exec(signature.trim());
  if (!match) return false;

  const timestamp = Number(match[1]);
  const suppliedDigest = match[2]?.toLowerCase();
  if (!Number.isFinite(timestamp) || !suppliedDigest) return false;

  if (Math.abs(Date.now() - timestamp) > WEBHOOK_TOLERANCE_MS) return false;

  const expectedDigest = crypto
    .createHmac('sha256', apiKey)
    .update(`${rawBody}${match[1]}`)
    .digest('hex');

  const expected = Buffer.from(expectedDigest, 'hex');
  const supplied = Buffer.from(suppliedDigest, 'hex');
  if (expected.length !== supplied.length) return false;

  return crypto.timingSafeEqual(expected, supplied);
}

export function normaliseRetellTranscript(call: RetellCall): string | undefined {
  if (typeof call.transcript === 'string' && call.transcript.trim()) {
    return call.transcript.trim();
  }

  if (!Array.isArray(call.transcript_object)) return undefined;

  const lines = call.transcript_object
    .map((item) => {
      const role = item.role === 'agent' ? 'Agent' : item.role === 'user' ? 'Customer' : item.role ?? 'Speaker';
      const content =
        typeof item.content === 'string' && item.content.trim()
          ? item.content.trim()
          : Array.isArray(item.words)
            ? item.words.map((word) => word.word).filter(Boolean).join(' ').trim()
            : '';
      return content ? `${role}: ${content}` : null;
    })
    .filter((line): line is string => Boolean(line));

  return lines.length ? lines.join('\n') : undefined;
}

export async function createRetellPhoneCall(input: {
  toNumber: string;
  fromNumber: string;
  metadata?: Record<string, unknown>;
  dynamicVariables?: Record<string, string | number | boolean>;
}) {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) throw new Error('RETELL_API_KEY is not configured');

  const response = await fetch(`${RETELL_API_BASE}/v2/create-phone-call`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from_number: input.fromNumber,
      to_number: input.toNumber,
      metadata: input.metadata ?? {},
      retell_llm_dynamic_variables: input.dynamicVariables ?? {},
    }),
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    const message =
      typeof payload.message === 'string'
        ? payload.message
        : typeof payload.error === 'string'
          ? payload.error
          : `Retell API request failed with HTTP ${response.status}`;
    throw new Error(message);
  }

  return payload;
}
