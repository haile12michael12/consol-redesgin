import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-[2px] bg-line/70', className)} {...props} />
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('space-y-2.5', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn('h-3.5', index === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  )
}
