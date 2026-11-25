import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'min-h-28 w-full rounded-sm border border-input bg-white px-4 py-3 text-sm text-ink placeholder:text-muted transition-[border-color,box-shadow] duration-200 focus-visible:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/25 aria-[invalid=true]:border-danger disabled:cursor-not-allowed disabled:bg-canvas disabled:text-muted',
        className,
      )}
      {...props}
    />
  )
})

export default Textarea
