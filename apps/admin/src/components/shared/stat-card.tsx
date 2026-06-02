import type { ReactNode } from 'react';
import { Card, CardContent } from '@fixit247/ui';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  highlight?: boolean;
  color?: 'amber' | 'green' | 'red' | 'blue' | 'default';
}

const colorMap = {
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  default: 'bg-gray-50 text-gray-500 dark:bg-white/5 dark:text-gray-400',
};

export function StatCard({ title, value, delta, icon, trend, highlight, color = 'default' }: StatCardProps) {
  return (
    <Card className={highlight ? 'ring-2 ring-amber-400/50 dark:ring-amber-500/30' : ''}>
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
            <p className="mt-1.5 text-2xl font-bold text-foreground leading-none">{value}</p>
            {delta && (
              <div className="mt-2 flex items-center gap-1">
                {trend === 'up' && <TrendingUp size={11} className="text-emerald-500" />}
                {trend === 'down' && <TrendingDown size={11} className="text-red-500" />}
                {trend === 'neutral' && <Minus size={11} className="text-muted-foreground" />}
                <p className={`text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'}`}>{delta}</p>
              </div>
            )}
          </div>
          {icon && (
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorMap[color]}`}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
