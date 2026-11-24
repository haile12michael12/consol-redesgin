import { cn } from '@/lib/utils'

const base =
  'w-full rounded-[3px] border bg-white px-3.5 text-[0.9375rem] text-ink placeholder:text-muted/80 transition-colors duration-200 outline-none focus:border-gold focus:ring-2 focus:ring-gold/25 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/15 disabled:cursor-not-allowed disabled:bg-canvas disabled:text-muted'

export function Input({ className, invalid, ...props }) {
  return (
    <input
      className={cn(base, 'h-11', className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
}

export function Textarea({ className, invalid, rows = 5, ...props }) {
  return (
    <textarea
      rows={rows}
      className={cn(base, 'py-3 leading-relaxed', className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
}
