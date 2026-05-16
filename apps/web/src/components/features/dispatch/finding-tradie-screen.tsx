'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useDispatchFeedback } from '@/lib/socket/hooks';

interface FindingTradieScreenProps {
  jobId: string;
  isEmergency?: boolean;
}

const PHASE_CONFIG = {
  SEARCHING: {
    icon: Search,
    color: 'text-brand-500',
    bg: 'bg-brand-50',
    label: 'Searching for tradies',
    pulse: true,
  },
  BATCH_SENT: {
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    label: 'Notifying nearby tradies',
    pulse: true,
  },
  RE_DISPATCHING: {
    icon: RefreshCw,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    label: 'Expanding search',
    pulse: true,
  },
  FOUND: {
    icon: CheckCircle2,
    color: 'text-green-500',
    bg: 'bg-green-50',
    label: 'Tradie found!',
    pulse: false,
  },
  NO_TRADIES_AVAILABLE: {
    icon: AlertTriangle,
    color: 'text-red-500',
    bg: 'bg-red-50',
    label: 'No tradies available',
    pulse: false,
  },
};

export function FindingTradieScreen({ jobId, isEmergency = false }: FindingTradieScreenProps) {
  const { phase, message, batchNumber } = useDispatchFeedback(jobId);
  const config = PHASE_CONFIG[phase];
  const Icon = config.icon;

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-8 text-center ${isEmergency ? 'border-red-200 bg-red-50' : 'border-brand-100 bg-brand-50'}`}>
      {/* Animated rings (searching state) */}
      {config.pulse && (
        <>
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border ${isEmergency ? 'border-red-300' : 'border-brand-300'}`}
              animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
              style={{ width: 80, height: 80 }}
            />
          ))}
        </>
      )}

      {/* Main icon */}
      <div className="relative flex justify-center">
        <motion.div
          className={`flex h-20 w-20 items-center justify-center rounded-full ${config.bg}`}
          animate={config.pulse ? { scale: [1, 1.05, 1] } : { scale: 1 }}
          transition={{ duration: 1.5, repeat: config.pulse ? Infinity : 0 }}
        >
          <Icon size={36} className={config.color} />
        </motion.div>
      </div>

      {/* Labels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-6"
        >
          <h3 className="text-lg font-bold text-gray-900">{config.label}</h3>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
          {batchNumber > 0 && phase !== 'FOUND' && (
            <p className="mt-1 text-xs text-gray-400">Search batch #{batchNumber}</p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Emergency badge */}
      {isEmergency && (
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          Priority emergency dispatch active
        </div>
      )}

      {phase === 'SEARCHING' && (
        <p className="mt-4 text-xs text-gray-400">
          Typical response time: {isEmergency ? '3–7 minutes' : '10–15 minutes'}
        </p>
      )}

      {phase === 'NO_TRADIES_AVAILABLE' && (
        <div className="mt-4 rounded-xl bg-white p-4 text-sm text-gray-600">
          <p className="font-medium">No tradies available right now.</p>
          <p className="mt-1 text-xs text-gray-400">We'll keep searching. You'll be notified as soon as someone is available.</p>
        </div>
      )}
    </div>
  );
}
