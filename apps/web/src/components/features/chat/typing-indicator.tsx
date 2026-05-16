'use client';

import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  users: { userId: string; userName: string }[];
}

export function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) return null;

  const label = users.length === 1
    ? `${users[0]!.userName || 'Someone'} is typing`
    : `${users.length} people are typing`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="flex items-center gap-2 px-4 py-1"
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
        <div className="flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-gray-400"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
      <span className="text-xs text-gray-400">{label}…</span>
    </motion.div>
  );
}
