import { ArrowRight, Briefcase, GraduationCap, Search, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { PageHero } from '@/components/common/PageHero'
import { Reveal } from '@/components/common/Reveal'
import { Notice } from '@/components/common/StateBlocks'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'

const practices = [
  {
    Icon: Briefcase,
    title: 'Construction Management Research & Consultancy Services (CMRCS)',
    text: 'PMO set-up, OPM3 maturity assessment, performance related pay systems, performance monitoring systems and BIM implementation.',
    slug: 'construction-management-consultancy',
  },
  {
    Icon: Users,
    title: 'Business & Organisational Management Consultancy',
    text: 'Strategy, feasibility, organisational design, job evaluation, performance management and value-for-money assessment.',
    slug: 'business-management-consultancy',
  },
  {
    Icon: GraduationCap,
    title: 'Training & Certification Services',
    text: 'Custom-made and scheduled training, PMI® and Autodesk® certification, engineering software and exam facilitation.',
    slug: 'professional-training',
  },
  {
    Icon: Search,
    title: 'Research & Industry Development',
    text: 'Bodies of knowledge, occupational standards, capacity frameworks and applied sector research.',
    slug: 'research-industry-development',
  },
]

export function StructurePage() {
  const t = useT()
  usePageMeta({
    title: 'Organisational Structure',
    description:
      'How CONSOL is organised: construction management research and consultancy, business management consultancy, training and certification, and research.',
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

      <section className="section bg-white">
        <div className="shell">
          <div className="mx-auto max-w-3xl border border-navy bg-navy px-6 py-6 text-center text-white">
            <p className="text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-gold">General management</p>
            <p className="mt-2 text-[1.1rem] font-semibold">General Manager</p>
            <p className="mt-1 text-[0.75rem] text-white/55">Supported by the Project Management Office</p>
          </div>

          <div className="mx-auto mt-0 grid max-w-5xl gap-px bg-line sm:grid-cols-2" aria-label="Practice areas">
            {practices.map((practice, index) => (
              <Reveal key={practice.title} delay={index * 0.05}>
                <div className="flex h-full flex-col bg-white p-7">
                  <practice.Icon className="size-5 text-gold-deep" strokeWidth={1.6} aria-hidden="true" />
                  <h2 className="mt-4 text-[0.9375rem] font-semibold leading-snug text-navy">{practice.title}</h2>
                  <p className="mt-2 flex-1 text-[0.8125rem] leading-[1.8] text-muted">{practice.text}</p>
                  <Link to={`/services/${practice.slug}`} className="link-arrow mt-5">
                    {t('common.readMore')}
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>

          <Notice className="mx-auto mt-8 max-w-5xl" icon={Users}>
            A detailed organisation chart (departments, reporting lines and named post holders) is being prepared with
            CONSOL. This page presents the published practice structure only.
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
    </>
  )
}
