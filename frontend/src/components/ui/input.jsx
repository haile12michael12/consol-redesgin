import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const base =
  'w-full rounded-sm border border-input bg-white px-3.5 text-[0.9375rem] text-ink placeholder:text-muted transition-[border-color,box-shadow] duration-200 outline-none focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/15 disabled:cursor-not-allowed disabled:bg-canvas disabled:text-muted'

export const Input = forwardRef(function Input({ className, invalid, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(base, 'h-11', className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
})

export const Textarea = forwardRef(function Textarea(
  { className, invalid, rows = 5, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(base, 'py-3 leading-relaxed', className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
})
