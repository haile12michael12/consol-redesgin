import { BadgeCheck, ExternalLink } from 'lucide-react'
import { Reveal } from '@/components/common/Reveal'
import { useT } from '@/i18n/LanguageProvider'
import { credentials, institutionalFacts } from '@/lib/site'

export function CredibilitySection() {
  const t = useT()

  return (
    <section className="section bg-navy text-white" aria-labelledby="credibility-heading">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow eyebrow-invert">{t('home.credibility.eyebrow')}</p>
            <h2
              id="credibility-heading"
              className="mt-5 max-w-md text-[clamp(1.9rem,3.4vw,2.85rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-white"
            >
              {t('home.credibility.title')}
            </h2>
            <p className="mt-6 max-w-md text-[0.9375rem] leading-[1.85] text-white/60">
              {t('home.credibility.text')}
            </p>

            <div className="mt-10 border-t border-white/12 pt-8">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-white/55">
                {t('home.credibility.credentials')}
              </p>
              <ul className="mt-4 space-y-3">
                {credentials.map((credential) => (
                  <li key={credential.id} className="flex items-start gap-3">
                    <BadgeCheck className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                    <div>
                      <p className="text-[0.8125rem] font-semibold text-white/90">{credential.name}</p>
                      {credential.verify && (
                        <a
                          href={credential.verify}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mt-0.5 inline-flex items-center gap-1 text-[0.6875rem] text-gold-soft hover:text-white"
                        >
                          {credential.verifyLabel}
                          <ExternalLink className="size-3" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-px border border-white/12 bg-white/12 sm:grid-cols-2">
            {institutionalFacts.map((fact, index) => (
              <Reveal key={fact.label} delay={0.06 * index}>
                <div className="group h-full bg-navy px-6 py-7 transition-colors duration-500 hover:bg-navy-soft sm:px-8 sm:py-9">
                  <p className="font-display text-[clamp(2.1rem,4vw,2.9rem)] leading-none text-gold">
                    {fact.value}
                  </p>
                  <p className="mt-3 text-[0.8125rem] font-semibold leading-snug text-white">{fact.label}</p>
                  <p className="mt-2.5 text-[0.75rem] leading-relaxed text-white/50">{fact.detail}</p>
                  <p className="mt-4 text-[0.5rem] font-bold uppercase tracking-[0.16em] text-white/55">
                    {t('home.credibility.source')}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
