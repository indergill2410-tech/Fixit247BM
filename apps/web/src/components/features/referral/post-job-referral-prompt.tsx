'use client';

import { useState } from 'react';
import { Gift, X, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  referralCode: string;
  referralLink: string;
  onDismiss: () => void;
}

export function PostJobReferralPrompt({ referralCode, referralLink, onDismiss }: Props) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    void navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => { setCopied(false); }, 2000);
  }

  function shareWhatsApp() {
    const msg = encodeURIComponent(`Just used Fixit 24/7 — amazing emergency tradie service! Get $20 off your first job: ${referralLink}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }

  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 mb-3">
          <Gift size={20} className="text-brand-600" />
          <p className="font-semibold text-brand-900">Know someone who needs a tradie?</p>
        </div>
        <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Share Fixit 24/7 with a friend and you&apos;ll both get <strong>$20 credit</strong> when they book their first job.
      </p>
      <div className="flex gap-2">
        <button
          onClick={copyLink}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
        >
          {copied ? <><CheckCircle size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
        </button>
        <button
          onClick={shareWhatsApp}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
        >
          💬 WhatsApp
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-gray-400">Your code: <span className="font-mono font-bold">{referralCode}</span></p>
    </div>
  );
}
