import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@/lib/utils'

export function Label({ className, ...props }) {
  return (
    <LabelPrimitive.Root
      className={cn(
        'block text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-navy',
        className,
      )}
      {...props}
    />
  )
}

/** Field wrapper: label, control, hint and error message with ARIA wiring. */
export function Field({ label, htmlFor, hint, error, required, children, className }) {
  const hintId = hint ? `${htmlFor}-hint` : undefined
  const errorId = error ? `${htmlFor}-error` : undefined
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="ml-1 text-gold-deep">*</span>}
        </Label>
        {hint && (
          <span id={hintId} className="field-hint">
            {hint}
          </span>
        )}
      </div>
      {children({
        'aria-describedby': [hintId, errorId].filter(Boolean).join(' ') || undefined,
        'aria-invalid': error ? true : undefined,
        id: htmlFor,
      })}
      {error && (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
