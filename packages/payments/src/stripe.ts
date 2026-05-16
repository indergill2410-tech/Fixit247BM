import Stripe from 'stripe';

const secretKey = process.env['STRIPE_SECRET_KEY'];
if (!secretKey) throw new Error('Missing STRIPE_SECRET_KEY');

export const stripe = new Stripe(secretKey, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

export const PLATFORM_FEE_PERCENT =
  Number(process.env['STRIPE_PLATFORM_FEE_PERCENT'] ?? 15) / 100;

export function calculateFees(amount: number): {
  platformFee: number;
  tradieAmount: number;
} {
  const platformFee = Math.round(amount * PLATFORM_FEE_PERCENT);
  return { platformFee, tradieAmount: amount - platformFee };
}
