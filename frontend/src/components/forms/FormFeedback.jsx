import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'

/**
 * Success and error panels for form submissions. Demo submissions say so
 * explicitly rather than implying a record was stored.
 */
export function FormSuccess({ title, text, source, onReset }) {
  const t = useT()
  return (
    <div className="border border-success/30 bg-success/5 p-8 text-center" role="status" aria-live="polite">
      <CheckCircle2 className="mx-auto size-8 text-success" aria-hidden="true" />
      <h3 className="mt-4 text-xl font-semibold text-navy">{title}</h3>
      {source === 'demo' && (
        <p className="mx-auto mt-2 inline-block border border-gold/60 bg-gold/15 px-2.5 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-gold-deep">
          {t('common.demo')} — nothing was stored
        </p>
      )}
      <p className="mx-auto mt-4 max-w-md text-[0.875rem] leading-relaxed text-muted">{text}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onReset && (
          <Button variant="outline" size="sm" onClick={onReset}>
            {t('common.send')}
          </Button>
        )}
        <Button asChild variant="ghost" size="sm">
          <Link to="/">{t('common.home')}</Link>
        </Button>
      </div>
    </div>
  )
}

export function FormError({ title, text, email }) {
  const t = useT()
  return (
    <div className="border border-danger/30 bg-danger/5 p-6" role="alert">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
        <div>
          <h3 className="text-[0.9375rem] font-semibold text-navy">{title ?? t('common.error')}</h3>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">
            {text ?? t('common.errorText')}{' '}
            {email && (
              <a href={`mailto:${email}`} className="font-semibold text-navy underline decoration-gold underline-offset-2">
                {email}
              </a>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
