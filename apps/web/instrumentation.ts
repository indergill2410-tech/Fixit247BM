export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getPostHogServer } = await import('./src/lib/posthog/server');
    getPostHogServer();

    const { emitOtelLog } = await import('./src/lib/posthog/otel-logger');
    const { setOtelEmitter } = await import('./src/lib/logger');
    setOtelEmitter(emitOtelLog);
  }
}
