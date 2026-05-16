import type { Metadata } from 'next';
import { AdminShell } from '@/components/shared/admin-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@fixit247/ui';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Admin Overview' };

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Platform Overview</h1>
        <p className="mt-1.5 text-sm text-gray-500">Real-time platform metrics and operations</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value="1,284" delta="+48 this week" trend="up" icon="👥" />
        <StatCard title="Active Jobs" value="127" delta="32 emergency" icon="🔧" />
        <StatCard title="Revenue (MTD)" value="$92,400" delta="+18% vs last month" trend="up" icon="💰" />
        <StatCard title="Pending Verifications" value="14" delta="Avg 22h wait" icon="🔒" highlight />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Verification queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Verification queue</CardTitle>
            <Badge variant="warning">14 pending</Badge>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {MOCK_VERIFICATIONS.map((v) => (
                <div key={v.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">{v.name}</p>
                    <p className="text-xs text-gray-500">{v.trade} · submitted {v.submitted}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={v.risk === 'HIGH' ? 'destructive' : 'default'}>{v.risk}</Badge>
                    <Button size="sm" asChild><Link href={`/verifications/${v.id}`}>Review</Link></Button>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/verifications" className="mt-2 block text-center text-sm text-brand-600 hover:underline">View all →</Link>
          </CardContent>
        </Card>

        {/* Recent disputes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active disputes</CardTitle>
            <Badge variant="destructive">3 open</Badge>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {MOCK_DISPUTES.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">{d.title}</p>
                    <p className="text-xs text-gray-500">${d.amount} · {d.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">{d.status}</Badge>
                    <Button size="sm" variant="outline" asChild><Link href={`/disputes/${d.id}`}>View</Link></Button>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/disputes" className="mt-2 block text-center text-sm text-brand-600 hover:underline">View all →</Link>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}

const MOCK_VERIFICATIONS = [
  { id: '1', name: 'James Robertson', trade: 'Electrician', submitted: '2h ago', risk: 'LOW' },
  { id: '2', name: 'Sarah Chen', trade: 'Plumber', submitted: '5h ago', risk: 'LOW' },
  { id: '3', name: 'Mike Patel', trade: 'HVAC', submitted: '8h ago', risk: 'HIGH' },
];

const MOCK_DISPUTES = [
  { id: '1', title: 'Job #2847 — incomplete work', amount: '1,200', date: 'May 14', status: 'OPEN' },
  { id: '2', title: 'Job #2891 — no-show', amount: '350', date: 'May 15', status: 'UNDER_REVIEW' },
];
