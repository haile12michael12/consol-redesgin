import { ArrowRight, CalendarDays, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHero } from '@/components/common/PageHero'
import { SearchField } from '@/components/common/SearchField'
import { CardGridSkeleton, EmptyState, ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { SectionHeading } from '@/components/common/SectionHeading'
import { CourseCard } from '@/components/training/CourseCard'
import { Button } from '@/components/ui/button'
import { FilterPill } from '@/components/ui/tag'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { useCourseCategories, useCourses, useInstructors, useTrainingSchedules } from '@/hooks/useCourses'

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value))
}

export function TrainingPage() {
  const t = useT()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const category = params.get('category') ?? 'all'
  const page = Number(params.get('page') ?? 1)
  const coursesQuery = useCourses({
    q: params.get('q') || undefined,
    category: category === 'all' ? undefined : category,
    page,
    per_page: 9,
  })
  const categoriesQuery = useCourseCategories()
  const schedulesQuery = useTrainingSchedules({ per_page: 4 })
  const instructorsQuery = useInstructors()
  const courses = coursesQuery.data?.data ?? []
  const schedules = schedulesQuery.data?.data ?? []
  const instructors = instructorsQuery.data ?? []

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = new URLSearchParams(params)
      const term = query.trim()
      if (term === (params.get('q') ?? '')) return
      if (term) next.set('q', term)
      else next.delete('q')
      next.delete('page')
      setParams(next, { replace: true })
    }, 250)

    return () => window.clearTimeout(timer)
  }, [query, params, setParams])

  usePageMeta({
    title: 'Training and professional development',
    description: 'Explore CONSOL training courses and schedules currently published by the company.',
    image: '/media/training.jpg',
  })

  const updateParams = (updates) => {
    const next = new URLSearchParams(params)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value)
      else next.delete(key)
    })
    setParams(next, { replace: true })
  }

  const featuredCourses = courses.filter((course) => course.featured)
  const result = coursesQuery.data
  const isEmpty = !coursesQuery.isPending && !coursesQuery.isError && courses.length === 0

  return (
    <>
      <PageHero
        eyebrow={t('training.hero.eyebrow')}
        title={t('training.hero.title')}
        text="Browse course information and confirmed schedules published by CONSOL. Details are shown here only after they have been reviewed."
        breadcrumbs={[{ label: t('nav.training'), to: '/training' }]}
        image={{ src: '/media/training.jpg', alt: 'Training environment' }}
        actions={
          <>
            <Button asChild variant="gold">
              <Link to="#catalogue">
                {t('training.hero.cta')}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline-invert">
              <Link to="/training/schedule">
                <CalendarDays className="size-4" aria-hidden="true" />
                {t('training.calendar')}
              </Link>
            </Button>
          </>
        }
      />

      {featuredCourses.length > 0 && (
        <section className="section-sm border-b border-line bg-white">
          <div className="shell">
            <SectionHeading
              eyebrow={t('training.featured')}
              title="Featured courses"
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to="#catalogue">{t('common.viewAll')}</Link>
                </Button>
              }
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredCourses.slice(0, 4).map((course) => <CourseCard key={course.id} course={course} />)}
            </div>
          </div>
        </section>
      )}

      <section id="catalogue" className="section bg-canvas scroll-mt-24">
        <div className="shell">
          <SectionHeading
            eyebrow={t('training.categories')}
            title={t('training.allCourses')}
            text="Course offerings are published as they are confirmed."
          />

          <div className="mt-8 border border-line bg-white p-4 sm:p-5">
            <SearchField
              id="course-search"
              value={query}
              onChange={setQuery}
              placeholder={t('training.searchPlaceholder')}
            />
            {categoriesQuery.isError ? (
              <ErrorState className="mt-4" title="Course categories could not be loaded" onRetry={categoriesQuery.refetch} />
            ) : (
              <div
                className="no-scrollbar mt-4 flex gap-2 overflow-x-auto border-t border-line pt-4"
                role="group"
                aria-label={t('training.categories')}
              >
                <FilterPill active={category === 'all'} onClick={() => updateParams({ category: '', page: '' })}>
                  {t('common.all')}
                </FilterPill>
                {(categoriesQuery.data ?? []).map((item) => (
                  <FilterPill
                    key={item.id}
                    active={category === item.slug}
                    onClick={() => updateParams({ category: item.slug, page: '' })}
                  >
                    {item.name}
                  </FilterPill>
                ))}
              </div>
            )}
          </div>

          {coursesQuery.isPending ? (
            <div className="mt-7"><CardGridSkeleton count={6} /></div>
          ) : coursesQuery.isError ? (
            <ErrorState className="mt-7" onRetry={coursesQuery.refetch} />
          ) : (
            <>
              <p className="mt-5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted" aria-live="polite">
                {result?.total ?? courses.length} {t('training.count')}
              </p>
              {isEmpty ? (
                <EmptyState
                  className="mt-6"
                  title="No published courses match"
                  text="Try another search or category, or check back when more course information is published."
                  action={
                    <Button size="sm" variant="outline" onClick={() => {
                      setQuery('')
                      updateParams({ category: '', q: '', page: '' })
                    }}>
                      {t('common.clearFilters')}
                    </Button>
                  }
                />
              ) : (
                <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => <CourseCard key={course.id} course={course} />)}
                </div>
              )}
              {result?.last_page > 1 && (
                <div className="mt-8 flex items-center justify-between">
                  <Button
                    variant="outline"
                    disabled={result.current_page <= 1}
                    onClick={() => updateParams({ page: String(result.current_page - 1) })}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted">Page {result.current_page} of {result.last_page}</span>
                  <Button
                    variant="outline"
                    disabled={result.current_page >= result.last_page}
                    onClick={() => updateParams({ page: String(result.current_page + 1) })}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow">{t('training.calendar')}</p>
            <h2 className="mt-5 text-[clamp(1.7rem,3vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-navy">
              Upcoming training schedules
            </h2>
            <p className="mt-5 max-w-sm text-[0.875rem] leading-[1.8] text-muted">
              Dates and registration availability are shown when confirmed.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="primary"><Link to="/training/schedule">View all schedules</Link></Button>
              <Button asChild variant="outline"><Link to="/training/instructors">Meet instructors</Link></Button>
            </div>
          </div>
          <div>
            {schedulesQuery.isPending ? <LoadingState /> : schedulesQuery.isError ? (
              <ErrorState title="Schedules could not be loaded" onRetry={schedulesQuery.refetch} />
            ) : schedules.length === 0 ? (
              <EmptyState title="No upcoming schedules published" text="Confirmed course dates will appear here when available." />
            ) : (
              <ul className="divide-y divide-line border-y border-line">
                {schedules.map((schedule) => (
                  <li key={schedule.id} className="grid gap-3 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <Link to={`/training/${schedule.course.slug}`} className="font-semibold text-navy hover:text-gold-deep">
                        {schedule.course.title}
                      </Link>
                      <p className="mt-1 text-sm text-muted">{schedule.label} · {formatDate(schedule.startsAt)}</p>
                    </div>
                    {schedule.registrationOpen && (
                      <span className="text-xs font-semibold uppercase tracking-wide text-success">Registration open</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="section bg-navy text-white">
        <div className="shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="eyebrow eyebrow-invert"><Users className="mr-2 inline size-4" />Training team</p>
            <h2 className="mt-4 text-2xl font-semibold">Published instructor profiles</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
              {instructorsQuery.isError
                ? 'Instructor information could not be loaded right now.'
                : instructors.length
                  ? `${instructors.length} instructor profile${instructors.length === 1 ? '' : 's'} currently published.`
                  : 'Instructor information will appear once verified profiles are published.'}
            </p>
          </div>
          <Button asChild variant="gold"><Link to="/training/instructors">View instructors</Link></Button>
        </div>
      </section>
    </>
  )
}
