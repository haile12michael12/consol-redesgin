import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, MapPin } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { NotFoundInline } from '@/components/common/StateBlocks'
import { ShareRow } from '@/components/news/ShareRow'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { formatDate } from '@/lib/utils'
import { events, getEventBySlug, getNewsBySlug } from '@/data/news'

export function EventDetailPage() {
  const { slug } = useParams()
  const t = useT()
  const event = getEventBySlug(slug)

  usePageMeta({
    title: event?.title,
    description: event?.summary,
    image: event?.image,
  })

  if (!event) return <NotFoundInline />

  const article = event.newsSlug ? getNewsBySlug(event.newsSlug) : null
  const others = events.filter((item) => item.slug !== event.slug).slice(0, 2)

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <img
          src={event.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/95 to-navy/70" aria-hidden="true" />
        <div className="shell relative pb-12 pt-28 sm:pt-32">
          <Breadcrumbs
            items={[
              { label: t('nav.events'), to: '/events' },
              { label: event.title, to: `/events/${event.slug}` },
            ]}
            invert
            className="mb-8"
          />
          <Badge variant="gold">{t('events.past')}</Badge>
          <h1 className="mt-4 max-w-3xl text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.09] tracking-[-0.04em] text-white">
            {event.title}
          </h1>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
            <div className="flex items-center gap-2.5">
              <CalendarDays className="size-4 text-gold" aria-hidden="true" />
              <div>
                <dt className="text-[0.5rem] font-bold uppercase tracking-[0.16em] text-white/60">Date</dt>
                <dd className="text-[0.8125rem] font-semibold text-white">{formatDate(event.date)}</dd>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="size-4 text-gold" aria-hidden="true" />
              <div>
                <dt className="text-[0.5rem] font-bold uppercase tracking-[0.16em] text-white/60">
                  {t('events.venue')}
                </dt>
                <dd className="text-[0.8125rem] font-semibold text-white">{event.location}</dd>
              </div>
            </div>
          </dl>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-16">
          <div>
            <div className="prose-consol max-w-2xl">
              <p>{event.summary}</p>
              {article && <p>{article.excerpt}</p>}
            </div>

            <div className="mt-8">
              <ShareRow title={event.title} />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link to="/events">
                  <ArrowLeft className="size-3.5" aria-hidden="true" />
                  {t('common.viewAll')}
                </Link>
              </Button>
              {article && (
                <Button asChild size="sm">
                  <Link to={`/news/${article.slug}`}>
                    {t('news.related')}
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="border border-line bg-canvas p-6">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-muted">
                {t('events.detail')}
              </p>
              <ul className="mt-4 space-y-3 text-[0.8125rem] text-ink/85">
                <li className="flex justify-between gap-4 border-b border-line pb-2.5">
                  <span className="text-muted">Status</span>
                  <span className="font-semibold text-navy">Completed</span>
                </li>
                <li className="flex justify-between gap-4 border-b border-line pb-2.5">
                  <span className="text-muted">Format</span>
                  <span className="font-semibold text-navy">Workshop</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="text-muted">Published by</span>
                  <span className="font-semibold text-navy">CONSOL</span>
                </li>
              </ul>
            </div>

            {others.length > 0 && (
              <div className="border border-line p-6">
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-muted">
                  {t('events.past')}
                </p>
                <ul className="mt-3 divide-y divide-line">
                  {others.map((item) => (
                    <li key={item.slug}>
                      <Link
                        to={`/events/${item.slug}`}
                        className="flex items-start justify-between gap-3 py-3 text-[0.8125rem] font-medium text-navy hover:text-gold-deep"
                      >
                        <span>{item.title}</span>
                        <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-gold-deep" aria-hidden="true" />
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
