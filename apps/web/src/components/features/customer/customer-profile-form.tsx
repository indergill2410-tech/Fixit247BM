'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Button, Input } from '@fixit247/ui';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  suburb: string;
  postcode: string;
  state: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  notifyBySms: boolean;
  notifyByEmail: boolean;
  notifyByPush: boolean;
}

const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

export function CustomerProfileForm({ initial }: { initial: ProfileData }) {
  const [form, setForm] = React.useState<ProfileData>(initial);
  const [saving, setSaving] = React.useState(false);

  function update<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/customer/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone || null,
          suburb: form.suburb || null,
          postcode: form.postcode || null,
          state: form.state || null,
          emergencyContactName: form.emergencyContactName || null,
          emergencyContactPhone: form.emergencyContactPhone || null,
          notifyBySms: form.notifyBySms,
          notifyByEmail: form.notifyByEmail,
          notifyByPush: form.notifyByPush,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      toast.success('Profile updated');
    } catch {
      toast.error('Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const fieldClass = 'border-white/15 bg-white/5 text-white placeholder:text-white/30';
  const labelClass = 'mb-1.5 block text-sm font-medium text-white/90';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact details */}
      <section className="rounded-2xl border border-white/8 bg-white/4 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Contact details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="firstName">First name</label>
            <Input id="firstName" className={fieldClass} value={form.firstName} onChange={(e) => update('firstName', e.target.value)} required />
          </div>
          <div>
            <label className={labelClass} htmlFor="lastName">Last name</label>
            <Input id="lastName" className={fieldClass} value={form.lastName} onChange={(e) => update('lastName', e.target.value)} required />
          </div>
          <div>
            <label className={labelClass} htmlFor="email">Email</label>
            <Input id="email" className={`${fieldClass} opacity-60`} value={form.email} disabled readOnly />
            <p className="mt-1 text-xs text-gray-600">Email can&apos;t be changed here.</p>
          </div>
          <div>
            <label className={labelClass} htmlFor="phone">Phone</label>
            <Input id="phone" type="tel" className={fieldClass} value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="04xx xxx xxx" />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="rounded-2xl border border-white/8 bg-white/4 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Location</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label className={labelClass} htmlFor="suburb">Suburb</label>
            <Input id="suburb" className={fieldClass} value={form.suburb} onChange={(e) => update('suburb', e.target.value)} />
          </div>
          <div>
            <label className={labelClass} htmlFor="state">State</label>
            <select
              id="state"
              className="h-10 w-full rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              value={form.state}
              onChange={(e) => update('state', e.target.value)}
            >
              <option value="" className="bg-gray-900">—</option>
              {AU_STATES.map((s) => (
                <option key={s} value={s} className="bg-gray-900">{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="postcode">Postcode</label>
            <Input id="postcode" className={fieldClass} value={form.postcode} onChange={(e) => update('postcode', e.target.value)} maxLength={4} />
          </div>
        </div>
      </section>

      {/* Emergency contact */}
      <section className="rounded-2xl border border-white/8 bg-white/4 p-6">
        <h2 className="mb-1 text-lg font-semibold text-white">Emergency contact</h2>
        <p className="mb-4 text-sm text-gray-500">Used for after-hours emergency jobs.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="ecName">Name</label>
            <Input id="ecName" className={fieldClass} value={form.emergencyContactName} onChange={(e) => update('emergencyContactName', e.target.value)} />
          </div>
          <div>
            <label className={labelClass} htmlFor="ecPhone">Phone</label>
            <Input id="ecPhone" type="tel" className={fieldClass} value={form.emergencyContactPhone} onChange={(e) => update('emergencyContactPhone', e.target.value)} />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-2xl border border-white/8 bg-white/4 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Notifications</h2>
        <div className="space-y-3">
          {([
            ['notifyBySms', 'SMS', 'Job updates and tradie messages via text'],
            ['notifyByEmail', 'Email', 'Receipts, summaries and updates by email'],
            ['notifyByPush', 'Push', 'Real-time alerts in your browser'],
          ] as const).map(([key, label, desc]) => (
            <label key={key} className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/8 p-3">
              <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(e) => update(key, e.target.checked)}
                className="h-5 w-5 shrink-0 accent-brand-500"
              />
            </label>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" loading={saving} size="lg" className="bg-brand-500 font-semibold text-gray-900 hover:bg-brand-400">
          Save changes
        </Button>
      </div>
    </form>
  );
}
