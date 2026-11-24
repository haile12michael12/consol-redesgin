import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/common/Reveal'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { getFeaturedProjects, projectCategories } from '@/data/projects'

function categoryLabel(category) {
  return projectCategories.find((item) => item.id === category)?.label ?? category
}

export function FeaturedProjects() {
  const t = useT()
  const featured = getFeaturedProjects(3)
  const [lead, ...rest] = featured

  return (
    <section className="section bg-canvas" aria-labelledby="projects-heading">
      <div className="shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">{t('home.projects.eyebrow')}</p>
            <h2
              id="projects-heading"
              className="mt-5 text-[clamp(1.9rem,3.5vw,2.9rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-navy"
            >
              {t('home.projects.title')}
            </h2>
            <p className="mt-5 max-w-xl text-[0.9375rem] leading-[1.8] text-muted">{t('home.projects.text')}</p>
          </div>
          <Button asChild variant="primary">
            <Link to="/projects">
              {t('home.projects.cta')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-10">
          {lead && (
            <Reveal>
              <article className="group relative flex h-full flex-col bg-navy">
                <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:flex-1">
                  <img
                    src={lead.image}
                    alt={`Illustrative photograph — ${lead.title}`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/35 to-transparent" aria-hidden="true" />
                  <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                    <div className="flex flex-wrap items-center gap-2.5 text-[0.5625rem] font-bold uppercase tracking-[0.14em]">
                      <span className="bg-gold px-2 py-1 text-navy">{t('projects.featured')}</span>
                      <span className="text-white/70">{categoryLabel(lead.category)}</span>
                      {lead.year && (
                        <>
                          <span className="text-white/55" aria-hidden="true">·</span>
                          <span className="text-white/70">{lead.year}</span>
                        </>
                      )}
                    </div>
                    <h3 className="mt-3 max-w-xl text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-white lg:text-[1.45rem]">
                      <Link to={`/projects/${lead.slug}`} className="after:absolute after:inset-0">
                        {lead.title}
                      </Link>
                    </h3>
                    {lead.client && (
                      <p className="mt-2.5 flex items-center gap-1.5 text-[0.75rem] text-white/60">
                        <MapPin className="size-3 text-gold" aria-hidden="true" />
                        {lead.client}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          )}

          <div className="flex flex-col gap-8">
            {rest.map((project, index) => (
              <Reveal key={project.slug} delay={0.08 * (index + 1)}>
                <article className="group grid flex-1 grid-cols-[7.5rem_1fr] gap-5 border-b border-line-strong pb-6 last:border-0 last:pb-0 sm:grid-cols-[10rem_1fr]">
                  <div className="relative aspect-square overflow-hidden sm:aspect-[4/5]">
                    <img
                      src={project.image}
                      alt={`Illustrative photograph — ${project.title}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-gold-deep">
                      {categoryLabel(project.category)} · {project.year}
                    </p>
                    <h3 className="mt-2 text-[0.9375rem] font-semibold leading-snug text-navy">
                      <Link to={`/projects/${project.slug}`} className="transition-colors hover:text-gold-deep">
                        {project.title}
                      </Link>
                    </h3>
                    {project.client && (
                      <p className="mt-2 line-clamp-2 text-[0.75rem] leading-snug text-muted">{project.client}</p>
                    )}
                    <Link
                      to={`/projects/${project.slug}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-navy transition-colors hover:text-gold-deep"
                    >
                      {t('common.readMore')}
                      <ArrowUpRight className="size-3" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <p className="mt-8 text-[0.6875rem] leading-relaxed text-muted">{t('home.projects.note')}</p>
      </div>
    </section>
  )
}
