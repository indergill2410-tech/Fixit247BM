'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

type ProgressVariant = 'default' | 'success' | 'warning' | 'brand';
type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps {
  value: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
  className?: string;
  label?: string;
}

const variantStyles: Record<ProgressVariant, string> = {
  default: 'bg-gray-600',
  success: 'bg-green-600',
  warning: 'bg-amber-500',
  brand: 'bg-brand-600',
};

const trackStyles: Record<ProgressVariant, string> = {
  default: 'bg-gray-200',
  success: 'bg-green-100',
  warning: 'bg-amber-100',
  brand: 'bg-blue-100',
};

const sizeStyles: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const labelSizeStyles: Record<ProgressSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function Progress({
  value,
  variant = 'brand',
  size = 'md',
  showLabel = false,
  className,
  label,
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className={cn('flex justify-between mb-1.5', labelSizeStyles[size])}>
          {label && <span className="font-medium text-gray-700">{label}</span>}
          {showLabel && (
            <span className="text-gray-500 ml-auto">{clamped}%</span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full overflow-hidden',
          trackStyles[variant],
          sizeStyles[size],
        )}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className={cn('h-full rounded-full', variantStyles[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
