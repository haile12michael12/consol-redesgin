import { ArrowLeft, GraduationCap } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PageHero } from '@/components/common/PageHero'
import { EmptyState, ErrorState, LoadingState, NotFoundInline } from '@/components/common/StateBlocks'
import { Button } from '@/components/ui/button'
import { useInstructor, useInstructors } from '@/hooks/useCourses'
import { usePageMeta } from '@/lib/seo'

export function TrainingInstructorsPage() {
  const { slug } = useParams()
  const profilesQuery = useInstructors()
  const profileQuery = useInstructor(slug)
  const isDetail = Boolean(slug)
  const instructor = profileQuery.data
  const instructors = profilesQuery.data ?? []

  usePageMeta({
    title: instructor?.name || 'Training instructors',
    description: instructor?.biography || 'Instructor profiles currently published by CONSOL.',
    noindex: isDetail,
  })

  if (isDetail && profileQuery.isPending) return <LoadingState className="shell section" />
  if (isDetail && profileQuery.isError) {
    if (profileQuery.error?.response?.status === 404) return <NotFoundInline />
    return <div className="shell section"><ErrorState title="Instructor profile could not be loaded" onRetry={profileQuery.refetch} /></div>
  }

  if (isDetail && instructor) {
    return (
      <>
        <PageHero
          eyebrow="Training instructor"
          title={instructor.name}
          text={instructor.position}
          breadcrumbs={[
            { label: 'Training', to: '/training' },
            { label: 'Instructors', to: '/training/instructors' },
            { label: instructor.name, to: `/training/instructors/${instructor.slug}` },
          ]}
        />
        <section className="section bg-white">
          <div className="shell grid gap-10 lg:grid-cols-[0.65fr_1.35fr]">
            <div className="grid aspect-square max-h-72 place-items-center border border-line bg-canvas text-navy/30">
              <GraduationCap className="size-16" aria-hidden="true" />
            </div>
            <div className="space-y-8">
              {instructor.biography && (
                <div>
                  <h2 className="text-xl font-semibold text-navy">Biography</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{instructor.biography}</p>
                </div>
              )}
              {instructor.professionalBackground && (
                <div>
                  <h2 className="text-xl font-semibold text-navy">Professional background</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{instructor.professionalBackground}</p>
                </div>
              )}
              {instructor.expertise.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-navy">Areas of expertise</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {instructor.expertise.map((item) => <li key={item} className="border border-line px-3 py-2 text-sm text-muted">{item}</li>)}
                  </ul>
                </div>
              )}
              {instructor.courses.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-navy">Published courses</h2>
                  <ul className="mt-3 space-y-2">
                    {instructor.courses.map((course) => <li key={course.slug}><Link className="text-sm font-medium text-navy hover:text-gold-deep" to={`/training/${course.slug}`}>{course.title}</Link></li>)}
                  </ul>
                </div>
              )}
              {!instructor.biography && !instructor.professionalBackground && instructor.expertise.length === 0 && (
                <EmptyState title="Profile details are not published" text="Verified biography and background information will appear here when available." />
              )}
              <Button asChild variant="outline"><Link to="/training/instructors"><ArrowLeft className="size-4" /> All instructors</Link></Button>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHero
        eyebrow="Training"
        title="Our instructors"
        text="Profiles are displayed only after they have been reviewed and published."
        breadcrumbs={[{ label: 'Training', to: '/training' }, { label: 'Instructors', to: '/training/instructors' }]}
      />
      <section className="section bg-white">
        <div className="shell">
          {profilesQuery.isPending ? <LoadingState /> : profilesQuery.isError ? (
            <ErrorState title="Instructor profiles could not be loaded" onRetry={profilesQuery.refetch} />
          ) : instructors.length === 0 ? (
            <EmptyState title="No instructor profiles published" text="Verified instructor information will appear here when available." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {instructors.map((item) => (
                <article key={item.id} className="border border-line p-6">
                  <div className="grid size-14 place-items-center bg-canvas text-navy/50"><GraduationCap className="size-6" /></div>
                  <h2 className="mt-5 text-lg font-semibold text-navy"><Link to={`/training/instructors/${item.slug}`} className="hover:text-gold-deep">{item.name}</Link></h2>
                  {item.position && <p className="mt-1 text-sm text-muted">{item.position}</p>}
                  {item.biography && <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted">{item.biography}</p>}
                  <Link to={`/training/instructors/${item.slug}`} className="mt-5 inline-block text-xs font-bold uppercase tracking-wide text-navy hover:text-gold-deep">View profile</Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
