import { ArrowUpRight, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/common/Reveal'
import { useT } from '@/i18n/LanguageProvider'
import { clients, partners } from '@/data/clients'

export function ClientsSection() {
  const t = useT()

  return (
    <section className="section bg-white" aria-labelledby="clients-heading">
      <div className="shell">
        <div className="flex flex-col gap-6 border-b border-line pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">{t('home.clients.eyebrow')}</p>
            <h2
              id="clients-heading"
              className="mt-5 text-[clamp(1.8rem,3.2vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-navy"
            >
              {t('home.clients.title')}
            </h2>
            <p className="mt-4 max-w-xl text-[0.875rem] leading-[1.8] text-muted">{t('home.clients.text')}</p>
          </div>
          <Link to="/about/clients-partners" className="link-arrow shrink-0">
            {t('home.clients.cta')}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {clients.slice(0, 8).map((client, index) => (
            <Reveal key={client.name} delay={index * 0.03}>
              <div className="flex h-full min-h-[7.5rem] flex-col justify-between bg-white p-5 transition-colors duration-300 hover:bg-canvas">
                <p className="text-[0.75rem] font-bold leading-snug tracking-[0.02em] text-navy/85">
                  {client.name}
                </p>
                <p className="mt-4 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-muted">
                  {client.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-line pt-8">
          <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-muted">
            {t('home.credibility.credentials')}
          </p>
          {partners.map((partner) => (
            <div key={partner.name} className="flex items-baseline gap-2">
              <span className="text-[0.8125rem] font-semibold text-navy">{partner.name}</span>
              <span className="text-[0.5625rem] font-medium uppercase tracking-[0.1em] text-muted">
                {partner.detail}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-6 flex items-start gap-2 text-[0.6875rem] leading-relaxed text-muted">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          Client names appear in engagements and programmes published by CONSOL. Typographic marks are used instead of
          logos pending written permission from each organisation.
        </p>
      </div>
    </section>
  )
}
