import type { Metadata } from 'next';
import { AdminShell } from '@/components/shared/admin-shell';
import { Card, CardContent, Badge, Button } from '@fixit247/ui';
import { db } from '@fixit247/database';
import Link from 'next/link';

export const metadata: Metadata = { title: 'User Management' };
export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  const counts = {
    all: users.length,
    customers: users.filter((u) => u.role === 'CUSTOMER').length,
    tradies: users.filter((u) => u.role === 'TRADIE').length,
    admins: users.filter((u) => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length,
    suspended: users.filter((u) => !u.isActive).length,
  };

  return (
    <AdminShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="mt-1.5 text-sm text-gray-500">
            {counts.all.toLocaleString()} total · {counts.tradies} tradies · {counts.suspended} suspended
          </p>
        </div>
      </div>

      <div className="mb-4 flex gap-2 text-sm">
        {[
          { label: `All (${counts.all})`, role: null },
          { label: `Customers (${counts.customers})`, role: 'CUSTOMER' },
          { label: `Tradies (${counts.tradies})`, role: 'TRADIE' },
          { label: `Admins (${counts.admins})`, role: 'ADMIN' },
        ].map((tab) => (
          <span key={tab.label} className="rounded-lg px-3 py-1.5 font-medium text-gray-600 bg-gray-100">
            {tab.label}
          </span>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">{u.firstName} {u.lastName}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{u.email}</td>
                  <td className="px-4 py-4">
                    <Badge variant={u.role === 'TRADIE' ? 'default' : u.role === 'ADMIN' || u.role === 'SUPER_ADMIN' ? 'destructive' : 'secondary'}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={u.isActive ? 'success' : 'destructive'}>
                      {u.isActive ? 'Active' : 'Suspended'}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {u.createdAt.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-4 py-4">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/users/${u.id}`}>View</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="py-12 text-center text-sm text-gray-400">No users yet</p>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
