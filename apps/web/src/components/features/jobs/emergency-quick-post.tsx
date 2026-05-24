'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, Loader2 } from 'lucide-react';
import { cn } from '@fixit247/ui/src/lib/utils';

const EMERGENCY_TRADES = [
  { id: 'PLUMBING', label: 'Burst pipe / Flooding', icon: '🔧', description: 'Leaks, burst pipes, blocked drains' },
  { id: 'ELECTRICAL', label: 'No power / Sparking', icon: '⚡', description: 'Power outage, tripping RCD, sparks' },
  { id: 'LOCKSMITH', label: 'Locked out', icon: '🔐', description: 'Can\'t get in, lost keys, broken lock' },
  { id: 'GLAZING', label: 'Broken window / Glass', icon: '🪟', description: 'Smashed glass, security breach' },
  { id: 'HVAC', label: 'No heating / Cooling', icon: '❄️', description: 'AC failure, gas heater fault' },
  { id: 'ROOFING', label: 'Roof damage / Leak', icon: '🏠', description: 'Storm damage, active roof leak' },
  { id: 'PEST_CONTROL', label: 'Urgent pest issue', icon: '🐛', description: 'Wasp nest, snake, severe infestation' },
  { id: 'APPLIANCE_REPAIR', label: 'Appliance failure', icon: '🔌', description: 'Fridge down, washing machine flood' },
];

export function EmergencyQuickPost() {
  const router = useRouter();
  const [selected, setSelected] = React.useState<string | null>(null);
  const [isPosting, setIsPosting] = React.useState(false);
  const [description, setDescription] = React.useState('');

  const handleDispatch = async () => {
    if (!selected) return;
    setIsPosting(true);

    try {
      const trade = EMERGENCY_TRADES.find((t) => t.id === selected);
      if (!trade) return;
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `EMERGENCY: ${trade.label}`,
          description: description || trade.description,
          category: selected,
          priority: 'EMERGENCY',
          isEmergency: true,
          complexity: 'MEDIUM',
          mediaUrls: [],
        }),
      });

      if (res.ok) {
        const { job } = await res.json() as { job: { id: string } };
        router.push(`/jobs/${job.id}?dispatch=emergency`);
      }
    } catch {
      setIsPosting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
            <Zap size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Emergency Dispatch</h1>
            <p className="text-sm text-red-100">Available 24/7 — average response in 18 minutes</p>
          </div>
        </div>
      </div>

      {/* Trade selection */}
      <div className="mb-6">
        <p className="mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">What's the emergency?</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {EMERGENCY_TRADES.map((trade) => (
            <motion.button
              key={trade.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelected(trade.id); }}
              className={cn(
                'flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all',
                selected === trade.id
                  ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
                  : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50/50'
              )}
            >
              <span className="text-2xl shrink-0">{trade.icon}</span>
              <div className="min-w-0">
                <p className={cn('font-semibold', selected === trade.id ? 'text-red-700' : 'text-gray-900')}>
                  {trade.label}
                </p>
                <p className="text-xs text-gray-500">{trade.description}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Optional description */}
      <div className="mb-6">
        <p className="mb-2 text-sm font-medium text-gray-700">Any extra details? (optional)</p>
        <textarea
          value={description}
          onChange={(e) => { setDescription(e.target.value); }}
          placeholder="e.g. Water is spraying from under the sink, kitchen flooding..."
          rows={2}
          className="w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm placeholder-gray-400 focus:border-red-400 focus:outline-none"
        />
      </div>

      {/* Dispatch button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleDispatch}
        disabled={!selected || isPosting}
        className={cn(
          'flex w-full items-center justify-center gap-3 rounded-2xl py-5 text-lg font-bold text-white transition-all',
          selected && !isPosting
            ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200'
            : 'bg-gray-300 cursor-not-allowed'
        )}
      >
        {isPosting ? (
          <>
            <Loader2 size={22} className="animate-spin" />
            Dispatching nearest tradie…
          </>
        ) : (
          <>
            <Zap size={22} />
            Get Emergency Help Now
          </>
        )}
      </motion.button>

      <p className="mt-4 text-center text-xs text-gray-400">
        By requesting help you agree to our emergency callout fees. Tradies typically arrive within 15–45 minutes.
      </p>
    </div>
  );
}
