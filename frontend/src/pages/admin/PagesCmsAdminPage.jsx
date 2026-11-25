import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { AdminPanel, StatusBadge } from '@/components/admin/AdminUI'
import { ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { Pagination } from '@/components/common/Pagination'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { normaliseError } from '@/services/api'
import { pagesApi } from '@/services/pagesApi'
import { toast } from 'sonner'

const EMPTY_PAGE = {
  id: null,
  title: '',
  slug: '',
  path: '/',
  summary: '',
  content: '',
  status: 'draft',
  seoTitle: '',
  seoDescription: '',
}

function pageValues(page) {
  return page ? { ...EMPTY_PAGE, ...page } : { ...EMPTY_PAGE }
}

function PageEditor({ page, pending, error, onCancel, onSave }) {
  const [values, setValues] = useState(() => pageValues(page))
  const [formError, setFormError] = useState('')
  const update = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }))

  async function submit(event) {
    event.preventDefault()
    setFormError('')
    try {
      await onSave({
        id: values.id,
        title: values.title.trim(),
        slug: values.slug.trim(),
        path: values.path.trim(),
        summary: values.summary.trim() || null,
        content: values.content,
        status: values.status,
        seo_title: values.seoTitle.trim() || null,
        seo_description: values.seoDescription.trim() || null,
      })
    } catch (saveError) {
      const normalized = normaliseError(saveError)
      setFormError([normalized.message, ...Object.values(normalized.errors ?? {}).flat()].join(' '))
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5 border border-line bg-white p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="eyebrow">Page content</p>
          <h3 className="mt-2 text-xl font-semibold text-navy">{values.id ? 'Edit page' : 'Create page'}</h3>
        </div>
        <Button type="button" size="icon" variant="ghost" aria-label="Close editor" onClick={onCancel}>
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Page title"><Input required maxLength={255} value={values.title} onChange={update('title')} /></Field>
        <Field label="Slug"><Input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={255} value={values.slug} onChange={update('slug')} /></Field>
        <Field label="Path"><Input required pattern="/[a-z0-9/-]*" maxLength={255} value={values.path} onChange={update('path')} /></Field>
        <Field label="Publication status">
          <select value={values.status} onChange={update('status')} className="h-11 w-full rounded-sm border border-input bg-white px-3 text-sm">
            <option value="draft">Draft</option><option value="published">Published</option>
          </select>
        </Field>
        <Field label="Summary" className="sm:col-span-2"><Textarea rows={3} maxLength={2000} value={values.summary} onChange={update('summary')} /></Field>
        <Field label="Content (Markdown)" className="sm:col-span-2">
          <Textarea rows={14} maxLength={100000} value={values.content} onChange={update('content')} />
        </Field>
        <Field label="SEO title"><Input maxLength={255} value={values.seoTitle} onChange={update('seoTitle')} /></Field>
        <Field label="SEO description"><Textarea rows={3} maxLength={1000} value={values.seoDescription} onChange={update('seoDescription')} /></Field>
      </div>
      {(formError || error) && <p role="alert" className="border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">{formError || error}</p>}
      <div className="flex justify-end gap-3 border-t border-line pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save page'}</Button>
      </div>
    </form>
  )
}

function Field({ label, className = '', children }) {
  return <label className={`block space-y-1.5 ${className}`}><span className="text-xs font-semibold text-navy">{label}</span>{children}</label>
}

export function PagesCmsAdminPage() {
  const t = useT()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [editor, setEditor] = useState(null)
  const [error, setError] = useState('')
  const params = { q: search || undefined, status: status || undefined, per_page: 20, page }
  const query = useQuery({
    queryKey: ['admin-pages', params],
    queryFn: async () => (await pagesApi.adminList(params)).data,
  })

  usePageMeta({ title: 'Website pages', noindex: true })

  async function save(values) {
    setError('')
    if (values.id) await pagesApi.update(values.id, values)
    else await pagesApi.create(values)
    await queryClient.invalidateQueries({ queryKey: ['admin-pages'] })
    setEditor(null)
    toast.success('Page saved.')
  }

  async function remove(record) {
    if (!window.confirm(`Delete “${record.title}”? This cannot be undone.`)) return
    setError('')
    try {
      await pagesApi.delete(record.id)
      await queryClient.invalidateQueries({ queryKey: ['admin-pages'] })
      toast.success('Page deleted.')
    } catch (requestError) {
      setError(normaliseError(requestError).message)
    }
  }

  if (query.isPending) return <LoadingState label="Loading website pages…" />
  if (query.isError) {
    return <ErrorState title="Website pages could not be loaded" text={normaliseError(query.error).message} onRetry={query.refetch} />
  }

  const rows = query.data?.data ?? []

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-navy">{t('admin.nav.pages')}</h2>
          <p className="mt-1 text-sm text-muted">Manage page metadata and reviewed Markdown content.</p>
        </div>
        <Button onClick={() => { setError(''); setEditor(pageValues()) }}><Plus className="size-4" aria-hidden="true" />Add page</Button>
      </div>

      {error && <p role="alert" className="border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>}
      {editor && <PageEditor key={editor.id ?? 'new'} page={editor} pending={false} error={error} onCancel={() => setEditor(null)} onSave={save} />}

      <AdminPanel>
        <div className="flex flex-wrap gap-3 border-b border-line p-4">
          <Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Search title or path" aria-label="Search pages" className="max-w-sm" />
          <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} aria-label="Filter by status" className="h-10 border border-line bg-white px-3 text-sm">
            <option value="">All statuses</option><option value="published">Published</option><option value="draft">Draft</option>
          </select>
        </div>
        {rows.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-muted">No pages match these filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] text-left text-sm">
              <thead className="bg-canvas text-xs uppercase text-muted"><tr><th className="p-3">Page</th><th className="p-3">Path</th><th className="p-3">Updated</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-line">
                {rows.map((record) => (
                  <tr key={record.id}>
                    <td className="p-3"><p className="font-semibold text-navy">{record.title}</p><p className="mt-1 text-xs text-muted">{record.slug}</p></td>
                    <td className="p-3 font-mono text-xs text-muted">{record.path}</td>
                    <td className="p-3 text-xs text-muted">{record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : '—'}</td>
                    <td className="p-3"><StatusBadge status={record.status} label={record.status} /></td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="ghost"><Link to={record.path} target="_blank">{t('admin.viewSite')}</Link></Button>
                        <Button size="sm" variant="outline" onClick={() => setEditor(record)}><Pencil className="size-3.5" aria-hidden="true" />Edit</Button>
                        <Button size="icon" variant="ghost" aria-label={`Delete ${record.title}`} onClick={() => remove(record)}><Trash2 className="size-4 text-danger" aria-hidden="true" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-line px-4 py-3 text-xs text-muted">
          <span>{query.data.total} pages</span>
          <Pagination page={query.data.current_page} pageCount={query.data.last_page} onChange={setPage} />
        </div>
      </AdminPanel>
    </div>
  )
}