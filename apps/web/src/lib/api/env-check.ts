import { logger } from '@/lib/logger';

const REQUIRED_VARS: Record<string, string[]> = {
  core: ['DATABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
  voice: ['OPENAI_API_KEY', 'TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'],
  payments: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
  app: ['NEXT_PUBLIC_APP_URL'],
};

let checked = false;

export function checkEnvOnce(): void {
  if (checked) return;
  checked = true;

  let hasMissing = false;
  for (const [group, vars] of Object.entries(REQUIRED_VARS)) {
    const missing = vars.filter((v) => !process.env[v]);
    if (missing.length > 0) {
      logger.error(`Missing env vars [${group}]`, { missing });
      hasMissing = true;
    }
  }

  if (!hasMissing) {
    logger.info('Env validation passed', {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
    });
  }
}
