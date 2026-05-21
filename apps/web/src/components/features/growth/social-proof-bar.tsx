'use client';

import { useState, useEffect } from 'react';
import { Shield, Star, Zap } from 'lucide-react';

const PROOF_ITEMS = [
  { icon: '🔧', text: 'Mark in Parramatta just booked an emergency plumber', time: '2 min ago' },
  { icon: '⚡', text: 'Sarah in Bondi got an electrician in 45 minutes', time: '5 min ago' },
  { icon: '🔑', text: 'James in Melbourne used emergency locksmith', time: '8 min ago' },
  { icon: '🚿', text: 'Lisa in Brisbane fixed a burst pipe at 2am', time: '12 min ago' },
  { icon: '❄️', text: 'Tom in Sydney got AC fixed same day', time: '15 min ago' },
  { icon: '🏠', text: 'Emma in Perth booked roof repair after storm', time: '18 min ago' },
  { icon: '🔧', text: 'David in Chatswood had a blocked drain cleared', time: '22 min ago' },
  { icon: '⚡', text: 'Amy in Gold Coast fixed power outage in 1 hour', time: '25 min ago' },
];

export function SocialProofBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((i) => (i + 1) % PROOF_ITEMS.length);
        setVisible(true);
      }, 300);
    }, 4000);
    return () => { clearInterval(interval); };
  }, []);

  const item = PROOF_ITEMS[currentIndex];

  return (
    <div className={`flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2.5 shadow-sm text-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <span className="text-base">{item.icon}</span>
      <span className="text-gray-700 flex-1">{item.text}</span>
      <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
    </div>
  );
}

export function TrustStatsBar() {
  const STATS = [
    { icon: Shield, label: 'Verified Tradies', value: '5,000+' },
    { icon: Star, label: 'Avg Rating', value: '4.9★' },
    { icon: Zap, label: 'Avg Response', value: '< 60 min' },
    { icon: Shield, label: 'Jobs Completed', value: '48,200+' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {STATS.map(({ icon: Icon, label, value }) => (
        <div key={label} className="rounded-2xl border border-gray-200 bg-white p-4 text-center">
          <Icon size={20} className="mx-auto mb-1 text-brand-600" />
          <p className="text-xl font-extrabold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
