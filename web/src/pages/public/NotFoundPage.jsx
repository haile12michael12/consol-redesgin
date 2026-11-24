import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'

const suggestions = [
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/training', label: 'Training' },
  { to: '/contact', label: 'Contact' },
]

export function NotFoundPage() {
  const t = useT()
  usePageMeta({
    title: t('notFound.title'),
    description: t('notFound.text'),
    noindex: true,
  })

  return (
    <div className="relative isolate bg-canvas">
      <div className="shell flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <p className="font-display text-[clamp(4rem,12vw,7rem)] leading-none text-gold">404</p>
        <h1 className="mt-4 text-[clamp(1.5rem,3vw,2.25rem)] font-semibold tracking-[-0.03em] text-navy">
          {t('notFound.title')}
        </h1>
        <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-muted">{t('notFound.text')}</p>

        <Button asChild className="mt-8">
          <Link to="/">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t('notFound.cta')}
          </Link>
        </Button>

        <div className="mt-12 w-full max-w-lg border-t border-line pt-8">
          <p className="flex items-center justify-center gap-2 text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-muted">
            <Compass className="size-3.5" aria-hidden="true" />
            Popular pages
          </p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {suggestions.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="inline-flex border border-line px-3 py-1.5 text-[0.75rem] font-medium text-navy transition-colors hover:border-navy"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
