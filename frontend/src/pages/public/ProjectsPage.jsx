import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHero } from '@/components/common/PageHero'
import { Pagination } from '@/components/common/Pagination'
import { SearchField } from '@/components/common/SearchField'
import { CardGridSkeleton, EmptyState, ErrorState } from '@/components/common/StateBlocks'
import { Button } from '@/components/ui/button'
import { FilterPill } from '@/components/ui/tag'
import { useProjectCategories, useProjects } from '@/hooks/useProjects'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'

const PER_PAGE = 9

function projectImage(project) {
  return project.coverImage ?? '/media/conference.jpg'
}

function projectImageAlt(project) {
  return project.coverImage
    ? project.coverImageAlt || project.title
    : `Illustrative photograph, not a photograph of ${project.title}`
}

export function ProjectsPage() {
  const t = useT()
  const [params, setParams] = useSearchParams()
  const urlQuery = params.get('q') ?? ''
  const [search, setSearch] = useState(urlQuery)
  const category = params.get('category') ?? ''
  const page = Math.max(1, Number(params.get('page')) || 1)

  usePageMeta({
    title: 'Projects',
    description: 'Explore CONSOL project work published by the company. Client details and project imagery appear only when approved.',
    image: '/media/conference.jpg',
  })

  useEffect(() => setSearch(urlQuery), [urlQuery])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setParams((current) => {
        const next = new URLSearchParams(current)
        const value = search.trim()
        if (value) next.set('q', value)
        else next.delete('q')
        next.delete('page')
        return next
      }, { replace: true })
    }, 300)
    return () => window.clearTimeout(timer)
  }, [search, setParams])

  const filters = {
    ...(urlQuery ? { q: urlQuery } : {}),
    ...(category ? { category } : {}),
  }
  const projectsQuery = useProjects({ ...filters, page, per_page: PER_PAGE, featured: 0 })
  const featuredQuery = useProjects({ ...filters, per_page: 1, featured: 1 })
  const categoriesQuery = useProjectCategories()
  const projects = projectsQuery.data?.data ?? []
  const featured = featuredQuery.data?.data?.[0]
  const total = projectsQuery.data?.total ?? 0
  const pageCount = projectsQuery.data?.last_page ?? 1

  function setFilter(key, value) {
    setParams((current) => {
      const next = new URLSearchParams(current)
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete('page')
      return next
    }, { replace: true })
  }

  function clearFilters() {
    setSearch('')
    setParams({}, { replace: true })
  }

  return (
    <>
      <PageHero
        eyebrow={t('projects.hero.eyebrow')}
        title={t('projects.hero.title')}
        text={t('projects.hero.text')}
        breadcrumbs={[{ label: t('nav.projects'), to: '/projects' }]}
        image={{ src: '/media/conference.jpg', alt: 'Illustrative project review meeting' }}
      />

      <section className="section bg-white">
        <div className="shell">
          <div className="border border-line bg-canvas/60 p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <SearchField
                id="project-search"
                value={search}
                onChange={setSearch}
                placeholder={t('projects.searchPlaceholder')}
                className="w-full lg:max-w-sm"
              />
              {categoriesQuery.isLoading ? (
                <p className="text-sm text-muted" role="status">{t('common.loading')}</p>
              ) : categoriesQuery.isError ? (
                <p className="text-sm text-danger" role="alert">Project categories could not be loaded.</p>
              ) : (
                <div className="no-scrollbar flex gap-2 overflow-x-auto" role="group" aria-label={t('common.filters')}>
                  <FilterPill active={!category} onClick={() => setFilter('category', '')}>
                    {t('common.all')}
                  </FilterPill>
                  {(categoriesQuery.data ?? []).map((item) => (
                    <FilterPill
                      key={item.id}
                      active={category === item.slug}
                      onClick={() => setFilter('category', item.slug)}
                    >
                      {item.name}
                    </FilterPill>
                  ))}
                </div>
              )}
            </div>
          </div>

          {featuredQuery.isLoading && (
            <div className="mt-8" role="status">{t('common.loading')}</div>
          )}
          {featuredQuery.isError && (
            <ErrorState
              className="mt-8"
              title="Featured project could not be loaded"
              text={featuredQuery.error?.response?.data?.message ?? 'The CONSOL projects service could not be reached.'}
              onRetry={() => featuredQuery.refetch()}
            />
          )}
          {featured && (
            <article className="group relative mt-8 grid overflow-hidden bg-navy text-white lg:grid-cols-[1.2fr_0.8fr]">
              <Link to={`/projects/${featured.slug}`} className="relative block min-h-64 overflow-hidden lg:min-h-[25rem]">
                <img
                  src={projectImage(featured)}
                  alt={projectImageAlt(featured)}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" aria-hidden="true" />
                {!featured.coverImage && (
                  <span className="absolute bottom-4 left-4 bg-white/90 px-2.5 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-navy">
                    Illustrative image
                  </span>
                )}
              </Link>
              <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
                <p className="text-[0.625rem] font-bold uppercase tracking-[0.16em] text-gold">
                  {t('projects.featured')}
                </p>
                <p className="mt-3 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white/60">
                  {featured.categories?.map((item) => item.name).join(' · ')}
                  {featured.year && ` · ${featured.year}`}
                </p>
                <h2 className="mt-3 text-[clamp(1.35rem,2.4vw,2rem)] font-semibold leading-tight tracking-[-0.03em]">
                  <Link to={`/projects/${featured.slug}`}>{featured.title}</Link>
                </h2>
                <p className="mt-4 text-[0.875rem] leading-relaxed text-white/70">{featured.summary}</p>
                {featured.client && (
                  <p className="mt-4 flex items-start gap-2 text-[0.75rem] text-white/70">
                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-gold" aria-hidden="true" />
                    {featured.client}
                  </p>
                )}
                <Button asChild variant="gold" className="mt-6 w-fit">
                  <Link to={`/projects/${featured.slug}`}>
                    {t('common.readMore')}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </article>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted" aria-live="polite">
              {total} {t('projects.count')}
            </p>
            {(category || urlQuery) && (
              <Button variant="link" size="sm" className="h-auto p-0" onClick={clearFilters}>
                {t('common.clearFilters')}
              </Button>
            )}
          </div>

          {projectsQuery.isLoading ? (
            <div className="mt-6"><CardGridSkeleton count={6} /></div>
          ) : projectsQuery.isError ? (
            <ErrorState
              className="mt-6"
              title="Projects could not be loaded"
              text={projectsQuery.error?.response?.data?.message ?? 'The CONSOL projects service could not be reached.'}
              onRetry={() => projectsQuery.refetch()}
            />
          ) : projects.length === 0 ? (
            <EmptyState className="mt-6" />
          ) : (
            <div className="mt-6 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="group flex flex-col border border-line bg-white transition-shadow duration-300 hover:shadow-card"
                >
                  <Link to={`/projects/${project.slug}`} className="relative block aspect-[4/3] overflow-hidden">
                    <img
                      src={projectImage(project)}
                      alt={projectImageAlt(project)}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                    />
                    {!project.coverImage && (
                      <span className="absolute right-3 top-3 bg-white/90 px-2 py-1 text-[0.5rem] font-bold uppercase tracking-[0.1em] text-navy">
                        Illustrative image
                      </span>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-2 text-[0.5rem] font-bold uppercase tracking-[0.14em]">
                      <span className="text-gold-deep">{project.categories?.map((item) => item.name).join(' · ')}</span>
                      {project.year && (
                        <>
                          <span className="text-line-strong" aria-hidden="true">·</span>
                          <span className="flex items-center gap-1 text-muted">
                            <CalendarDays className="size-2.5" aria-hidden="true" />
                            {project.year}
                          </span>
                        </>
                      )}
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
                        className="inline-flex items-center gap-1.5 pt-1 text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-navy transition-colors hover:text-gold-deep"
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

          <Pagination
            className="mt-10"
            page={projectsQuery.data?.current_page ?? page}
            pageCount={pageCount}
            onChange={(value) => setFilter('page', String(value))}
          />
          <p className="mt-6 text-[0.6875rem] leading-relaxed text-muted">{t('projects.hero.text')}</p>
        </div>
      </section>
    </>
  )
}
