'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Plan {
  name: string;
  price: number;
  period: string;
  highlight: boolean;
  Icon: LucideIcon;
  tagline: string;
  features: string[];
  cta: string;
  href: string;
}

interface FixitPlusPlansProps {
  plans: Plan[];
}

export function FixitPlusPlans({ plans }: FixitPlusPlansProps) {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="plans" className="bg-background-alt px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">Choose your cover</h2>
          <p className="mt-3 text-foreground-muted">Flat monthly fee. No surprise bills. No per-call charges.</p>

          {/* Monthly / Annual toggle */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-border bg-background p-1.5">
            <button
              onClick={() => { setAnnual(false); }}
              className={`rounded-xl px-5 py-2 text-sm font-semibold transition-colors ${
                !annual
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => { setAnnual(true); }}
              className={`flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-colors ${
                annual
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              Annual
              <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-gray-900">
                2 months free
              </span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => {
            const displayPrice = annual ? Math.round(plan.price * 10) : plan.price;
            const displayPeriod = annual ? 'year' : 'month';
            const href = annual
              ? plan.href.includes('?') ? `${plan.href}&billing=annual` : `${plan.href}?billing=annual`
              : plan.href;

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-3xl border p-8 ${
                  plan.highlight
                    ? 'border-brand-500/50 bg-brand-500/8 shadow-lg shadow-brand-500/10'
                    : 'border-border bg-background-elevated'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-4 py-1 text-xs font-bold text-gray-900">
                    Most popular
                  </div>
                )}
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-brand-500">
                  <plan.Icon size={22} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground-subtle">{plan.tagline}</p>
                <h3 className="mt-1 text-xl font-bold text-foreground">{plan.name}</h3>
                <div className="my-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">${displayPrice}</span>
                  <span className="text-foreground-subtle">/{displayPeriod}</span>
                  {annual && (
                    <span className="ml-2 text-xs text-foreground-subtle line-through">${plan.price * 12}/yr</span>
                  )}
                </div>
                {annual && (
                  <p className="mb-3 -mt-1 text-xs font-medium text-brand-600 dark:text-brand-400">
                    Save ${plan.price * 2} per year
                  </p>
                )}
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground-secondary">
                      <CheckCircle size={16} className="mt-0.5 shrink-0 text-brand-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={href}
                  className={`block rounded-xl px-6 py-3.5 text-center text-sm font-bold transition-colors ${
                    plan.highlight
                      ? 'bg-brand-500 text-gray-900 hover:bg-brand-400 shadow-lg shadow-brand-500/20'
                      : 'border border-border text-foreground hover:bg-background-alt'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-sm text-foreground-subtle">
          All plans include a 14-day free trial. No credit card required to start.
        </p>
      </div>
    </section>
  );
}
