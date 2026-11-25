import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AboutContentState } from '@/components/about/AboutContentState'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { CoreValuesSection } from '@/components/about/CoreValuesSection'
import { PageHero } from '@/components/common/PageHero'
import { Reveal } from '@/components/common/Reveal'
import { Button } from '@/components/ui/button'
import { useAbout } from '@/hooks/useAbout'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'

export function VisionMissionPage() {
  const t = useT()
  const about = useAbout()
  usePageMeta({
    title: 'Vision, Mission & Values',
    description:
      'CONSOL’s published vision and mission, with core values shown when approved company content is available.',
    image: '/media/structure.jpg',
  })

  return (
    <>
      <PageHero
        eyebrow={t('about.vision.eyebrow')}
        title={t('about.vision.title')}
        text="The published statements that express what CONSOL is working towards."
        breadcrumbs={[
          { label: t('nav.about'), to: '/about' },
          { label: t('nav.visionMission'), to: '/about/vision-mission' },
        ]}
        image={{ src: '/media/structure.jpg', alt: 'Structural works under construction' }}
      />
      <AboutSubNav />

      <AboutContentState query={about}>
        {(content) => (
          <>
            <section className="section bg-white">
              <div className="shell grid gap-px bg-line lg:grid-cols-2">
                <Reveal>
                  <article className="flex h-full flex-col justify-between bg-navy p-8 text-white sm:p-12">
                    <div>
                      <p className="text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-gold">
                        {t('about.vision.visionLabel')}
                      </p>
                      <p className="mt-6 font-display text-[clamp(1.5rem,2.6vw,2.15rem)] leading-[1.35] text-white">
                        “{content.visionMission.vision}”
                      </p>
                    </div>
                    <p className="mt-10 border-t border-white/15 pt-5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white/40">
                      Company vision · published statement
                    </p>
                  </article>
                </Reveal>

                <Reveal delay={0.08}>
                  <article className="flex h-full flex-col justify-between bg-canvas p-8 sm:p-12">
                    <div>
                      <p className="text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-gold-deep">
                        {t('about.vision.missionLabel')}
                      </p>
                      <p className="mt-6 font-display text-[clamp(1.5rem,2.6vw,2.15rem)] leading-[1.35] text-navy">
                        “{content.visionMission.mission}”
                      </p>
                    </div>
                    <p className="mt-10 border-t border-line pt-5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted">
                      Company mission · published statement
                    </p>
                  </article>
                </Reveal>
              </div>
            </section>

            <CoreValuesSection values={content.coreValues} />

            <section className="border-t border-line bg-white py-14">
              <div className="shell flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-[1.25rem] font-semibold text-navy">{t('about.leadership.title')}</h2>
                  <p className="mt-1.5 text-[0.875rem] text-muted">{t('about.leadership.text')}</p>
                </div>
                <Button asChild variant="primary">
                  <Link to="/about/leadership">
                    {t('about.nav.leadership')}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </section>
          </>
        )}
      </AboutContentState>
    </>
  )
}
