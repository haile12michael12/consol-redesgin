import { Award, Compass, Handshake, Lightbulb, ShieldCheck, Target } from 'lucide-react'
import { Reveal } from '@/components/common/Reveal'
import { SectionHeading } from '@/components/common/SectionHeading'

const valueIcons = [Compass, ShieldCheck, Handshake, Lightbulb, Target, Award]

export function CoreValuesSection({ values }) {
  return (
    <section className="section bg-canvas">
      <div className="shell">
        <SectionHeading
          eyebrow="Core values"
          title="The principles that guide our work."
          text="Only values formally published or approved by CONSOL are displayed here."
        />

        {values?.length ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length]
              return (
                <Reveal key={`${value.title}-${index}`} delay={index * 0.04}>
                  <article className="h-full border border-line bg-white p-7 transition-colors duration-300 hover:border-navy">
                    <Icon className="size-5 text-gold-deep" strokeWidth={1.6} aria-hidden="true" />
                    <h3 className="mt-5 text-[1rem] font-semibold leading-snug text-navy">{value.title}</h3>
                    {value.description && (
                      <p className="mt-2.5 text-[0.8125rem] leading-[1.8] text-muted">{value.description}</p>
                    )}
                  </article>
                </Reveal>
              )
            })}
          </div>
        ) : (
          <div className="mt-10 border border-dashed border-line-strong bg-white px-6 py-10 text-center">
            <p className="text-[0.9375rem] font-semibold text-navy">Core values are being prepared for publication.</p>
            <p className="mx-auto mt-2 max-w-xl text-[0.8125rem] leading-relaxed text-muted">
              CONSOL has not yet provided an approved set of core values for this page.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
