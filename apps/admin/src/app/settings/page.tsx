import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminShell } from '@/components/shared/admin-shell';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@fixit247/ui';
import { db } from '@fixit247/database';

export const metadata: Metadata = { title: 'Platform Settings' };
export const dynamic = 'force-dynamic';

const REQUIRED_ENV = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_ADMIN_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'DATABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const;

function maskValue(value: string): string {
  if (value.length <= 12) return 'set';
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export default async function AdminSettingsPage() {
  const [configs, auditLogs] = await Promise.all([
    db.platformConfig.findMany({ orderBy: [{ category: 'asc' }, { key: 'asc' }], take: 100 }),
    db.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { id: true, action: true, resource: true, createdAt: true },
    }),
  ]);

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="mt-1.5 text-sm text-gray-500">Environment readiness, platform config, and recent admin activity.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild><Link href="/payments">Pricing config</Link></Button>
          <Button variant="outline" size="sm" asChild><Link href="/marketplace">Marketplace config</Link></Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Required environment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {REQUIRED_ENV.map((key) => {
              const value = process.env[key];
              return (
                <div key={key} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                  <span className="text-sm font-medium text-gray-700">{key}</span>
                  <Badge variant={value ? 'success' : 'destructive'}>{value ? maskValue(value) : 'missing'}</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent admin activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="rounded-lg border border-gray-100 px-3 py-2">
                <p className="text-sm font-medium text-gray-900">{log.action}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {log.resource ?? 'Platform'} - {log.createdAt.toLocaleDateString('en-AU', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
            {auditLogs.length === 0 && <p className="py-8 text-center text-sm text-gray-400">No admin activity has been recorded yet.</p>}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Platform configuration values</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b bg-gray-50">
                  {['Key', 'Category', 'Value', 'Updated'].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {configs.map((config) => (
                  <tr key={config.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{config.key}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{config.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{config.value}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {config.updatedAt.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {configs.length === 0 && <p className="py-12 text-center text-sm text-gray-400">No platform config values found.</p>}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
