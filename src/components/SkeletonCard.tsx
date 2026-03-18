export function SkeletonCard() {
  return (
    <div aria-busy="true" role="status" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <span className="sr-only">読み込み中</span>
      <div className="h-40 bg-slate-200 skeleton-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-slate-200 rounded-md w-1/4 skeleton-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded-md w-full skeleton-pulse" />
          <div className="h-4 bg-slate-200 rounded-md w-4/5 skeleton-pulse" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 bg-slate-200 rounded-md w-full skeleton-pulse" />
          <div className="h-3 bg-slate-200 rounded-md w-3/4 skeleton-pulse" />
        </div>
        <div className="flex justify-between items-center pt-1">
          <div className="h-3 bg-slate-200 rounded-md w-1/4 skeleton-pulse" />
          <div className="h-3 bg-slate-200 rounded-md w-1/6 skeleton-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
