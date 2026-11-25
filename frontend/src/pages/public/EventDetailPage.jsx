import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, MapPin } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { ErrorState, LoadingState, NotFoundInline } from '@/components/common/StateBlocks'
import { ShareRow } from '@/components/news/ShareRow'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useEvent } from '@/hooks/useNews'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { formatDate } from '@/lib/utils'

export function EventDetailPage() {
  const { slug } = useParams()
  const t = useT()
  const eventQuery = useEvent(slug)
  const event = eventQuery.data

  usePageMeta({
    title: event?.seoTitle || event?.title,
    description: event?.seoDescription || event?.summary,
    image: event?.image,
    jsonLd: event
      ? {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: event.title,
          startDate: event.startsAt,
          endDate: event.endsAt || undefined,
          location: { '@type': 'Place', name: event.venue },
          description: event.summary,
          url: event.registrationUrl || undefined,
          organizer: { '@type': 'Organization', name: 'Construction Solutions PLC' },
        }
      : null,
  })

  if (eventQuery.isPending) return <LoadingState className="shell section" label="Loading event…" />
  if (eventQuery.isError) {
    if (eventQuery.error?.response?.status === 404) return <NotFoundInline />
    return <div className="shell section"><ErrorState title="Event could not be loaded" onRetry={eventQuery.refetch} /></div>
  }
  if (!event) return <NotFoundInline />

  const isPast = new Date(event.endsAt || event.startsAt).getTime() < Date.now()
  const relatedEvents = event.relatedEvents ?? []

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        {event.image && <img src={event.image} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-20" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/95 to-navy/70" aria-hidden="true" />
        <div className="shell relative pb-12 pt-28 sm:pt-32">
          <Breadcrumbs
            items={[{ label: t('nav.events'), to: '/events' }, { label: event.title, to: `/events/${event.slug}` }]}
            invert
            className="mb-8"
          />
          <Badge variant="gold">{isPast ? t('events.past') : t('events.upcoming')}</Badge>
          <h1 className="mt-4 max-w-3xl text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.09] tracking-[-0.04em] text-white">{event.title}</h1>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
            <div className="flex items-center gap-2.5">
              <CalendarDays className="size-4 text-gold" aria-hidden="true" />
              <div>
                <dt className="text-[0.5rem] font-bold uppercase tracking-[0.16em] text-white/60">Date</dt>
                <dd className="text-[0.8125rem] font-semibold text-white">{formatDate(event.startsAt)}</dd>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="size-4 text-gold" aria-hidden="true" />
              <div>
                <dt className="text-[0.5rem] font-bold uppercase tracking-[0.16em] text-white/60">{t('events.venue')}</dt>
                <dd className="text-[0.8125rem] font-semibold text-white">{event.venue}</dd>
              </div>
            </div>
          </dl>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
          <article>
            {event.image && (
              <div className="mb-8 aspect-[16/8] overflow-hidden bg-canvas">
                <img src={event.image} alt={event.imageAlt ?? ''} className="h-full w-full object-cover" fetchPriority="high" />
              </div>
            )}
            <div className="prose-consol max-w-2xl">
              <p>{event.summary}</p>
              {(event.body ?? []).map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 40)}`}>{paragraph}</p>)}
            </div>
            <div className="mt-8"><ShareRow title={event.title} /></div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link to="/events"><ArrowLeft className="size-3.5" aria-hidden="true" />{t('common.viewAll')}</Link>
              </Button>
              {event.registrationUrl && !isPast && (
                <Button asChild size="sm">
                  <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
                    Register for event<ArrowRight className="size-3.5" aria-hidden="true" />
                  </a>
                </Button>
              )}
            </div>
          </article>

          <aside className="space-y-6">
            <div className="border border-line bg-canvas p-6">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-muted">{t('events.detail')}</p>
              <dl className="mt-4 space-y-3 text-[0.8125rem] text-ink/85">
                <div className="flex justify-between gap-4 border-b border-line pb-2.5">
                  <dt className="text-muted">Status</dt><dd className="font-semibold text-navy">{isPast ? 'Past event' : 'Upcoming'}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line pb-2.5">
                  <dt className="text-muted">Venue</dt><dd className="text-right font-semibold text-navy">{event.venue}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Published by</dt><dd className="font-semibold text-navy">CONSOL</dd>
                </div>
              </dl>
              {event.registrationUrl && !isPast && (
                <Button asChild className="mt-5 w-full">
                  <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">Register for event<ArrowRight className="size-4" aria-hidden="true" /></a>
                </Button>
              )}
            </div>

            {relatedEvents.length > 0 && (
              <div className="border border-line p-6">
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-muted">{t('events.related')}</p>
                <ul className="mt-3 divide-y divide-line">
                  {relatedEvents.map((item) => (
                    <li key={item.slug}>
                      <Link to={`/events/${item.slug}`} className="flex items-start justify-between gap-3 py-3 text-[0.8125rem] font-medium text-navy hover:text-gold-deep">
                        <span>{item.title}</span><ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-gold-deep" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  )
}
