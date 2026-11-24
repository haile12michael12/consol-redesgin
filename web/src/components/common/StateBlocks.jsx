import { AlertTriangle, Inbox, Loader2, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton, SkeletonText } from '@/components/ui/skeleton'
import { useT } from '@/i18n/LanguageProvider'
import { cn } from '@/lib/utils'

export function LoadingState({ label, className }) {
  const t = useT()
  return (
    <div
      className={cn('flex items-center gap-3 py-10 text-[0.875rem] text-muted', className)}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-4 animate-spin text-gold-deep" aria-hidden="true" />
      {label ?? t('common.loading')}
    </div>
  )
}

export function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border border-line">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-3 p-6">
            <Skeleton className="h-2.5 w-24" />
            <Skeleton className="h-5 w-3/4" />
            <SkeletonText lines={2} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ErrorState({ title, text, onRetry, className }) {
  const t = useT()
  return (
    <div
      className={cn('border border-line bg-canvas px-6 py-12 text-center', className)}
      role="alert"
    >
      <AlertTriangle className="mx-auto size-6 text-danger" aria-hidden="true" />
      <h3 className="mt-4 text-lg font-semibold text-navy">{title ?? t('common.error')}</h3>
      <p className="mx-auto mt-2 max-w-md text-[0.9375rem] text-muted">
        {text ?? t('common.errorText')}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-6" onClick={onRetry}>
          <RotateCcw className="size-3.5" />
          {t('common.retry')}
        </Button>
      )}
    </div>
  )
}

export function EmptyState({ title, text, action, className }) {
  const t = useT()
  return (
    <div className={cn('border border-dashed border-line-strong px-6 py-16 text-center', className)}>
      <Inbox className="mx-auto size-6 text-muted" aria-hidden="true" />
      <h3 className="mt-4 text-lg font-semibold text-navy">{title ?? t('common.noResults')}</h3>
      <p className="mx-auto mt-2 max-w-md text-[0.9375rem] text-muted">
        {text ?? t('common.noResultsText')}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

/** Compact inline callout used for verification and demo notices. */
export function Notice({ tone = 'info', children, className, icon: Icon }) {
  const tones = {
    info: 'border-line-strong bg-canvas text-muted',
    demo: 'border-gold/50 bg-gold/10 text-navy',
    verified: 'border-success/30 bg-success/5 text-ink',
    warn: 'border-danger/30 bg-danger/5 text-ink',
  }
  return (
    <div className={cn('flex items-start gap-3 border px-4 py-3 text-[0.8125rem] leading-relaxed', tones[tone], className)}>
      {Icon && <Icon className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden="true" />}
      <div className="min-w-0">{children}</div>
    </div>
  )
}

export function NotFoundInline() {
  const t = useT()
  return (
    <div className="section shell">
      <div className="mx-auto max-w-xl border border-line px-8 py-16 text-center">
        <p className="font-display text-5xl text-gold-deep">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-navy">{t('notFound.title')}</h1>
        <p className="mt-3 text-[0.9375rem] text-muted">{t('notFound.text')}</p>
        <Button asChild className="mt-8">
          <Link to="/">{t('notFound.cta')}</Link>
        </Button>
      </div>
    </div>
  )
}
