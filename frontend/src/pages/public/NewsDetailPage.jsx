import { ArrowLeft, ArrowRight, CalendarDays, Tag } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { ErrorState, LoadingState, NotFoundInline } from '@/components/common/StateBlocks'
import { ShareRow } from '@/components/news/ShareRow'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useArticle, useNewsCategories } from '@/hooks/useNews'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { formatDate } from '@/lib/utils'

export function NewsDetailPage() {
  const { slug } = useParams()
  const t = useT()
  const articleQuery = useArticle(slug)
  const categoriesQuery = useNewsCategories()
  const article = articleQuery.data
  const categories = categoriesQuery.data ?? []

  usePageMeta({
    title: article?.seoTitle || article?.title,
    description: article?.seoDescription || article?.excerpt,
    image: article?.image,
    jsonLd: article
      ? {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: article.title,
          datePublished: article.publishedAt,
          description: article.excerpt,
          author: { '@type': 'Organization', name: 'Construction Solutions PLC' },
          publisher: { '@type': 'Organization', name: 'Construction Solutions PLC' },
        }
      : null,
  })

  if (articleQuery.isPending) return <LoadingState className="shell section" label="Loading article…" />
  if (articleQuery.isError) {
    if (articleQuery.error?.response?.status === 404) return <NotFoundInline />
    return <div className="shell section"><ErrorState title="Article could not be loaded" onRetry={articleQuery.refetch} /></div>
  }
  if (!article) return <NotFoundInline />

  const related = article.relatedArticles ?? []

  return (
    <>
      <section className="bg-navy pb-12 pt-24 text-white sm:pt-28">
        <div className="shell">
          <Breadcrumbs
            items={[
              { label: t('nav.news'), to: '/news' },
              { label: article.title, to: `/news/${article.slug}` },
            ]}
            invert
            className="mb-8"
          />
          <div className="flex flex-wrap items-center gap-3">
            {article.categoryName && <Badge variant="gold">{article.categoryName}</Badge>}
            {article.date && (
              <span className="flex items-center gap-1.5 text-[0.6875rem] text-white/60">
                <CalendarDays className="size-3" aria-hidden="true" />
                <time dateTime={article.date}>{formatDate(article.date)}</time>
              </span>
            )}
          </div>
          <h1 className="mt-5 max-w-4xl text-[clamp(1.8rem,4vw,3.05rem)] font-semibold leading-[1.09] tracking-[-0.04em] text-white">
            {article.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[0.9375rem] leading-[1.85] text-white/60">{article.excerpt}</p>
        </div>
      </section>

      {article.image && (
        <div className="shell lg:relative lg:z-10 lg:-mt-10">
          <div className="aspect-[16/8] overflow-hidden bg-canvas">
            <img src={article.image} alt={article.imageAlt ?? ''} className="h-full w-full object-cover" fetchPriority="high" />
          </div>
        </div>
      )}

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
          <article>
            <div className="prose-consol max-w-2xl">
              {(article.body ?? []).map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 40)}`}>{paragraph}</p>)}
            </div>
            <div className="mt-10 max-w-2xl"><ShareRow title={article.title} /></div>
            <div className="mt-8 max-w-2xl">
              <Link to="/news" className="link-arrow"><ArrowLeft className="size-4" aria-hidden="true" />{t('common.viewAll')}</Link>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="border border-line p-6">
              <p className="flex items-center gap-2 text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-muted">
                <Tag className="size-3" aria-hidden="true" />{t('news.categories')}
              </p>
              {categoriesQuery.isError ? (
                <p className="mt-4 text-sm text-muted">Categories are temporarily unavailable.</p>
              ) : (
                <ul className="mt-4 space-y-1.5">
                  {categories.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/news?category=${encodeURIComponent(item.slug)}`}
                        className="flex items-center justify-between py-1.5 text-[0.8125rem] text-navy hover:text-gold-deep"
                      >
                        {item.name}<ArrowRight className="size-3 text-gold-deep" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-navy p-6 text-white">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-gold">{t('services.cta.eyebrow')}</p>
              <p className="mt-3 text-[0.9375rem] font-medium leading-snug">Contact CONSOL about this publication.</p>
              <Button asChild variant="gold" className="mt-5 w-full">
                <Link to="/contact">{t('nav.contact')}</Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section bg-canvas">
          <div className="shell">
            <h2 className="border-b border-line pb-5 text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">{t('news.related')}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <article key={item.slug} className="group border border-line bg-white">
                  <Link to={`/news/${item.slug}`} className="block aspect-[16/10] overflow-hidden bg-navy">
                    {item.image && <img src={item.image} alt={item.imageAlt ?? ''} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                  </Link>
                  <div className="p-5">
                    {item.date && <time dateTime={item.date} className="text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-gold-deep">{formatDate(item.date)}</time>}
                    <h3 className="mt-2 text-[0.9375rem] font-semibold leading-snug text-navy">
                      <Link to={`/news/${item.slug}`}>{item.title}</Link>
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
