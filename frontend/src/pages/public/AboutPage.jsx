import { ArrowRight, ArrowUpRight, Download, Quote } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AboutContentState } from '@/components/about/AboutContentState'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { PageHero } from '@/components/common/PageHero'
import { Reveal } from '@/components/common/Reveal'
import { StatStrip } from '@/components/common/StatStrip'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Button } from '@/components/ui/button'
import { useAbout } from '@/hooks/useAbout'
import { useT } from '@/i18n/LanguageProvider'
import { institutionalFacts } from '@/lib/site'
import { usePageMeta } from '@/lib/seo'

export function AboutPage() {
  const t = useT()
  const about = useAbout()

  usePageMeta({
    title: 'About CONSOL',
    description:
      'Construction Solutions PLC (CONSOL) is an Ethiopian consulting, training and research institute serving the construction and related industries.',
    image: '/media/office-team.jpg',
  })

  return (
    <>
      <PageHero
        eyebrow={t('about.hero.eyebrow')}
        title={t('about.hero.title')}
        text={t('about.hero.text')}
        breadcrumbs={[{ label: t('nav.about'), to: '/about' }]}
        image={{ src: '/media/office-team.jpg', alt: 'CONSOL team in the Addis Ababa office' }}
        actions={
          <>
            <Button asChild variant="gold">
              <Link to="/request-consultation">
                {t('about.contact.cta')}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline-invert">
              <Link to="/about/vision-mission">{t('nav.visionMission')}</Link>
            </Button>
          </>
        }
      />
      <AboutSubNav />

      <AboutContentState query={about}>
        {(content) => (
          <>
            <section className="section bg-white">
              <div className="shell grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
                <div>
                  <p className="eyebrow">{t('about.overview.eyebrow')}</p>
                  <h2 className="mt-5 text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-navy">
                    {t('about.overview.title')}
                  </h2>
                  <div className="prose-consol mt-7 max-w-2xl">
                    <p>{content.overview.introduction}</p>
                    <p>{content.overview.background}</p>
                    <p>{content.overview.purpose}</p>
                  </div>

                  <div className="mt-10 flex flex-wrap items-center gap-3">
                    <Button asChild>
                      <Link to="/services">
                        {t('nav.services')}
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      disabled
                      title={t('about.profile.pending')}
                      aria-describedby="profile-pending"
                    >
                      <Download className="size-4" aria-hidden="true" />
                      {t('about.profile.cta')}
                    </Button>
                  </div>
                  <p id="profile-pending" className="mt-3 text-[0.6875rem] text-muted">
                    {t('about.profile.pending')}
                  </p>
                </div>

                <Reveal>
                  <div className="relative">
                    <div className="aspect-[4/5] overflow-hidden bg-canvas">
                      <img
                        src="/media/consultancy.jpg"
                        alt="CONSOL consultants reviewing project information"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <figure className="relative -mt-14 ml-4 border-l-2 border-gold bg-navy px-6 py-5 text-white sm:ml-8">
                      <Quote className="size-4 text-gold" aria-hidden="true" />
                      <blockquote className="mt-2 font-display text-[1.2rem] leading-snug">
                        {t('about.vision.mission')}
                      </blockquote>
                      <figcaption className="mt-3 text-[0.5rem] font-bold uppercase tracking-[0.16em] text-gold-soft">
                        {t('about.vision.missionLabel')}
                      </figcaption>
                    </figure>
                  </div>
                </Reveal>
              </div>
            </section>

            <section className="section bg-canvas">
              <div className="shell">
                <SectionHeading
                  eyebrow={t('about.overview.pillar')}
                  title="Professional capabilities."
                  text={content.overview.purpose}
                />
                <div className="mt-12 grid gap-px bg-line md:grid-cols-2">
                  {content.overview.capabilities.map((capability, index) => (
                    <Reveal key={capability.slug} delay={index * 0.06}>
                      <Link
                        to={`/services/${capability.slug}`}
                        className="group flex h-full flex-col justify-between gap-8 bg-white p-7 transition-colors hover:bg-navy"
                      >
                        <div>
                          <span className="font-display text-sm text-gold">0{index + 1}</span>
                          <p className="mt-4 text-[1.0625rem] font-semibold leading-snug text-navy transition-colors group-hover:text-white">
                            {capability.title}
                          </p>
                          <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted transition-colors group-hover:text-white/70">
                            {capability.summary}
                          </p>
                        </div>
                        <ArrowUpRight
                          className="size-4 text-gold-deep transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-gold"
                          aria-hidden="true"
                        />
                      </Link>
                    </Reveal>
                  ))}
                </div>

                <StatStrip
                  className="mt-12"
                  items={institutionalFacts.map((fact) => ({ value: fact.value, label: fact.label }))}
                  note={t('home.credibility.source')}
                />
              </div>
            </section>

            <section className="section bg-white">
              <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
                <div>
                  <p className="eyebrow">{t('about.history.eyebrow')}</p>
                  <h2 className="mt-5 max-w-xs text-[clamp(1.8rem,3.2vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-navy">
                    {t('about.history.title')}
                  </h2>
                  <p className="mt-5 max-w-sm text-[0.875rem] leading-[1.8] text-muted">{t('about.history.text')}</p>
                  <Link to="/about/history" className="link-arrow mt-7">
                    {t('about.nav.history')}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>

                <ol className="relative border-l border-line">
                  {content.milestones.slice(0, 5).map((milestone, index) => (
                    <Reveal key={`${milestone.year}-${milestone.title}`} delay={index * 0.04} as="li">
                      <div className="relative pb-8 pl-7 last:pb-0">
                        <span className="absolute -left-[4.5px] top-1.5 size-2 rounded-full bg-gold ring-4 ring-white" aria-hidden="true" />
                        <p className="font-display text-[1.1rem] text-gold-deep">{milestone.year}</p>
                        <h3 className="mt-1 text-[0.9375rem] font-semibold text-navy">{milestone.title}</h3>
                        <p className="mt-2 max-w-lg text-[0.8125rem] leading-relaxed text-muted">{milestone.text}</p>
                      </div>
                    </Reveal>
                  ))}
                </ol>
              </div>
            </section>
          </>
        )}
      </AboutContentState>
    </>
  )
}
