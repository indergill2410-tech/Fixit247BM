import type { ReactNode } from 'react';
import { cn } from '@fixit247/ui/src/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
  highlight?: boolean;
  color?: 'amber' | 'green' | 'red' | 'blue' | 'default';
}

const ICON_COLORS: Record<NonNullable<StatCardProps['color']>, string> = {
  amber: 'bg-brand-500/15 text-brand-600 dark:text-brand-400',
  green: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  red: 'bg-red-500/15 text-red-600 dark:text-red-400',
  blue: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  default: 'bg-background-alt text-foreground-muted',
};

export function StatCard({ title, value, delta, trend, icon, highlight, color = 'default' }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-card-warm dark:bg-white/[0.03] dark:border-white/[0.07]',
        highlight && 'border-brand-500/40 bg-brand-500/[0.07]',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground-muted">{title}</p>
          <p className={cn('mt-1 text-2xl font-bold', highlight ? 'text-brand-600 dark:text-brand-400' : 'text-foreground')}>
            {value}
          </p>
          {delta && (
            <div className="mt-1.5 flex items-center gap-1">
              {trend === 'up' && <TrendingUp size={12} className="text-emerald-500" />}
              {trend === 'down' && <TrendingDown size={12} className="text-red-500" />}
              {trend === 'neutral' && <Minus size={12} className="text-foreground-muted" />}
              <p
                className={cn(
                  'text-xs',
                  trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-foreground-muted',
                )}
              >
                {delta}
              </p>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', ICON_COLORS[color])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
