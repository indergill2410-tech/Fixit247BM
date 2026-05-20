import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const REQUIRED_VARS = [
  'DATABASE_URL',
  'OPENAI_API_KEY',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'NEXT_PUBLIC_APP_URL',
];

export async function GET() {
  const checks: Record<string, string> = {};

  // Database connectivity
  try {
    await db.$queryRaw`SELECT 1`;
    checks.database = 'ok';
  } catch (err) {
    checks.database = `error: ${err instanceof Error ? err.message : String(err)}`;
  }

  // Required env vars
  const missingEnv = REQUIRED_VARS.filter((k) => !process.env[k]);
  checks.env = missingEnv.length === 0 ? 'ok' : `missing: ${missingEnv.join(', ')}`;

  // OpenAI key present (don't call it — just confirm it's set)
  checks.openai = process.env.OPENAI_API_KEY ? 'configured' : 'missing';

  // Twilio configured
  checks.twilio = process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_ACCOUNT_SID
    ? 'configured'
    : 'missing';

  const allOk = checks.database === 'ok' && checks.env === 'ok';

  return NextResponse.json(
    {
      status: allOk ? 'ok' : 'degraded',
      checks,
      ts: new Date().toISOString(),
      version: process.env.npm_package_version ?? '0.1.0',
    },
    // Always return 200 so Render considers the service live.
    // Degraded state is surfaced in the body for observability.
    { status: 200 },
  );
}
