import { ArrowLeft, Check, Clock, GraduationCap } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { NotFoundInline } from '@/components/common/StateBlocks'
import { RegistrationForm } from '@/components/forms/RegistrationForm'
import { Badge } from '@/components/ui/badge'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { getCourseById, getDurationLabel } from '@/data/courses'

export function RegisterCoursePage() {
  const { slug } = useParams()
  const t = useT()
  const course = getCourseById(slug)

  usePageMeta({
    title: course ? `Register — ${course.title}` : 'Course registration',
    description: course?.summary,
    noindex: true,
  })

  if (!course) return <NotFoundInline />

  return (
    <>
      <section className="bg-navy pb-12 pt-24 text-white sm:pt-28">
        <div className="shell">
          <Breadcrumbs
            items={[
              { label: t('nav.training'), to: '/training' },
              { label: course.title, to: `/training/${course.id}` },
              { label: t('training.register.title'), to: `/training/${course.id}/register` },
            ]}
            invert
            className="mb-8"
          />
          <p className="eyebrow eyebrow-invert">{t('training.register.title')}</p>
          <h1 className="mt-4 max-w-3xl text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.07] tracking-[-0.04em] text-white">
            {t('training.register.title')}
          </h1>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-white/60">
            {t('training.register.subtitle')}
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <aside>
            <div className="border border-line">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={course.image} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="p-6">
                {course.certificationBody && (
                  <Badge variant="gold">{course.certificationBody}</Badge>
                )}
                <h2 className="mt-3 text-[1.125rem] font-semibold leading-snug text-navy">{course.title}</h2>
                <dl className="mt-5 space-y-2.5 border-t border-line pt-4 text-[0.8125rem]">
                  <div className="flex items-center justify-between">
                    <dt className="flex items-center gap-2 text-muted">
                      <Clock className="size-3.5 text-gold-deep" aria-hidden="true" />
                      {t('training.duration')}
                    </dt>
                    <dd className="font-semibold text-navy">{getDurationLabel(course)}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="flex items-center gap-2 text-muted">
                      <GraduationCap className="size-3.5 text-gold-deep" aria-hidden="true" />
                      {t('training.fee')}
                    </dt>
                    <dd className="font-semibold text-navy">{t('training.feePending')}</dd>
                  </div>
                </dl>

                <ul className="mt-5 space-y-2 border-t border-line pt-4">
                  {course.objectives.slice(0, 3).map((objective) => (
                    <li key={objective} className="flex gap-2 text-[0.75rem] leading-relaxed text-muted">
                      <Check className="mt-0.5 size-3 shrink-0 text-gold-deep" aria-hidden="true" />
                      {objective}
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/training/${course.id}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-navy hover:text-gold-deep"
                >
                  <ArrowLeft className="size-3.5" aria-hidden="true" />
                  Back to course
                </Link>
              </div>
            </div>
          </aside>

          <div className="border border-line p-6 sm:p-8">
            <RegistrationForm course={course} />
          </div>
        </div>
      </section>
    </>
  )
}
