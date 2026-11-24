import { ArrowRight, CalendarDays, Check, Clock, GraduationCap, Info, Laptop, Users } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { NotFoundInline, Notice } from '@/components/common/StateBlocks'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { getCourseById, getDurationLabel, trainingCategories, useRelatedCourses } from '@/data/courses'
import { CourseCard } from '@/components/training/CourseCard'

export function CourseDetailPage() {
  const { slug } = useParams()
  const t = useT()
  const course = getCourseById(slug)
  const related = useRelatedCourses(course, 3)

  usePageMeta({
    title: course?.title,
    description: course?.summary,
    image: course?.image,
  })

  if (!course) return <NotFoundInline />

  const categoryLabel = t(
    trainingCategories.find((item) => item.id === course.category)?.labelKey ?? 'common.category',
  )

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <img
          src={course.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/95 to-navy/65" aria-hidden="true" />
        <div className="shell relative pb-14 pt-28 sm:pt-32 lg:pb-20 lg:pt-36">
          <Breadcrumbs
            items={[
              { label: t('nav.training'), to: '/training' },
              { label: course.title, to: `/training/${course.id}` },
            ]}
            invert
            className="mb-8"
          />

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="bg-gold px-2.5 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-navy">
              {categoryLabel}
            </span>
            {course.certificationBody && <Badge variant="invert">{course.certificationBody}</Badge>}
          </div>

          <h1 className="mt-5 max-w-3xl text-[clamp(1.9rem,4.2vw,3.2rem)] font-semibold leading-[1.07] tracking-[-0.04em] text-white">
            {course.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[0.9375rem] leading-[1.85] text-white/65">{course.summary}</p>

          <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
            <div className="flex items-center gap-2.5">
              <Clock className="size-4 text-gold" aria-hidden="true" />
              <div>
                <dt className="text-[0.5rem] font-bold uppercase tracking-[0.16em] text-white/60">
                  {t('training.duration')}
                </dt>
                <dd className="text-[0.8125rem] font-semibold text-white">{getDurationLabel(course)}</dd>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <GraduationCap className="size-4 text-gold" aria-hidden="true" />
              <div>
                <dt className="text-[0.5rem] font-bold uppercase tracking-[0.16em] text-white/60">
                  {t('training.certBody')}
                </dt>
                <dd className="text-[0.8125rem] font-semibold text-white">
                  {course.certificationBody ?? 'CONSOL certificate'}
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <CalendarDays className="size-4 text-gold" aria-hidden="true" />
              <div>
                <dt className="text-[0.5rem] font-bold uppercase tracking-[0.16em] text-white/60">
                  {t('training.schedule')}
                </dt>
                <dd className="text-[0.8125rem] font-semibold text-white">{t('training.schedulePending')}</dd>
              </div>
            </div>
          </dl>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          <div className="space-y-12">
            <div>
              <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">
                {t('training.objectives')}
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {course.objectives.map((objective) => (
                  <li key={objective} className="flex gap-3 border border-line bg-canvas/60 p-4">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden="true" />
                    <span className="text-[0.8125rem] leading-relaxed text-ink/85">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">
                {t('training.curriculum')}
              </h2>
              <ol className="mt-5 divide-y divide-line border-y border-line">
                {course.curriculum.map((module, index) => (
                  <li key={module.title} className="flex gap-5 py-5">
                    <span className="font-display text-[1.05rem] leading-none text-gold-deep">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-[0.9375rem] font-semibold text-navy">{module.title}</h3>
                      <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">{module.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Notice className="mt-4" icon={Info}>
                Curriculum outline is indicative of the published course subject. The approved syllabus is issued to
                participants on registration.
              </Notice>
            </div>

            <div>
              <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">
                {t('training.audience')}
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2">
                {course.audience.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-2 border border-line px-3 py-2 text-[0.75rem] text-ink"
                  >
                    <Users className="size-3.5 text-gold-deep" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="border border-line bg-navy p-6 text-white">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-gold">
                {t('training.register.title')}
              </p>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-white/65">{t('training.register.subtitle')}</p>
              <Button asChild variant="gold" className="mt-5 w-full">
                <Link to={`/training/${course.id}/register`}>
                  {t('training.registerCta')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline-invert" className="mt-2 w-full">
                <Link to="/request-consultation">{t('training.enquire')}</Link>
              </Button>
            </div>

            <dl className="divide-y divide-line border border-line">
              {[
                { icon: Clock, label: t('training.duration'), value: getDurationLabel(course) },
                { icon: Laptop, label: t('training.fee'), value: t('training.feePending') },
                { icon: CalendarDays, label: t('training.schedule'), value: t('training.schedulePending') },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 px-5 py-4">
                  <dt className="flex items-center gap-2 text-[0.75rem] text-muted">
                    <row.icon className="size-3.5 text-gold-deep" aria-hidden="true" />
                    {row.label}
                  </dt>
                  <dd className="text-[0.75rem] font-semibold text-navy">{row.value}</dd>
                </div>
              ))}
            </dl>

            <Notice>{t('training.deliveryNote')}</Notice>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section bg-canvas">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
              <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">{t('training.related')}</h2>
              <Button asChild variant="link" size="sm" className="h-auto p-0">
                <Link to="/training">
                  {t('common.viewAll')}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <CourseCard key={item.id} course={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
