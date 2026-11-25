import { ArrowRight, CalendarDays, Check, Clock, GraduationCap, Laptop, Users } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { EmptyState, ErrorState, LoadingState, NotFoundInline } from '@/components/common/StateBlocks'
import { CourseCard } from '@/components/training/CourseCard'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { useCourse } from '@/hooks/useCourses'

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeStyle: 'short' }).format(new Date(value))
}

export function CourseDetailPage() {
  const { slug } = useParams()
  const t = useT()
  const courseQuery = useCourse(slug)
  const course = courseQuery.data
  const related = course?.relatedCourses ?? []

  usePageMeta({
    title: course?.seoTitle || course?.title || 'Training course',
    description: course?.seoDescription || course?.summary,
    image: course?.image,
  })

  if (courseQuery.isPending) return <LoadingState className="shell section" />
  if (courseQuery.isError) {
    if (courseQuery.error?.response?.status === 404) return <NotFoundInline />
    return <div className="shell section"><ErrorState onRetry={courseQuery.refetch} /></div>
  }
  if (!course) return <NotFoundInline />

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        {course.image && (
          <img
            src={course.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/95 to-navy/65" aria-hidden="true" />
        <div className="shell relative pb-14 pt-28 sm:pt-32 lg:pb-20 lg:pt-36">
          <Breadcrumbs
            items={[
              { label: t('nav.training'), to: '/training' },
              { label: course.title, to: `/training/${course.slug}` },
            ]}
            invert
            className="mb-8"
          />
          {course.category?.name && (
            <span className="bg-gold px-2.5 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-navy">
              {course.category.name}
            </span>
          )}
          <h1 className="mt-5 max-w-3xl text-[clamp(1.9rem,4.2vw,3.2rem)] font-semibold leading-[1.07] tracking-[-0.04em] text-white">
            {course.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[0.9375rem] leading-[1.85] text-white/65">{course.summary}</p>

          <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
            {course.duration && (
              <div className="flex items-center gap-2.5">
                <Clock className="size-4 text-gold" aria-hidden="true" />
                <div>
                  <dt className="text-[0.5rem] font-bold uppercase tracking-[0.16em] text-white/60">{t('training.duration')}</dt>
                  <dd className="text-[0.8125rem] font-semibold text-white">{course.duration}</dd>
                </div>
              </div>
            )}
            {course.deliveryMethod && (
              <div className="flex items-center gap-2.5">
                <Laptop className="size-4 text-gold" aria-hidden="true" />
                <div>
                  <dt className="text-[0.5rem] font-bold uppercase tracking-[0.16em] text-white/60">Delivery method</dt>
                  <dd className="text-[0.8125rem] font-semibold text-white">{course.deliveryMethod}</dd>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2.5">
              <CalendarDays className="size-4 text-gold" aria-hidden="true" />
              <div>
                <dt className="text-[0.5rem] font-bold uppercase tracking-[0.16em] text-white/60">{t('training.schedule')}</dt>
                <dd className="text-[0.8125rem] font-semibold text-white">
                  {course.schedules.length ? `${course.schedules.length} upcoming` : 'No dates published'}
                </dd>
              </div>
            </div>
          </dl>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          <div className="space-y-12">
            <div>
              <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">Course overview</h2>
              <div className="mt-5 whitespace-pre-line text-[0.9375rem] leading-[1.85] text-muted">{course.description}</div>
            </div>

            {course.learningObjectives.length > 0 && (
              <div>
                <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">{t('training.objectives')}</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {course.learningObjectives.map((objective) => (
                    <li key={objective} className="flex gap-3 border border-line bg-canvas/60 p-4">
                      <Check className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden="true" />
                      <span className="text-[0.8125rem] leading-relaxed text-ink/85">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.curriculum.length > 0 && (
              <div>
                <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">{t('training.curriculum')}</h2>
                <ol className="mt-5 divide-y divide-line border-y border-line">
                  {course.curriculum.map((module, index) => (
                    <li key={`${module.title}-${index}`} className="flex gap-5 py-5">
                      <span className="font-display text-[1.05rem] leading-none text-gold-deep">{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <h3 className="text-[0.9375rem] font-semibold text-navy">{module.title}</h3>
                        <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">{module.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {course.requirements.length > 0 && (
              <div>
                <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">Requirements</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-[0.875rem] leading-relaxed text-muted">
                  {course.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}
                </ul>
              </div>
            )}

            {course.credential && (
              <div className="border border-line bg-canvas/60 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-muted">Verified credential information</p>
                <p className="mt-2 font-semibold text-navy">{course.credential.name}</p>
                <p className="mt-1 text-sm text-muted">{course.credential.issuer}</p>
              </div>
            )}

            {course.schedules.length > 0 && (
              <div>
                <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">Upcoming schedules</h2>
                <ul className="mt-4 divide-y divide-line border-y border-line">
                  {course.schedules.map((schedule) => (
                    <li key={schedule.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                      <div>
                        <p className="font-semibold text-navy">{schedule.label}</p>
                        <p className="mt-1 text-sm text-muted">{formatDate(schedule.startsAt)}{schedule.location ? ` · ${schedule.location}` : ''}</p>
                      </div>
                      <span className="text-xs font-semibold text-muted">
                        {schedule.registrationOpen ? 'Registration open' : 'Not currently open'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.instructors.length > 0 && (
              <div>
                <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">Instructors</h2>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                  {course.instructors.map((instructor) => (
                    <li key={instructor.id} className="border border-line p-5">
                      <Link to={`/training/instructors/${instructor.slug}`} className="font-semibold text-navy hover:text-gold-deep">
                        {instructor.name}
                      </Link>
                      {instructor.position && <p className="mt-1 text-sm text-muted">{instructor.position}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.faqs.length > 0 && (
              <div>
                <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">Frequently asked questions</h2>
                <div className="mt-4 divide-y divide-line border-y border-line">
                  {course.faqs.map((faq, index) => (
                    <details key={`${faq.question}-${index}`} className="group py-4">
                      <summary className="cursor-pointer font-semibold text-navy">{faq.question}</summary>
                      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="border border-line bg-navy p-6 text-white">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-gold">{t('training.register.title')}</p>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-white/65">
                {course.registrationEnabled
                  ? 'Submit a registration request and the training team will follow up.'
                  : 'Registration is not currently open for this course.'}
              </p>
              {course.registrationEnabled && (
                <Button asChild variant="gold" className="mt-5 w-full">
                  <Link to={`/training/${course.slug}/register`}>
                    {t('training.registerCta')}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline-invert" className="mt-2 w-full">
                <Link to="/request-consultation">{t('training.enquire')}</Link>
              </Button>
            </div>

            {course.certificateSupported && (
              <div className="border border-line p-5">
                <GraduationCap className="size-5 text-gold-deep" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-navy">Certificate issuing is supported for this course.</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">Certificates are issued only after attendance and administrator review.</p>
              </div>
            )}

            <div className="border border-line p-5">
              <Users className="size-5 text-gold-deep" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-navy">Course details</p>
              <dl className="mt-3 space-y-2 text-sm">
                {course.duration && <div className="flex justify-between gap-3"><dt className="text-muted">{t('training.duration')}</dt><dd className="text-right font-medium text-navy">{course.duration}</dd></div>}
                {course.deliveryMethod && <div className="flex justify-between gap-3"><dt className="text-muted">Delivery</dt><dd className="text-right font-medium text-navy">{course.deliveryMethod}</dd></div>}
                {course.credential && <div className="flex justify-between gap-3"><dt className="text-muted">Credential</dt><dd className="text-right font-medium text-navy">{course.credential.name}</dd></div>}
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section bg-canvas">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
              <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-navy">{t('training.related')}</h2>
              <Button asChild variant="link" size="sm" className="h-auto p-0"><Link to="/training">{t('common.viewAll')}</Link></Button>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => <CourseCard key={item.id} course={item} />)}
            </div>
          </div>
        </section>
      )}

      {course.schedules.length === 0 && course.instructors.length === 0 && course.learningObjectives.length === 0 && (
        <section className="shell pb-12">
          <EmptyState title="Additional course information is not published" text="Confirmed objectives, instructors and schedules will appear here when available." />
        </section>
      )}
    </>
  )
}
