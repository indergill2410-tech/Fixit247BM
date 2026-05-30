const DEFAULT_DASHBOARD = '/dashboard';

export function getDashboardTarget(role: string | undefined): string {
  if (role === 'TRADIE') return '/tradie/dashboard';
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    return process.env.NEXT_PUBLIC_ADMIN_URL ?? '/admin';
  }
  return DEFAULT_DASHBOARD;
}

export function normalizeRedirectTarget(
  target: string | null | undefined,
  baseOrigin: string,
): string {
  if (!target) return DEFAULT_DASHBOARD;
  if (target.startsWith('/') && !target.startsWith('//')) return target;

  try {
    const url = new URL(target);
    const allowedOrigins = new Set([baseOrigin]);
    if (process.env.NEXT_PUBLIC_ADMIN_URL) {
      allowedOrigins.add(new URL(process.env.NEXT_PUBLIC_ADMIN_URL).origin);
    }
    return allowedOrigins.has(url.origin) ? url.toString() : DEFAULT_DASHBOARD;
  } catch {
    return DEFAULT_DASHBOARD;
  }
}

export function toRedirectUrl(target: string, baseOrigin: string): string {
  return new URL(target, baseOrigin).toString();
}
