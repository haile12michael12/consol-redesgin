import { Skeleton } from '@/components/ui/skeleton'

/** Lightweight skeleton shown while a route chunk loads. */
export function RouteFallback() {
  return (
    <div className="pt-20" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <div className="bg-navy">
        <div className="shell pb-16 pt-28 lg:pb-20 lg:pt-32">
          <Skeleton className="h-2 w-24 bg-white/20" />
          <Skeleton className="mt-6 h-12 w-3/4 max-w-3xl bg-white/15" />
          <Skeleton className="mt-8 h-3.5 w-1/2 max-w-xl bg-white/10" />
        </div>
      </div>
      <div className="shell grid gap-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border border-line">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="space-y-3 p-6">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
