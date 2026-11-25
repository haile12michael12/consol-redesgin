import { CalendarDays, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHero } from '@/components/common/PageHero'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { Button } from '@/components/ui/button'
import { useTrainingSchedules } from '@/hooks/useCourses'
import { usePageMeta } from '@/lib/seo'

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeStyle: 'short' }).format(new Date(value))
}

export function TrainingSchedulePage() {
  const query = useTrainingSchedules({ per_page: 50 })
  const schedules = query.data?.data ?? []

  usePageMeta({
    title: 'Training schedule',
    description: 'View upcoming training schedules currently published by CONSOL.',
    noindex: true,
  })

  return (
    <>
      <PageHero
        eyebrow="Training"
        title="Confirmed training schedules"
        text="Only published dates and registration status are listed. Course dates are updated as CONSOL confirms them."
        breadcrumbs={[{ label: 'Training', to: '/training' }, { label: 'Schedule', to: '/training/schedule' }]}
        image={{ src: '/media/training.jpg', alt: 'Training environment' }}
      />
      <section className="section bg-white">
        <div className="shell">
          {query.isPending ? <LoadingState /> : query.isError ? (
            <ErrorState title="Training schedules could not be loaded" onRetry={query.refetch} />
          ) : schedules.length === 0 ? (
            <EmptyState title="No upcoming schedules published" text="Confirmed dates and registration details will appear here when available." />
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              {schedules.map((schedule) => (
                <li key={schedule.id} className="grid gap-5 py-6 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-gold-deep">{schedule.course.category}</p>
                    <h2 className="mt-2 text-lg font-semibold text-navy">
                      <Link to={`/training/${schedule.course.slug}`} className="hover:text-gold-deep">{schedule.course.title}</Link>
                    </h2>
                    <p className="mt-1 text-sm text-muted">{schedule.label}</p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                      <span className="inline-flex items-center gap-2"><CalendarDays className="size-4 text-gold-deep" />{formatDate(schedule.startsAt)} – {formatDate(schedule.endsAt)}</span>
                      {schedule.location && <span className="inline-flex items-center gap-2"><MapPin className="size-4 text-gold-deep" />{schedule.location}</span>}
                    </div>
                    {schedule.deliveryMethod && <p className="mt-2 text-sm text-muted">Delivery: {schedule.deliveryMethod}</p>}
                  </div>
                  {schedule.registrationOpen ? (
                    <Button asChild variant="primary">
                      <Link to={`/training/${schedule.course.slug}/register`}>Request a place</Link>
                    </Button>
                  ) : <span className="text-sm text-muted">Registration not currently open</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
