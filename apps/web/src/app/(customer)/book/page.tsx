import type { Metadata } from 'next';
import { requireOnboarding } from '@/lib/auth/session';
import { DashboardShell } from '@/components/shared/dashboard-shell';
import { ConversationalBooking } from '@/components/features/voice/conversational-booking';
import { MultiModalInput } from '@/components/features/voice/multi-modal-input';
import { Mic, Camera, MessageSquare } from 'lucide-react';

export const metadata: Metadata = { title: 'Book a Tradie' };

export default async function BookPage() {
  await requireOnboarding();

  return (
    <DashboardShell role="CUSTOMER">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Book a Tradie</h1>
        <p className="mt-1 text-sm text-gray-400">Describe your issue — our AI will match you with the right tradie instantly.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* AI Chat booking */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <MessageSquare size={16} className="text-brand-400" />
            <h2 className="font-semibold text-white">Chat with Ally (AI)</h2>
          </div>
          <ConversationalBooking />
        </div>

        {/* Multi-modal input */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Camera size={16} className="text-brand-400" />
            <h2 className="font-semibold text-white">Describe + Upload Photos</h2>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
            <MultiModalInput onComplete={(data) => {
              // Client-side redirect would happen here — this is a server component
              // The MultiModalInput handles its own submission
              console.log('Job data:', data);
            }} />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
