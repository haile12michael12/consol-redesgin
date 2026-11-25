import { ArrowRight, ArrowUpRight, CalendarDays } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHero } from '@/components/common/PageHero'
import { Pagination } from '@/components/common/Pagination'
import { SearchField } from '@/components/common/SearchField'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FilterPill } from '@/components/ui/tag'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { formatDate } from '@/lib/utils'
import { useNews, useNewsCategories } from '@/hooks/useNews'

const PER_PAGE = 9

export function NewsPage() {
  const t = useT()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const category = params.get('category') ?? 'all'
  const page = Number(params.get('page') ?? 1)
  const newsQuery = useNews({
    q: query || undefined,
    category: category === 'all' ? undefined : category,
    page,
    per_page: PER_PAGE,
  })
  const featuredQuery = useNews({ featured: true, per_page: 1 })
  const categoriesQuery = useNewsCategories()
  const articles = newsQuery.data?.data ?? []
  const featured = featuredQuery.data?.data?.[0]
  const categories = categoriesQuery.data ?? []

  usePageMeta({
    title: 'News & Insights',
    description: 'Company news and insights published by Construction Solutions PLC.',
  })

  const updateParams = (updates) => {
    const next = new URLSearchParams(params)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, String(value))
      else next.delete(key)
    })
    setParams(next, { replace: true })
  }

  return (
    <>
      <PageHero
        eyebrow={t('news.hero.eyebrow')}
        title={t('news.hero.title')}
        text={t('news.hero.text')}
        breadcrumbs={[{ label: t('nav.news'), to: '/news' }]}
        image={{ src: '/media/conference.jpg', alt: 'Company news and insights' }}
      />

      {featured && (
        <section className="bg-white py-12 lg:py-16">
          <div className="shell">
            <article className="grid gap-8 border border-line lg:grid-cols-[1.1fr_1fr]">
              <Link to={`/news/${featured.slug}`} className="group relative block min-h-[16rem] overflow-hidden bg-canvas">
                {featured.image ? (
                  <img
                    src={featured.image}
                    alt={featured.imageAlt ?? ''}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
                  />
                ) : <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-soft" aria-hidden="true" />}
              </Link>
              <div className="flex flex-col justify-center p-6 sm:p-9">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="gold">{t('news.featured')}</Badge>
                  {featured.categoryName && (
                    <span className="text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted">
                      {featured.categoryName}
                    </span>
                  )}
                  {featured.date && (
                    <time dateTime={featured.date} className="flex items-center gap-1.5 text-[0.6875rem] text-muted">
                      <CalendarDays className="size-3" aria-hidden="true" />
                      {formatDate(featured.date)}
                    </time>
                  )}
                </div>
                <h2 className="mt-4 text-[clamp(1.3rem,2.4vw,1.85rem)] font-semibold leading-snug tracking-[-0.02em] text-navy">
                  <Link to={`/news/${featured.slug}`} className="hover:text-gold-deep">{featured.title}</Link>
                </h2>
                <p className="mt-4 text-[0.875rem] leading-[1.8] text-muted">{featured.excerpt}</p>
                <Link to={`/news/${featured.slug}`} className="link-arrow mt-6">
                  {t('common.readMore')}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </div>
        </section>
      )}

      <section className="section bg-canvas">
        <div className="shell">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label={t('news.categories')}>
              <FilterPill active={category === 'all'} onClick={() => updateParams({ category: '', page: '' })}>
                {t('common.all')}
              </FilterPill>
              {categories.map((item) => (
                <FilterPill
                  key={item.id}
                  active={category === item.slug}
                  onClick={() => updateParams({ category: item.slug, page: '' })}
                >
                  {item.name}
                </FilterPill>
              ))}
            </div>
            <SearchField
              id="news-search"
              value={query}
              onChange={(value) => updateParams({ q: value, page: '' })}
              placeholder="Search news and insights…"
              className="w-full lg:w-72"
            />
          </div>

          {(newsQuery.isPending || categoriesQuery.isPending) && !articles.length ? (
            <div className="mt-8"><LoadingState label="Loading published news…" /></div>
          ) : newsQuery.isError ? (
            <div className="mt-8">
              <ErrorState title="News could not be loaded" onRetry={newsQuery.refetch} />
            </div>
          ) : articles.length === 0 ? (
            <EmptyState className="mt-8" title="No published articles" text="Approved company news will appear here." />
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <article key={article.slug} className="group flex flex-col border border-line bg-white">
                  <Link to={`/news/${article.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-canvas">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.imageAlt ?? ''}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : <div className="h-full w-full bg-gradient-to-br from-navy/90 to-navy-soft" aria-hidden="true" />}
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-2 text-[0.5625rem] font-bold uppercase tracking-[0.1em]">
                      <span className="text-gold-deep">{article.categoryName ?? 'News'}</span>
                      {article.date && <time dateTime={article.date} className="text-muted">{formatDate(article.date)}</time>}
                    </div>
                    <h2 className="mt-2.5 text-[0.9375rem] font-semibold leading-snug text-navy">
                      <Link to={`/news/${article.slug}`} className="hover:text-gold-deep">{article.title}</Link>
                    </h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-[0.8125rem] leading-relaxed text-muted">{article.excerpt}</p>
                    <Link
                      to={`/news/${article.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 border-t border-line pt-3.5 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-navy hover:text-gold-deep"
                    >
                      {t('common.readMore')}
                      <ArrowUpRight className="size-3" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {newsQuery.isError && newsQuery.isFetching && <LoadingState className="mt-5" label="Refreshing news…" />}
          {newsQuery.data?.last_page > 1 && (
            <Pagination
              className="mt-10"
              page={newsQuery.data.current_page}
              pageCount={newsQuery.data.last_page}
              onChange={(value) => updateParams({ page: value })}
            />
          )}
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/resources">{t('nav.downloads')}<ArrowRight className="size-4" aria-hidden="true" /></Link>
            </Button>
            <Button asChild variant="ghost"><Link to="/events">{t('nav.events')}</Link></Button>
          </div>
        </div>
      </section>
    </>
  )
}
