import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ServiceStatus {
  status: 'ok' | 'down';
  latencyMs?: number;
  error?: string;
}

const REQUIRED_ENV = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'DATABASE_URL',
  'STRIPE_SECRET_KEY',
] as const;

async function checkDatabase(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    return { status: 'ok', latencyMs: Date.now() - start };
  } catch (err) {
    const message =
      process.env.NODE_ENV === 'production'
        ? 'database check failed'
        : err instanceof Error
          ? err.message
          : 'unknown database error';
    return { status: 'down', error: message };
  }
}

function checkEnv(): ServiceStatus {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length === 0) return { status: 'ok' };

  return {
    status: 'down',
    error:
      process.env.NODE_ENV === 'production'
        ? 'required environment is incomplete'
        : `Missing env vars: ${missing.join(', ')}`,
  };
}

export async function GET() {
  const [database, env] = await Promise.all([checkDatabase(), Promise.resolve(checkEnv())]);
  const status = database.status === 'ok' && env.status === 'ok' ? 'ok' : 'down';

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '0.1.0',
      services: { database, env },
    },
    { status: status === 'ok' ? 200 : 503 },
  );
}
