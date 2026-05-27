'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { MultiModalInput } from './multi-modal-input';

interface JobData {
  description: string;
  images: File[];
  audioTranscript?: string;
  emergencyScore?: number;
}

async function uploadImages(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];
  const supabase = getSupabaseBrowserClient();
  const urls: string[] = [];
  await Promise.all(
    files.map(async (file) => {
      const path = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const { error } = await supabase.storage.from('job-media').upload(path, file, { upsert: false });
      if (error) throw new Error(`Image upload failed: ${error.message}`);
      const { data } = supabase.storage.from('job-media').getPublicUrl(path);
      urls.push(data.publicUrl);
    }),
  );
  return urls;
}

export function MultiModalBookingClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleComplete(data: JobData) {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const emergencyScore = data.emergencyScore ?? 0;
      const isEmergency = emergencyScore >= 60;
      const priority = isEmergency ? 'EMERGENCY' : emergencyScore >= 30 ? 'URGENT' : 'STANDARD';

      const rawTitle = data.description.split(/[.\n]/)[0]?.trim() ?? data.description;
      const title = rawTitle.length < 5
        ? data.description.slice(0, 80).trim()
        : rawTitle.slice(0, 80);

      const fullDescription = data.audioTranscript
        ? `${data.description}\n\n[Voice note]: ${data.audioTranscript}`
        : data.description;

      const mediaUrls = await uploadImages(data.images);

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: fullDescription,
          category: 'GENERAL_MAINTENANCE',
          isEmergency,
          priority,
          complexity: 'MEDIUM',
          mediaUrls,
          aiUrgencyScore: emergencyScore || undefined,
        }),
      });

      if (res.ok) {
        const { job } = await res.json() as { job: { id: string } };
        router.push(`/jobs/${job.id}`);
        return;
      }

      const errData = await res.json().catch(() => ({})) as { error?: string };
      setSubmitError(errData.error ?? 'Something went wrong. Please try again.');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Network error — please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
      {isSubmitting && (
        <div className="flex items-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 mb-4">
          <Loader2 size={16} className="animate-spin text-brand-400" />
          <p className="text-sm font-medium text-brand-300">Posting your job…</p>
        </div>
      )}
      {submitError && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {submitError}
        </div>
      )}
      <div className={isSubmitting ? 'hidden' : ''}>
        <MultiModalInput onComplete={(d) => { void handleComplete(d); }} />
      </div>
    </div>
  );
}
