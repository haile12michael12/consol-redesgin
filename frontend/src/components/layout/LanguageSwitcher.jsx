import { Globe } from 'lucide-react'
import { languages, useLanguage } from '@/i18n/LanguageProvider'
import { cn } from '@/lib/utils'

/**
 * Accessible language selector. Uses real buttons in a labelled group so it
 * works with keyboard and screen readers without menu semantics.
 */
export function LanguageSwitcher({ invert = false, compact = false }) {
  const { lang, setLanguage, t } = useLanguage()
  return (
    <div
      role="group"
      aria-label={t('common.language')}
      className={cn(
        'flex items-center gap-1',
        compact && 'text-[0.6875rem]',
      )}
    >
      {!compact && (
        <Globe
          className={cn('mr-1 size-3.5', invert ? 'text-white/50' : 'text-muted')}
          aria-hidden="true"
        />
      )}
      {languages.map((item, index) => (
        <span key={item.code} className="flex items-center">
          {index > 0 && (
            <span className={cn('mx-1', invert ? 'text-white/25' : 'text-line-strong')} aria-hidden="true">
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => setLanguage(item.code)}
            aria-pressed={lang === item.code}
            lang={item.code}
            className={cn(
              'rounded-[2px] px-1 py-0.5 font-semibold uppercase tracking-[0.1em] transition-colors',
              lang === item.code
                ? invert
                  ? 'text-gold-soft'
                  : 'text-gold-deep'
                : invert
                  ? 'text-white/55 hover:text-white'
                  : 'text-muted hover:text-navy',
            )}
          >
            {item.short}
            <span className="sr-only"> — {item.label}</span>
          </button>
        </span>
      ))}
    </div>
  )
}
