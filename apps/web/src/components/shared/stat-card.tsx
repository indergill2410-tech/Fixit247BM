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
      'rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md',
      highlight ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white',
    )}>
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className={cn('text-sm font-medium', highlight ? 'text-red-600' : 'text-gray-500')}>{title}</p>
          <p className={cn('mt-1 text-2xl font-bold', highlight ? 'text-red-700' : 'text-gray-900')}>{value}</p>
          {delta && (
            <div className="mt-1.5 flex items-center gap-1">
              {trend === 'up' && <TrendingUp size={12} className="text-green-500" />}
              {trend === 'down' && <TrendingDown size={12} className="text-red-500" />}
              <p className={cn('text-xs', trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-400')}>{delta}</p>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl', highlight ? 'bg-red-100' : 'bg-gray-100')}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
