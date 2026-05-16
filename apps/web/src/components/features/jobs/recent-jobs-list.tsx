import { Card, CardContent, CardHeader, CardTitle, Badge } from '@fixit247/ui';

const MOCK_JOBS = [
  { id: '1', title: 'Burst pipe in kitchen', category: 'PLUMBING', status: 'IN_PROGRESS', tradie: 'Mark T.', date: '2026-05-15' },
  { id: '2', title: 'No hot water system', category: 'PLUMBING', status: 'COMPLETED', tradie: 'Sarah J.', date: '2026-05-10' },
  { id: '3', title: 'Switchboard tripping', category: 'ELECTRICAL', status: 'OPEN', tradie: null, date: '2026-05-16' },
] as const;

const STATUS_VARIANT: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'emergency'> = {
  OPEN: 'default',
  ASSIGNED: 'warning',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'destructive',
  EMERGENCY: 'emergency',
};

export function RecentJobsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {MOCK_JOBS.map((job) => (
            <div key={job.id} className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-muted-foreground">
                  {job.category} · {job.tradie ?? 'Finding tradie…'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{job.date}</span>
                <Badge variant={STATUS_VARIANT[job.status] ?? 'default'}>
                  {job.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
