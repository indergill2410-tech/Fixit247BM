import type { Metadata } from 'next';
import { AdminShell } from '@/components/shared/admin-shell';
import { Card, CardContent, Badge, Button } from '@fixit247/ui';
import Link from 'next/link';

export const metadata: Metadata = { title: 'User Management' };

export default function UsersPage() {
  return (
    <AdminShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="mt-1.5 text-sm text-gray-500">Manage all platform users</p>
        </div>
        <div className="flex gap-2">
          <input placeholder="Search users…" className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
      </div>
      <div className="mb-4 flex gap-2">
        {['All Users', 'Customers', 'Tradies', 'Admins', 'Suspended'].map((tab) => (
          <button key={tab} className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 first:bg-brand-50 first:text-brand-700">
            {tab}
          </button>
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
              {MOCK_USERS.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{u.email}</td>
                  <td className="px-4 py-4"><Badge variant={u.role === 'TRADIE' ? 'default' : 'secondary'}>{u.role}</Badge></td>
                  <td className="px-4 py-4"><Badge variant={u.active ? 'success' : 'destructive'}>{u.active ? 'Active' : 'Suspended'}</Badge></td>
                  <td className="px-4 py-4 text-sm text-gray-500">{u.joined}</td>
                  <td className="px-4 py-4"><Button size="sm" variant="outline" asChild><Link href={`/users/${u.id}`}>View</Link></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AdminShell>
  );
}

const MOCK_USERS = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'CUSTOMER', active: true, joined: 'May 10' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'TRADIE', active: true, joined: 'May 8' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'CUSTOMER', active: false, joined: 'May 5' },
];
