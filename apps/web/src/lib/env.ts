import { logger } from './logger';

const REQUIRED_VARS = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'NEXT_PUBLIC_APP_URL',
] as const;

const OPTIONAL_VARS = [
  'DIRECT_URL',
  'TWILIO_FALLBACK_NUMBER',
  'RESEND_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'UPSTASH_REDIS_REST_URL',
  'SUPABASE_JWT_SECRET',
] as const;

let validated = false;

export function validateEnv(): void {
  if (validated) return;
  validated = true;

  const missing = REQUIRED_VARS.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    logger.error('env', 'Missing required environment variables', { missing });
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required env vars: ${missing.join(', ')}`);
    }
  }

  const missingOptional = OPTIONAL_VARS.filter((k) => !process.env[k]);
  if (missingOptional.length > 0) {
    logger.warn('env', 'Missing optional environment variables', { missing: missingOptional });
  }

  logger.info('env', 'Environment validated', {
    NODE_ENV: process.env.NODE_ENV,
    APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    hasDB: !!process.env.DATABASE_URL,
    hasOpenAI: !!process.env.OPENAI_API_KEY,
    hasTwilio: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
  });
}

export function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required environment variable: ${key}`);
  return val;
}
