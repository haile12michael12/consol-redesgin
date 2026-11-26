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
import { ErrorState, LoadingState, NotFoundInline } from '@/components/common/StateBlocks'
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
  const images = (project?.images ?? []).map((image) => ({
    src: image.url,
    alt: image.alt || project.title,
  }))

  usePageMeta({
    title: project?.seoTitle || project?.title,
    description: project?.seoDescription || project?.summary,
    image: project?.coverImage || illustrativeImage,
    path: project ? `/projects/${project.slug}` : undefined,
  })

  if (query.isPending) {
    return <div className="shell section"><LoadingState label={t('projects.loading')} /></div>
  }
  if (query.isError) {
    if (query.error?.response?.status === 404) return <NotFoundInline />
    return (
      <div className="shell section">
        <ErrorState
          title={t('projects.detailError')}
          text={query.error?.response?.data?.message ?? t('projects.apiUnavailable')}
          onRetry={() => query.refetch()}
        />
      </div>
    )
  }
  if (!project) return <NotFoundInline />

  const categories = project.categories ?? []
  const scope = project.scope ?? []
  const services = project.services ?? []
  const objectives = project.objectives ?? []
  const milestones = project.milestones ?? []
  const outcomes = project.outcomes ?? []
  const related = project.relatedProjects ?? []
  const projectDate = project.projectDate || project.year

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
            {project.projectType && (
              <span className="bg-gold px-2.5 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-navy">
                {project.projectType}
              </span>
            )}
            {categories.map((category) => (
              <span
                key={category.id}
                className="border border-white/25 px-2.5 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-white/75"
              >
                {category.name}
              </span>
            ))}
            {!project.coverImage && (
              <span className="border border-white/30 px-2.5 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-white/75">
                {t('projects.illustrativeImage')}
              </span>
            )}
          </div>
          <h1 className="mt-5 max-w-4xl text-[clamp(1.9rem,4.2vw,3.8rem)] font-semibold leading-[1.08] tracking-[-0.045em] text-white">
            {project.title}
          </h1>
          {project.summary && (
            <p className="mt-6 max-w-2xl text-[0.9375rem] leading-[1.85] text-white/70">{project.summary}</p>
          )}

          <dl className="mt-10 flex max-w-5xl flex-wrap gap-x-10 gap-y-5 border-t border-white/20 pt-5">
            {project.client && <ProjectFact label={t('projects.client')} value={project.client} />}
            {project.location && <ProjectFact label={t('projects.location')} value={project.location} Icon={MapPin} />}
            {projectDate && <ProjectFact label={t('projects.date')} value={projectDate} Icon={CalendarDays} />}
            {project.duration && <ProjectFact label={t('projects.duration')} value={project.duration} />}
          </dl>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
          <main className="min-w-0">
            <CaseSection eyebrow={t('projects.overview')} title={t('projects.overviewTitle')}>
              <p className="whitespace-pre-line text-[0.9375rem] leading-[1.9] text-ink/85">
                {project.overview || project.summary}
              </p>
            </CaseSection>

            {(project.context || objectives.length > 0) && (
              <CaseSection eyebrow={t('projects.contextEyebrow')} title={t('projects.contextTitle')}>
                {project.context && (
                  <p className="whitespace-pre-line text-[0.9375rem] leading-[1.9] text-ink/85">{project.context}</p>
                )}
                {objectives.length > 0 && (
                  <div className={project.context ? 'mt-7' : ''}>
                    <h3 className="text-sm font-semibold text-navy">{t('projects.objectives')}</h3>
                    <ul className="mt-4 space-y-3">
                      {objectives.map((objective) => (
                        <CaseListItem key={objective}>{objective}</CaseListItem>
                      ))}
                    </ul>
                  </div>
                )}
              </CaseSection>
            )}

            {project.challenge && (
              <CaseSection eyebrow={t('projects.challengeEyebrow')} title={t('projects.challengeTitle')}>
                <p className="whitespace-pre-line text-[0.9375rem] leading-[1.9] text-ink/85">{project.challenge}</p>
              </CaseSection>
            )}

            {(scope.length > 0 || services.length > 0) && (
              <CaseSection eyebrow={t('projects.roleEyebrow')} title={t('projects.roleTitle')}>
                {services.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-navy">{t('projects.services')}</h3>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {services.map((service) => (
                        <li key={service} className="flex gap-2.5 border-l border-gold pl-3 text-sm leading-relaxed text-ink/85">
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {scope.length > 0 && (
                  <div className={services.length ? 'mt-8' : ''}>
                    <h3 className="text-sm font-semibold text-navy">{t('projects.scope')}</h3>
                    <ul className="mt-4 space-y-3">
                      {scope.map((item) => <CaseListItem key={item}>{item}</CaseListItem>)}
                    </ul>
                  </div>
                )}
              </CaseSection>
            )}

            {project.approach && (
              <CaseSection eyebrow={t('projects.approachEyebrow')} title={t('projects.approachTitle')}>
                <p className="whitespace-pre-line text-[0.9375rem] leading-[1.9] text-ink/85">{project.approach}</p>
              </CaseSection>
            )}

            {milestones.length > 0 && (
              <CaseSection eyebrow={t('projects.timelineEyebrow')} title={t('projects.timelineTitle')}>
                <ol className="relative ml-2 space-y-0 border-l border-line-strong">
                  {milestones.map((milestone, index) => (
                    <li key={`${milestone.date ?? 'milestone'}-${milestone.title}-${index}`} className="relative pb-7 pl-7 last:pb-0">
                      <span className="absolute -left-[0.3125rem] top-1.5 size-2.5 rounded-full border-2 border-gold bg-white" aria-hidden="true" />
                      {milestone.date && (
                        <p className="text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-gold-deep">{milestone.date}</p>
                      )}
                      <h3 className="mt-1 text-sm font-semibold text-navy">{milestone.title}</h3>
                      {milestone.description && (
                        <p className="mt-2 text-sm leading-relaxed text-muted">{milestone.description}</p>
                      )}
                    </li>
                  ))}
                </ol>
              </CaseSection>
            )}

            {outcomes.length > 0 && (
              <CaseSection eyebrow={t('projects.outcomesEyebrow')} title={t('projects.outcomesTitle')}>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {outcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-3 border border-line bg-canvas/60 p-4 text-sm leading-relaxed text-ink/85">
                      <Check className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden="true" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </CaseSection>
            )}
          </main>

          <aside className="space-y-7">
            {images.length > 0 && (
              <section className="border border-line bg-canvas p-4 sm:p-5" aria-labelledby="project-gallery-title">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow">{t('projects.galleryEyebrow')}</p>
                    <h2 id="project-gallery-title" className="mt-2 text-lg font-semibold text-navy">{t('projects.gallery')}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLightboxIndex(0)
                      setLightboxOpen(true)
                    }}
                    className="inline-flex items-center gap-1.5 text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-navy hover:text-gold-deep"
                  >
                    <Expand className="size-3.5" aria-hidden="true" />
                    {t('projects.viewGallery')}
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {images.slice(0, 4).map((image, index) => (
                    <button
                      key={`${image.src}-${index}`}
                      type="button"
                      onClick={() => {
                        setLightboxIndex(index)
                        setLightboxOpen(true)
                      }}
                      className={`group overflow-hidden bg-white ${index === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-[4/3]'}`}
                      aria-label={`${t('common.image')} ${index + 1}: ${image.alt}`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {services.length > 0 && (
              <section className="border border-line p-6">
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-muted">{t('projects.relatedServices')}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {services.map((service) => (
                    <li key={service}>
                      <Link
                        to="/services"
                        className="inline-flex items-center gap-1 border border-line-strong bg-white px-2.5 py-1.5 text-[0.6875rem] font-medium text-navy transition-colors hover:border-gold hover:text-gold-deep"
                      >
                        {service}
                        <ArrowUpRight className="size-3" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="bg-navy p-6 text-white sm:p-7">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-gold">
                {t('services.cta.eyebrow')}
              </p>
              <p className="mt-3 text-[1.125rem] font-medium leading-snug text-white">
                {t('projects.consultationText')}
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
              <div>
                <p className="eyebrow">{t('projects.relatedEyebrow')}</p>
                <h2 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.02em] text-navy">{t('projects.related')}</h2>
              </div>
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
                      alt={item.coverImage ? item.coverImageAlt || item.title : t('projects.illustrativeAlt')}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {!item.coverImage && (
                      <span className="absolute right-3 top-3 bg-white/90 px-2 py-1 text-[0.5rem] font-bold uppercase tracking-[0.1em] text-navy">
                        {t('projects.illustrativeImage')}
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
                    {item.summary && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">{item.summary}</p>}
                    {item.location && (
                      <p className="mt-2 flex items-start gap-1.5 text-[0.6875rem] text-muted">
                        <MapPin className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                        <span className="line-clamp-2">{item.location}</span>
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

function CaseSection({ eyebrow, title, children }) {
  return (
    <section className="border-b border-line py-9 first:pt-0 last:border-0">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-[clamp(1.35rem,2.4vw,1.8rem)] font-semibold tracking-[-0.035em] text-navy">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

function CaseListItem({ children }) {
  return (
    <li className="flex gap-3.5">
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center border border-gold/40 bg-gold/10">
        <Check className="size-3 text-gold-deep" aria-hidden="true" />
      </span>
      <p className="text-[0.9375rem] leading-[1.75] text-ink/85">{children}</p>
    </li>
  )
}

function ProjectFact({ label, value, Icon }) {
  return (
    <div>
      <dt className="text-[0.5rem] font-bold uppercase tracking-[0.16em] text-white/55">{label}</dt>
      <dd className="mt-1.5 flex items-start gap-1.5 text-[0.8125rem] font-medium leading-snug text-white/90">
        {Icon && <Icon className="mt-0.5 size-3 shrink-0 text-gold" aria-hidden="true" />}
        {value}
      </dd>
    </div>
  )
}
