import { ArrowRight, BadgeCheck, Lightbulb, SlidersHorizontal, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AboutContentState } from '@/components/about/AboutContentState'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { PageHero } from '@/components/common/PageHero'
import { Reveal } from '@/components/common/Reveal'
import { Button } from '@/components/ui/button'
import { useAbout } from '@/hooks/useAbout'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'

const reasonsIcons = [Target, SlidersHorizontal, Lightbulb, BadgeCheck]

export function WhyChoosePage() {
  const t = useT()
  const about = useAbout()
  usePageMeta({
    title: 'Why Choose CONSOL',
    description: 'Published reasons organisations choose Construction Solutions PLC for consulting and professional development.',
    image: '/media/consultancy.jpg',
  })

  return (
    <>
      <PageHero
        eyebrow="Why CONSOL"
        title="A partner in organisational growth."
        text="Explore the published approach and capabilities that CONSOL brings to client engagements."
        breadcrumbs={[
          { label: t('nav.about'), to: '/about' },
          { label: 'Why Choose CONSOL', to: '/about/why-consol' },
        ]}
        image={{ src: '/media/consultancy.jpg', alt: 'Consultancy team discussing project plans' }}
      />
      <AboutSubNav />

      <AboutContentState query={about}>
        {(content) => (
          <>
            <section className="section bg-white">
              <div className="shell">
                <div className="grid gap-px bg-line sm:grid-cols-2">
                  {content.whyChoose.map((reason, index) => {
                    const Icon = reasonsIcons[index % reasonsIcons.length]
                    return (
                      <Reveal key={reason.title} delay={index * 0.06}>
                        <article className="group h-full bg-canvas p-7 transition-colors duration-300 hover:bg-navy sm:p-9">
                          <div className="flex items-center justify-between">
                            <Icon className="size-5 text-gold-deep transition-colors group-hover:text-gold" strokeWidth={1.6} aria-hidden="true" />
                            <span className="font-display text-sm text-line-strong">0{index + 1}</span>
                          </div>
                          <h2 className="mt-6 text-[1.125rem] font-semibold text-navy transition-colors group-hover:text-white">
                            {reason.title}
                          </h2>
                          <p className="mt-3 max-w-xl text-[0.875rem] leading-[1.8] text-muted transition-colors group-hover:text-white/70">
                            {reason.summary}
                          </p>
                        </article>
                      </Reveal>
                    )
                  })}
                </div>
              </div>
            </section>

            <section className="border-t border-line bg-canvas py-14">
              <div className="shell flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-[1.25rem] font-semibold text-navy">Explore CONSOL’s capabilities.</h2>
                  <p className="mt-1.5 max-w-xl text-[0.875rem] text-muted">
                    Learn more about our published services and professional training.
                  </p>
                </div>
                <Button asChild>
                  <Link to="/services">
                    {t('nav.services')}
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
