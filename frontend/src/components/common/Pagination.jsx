import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useT } from '@/i18n/LanguageProvider'
import { cn } from '@/lib/utils'

function pageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)
  if (current <= 3) return [1, 2, 3, 4, '…', total]
  if (current >= total - 2) return [1, '…', total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}

/**
 * Accessible pagination. Renders nothing when there is a single page.
 */
export function Pagination({ page, pageCount, onChange, className }) {
  const t = useT()
  if (pageCount <= 1) return null
  const pages = pageRange(page, pageCount)

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6', className)}
    >
      <p className="text-[0.75rem] font-medium uppercase tracking-[0.12em] text-muted">
        {t('common.page')} {page} {t('common.of')} {pageCount}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="grid size-9 place-items-center border border-line text-navy transition-colors hover:border-navy disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={t('common.previous')}
        >
          <ChevronLeft className="size-4" />
        </button>
        {pages.map((value, index) =>
          value === '…' ? (
            <span key={`gap-${index}`} className="px-1 text-muted" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={value}
              type="button"
              onClick={() => onChange(value)}
              aria-current={value === page ? 'page' : undefined}
              className={cn(
                'grid size-9 place-items-center border text-[0.8125rem] font-semibold transition-colors',
                value === page
                  ? 'border-navy bg-navy text-white'
                  : 'border-line text-navy hover:border-navy',
              )}
            >
              {value}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page === pageCount}
          className="grid size-9 place-items-center border border-line text-navy transition-colors hover:border-navy disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={t('common.next')}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  )
}
