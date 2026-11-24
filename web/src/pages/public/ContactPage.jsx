import { Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '@/components/common/PageHero'
import { Notice } from '@/components/common/StateBlocks'
import { SectionHeading } from '@/components/common/SectionHeading'
import { ContactForm } from '@/components/forms/ContactForm'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { contact } from '@/lib/site'
import { usePageMeta } from '@/lib/seo'
import { team } from '@/data/team'

const mapsQuery = encodeURIComponent(
  'Meskel Flower, Wello Sefer Street, Martereza Building, Addis Ababa, Ethiopia',
)

export function ContactPage() {
  const t = useT()
  usePageMeta({
    title: 'Contact',
    description:
      'Contact Construction Solutions PLC (CONSOL) in Addis Ababa: office address, telephone, email and enquiry form for consultancy, training and certification.',
    image: '/media/adama-city.jpg',
  })

  const details = [
    {
      Icon: MapPin,
      label: t('contact.office'),
      content: (
        <address className="not-italic leading-relaxed">
          {contact.addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      ),
    },
    {
      Icon: Phone,
      label: t('contact.phone'),
      content: (
        <div className="space-y-1">
          <a href={contact.landlineHref} className="block hover:text-gold-deep">
            {contact.landline} <span className="text-muted">· office</span>
          </a>
          <a href={contact.mobileHref} className="block hover:text-gold-deep">
            {contact.mobile} <span className="text-muted">· mobile</span>
          </a>
        </div>
      ),
    },
    {
      Icon: Mail,
      label: t('contact.email'),
      content: (
        <div className="space-y-1 break-all">
          <a href={`mailto:${contact.email}`} className="block hover:text-gold-deep">
            {contact.email}
          </a>
          <a href={`mailto:${contact.emailSecondary}`} className="block hover:text-gold-deep">
            {contact.emailSecondary}
          </a>
        </div>
      ),
    },
    {
      Icon: Clock,
      label: t('contact.hours'),
      content: <p className="leading-relaxed text-muted">{t('contact.hoursPending')}</p>,
    },
  ]

  return (
    <>
      <PageHero
        eyebrow={t('contact.hero.eyebrow')}
        title={t('contact.hero.title')}
        text={t('contact.hero.text')}
        breadcrumbs={[{ label: t('nav.contact'), to: '/contact' }]}
        image={{ src: '/media/adama-city.jpg', alt: 'Addis Ababa city view' }}
      />

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Details */}
          <div>
            <p className="eyebrow">{t('contact.direct')}</p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {details.map(({ Icon, label, content }) => (
                <li key={label} className="grid grid-cols-[2.25rem_1fr] gap-4 py-5 sm:grid-cols-[2.25rem_7rem_1fr]">
                  <span className="mt-0.5 grid size-9 place-items-center border border-line bg-canvas">
                    <Icon className="size-4 text-gold-deep" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-muted sm:pt-2.5">{label}</p>
                  <div className="col-span-2 text-[0.875rem] text-ink sm:col-span-1">{content}</div>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <p className="eyebrow">{t('contact.gm')}</p>
              <ul className="mt-4 space-y-3">
                {team.map((person) => (
                  <li key={person.name} className="flex items-start justify-between gap-4 border border-line p-4">
                    <div>
                      <p className="text-[0.875rem] font-semibold text-navy">{person.name}</p>
                      <p className="mt-0.5 text-[0.6875rem] uppercase tracking-[0.1em] text-gold-deep">
                        {t(person.roleKey)}
                      </p>
                    </div>
                    <a
                      href={`mailto:${person.email}`}
                      className="shrink-0 text-[0.6875rem] font-semibold text-navy underline decoration-gold underline-offset-4 hover:text-gold-deep"
                    >
                      Email
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="border border-line p-6 sm:p-8">
            <h2 className="text-[1.35rem] font-semibold tracking-[-0.02em] text-navy">{t('contact.form.title')}</h2>
            <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">{t('contact.form.text')}</p>
            <div className="mt-6">
              <ContactForm />
            </div>
            <p className="mt-6 border-t border-line pt-4 text-[0.6875rem] leading-relaxed text-muted">
              Prefer a structured brief?{' '}
              <Link to="/request-consultation" className="font-semibold text-navy underline decoration-gold underline-offset-4">
                {t('nav.requestConsultation')}
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Map + consultation */}
      <section className="section bg-canvas">
        <div className="shell">
          <SectionHeading
            eyebrow={t('contact.map')}
            title="Martereza Building, Addis Ababa."
            text={t('contact.mapPending')}
            action={
              <Button asChild variant="outline">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {t('contact.mapCta')}
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              </Button>
            }
          />

          <div className="mt-8 grid gap-px bg-line lg:grid-cols-[1.3fr_0.7fr]">
            <div className="relative min-h-[18rem] overflow-hidden bg-navy">
              <div className="hairline-grid absolute inset-0 opacity-40" aria-hidden="true" />
              <div className="absolute inset-0 grid place-items-center p-8 text-center">
                <div>
                  <MapPin className="mx-auto size-7 text-gold" aria-hidden="true" />
                  <p className="mt-4 text-[0.875rem] font-semibold text-white">Interactive map pending</p>
                  <p className="mx-auto mt-2 max-w-xs text-[0.75rem] leading-relaxed text-white/50">
                    {contact.addressLines.join(', ')}
                  </p>
                  <Button asChild variant="outline-invert" size="sm" className="mt-5">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Google Maps
                      <ExternalLink className="size-3.5" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between bg-white p-7">
              <div>
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-gold-deep">
                  {t('services.cta.eyebrow')}
                </p>
                <h3 className="mt-3 text-[1.25rem] font-semibold leading-snug text-navy">
                  {t('home.cta.title')}
                </h3>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">{t('home.cta.text')}</p>
              </div>
              <Button asChild variant="primary" className="mt-6 w-full">
                <Link to="/request-consultation">{t('nav.requestConsultation')}</Link>
              </Button>
            </div>
          </div>

          <Notice className="mt-6">
            Business hours and exact map coordinates are not published by CONSOL. Please call or email before visiting.
          </Notice>
        </div>
      </section>
    </>
  )
}
