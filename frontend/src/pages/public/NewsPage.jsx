import { ArrowUpRight, CalendarDays, Download, FileText } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHero } from '@/components/common/PageHero'
import { Pagination } from '@/components/common/Pagination'
import { SearchField } from '@/components/common/SearchField'
import { EmptyState, Notice } from '@/components/common/StateBlocks'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FilterPill } from '@/components/ui/tag'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { formatDate } from '@/lib/utils'
import { news, newsCategories, resources } from '@/data/news'

const PER_PAGE = 6

export function NewsPage() {
  const t = useT()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const category = params.get('category') ?? 'all'

  usePageMeta({
    title: 'News & Insights',
    description:
      'Announcements, programme milestones and perspectives from Construction Solutions PLC, including the Pearson VUE test center launch and consultancy programme updates.',
    image: '/media/conference.jpg',
  })

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return news.filter((article) => {
      const matchesCategory = category === 'all' || article.category === category
      const haystack = [article.title, article.excerpt].join(' ').toLowerCase()
      return matchesCategory && (!term || haystack.includes(term))
    })
  }, [category, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pageCount)
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)
  const featured = news.find((article) => article.featured)

  const setCategory = (value) => {
    const next = new URLSearchParams(params)
    if (value === 'all') next.delete('category')
    else next.set('category', value)
    setParams(next, { replace: true })
    setPage(1)
  }

  const categoryLabel = (id) => newsCategories.find((item) => item.id === id)?.label ?? id

  return (
    <>
      <PageHero
        eyebrow={t('news.hero.eyebrow')}
        title={t('news.hero.title')}
        text={t('news.hero.text')}
        breadcrumbs={[{ label: t('nav.news'), to: '/news' }]}
        image={{ src: '/media/conference.jpg', alt: 'Industry presentation' }}
      />

      {/* Featured article */}
      {featured && (
        <section className="bg-white py-12 lg:py-16">
          <div className="shell">
            <article className="grid gap-8 border border-line lg:grid-cols-[1.1fr_1fr]">
              <Link to={`/news/${featured.slug}`} className="group relative block min-h-[16rem] overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </Link>
              <div className="flex flex-col justify-center p-6 sm:p-9">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="gold">{t('news.featured')}</Badge>
                  <span className="text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted">
                    {categoryLabel(featured.category)}
                  </span>
                  <time
                    dateTime={featured.date}
                    className="flex items-center gap-1.5 text-[0.6875rem] text-muted"
                  >
                    <CalendarDays className="size-3" aria-hidden="true" />
                    {formatDate(featured.date)}
                  </time>
                </div>
                <h2 className="mt-4 text-[clamp(1.3rem,2.4vw,1.85rem)] font-semibold leading-snug tracking-[-0.02em] text-navy">
                  <Link to={`/news/${featured.slug}`} className="hover:text-gold-deep">
                    {featured.title}
                  </Link>
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
            <div
              className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1"
              role="group"
              aria-label={t('news.categories')}
            >
              {newsCategories.map((item) => (
                <FilterPill
                  key={item.id}
                  active={category === item.id}
                  onClick={() => setCategory(item.id)}
                >
                  {t(item.labelKey)}
                </FilterPill>
              ))}
            </div>
            <SearchField
              id="news-search"
              value={query}
              onChange={(value) => {
                setQuery(value)
                setPage(1)
              }}
              placeholder="Search news and insights…"
              className="w-full lg:w-72"
            />
          </div>

          {visible.length === 0 ? (
            <EmptyState className="mt-8" />
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((article) => (
                <article key={article.slug} className="group flex flex-col border border-line bg-white">
                  <Link to={`/news/${article.slug}`} className="relative block aspect-[16/10] overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-2 text-[0.5625rem] font-bold uppercase tracking-[0.1em]">
                      <span className="text-gold-deep">{categoryLabel(article.category)}</span>
                      <time dateTime={article.date} className="text-muted">
                        {formatDate(article.date)}
                      </time>
                    </div>
                    <h2 className="mt-2.5 text-[0.9375rem] font-semibold leading-snug text-navy">
                      <Link to={`/news/${article.slug}`} className="hover:text-gold-deep">
                        {article.title}
                      </Link>
                    </h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-[0.8125rem] leading-relaxed text-muted">
                      {article.excerpt}
                    </p>
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

          <Pagination className="mt-10" page={current} pageCount={pageCount} onChange={setPage} />
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="section bg-white scroll-mt-24">
        <div className="shell">
          <SectionHeading
            eyebrow={t('nav.resources')}
            title={t('news.resources.title')}
            text={t('news.resources.text')}
          />

          <div className="mt-10 grid gap-px bg-line sm:grid-cols-2">
            {resources.map((resource) => (
              <div key={resource.id} className="flex h-full flex-col bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                  <FileText className="size-5 text-gold-deep" strokeWidth={1.6} aria-hidden="true" />
                  <Badge variant="outline">{t('news.resources.pending')}</Badge>
                </div>
                <h3 className="mt-4 text-[0.9375rem] font-semibold leading-snug text-navy">{resource.title}</h3>
                <p className="mt-2 flex-1 text-[0.8125rem] leading-relaxed text-muted">{resource.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5">
                  <span className="text-[0.625rem] uppercase tracking-[0.1em] text-muted">
                    {resource.format} · {resource.year}
                  </span>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-navy hover:text-gold-deep"
                  >
                    <Download className="size-3" aria-hidden="true" />
                    {t('news.resources.request')}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Notice className="mt-8">
            Documents are listed for reference only. Files are published once the client organisation and CONSOL have
            approved public release.
          </Notice>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/events">
                {t('nav.events')}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/contact">{t('nav.contact')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
