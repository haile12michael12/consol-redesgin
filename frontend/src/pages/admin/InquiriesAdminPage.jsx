import { Download, ExternalLink, Search } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { normaliseError } from '@/services/api'
import { inquiriesAdminApi } from '@/services/inquiriesAdminApi'
import { usePageMeta } from '@/lib/seo'

const STATUSES = ['new', 'in_progress', 'responded', 'closed']

function submittedAt(value) {
  return value ? new Date(value).toLocaleString() : '—'
}

export function InquiriesAdminPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState(null)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const params = { q: search || undefined, status: status || undefined, type: type || undefined, per_page: 20, page }
  const inquiries = useQuery({
    queryKey: ['admin-inquiries', params],
    queryFn: () => inquiriesAdminApi.list(params),
  })
  const selected = useQuery({
    queryKey: ['admin-inquiry', selectedId],
    queryFn: () => inquiriesAdminApi.show(selectedId),
    enabled: selectedId !== null,
  })
  const assignees = useQuery({
    queryKey: ['admin-inquiry-assignees'],
    queryFn: inquiriesAdminApi.assignees,
  })

  usePageMeta({ title: 'Inquiries', noindex: true })

  const updateInquiry = async (id, values) => {
    setError('')
    try {
      await inquiriesAdminApi.update(id, values)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-inquiry', id] }),
      ])
    } catch (requestError) {
      setError(normaliseError(requestError).message)
    }
  }

  const saveNote = async (event) => {
    event.preventDefault()
    if (!selectedId || !note.trim()) return
    setError('')
    try {
      await inquiriesAdminApi.addNote(selectedId, note.trim())
      setNote('')
      await queryClient.invalidateQueries({ queryKey: ['admin-inquiry', selectedId] })
    } catch (requestError) {
      setError(normaliseError(requestError).message)
    }
  }

  const exportRecords = async () => {
    setError('')
    try {
      const { data } = await inquiriesAdminApi.export({
        q: search || undefined,
        status: status || undefined,
        type: type || undefined,
      })
      const url = URL.createObjectURL(data)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'consol-inquiries.csv'
      anchor.click()
      URL.revokeObjectURL(url)
    } catch (requestError) {
      setError(normaliseError(requestError).message)
    }
  }

  if (inquiries.isPending) return <LoadingState label="Loading inquiries…" />
  if (inquiries.isError) {
    return (
      <ErrorState
        title="Inquiries could not be loaded"
        text={normaliseError(inquiries.error).message}
        onRetry={inquiries.refetch}
      />
    )
  }

  const rows = inquiries.data?.data ?? []

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-navy">Inquiries</h2>
          <p className="mt-1 text-sm text-muted">Review contact messages and consultation requests.</p>
        </div>
        <Button type="button" variant="outline" onClick={exportRecords}>
          <Download className="size-4" aria-hidden="true" />
          Export CSV
        </Button>
      </div>

      {error && <p role="alert" className="border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <label className="relative min-w-56 flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1) }}
            placeholder="Search name, email or organization"
            aria-label="Search inquiries"
            className="h-10 w-full border border-line bg-white pl-9 pr-3 text-sm"
          />
        </label>
        <select value={type} onChange={(event) => { setType(event.target.value); setPage(1) }} aria-label="Filter by inquiry type" className="h-10 border border-line bg-white px-3 text-sm">
          <option value="">All types</option><option value="contact">Contact</option><option value="consultation">Consultation</option>
        </select>
        <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} aria-label="Filter by status" className="h-10 border border-line bg-white px-3 text-sm">
          <option value="">All statuses</option>{STATUSES.map((item) => <option key={item} value={item}>{item.replace('_', ' ')}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[58rem] text-left text-sm">
          <thead className="bg-canvas text-xs uppercase text-muted">
            <tr><th className="p-3">Sender</th><th className="p-3">Request</th><th className="p-3">Assigned to</th><th className="p-3">Submitted</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((item) => (
              <tr key={item.id} className={selectedId === item.id ? 'bg-canvas/70 align-top' : 'align-top'}>
                <td className="p-3">
                  <button type="button" onClick={() => setSelectedId(item.id)} className="text-left font-semibold text-navy underline decoration-transparent underline-offset-2 hover:decoration-gold">
                    {item.name}
                  </button>
                  <a className="mt-1 block text-xs text-muted underline" href={`mailto:${item.email}`}>{item.email}</a>
                  {item.phone && <p className="mt-1 text-xs text-muted">{item.phone}</p>}
                </td>
                <td className="p-3">
                  <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-gold-deep">{item.type}</span>
                  <p className="mt-1 font-medium text-ink">{item.subject || item.serviceOfInterest}</p>
                  <p className="mt-1 max-w-sm truncate text-xs text-muted">{item.organization}</p>
                </td>
                <td className="p-3 text-xs text-muted">{item.assignedTo?.name ?? 'Unassigned'}</td>
                <td className="p-3 text-xs text-muted">{submittedAt(item.submittedAt)}</td>
                <td className="p-3"><span className="whitespace-nowrap rounded-sm border border-line px-2 py-1 text-xs capitalize">{item.status.replace('_', ' ')}</span></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan="5" className="p-10 text-center text-sm text-muted">No inquiries match these filters.</td></tr>}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-line p-3 text-xs text-muted">
          <span>{inquiries.data.total} inquiries</span>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" disabled={inquiries.data.current_page <= 1} onClick={() => setPage(inquiries.data.current_page - 1)}>Previous</Button>
            <span>Page {inquiries.data.current_page} of {inquiries.data.last_page}</span>
            <Button size="sm" variant="outline" disabled={inquiries.data.current_page >= inquiries.data.last_page} onClick={() => setPage(inquiries.data.current_page + 1)}>Next</Button>
          </div>
        </div>
      </div>

      {selectedId !== null && (
        <section className="border border-line bg-white p-5 sm:p-6" aria-labelledby="inquiry-detail-title">
          {selected.isPending ? <LoadingState label="Loading inquiry details…" /> : selected.isError ? (
            <ErrorState title="Inquiry details could not be loaded" text={normaliseError(selected.error).message} onRetry={selected.refetch} />
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gold-deep">{selected.data.type}</p>
                  <h3 id="inquiry-detail-title" className="mt-1 text-xl font-semibold text-navy">{selected.data.name}</h3>
                  <p className="mt-1 text-xs text-muted">Received {submittedAt(selected.data.submittedAt)}</p>
                </div>
                <a href={`mailto:${selected.data.email}`} className="inline-flex items-center gap-2 text-sm font-medium text-navy underline decoration-gold underline-offset-4">
                  Reply by email <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <dl className="grid grid-cols-[7rem_1fr] gap-x-3 gap-y-2 text-sm">
                  <dt className="text-muted">Email</dt><dd className="break-all text-ink">{selected.data.email}</dd>
                  <dt className="text-muted">Phone</dt><dd className="text-ink">{selected.data.phone || '—'}</dd>
                  <dt className="text-muted">Organization</dt><dd className="text-ink">{selected.data.organization || '—'}</dd>
                  <dt className="text-muted">Subject</dt><dd className="text-ink">{selected.data.subject || '—'}</dd>
                  <dt className="text-muted">Service</dt><dd className="text-ink">{selected.data.serviceOfInterest || '—'}</dd>
                  <dt className="text-muted">Contact via</dt><dd className="capitalize text-ink">{selected.data.preferredContactMethod || '—'}</dd>
                </dl>
                <div>
                  <h4 className="text-sm font-semibold text-navy">Message</h4>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">{selected.data.projectDescription}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 border-t border-line pt-5">
                <label className="grid gap-1.5 text-xs font-medium text-muted">
                  Status
                  <select value={selected.data.status} onChange={(event) => updateInquiry(selectedId, { status: event.target.value })} className="h-9 min-w-40 border border-line bg-white px-2 text-sm capitalize text-ink">
                    {STATUSES.map((value) => <option key={value} value={value}>{value.replace('_', ' ')}</option>)}
                  </select>
                </label>
                <label className="grid gap-1.5 text-xs font-medium text-muted">
                  Assign to
                  <select value={selected.data.assignedTo?.id ?? ''} onChange={(event) => updateInquiry(selectedId, { assigned_to: event.target.value || null })} className="h-9 min-w-52 border border-line bg-white px-2 text-sm text-ink">
                    <option value="">Unassigned</option>
                    {(assignees.data ?? []).map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
                  </select>
                </label>
              </div>

              <div className="mt-6 grid gap-6 border-t border-line pt-5 lg:grid-cols-[1fr_0.8fr]">
                <div>
                  <h4 className="text-sm font-semibold text-navy">Internal notes</h4>
                  <ul className="mt-3 space-y-3">
                    {(selected.data.notes ?? []).map((item) => (
                      <li key={item.id} className="border-l-2 border-gold pl-3">
                        <p className="whitespace-pre-wrap text-sm text-ink">{item.body}</p>
                        <p className="mt-1 text-xs text-muted">{item.author ?? 'Former staff'} · {submittedAt(item.createdAt)}</p>
                      </li>
                    ))}
                    {(selected.data.notes ?? []).length === 0 && <li className="text-sm text-muted">No internal notes yet.</li>}
                  </ul>
                </div>
                <form onSubmit={saveNote} className="space-y-3">
                  <label htmlFor="inquiry-note" className="block text-sm font-semibold text-navy">Add a note</label>
                  <textarea id="inquiry-note" value={note} onChange={(event) => setNote(event.target.value)} rows={3} maxLength={4000} className="w-full border border-line bg-white p-3 text-sm" />
                  <Button type="submit" size="sm" disabled={!note.trim()}>Save note</Button>
                </form>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  )
}