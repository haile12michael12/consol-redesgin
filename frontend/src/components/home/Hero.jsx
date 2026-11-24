import { ArrowRight, ArrowUpRight, ShieldCheck } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { company } from '@/lib/site'

export function Hero() {
  const t = useT()
  const reduce = useReducedMotion()

  const fade = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.22, 0.61, 0.36, 1] },
        }

  return (
    <section className="relative isolate min-h-[clamp(32rem,84svh,52rem)] overflow-hidden bg-navy text-white">
      <img
        src="/media/hero-construction.jpg"
        alt="Two tower cranes above a high-rise structure under construction at dusk"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[62%_center]"
        fetchPriority="high"
        decoding="async"
      />
      {/* Layered overlays: navy wash + directional gradient for text contrast */}
      <div className="absolute inset-0 -z-10 bg-navy/70" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/85 to-navy/25"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-navy to-transparent"
        aria-hidden="true"
      />

      <div className="shell relative flex min-h-[clamp(32rem,84svh,52rem)] flex-col justify-center pb-28 pt-24 lg:pb-32">
        <motion.div {...fade(0.05)} className="flex items-center gap-3">
          <span className="h-px w-9 bg-gold" aria-hidden="true" />
          <p className="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-gold-soft">
            {t('home.hero.eyebrow')}
          </p>
        </motion.div>

        <h1 className="mt-7 max-w-5xl text-[clamp(2.35rem,6vw,4.9rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-white">
          <motion.span {...fade(0.12)} className="block">
            {t('home.hero.title1')}
          </motion.span>
          <motion.span {...fade(0.2)} className="block">
            {t('home.hero.title2')}
          </motion.span>
          <motion.span {...fade(0.28)} className="block text-gold-soft">
            {t('home.hero.title3')}
          </motion.span>
        </h1>

        <motion.p
          {...fade(0.36)}
          className="mt-7 max-w-xl text-[0.9375rem] leading-[1.85] text-white/70 sm:text-base"
        >
          {t('home.hero.intro')}
        </motion.p>

        <motion.div {...fade(0.44)} className="mt-9 flex flex-wrap items-center gap-3">
          <Button asChild variant="gold" size="lg">
            <Link to="/services">
              {t('home.hero.ctaServices')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline-invert" size="lg">
            <Link to="/projects">{t('home.hero.ctaProjects')}</Link>
          </Button>
          <Link
            to="/request-consultation"
            className="group ml-1 inline-flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-white/70 transition-colors hover:text-white"
          >
            {t('home.hero.ctaConsult')}
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        <motion.p
          {...fade(0.52)}
          className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white/70"
        >
          <ShieldCheck className="size-3.5 text-gold" aria-hidden="true" />
          {['PMI® ATP', 'Autodesk® ATC', 'Pearson VUE'].map((item) => (
            <span key={item} className="flex items-center gap-3">
              <span className="h-2.5 w-px bg-white/25" aria-hidden="true" />
              {item}
            </span>
          ))}
        </motion.p>
      </div>

      {/* Verified facts strip — in normal flow so it can never overlap the copy */}
      <motion.div className="relative border-t border-white/15 bg-navy/30 backdrop-blur-[6px]">
        <div className="shell grid grid-cols-2 divide-white/12 md:grid-cols-4 md:divide-x">
          {[
            { value: String(company.founded), label: t('home.hero.stat1') },
            { value: '100+', label: t('home.hero.statClients') },
            { value: '20,000+', label: t('home.hero.statTrained') },
            { value: '3', label: t('home.hero.stat2') },
          ].map((item) => (
            <div key={item.label} className="px-1 py-4 md:px-6 md:py-5">
              <p className="font-display text-[1.65rem] leading-none text-white">{item.value}</p>
              <p className="mt-1.5 text-[0.5625rem] font-semibold uppercase leading-tight tracking-[0.14em] text-white/50">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="absolute right-6 top-24 hidden items-center gap-2 text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-white/55 lg:flex">
        <ShieldCheck className="size-3.5 text-gold" aria-hidden="true" />
        PMI® ATP · Autodesk® ATC · Pearson VUE
      </div>
    </section>
  )
}
