import { ArrowUpRight, Award, BookOpen, Building2, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/common/Reveal'
import { useT } from '@/i18n/LanguageProvider'

const previewPillars = [
  {
    icon: Building2,
    titleKey: 'home.aboutPreview.card1.title',
    textKey: 'home.aboutPreview.card1.text',
    link: '/about/leadership',
  },
  {
    icon: Award,
    titleKey: 'home.aboutPreview.card2.title',
    textKey: 'home.aboutPreview.card2.text',
    link: '/about/certifications',
  },
  {
    icon: CheckCircle2,
    titleKey: 'home.aboutPreview.card3.title',
    textKey: 'home.aboutPreview.card3.text',
    link: '/about/vision-mission',
  },
  {
    icon: BookOpen,
    titleKey: 'home.aboutPreview.card4.title',
    textKey: 'home.aboutPreview.card4.text',
    link: '/about/clients-partners',
  },
]

export function AboutPreview() {
  const t = useT()

  return (
    <section className="section border-t border-line bg-canvas" aria-labelledby="about-preview-heading">
      <div className="shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow">{t('home.aboutPreview.eyebrow')}</p>
              <h2
                id="about-preview-heading"
                className="mt-4 text-[clamp(1.85rem,3.2vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-navy"
              >
                {t('home.aboutPreview.title')}
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-[1.8] text-muted">
                {t('home.aboutPreview.lead')}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Link to="/about" className="link-arrow shrink-0">
              {t('home.aboutPreview.cta')}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {previewPillars.map((pillar, index) => {
            const Icon = pillar.icon
            return (
              <Reveal key={pillar.titleKey} delay={index * 0.06}>
                <div className="group relative flex h-full flex-col border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-card">
                  <div className="flex size-10 items-center justify-center bg-navy text-gold">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-[1rem] font-semibold leading-snug text-navy">
                    {t(pillar.titleKey)}
                  </h3>
                  <p className="mt-3 flex-1 text-[0.8125rem] leading-[1.75] text-muted">
                    {t(pillar.textKey)}
                  </p>
                  <Link
                    to={pillar.link}
                    className="mt-6 inline-flex items-center gap-1.5 border-t border-line pt-4 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-navy transition-colors group-hover:text-gold-deep"
                  >
                    <span>{t('common.readMore')}</span>
                    <ArrowUpRight className="size-3 text-gold-deep" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
