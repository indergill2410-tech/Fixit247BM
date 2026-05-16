import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Mic, Shield, Clock, Star } from 'lucide-react';
import { EmergencyVoiceButton } from '@/components/features/voice/emergency-voice-button';
import { ConversationalBooking } from '@/components/features/voice/conversational-booking';

export const metadata: Metadata = {
  title: 'Voice Booking | Emergency Tradie Dispatch | Fixit 24/7',
  description: 'Call or speak to our AI assistant to book an emergency tradie in minutes. Available 24/7 across Australia.',
};

export default function VoicePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero */}
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-widest text-red-400">Available 24/7</span>
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            Just <span className="text-red-500">Talk.</span><br />We Handle the Rest.
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Describe your emergency to Ally, our AI assistant. She'll dispatch a verified tradie to you — no forms, no waiting on hold.
          </p>
          <EmergencyVoiceButton />
        </div>
      </section>

      {/* Live AI chat demo */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-md">
          <p className="mb-4 text-center text-sm text-gray-500">Or chat right here — Ally is online now</p>
          <ConversationalBooking compact />
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-800 py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-bold">How Voice Booking Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Mic, title: 'Speak or Chat', desc: "Call 1800-FIXIT-247 or chat with Ally below. Describe what's wrong in plain language." },
              { icon: Clock, title: 'AI Dispatches', desc: 'Ally identifies the trade, confirms your location, and triggers instant dispatch.' },
              { icon: Shield, title: 'Tradie En Route', desc: 'A verified local tradie is notified and heads to you. You get live updates.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-gray-800 p-6 text-center">
                <Icon size={28} className="mx-auto mb-3 text-red-500" />
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
