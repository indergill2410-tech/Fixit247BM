import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Validate required env vars before any request is handled — exits on failure.
    const { validateEnv } = await import('./src/lib/validate-env');
    validateEnv();

    // PostHog server analytics + OTel log forwarding
    const { getPostHogServer } = await import('./src/lib/posthog/server');
    getPostHogServer();

    const { emitOtelLog } = await import('./src/lib/posthog/otel-logger');
    const { setOtelEmitter } = await import('./src/lib/logger');
    setOtelEmitter(emitOtelLog);

    // Sentry server-side error monitoring
    if (process.env.SENTRY_DSN) {
      await import('./sentry.server.config');
    }
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    if (process.env.SENTRY_DSN) {
      await import('./sentry.edge.config');
    }
  }
}

// Capture unhandled server/edge request errors and forward to Sentry.
// Sentry is a no-op when not initialised, so this is safe without a DSN.
export const onRequestError = Sentry.captureRequestError;
