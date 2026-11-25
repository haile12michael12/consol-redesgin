import { ArrowRight, Briefcase, GraduationCap, Search, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AboutContentState } from '@/components/about/AboutContentState'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { PageHero } from '@/components/common/PageHero'
import { Reveal } from '@/components/common/Reveal'
import { Notice } from '@/components/common/StateBlocks'
import { Button } from '@/components/ui/button'
import { useAbout } from '@/hooks/useAbout'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'

const practiceIcons = [Briefcase, Users, GraduationCap, Search]

export function StructurePage() {
  const t = useT()
  const about = useAbout()
  usePageMeta({
    title: 'Organisational Structure',
    description:
      'How CONSOL is organised across its published management and professional practice areas.',
    image: '/media/consultancy.jpg',
  })

  return (
    <>
      <PageHero
        eyebrow={t('about.structure.eyebrow')}
        title={t('about.structure.title')}
        text={t('about.structure.text')}
        breadcrumbs={[
          { label: t('nav.about'), to: '/about' },
          { label: t('nav.structure'), to: '/about/structure' },
        ]}
        image={{ src: '/media/consultancy.jpg', alt: 'Consultancy team meeting' }}
      />
      <AboutSubNav />

      <AboutContentState query={about}>
        {(content) => (
          <section className="section bg-white">
            <div className="shell">
              <div className="mx-auto max-w-3xl border border-navy bg-navy px-6 py-6 text-center text-white">
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-gold">Management</p>
                <p className="mt-2 text-[1.1rem] font-semibold">
                  {content.organizationalStructure.management.title}
                </p>
                <p className="mt-1 text-[0.75rem] text-white/55">
                  {content.organizationalStructure.management.support}
                </p>
              </div>

              <div className="mx-auto mt-0 grid max-w-5xl gap-px bg-line sm:grid-cols-2" aria-label="Practice areas">
                {content.organizationalStructure.practiceAreas.map((practice, index) => {
                  const Icon = practiceIcons[index % practiceIcons.length]
                  return (
                    <Reveal key={practice.slug} delay={index * 0.05}>
                      <article className="flex h-full flex-col bg-white p-7">
                        <Icon className="size-5 text-gold-deep" strokeWidth={1.6} aria-hidden="true" />
                        <h2 className="mt-4 text-[0.9375rem] font-semibold leading-snug text-navy">{practice.title}</h2>
                        <p className="mt-2 flex-1 text-[0.8125rem] leading-[1.8] text-muted">{practice.summary}</p>
                        <Link to={`/services/${practice.slug}`} className="link-arrow mt-5">
                          {t('common.readMore')}
                          <ArrowRight className="size-3.5" aria-hidden="true" />
                        </Link>
                      </article>
                    </Reveal>
                  )
                })}
              </div>

              <Notice className="mx-auto mt-8 max-w-5xl" icon={Users}>
                A detailed organisation chart (departments, reporting lines and named post holders) is not currently
                available. This page presents the published management and practice structure only.
              </Notice>

              <div className="mx-auto mt-10 flex max-w-5xl flex-wrap gap-3">
                <Button asChild>
                  <Link to="/about/leadership">
                    {t('nav.leadership')}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/contact">{t('nav.contact')}</Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </AboutContentState>
    </>
  )
}
