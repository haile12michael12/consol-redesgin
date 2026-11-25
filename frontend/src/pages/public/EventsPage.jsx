import { ArrowRight, ArrowUpRight, CalendarDays, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '@/components/common/PageHero'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Button } from '@/components/ui/button'
import { useEvents } from '@/hooks/useNews'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { formatDate } from '@/lib/utils'

export function EventsPage() {
  const t = useT()
  const upcomingQuery = useEvents({ period: 'upcoming', per_page: 12 })
  const pastQuery = useEvents({ period: 'past', per_page: 12 })
  const upcoming = upcomingQuery.data?.data ?? []
  const past = pastQuery.data?.data ?? []
  const loading = upcomingQuery.isPending || pastQuery.isPending
  const errorQuery = upcomingQuery.isError ? upcomingQuery : pastQuery

  usePageMeta({
    title: 'Events',
    description: 'Upcoming and past public events published by Construction Solutions PLC.',
  })

  return (
    <>
      <PageHero
        eyebrow={t('events.hero.eyebrow')}
        title={t('events.hero.title')}
        text={t('events.hero.text')}
        breadcrumbs={[{ label: t('nav.events'), to: '/events' }]}
        image={{ src: '/media/conference.jpg', alt: 'Company events' }}
        actions={(
          <Button asChild variant="gold">
            <Link to="/request-consultation">{t('nav.requestConsultation')}<ArrowRight className="size-4" aria-hidden="true" /></Link>
          </Button>
        )}
      />

      <section className="section bg-white">
        <div className="shell">
          <SectionHeading eyebrow={t('events.upcoming')} title="Upcoming events" text="Only confirmed public events are listed." />
          {loading ? (
            <LoadingState className="mt-8" label="Loading events…" />
          ) : errorQuery.isError ? (
            <ErrorState className="mt-8" title="Events could not be loaded" onRetry={() => {
              upcomingQuery.refetch()
              pastQuery.refetch()
            }} />
          ) : upcoming.length === 0 ? (
            <EmptyState className="mt-8" title="No upcoming events published" text="Confirmed event dates and venues will appear here once approved for publication." />
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {upcoming.map((event) => (
                <article key={event.slug} className="grid border border-line sm:grid-cols-[10rem_1fr]">
                  {event.image ? (
                    <img src={event.image} alt={event.imageAlt ?? ''} className="h-full min-h-40 w-full object-cover" loading="lazy" />
                  ) : <div className="min-h-40 bg-gradient-to-br from-navy to-navy-soft" aria-hidden="true" />}
                  <div className="flex flex-col p-5">
                    <time dateTime={event.startsAt} className="flex items-center gap-2 text-[0.6875rem] font-semibold text-gold-deep">
                      <CalendarDays className="size-3.5" aria-hidden="true" />{formatDate(event.startsAt)}
                    </time>
                    <h2 className="mt-3 text-lg font-semibold leading-snug text-navy">
                      <Link to={`/events/${event.slug}`} className="hover:text-gold-deep">{event.title}</Link>
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{event.summary}</p>
                    <p className="mt-4 flex items-center gap-2 text-xs text-muted">
                      <MapPin className="size-3.5 text-gold-deep" aria-hidden="true" />{event.venue}
                    </p>
                    <Link to={`/events/${event.slug}`} className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-navy">
                      {t('events.detail')}<ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
              <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">{t('events.past')}</h2>
              {!loading && !errorQuery.isError && <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">{past.length} events</p>}
            </div>
            {loading ? (
              <LoadingState className="mt-6" label="Loading past events…" />
            ) : errorQuery.isError ? null : past.length === 0 ? (
              <EmptyState className="mt-6" title="No past events published" text="Past events will be listed here after CONSOL publishes their approved details." />
            ) : (
              <ul className="divide-y divide-line">
                {past.map((event) => (
                  <li key={event.slug}>
                    <Link to={`/events/${event.slug}`} className="group grid gap-5 py-6 transition-colors hover:bg-canvas/50 sm:grid-cols-[8.5rem_1fr_auto] sm:items-center sm:gap-6">
                      <div className="flex items-center gap-3 sm:block">
                        <p className="font-display text-[1.6rem] leading-none text-navy">{new Date(event.startsAt).getUTCDate()}</p>
                        <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-gold-deep">
                          {new Date(event.startsAt).toLocaleString('en', { month: 'short', timeZone: 'UTC' })} {new Date(event.startsAt).getUTCFullYear()}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-[1rem] font-semibold leading-snug text-navy group-hover:text-gold-deep">{event.title}</h3>
                        <p className="mt-1.5 max-w-2xl text-[0.8125rem] leading-relaxed text-muted">{event.summary}</p>
                        <p className="mt-2 flex items-center gap-1.5 text-[0.6875rem] text-muted">
                          <MapPin className="size-3 text-gold-deep" aria-hidden="true" />{event.venue}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-navy">
                        {t('events.detail')}<ArrowUpRight className="size-3.5 text-gold-deep" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Button asChild variant="outline"><Link to="/news"><CalendarDays className="size-4" aria-hidden="true" />{t('nav.newsInsights')}</Link></Button>
            <Button asChild variant="ghost"><Link to="/training">{t('nav.training')}</Link></Button>
          </div>
        </div>
      </section>
    </>
  )
}
