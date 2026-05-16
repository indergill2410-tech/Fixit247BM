'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/shared/admin-shell';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@fixit247/ui';
import { Save, RefreshCw, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface MarketplaceConfig {
  platformFeePercent: number;
  emergencyMultiplier: number;
  surgeEnabled: boolean;
  maxActiveJobsPerTradie: number;
  leadPricingMultiplier: number;
  minLeadPrice: number;
  maxLeadPrice: number;
  disputeWindowDays: number;
  escrowReleaseDays: number;
}

interface FieldDef {
  key: keyof MarketplaceConfig;
  label: string;
  type: 'number' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
}

const FIELDS: FieldDef[] = [
  { key: 'platformFeePercent', label: 'Platform Fee %', type: 'number', min: 0, max: 50, step: 0.5 },
  { key: 'emergencyMultiplier', label: 'Emergency Multiplier', type: 'number', min: 1, max: 5, step: 0.1 },
  { key: 'surgeEnabled', label: 'Surge Pricing Enabled', type: 'toggle' },
  { key: 'maxActiveJobsPerTradie', label: 'Max Active Jobs per Tradie', type: 'number', min: 1, max: 20, step: 1 },
  { key: 'leadPricingMultiplier', label: 'Lead Pricing Multiplier', type: 'number', min: 0.5, max: 3.0, step: 0.1 },
  { key: 'minLeadPrice', label: 'Min Lead Price ($)', type: 'number', min: 0, step: 1 },
  { key: 'maxLeadPrice', label: 'Max Lead Price ($)', type: 'number', min: 0, step: 1 },
  { key: 'disputeWindowDays', label: 'Dispute Window (days)', type: 'number', min: 1, max: 30, step: 1 },
  { key: 'escrowReleaseDays', label: 'Escrow Release (days)', type: 'number', min: 1, max: 14, step: 1 },
];

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3_600_000)}h ago`;
}

export default function MarketplacePage() {
  const [config, setConfig] = useState<MarketplaceConfig | null>(null);
  const [draft, setDraft] = useState<MarketplaceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [confirmPending, setConfirmPending] = useState(false);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/marketplace');
      if (!res.ok) throw new Error('Failed to load config');
      const json = await res.json();
      setConfig(json.config);
      setDraft(json.config);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load marketplace config');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  function handleChange(key: keyof MarketplaceConfig, value: string | boolean) {
    setDraft((prev) => {
      if (!prev) return prev;
      const field = FIELDS.find((f) => f.key === key);
      if (field?.type === 'toggle') {
        return { ...prev, [key]: value as boolean };
      }
      return { ...prev, [key]: Number(value) };
    });
  }

  function handleSaveClick() {
    setConfirmPending(true);
  }

  async function handleConfirmedSave() {
    setConfirmPending(false);
    if (!draft) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/marketplace', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? 'Save failed');
      }
      setConfig(draft);
      setLastSaved(new Date());
      toast.success('Marketplace config saved');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const isDirty = JSON.stringify(config) !== JSON.stringify(draft);

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace Control</h1>
          <p className="mt-1 text-sm text-gray-500">Configure platform pricing and operational limits</p>
        </div>
        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={12} />
              Last saved {timeAgo(lastSaved)}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={fetchConfig} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </Button>
          <Button
            size="sm"
            onClick={handleSaveClick}
            disabled={saving || !isDirty || loading}
          >
            <Save size={14} />
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Confirm dialog */}
      {confirmPending && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50 px-5 py-4">
          <div>
            <p className="font-semibold text-orange-800">Confirm changes</p>
            <p className="text-sm text-orange-600">
              These settings affect live platform behaviour. Are you sure you want to save?
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setConfirmPending(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirmedSave}>
              Yes, Save
            </Button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {FIELDS.map((field) => (
                <div
                  key={field.key}
                  className="flex items-center justify-between py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{field.label}</p>
                    <p className="text-xs text-gray-400">{field.key}</p>
                  </div>
                  {field.type === 'toggle' ? (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!!draft?.[field.key]}
                      onClick={() =>
                        handleChange(field.key, !draft?.[field.key])
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                        draft?.[field.key] ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                          draft?.[field.key] ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  ) : (
                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step ?? 1}
                      value={draft ? String(draft[field.key]) : ''}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-28 rounded-lg border border-gray-300 px-3 py-1.5 text-right text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
