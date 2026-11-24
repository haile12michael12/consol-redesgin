import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'min-h-28 w-full border border-line-strong bg-white px-4 py-3 text-sm text-navy placeholder:text-muted/70 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold',
        className,
      )}
      {...props}
    />
  )
})

export default Textarea
