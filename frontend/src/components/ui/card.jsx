import { cn } from '@/lib/utils'

export function Card({ className, tone = 'paper', ...props }) {
  return (
    <div
      className={cn(
        'relative rounded-md transition-shadow duration-200',
        tone === 'paper' && 'border border-line bg-paper shadow-card',
        tone === 'canvas' && 'bg-canvas',
        tone === 'navy' && 'bg-navy text-white',
        tone === 'bare' && 'bg-transparent',
        className,
      )}
      {...props}
    />
  )
}

export function CardBody({ className, ...props }) {
  return <div className={cn('p-6 lg:p-8', className)} {...props} />
}

export function CardMeta({ className, ...props }) {
  return (
    <div
      className={cn('flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted', className)}
      {...props}
    />
  )
}

export function CardTitle({ className, as: Tag = 'h3', ...props }) {
  return <Tag className={cn('text-xl font-semibold tracking-[-0.02em] text-navy', className)} {...props} />
}

export function CardText({ className, ...props }) {
  return <p className={cn('text-[0.9375rem] leading-relaxed text-muted', className)} {...props} />
}
