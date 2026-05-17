import { cn } from '@fixit247/ui/src/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
  highlight?: boolean;
}

export function StatCard({ title, value, delta, trend, icon, highlight }: StatCardProps) {
  return (
    <div className={cn(
      'rounded-2xl border p-6 transition-colors',
      highlight ? 'border-brand-500/30 bg-brand-500/10' : 'border-white/8 bg-white/4',
    )}>
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className={cn('text-sm font-medium', highlight ? 'text-brand-300' : 'text-gray-500')}>{title}</p>
          <p className={cn('mt-1 text-2xl font-bold', highlight ? 'text-brand-400' : 'text-white')}>{value}</p>
          {delta && (
            <div className="mt-1.5 flex items-center gap-1">
              {trend === 'up' && <TrendingUp size={12} className="text-green-400" />}
              {trend === 'down' && <TrendingDown size={12} className="text-red-400" />}
              <p className={cn('text-xs', trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-600')}>{delta}</p>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl', highlight ? 'bg-brand-500/20' : 'bg-white/8')}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
