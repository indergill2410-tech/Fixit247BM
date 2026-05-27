import { stripe } from './stripe';
import { db } from '@fixit247/database';

export type SubscriptionTier = 'FREE' | 'BASIC' | 'PROFESSIONAL' | 'ELITE';

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, {
  name: string;
  priceMonthlyAud: number;
  stripePriceId: string | null;
  features: string[];
  monthlyBonusCredits: number;
  jobAlertPriority: number;
  visibilityBoost: number;
  badgeLabel: string | null;
}> = {
  FREE: {
    name: 'Free',
    priceMonthlyAud: 0,
    stripePriceId: null,
    features: ['Basic job access', 'Standard matching', 'Email support'],
    monthlyBonusCredits: 0,
    jobAlertPriority: 0,
    visibilityBoost: 0,
    badgeLabel: null,
  },
  BASIC: {
    name: 'Bronze',
    priceMonthlyAud: 49,
    stripePriceId: process.env.STRIPE_PRICE_BASIC ?? null,
    features: ['10% credit discount', '5 bonus credits/month', 'Priority email support', 'Basic analytics'],
    monthlyBonusCredits: 5,
    jobAlertPriority: 1,
    visibilityBoost: 1.1,
    badgeLabel: 'BRONZE',
  },
  PROFESSIONAL: {
    name: 'Silver',
    priceMonthlyAud: 99,
    stripePriceId: process.env.STRIPE_PRICE_PROFESSIONAL ?? null,
    features: ['20% credit discount', '15 bonus credits/month', 'Priority job alerts', 'Full analytics', 'Dedicated support'],
    monthlyBonusCredits: 15,
    jobAlertPriority: 2,
    visibilityBoost: 1.25,
    badgeLabel: 'SILVER',
  },
  ELITE: {
    name: 'Gold',
    priceMonthlyAud: 199,
    stripePriceId: process.env.STRIPE_PRICE_ELITE ?? null,
    features: ['35% credit discount', '40 bonus credits/month', 'Highest dispatch priority', 'Exclusive premium jobs', 'White-glove support', 'Featured listing'],
    monthlyBonusCredits: 40,
    jobAlertPriority: 3,
    visibilityBoost: 1.5,
    badgeLabel: 'GOLD',
  },
};

export const TRIAL_DAYS = 14;

export async function createSubscription(opts: {
  userId: string;
  stripeCustomerId: string;
  tier: SubscriptionTier;
  withTrial?: boolean;
}): Promise<{ subscriptionId: string; clientSecret: string | null }> {
  const plan = SUBSCRIPTION_PLANS[opts.tier];
  if (!plan.stripePriceId) throw new Error('Free tier has no Stripe price');

  const trialDays = opts.withTrial !== false ? TRIAL_DAYS : 0;

  const stripeSubscription = await stripe.subscriptions.create({
    customer: opts.stripeCustomerId,
    items: [{ price: plan.stripePriceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
    metadata: { userId: opts.userId, tier: opts.tier },
    ...(trialDays > 0 && { trial_period_days: trialDays }),
  });

  const invoice = stripeSubscription.latest_invoice as { payment_intent?: { client_secret?: string } } | null;
  const clientSecret = invoice?.payment_intent?.client_secret ?? null;

  await db.subscription.upsert({
    where: { userId: opts.userId },
    create: {
      userId: opts.userId,
      tier: opts.tier as any,
      status: 'ACTIVE',
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: plan.stripePriceId,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    },
    update: {
      tier: opts.tier as any,
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: plan.stripePriceId,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    },
  });

  return { subscriptionId: stripeSubscription.id, clientSecret };
}

export async function cancelSubscription(userId: string): Promise<void> {
  const subscription = await db.subscription.findUnique({ where: { userId } });
  if (!subscription?.stripeSubscriptionId) throw new Error('No active subscription');

  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  await db.subscription.update({
    where: { userId },
    data: { cancelAtPeriodEnd: true },
  });
}

export async function createBillingPortalSession(stripeCustomerId: string, returnUrl: string): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });
  return session.url;
}

export async function getCurrentSubscription(userId: string) {
  return db.subscription.findUnique({ where: { userId } });
}
