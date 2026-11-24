import { ArrowRight, ArrowUpRight, CalendarDays, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '@/components/common/PageHero'
import { Notice } from '@/components/common/StateBlocks'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { events } from '@/data/news'

export function EventsPage() {
  const t = useT()
  usePageMeta({
    title: 'Events & Industry Sessions',
    description:
      'Programme launches, completion workshops and industry sessions published by Construction Solutions PLC.',
    image: '/media/conference.jpg',
  })

  const past = [...events].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <>
      <PageHero
        eyebrow={t('events.hero.eyebrow')}
        title={t('events.hero.title')}
        text={t('events.hero.text')}
        breadcrumbs={[{ label: t('nav.events'), to: '/events' }]}
        image={{ src: '/media/conference.jpg', alt: 'Industry event stage' }}
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
            eyebrow={t('events.upcoming')}
            title="Upcoming sessions"
            text={t('events.none')}
          />

          <Notice className="mt-8" tone="demo">
            No upcoming public events are open for registration at this time. CONSOL publishes its quarterly training
            plan on the website and social media; in-company sessions are scheduled on request.
          </Notice>

          <div className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
              <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">{t('events.past')}</h2>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">
                {past.length} events
              </p>
            </div>

            <ul className="divide-y divide-line">
              {past.map((event) => (
                <li key={event.slug}>
                  <Link
                    to={`/events/${event.slug}`}
                    className="group grid gap-5 py-6 transition-colors hover:bg-canvas/50 sm:grid-cols-[8.5rem_1fr_auto] sm:items-center sm:gap-6"
                  >
                    <div className="flex items-center gap-3 sm:block">
                      <p className="font-display text-[1.6rem] leading-none text-navy">
                        {new Date(event.date).getUTCDate()}
                      </p>
                      <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-gold-deep">
                        {new Date(event.date).toLocaleString('en', { month: 'short', timeZone: 'UTC' })} {new Date(event.date).getUTCFullYear()}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-[1rem] font-semibold leading-snug text-navy transition-colors group-hover:text-gold-deep">
                        {event.title}
                      </h3>
                      <p className="mt-1.5 max-w-2xl text-[0.8125rem] leading-relaxed text-muted">{event.summary}</p>
                      <p className="mt-2 flex items-center gap-1.5 text-[0.6875rem] text-muted">
                        <MapPin className="size-3 text-gold-deep" aria-hidden="true" />
                        {event.location}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-navy">
                      {t('events.detail')}
                      <ArrowUpRight className="size-3.5 text-gold-deep transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/news">
                <CalendarDays className="size-4" aria-hidden="true" />
                {t('nav.newsInsights')}
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/training">{t('nav.training')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
