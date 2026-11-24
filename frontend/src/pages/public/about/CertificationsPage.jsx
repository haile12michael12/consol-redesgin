import { ArrowRight, ArrowUpRight, BadgeCheck, ExternalLink, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { PageHero } from '@/components/common/PageHero'
import { Reveal } from '@/components/common/Reveal'
import { Notice } from '@/components/common/StateBlocks'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { credentials } from '@/lib/site'
import { usePageMeta } from '@/lib/seo'

const achievements = [
  {
    year: '2023',
    text: 'Pearson VUE authorized test center — secure international certification exam delivery.',
  },
  {
    year: '2023',
    text: 'Two-year PMI® PMP® Master Framework Agreement with the Construction Management Institute; 200 professionals trained in the first year.',
  },
  {
    year: '2022',
    text: 'OPM maturity improvement programme and Value for Money assessment across 91 urban local governments for the UIIDP programme.',
  },
  {
    year: '2019',
    text: 'Professionals competence assessment and certification system for engineering and architecture fields.',
  },
]

export function CertificationsPage() {
  const t = useT()
  usePageMeta({
    title: 'Certifications & Credentials',
    description:
      'CONSOL is a published Authorized PMI® Training Partner, Authorized Autodesk® Training Center and Pearson VUE authorized test center.',
    image: '/media/conference.jpg',
  })

  return (
    <>
      <PageHero
        eyebrow={t('about.cert.eyebrow')}
        title={t('about.cert.title')}
        text={t('about.cert.text')}
        breadcrumbs={[
          { label: t('nav.about'), to: '/about' },
          { label: t('nav.certifications'), to: '/about/certifications' },
        ]}
        image={{ src: '/media/conference.jpg', alt: 'Professional certification event' }}
      />
      <AboutSubNav />

      <section className="section bg-white">
        <div className="shell">
          <div className="grid gap-6 lg:grid-cols-3">
            {credentials.map((credential, index) => (
              <Reveal key={credential.id} delay={index * 0.06}>
                <article className="flex h-full flex-col border border-line bg-white transition-shadow hover:shadow-card">
                  <div className="flex items-center justify-between border-b border-line bg-canvas px-6 py-4">
                    <ShieldCheck className="size-5 text-gold-deep" strokeWidth={1.6} aria-hidden="true" />
                    <span className="text-[0.5rem] font-bold uppercase tracking-[0.16em] text-muted">
                      Published credential
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="font-display text-[1.35rem] leading-none text-navy">{credential.short}</p>
                    <h2 className="mt-3 text-[1rem] font-semibold leading-snug text-navy">{credential.name}</h2>
                    <p className="mt-3 flex-1 text-[0.8125rem] leading-[1.8] text-muted">{credential.description}</p>

                    {credential.verify ? (
                      <a
                        href={credential.verify}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-6 inline-flex items-center gap-2 border-t border-line pt-4 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-navy transition-colors hover:text-gold-deep"
                      >
                        {credential.verifyLabel}
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <p className="mt-6 border-t border-line pt-4 text-[0.6875rem] text-muted">
                        {t('about.cert.pending')}
                      </p>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Notice tone="verified" icon={BadgeCheck} className="mt-8">
            {t('about.cert.note')}
          </Notice>
        </div>
      </section>

      <section className="section bg-canvas">
        <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow">Selected achievements</p>
            <h2 className="mt-5 max-w-xs text-[clamp(1.7rem,3vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-navy">
              Programmes behind the credentials.
            </h2>
            <p className="mt-5 max-w-sm text-[0.875rem] leading-[1.8] text-muted">{t('about.history.text')}</p>
            <Button asChild variant="outline" className="mt-7">
              <Link to="/projects">
                {t('nav.projects')}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <ul className="divide-y divide-line border-t border-line">
            {achievements.map((item, index) => (
              <Reveal key={item.text} delay={index * 0.04} as="li">
                <div className="flex gap-6 py-5">
                  <span className="w-12 shrink-0 font-display text-[1.05rem] text-gold-deep">{item.year}</span>
                  <p className="text-[0.875rem] leading-[1.8] text-ink/85">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line bg-white py-14">
        <div className="shell flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="max-w-xl text-[0.9375rem] leading-relaxed text-muted">
            Training delivery and examination access are arranged through the CONSOL training team.
          </p>
          <Button asChild variant="gold">
            <Link to="/training">
              {t('nav.training')}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
