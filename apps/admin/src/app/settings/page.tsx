'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/shared/admin-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@fixit247/ui';
import { Settings, DollarSign, ToggleLeft, Package } from 'lucide-react';
import { toast } from 'sonner';

// ── Types ─────────────────────────────────────────────────────────────────────

interface PricingConfig {
  platform_fee_percent: string;
  emergency_dispatch_fee_aud: string;
  credit_cost_simple_standard: string;
  credit_cost_medium_standard: string;
  credit_cost_complex_standard: string;
  surge_enabled: string;
  referral_bonus_credits: string;
  [key: string]: string;
}

// ── Feature flags ─────────────────────────────────────────────────────────────
// Persisted in PlatformConfig as `flag_<key>` = 'true' | 'false' (default ON).

const FEATURE_FLAGS = [
  { key: 'emergency_dispatch', label: 'Emergency Dispatch', description: 'Allow customers to raise emergency jobs with priority routing' },
  { key: 'ai_job_analysis', label: 'AI Job Analysis', description: 'Automatically analyse and categorise new job listings with AI' },
  { key: 'voice_calls', label: 'Voice Calls (Twilio)', description: 'Enable in-app voice calls between customers and tradies' },
  { key: 'fixit_plus', label: 'Fixit Plus Subscriptions', description: 'Allow tradies to upgrade to paid subscription tiers' },
  { key: 'fraud_detection', label: 'Fraud Detection', description: 'Run automated fraud scoring on new users and payments' },
];

// ── Subscription tiers (static) ───────────────────────────────────────────────

const SUBSCRIPTION_TIERS = [
  { name: 'FREE', price: 0, features: 3, tradieLimit: 5 },
  { name: 'BASIC', price: 49, features: 8, tradieLimit: 20 },
  { name: 'PROFESSIONAL', price: 99, features: 14, tradieLimit: 50 },
  { name: 'ELITE', price: 199, features: 20, tradieLimit: 0 },
];

const TIER_BADGE: Record<string, string> = {
  FREE: 'bg-gray-100 text-gray-600',
  BASIC: 'bg-blue-100 text-blue-700',
  PROFESSIONAL: 'bg-amber-100 text-amber-700',
  ELITE: 'bg-purple-100 text-purple-700',
};

// ── Editable fee row ──────────────────────────────────────────────────────────

function FeeRow({ label, fieldKey, value, onSave }: {
  label: string;
  fieldKey: string;
  value: string;
  onSave: (key: string, val: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(value);
  const [saving, setSaving] = useState(false);

  // keep in sync if parent reloads
  useEffect(() => { setEditing(value); }, [value]);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(fieldKey, editing);
      toast.success(`${label} saved`);
    } catch {
      toast.error(`Failed to save ${label}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0">
      <span className="text-sm font-medium text-gray-700 min-w-[200px]">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          step="0.01"
          min="0"
          value={editing}
          onChange={(e) => setEditing(e.target.value)}
          className="w-28 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSave}
          disabled={saving || editing === value}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}

// ── Feature flag toggle row ────────────────────────────────────────────────────

function FlagRow({ label, description, enabled, onToggle }: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: (next: boolean) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);

  async function handleClick() {
    setSaving(true);
    try {
      await onToggle(!enabled);
      toast.success(`${label} ${!enabled ? 'enabled' : 'disabled'}`);
    } catch {
      toast.error(`Failed to update ${label}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        onClick={handleClick}
        disabled={saving}
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${enabled ? 'left-5 -translate-x-0.5' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [config, setConfig] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/pricing');
      if (res.ok) {
        const json = await res.json() as { config: PricingConfig };
        setConfig(json.config);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  async function handleSave(key: string, value: string) {
    const res = await fetch('/api/admin/pricing', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates: { [key]: value } }),
    });
    const result = await res.json() as { error?: string };
    if (!res.ok) throw new Error(result.error ?? 'Failed');
    // Update local state
    setConfig((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  const FEE_FIELDS: { label: string; key: keyof PricingConfig }[] = [
    { label: 'Platform Fee (%)', key: 'platform_fee_percent' },
    { label: 'Emergency Dispatch Fee (AUD)', key: 'emergency_dispatch_fee_aud' },
    { label: 'Credit Cost — Simple Job', key: 'credit_cost_simple_standard' },
    { label: 'Credit Cost — Medium Job', key: 'credit_cost_medium_standard' },
    { label: 'Credit Cost — Complex Job', key: 'credit_cost_complex_standard' },
    { label: 'Referral Bonus Credits', key: 'referral_bonus_credits' },
  ];

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Settings size={22} />
          Platform Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">Configure fees, feature flags, and subscription tiers</p>
      </div>

      <div className="space-y-8">
        {/* ── Section 1: Platform Fees ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <DollarSign size={16} />
              Platform Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading || !config ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
                ))}
              </div>
            ) : (
              <div>
                {FEE_FIELDS.map((f) => (
                  <FeeRow
                    key={f.key}
                    label={f.label}
                    fieldKey={String(f.key)}
                    value={config[f.key] ?? '0'}
                    onSave={handleSave}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Section 2: Feature Flags ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <ToggleLeft size={16} />
              Feature Flags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {FEATURE_FLAGS.map((flag) => {
                // Default ON: only an explicit 'false' disables a flag.
                const enabled = (config?.[`flag_${flag.key}`] ?? 'true') !== 'false';
                return (
                  <FlagRow
                    key={flag.key}
                    label={flag.label}
                    description={flag.description}
                    enabled={enabled}
                    onToggle={(next) => handleSave(`flag_${flag.key}`, next ? 'true' : 'false')}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Section 3: Subscription Tiers ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Package size={16} />
              Subscription Tiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="pb-3 pr-6">Tier</th>
                    <th className="pb-3 pr-6">Monthly Price</th>
                    <th className="pb-3 pr-6">Features</th>
                    <th className="pb-3">Tradie Limit</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {SUBSCRIPTION_TIERS.map((tier) => (
                    <tr key={tier.name} className="hover:bg-gray-50">
                      <td className="py-3 pr-6">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TIER_BADGE[tier.name] ?? 'bg-gray-100 text-gray-600'}`}>
                          {tier.name}
                        </span>
                      </td>
                      <td className="py-3 pr-6 font-semibold text-gray-900">
                        {tier.price === 0 ? 'Free' : `$${tier.price}/mo`}
                      </td>
                      <td className="py-3 pr-6 text-gray-600">{tier.features} features</td>
                      <td className="py-3 text-gray-600">
                        {tier.tradieLimit === 0 ? 'Unlimited' : tier.tradieLimit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
