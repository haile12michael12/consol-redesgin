import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/common/Reveal'
import { useT } from '@/i18n/LanguageProvider'

export function IntroSection() {
  const t = useT()

  return (
    <section className="section bg-white">
      <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="relative">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden bg-canvas sm:aspect-[5/4] lg:aspect-[4/5]">
              <img
                src="/media/consultancy.jpg"
                alt="CONSOL consultants reviewing project documents in a meeting"
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/45 via-transparent to-transparent" aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <figure className="relative -mt-16 ml-6 mr-0 max-w-sm border-t-2 border-gold bg-navy px-6 py-6 text-white shadow-[0_30px_60px_-40px_rgba(16,29,50,0.8)] sm:-mt-20 sm:ml-10">
              <blockquote className="font-display text-[1.35rem] leading-snug text-white">
                “{t('home.intro.quote')}”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-2.5 text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-gold-soft">
                <span className="h-px w-5 bg-gold" aria-hidden="true" />
                {t('home.intro.quoteLabel')}
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="lg:pt-6">
          <Reveal>
            <p className="eyebrow">{t('home.intro.eyebrow')}</p>
            <h2 className="mt-5 max-w-lg text-[clamp(1.95rem,3.5vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-navy">
              {t('home.intro.title')}
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-7 max-w-xl text-[1.0625rem] leading-[1.85] text-ink/80">
              {t('home.intro.lead')}
            </p>
            <p className="mt-5 max-w-xl text-[0.9375rem] leading-[1.85] text-muted">
              {t('home.intro.body')}
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-8 sm:grid-cols-3">
              {[
                { value: '4', label: t('about.overview.pillar') },
                { value: '2005', label: 'Established (G.C.)' },
                { value: 'Addis Ababa', label: 'Head office' },
              ].map((item) => (
                <div key={item.label}>
                  <dd className="text-[1.5rem] font-semibold tracking-[-0.02em] text-navy">{item.value}</dd>
                  <dt className="mt-1 text-[0.625rem] font-semibold uppercase leading-snug tracking-[0.12em] text-muted">
                    {item.label}
                  </dt>
                </div>
              ))}
            </dl>

            <Link to="/about" className="link-arrow mt-9">
              {t('home.intro.cta')}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
