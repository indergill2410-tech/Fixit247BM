/**
 * Next.js instrumentation hook — runs once in nodejs and edge runtimes.
 * Initialises Sentry before any request is handled.
 */
export async function register() {
  const sentryConfig = {
    dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    debug: false,
  };
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { validateEnv } = await import('@/lib/validate-env');
    validateEnv();
    const Sentry = await import('@sentry/nextjs');
    Sentry.init(sentryConfig);
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    const Sentry = await import('@sentry/nextjs');
    Sentry.init(sentryConfig);
  }
}
