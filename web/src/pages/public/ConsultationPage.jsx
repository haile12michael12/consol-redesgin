import { Check, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { ConsultationForm } from '@/components/forms/ConsultationForm'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { contact } from '@/lib/site'
import { usePageMeta } from '@/lib/seo'

const steps = [1, 2, 3]

export function ConsultationPage() {
  const t = useT()
  usePageMeta({
    title: 'Request a Consultation',
    description:
      'Request a consultation with Construction Solutions PLC for construction management, business management, training or research engagements.',
    image: '/media/consultancy.jpg',
  })

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy pb-14 pt-24 text-white sm:pt-28 lg:pb-20">
        <img
          src="/media/consultancy.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/95 to-navy/65" aria-hidden="true" />
        <div className="shell relative">
          <Breadcrumbs
            items={[{ label: t('consult.hero.eyebrow'), to: '/request-consultation' }]}
            invert
            className="mb-8"
          />
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="eyebrow eyebrow-invert">{t('consult.hero.eyebrow')}</p>
              <h1 className="mt-4 max-w-2xl text-[clamp(2rem,4.4vw,3.35rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-white">
                {t('consult.hero.title')}
              </h1>
              <p className="mt-5 max-w-xl text-[0.9375rem] leading-[1.85] text-white/60">{t('consult.hero.text')}</p>
            </div>

            <ol className="space-y-4 border-l border-white/15 pl-6">
              {steps.map((step) => (
                <li key={step} className="flex gap-3.5">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center border border-gold/50 bg-gold/10">
                    <Check className="size-3 text-gold" aria-hidden="true" />
                  </span>
                  <p className="text-[0.8125rem] leading-relaxed text-white/70">{t(`consult.side.${step}`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          <div>
            <h2 className="text-[1.35rem] font-semibold tracking-[-0.02em] text-navy">
              {t('consult.hero.title')}
            </h2>
            <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">
              Fields marked with an asterisk are required.
            </p>
            <div className="mt-7">
              <ConsultationForm />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="border border-line bg-canvas p-6">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-muted">
                {t('consult.side.title')}
              </p>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">{t('consult.side.note')}</p>
              <ul className="mt-5 space-y-3 border-t border-line pt-4 text-[0.8125rem]">
                <li>
                  <a href={contact.landlineHref} className="flex items-center gap-2.5 text-ink hover:text-gold-deep">
                    <Phone className="size-3.5 text-gold-deep" aria-hidden="true" />
                    {contact.landline}
                  </a>
                </li>
                <li>
                  <a href={contact.mobileHref} className="flex items-center gap-2.5 text-ink hover:text-gold-deep">
                    <Phone className="size-3.5 text-gold-deep/60" aria-hidden="true" />
                    {contact.mobile}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2.5 break-all text-ink hover:text-gold-deep"
                  >
                    <Mail className="size-3.5 shrink-0 text-gold-deep" aria-hidden="true" />
                    {contact.email}
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-navy p-6 text-white">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-gold">
                {t('nav.training')}
              </p>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-white/70">{t('training.how.2.text')}</p>
              <Button asChild variant="outline-invert" className="mt-5 w-full">
                <Link to="/training">{t('nav.training')}</Link>
              </Button>
            </div>

            <div className="border border-line p-6">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-muted">
                {t('common.name')} — privacy
              </p>
              <p className="mt-3 text-[0.75rem] leading-relaxed text-muted">
                Information submitted here is used only to respond to your enquiry. A formal privacy notice is pending
                legal review and will be published before production launch.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
