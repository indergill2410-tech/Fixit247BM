'use client';

import * as React from 'react';
import { DashboardShell, PageHeader } from '@/components/shared/dashboard-shell';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@fixit247/ui';
import { FileText, Upload, CheckCircle, Clock, AlertTriangle, X, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@fixit247/ui/src/lib/utils';

type DocType = 'TRADE_LICENCE' | 'INSURANCE' | 'POLICE_CHECK' | 'IDENTITY' | 'OTHER';
type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'UNVERIFIED' | 'SUSPENDED';

interface TradieDocument {
  id: string;
  type: DocType;
  fileName: string;
  fileUrl: string;
  status: VerificationStatus;
  reviewNotes?: string | null;
  expiresAt?: string | null;
  uploadedAt: string;
  verifiedAt?: string | null;
}

const DOC_CONFIG: Record<DocType, { label: string; description: string; required: boolean; icon: string }> = {
  TRADE_LICENCE: {
    label: 'Trade Licence',
    description: 'Your current government-issued trade licence',
    required: true,
    icon: '🪪',
  },
  INSURANCE: {
    label: 'Public Liability Insurance',
    description: 'Minimum $5M cover required to work on platform',
    required: true,
    icon: '🛡️',
  },
  POLICE_CHECK: {
    label: 'Police Check',
    description: 'National police background check (within 12 months)',
    required: false,
    icon: '🔍',
  },
  IDENTITY: {
    label: 'Identity Document',
    description: 'Passport or driver\'s licence for identity verification',
    required: true,
    icon: '📋',
  },
  OTHER: {
    label: 'Other Document',
    description: 'Any additional certifications or documents',
    required: false,
    icon: '📄',
  },
};

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'emergency'; icon: React.ReactNode }> = {
  VERIFIED: { label: 'Verified', variant: 'success', icon: <CheckCircle size={14} /> },
  PENDING: { label: 'Pending Review', variant: 'warning', icon: <Clock size={14} /> },
  UNVERIFIED: { label: 'Not Submitted', variant: 'default', icon: <AlertTriangle size={14} /> },
  REJECTED: { label: 'Rejected', variant: 'emergency', icon: <X size={14} /> },
  SUSPENDED: { label: 'Suspended', variant: 'emergency', icon: <X size={14} /> },
};

