import { ArrowRight, Compass, Flag, Quote } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { PageHero } from '@/components/common/PageHero'
import { Reveal } from '@/components/common/Reveal'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'

const values = [
  { key: 1, Icon: Compass },
  { key: 2, Icon: Flag },
  { key: 3, Icon: Quote },
  { key: 4, Icon: Compass },
  { key: 5, Icon: Flag },
  { key: 6, Icon: Quote },
]

export function VisionMissionPage() {
  const t = useT()
  usePageMeta({
    title: 'Vision, Mission & Values',
    description:
      'CONSOL’s vision, mission and core values: building world-class professionals and companies in the Horn of Africa.',
    image: '/media/structure.jpg',
  })

  return (
    <>
      <PageHero
        eyebrow={t('about.vision.eyebrow')}
        title={t('about.vision.title')}
        text={t('about.values.disclaimer')}
        breadcrumbs={[
          { label: t('nav.about'), to: '/about' },
          { label: t('nav.visionMission'), to: '/about/vision-mission' },
        ]}
        image={{ src: '/media/structure.jpg', alt: 'Structural works under construction' }}
      />
      <AboutSubNav />

      {/* Vision & mission */}
      <section className="section bg-white">
        <div className="shell grid gap-px bg-line lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col justify-between bg-navy p-8 text-white sm:p-12">
              <div>
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-gold">
                  {t('about.vision.visionLabel')}
                </p>
                <p className="mt-6 font-display text-[clamp(1.5rem,2.6vw,2.15rem)] leading-[1.35] text-white">
                  “{t('about.vision.vision')}”
                </p>
              </div>
              <p className="mt-10 border-t border-white/15 pt-5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white/40">
                Company vision · published statement
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex h-full flex-col justify-between bg-canvas p-8 sm:p-12">
              <div>
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-gold-deep">
                  {t('about.vision.missionLabel')}
                </p>
                <p className="mt-6 font-display text-[clamp(1.5rem,2.6vw,2.15rem)] leading-[1.35] text-navy">
                  “{t('about.vision.mission')}”
                </p>
              </div>
              <p className="mt-10 border-t border-line pt-5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted">
                Company mission · published statement
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Core values */}
      <section className="section bg-canvas">
        <div className="shell">
          <SectionHeading
            eyebrow={t('about.values.eyebrow')}
            title={t('about.values.title')}
            text={t('about.values.disclaimer')}
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map(({ key, Icon }, index) => (
              <Reveal key={key} delay={index * 0.04}>
                <div className="group h-full border border-line bg-white p-7 transition-colors duration-300 hover:border-navy">
                  <div className="flex items-center justify-between">
                    <Icon className="size-5 text-gold-deep" strokeWidth={1.6} aria-hidden="true" />
                    <span className="font-display text-sm text-line-strong">0{key}</span>
                  </div>
                  <h3 className="mt-5 text-[1rem] font-semibold leading-snug text-navy">
                    {t(`about.values.${key}.title`)}
                  </h3>
                  <p className="mt-2.5 text-[0.8125rem] leading-[1.8] text-muted">
                    {t(`about.values.${key}.text`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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
  )
}
