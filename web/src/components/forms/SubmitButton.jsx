import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SubmitButton({ pending, children, pendingLabel, className, ...props }) {
  return (
    <Button type="submit" disabled={pending} aria-busy={pending} className={className} {...props}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
