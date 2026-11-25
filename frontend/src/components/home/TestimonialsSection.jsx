import { Award, BadgeCheck, FileCheck, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/common/Reveal'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'

const verifiedInstitutionalEndorsements = [
  {
    institution: 'Project Management Institute (PMI)®',
    designation: 'Authorized Training Partner (ATP)',
    detail:
      'Verified accreditation ensuring all PMP® and CAPM® certification curricula meet PMI quality standards, taught by certified Authorized Training Instructors.',
    badge: 'PMI® ATP #5084',
    verifyUrl: 'https://www.credly.com/go/PMyn0GAV',
  },
  {
    institution: 'Autodesk® Inc.',
    designation: 'Authorized Training Center (ATC)',
    detail:
      'Accredited delivery of Building Information Modeling (BIM), Revit, Civil 3D, and engineering software courses aligned with Autodesk global standards.',
    badge: 'Autodesk® ATC',
    verifyUrl: null,
  },
  {
    institution: 'Pearson VUE',
    designation: 'Authorized Test Center',
    detail:
      'Officially commissioned testing facility administering secure, internationally recognized certification examinations in Addis Ababa.',
    badge: 'Pearson VUE Testing',
    verifyUrl: null,
  },
]

export function TestimonialsSection() {
  const t = useT()

  return (
    <section className="section bg-white" aria-labelledby="testimonials-heading">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="eyebrow">{t('home.testimonials.eyebrow')}</p>
              <h2
                id="testimonials-heading"
                className="mt-4 text-[clamp(1.85rem,3.2vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-navy"
              >
                {t('home.testimonials.title')}
              </h2>
              <p className="mt-5 text-[0.9375rem] leading-[1.8] text-muted">
                {t('home.testimonials.lead')}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 border border-gold/40 bg-gold/5 p-6 text-[0.8125rem] text-navy">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-gold-deep" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">{t('home.testimonials.policy')}</p>
                    <p className="mt-2 text-muted">
                      Formal project performance assessments, World Bank-funded UIIDP program documents, and
                      institutional completion certificates are maintained in CONSOL’s corporate registry.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link to="/request-consultation">
                    {t('home.testimonials.cta')}
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="space-y-4">
            {verifiedInstitutionalEndorsements.map((item, index) => (
              <Reveal key={item.institution} delay={index * 0.08}>
                <div className="border border-line bg-canvas p-6 transition-all duration-300 hover:border-gold/50 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 bg-navy px-2.5 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-gold">
                      <BadgeCheck className="size-3 text-gold" aria-hidden="true" />
                      {item.badge}
                    </span>
                    {item.verifyUrl && (
                      <a
                        href={item.verifyUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 text-[0.6875rem] font-medium text-gold-deep hover:underline"
                      >
                        Verify accreditation
                      </a>
                    )}
                  </div>
                  <h3 className="mt-4 text-[1.0625rem] font-semibold text-navy">
                    {item.institution}
                  </h3>
                  <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted">
                    {item.designation}
                  </p>
                  <p className="mt-3 text-[0.8125rem] leading-[1.75] text-muted">
                    {item.detail}
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
