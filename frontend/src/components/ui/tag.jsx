import { cn } from '@/lib/utils'

/**
 * Filter pill used across catalogues. Square geometry, gold underline when active.
 */
export function FilterPill({ active = false, className, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-[3px] border px-3.5 text-[0.75rem] font-semibold transition-colors duration-200',
        active
          ? 'border-navy bg-navy text-white'
          : 'border-line-strong bg-white text-muted hover:border-navy hover:text-navy',
        className,
      )}
      {...props}
    />
  )
}
