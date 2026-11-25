import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/common/Reveal'
import { SectionHeading } from '@/components/common/SectionHeading'
import { CardGridSkeleton, EmptyState, ErrorState } from '@/components/common/StateBlocks'
import { Button } from '@/components/ui/button'
import { useServices } from '@/hooks/useServices'
import { useT } from '@/i18n/LanguageProvider'

export function ServicesSection() {
  const t = useT()
  const { data: rawServices, isLoading, error, refetch } = useServices()

  const services = (rawServices || []).map((service) => ({
    ...service,
    title: service.titleKey ? t(service.titleKey) : service.title,
    summary: service.summaryKey ? t(service.summaryKey) : service.summary,
  }))

  return (
    <section className="section bg-white" aria-labelledby="services-heading">
      <div className="shell">
        <SectionHeading
          eyebrow={t('home.services.eyebrow')}
          title={<span id="services-heading">{t('home.services.title')}</span>}
          text={t('home.services.text')}
          action={
            <Button asChild variant="outline">
              <Link to="/services">
                {t('home.services.cta')}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          }
        />

        {isLoading && !services.length ? (
          <div className="mt-14">
            <CardGridSkeleton count={4} />
          </div>
        ) : error && !services.length ? (
          <div className="mt-14">
            <ErrorState onRetry={refetch} />
          </div>
        ) : services.length === 0 ? (
          <div className="mt-14">
            <EmptyState />
          </div>
        ) : (
          <div className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.05} className="h-full">
                <article className="group relative flex h-full flex-col bg-white transition-colors duration-500 hover:bg-canvas">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.imageAlt ?? service.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.045]"
                    />
                    <span className="absolute left-4 top-4 inline-flex size-7 items-center justify-center bg-navy/85 font-display text-[0.8125rem] text-gold backdrop-blur-sm">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.015em] text-navy">
                      <Link to={`/services/${service.slug}`} className="after:absolute after:inset-0">
                        {service.title}
                      </Link>
                    </h3>
                    <p className="mt-3 flex-1 text-[0.8125rem] leading-[1.75] text-muted">{service.summary}</p>
                    <span className="mt-6 inline-flex items-center gap-2 border-t border-line pt-4 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-navy">
                      {t('common.readMore')}
                      <ArrowUpRight
                        className="size-3.5 text-gold-deep transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
