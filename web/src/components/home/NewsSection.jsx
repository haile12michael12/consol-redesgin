import { ArrowRight, ArrowUpRight, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/common/Reveal'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { formatDate } from '@/lib/utils'
import { news, newsCategories } from '@/data/news'

export function NewsSection() {
  const t = useT()
  const [lead, ...rest] = news.slice(0, 3)

  const categoryLabel = (id) => newsCategories.find((item) => item.id === id)?.label ?? id

  return (
    <section className="section bg-canvas" aria-labelledby="news-heading">
      <div className="shell">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">{t('home.news.eyebrow')}</p>
            <h2
              id="news-heading"
              className="mt-5 text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-navy"
            >
              {t('home.news.title')}
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link to="/news">
              {t('home.news.cta')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
          {lead && (
            <Reveal>
              <article className="group">
                <Link to={`/news/${lead.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-navy">
                  <img
                    src={lead.image}
                    alt={lead.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-[1.03]"
                  />
                  <span className="absolute left-4 top-4 bg-white/95 px-2.5 py-1 text-[0.5rem] font-bold uppercase tracking-[0.14em] text-navy">
                    {t('news.featured')}
                  </span>
                </Link>
                <div className="mt-5 flex items-center gap-3 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-muted">
                  <span className="text-gold-deep">{categoryLabel(lead.category)}</span>
                  <span className="h-3 w-px bg-line-strong" aria-hidden="true" />
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-3" aria-hidden="true" />
                    {formatDate(lead.date)}
                  </span>
                </div>
                <h3 className="mt-3 max-w-xl text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-navy sm:text-[1.45rem]">
                  <Link to={`/news/${lead.slug}`} className="transition-colors hover:text-gold-deep">
                    {lead.title}
                  </Link>
                </h3>
                <p className="mt-3 max-w-xl text-[0.875rem] leading-[1.8] text-muted">{lead.excerpt}</p>
              </article>
            </Reveal>
          )}

          <ul className="divide-y divide-line-strong border-t border-line-strong lg:border-t-0">
            {rest.map((article, index) => (
              <Reveal key={article.slug} delay={0.08 * (index + 1)} as="li">
                <article className="group py-6 first:pt-0 lg:first:pt-0">
                  <div className="flex items-center gap-3 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-muted">
                    <span className="text-gold-deep">{categoryLabel(article.category)}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={article.date}>{formatDate(article.date)}</time>
                  </div>
                  <h3 className="mt-2.5 text-[1.0625rem] font-semibold leading-snug text-navy">
                    <Link to={`/news/${article.slug}`} className="transition-colors hover:text-gold-deep">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed text-muted">{article.excerpt}</p>
                  <Link
                    to={`/news/${article.slug}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-navy transition-colors hover:text-gold-deep"
                  >
                    {t('common.readMore')}
                    <ArrowUpRight className="size-3" aria-hidden="true" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
