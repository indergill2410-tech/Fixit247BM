/**
 * Normalise an Australian phone string to E.164 (+61XXXXXXXXX).
 * Accepts local format (0XXXXXXXXX), international without + (61XXXXXXXXX),
 * and E.164 (+61XXXXXXXXX), all optionally containing spaces or dashes.
 * Returns null if the input cannot be parsed as a valid Australian number.
 */
export function normalizeAustralianPhone(raw: string): string | null {
  const digits = raw.replace(/[\s\-().]/g, '');
  if (/^\+61[2-9]\d{8}$/.test(digits)) return digits;
  if (/^61[2-9]\d{8}$/.test(digits)) return '+' + digits;
  if (/^0[2-9]\d{8}$/.test(digits)) return '+61' + digits.slice(1);
  return null;
}

/**
 * Convert an E.164 Australian number (+61XXXXXXXXX) to local format (0XXXXXXXXX).
 * Returns the input unchanged if it is not in E.164 format.
 */
export function toLocalFormat(e164: string): string {
  if (e164.startsWith('+61')) return '0' + e164.slice(3);
  return e164;
}
