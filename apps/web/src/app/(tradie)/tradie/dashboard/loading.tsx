function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-background-alt ${className ?? ''}`} />;
}

function SkeletonStatCard() {
  return (
    <div className="rounded-2xl border border-border bg-background-elevated p-6">
      <SkeletonBlock className="mb-3 h-4 w-24" />
      <SkeletonBlock className="h-8 w-32" />
    </div>
  );
}

function SkeletonListItem() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-background-elevated p-4">
      <SkeletonBlock className="h-10 w-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-3 w-1/2" />
      </div>
      <SkeletonBlock className="h-6 w-16 rounded-full" />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="space-y-8 p-6">
      <SkeletonBlock className="h-8 w-48" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => <SkeletonListItem key={i} />)}
      </div>
    </div>
  );
}