export default function TradieDocumentsPage() {
  const [documents, setDocuments] = React.useState<TradieDocument[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState<DocType | null>(null);
  const [expiryDates, setExpiryDates] = React.useState<Partial<Record<DocType, string>>>({});

  React.useEffect(() => {
    fetch('/api/tradie/documents')
      .then((r) => r.json())
      .then((data) => {
        setDocuments(data.documents ?? []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const getDocForType = (type: DocType) => documents.find((d) => d.type === type);

  const handleUpload = async (type: DocType, file: File) => {
    setUploading(type);
    try {
      // In production, upload to S3/Supabase Storage first, then save URL
      // For now we simulate with a placeholder URL
      const fakeUrl = `https://storage.fixit247.com.au/docs/${Date.now()}-${file.name}`;

      const res = await fetch('/api/tradie/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          fileName: file.name,
          fileUrl: fakeUrl,
          fileSize: file.size,
          mimeType: file.type,
          expiresAt: expiryDates[type] ? new Date(expiryDates[type]).toISOString() : undefined,
        }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setDocuments((prev) => {
        const existing = prev.find((d) => d.type === type);
        if (existing) return prev.map((d) => d.type === type ? data.document : d);
        return [...prev, data.document];
      });
      toast.success(`${DOC_CONFIG[type].label} uploaded. Under review.`);
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(null);
    }
  };

  const handleFileChange = (type: DocType, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(type, file);
    e.target.value = '';
  };

  const requiredTypes: DocType[] = ['TRADE_LICENCE', 'INSURANCE', 'IDENTITY'];
  const optionalTypes: DocType[] = ['POLICE_CHECK', 'OTHER'];

  const verifiedCount = requiredTypes.filter((t) => getDocForType(t)?.status === 'VERIFIED').length;
  const pendingCount = documents.filter((d) => d.status === 'PENDING').length;

  return (
    <DashboardShell role="TRADIE">
      <PageHeader
        title="Documents"
        description="Upload and manage your verification documents"
        badge={{ label: `${verifiedCount}/${requiredTypes.length} verified`, variant: verifiedCount === requiredTypes.length ? 'success' : 'warning' }}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-brand-400" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status banner */}
          {verifiedCount < requiredTypes.length && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
              <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-300">Complete your verification to unlock full access</p>
                <p className="mt-0.5 text-xs text-amber-400/70">
                  Submit required documents to be eligible for job leads. Our team reviews documents within 1 business day.
                </p>
              </div>
            </div>
          )}

          {pendingCount > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4">
              <Clock size={18} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-300">
                {pendingCount} document{pendingCount > 1 ? 's are' : ' is'} currently under review. We&apos;ll notify you within 1 business day.
              </p>
            </div>
          )}

          {/* Required documents */}
          <Card>
            <CardHeader><CardTitle>Required Documents</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {requiredTypes.map((type) => {
                const config = DOC_CONFIG[type];
                const doc = getDocForType(type);
                const statusCfg = STATUS_CONFIG[doc?.status ?? 'UNVERIFIED'];
                const isUploading = uploading === type;

                return (
                  <div key={type} className={cn(
                    'rounded-xl border p-4 transition-colors',
                    doc?.status === 'VERIFIED' ? 'border-green-500/20 bg-green-500/5' :
                    doc?.status === 'PENDING' ? 'border-blue-500/20 bg-blue-500/5' :
                    doc?.status === 'REJECTED' ? 'border-red-500/20 bg-red-500/5' :
                    'border-white/8 bg-white/2',
                  )}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{config.icon}</span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-white">{config.label}</p>
                            <Badge variant="warning" className="text-xs">Required</Badge>
                            <Badge variant={statusCfg.variant} className="flex items-center gap-1 text-xs">
                              {statusCfg.icon}
                              {statusCfg.label}
                            </Badge>
                          </div>
                          <p className="mt-0.5 text-xs text-gray-500">{config.description}</p>
                          {doc && (
                            <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-500">
                              <span>{doc.fileName}</span>
                              {doc.expiresAt && (
                                <span className={cn(
                                  new Date(doc.expiresAt) < new Date() ? 'text-red-400' : 'text-gray-500'
                                )}>
                                  Expires {new Date(doc.expiresAt).toLocaleDateString('en-AU')}
                                </span>
                              )}
                              <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-0.5 text-brand-400 hover:underline">
                                View <ExternalLink size={10} />
                              </a>
                            </div>
                          )}
                          {doc?.reviewNotes && (
                            <p className="mt-1 text-xs text-red-400">Note: {doc.reviewNotes}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {(type === 'TRADE_LICENCE' || type === 'INSURANCE') && (
                          <div>
                            <label className="text-xs text-gray-500">Expiry date</label>
                            <input
                              type="date"
                              value={expiryDates[type] ?? ''}
                              onChange={(e) => setExpiryDates((p) => ({ ...p, [type]: e.target.value }))}
                              className="mt-0.5 block rounded-lg border border-white/8 bg-white/4 px-2 py-1 text-xs text-white [color-scheme:dark]"
                            />
                          </div>
                        )}
                        <label className={cn(
                          'flex items-center gap-1.5 cursor-pointer rounded-xl border px-3 py-2 text-xs font-medium transition-all',
                          isUploading
                            ? 'border-white/8 text-gray-500 cursor-not-allowed'
                            : doc?.status === 'VERIFIED'
                            ? 'border-white/8 text-gray-400 hover:border-white/20 hover:text-white'
                            : 'border-brand-500/40 text-brand-400 hover:border-brand-500 hover:bg-brand-500/10',
                        )}>
                          {isUploading ? (
                            <><Loader2 size={12} className="animate-spin" /> Uploading...</>
                          ) : (
                            <><Upload size={12} /> {doc ? 'Re-upload' : 'Upload'}</>
                          )}
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            disabled={isUploading}
                            onChange={(e) => handleFileChange(type, e)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Optional documents */}
          <Card>
            <CardHeader><CardTitle>Optional Documents</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {optionalTypes.map((type) => {
                const config = DOC_CONFIG[type];
                const doc = getDocForType(type);
                const statusCfg = STATUS_CONFIG[doc?.status ?? 'UNVERIFIED'];
                const isUploading = uploading === type;

                return (
                  <div key={type} className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/2 p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{config.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">{config.label}</p>
                          {doc && <Badge variant={statusCfg.variant} className="text-xs">{statusCfg.label}</Badge>}
                        </div>
                        <p className="text-xs text-gray-500">{config.description}</p>
                        {doc && (
                          <p className="mt-0.5 text-xs text-gray-600">{doc.fileName}</p>
                        )}
                      </div>
                    </div>
                    <label className={cn(
                      'flex items-center gap-1.5 cursor-pointer rounded-xl border px-3 py-2 text-xs font-medium transition-all shrink-0',
                      isUploading ? 'border-white/8 text-gray-500 cursor-not-allowed' : 'border-white/8 text-gray-400 hover:border-white/20 hover:text-white',
                    )}>
                      {isUploading ? (
                        <><Loader2 size={12} className="animate-spin" /> Uploading...</>
                      ) : (
                        <><Upload size={12} /> {doc ? 'Re-upload' : 'Upload'}</>
                      )}
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e) => handleFileChange(type, e)}
                      />
                    </label>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="rounded-2xl border border-white/8 bg-white/2 p-4">
            <div className="flex items-start gap-3">
              <FileText size={16} className="text-gray-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white mb-1">Document Guidelines</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Accepted formats: PDF, JPG, PNG (max 10MB)</li>
                  <li>• Documents must be current and not expired</li>
                  <li>• All documents are reviewed within 1 business day</li>
                  <li>• Questions? Email <a href="mailto:docs@fixit247.com.au" className="text-brand-400 hover:underline">docs@fixit247.com.au</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
