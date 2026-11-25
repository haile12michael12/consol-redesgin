import { Info, UserRound } from 'lucide-react'
import { AboutContentState } from '@/components/about/AboutContentState'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { PageHero } from '@/components/common/PageHero'
import { Reveal } from '@/components/common/Reveal'
import { SectionHeading } from '@/components/common/SectionHeading'
import { useAbout } from '@/hooks/useAbout'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { bench } from '@/data/team'

export function LeadershipPage() {
  const t = useT()
  const about = useAbout()
  usePageMeta({
    title: 'Leadership & Management',
    description:
      'Published leadership information for Construction Solutions PLC. Biographies and professional backgrounds are shown only when approved by CONSOL.',
    image: '/media/office-team.jpg',
  })

  return (
    <>
      <PageHero
        eyebrow={t('about.leadership.eyebrow')}
        title="Leadership & Management"
        text="Leadership profiles are limited to names and positions published by CONSOL. Unavailable details are clearly marked."
        breadcrumbs={[
          { label: t('nav.about'), to: '/about' },
          { label: t('nav.leadership'), to: '/about/leadership' },
        ]}
        image={{ src: '/media/office-team.jpg', alt: 'Professional team standing in an office lobby' }}
      />
      <AboutSubNav />

      <AboutContentState query={about}>
        {(content) => (
          <>
            <section className="section bg-white">
              <div className="shell">
                <div className="flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="eyebrow">{t('about.leadership.published')}</p>
                    <h2 className="mt-4 text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-[-0.03em] text-navy">
                      Company leadership
                    </h2>
                  </div>
                  <p className="max-w-sm text-[0.75rem] leading-relaxed text-muted">
                    Profile details below are drawn from CONSOL’s published contact information. No biography or
                    professional history is inferred.
                  </p>
                </div>

                {content.leadership.length ? (
                  <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {content.leadership.map((person, index) => (
                      <Reveal key={person.fullName} delay={index * 0.06}>
                        <article className="h-full overflow-hidden border border-line bg-white">
                          {person.photograph ? (
                            <img
                              src={person.photograph}
                              alt={person.fullName}
                              className="aspect-[16/8] w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div
                              className="grid aspect-[16/8] place-items-center bg-canvas text-muted"
                              aria-label="Profile photograph not provided"
                              role="img"
                            >
                              <div className="text-center">
                                <UserRound className="mx-auto size-10 text-gold-deep" strokeWidth={1.4} aria-hidden="true" />
                                <span className="mt-2 block text-[0.625rem] font-semibold uppercase tracking-[0.14em]">
                                  Photograph not provided
                                </span>
                              </div>
                            </div>
                          )}
                          <div className="border-b border-line p-6 sm:p-7">
                            <h3 className="text-[1.25rem] font-semibold leading-tight text-navy">{person.fullName}</h3>
                            <p className="mt-2 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-gold-deep">
                              {person.position}
                            </p>
                          </div>
                          <dl className="grid gap-5 p-6 sm:p-7">
                            <div>
                              <dt className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-muted">
                                Biography
                              </dt>
                              <dd className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink">
                                {person.biography || 'Biography pending approved information from CONSOL.'}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-muted">
                                Professional background
                              </dt>
                              <dd className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink">
                                {person.professionalBackground || 'Professional background has not been published.'}
                              </dd>
                            </div>
                          </dl>
                        </article>
                      </Reveal>
                    ))}
                  </div>
                ) : (
                  <p className="mt-10 border border-dashed border-line-strong px-6 py-10 text-center text-muted">
                    No leadership profiles are currently published.
                  </p>
                )}

                <p className="mt-6 flex items-start gap-2 text-[0.6875rem] leading-relaxed text-muted">
                  <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  Leadership profiles are published only after company verification and approval.
                </p>
              </div>
            </section>

            <section className="section bg-canvas">
              <div className="shell">
                <SectionHeading
                  eyebrow="Professional capability"
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
        )}
      </AboutContentState>
    </>
  )
}
