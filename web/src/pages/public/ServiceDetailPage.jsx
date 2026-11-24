import { ArrowRight, ArrowUpRight, Check, ChevronRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Reveal } from '@/components/common/Reveal'
import { NotFoundInline } from '@/components/common/StateBlocks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { getProjectBySlug } from '@/data/projects'
import { useService, useServices } from '@/data/services'
import { getCourseById, getDurationLabel } from '@/data/courses'

export function ServiceDetailPage() {
  const { slug } = useParams()
  const t = useT()
  const service = useService(slug)
  const allServices = useServices()

  usePageMeta({
    title: service?.title,
    description: service?.summary,
    image: service?.image,
  })

  if (!service) return <NotFoundInline />

  const relatedProjects = (service.relatedProjectSlugs ?? [])
    .map((item) => getProjectBySlug(item))
    .filter(Boolean)
  const relatedCourses = (service.relatedCourseIds ?? []).map((item) => getCourseById(item)).filter(Boolean)
  const others = allServices.filter((item) => item.slug !== service.slug)

  return (
    <>
      {/* Masthead */}
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <img
          src={service.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30"
        />
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
                  <Link to="/request-consultation">
                    {t('services.requestCta')}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline-invert">
                  <Link to="/services">{t('nav.allServices')}</Link>
                </Button>
              </div>
            </div>

            <div className="border border-white/15 bg-white/[0.04] p-6 backdrop-blur-sm">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-gold">
                {t('services.scope')}
              </p>
              <ul className="mt-4 space-y-2">
                {service.scope.slice(0, 5).map((item) => (
                  <li key={item} className="flex gap-2.5 text-[0.75rem] leading-snug text-white/65">
                    <Check className="mt-0.5 size-3 shrink-0 text-gold" aria-hidden="true" />
                    {item.split(' — ')[0]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Overview + scope */}
      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-20">
          <div>
            <p className="eyebrow">{t('projects.overview')}</p>
            <h2 className="mt-4 text-[clamp(1.6rem,2.8vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-navy">
              {t('services.scope')}
            </h2>
            <ul className="mt-8 divide-y divide-line border-t border-line">
              {service.scope.map((item, index) => (
                <li key={item} className="flex gap-5 py-5">
                  <span className="font-display text-[0.95rem] text-gold-deep">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[0.9375rem] leading-[1.75] text-ink/85">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-8">
            <Reveal>
              <div className="border border-line bg-canvas p-6">
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-muted">
                  {t('services.benefits')}
                </p>
                <ul className="mt-4 space-y-3.5">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-2.5 text-[0.8125rem] leading-relaxed text-ink/80">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="border border-line p-6">
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-muted">
                  {t('nav.services')}
                </p>
                <ul className="mt-3 divide-y divide-line">
                  {others.map((item) => (
                    <li key={item.slug}>
                      <Link
                        to={`/services/${item.slug}`}
                        className="group flex items-center justify-between gap-3 py-3 text-[0.8125rem] font-medium text-navy transition-colors hover:text-gold-deep"
                      >
                        {item.shortTitle}
                        <ChevronRight className="size-3.5 text-gold-deep transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-canvas">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow">{t('services.process')}</p>
            <h2 className="mt-4 text-[clamp(1.6rem,2.8vw,2.25rem)] font-semibold tracking-[-0.03em] text-navy">
              A structured engagement.
            </h2>
          </div>
          <ol className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.05} as="li">
                <div className="relative h-full bg-white p-7">
                  <span className="font-display text-[2rem] leading-none text-line-strong">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 text-[0.9375rem] font-semibold text-navy">{step.title}</h3>
                  <p className="mt-2 text-[0.8125rem] leading-[1.8] text-muted">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Related projects + courses */}
      <section className="section bg-white">
        <div className="shell space-y-16">
          {relatedProjects.length > 0 && (
            <div>
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
                <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">
                  {t('services.relatedProjects')}
                </h2>
                <Link to="/projects" className="link-arrow">
                  {t('common.viewAll')}
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {relatedProjects.map((project) => (
                  <article key={project.slug} className="group border border-line">
                    <Link to={`/projects/${project.slug}`} className="block aspect-[16/10] overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>
                    <div className="p-5">
                      <p className="text-[0.5rem] font-bold uppercase tracking-[0.14em] text-muted">
                        {project.year}
                      </p>
                      <h3 className="mt-2 text-[0.875rem] font-semibold leading-snug text-navy">
                        <Link to={`/projects/${project.slug}`}>{project.title}</Link>
                      </h3>
                      {project.client && (
                        <p className="mt-1.5 line-clamp-1 text-[0.6875rem] text-muted">{project.client}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {relatedCourses.length > 0 && (
            <div>
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
                <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">
                  {t('services.relatedTraining')}
                </h2>
                <Link to="/training" className="link-arrow">
                  {t('common.viewAll')}
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
              <ul className="mt-6 divide-y divide-line border-t border-line">
                {relatedCourses.map((course) => (
                  <li key={course.id}>
                    <Link
                      to={`/training/${course.id}`}
                      className="group flex flex-wrap items-center justify-between gap-3 py-4 transition-colors hover:bg-canvas/60"
                    >
                      <span className="flex min-w-0 items-center gap-4">
                        <span className="hidden size-12 shrink-0 overflow-hidden sm:block">
                          <img src={course.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[0.9375rem] font-medium text-navy">{course.title}</span>
                          <span className="mt-0.5 block text-[0.6875rem] text-muted">
                            {course.certificationBody ?? t('training.hero.eyebrow')}
                          </span>
                        </span>
                      </span>
                      <span className="flex items-center gap-4">
                        <Badge variant="outline">
                          {getDurationLabel(course)}
                        </Badge>
                        <ChevronRight className="size-4 text-gold-deep" aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

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
            <Link to="/request-consultation">
              {t('services.cta.button')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
