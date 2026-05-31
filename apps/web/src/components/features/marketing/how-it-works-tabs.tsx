'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, HardHat, CheckCircle } from 'lucide-react';

const HOMEOWNER_STEPS = [
  {
    n: '01',
    icon: '🔑',
    title: 'Post your job',
    desc: 'Describe what needs fixing, set your urgency, and upload photos. Completely free and takes under 2 minutes.',
  },
  {
    n: '02',
    icon: '👥',
    title: 'Get matched',
    desc: 'Verified local tradies with the right skills and availability see your job. You\'ll hear back fast.',
  },
  {
    n: '03',
    icon: '✅',
    title: 'Choose who suits you',
    desc: 'Review profiles, ratings, and quotes. Message directly before committing. You stay in control.',
  },
  {
    n: '04',
    icon: '💬',
    title: 'Get it sorted',
    desc: 'Chat in-app, agree on timing, and get the repair done. Pay only when you\'re satisfied.',
    highlighted: true,
    badge: 'DONE',
  },
];

const TRADIE_STEPS = [
  {
    n: '01',
    icon: '📋',
    title: 'Create your profile',
    desc: 'Upload your licence, insurance, and trade details. Verification takes under 24 hours.',
  },
  {
    n: '02',
    icon: '📡',
    title: 'Receive job alerts',
    desc: 'Get notified instantly when homeowners in your area post jobs that match your trade and availability.',
  },
  {
    n: '03',
    icon: '🤝',
    title: 'Quote & connect',
    desc: 'Send your quote, chat with the customer, and agree on timing — all in the app.',
  },
  {
    n: '04',
    icon: '💰',
    title: 'Get paid fast',
    desc: 'Complete the job, get paid via secure escrow. $111 in free credits every month for your first 6 months.',
    highlighted: true,
    badge: 'PAID',
  },
];

export function HowItWorksTabs() {
  const [tab, setTab] = useState<'homeowner' | 'tradie'>('homeowner');
  const steps = tab === 'homeowner' ? HOMEOWNER_STEPS : TRADIE_STEPS;

  return (
    <div>
      {/* Toggle */}
      <div className="mb-10 flex justify-center">
        <div className="flex rounded-2xl border border-border bg-background-alt p-1">
          <button
            onClick={() => { setTab('homeowner'); }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              tab === 'homeowner'
                ? 'bg-brand-500 text-gray-900 shadow-sm'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            <Home size={15} />
            Homeowners
          </button>
          <button
            onClick={() => { setTab('tradie'); }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              tab === 'tradie'
                ? 'bg-brand-500 text-gray-900 shadow-sm'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            <HardHat size={15} />
            Tradies
          </button>
        </div>
      </div>

      {/* Step cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step.n}
            className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
              step.highlighted
                ? 'border-brand-500/40 bg-brand-500/10 shadow-brand-sm'
                : 'border-border bg-card shadow-card-warm'
            }`}
          >
            {/* Step number */}
            <span className="absolute right-5 top-5 text-3xl font-extrabold text-foreground/[0.07]">
              {step.n}
            </span>

            {/* Icon */}
            <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-xl ${
              step.highlighted
                ? 'bg-brand-500/20'
                : 'bg-background-elevated'
            }`}>
              {step.icon}
            </div>

            <h3 className="mb-2 text-sm font-bold text-foreground">{step.title}</h3>
            <p className="flex-1 text-xs leading-relaxed text-foreground-muted">{step.desc}</p>

            {step.badge && (
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-brand-700">
                <CheckCircle size={13} />
                {step.badge}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA row */}
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href={tab === 'homeowner' ? '/jobs/new' : '/join-as-tradie'}
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-7 py-3.5 text-sm font-bold text-gray-900 transition-colors hover:bg-brand-400"
        >
          {tab === 'homeowner' ? "Post your first job — it's free" : "Join as a tradie — it's free"}
          <span>›</span>
        </Link>
        <Link
          href="/how-it-works"
          className="flex items-center gap-2 rounded-xl border border-border px-7 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-background-elevated"
        >
          See the full process
          <span>›</span>
        </Link>
      </div>
    </div>
  );
}
