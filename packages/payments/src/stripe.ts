import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const secretKey = process.env['STRIPE_SECRET_KEY'];
    if (!secretKey) throw new Error('Missing STRIPE_SECRET_KEY');
    _stripe = new Stripe(secretKey, {
      apiVersion: '2024-06-20',
      typescript: true,
    });
  }
  return _stripe;
}

// Keep named export for backwards compat — lazy getter
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as never)[prop as keyof Stripe];
  },
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
