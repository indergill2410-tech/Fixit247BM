import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';

const MELBOURNE_TIME_ZONE = 'Australia/Melbourne';

export function normaliseAustralianPhoneNumber(value: string): string | null {
  let phone = value.trim().replace(/[\s()-]/g, '');

  if (phone.startsWith('0061')) phone = `+61${phone.slice(4)}`;
  if (phone.startsWith('61') && !phone.startsWith('+61')) phone = `+${phone}`;
  if (phone.startsWith('0')) phone = `+61${phone.slice(1)}`;

  return /^\+61\d{9}$/.test(phone) ? phone : null;
}

function easterSunday(year: number): Date {
  // Anonymous Gregorian algorithm. UTC is used because we compare date-only values.
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addUtcDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function restrictedNationalHolidayDates(year: number): Set<string> {
  const easter = easterSunday(year);
  return new Set([
    `${year}-01-01`, // New Year's Day
    `${year}-01-26`, // Australia Day
    `${year}-04-25`, // Anzac Day
    `${year}-12-25`, // Christmas Day
    `${year}-12-26`, // Boxing Day
    isoDate(addUtcDays(easter, -2)), // Good Friday
    isoDate(addUtcDays(easter, 1)), // Easter Monday
  ]);
}

function melbourneDateParts(now = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-AU', {
    timeZone: MELBOURNE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    weekday: 'short',
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(now).map((part) => [part.type, part.value]),
  );

  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);
  const hour = Number(parts.hour);
  const minute = Number(parts.minute);
  const weekday = parts.weekday ?? '';
  const date = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return { year, month, day, hour, minute, weekday, date };
}

export function checkAustralianTelemarketingWindow(now = new Date()): {
  allowed: boolean;
  reason?: string;
} {
  const local = melbourneDateParts(now);

  if (restrictedNationalHolidayDates(local.year).has(local.date)) {
    return { allowed: false, reason: 'National public holiday calling is disabled.' };
  }

  if (local.weekday === 'Sun') {
    return { allowed: false, reason: 'Telemarketing calls are disabled on Sundays.' };
  }

  const minutes = local.hour * 60 + local.minute;
  const start = 9 * 60;
  const end = local.weekday === 'Sat' ? 17 * 60 : 20 * 60;

  if (minutes < start || minutes >= end) {
    return {
      allowed: false,
      reason:
        local.weekday === 'Sat'
          ? 'Saturday telemarketing calls are limited to 9:00am–5:00pm Melbourne time.'
          : 'Weekday telemarketing calls are limited to 9:00am–8:00pm Melbourne time.',
    };
  }

  return { allowed: true };
}

export async function isContactSuppressed(phoneNumber: string): Promise<boolean> {
  try {
    const rows = await db.$queryRaw<Array<{ suppressed: boolean }>>`
      SELECT EXISTS (
        SELECT 1
        FROM contact_suppressions
        WHERE phone_number = ${phoneNumber}
          AND (expires_at IS NULL OR expires_at > NOW())
      ) AS suppressed
    `;
    return Boolean(rows[0]?.suppressed);
  } catch (error) {
    logger.error('[sales-compliance] Failed to check suppression table', {
      error: error instanceof Error ? error.message : String(error),
    });

    // Fail closed in production so a database/migration failure cannot cause unlawful outreach.
    return process.env.NODE_ENV === 'production';
  }
}

export async function suppressContact(input: {
  phoneNumber: string;
  reason?: string;
  source?: string;
}) {
  await db.$executeRaw`
    INSERT INTO contact_suppressions (phone_number, reason, source, created_at, updated_at)
    VALUES (${input.phoneNumber}, ${input.reason ?? 'Recipient requested no further sales calls'}, ${input.source ?? 'voice-agent'}, NOW(), NOW())
    ON CONFLICT (phone_number)
    DO UPDATE SET
      reason = EXCLUDED.reason,
      source = EXCLUDED.source,
      expires_at = NULL,
      updated_at = NOW()
  `;

  await db.$executeRaw`
    UPDATE sales_leads
    SET status = 'DO_NOT_CALL', updated_at = NOW()
    WHERE phone_number = ${input.phoneNumber}
  `;
}
