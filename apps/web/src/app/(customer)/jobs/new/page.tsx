import type { Metadata } from 'next';
import { requireOnboarding } from '@/lib/auth/session';
import { DashboardShell, PageHeader } from '@/components/shared/dashboard-shell';
import { JobPostingForm } from '@/components/features/jobs/job-posting-form';

export const metadata: Metadata = { title: 'Post a Job' };

export default async function NewJobPage() {
  await requireOnboarding();
  return (
    <DashboardShell role="CUSTOMER">
      <PageHeader
        title="Post a Job"
        description="Describe the problem and our AI will match you with the right tradie instantly"
      />
      <JobPostingForm />
    </DashboardShell>
  );
}
