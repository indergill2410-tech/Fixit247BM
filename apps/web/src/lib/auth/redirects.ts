const DEFAULT_DASHBOARD = '/dashboard';
const DEFAULT_ADMIN_URL = 'https://admin.fixit247.com.au';

function adminDashboardTarget(): string {
  return (process.env.NEXT_PUBLIC_ADMIN_URL ?? DEFAULT_ADMIN_URL).replace(/\/$/, '');
}

export function getDashboardTarget(role: string | undefined): string {
  if (role === 'TRADIE') return '/tradie/dashboard';
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    return adminDashboardTarget();
  }
  return DEFAULT_DASHBOARD;
}

export function normalizeRedirectTarget(
  target: string | null | undefined,
  baseOrigin: string,
): string {
  if (!target) return DEFAULT_DASHBOARD;
  if (target === '/admin' || target.startsWith('/admin/')) {
    return `${adminDashboardTarget()}${target.slice('/admin'.length)}`;
  }
  if (target.startsWith('/') && !target.startsWith('//')) return target;

  try {
    const url = new URL(target);
    const allowedOrigins = new Set([baseOrigin, new URL(adminDashboardTarget()).origin]);
    return allowedOrigins.has(url.origin) ? url.toString() : DEFAULT_DASHBOARD;
  } catch {
    return DEFAULT_DASHBOARD;
  }
}

export function toRedirectUrl(target: string, baseOrigin: string): string {
  return new URL(target, baseOrigin).toString();
}
