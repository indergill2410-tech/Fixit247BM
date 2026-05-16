import * as React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Skeleton } from './skeleton';

export interface StatCardProps {
  title: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
  valueClassName?: string;
}

export function StatCard({
  title,
  value,
  delta,
  deltaLabel,
  icon,
  loading = false,
  className,
  valueClassName,
}: StatCardProps) {
  if (loading) {
    return (
      <div className={cn('rounded-2xl border border-gray-100 bg-white p-5 shadow-sm', className)}>
        <div className="flex items-start justify-between mb-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-16" />
      </div>
    );
  }

  const trendColor =
    delta === undefined ? ''
    : delta > 0 ? 'text-green-600'
    : delta < 0 ? 'text-red-600'
    : 'text-gray-500';

  const TrendIcon =
    delta === undefined ? null
    : delta > 0 ? TrendingUp
    : delta < 0 ? TrendingDown
    : Minus;

  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100 bg-white p-5 shadow-sm',
        'transition-shadow hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {icon && (
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-blue-50 text-brand-600">
            {icon}
          </div>
        )}
      </div>

      <p className={cn('text-2xl font-bold text-gray-900 tracking-tight', valueClassName)}>
        {value}
      </p>

      {delta !== undefined && (
        <div className={cn('flex items-center gap-1 mt-1.5', trendColor)}>
          {TrendIcon && <TrendIcon className="h-3.5 w-3.5" />}
          <span className="text-xs font-medium">
            {delta > 0 ? '+' : ''}{delta}%
            {deltaLabel && <span className="text-gray-400 font-normal ml-1">{deltaLabel}</span>}
          </span>
        </div>
      )}
    </div>
  );
}
