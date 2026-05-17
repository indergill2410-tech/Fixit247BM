import type { Metadata } from 'next';
import { FileText } from 'lucide-react';

export const metadata: Metadata = { title: 'Documents | Fixit247 Tradie' };

export default function TradieDocumentsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400">
          <FileText size={20} />
        </div>
        <h1 className="text-2xl font-bold text-white">Documents</h1>
      </div>
      <div className="space-y-4">
        {[
          { title: 'Trade Licence', desc: 'Upload your current trade licence for verification', status: 'pending' },
          { title: 'Public Liability Insurance', desc: 'Minimum $5M cover required to work on the platform', status: 'pending' },
          { title: 'Police Check', desc: 'National police background check certificate', status: 'pending' },
        ].map((doc) => (
          <div key={doc.title} className="rounded-2xl border border-white/8 bg-white/4 p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-white text-sm">{doc.title}</p>
              <p className="text-xs text-gray-500 mt-1">{doc.desc}</p>
            </div>
            <span className="shrink-0 rounded-full bg-brand-500/15 px-3 py-1 text-xs font-bold text-brand-400">
              {doc.status}
            </span>
          </div>
        ))}
        <p className="text-center text-sm text-gray-600 pt-4">
          Send documents to <a href="mailto:docs@fixit247.com.au" className="text-brand-400 hover:underline">docs@fixit247.com.au</a> for manual review.
        </p>
      </div>
    </div>
  );
}
