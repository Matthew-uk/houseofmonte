export function SkeletonCard() {
  return (
    <div className="rounded-card border border-border-subtle bg-bg-card p-6 animate-pulse">
      <div className="h-3 w-20 rounded bg-bg-card-elevated" />
      <div className="mt-4 h-8 w-16 rounded bg-bg-card-elevated" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 border-b border-border-subtle px-4 py-4 animate-pulse">
      <div className="h-4 w-4 rounded bg-bg-card-elevated" />
      <div className="h-3 w-40 rounded bg-bg-card-elevated" />
      <div className="ml-auto h-3 w-24 rounded bg-bg-card-elevated" />
      <div className="h-3 w-12 rounded bg-bg-card-elevated" />
    </div>
  );
}
