'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
      const path = `job-media/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
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
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async (data: JobData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const isEmergency = (data.emergencyScore ?? 0) >= 60;
      const mediaUrls = await uploadImages(data.images);
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.description.slice(0, 80) || 'New job',
          description: data.audioTranscript
            ? `${data.description}\n\nVoice note: ${data.audioTranscript}`
            : data.description,
          category: 'OTHER',
          isEmergency,
          priority: isEmergency ? 'EMERGENCY' : 'STANDARD',
          mediaUrls,
        }),
      });

      if (res.ok) {
        const { job } = await res.json() as { job: { id: string } };
        router.push(`/jobs/${job.id}`);
        return;
      }

      const errData = await res.json().catch(() => ({})) as { error?: string };
      setError(errData.error ?? 'Something went wrong. Please try again.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error — please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {isSubmitting && (
        <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <span className="text-sm">Creating your job…</span>
        </div>
      )}
      <div className={isSubmitting ? 'hidden' : ''}>
        <MultiModalInput onComplete={(d) => { void handleComplete(d); }} />
      </div>
    </div>
  );
}
