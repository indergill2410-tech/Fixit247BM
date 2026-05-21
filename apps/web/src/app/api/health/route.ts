import { NextResponse } from 'next/server';
import { db } from '@fixit247/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ServiceStatus {
  status: 'ok' | 'degraded' | 'down';
  latencyMs?: number;
  error?: string;
}

async function checkDatabase(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    return { status: 'ok', latencyMs: Date.now() - start };
  } catch (err) {
    return { status: 'down', error: err instanceof Error ? err.message : 'unknown' };
  }
}

function checkEnv(): ServiceStatus {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'DATABASE_URL',
    'STRIPE_SECRET_KEY',
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    return { status: 'degraded', error: `Missing env vars: ${missing.join(', ')}` };
  }
  return { status: 'ok' };
}

export async function GET() {
  const [db_status, env_status] = await Promise.all([
    checkDatabase(),
    Promise.resolve(checkEnv()),
  ]);

  const overall =
    db_status.status === 'down' || env_status.status === 'down'
      ? 'down'
      : db_status.status === 'degraded' || env_status.status === 'degraded'
        ? 'degraded'
        : 'ok';

  const httpStatus = overall === 'down' ? 503 : overall === 'degraded' ? 200 : 200;

  return NextResponse.json(
    {
      status: overall,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '0.1.0',
      services: { database: db_status, env: env_status },
    },
    { status: httpStatus },
  );
}
