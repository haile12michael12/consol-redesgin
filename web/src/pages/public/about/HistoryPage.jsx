import { ArrowRight, BadgeCheck, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { PageHero } from '@/components/common/PageHero'
import { Reveal } from '@/components/common/Reveal'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { milestones } from '@/data/history'

export function HistoryPage() {
  const t = useT()
  usePageMeta({
    title: 'Company History',
    description:
      'Dated milestones published by Construction Solutions PLC, from its founding in 2005 through to the Pearson VUE test centre in 2023.',
    image: '/media/conference.jpg',
  })

  return (
    <>
      <PageHero
        eyebrow={t('about.history.eyebrow')}
        title={t('about.history.title')}
        text={t('about.history.text')}
        breadcrumbs={[
          { label: t('nav.about'), to: '/about' },
          { label: t('nav.history'), to: '/about/history' },
        ]}
        image={{ src: '/media/conference.jpg', alt: 'Industry conference session' }}
      />
      <AboutSubNav />

      <section className="section bg-white">
        <div className="shell max-w-4xl">
          <ol className="relative">
            <span className="absolute bottom-0 left-[4.5rem] top-2 w-px bg-line sm:left-[7.5rem]" aria-hidden="true" />
            {milestones.map((milestone, index) => (
              <Reveal key={milestone.year} delay={index * 0.03} as="li">
                <div className="relative grid grid-cols-[3.5rem_1fr] gap-6 pb-10 sm:grid-cols-[6rem_1fr] sm:gap-10">
                  <div className="pt-1 text-right">
                    <p className="font-display text-[1.15rem] leading-none text-gold-deep sm:text-[1.4rem]">
                      {milestone.year}
                    </p>
                  </div>
                  <div className="relative border-l border-transparent pl-0">
                    <span
                      className="absolute -left-[1px] top-2 size-2 -translate-x-1/2 rounded-full bg-gold ring-4 ring-white sm:-left-[2.5rem]"
                      aria-hidden="true"
                    />
                    <h2 className="text-[1.0625rem] font-semibold leading-snug text-navy sm:text-[1.15rem]">
                      {milestone.title}
                    </h2>
                    <p className="mt-2 max-w-2xl text-[0.875rem] leading-[1.8] text-muted">{milestone.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          <div className="mt-6 flex items-start gap-3 border border-line bg-canvas px-5 py-4">
            <Info className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden="true" />
            <p className="text-[0.75rem] leading-relaxed text-muted">
              Only dated engagements and announcements published by CONSOL are listed. Years without published
              records are omitted rather than inferred.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/projects">
                {t('nav.projects')}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/about/certifications">
                <BadgeCheck className="size-4" aria-hidden="true" />
                {t('nav.certifications')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
