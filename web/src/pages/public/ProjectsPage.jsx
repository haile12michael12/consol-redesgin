import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHero } from '@/components/common/PageHero'
import { Pagination } from '@/components/common/Pagination'
import { SearchField } from '@/components/common/SearchField'
import { EmptyState } from '@/components/common/StateBlocks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FilterPill } from '@/components/ui/tag'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { cn } from '@/lib/utils'
import { getProjectYears, projects, projectCategories } from '@/data/projects'

const PER_PAGE = 6

export function ProjectsPage() {
  const t = useT()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [page, setPage] = useState(1)

  const category = params.get('category') ?? 'all'
  const year = params.get('year') ?? 'all'

  usePageMeta({
    title: 'Projects',
    description:
      'Consultancy and capacity-building engagements published by CONSOL, including PMO set-up, OPM maturity, national manuals, value-for-money assessment and certification systems.',
    image: '/media/conference.jpg',
  })

  useEffect(() => {
    setPage(1)
  }, [category, year, query])

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return projects.filter((project) => {
      const matchesCategory = category === 'all' || project.category === category
      const matchesYear = year === 'all' || String(project.year) === year
      const haystack = [project.title, project.client ?? '', project.summary].join(' ').toLowerCase()
      return matchesCategory && matchesYear && (!term || haystack.includes(term))
    })
  }, [category, year, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pageCount)
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)
  const years = getProjectYears()

  return (
    <>
      <PageHero
        eyebrow={t('projects.hero.eyebrow')}
        title={t('projects.hero.title')}
        text={t('projects.hero.text')}
        breadcrumbs={[{ label: t('nav.projects'), to: '/projects' }]}
        image={{ src: '/media/conference.jpg', alt: 'Project review meeting' }}
      />

      <section className="section bg-white">
        <div className="shell">
          {/* Filter bar */}
          <div className="border border-line bg-canvas/60 p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <SearchField
                id="project-search"
                value={query}
                onChange={setQuery}
                placeholder={t('projects.searchPlaceholder')}
                className="w-full lg:max-w-sm"
              />
              <div className="flex flex-wrap items-center gap-3">
                <label htmlFor="year-filter" className="text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted">
                  {t('projects.year')}
                </label>
                <select
                  id="year-filter"
                  value={year}
                  onChange={(event) => setParam('year', event.target.value)}
                  className="h-9 rounded-[3px] border border-line-strong bg-white px-2.5 text-[0.75rem] font-medium text-navy outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
                >
                  <option value="all">All years</option>
                  {years.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div
              className="no-scrollbar mt-4 flex gap-2 overflow-x-auto border-t border-line pt-4"
              role="group"
              aria-label={t('common.filters')}
            >
              {projectCategories.map((item) => (
                <FilterPill
                  key={item.id}
                  active={category === item.id}
                  onClick={() => setParam('category', item.id)}
                >
                  {item.labelKey ? t(item.labelKey) : item.label}
                </FilterPill>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted" aria-live="polite">
              {filtered.length} {t('projects.count')}
            </p>
            {(category !== 'all' || year !== 'all' || query) && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-[0.6875rem] font-bold uppercase tracking-[0.12em]"
                onClick={() => {
                  setQuery('')
                  setParams({}, { replace: true })
                }}
              >
                {t('common.clearFilters')}
              </Button>
            )}
          </div>

          {visible.length === 0 ? (
            <EmptyState className="mt-8" />
          ) : (
            <div className="mt-6 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((project) => (
                <article
                  key={project.slug}
                  className="group flex flex-col border border-line bg-white transition-shadow duration-300 hover:shadow-card"
                >
                  <Link to={`/projects/${project.slug}`} className="relative block aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    {project.source === 'demo' && (
                      <span className="absolute right-3 top-3">
                        <Badge variant="demo">{t('common.demoShort')}</Badge>
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-2 text-[0.5rem] font-bold uppercase tracking-[0.14em]">
                      <span className="text-gold-deep">
                        {projectCategories.find((item) => item.id === project.category)?.label ?? project.category}
                      </span>
                      <span className="text-line-strong" aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-muted">
                        <CalendarDays className="size-2.5" aria-hidden="true" />
                        {project.year}
                      </span>
                    </div>

                    <h2 className="mt-2.5 text-[1rem] font-semibold leading-snug text-navy">
                      <Link to={`/projects/${project.slug}`} className="transition-colors hover:text-gold-deep">
                        {project.title}
                      </Link>
                    </h2>

                    <p className="mt-2.5 line-clamp-3 flex-1 text-[0.8125rem] leading-[1.75] text-muted">
                      {project.summary}
                    </p>

                    <div className="mt-4 space-y-1.5 border-t border-line pt-3.5">
                      {project.client && (
                        <p className="flex items-start gap-1.5 text-[0.6875rem] leading-snug text-muted">
                          <MapPin className="mt-0.5 size-3 shrink-0 text-gold-deep" aria-hidden="true" />
                          <span className="line-clamp-2">{project.client}</span>
                        </p>
                      )}
                      <Link
                        to={`/projects/${project.slug}`}
                        className={cn(
                          'inline-flex items-center gap-1.5 pt-1 text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-navy transition-colors hover:text-gold-deep',
                        )}
                      >
                        {t('common.readMore')}
                        <ArrowUpRight className="size-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <Pagination className="mt-10" page={current} pageCount={pageCount} onChange={setPage} />

          <p className="mt-6 text-[0.6875rem] leading-relaxed text-muted">{t('projects.hero.text')}</p>
        </div>
      </section>
    </>
  )
}
