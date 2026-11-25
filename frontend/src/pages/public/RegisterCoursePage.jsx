import { ArrowLeft, GraduationCap } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { EmptyState, ErrorState, LoadingState, NotFoundInline } from '@/components/common/StateBlocks'
import { RegistrationForm } from '@/components/forms/RegistrationForm'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { useCourse } from '@/hooks/useCourses'

export function RegisterCoursePage() {
  const { slug } = useParams()
  const t = useT()
  const courseQuery = useCourse(slug)
  const course = courseQuery.data

  usePageMeta({
    title: course ? `Register — ${course.title}` : 'Course registration',
    description: course?.summary,
    noindex: true,
  })

  if (courseQuery.isPending) return <LoadingState className="shell section" />
  if (courseQuery.isError) {
    if (courseQuery.error?.response?.status === 404) return <NotFoundInline />
    return <div className="shell section"><ErrorState onRetry={courseQuery.refetch} /></div>
  }
  if (!course) return <NotFoundInline />

  return (
    <>
      <section className="bg-navy pb-12 pt-24 text-white sm:pt-28">
        <div className="shell">
          <Breadcrumbs
            items={[
              { label: t('nav.training'), to: '/training' },
              { label: course.title, to: `/training/${course.slug}` },
              { label: t('training.register.title'), to: `/training/${course.slug}/register` },
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
              <div className="grid aspect-[16/10] place-items-center bg-canvas text-navy/30">
                {course.image
                  ? <img src={course.image} alt={course.imageAlt || ''} className="h-full w-full object-cover" loading="lazy" />
                  : <GraduationCap className="size-12" aria-hidden="true" />}
              </div>
              <div className="p-6">
                <h2 className="text-[1.125rem] font-semibold leading-snug text-navy">{course.title}</h2>
                {course.duration && <p className="mt-3 text-sm text-muted">{t('training.duration')}: {course.duration}</p>}
                <Link
                  to={`/training/${course.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-navy hover:text-gold-deep"
                >
                  <ArrowLeft className="size-3.5" aria-hidden="true" />
                  Back to course
                </Link>
              </div>
            </div>
          </aside>

          <div className="border border-line p-6 sm:p-8">
            {course.registrationEnabled ? (
              <RegistrationForm course={course} />
            ) : (
              <EmptyState
                title="Registration is not open"
                text="This course is not currently accepting registration requests."
                action={<Button asChild variant="outline"><Link to={`/training/${course.slug}`}>Return to course</Link></Button>}
              />
            )}
          </div>
        </div>
      </section>
    </>
  )
}
