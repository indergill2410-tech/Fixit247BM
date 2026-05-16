'use client';

import * as React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  ShieldCheck,
  Star,
  Crown,
  Zap,
  Award,
  Clock,
  Briefcase,
  CheckCircle2,
  BarChart2,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

// ─── Trust Score Meter ─────────────────────────────────────────────────────

export interface TrustScoreMeterProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score < 40) return '#dc2626'; // red-600
  if (score < 70) return '#d97706'; // amber-600
  return '#16a34a'; // green-600
}

function getScoreLabel(score: number): string {
  if (score < 40) return 'Low';
  if (score < 70) return 'Good';
  if (score < 90) return 'Great';
  return 'Excellent';
}

const sizeConfig = {
  sm: { size: 80, strokeWidth: 6, fontSize: 18, labelSize: 10 },
  md: { size: 120, strokeWidth: 8, fontSize: 28, labelSize: 12 },
  lg: { size: 160, strokeWidth: 10, fontSize: 40, labelSize: 14 },
};

export function TrustScoreMeter({
  score,
  size = 'md',
  showLabel = true,
  className,
}: TrustScoreMeterProps) {
  const clamped = Math.min(100, Math.max(0, score));
  const config = sizeConfig[size];
  const color = getScoreColor(clamped);

  const r = (config.size - config.strokeWidth) / 2;
  // Arc from -220deg to 40deg = 260deg sweep
  const sweepDeg = 260;
  const circumference = 2 * Math.PI * r;
  const arcLength = (sweepDeg / 360) * circumference;
  const filledLength = (clamped / 100) * arcLength;
  const gap = circumference - arcLength;

  // Animated count-up
  const displayScore = useMotionValue(0);
  const rounded = useTransform(displayScore, (v) => Math.round(v));

  React.useEffect(() => {
    const ctrl = animate(displayScore, clamped, { duration: 1.2, ease: 'easeOut' });
    return ctrl.stop;
  }, [clamped, displayScore]);

  const cx = config.size / 2;
  const cy = config.size / 2;
  const startAngle = 140; // degrees from top (clockwise)

  const polarToCartesian = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const start = polarToCartesian(startAngle);
  const end = polarToCartesian(startAngle + sweepDeg);
  const largeArc = sweepDeg > 180 ? 1 : 0;
  const trackPath = `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div style={{ width: config.size, height: config.size }} className="relative">
        <svg
          width={config.size}
          height={config.size}
          viewBox={`0 0 ${config.size} ${config.size}`}
          className="rotate-0"
        >
          {/* Track */}
          <path
            d={trackPath}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
          />
          {/* Filled arc */}
          <motion.path
            d={trackPath}
            fill="none"
            stroke={color}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: arcLength - filledLength }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-bold tabular-nums"
            style={{ fontSize: config.fontSize, color, lineHeight: 1 }}
          >
            {rounded}
          </motion.span>
          {showLabel && (
            <span
              className="font-medium text-gray-500 mt-0.5"
              style={{ fontSize: config.labelSize }}
            >
              {getScoreLabel(clamped)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Trust Badge ───────────────────────────────────────────────────────────

export type TrustBadgeVariant =
  | 'VERIFIED'
  | 'PREMIUM'
  | 'ELITE'
  | 'EMERGENCY_SPECIALIST'
  | 'TOP_RATED';

export interface TrustBadgeProps {
  variant: TrustBadgeVariant;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const badgeConfig: Record<
  TrustBadgeVariant,
  { label: string; icon: React.ElementType; bg: string; text: string; border: string }
> = {
  VERIFIED: {
    label: 'Verified',
    icon: ShieldCheck,
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  PREMIUM: {
    label: 'Premium',
    icon: Star,
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  ELITE: {
    label: 'Elite',
    icon: Crown,
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  EMERGENCY_SPECIALIST: {
    label: 'Emergency',
    icon: Zap,
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  TOP_RATED: {
    label: 'Top Rated',
    icon: Award,
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
};

const badgeSizeStyles = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  default: 'px-2.5 py-1 text-xs gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-2',
};

const iconSizeStyles = {
  sm: 'h-3 w-3',
  default: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
};

export function TrustBadge({ variant, size = 'default', className }: TrustBadgeProps) {
  const config = badgeConfig[variant];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold',
        config.bg,
        config.text,
        config.border,
        badgeSizeStyles[size],
        className,
      )}
    >
      <Icon className={iconSizeStyles[size]} />
      {config.label}
    </span>
  );
}

// ─── Trust Stats ───────────────────────────────────────────────────────────

export interface TrustStatsProps {
  rating: number;
  reviewCount?: number;
  jobsCompleted: number;
  responseTimeMinutes: number;
  completionRate: number;
  className?: string;
}

interface StatItemProps {
  icon: React.ElementType;
  value: string;
  label: string;
}

function StatItem({ icon: Icon, value, label }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-0.5 min-w-0">
      <Icon className="h-4 w-4 text-gray-400 shrink-0" />
      <span className="text-sm font-bold text-gray-900 tabular-nums">{value}</span>
      <span className="text-xs text-gray-500 text-center leading-tight">{label}</span>
    </div>
  );
}

export function TrustStats({
  rating,
  reviewCount,
  jobsCompleted,
  responseTimeMinutes,
  completionRate,
  className,
}: TrustStatsProps) {
  const ratingStr = rating.toFixed(1);
  const responseStr =
    responseTimeMinutes < 60
      ? `${responseTimeMinutes}m`
      : `${(responseTimeMinutes / 60).toFixed(1)}h`;

  return (
    <div
      className={cn(
        'flex items-start justify-around gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm',
        className,
      )}
    >
      <StatItem
        icon={Star}
        value={`${ratingStr}${reviewCount !== undefined ? ` (${reviewCount})` : ''}`}
        label="Rating"
      />
      <div className="w-px self-stretch bg-gray-100" />
      <StatItem icon={Briefcase} value={jobsCompleted.toLocaleString()} label="Jobs" />
      <div className="w-px self-stretch bg-gray-100" />
      <StatItem icon={Clock} value={responseStr} label="Response" />
      <div className="w-px self-stretch bg-gray-100" />
      <StatItem icon={BarChart2} value={`${completionRate}%`} label="Completion" />
    </div>
  );
}

// ─── Verification Badge (avatar overlay) ──────────────────────────────────

export interface VerificationBadgeProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

const vbSizes = {
  sm: 'h-4 w-4',
  default: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function VerificationBadge({ className, size = 'default' }: VerificationBadgeProps) {
  return (
    <span
      className={cn(
        'flex items-center justify-center rounded-full bg-brand-600 text-white shadow-md ring-2 ring-white',
        vbSizes[size],
        className,
      )}
      aria-label="Verified"
    >
      <CheckCircle2 className="h-3/4 w-3/4" />
    </span>
  );
}
