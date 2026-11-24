import { ArrowLeft, ArrowRight, CalendarDays, Clock, Info, Tag } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { NotFoundInline, Notice } from '@/components/common/StateBlocks'
import { ShareRow } from '@/components/news/ShareRow'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { formatDate } from '@/lib/utils'
import { getNewsBySlug, getRelatedNews, newsCategories } from '@/data/news'

export function NewsDetailPage() {
  const { slug } = useParams()
  const t = useT()
  const article = getNewsBySlug(slug)

  usePageMeta({
    title: article?.title,
    description: article?.excerpt,
    image: article?.image,
    jsonLd: article
      ? {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: article.title,
          datePublished: article.date,
          description: article.excerpt,
          author: { '@type': 'Organization', name: 'Construction Solutions PLC' },
          publisher: { '@type': 'Organization', name: 'Construction Solutions PLC' },
        }
      : null,
  })

  if (!article) return <NotFoundInline />

  const related = getRelatedNews(article, 3)
  const categoryLabel = newsCategories.find((item) => item.id === article.category)?.label ?? article.category

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
            <Badge variant="gold">{categoryLabel}</Badge>
            <span className="flex items-center gap-1.5 text-[0.6875rem] text-white/60">
              <CalendarDays className="size-3" aria-hidden="true" />
              <time dateTime={article.date}>{formatDate(article.date)}</time>
            </span>
            <span className="flex items-center gap-1.5 text-[0.6875rem] text-white/60">
              <Clock className="size-3" aria-hidden="true" />
              3 {t('news.minRead')}
            </span>
          </div>
          <h1 className="mt-5 max-w-4xl text-[clamp(1.8rem,4vw,3.05rem)] font-semibold leading-[1.09] tracking-[-0.04em] text-white">
            {article.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[0.9375rem] leading-[1.85] text-white/60">{article.excerpt}</p>
        </div>
      </section>

      <div className="shell -mt-0 lg:-mt-10 lg:relative lg:z-10">
        <div className="aspect-[16/8] overflow-hidden bg-canvas">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        </div>
      </div>

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
          <article>
            <div className="prose-consol max-w-2xl">
              {article.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            {article.bodyStatus === 'summary-only' && (
              <Notice className="mt-8 max-w-2xl" icon={Info}>
                This article reproduces only the announcement text published by CONSOL. Additional detail will be
                added once approved by the company.
              </Notice>
            )}

            {article.cta && (
              <div className="mt-8">
                <Button asChild variant="primary">
                  <Link to={article.cta.to}>
                    {article.cta.label}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            )}

            <div className="mt-10 max-w-2xl">
              <ShareRow title={article.title} />
            </div>

            <div className="mt-8 max-w-2xl">
              <Link to="/news" className="link-arrow">
                <ArrowLeft className="size-4" aria-hidden="true" />
                {t('common.viewAll')}
              </Link>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="border border-line p-6">
              <p className="flex items-center gap-2 text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-muted">
                <Tag className="size-3" aria-hidden="true" />
                {t('news.categories')}
              </p>
              <ul className="mt-4 space-y-1.5">
                {newsCategories
                  .filter((item) => item.id !== 'all')
                  .map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/news?category=${item.id}`}
                        className="flex items-center justify-between py-1.5 text-[0.8125rem] text-navy hover:text-gold-deep"
                      >
                        {item.label}
                        <ArrowRight className="size-3 text-gold-deep" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="bg-navy p-6 text-white">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-gold">
                {t('services.cta.eyebrow')}
              </p>
              <p className="mt-3 text-[0.9375rem] font-medium leading-snug">
                Work with the team behind these programmes.
              </p>
              <Button asChild variant="gold" className="mt-5 w-full">
                <Link to="/request-consultation">{t('nav.requestConsultation')}</Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section bg-canvas">
          <div className="shell">
            <h2 className="border-b border-line pb-5 text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">
              {t('news.related')}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <article key={item.slug} className="group border border-line bg-white">
                  <Link to={`/news/${item.slug}`} className="block aspect-[16/10] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <div className="p-5">
                    <time dateTime={item.date} className="text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-gold-deep">
                      {formatDate(item.date)}
                    </time>
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
