import type { Metadata } from 'next';
import { Calendar } from 'lucide-react';

export const metadata: Metadata = { title: 'Availability | Fixit247 Tradie' };

export default function TradieAvailabilityPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400">
          <Calendar size={20} />
        </div>
        <h1 className="text-2xl font-bold text-white">Availability</h1>
      </div>
      <div className="rounded-2xl border border-white/8 bg-white/4 p-8 text-center">
        <p className="text-gray-500 mb-4">Set your working hours and availability windows so customers know when you can be dispatched.</p>
        <p className="text-sm text-gray-600">Full availability calendar coming soon. Contact <a href="mailto:hello@fixit247.com.au" className="text-brand-400 hover:underline">hello@fixit247.com.au</a> to update your hours.</p>
      </div>
    </div>
  );
}
