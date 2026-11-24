import { cn } from '@/lib/utils'

/**
 * Editorial section heading: eyebrow, title, supporting text and optional
 * trailing action. `invert` for navy sections.
 */
export function SectionHeading({
  eyebrow,
  title,
  text,
  action,
  align = 'left',
  invert = false,
  as: Tag = 'h2',
  className,
  titleClassName,
  children,
}) {
  const centered = align === 'center'
  return (
    <div
      className={cn(
        'flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between',
        centered && 'items-center text-center lg:flex-col lg:items-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', centered && 'mx-auto')}>
        {eyebrow && (
          <p className={cn('eyebrow', invert && 'eyebrow-invert', centered && 'justify-center')}>
            {eyebrow}
          </p>
        )}
        {title && (
          <Tag
            className={cn(
              'mt-4 text-[clamp(1.85rem,3.6vw,2.85rem)] font-semibold leading-[1.1] tracking-[-0.03em]',
              invert ? 'text-white' : 'text-navy',
              titleClassName,
            )}
          >
            {title}
          </Tag>
        )}
        {text && (
          <p
            className={cn(
              'mt-5 max-w-xl text-[0.9375rem] leading-[1.8]',
              invert ? 'text-white/65' : 'text-muted',
              centered && 'mx-auto',
            )}
          >
            {text}
          </p>
        )}
        {children}
      </div>
      {action && <div className={cn('shrink-0', centered && 'mt-2')}>{action}</div>}
    </div>
  )
}
