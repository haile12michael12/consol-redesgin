import { CheckCircle2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { ErrorState, LoadingState, NotFoundInline } from '@/components/common/StateBlocks'
import { Button } from '@/components/ui/button'
import { useRegistrationConfirmation } from '@/hooks/useCourses'
import { usePageMeta } from '@/lib/seo'

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeStyle: 'short' }).format(new Date(value))
}

export function RegistrationConfirmationPage() {
  const { reference } = useParams()
  const query = useRegistrationConfirmation(reference)
  const registration = query.data

  usePageMeta({ title: 'Registration received', noindex: true })

  if (query.isPending) return <LoadingState className="shell section" />
  if (query.isError) {
    if (query.error?.response?.status === 404) return <NotFoundInline />
    return <div className="shell section"><ErrorState title="Registration confirmation could not be loaded" onRetry={query.refetch} /></div>
  }
  if (!registration) return <NotFoundInline />

  return (
    <section className="section bg-canvas">
      <div className="shell max-w-3xl">
        <div className="border border-line bg-white p-7 sm:p-10">
          <CheckCircle2 className="size-10 text-success" aria-hidden="true" />
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-gold-deep">Registration request received</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-navy">Thank you, {registration.fullName}</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Your request is recorded. It is not a confirmed place; CONSOL will review it and contact you with next steps.
          </p>
          <dl className="mt-8 grid gap-4 border-y border-line py-6 sm:grid-cols-2">
            <div><dt className="text-xs text-muted">Reference</dt><dd className="mt-1 break-all font-mono text-sm font-semibold text-navy">{registration.reference}</dd></div>
            <div><dt className="text-xs text-muted">Status</dt><dd className="mt-1 text-sm font-semibold capitalize text-navy">{registration.status}</dd></div>
            <div><dt className="text-xs text-muted">Course</dt><dd className="mt-1 text-sm font-semibold text-navy"><Link to={`/training/${registration.course.slug}`} className="hover:text-gold-deep">{registration.course.title}</Link></dd></div>
            {registration.schedule && <div><dt className="text-xs text-muted">Selected schedule</dt><dd className="mt-1 text-sm font-semibold text-navy">{registration.schedule.label} · {formatDate(registration.schedule.startsAt)}</dd></div>}
            <div><dt className="text-xs text-muted">Submitted</dt><dd className="mt-1 text-sm font-semibold text-navy">{formatDate(registration.submittedAt)}</dd></div>
          </dl>
          <Button asChild variant="primary" className="mt-7"><Link to="/training">Explore training</Link></Button>
        </div>
      </div>
    </section>
  )
}
