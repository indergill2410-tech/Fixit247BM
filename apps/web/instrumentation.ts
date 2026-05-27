export async function register() {
  // Server-side PostHog: verify the node client can reach PostHog on startup.
  // The singleton is lazily created on first use; this just warms it up.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { getPostHogServer } = await import('./src/lib/posthog/server');
    getPostHogServer();
  }
}
