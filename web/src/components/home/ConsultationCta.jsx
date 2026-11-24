import { ArrowRight, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/common/Reveal'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { contact } from '@/lib/site'

export function ConsultationCta() {
  const t = useT()

  return (
    <section className="relative isolate overflow-hidden bg-navy py-20 text-white sm:py-24" aria-labelledby="cta-heading">
      <img
        src="/media/adama-city.jpg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/95 to-navy/60" aria-hidden="true" />
      <div className="hairline-grid absolute inset-0 -z-10 opacity-30" aria-hidden="true" />

      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16">
          <Reveal>
            <p className="eyebrow eyebrow-invert">{t('home.cta.eyebrow')}</p>
            <h2
              id="cta-heading"
              className="mt-5 max-w-2xl text-[clamp(1.95rem,3.8vw,3.15rem)] font-semibold leading-[1.06] tracking-[-0.04em] text-white"
            >
              {t('home.cta.title')}
            </h2>
            <p className="mt-6 max-w-xl text-[0.9375rem] leading-[1.85] text-white/60">{t('home.cta.text')}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border border-white/15 bg-white/[0.04] p-7 backdrop-blur-sm">
              <Button asChild variant="gold" size="lg" className="w-full">
                <Link to="/request-consultation">
                  {t('home.cta.button')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Link
                to="/contact"
                className="mt-3 flex h-12 w-full items-center justify-center border border-white/25 text-[0.8125rem] font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-navy"
              >
                {t('home.cta.contact')}
              </Link>

              <div className="mt-7 space-y-3 border-t border-white/12 pt-6 text-[0.8125rem]">
                <a
                  href={contact.landlineHref}
                  className="flex items-center gap-3 text-white/70 transition-colors hover:text-white"
                >
                  <Phone className="size-3.5 text-gold" aria-hidden="true" />
                  {contact.landline}
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 break-all text-white/70 transition-colors hover:text-white"
                >
                  <Mail className="size-3.5 shrink-0 text-gold" aria-hidden="true" />
                  {contact.email}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
