import crypto from 'crypto';

export function generateReferralCode(prefix: string = 'FX'): string {
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}${rand}`;
}

export function isValidReferralCode(code: string): boolean {
  return /^[A-Z]{2}[A-F0-9]{8}$/.test(code);
}
