import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Expand,
  MapPin,
  UserRound,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Lightbox } from '@/components/common/Lightbox'
import { NotFoundInline, Notice } from '@/components/common/StateBlocks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { getProjectBySlug, getRelatedProjects, projectCategories } from '@/data/projects'
import { getServiceBySlug } from '@/data/services'

const galleryImages = [
  { src: '/media/site-inspection.jpg', alt: 'Engineers reviewing drawings on site' },
  { src: '/media/training.jpg', alt: 'Training session with participants' },
  { src: '/media/consultancy.jpg', alt: 'Consultation meeting in progress' },
  { src: '/media/conference.jpg', alt: 'Industry presentation' },
]

export function ProjectDetailPage() {
  const { slug } = useParams()
  const t = useT()
  const project = getProjectBySlug(slug)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  usePageMeta({
    title: project?.title,
    description: project?.summary,
    image: project?.image,
  })

  if (!project) return <NotFoundInline />

  const categoryLabel =
    projectCategories.find((item) => item.id === project.category)?.label ?? project.category
  const related = getRelatedProjects(project, 3)
  const serviceSlugs =
    project.category === 'business-management'
      ? ['business-management-consultancy']
      : project.category === 'construction-management'
        ? ['construction-management-consultancy']
        : project.category === 'capacity-development'
          ? ['professional-training', 'research-industry-development']
          : ['research-industry-development']
  const serviceLinks = serviceSlugs.map((item) => getServiceBySlug(item)).filter(Boolean)

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <img
          src={project.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/95 to-navy/70" aria-hidden="true" />
        <div className="shell relative pb-14 pt-28 sm:pt-32 lg:pb-20 lg:pt-36">
          <Breadcrumbs
            items={[
              { label: t('nav.projects'), to: '/projects' },
              { label: project.title, to: `/projects/${project.slug}` },
            ]}
            invert
            className="mb-8"
          />

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="bg-gold px-2.5 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-navy">
              {categoryLabel}
            </span>
            <span className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white/60">
              {project.source === 'demo' ? 'Illustrative record' : 'Published engagement'}
            </span>
            {project.source === 'demo' && <Badge variant="demo">{t('common.demo')}</Badge>}
          </div>

          <h1 className="mt-5 max-w-4xl text-[clamp(1.9rem,4.2vw,3.2rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-white">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-[0.9375rem] leading-[1.85] text-white/65">{project.summary}</p>

          <dl className="mt-10 grid max-w-3xl grid-cols-1 gap-px border border-white/15 bg-white/15 sm:grid-cols-3">
            <div className="bg-navy/80 px-5 py-4">
              <dt className="text-[0.5rem] font-bold uppercase tracking-[0.16em] text-white/60">
                {t('projects.client')}
              </dt>
              <dd className="mt-1.5 text-[0.8125rem] font-medium leading-snug text-white/90">
                {project.client ?? 'Not published'}
              </dd>
            </div>
            <div className="bg-navy/80 px-5 py-4">
              <dt className="text-[0.5rem] font-bold uppercase tracking-[0.16em] text-white/60">
                {t('projects.location')}
              </dt>
              <dd className="mt-1.5 flex items-start gap-1.5 text-[0.8125rem] font-medium leading-snug text-white/90">
                <MapPin className="mt-0.5 size-3 shrink-0 text-gold" aria-hidden="true" />
                {project.location ?? 'Not published'}
              </dd>
            </div>
            <div className="bg-navy/80 px-5 py-4">
              <dt className="text-[0.5rem] font-bold uppercase tracking-[0.16em] text-white/60">
                {t('projects.year')}
              </dt>
              <dd className="mt-1.5 flex items-center gap-1.5 text-[0.8125rem] font-medium text-white/90">
                <CalendarDays className="size-3 shrink-0 text-gold" aria-hidden="true" />
                {project.year}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20">
          <div>
            <p className="eyebrow">{t('projects.scope')}</p>
            <h2 className="mt-4 text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold tracking-[-0.03em] text-navy">
              What was delivered
            </h2>

            <ul className="mt-8 space-y-4">
              {project.scope.map((item) => (
                <li key={item} className="flex gap-3.5">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center border border-gold/40 bg-gold/10">
                    <Check className="size-3 text-gold-deep" aria-hidden="true" />
                  </span>
                  <p className="text-[0.9375rem] leading-[1.75] text-ink/85">{item}</p>
                </li>
              ))}
            </ul>

            {project.event && (
              <Notice className="mt-8" icon={CalendarDays}>
                {project.event}
              </Notice>
            )}

            {/* Gallery */}
            <div className="mt-12">
              <div className="flex items-end justify-between border-b border-line pb-4">
                <h2 className="text-[1.125rem] font-semibold text-navy">{t('projects.gallery')}</h2>
                <button
                  type="button"
                  onClick={() => {
                    setLightboxIndex(0)
                    setLightboxOpen(true)
                  }}
                  className="inline-flex items-center gap-1.5 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-navy hover:text-gold-deep"
                >
                  <Expand className="size-3.5" aria-hidden="true" />
                  View full size
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
                {galleryImages.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => {
                      setLightboxIndex(index)
                      setLightboxOpen(true)
                    }}
                    className={`group relative overflow-hidden bg-canvas ${index === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-[4/3]'}`}
                    aria-label={`${t('common.image')} ${index + 1}: ${image.alt}`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-navy/0 transition-colors group-hover:bg-navy/15" aria-hidden="true" />
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[0.6875rem] text-muted">{t('projects.noImage')}</p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="border border-line bg-canvas p-6">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-muted">
                {t('projects.services')}
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {project.services.map((service) => (
                  <li
                    key={service}
                    className="border border-line-strong bg-white px-2.5 py-1 text-[0.6875rem] font-medium text-navy"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-line p-6">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-muted">
                {t('services.hero.eyebrow')}
              </p>
              <ul className="mt-3 divide-y divide-line">
                {serviceLinks.map((service) => (
                  <li key={service.slug}>
                    <Link
                      to={`/services/${service.slug}`}
                      className="flex items-center justify-between gap-2 py-3 text-[0.8125rem] font-medium text-navy hover:text-gold-deep"
                    >
                      {service.shortTitle}
                      <ArrowUpRight className="size-3.5 text-gold-deep" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-navy p-6 text-white">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-gold">
                {t('services.cta.eyebrow')}
              </p>
              <p className="mt-3 text-[0.9375rem] font-medium leading-snug text-white">
                Discuss a similar engagement.
              </p>
              <Button asChild variant="gold" className="mt-5 w-full">
                <Link to="/request-consultation">
                  {t('nav.requestConsultation')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section bg-canvas">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
              <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">
                {t('projects.related')}
              </h2>
              <Button asChild variant="link" size="sm" className="h-auto p-0">
                <Link to="/projects">
                  <ArrowLeft className="size-3.5" aria-hidden="true" />
                  {t('common.viewAll')}
                </Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <article key={item.slug} className="group border border-line bg-white">
                  <Link to={`/projects/${item.slug}`} className="block aspect-[16/10] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <div className="p-5">
                    <p className="text-[0.5rem] font-bold uppercase tracking-[0.14em] text-gold-deep">
                      {projectCategories.find((cat) => cat.id === item.category)?.label} · {item.year}
                    </p>
                    <h3 className="mt-2 text-[0.9375rem] font-semibold leading-snug text-navy">
                      <Link to={`/projects/${item.slug}`}>{item.title}</Link>
                    </h3>
                    {item.client && (
                      <p className="mt-2 flex items-start gap-1.5 text-[0.6875rem] text-muted">
                        <UserRound className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                        <span className="line-clamp-2">{item.client}</span>
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <Lightbox
        images={galleryImages}
        index={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </>
  )
}
