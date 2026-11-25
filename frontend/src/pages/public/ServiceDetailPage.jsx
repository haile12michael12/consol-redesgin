import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { ErrorState, LoadingState, NotFoundInline } from '@/components/common/StateBlocks'
import { Button } from '@/components/ui/button'
import { useService, useServices } from '@/hooks/useServices'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'

export function ServiceDetailPage() {
  const { slug } = useParams()
  const t = useT()
  const serviceQuery = useService(slug)
  const servicesQuery = useServices()
  const service = serviceQuery.data
  const otherServices = (servicesQuery.data ?? []).filter((item) => item.slug !== slug)

  usePageMeta({
    title: service?.title ?? 'Service details',
    description: service?.summary,
    image: service?.image,
  })

  if (serviceQuery.isPending) {
    return <LoadingState className="shell section" label="Loading service details…" />
  }

  if (serviceQuery.source === 'error') {
    if (serviceQuery.error?.status === 404) return <NotFoundInline />
    return (
      <div className="shell section">
        <ErrorState
          title="Service details are unavailable"
          text={serviceQuery.error?.message ?? t('common.errorText')}
          onRetry={() => serviceQuery.refetch()}
        />
      </div>
    )
  }

  if (!service) return <NotFoundInline />

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        {service.image && (
          <img
            src={service.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/95 to-navy/60" aria-hidden="true" />
        <div className="shell relative pb-14 pt-28 sm:pt-32 lg:pb-20 lg:pt-36">
          <Breadcrumbs
            items={[
              { label: t('nav.services'), to: '/services' },
              { label: service.title, to: `/services/${service.slug}` },
            ]}
            invert
            className="mb-8"
          />
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div>
              <p className="eyebrow eyebrow-invert">{t('services.hero.eyebrow')}</p>
              <h1 className="mt-4 max-w-3xl text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-white">
                {service.title}
              </h1>
              <p className="mt-6 max-w-2xl text-[1rem] leading-[1.8] text-white/65">{service.summary}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="gold">
                  <Link to={`/request-consultation?service=${encodeURIComponent(service.slug)}`}>
                    {t('services.requestCta')}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline-invert">
                  <Link to="/services">{t('nav.allServices')}</Link>
                </Button>
              </div>
            </div>

            {service.scope?.length > 0 && (
              <div className="border border-white/15 bg-white/[0.04] p-6 backdrop-blur-sm">
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-gold">
                  {t('services.scope')}
                </p>
                <ul className="mt-4 space-y-2">
                  {service.scope.slice(0, 5).map((item) => (
                    <li key={item} className="flex gap-2.5 text-[0.75rem] leading-snug text-white/65">
                      <Check className="mt-0.5 size-3 shrink-0 text-gold" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-20">
          <div>
            <p className="eyebrow">{t('projects.overview')}</p>
            <h2 className="mt-4 text-[clamp(1.6rem,2.8vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-navy">
              Service overview
            </h2>
            <p className="mt-5 max-w-3xl text-[0.9375rem] leading-[1.8] text-ink/80">
              {service.description || 'A more detailed description is pending publication by CONSOL.'}
            </p>

            <h2 className="mt-10 border-b border-line pb-4 text-[1.125rem] font-semibold text-navy">
              {t('services.scope')}
            </h2>
            {service.scope?.length ? (
              <ul className="divide-y divide-line border-b border-line">
                {service.scope.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex gap-5 py-5">
                    <span className="font-display text-[0.95rem] text-gold-deep">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[0.9375rem] leading-[1.75] text-ink/85">{item}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-5 text-[0.875rem] text-muted">A detailed scope is pending publication.</p>
            )}
          </div>

          <aside className="space-y-8">
            <div className="border border-line bg-canvas p-6">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-muted">
                {t('services.benefits')}
              </p>
              {service.benefits?.length ? (
                <ul className="mt-4 space-y-3.5">
                  {service.benefits.map((benefit, index) => (
                    <li key={`${benefit}-${index}`} className="flex gap-2.5 text-[0.8125rem] leading-relaxed text-ink/80">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">
                  Service benefits will be added when confirmed by CONSOL.
                </p>
              )}
            </div>

            <div className="border border-line p-6">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-muted">
                {t('nav.services')}
              </p>
              {servicesQuery.source === 'error' ? (
                <p className="mt-3 text-[0.8125rem] text-muted">Other services could not be loaded.</p>
              ) : otherServices.length ? (
                <ul className="mt-3 divide-y divide-line">
                  {otherServices.map((item) => (
                    <li key={item.slug}>
                      <Link
                        to={`/services/${item.slug}`}
                        className="group flex items-center justify-between gap-3 py-3 text-[0.8125rem] font-medium text-navy transition-colors hover:text-gold-deep"
                      >
                        {item.title}
                        <ChevronRight className="size-3.5 text-gold-deep transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-[0.8125rem] text-muted">No other published services are available.</p>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section className="section bg-canvas">
        <div className="shell grid gap-10 lg:grid-cols-2">
          <div className="border border-line bg-white p-7 sm:p-9">
            <p className="eyebrow">{t('services.process')}</p>
            <h2 className="mt-4 text-[1.4rem] font-semibold tracking-[-0.03em] text-navy">Delivery approach</h2>
            <p className="mt-3 text-[0.875rem] leading-relaxed text-muted">
              {service.deliveryApproach || 'The delivery approach is pending confirmation and publication by CONSOL.'}
            </p>
          </div>

          <div className="border border-line bg-white p-7 sm:p-9">
            <p className="eyebrow">Frequently asked questions</p>
            <h2 className="mt-4 text-[1.4rem] font-semibold tracking-[-0.03em] text-navy">FAQs</h2>
            {service.faqs?.length ? (
              <div className="mt-4 divide-y divide-line">
                {service.faqs.map((faq, index) => (
                  <details key={`${faq.question}-${index}`} className="py-4">
                    <summary className="cursor-pointer text-[0.875rem] font-semibold text-navy">
                      {faq.question}
                    </summary>
                    <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">{faq.answer}</p>
                  </details>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-[0.875rem] leading-relaxed text-muted">
                Frequently asked questions will be published when approved information is available.
              </p>
            )}
          </div>
        </div>
      </section>

      {service.relatedProjects?.length > 0 && (
        <section className="section bg-white">
          <div className="shell">
            <h2 className="border-b border-line pb-5 text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">
              {t('services.relatedProjects')}
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {service.relatedProjects.map((project) => (
                <article key={project.slug} className="border border-line p-5">
                  <p className="text-[0.5rem] font-bold uppercase tracking-[0.14em] text-muted">{project.year}</p>
                  <h3 className="mt-2 text-[0.9375rem] font-semibold leading-snug text-navy">{project.title}</h3>
                  {project.summary && <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{project.summary}</p>}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative isolate overflow-hidden bg-navy py-16 text-white">
        <div className="shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <p className="eyebrow eyebrow-invert">{t('services.cta.eyebrow')}</p>
            <h2 className="mt-4 text-[clamp(1.5rem,2.8vw,2.2rem)] font-semibold tracking-[-0.03em] text-white">
              {t('services.cta.title')}
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/60">{t('services.cta.text')}</p>
          </div>
          <Button asChild variant="gold" size="lg">
            <Link to={`/request-consultation?service=${encodeURIComponent(service.slug)}`}>
              {t('services.cta.button')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
