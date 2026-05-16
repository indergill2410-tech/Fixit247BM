import { db } from '@fixit247/database';

interface Preferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: number | null;
  quietHoursEnd: number | null;
  disabledTypes: string[];
}

const DEFAULT: Preferences = {
  emailEnabled: true, pushEnabled: true, smsEnabled: false,
  quietHoursEnabled: false, quietHoursStart: null, quietHoursEnd: null, disabledTypes: [],
};

export async function getPreferences(userId: string): Promise<Preferences> {
  const p = await db.notificationPreference.findUnique({ where: { userId } });
  if (!p) return DEFAULT;
  return {
    emailEnabled: p.emailEnabled, pushEnabled: p.pushEnabled, smsEnabled: p.smsEnabled,
    quietHoursEnabled: p.quietHoursEnabled, quietHoursStart: p.quietHoursStart,
    quietHoursEnd: p.quietHoursEnd, disabledTypes: p.disabledTypes,
  };
}

export function isQuietHours(p: Preferences): boolean {
  if (!p.quietHoursEnabled || p.quietHoursStart == null || p.quietHoursEnd == null) return false;
  const h = new Date().getHours();
  return p.quietHoursStart > p.quietHoursEnd
    ? h >= p.quietHoursStart || h < p.quietHoursEnd
    : h >= p.quietHoursStart && h < p.quietHoursEnd;
}

export function shouldSendChannel(p: Preferences, type: string, channel: 'email' | 'push' | 'sms'): boolean {
  if (p.disabledTypes.includes(type)) return false;
  if (channel === 'email') return p.emailEnabled;
  if (channel === 'push') return p.pushEnabled && !isQuietHours(p);
  if (channel === 'sms') return p.smsEnabled && !isQuietHours(p);
  return true;
}
