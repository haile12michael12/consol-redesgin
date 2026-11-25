import { ArrowRight, ArrowUpRight, Calendar, CalendarDays, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/common/Reveal'
import { CardGridSkeleton, EmptyState, ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { Button } from '@/components/ui/button'
import { useEvents, useNews } from '@/hooks/useNews'
import { useT } from '@/i18n/LanguageProvider'
import { formatDate } from '@/lib/utils'

export function NewsSection() {
  const t = useT()
  const { data: newsItems, isPending: newsLoading, isError: newsError, refetch: refetchNews } = useNews({ per_page: 3 })
  const { data: eventItems, isPending: eventsLoading, isError: eventsError, refetch: refetchEvents } = useEvents({
    period: 'upcoming',
    per_page: 2,
  })

  const displayNews = newsItems?.data ?? []
  const [lead, ...rest] = displayNews
  const upcomingEvents = eventItems?.data ?? []

  return (
    <section className="section bg-canvas" aria-labelledby="news-heading">
      <div className="shell">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow">{t('home.news.eyebrow')}</p>
              <h2
                id="news-heading"
                className="mt-5 text-[clamp(1.9rem,3.4vw,2.7rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-navy"
              >
                {t('home.news.title')}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline">
                <Link to="/news">
                  {t('home.news.cta')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>

        {newsLoading && !displayNews.length ? (
          <div className="mt-12">
            <CardGridSkeleton count={3} />
          </div>
        ) : newsError && !displayNews.length ? (
          <div className="mt-12">
            <ErrorState onRetry={refetchNews} />
          </div>
        ) : !lead ? (
          <div className="mt-12">
            <EmptyState />
          </div>
        ) : (
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
            {lead && (
              <Reveal>
                <article className="group flex h-full flex-col bg-white border border-line p-6 sm:p-8">
                  <Link to={`/news/${lead.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-navy">
                    {lead.image && <img
                      src={lead.image}
                      alt={lead.imageAlt ?? ''}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-[1.03]"
                    />}
                    <span className="absolute left-4 top-4 bg-white/95 px-2.5 py-1 text-[0.5rem] font-bold uppercase tracking-[0.14em] text-navy">
                      {t('news.featured')}
                    </span>
                  </Link>
                  <div className="mt-5 flex items-center gap-3 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-muted">
                    <span className="text-gold-deep">{lead.categoryName}</span>
                    <span className="h-3 w-px bg-line-strong" aria-hidden="true" />
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-3" aria-hidden="true" />
                      {formatDate(lead.date)}
                    </span>
                  </div>
                  <h3 className="mt-3 text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-navy sm:text-[1.35rem]">
                    <Link to={`/news/${lead.slug}`} className="transition-colors hover:text-gold-deep">
                      {lead.title}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 text-[0.875rem] leading-[1.8] text-muted">{lead.excerpt}</p>
                  <div className="mt-6 border-t border-line pt-4">
                    <Link
                      to={`/news/${lead.slug}`}
                      className="inline-flex items-center gap-1.5 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-navy hover:text-gold-deep"
                    >
                      {t('common.readMore')}
                      <ArrowUpRight className="size-3 text-gold-deep" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            )}

            <div className="space-y-6">
              {/* Secondary News articles */}
              <ul className="divide-y divide-line border border-line bg-white px-6">
                {rest.map((article, index) => (
                  <Reveal key={article.slug} delay={0.08 * (index + 1)} as="li">
                    <article className="group py-5">
                      <div className="flex items-center gap-3 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-muted">
                        <span className="text-gold-deep">{article.categoryName}</span>
                        <span aria-hidden="true">·</span>
                        <time dateTime={article.date}>{formatDate(article.date)}</time>
                      </div>
                      <h3 className="mt-2 text-[0.9375rem] font-semibold leading-snug text-navy">
                        <Link to={`/news/${article.slug}`} className="transition-colors hover:text-gold-deep">
                          {article.title}
                        </Link>
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-muted">{article.excerpt}</p>
                      <Link
                        to={`/news/${article.slug}`}
                        className="mt-2.5 inline-flex items-center gap-1.5 text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-navy transition-colors hover:text-gold-deep"
                      >
                        {t('common.readMore')}
                        <ArrowUpRight className="size-3" aria-hidden="true" />
                      </Link>
                    </article>
                  </Reveal>
                ))}
              </ul>

              {/* Upcoming Events Box */}
              {eventsLoading ? (
                <LoadingState label="Loading confirmed events…" />
              ) : eventsError ? (
                <ErrorState
                  title="Upcoming events are unavailable"
                  onRetry={refetchEvents}
                />
              ) : upcomingEvents.length > 0 && (
                <div className="border border-line bg-white p-6">
                  <div className="flex items-center justify-between pb-3 border-b border-line">
                    <h3 className="flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-navy">
                      <Calendar className="size-3.5 text-gold-deep" aria-hidden="true" />
                      Upcoming Events & Testing
                    </h3>
                    <Link
                      to="/events"
                      className="text-[0.625rem] font-bold uppercase tracking-[0.12em] text-gold-deep hover:underline"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="mt-4 space-y-4">
                    {upcomingEvents.map((evt) => (
                      <div key={evt.slug} className="group flex items-start gap-4">
                        <div className="flex size-11 shrink-0 flex-col items-center justify-center bg-navy text-white">
                          <span className="text-[0.5rem] uppercase font-bold text-gold">
                            {new Date(evt.startsAt).toLocaleString('default', { month: 'short' })}
                          </span>
                          <span className="text-[0.875rem] font-bold leading-none">
                            {new Date(evt.startsAt).getDate()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[0.8125rem] font-semibold text-navy group-hover:text-gold-deep">
                            <Link to={`/events/${evt.slug}`}>{evt.title}</Link>
                          </h4>
                          <p className="mt-1 text-[0.6875rem] text-muted flex items-center gap-1.5">
                            <MapPin className="size-3" />
                            {evt.venue}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
