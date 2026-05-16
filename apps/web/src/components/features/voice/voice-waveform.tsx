'use client';

import { useEffect, useRef } from 'react';

interface Props {
  isActive: boolean;
  color?: string;
}

export function VoiceWaveform({ isActive, color = '#ef4444' }: Props) {
  const bars = 20;

  return (
    <div className="flex items-center justify-center gap-0.5 h-10">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="w-1 rounded-full transition-all duration-75"
          style={{
            backgroundColor: color,
            height: isActive ? `${Math.random() * 32 + 8}px` : '4px',
            animationDelay: `${i * 50}ms`,
            animation: isActive ? `waveform 0.8s ease-in-out infinite alternate ${i * 40}ms` : 'none',
          }}
        />
      ))}
      <style>{`
        @keyframes waveform {
          0% { height: 4px; }
          100% { height: ${Math.random() * 32 + 12}px; }
        }
      `}</style>
    </div>
  );
}
