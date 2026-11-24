import { Compass, Layers, ShieldCheck, Users } from 'lucide-react'
import { Reveal } from '@/components/common/Reveal'
import { useT } from '@/i18n/LanguageProvider'

const items = [
  { key: 1, Icon: Compass },
  { key: 2, Icon: Layers },
  { key: 3, Icon: Users },
  { key: 4, Icon: ShieldCheck },
]

export function WhySection() {
  const t = useT()

  return (
    <section className="relative overflow-hidden bg-navy-900 text-white" aria-labelledby="why-heading">
      <div className="hairline-grid absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="shell relative section">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow eyebrow-invert">{t('home.why.eyebrow')}</p>
            <h2
              id="why-heading"
              className="mt-5 max-w-xs text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-white"
            >
              {t('home.why.title')}
            </h2>
            <p className="mt-6 max-w-sm text-[0.875rem] leading-[1.8] text-white/55">
              {t('about.values.disclaimer')}
            </p>
          </div>

          <ul className="grid gap-px bg-white/10 sm:grid-cols-2">
            {items.map(({ key, Icon }, index) => (
              <Reveal key={key} delay={index * 0.05} as="li">
                <div className="group h-full bg-navy-900 px-6 py-8 transition-colors duration-500 hover:bg-navy">
                  <Icon className="size-6 text-gold" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-5 text-[1rem] font-semibold leading-snug text-white">
                    {t(`home.why.${key}.title`)}
                  </h3>
                  <p className="mt-2.5 text-[0.8125rem] leading-[1.8] text-white/55">
                    {t(`home.why.${key}.text`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
