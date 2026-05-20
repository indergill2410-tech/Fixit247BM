import type { Metadata } from 'next';
import { AdminShell } from '@/components/shared/admin-shell';
import { Card, CardContent, Badge, Button } from '@fixit247/ui';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Tradie Verifications' };

export default function VerificationsPage() {
  return (
    <AdminShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tradie Verifications</h1>
          <p className="mt-1.5 text-sm text-gray-500">Review and approve tradie identity, licence, and insurance documents</p>
        </div>
        <Badge variant="warning" className="text-sm">14 pending review</Badge>
      </div>

      <div className="mb-4 flex gap-2">
        {['All', 'Pending', 'In Review', 'Approved', 'Rejected'].map((tab) => (
          <button key={tab} className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 first:bg-brand-50 first:text-brand-700 transition-colors">
            {tab}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Tradie', 'Trade', 'Documents', 'Risk', 'Submitted', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_DATA.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{row.name}</p>
                      <p className="text-xs text-gray-500">{row.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{row.trade}</td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1">
                      {row.docs.map((d) => <Badge key={d} variant="default" className="text-xs">{d}</Badge>)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={row.risk === 'HIGH' ? 'destructive' : row.risk === 'MEDIUM' ? 'warning' : 'success'}>
                      {row.risk}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">{row.submitted}</td>
                  <td className="px-4 py-4">
                    <Badge variant={row.status === 'PENDING' ? 'warning' : row.status === 'APPROVED' ? 'success' : 'default'}>
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <Button size="sm" asChild><Link href={`/verifications/${row.id}`}>Review</Link></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AdminShell>
  );
}

const MOCK_DATA = [
  { id: '1', name: 'James Robertson', email: 'james@example.com', trade: 'Electrician', docs: ['ID', 'Licence', 'Insurance'], risk: 'LOW', submitted: 'May 16, 2h ago', status: 'PENDING' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', trade: 'Plumber', docs: ['ID', 'Licence'], risk: 'LOW', submitted: 'May 16, 5h ago', status: 'PENDING' },
  { id: '3', name: 'Mike Patel', email: 'mike@example.com', trade: 'HVAC', docs: ['ID'], risk: 'HIGH', submitted: 'May 15, 8h ago', status: 'PENDING' },
  { id: '4', name: 'Emma Wilson', email: 'emma@example.com', trade: 'Carpentry', docs: ['ID', 'Insurance'], risk: 'MEDIUM', submitted: 'May 15, 1d ago', status: 'IN_REVIEW' },
];
