import { Input, Textarea } from '@/components/ui/input'
import { Field } from '@/components/ui/field'
import { cn } from '@/lib/utils'

/**
 * react-hook-form field wrapper that resolves translated messages and wires
 * ARIA attributes automatically.
 */
export function FormField({
  label,
  id,
  register,
  error,
  hint,
  required,
  textarea = false,
  rows,
  className,
  as: Control,
  ...inputProps
}) {
  const Comp = Control ?? (textarea ? Textarea : Input)
  return (
    <Field label={label} htmlFor={id} hint={hint} error={error} required={required} className={className}>
      {(aria) => (
        <Comp id={id} invalid={Boolean(error)} rows={rows} {...aria} {...register} {...inputProps} />
      )}
    </Field>
  )
}

export function FormGrid({ children, className }) {
  return <div className={cn('grid gap-5 sm:grid-cols-2', className)}>{children}</div>
}
