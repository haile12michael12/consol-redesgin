import { Info, Mail, MapPin, Phone } from 'lucide-react'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { PageHero } from '@/components/common/PageHero'
import { Reveal } from '@/components/common/Reveal'
import { SectionHeading } from '@/components/common/SectionHeading'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { bench, team } from '@/data/team'

export function LeadershipPage() {
  const t = useT()
  usePageMeta({
    title: 'Leadership & Team',
    description:
      'The published CONSOL leadership team and the depth of the consulting bench: 200+ academics and practitioners across the construction industry.',
    image: '/media/office-team.jpg',
  })

  return (
    <>
      <PageHero
        eyebrow={t('about.leadership.eyebrow')}
        title={t('about.leadership.title')}
        text={t('about.leadership.text')}
        breadcrumbs={[
          { label: t('nav.about'), to: '/about' },
          { label: t('nav.leadership'), to: '/about/leadership' },
        ]}
        image={{ src: '/media/office-team.jpg', alt: 'Professional team standing in an office lobby' }}
      />
      <AboutSubNav />

      <section className="section bg-white">
        <div className="shell">
          <div className="flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">{t('about.leadership.published')}</p>
              <h2 className="mt-4 text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-[-0.03em] text-navy">
                Direct contacts
              </h2>
            </div>
            <p className="max-w-sm text-[0.75rem] leading-relaxed text-muted">
              Names, roles and contact details below are reproduced from the company’s published contact page.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {team.map((person, index) => (
              <Reveal key={person.name} delay={index * 0.06}>
                <article className="flex h-full flex-col border border-line bg-white">
                  <div className="flex items-start gap-5 border-b border-line p-6 sm:p-7">
                    <span
                      aria-hidden="true"
                      className="grid size-16 shrink-0 place-items-center bg-navy font-display text-[1.4rem] text-gold"
                    >
                      {person.initials}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[1.125rem] font-semibold leading-tight text-navy">{person.name}</h3>
                      <p className="mt-1 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-gold-deep">
                        {t(person.roleKey)}
                      </p>
                      <p className="mt-2 flex items-start gap-1.5 text-[0.75rem] leading-snug text-muted">
                        <MapPin className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                        {person.office}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2.5 p-6 text-[0.8125rem] sm:p-7">
                    <a href={`mailto:${person.email}`} className="flex items-center gap-2.5 break-all text-ink transition-colors hover:text-gold-deep">
                      <Mail className="size-3.5 shrink-0 text-gold-deep" aria-hidden="true" />
                      {person.email}
                    </a>
                    <a href={person.phoneHref} className="flex items-center gap-2.5 text-ink transition-colors hover:text-gold-deep">
                      <Phone className="size-3.5 shrink-0 text-gold-deep" aria-hidden="true" />
                      {person.phone}
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mt-6 flex items-start gap-2 text-[0.6875rem] leading-relaxed text-muted">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            {t('about.leadership.teamNote')}
          </p>
        </div>
      </section>

      <section className="section bg-canvas">
        <div className="shell">
          <SectionHeading
            eyebrow="The bench"
            title="Consultants, curriculum designers and trainers."
            text={t('about.overview.p2')}
          />

          <div className="mt-12 grid gap-px bg-line md:grid-cols-3">
            {bench.map((item, index) => (
              <Reveal key={item.label} delay={index * 0.05}>
                <div className="flex h-full flex-col bg-white p-7 sm:p-8">
                  <p className="font-display text-[2.4rem] leading-none text-navy">{item.value}</p>
                  <p className="mt-3 text-[0.8125rem] font-semibold uppercase tracking-[0.1em] text-gold-deep">
                    {item.label}
                  </p>
                  <p className="mt-3 text-[0.8125rem] leading-[1.8] text-muted">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
