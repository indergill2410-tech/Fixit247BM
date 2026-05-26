'use client';

import { motion } from 'framer-motion';

interface AnimatedEntryProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedEntry({ children, delay = 0, className }: AnimatedEntryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
