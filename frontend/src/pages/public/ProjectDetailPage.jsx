import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Expand,
  MapPin,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Lightbox } from '@/components/common/Lightbox'
import { ErrorState, LoadingState, NotFoundInline, Notice } from '@/components/common/StateBlocks'
import { Button } from '@/components/ui/button'
import { useProject } from '@/hooks/useProjects'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'

const illustrativeImage = '/media/conference.jpg'

export function ProjectDetailPage() {
  const { slug } = useParams()
  const t = useT()
  const query = useProject(slug)
  const project = query.data
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const images = project?.images?.length
    ? project.images.map((image) => ({ src: image.url, alt: image.alt || project.title }))
    : project
      ? [{
          src: illustrativeImage,
          alt: `Illustrative photograph only, not a photograph of ${project.title}`,
        }]
      : []

  usePageMeta({
    title: project?.seoTitle || project?.title,
    description: project?.seoDescription || project?.summary,
    image: project?.coverImage || illustrativeImage,
    path: project ? `/projects/${project.slug}` : undefined,
  })

  if (query.isPending) {
    return <div className="shell section"><LoadingState label="Loading project…" /></div>
  }
  if (query.isError) {
    if (query.error?.response?.status === 404) return <NotFoundInline />
    return (
      <div className="shell section">
        <ErrorState
          title="Project could not be loaded"
          text={query.error?.response?.data?.message ?? 'The CONSOL projects service could not be reached.'}
          onRetry={() => query.refetch()}
        />
      </div>
    )
  }
  if (!project) return <NotFoundInline />

  const categories = project.categories ?? []
  const scope = project.scope ?? []
  const services = project.services ?? []
  const outcomes = project.outcomes ?? []
  const related = project.relatedProjects ?? []

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <img
          src={project.coverImage || illustrativeImage}
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
            {categories.map((category) => (
              <span
                key={category.id}
                className="bg-gold px-2.5 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-navy"
              >
                {category.name}
              </span>
            ))}
            {!project.coverImage && (
              <span className="border border-white/30 px-2.5 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-white/75">
                Illustrative photo
              </span>
            )}
          </div>
          <h1 className="mt-5 max-w-4xl text-[clamp(1.9rem,4.2vw,3.2rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-white">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-[0.9375rem] leading-[1.85] text-white/65">{project.summary}</p>

          <dl className="mt-10 grid max-w-4xl grid-cols-1 gap-px border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
            <ProjectFact label={t('projects.client')} value={project.client || 'Not approved for publication'} />
            <ProjectFact
              label={t('projects.location')}
              value={project.location || 'Not approved for publication'}
              Icon={MapPin}
            />
            <ProjectFact label="Duration" value={project.duration || 'Not available'} />
            <ProjectFact
              label={t('projects.year')}
              value={project.year || 'Not available'}
              Icon={CalendarDays}
            />
          </dl>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20">
          <div>
            <p className="eyebrow">{t('projects.scope')}</p>
            <h2 className="mt-4 text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold tracking-[-0.03em] text-navy">
              Project overview
            </h2>
            <p className="mt-6 whitespace-pre-line text-[0.9375rem] leading-[1.85] text-ink/85">
              {project.overview || project.summary}
            </p>

            <h2 className="mt-10 text-[1.125rem] font-semibold text-navy">Scope of work</h2>
            {scope.length ? (
              <ul className="mt-5 space-y-4">
                {scope.map((item) => (
                  <li key={item} className="flex gap-3.5">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center border border-gold/40 bg-gold/10">
                      <Check className="size-3 text-gold-deep" aria-hidden="true" />
                    </span>
                    <p className="text-[0.9375rem] leading-[1.75] text-ink/85">{item}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">No scope details have been published for this project.</p>
            )}

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
                {images.map((image, index) => (
                  <button
                    key={`${image.src}-${index}`}
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
                    {!project.coverImage && (
                      <span className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 text-[0.5rem] font-bold uppercase tracking-[0.1em] text-navy">
                        Illustrative image
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {!project.coverImage && (
                <Notice className="mt-3">
                  Illustrative imagery is shown because no project-specific photograph has been provided.
                </Notice>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="border border-line bg-canvas p-6">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-muted">
                {t('projects.services')}
              </p>
              {services.length ? (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {services.map((service) => (
                    <li
                      key={service}
                      className="border border-line-strong bg-white px-2.5 py-1 text-[0.6875rem] font-medium text-navy"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted">No services have been published for this project.</p>
              )}
            </div>

            <div className="border border-line p-6">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-muted">
                Documented outcomes
              </p>
              {outcomes.length ? (
                <ul className="mt-4 space-y-3">
                  {outcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-2.5 text-[0.8125rem] leading-relaxed text-ink/80">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-gold-deep" aria-hidden="true" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">
                  No approved project outcomes have been provided for publication.
                </p>
              )}
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
                <article key={item.id} className="group border border-line bg-white">
                  <Link to={`/projects/${item.slug}`} className="relative block aspect-[16/10] overflow-hidden">
                    <img
                      src={item.coverImage || illustrativeImage}
                      alt={item.coverImage ? item.coverImageAlt || item.title : `Illustrative photograph, not a photograph of ${item.title}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {!item.coverImage && (
                      <span className="absolute right-3 top-3 bg-white/90 px-2 py-1 text-[0.5rem] font-bold uppercase tracking-[0.1em] text-navy">
                        Illustrative image
                      </span>
                    )}
                  </Link>
                  <div className="p-5">
                    <p className="text-[0.5rem] font-bold uppercase tracking-[0.14em] text-gold-deep">
                      {item.categories?.map((category) => category.name).join(' · ')}
                      {item.year && ` · ${item.year}`}
                    </p>
                    <h3 className="mt-2 text-[0.9375rem] font-semibold leading-snug text-navy">
                      <Link to={`/projects/${item.slug}`}>{item.title}</Link>
                    </h3>
                    {item.client && (
                      <p className="mt-2 flex items-start gap-1.5 text-[0.6875rem] text-muted">
                        <MapPin className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
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
        images={images}
        index={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </>
  )
}

function ProjectFact({ label, value, Icon }) {
  return (
    <div className="bg-navy/80 px-5 py-4">
      <dt className="text-[0.5rem] font-bold uppercase tracking-[0.16em] text-white/60">{label}</dt>
      <dd className="mt-1.5 flex items-start gap-1.5 text-[0.8125rem] font-medium leading-snug text-white/90">
        {Icon && <Icon className="mt-0.5 size-3 shrink-0 text-gold" aria-hidden="true" />}
        {value}
      </dd>
    </div>
  )
}
