import { z } from 'zod';

// Core vars — app cannot function at all without these
const requiredSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().min(1, 'DIRECT_URL is required'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL'),
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
});

// Optional integrations — app boots without them; individual features degrade
const optionalSchema = z.object({
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  TWILIO_ACCOUNT_SID: z.string().min(1).optional(),
  TWILIO_AUTH_TOKEN: z.string().min(1).optional(),
  TWILIO_PHONE_NUMBER: z.string().min(1).optional(),
});

export type Env = z.infer<typeof requiredSchema> & z.infer<typeof optionalSchema>;

export function validateEnv(): Env {
  const requiredResult = requiredSchema.safeParse(process.env);

  if (!requiredResult.success) {
    const errors = requiredResult.error.flatten().fieldErrors;
    const missing = Object.entries(errors)
      .map(([key, msgs]) => `  ${key}: ${(msgs ?? []).join(', ')}`)
      .join('\n');

    console.error(
      `\n❌ Missing required environment variables:\n${missing}\n\nSet these in your Render dashboard or .env.local.\n`,
    );

    process.exit(1);
  }

  const optionalResult = optionalSchema.safeParse(process.env);
  const optional = optionalResult.success ? optionalResult.data : {};

  // Warn about missing optional integrations so ops can see what's unconfigured
  const missingOptional = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'RESEND_API_KEY', 'TWILIO_ACCOUNT_SID']
    .filter((key) => !process.env[key]);

  if (missingOptional.length > 0) {
    console.warn(
      `\n⚠ Optional integrations not configured (features will degrade gracefully):\n${missingOptional.map((k) => `  ${k}`).join('\n')}\n`,
    );
  }

  return { ...requiredResult.data, ...optional };
}
