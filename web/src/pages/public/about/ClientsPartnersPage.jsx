import { ArrowRight, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { PageHero } from '@/components/common/PageHero'
import { Reveal } from '@/components/common/Reveal'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { clientCategories, clients, partners } from '@/data/clients'

export function ClientsPartnersPage() {
  const t = useT()
  usePageMeta({
    title: 'Clients & Partners',
    description:
      'Organisations named in engagements published by CONSOL, across government, construction, banking, telecom and professional associations.',
    image: '/media/adama-city.jpg',
  })

  const grouped = clientCategories.map((category) => ({
    category,
    members: clients.filter((client) => {
      const map = {
        Government: 'Government institutes and enterprises',
        'Regional government': 'Government institutes and enterprises',
        Contractor: 'Private construction and consulting companies',
        Technology: 'Private construction and consulting companies',
        Banking: 'Banks, insurers and telecom operators',
        Telecom: 'Banks, insurers and telecom operators',
        Utilities: 'Banks, insurers and telecom operators',
        'Professional association': 'Professional associations and NGOs',
      }
      return map[client.sector] === category
    }),
  }))

  return (
    <>
      <PageHero
        eyebrow={t('about.clients.eyebrow')}
        title={t('about.clients.title')}
        text={t('about.clients.text')}
        breadcrumbs={[
          { label: t('nav.about'), to: '/about' },
          { label: t('nav.clientsPartners'), to: '/about/clients-partners' },
        ]}
        image={{ src: '/media/adama-city.jpg', alt: 'Addis Ababa at golden hour' }}
      />
      <AboutSubNav />

      <section className="section bg-white">
        <div className="shell space-y-12">
          {grouped.map(
            (group, groupIndex) =>
              group.members.length > 0 && (
                <div key={group.category}>
                  <div className="flex items-center gap-4 border-b border-line pb-4">
                    <span className="font-display text-sm text-gold-deep">0{groupIndex + 1}</span>
                    <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.16em] text-navy">
                      {group.category}
                    </h2>
                  </div>
                  <div className="mt-2 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
                    {group.members.map((client) => (
                      <div key={client.name} className="group bg-white p-6 transition-colors hover:bg-canvas">
                        <p className="text-[0.875rem] font-semibold leading-snug text-navy">{client.name}</p>
                        <p className="mt-2 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-gold-deep">
                          {client.detail}
                        </p>
                        <p className="mt-1 text-[0.6875rem] text-muted">Sector: {client.sector}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ),
          )}
        </div>
      </section>

      <section className="section bg-canvas">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow">{t('home.credibility.credentials')}</p>
            <h2 className="mt-5 text-[clamp(1.7rem,3vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-navy">
              Accreditation partners
            </h2>
          </div>

          <div className="mt-10 grid gap-px bg-line md:grid-cols-3">
            {partners.map((partner, index) => (
              <Reveal key={partner.name} delay={index * 0.05}>
                <div className="h-full bg-white p-7">
                  <p className="text-[1.0625rem] font-semibold text-navy">{partner.name}</p>
                  <p className="mt-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-gold-deep">
                    {partner.detail}
                  </p>
                  {partner.verify ? (
                    <a
                      href={partner.verify}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-4 inline-flex text-[0.6875rem] font-semibold text-navy underline decoration-gold underline-offset-4 hover:text-gold-deep"
                    >
                      Verification on Credly
                    </a>
                  ) : (
                    <p className="mt-4 text-[0.6875rem] text-muted">Verification link not published</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-8 flex items-start gap-2 text-[0.6875rem] leading-relaxed text-muted">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            Organisations are listed because they appear in CONSOL’s published engagements. No client logo, testimonial
            or endorsement is displayed without written permission.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/projects">
                {t('nav.projects')}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/request-consultation">{t('nav.requestConsultation')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
