import { db } from '@fixit247/database';
import { logger } from '@/lib/logger';

export interface PromoCode {
  discountPercent: number;
  description: string;
}

// Fallback codes used when no matching PlatformConfig row exists. Campaigns can
// override / add codes at runtime by writing `promo:CODE` rows (see below),
// without a code deploy.
const STATIC_PROMO_CODES: Record<string, PromoCode> = {
  FIRST20: { discountPercent: 20, description: '20% off your first job' },
  WELCOME10: { discountPercent: 10, description: '10% off for new customers' },
  EMERGENCY15: { discountPercent: 15, description: '15% off emergency callouts' },
};

interface StoredPromo {
  discountPercent: number;
  description: string;
  active?: boolean;
  expiresAt?: string;
}

/**
 * Resolve a promo code, DB-first.
 * A code is stored in PlatformConfig as key `promo:CODE`, value = JSON
 * { discountPercent, description, active?, expiresAt? }. Falls back to the
 * static map so existing codes keep working before any are configured.
 */
export async function lookupPromoCode(rawCode: string): Promise<PromoCode | null> {
  const normalised = rawCode.trim().toUpperCase();

  try {
    const row = await db.platformConfig.findUnique({ where: { key: `promo:${normalised}` } });
    if (row) {
      const parsed = JSON.parse(row.value) as StoredPromo;
      if (parsed.active === false) return null;
      if (parsed.expiresAt) {
        // A malformed date string yields NaN; NaN < now is false, which would
        // silently bypass expiry. Treat unparseable or past dates as expired.
        const expiryTime = new Date(parsed.expiresAt).getTime();
        if (Number.isNaN(expiryTime) || expiryTime < Date.now()) return null;
      }
      if (typeof parsed.discountPercent !== 'number') return null;
      return { discountPercent: parsed.discountPercent, description: parsed.description };
    }
  } catch (err) {
    // PlatformConfig unavailable or malformed value — degrade to static codes.
    logger.error('[lookupPromoCode] DB lookup failed, falling back to static', err);
  }

  return STATIC_PROMO_CODES[normalised] ?? null;
}
