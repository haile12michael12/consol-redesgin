import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useT } from '@/i18n/LanguageProvider'
import { cn } from '@/lib/utils'

/**
 * Accessible breadcrumb trail. Last item is the current page and is not a link.
 */
export function Breadcrumbs({ items = [], invert = false, className }) {
  const t = useT()
  const trail = [{ label: t('common.home'), to: '/' }, ...items]
  return (
    <nav aria-label="Breadcrumb" className={cn('text-[0.75rem]', className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {trail.map((item, index) => {
          const last = index === trail.length - 1
          return (
            <li key={`${item.to ?? item.label}-${index}`} className="flex items-center gap-2">
              {last ? (
                <span
                  aria-current="page"
                  className={cn('font-medium', invert ? 'text-white/85' : 'text-navy')}
                >
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    to={item.to}
                    className={cn(
                      'transition-colors',
                      invert ? 'text-white/55 hover:text-white' : 'text-muted hover:text-gold-deep',
                    )}
                  >
                    {item.label}
                  </Link>
                  <ChevronRight
                    className={cn('size-3', invert ? 'text-white/55' : 'text-line-strong')}
                    aria-hidden="true"
                  />
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
