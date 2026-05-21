'use client';

import { useState } from 'react';
import { Phone, Mic, X } from 'lucide-react';
import { ConversationalBooking } from './conversational-booking';

interface Props {
  phoneNumber?: string;
}

export function EmergencyVoiceButton({ phoneNumber = '1800348498' }: Props) {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 md:items-center">
        <div className="w-full max-w-md">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-white">AI Emergency Assistant</p>
            <button onClick={() => { setShowChat(false); }} className="rounded-full bg-white/20 p-1.5 text-white hover:bg-white/30">
              <X size={16} />
            </button>
          </div>
          <ConversationalBooking compact />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={`tel:${phoneNumber}`}
        className="flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-red-600 shadow-lg hover:bg-red-50 transition-colors"
      >
        <Phone size={22} />
        Call Now — 24/7
      </a>
      <button
        onClick={() => { setShowChat(true); }}
        className="flex items-center justify-center gap-2 rounded-2xl border-2 border-white px-8 py-4 text-lg font-bold text-white hover:bg-red-700 transition-colors"
      >
        <Mic size={22} />
        Chat with AI
      </button>
    </div>
  );
}
