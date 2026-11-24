import { ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHero } from '@/components/common/PageHero'
import { SectionHeading } from '@/components/common/SectionHeading'
import { SearchField } from '@/components/common/SearchField'
import { EmptyState } from '@/components/common/StateBlocks'
import { ServiceCard } from '@/components/services/ServiceCard'
import { Button } from '@/components/ui/button'
import { FilterPill } from '@/components/ui/tag'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { useServices } from '@/data/services'

const filters = [
  { id: 'all', labelKey: 'common.all' },
  { id: 'construction-management', labelKey: 'service.cm.shortTitle' },
  { id: 'business-management', labelKey: 'service.bm.shortTitle' },
  { id: 'training', labelKey: 'service.training.shortTitle' },
  { id: 'research', labelKey: 'service.research.shortTitle' },
]

export function ServicesPage() {
  const t = useT()
  const services = useServices()
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  usePageMeta({
    title: 'Services',
    description:
      'Construction management consultancy, business management consultancy, professional training and certification, and applied research for the construction industry.',
    image: '/media/site-inspection.jpg',
  })

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return services.filter((service) => {
      const matchesCategory = category === 'all' || service.category === category
      const haystack = [service.title, service.summary, ...service.scope].join(' ').toLowerCase()
      return matchesCategory && (!term || haystack.includes(term))
    })
  }, [services, category, query])

  return (
    <>
      <PageHero
        eyebrow={t('services.hero.eyebrow')}
        title={t('services.hero.title')}
        text={t('services.hero.text')}
        breadcrumbs={[{ label: t('nav.services'), to: '/services' }]}
        image={{ src: '/media/site-inspection.jpg', alt: 'Engineers on a construction site' }}
        actions={
          <Button asChild variant="gold">
            <Link to="/request-consultation">
              {t('nav.requestConsultation')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <section className="section bg-white">
        <div className="shell">
          <SectionHeading
            eyebrow={t('services.categories')}
            title="Practice areas"
            text="Scope lists below are taken from the services CONSOL publishes. Select a practice area to read the full service detail."
          />

          <div className="mt-10 flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label={t('services.categories')}>
              {filters.map((filter) => (
                <FilterPill
                  key={filter.id}
                  active={category === filter.id}
                  onClick={() => setCategory(filter.id)}
                >
                  {t(filter.labelKey)}
                </FilterPill>
              ))}
            </div>
            <SearchField
              id="service-search"
              value={query}
              onChange={setQuery}
              placeholder={t('services.searchPlaceholder')}
              className="w-full lg:w-72"
            />
          </div>

          <p className="mt-5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted" aria-live="polite">
            {filtered.length} {t('common.results')}
          </p>

          {filtered.length === 0 ? (
            <EmptyState
              className="mt-8"
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery('')
                    setCategory('all')
                  }}
                >
                  {t('common.clearFilters')}
                </Button>
              }
            />
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
              {filtered.map((service, index) => (
                <ServiceCard key={service.slug} service={service} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-navy py-16 text-white">
        <div className="shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <p className="eyebrow eyebrow-invert">{t('services.cta.eyebrow')}</p>
            <h2 className="mt-4 text-[clamp(1.5rem,2.8vw,2.2rem)] font-semibold tracking-[-0.03em] text-white">
              {t('services.cta.title')}
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/60">{t('services.cta.text')}</p>
          </div>
          <Button asChild variant="gold" size="lg">
            <Link to="/request-consultation">
              {t('services.cta.button')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
