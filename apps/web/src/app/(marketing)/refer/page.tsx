'use client';

import { useState, useEffect } from 'react';
import { Copy, Share2, CheckCircle, Gift, Users, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface ReferralData {
  code: string;
  link: string;
  stats: { sent: number; rewarded: number; totalEarned: number };
}

export default function ReferPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [notAuthed, setNotAuthed] = useState(false);

  useEffect(() => {
    fetch('/api/referral/code')
      .then((r) => {
        if (r.status === 401) { setNotAuthed(true); return null; }
        return r.json();
      })
      .then((d) => d && setData(d))
      .catch(() => setNotAuthed(true))
      .finally(() => setLoading(false));
  }, []);

  function copyLink() {
    if (!data) return;
    navigator.clipboard.writeText(data.link);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  }

  function shareWhatsApp() {
    if (!data) return;
    const msg = encodeURIComponent(`I use Fixit 24/7 for emergency home repairs — verified tradies dispatched in under 60 min! Sign up with my link and get $20 off your first job: ${data.link}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }

  function shareSMS() {
    if (!data) return;
    const msg = encodeURIComponent(`Get $20 off your first job on Fixit 24/7! ${data.link}`);
    window.open(`sms:?body=${msg}`, '_blank');
  }

  function nativeShare() {
    if (!data || !navigator.share) return;
    navigator.share({ title: 'Fixit 24/7 — $20 off your first job', url: data.link });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero */}
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mb-6 text-6xl">🎁</div>
        <h1 className="text-4xl font-extrabold mb-4">Give $20, Get $20</h1>
        <p className="text-lg text-gray-300 mb-2">Invite friends to Fixit 24/7.</p>
        <p className="text-gray-400">They get $20 off their first job. You get $20 in credits when they book.</p>
      </div>

      {/* Referral box */}
      <div className="mx-auto max-w-xl px-4 pb-16">
        {loading ? (
          <div className="rounded-2xl bg-white/10 p-8 text-center animate-pulse h-40" />
        ) : notAuthed ? (
          <div className="rounded-2xl bg-white/10 p-8 text-center">
            <p className="mb-4 text-gray-300">Sign in to get your personal referral link</p>
            <Link href="/login" className="inline-block rounded-xl bg-brand-600 px-6 py-3 font-bold hover:bg-brand-700 transition-colors">
              Sign In
            </Link>
          </div>
        ) : data ? (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Referred', value: data.stats.sent, icon: Users },
                { label: 'Converted', value: data.stats.rewarded, icon: CheckCircle },
                { label: 'Earned', value: `$${data.stats.totalEarned}`, icon: DollarSign },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-2xl bg-white/10 p-4 text-center">
                  <Icon size={20} className="mx-auto mb-1 text-brand-400" />
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              ))}
            </div>

            {/* Link box */}
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="mb-2 text-sm text-gray-400">Your referral link</p>
              <div className="flex items-center gap-2 rounded-xl bg-black/30 px-4 py-3">
                <p className="flex-1 truncate text-sm font-mono text-brand-300">{data.link}</p>
                <button onClick={copyLink} className="shrink-0 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold hover:bg-brand-700 transition-colors">
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-gray-500">Code: <span className="font-bold text-white">{data.code}</span></p>
            </div>

            {/* Share buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button onClick={shareWhatsApp} className="flex flex-col items-center gap-1.5 rounded-2xl bg-green-600 py-4 text-sm font-semibold hover:bg-green-700 transition-colors">
                <span className="text-2xl">💬</span> WhatsApp
              </button>
              <button onClick={shareSMS} className="flex flex-col items-center gap-1.5 rounded-2xl bg-brand-500 py-4 text-sm font-semibold hover:bg-brand-600 transition-colors">
                <span className="text-2xl">📱</span> SMS
              </button>
              <button onClick={nativeShare} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/10 py-4 text-sm font-semibold hover:bg-white/20 transition-colors">
                <Share2 size={24} /> More
              </button>
            </div>
          </div>
        ) : null}

        {/* How it works */}
        <div className="mt-10 rounded-2xl bg-white/5 p-6">
          <h2 className="mb-5 text-center text-lg font-bold">How It Works</h2>
          <div className="space-y-4">
            {[
              { step: '1', text: 'Share your unique referral link with friends or family' },
              { step: '2', text: 'They sign up and book their first job on Fixit 24/7' },
              { step: '3', text: 'You both get $20 in credits automatically' },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold">{s.step}</div>
                <p className="text-sm text-gray-300">{s.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-gray-500">Credits expire after 12 months. Max 50 referrals per account. One reward per new user.</p>
        </div>
      </div>
    </div>
  );
}
