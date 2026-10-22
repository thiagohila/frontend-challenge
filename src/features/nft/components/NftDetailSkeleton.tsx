import { Skeleton } from '@/components/ui/skeleton'

/** Kept apart from the view so the route's pending state does not pull the whole detail into the entry chunk. */
export function NftDetailSkeleton() {
  return (
    <div aria-busy="true" className="mx-auto flex max-w-page flex-col gap-8 px-4 pt-8 lg:flex-row lg:px-0" data-testid="detail-skeleton">
      <Skeleton className="aspect-square w-full rounded-3xl lg:size-[573px]" />
      <div className="flex flex-1 flex-col gap-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
