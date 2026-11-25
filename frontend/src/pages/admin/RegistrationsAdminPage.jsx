import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { normaliseError } from '@/services/api'
import { trainingAdminApi } from '@/services/trainingAdminApi'
import { usePageMeta } from '@/lib/seo'

const STATUSES = ['pending', 'confirmed', 'waitlisted', 'rejected', 'cancelled', 'completed']

export function RegistrationsAdminPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const params = { q: search || undefined, status: status || undefined, per_page: 25, page }
  const query = useQuery({
    queryKey: ['admin-training', 'registrations', params],
    queryFn: () => trainingAdminApi.registrations(params),
  })

  usePageMeta({ title: 'Training registrations', noindex: true })

  const update = async (action) => {
    setError('')
    try {
      await action()
      await queryClient.invalidateQueries({ queryKey: ['admin-training', 'registrations'] })
    } catch (requestError) {
      setError(normaliseError(requestError).message)
    }
  }

  if (query.isPending) return <LoadingState label="Loading registration records…" />
  if (query.isError) return <ErrorState title="Registration records could not be loaded" text={normaliseError(query.error).message} onRetry={query.refetch} />

  const registrations = query.data?.data ?? []

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-navy">Training registrations</h2>
        <p className="mt-1 text-sm text-muted">Review submitted requests, update status and record attendance.</p>
      </div>
      {error && <p role="alert" className="border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => { setSearch(event.target.value); setPage(1) }}
          placeholder="Search name, email or reference"
          aria-label="Search registrations"
          className="h-10 min-w-64 border border-line bg-white px-3 text-sm"
        />
        <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} aria-label="Filter by status" className="h-10 border border-line bg-white px-3 text-sm">
          <option value="">All statuses</option>{STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      {registrations.length === 0 ? <p className="border border-dashed border-line p-10 text-center text-sm text-muted">No registrations found.</p> : (
        <div className="overflow-x-auto border border-line bg-white">
          <table className="w-full min-w-[68rem] text-left text-sm">
            <thead className="bg-canvas text-xs uppercase text-muted"><tr>
              <th className="p-3">Applicant</th><th className="p-3">Course / schedule</th><th className="p-3">Submitted</th><th className="p-3">Status</th><th className="p-3">Attendance</th>
            </tr></thead>
            <tbody className="divide-y divide-line">
              {registrations.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="p-3">
                    <p className="font-semibold text-navy">{item.fullName}</p>
                    <a className="text-xs text-muted underline" href={`mailto:${item.email}`}>{item.email}</a>
                    <p className="text-xs text-muted">{item.phone}</p>
                    <p className="mt-1 break-all font-mono text-[0.65rem] text-muted">{item.reference}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-navy">{item.course.title}</p>
                    {item.schedule && <p className="mt-1 text-xs text-muted">{item.schedule.label}</p>}
                    {item.organization && <p className="mt-1 text-xs text-muted">{item.organization}</p>}
                  </td>
                  <td className="p-3 text-xs text-muted">{item.submittedAt ? new Date(item.submittedAt).toLocaleString() : '—'}</td>
                  <td className="p-3">
                    <select
                      value={item.status}
                      aria-label={`Status for ${item.fullName}`}
                      onChange={(event) => update(() => trainingAdminApi.updateRegistration(item.id, event.target.value))}
                      className="h-9 border border-line bg-white px-2 text-xs capitalize"
                    >
                      {STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>
                  </td>
                  <td className="p-3">
                    <select
                      value={item.attendance?.status ?? ''}
                      aria-label={`Attendance for ${item.fullName}`}
                      onChange={(event) => event.target.value && update(() => trainingAdminApi.recordAttendance(item.id, event.target.value))}
                      className="h-9 border border-line bg-white px-2 text-xs capitalize"
                    >
                      <option value="">Not recorded</option><option value="attended">Attended</option><option value="absent">Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t border-line p-3 text-xs text-muted">
            <span>{query.data.total} registrations</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={query.data.current_page <= 1} onClick={() => setPage(query.data.current_page - 1)}>Previous</Button>
              <span className="self-center text-xs text-muted">Page {query.data.current_page} of {query.data.last_page}</span>
              <Button size="sm" variant="outline" disabled={query.data.current_page >= query.data.last_page} onClick={() => setPage(query.data.current_page + 1)}>Next</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
