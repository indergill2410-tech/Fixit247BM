import { Card, CardContent } from '@fixit247/ui';

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: string;
  icon?: string;
}

export function StatCard({ title, value, delta, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
            {delta && <p className="mt-1 text-xs text-muted-foreground">{delta}</p>}
          </div>
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-xl">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
