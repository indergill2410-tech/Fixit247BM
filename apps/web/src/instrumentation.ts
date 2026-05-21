/**
 * Next.js Instrumentation Hook
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 *
 * This file runs once when the Next.js server starts up (both Node.js runtime
 * and Edge runtime). We use it to validate required environment variables so
 * the server refuses to boot with a missing configuration rather than silently
 * failing at request-time.
 */
export async function register() {
  // Only validate on the Node.js runtime (server side).
  // Edge runtime does not have process.exit and has a restricted env surface.
  if (process.env['NEXT_RUNTIME'] === 'nodejs') {
    const { validateEnv } = await import('@/lib/validate-env');
    validateEnv();
  }
}
