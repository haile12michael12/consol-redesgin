import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, Newspaper, Plus, RefreshCw, Save, Trash2, Users, X } from 'lucide-react'
import { AdminPanel, StatusBadge } from '@/components/admin/AdminUI'
import { ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { Pagination } from '@/components/common/Pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/Textarea'
import { usePageMeta } from '@/lib/seo'
import { normaliseError } from '@/services/api'
import { newsAdminApi } from '@/services/newsApi'
import { toast } from 'sonner'

const TABS = [
  ['articles', 'Articles', Newspaper],
  ['categories', 'Categories', FileText],
  ['events', 'Events', Users],
  ['resources', 'Resources', FileText],
]

const EMPTY_ARTICLE = {
  id: null, newsCategoryId: '', title: '', slug: '', excerpt: '', body: '',
  featured: false, status: 'draft', publishedAt: '', seoTitle: '', seoDescription: '',
  image: null, imageAlt: '',
}
const EMPTY_EVENT = {
  id: null, title: '', slug: '', summary: '', body: '', startsAt: '', endsAt: '',
  venue: '', registrationUrl: '', status: 'draft', publishedAt: '', seoTitle: '',
  seoDescription: '', image: null, imageAlt: '',
}
const EMPTY_RESOURCE = {
  id: null, title: '', slug: '', description: '', status: 'draft',
  approvedForPublication: false, publishedAt: '', seoTitle: '', seoDescription: '',
  fileName: '', file: null,
}

function toLocalDateTime(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

function articleValues(item) {
  return {
    ...EMPTY_ARTICLE,
    ...item,
    newsCategoryId: item.categoryId ? String(item.categoryId) : '',
    body: Array.isArray(item.body) ? item.body.join('\n\n') : item.body ?? '',
    publishedAt: toLocalDateTime(item.publishedAt),
    image: null,
    currentImage: item.image ?? null,
  }
}

function eventValues(item) {
  return {
    ...EMPTY_EVENT,
    ...item,
    startsAt: toLocalDateTime(item.startsAt),
    endsAt: toLocalDateTime(item.endsAt),
    publishedAt: toLocalDateTime(item.publishedAt),
    image: null,
    currentImage: item.image ?? null,
  }
}

function resourceValues(item) {
  return { ...EMPTY_RESOURCE, ...item, publishedAt: toLocalDateTime(item.publishedAt), file: null }
}

function formData(values, fields, fileField) {
  const data = new FormData()
  fields.forEach(([key, value]) => {
    if (value !== undefined && value !== null) data.append(key, value)
  })
  if (values[fileField]) data.append(fileField === 'file' ? 'file' : 'cover_image', values[fileField])
  return data
}

function Field({ label, children, className = '' }) {
  return <label className={`block space-y-1.5 ${className}`}><span className="text-xs font-semibold text-navy">{label}</span>{children}</label>
}

function StatusSelect({ value, onChange }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-sm border border-input bg-white px-3 text-sm text-ink">
      <option value="draft">Draft / unpublished</option>
      <option value="published">Published</option>
      <option value="scheduled">Scheduled</option>
    </select>
  )
}

function SeoFields({ values, update }) {
  return (
    <>
      <Field label="SEO title">
        <Input maxLength={255} value={values.seoTitle ?? ''} onChange={(event) => update('seoTitle', event.target.value)} />
      </Field>
      <Field label="SEO description">
        <Textarea rows={2} maxLength={1000} value={values.seoDescription ?? ''} onChange={(event) => update('seoDescription', event.target.value)} />
      </Field>
    </>
  )
}

function PublicationFields({ values, update }) {
  return (
    <>
      <Field label="Publication status"><StatusSelect value={values.status} onChange={(value) => update('status', value)} /></Field>
      {values.status === 'scheduled' && (
        <Field label="Publish at">
          <Input required type="datetime-local" value={values.publishedAt ?? ''} onChange={(event) => update('publishedAt', event.target.value)} />
        </Field>
      )}
    </>
  )
}

function UploadCover({ values, update }) {
  return (
    <>
      <Field label="Cover image (JPEG, PNG or WebP; up to 10 MB)">
        <Input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => update('image', event.target.files?.[0] ?? null)} />
      </Field>
      <Field label="Cover image description">
        <Input maxLength={255} value={values.imageAlt ?? ''} onChange={(event) => update('imageAlt', event.target.value)} />
      </Field>
      {values.image && <p className="text-xs text-muted">{values.image.name}</p>}
    </>
  )
}

function ContentForm({ tab, record, categories, pending, error, onSave, onCancel }) {
  const initial = tab === 'articles' ? articleValues(record) : tab === 'events' ? eventValues(record) : resourceValues(record)
  const [values, setValues] = useState(initial)
  const [removeImage, setRemoveImage] = useState(false)
  const [formError, setFormError] = useState('')
  const update = (key, value) => setValues((current) => ({ ...current, [key]: value }))

  function submit(event) {
    event.preventDefault()
    setFormError('')
    let data
    let save
    if (tab === 'articles') {
      data = formData(values, [
        ['news_category_id', values.newsCategoryId],
        ['title', values.title.trim()], ['slug', values.slug.trim()],
        ['excerpt', values.excerpt.trim()], ['body', values.body.trim()],
        ['featured', values.featured ? '1' : '0'], ['status', values.status],
        ['published_at', values.publishedAt || ''], ['seo_title', values.seoTitle.trim()],
        ['seo_description', values.seoDescription.trim()], ['cover_image_alt', values.imageAlt.trim()],
        ['remove_cover_image', removeImage ? '1' : '0'],
      ], 'image')
      save = { kind: 'articles', id: values.id, data }
    } else if (tab === 'events') {
      data = formData(values, [
        ['title', values.title.trim()], ['slug', values.slug.trim()],
        ['summary', values.summary.trim()], ['body', values.body.trim()],
        ['starts_at', values.startsAt], ['ends_at', values.endsAt || ''],
        ['venue', values.venue.trim()], ['registration_url', values.registrationUrl.trim()],
        ['status', values.status], ['published_at', values.publishedAt || ''],
        ['seo_title', values.seoTitle.trim()], ['seo_description', values.seoDescription.trim()],
        ['cover_image_alt', values.imageAlt.trim()], ['remove_cover_image', removeImage ? '1' : '0'],
      ], 'image')
      save = { kind: 'events', id: values.id, data }
    } else {
      if (!values.id && !values.file) {
        setFormError('Choose an approved PDF resource to upload.')
        return
      }
      data = formData(values, [
        ['title', values.title.trim()], ['slug', values.slug.trim()],
        ['description', values.description.trim()], ['status', values.status],
        ['published_at', values.publishedAt || ''],
        ['approved_for_publication', values.approvedForPublication ? '1' : '0'],
        ['seo_title', values.seoTitle.trim()], ['seo_description', values.seoDescription.trim()],
      ], 'file')
      save = { kind: 'resources', id: values.id, data }
    }
    onSave(save).catch((failure) => {
      const normalized = normaliseError(failure)
      setFormError([normalized.message, ...Object.values(normalized.errors ?? {}).flat()].join(' '))
    })
  }

  const title = tab === 'articles' ? 'Article' : tab === 'events' ? 'Event' : 'Resource'

  return (
    <form onSubmit={submit} className="space-y-5 border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="eyebrow">{title} content</p>
          <h3 className="mt-2 text-xl font-semibold text-navy">{values.id ? `Edit ${title.toLowerCase()}` : `Create ${title.toLowerCase()}`}</h3>
          <p className="mt-1 text-xs text-muted">Publish only company-approved information and media.</p>
        </div>
        <Button type="button" size="icon" variant="ghost" aria-label="Close editor" onClick={onCancel}><X className="size-4" /></Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={`${title} title`}><Input required maxLength={255} value={values.title} onChange={(event) => update('title', event.target.value)} /></Field>
        <Field label="URL slug"><Input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={255} value={values.slug} onChange={(event) => update('slug', event.target.value)} /></Field>
        {tab === 'articles' && (
          <>
            <Field label="Category">
              <select value={values.newsCategoryId} onChange={(event) => update('newsCategoryId', event.target.value)} className="h-11 w-full rounded-sm border border-input bg-white px-3 text-sm">
                <option value="">Uncategorised</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </Field>
            <label className="flex items-center gap-2 text-sm text-navy"><input type="checkbox" checked={Boolean(values.featured)} onChange={(event) => update('featured', event.target.checked)} />Featured article</label>
            <Field label="Excerpt" className="sm:col-span-2"><Textarea required rows={3} maxLength={2000} value={values.excerpt} onChange={(event) => update('excerpt', event.target.value)} /></Field>
            <Field label="Article body (separate paragraphs with blank lines)" className="sm:col-span-2"><Textarea required rows={10} maxLength={50000} value={values.body} onChange={(event) => update('body', event.target.value)} /></Field>
          </>
        )}
        {tab === 'events' && (
          <>
            <Field label="Summary" className="sm:col-span-2"><Textarea required rows={3} maxLength={2000} value={values.summary} onChange={(event) => update('summary', event.target.value)} /></Field>
            <Field label="Event details (optional)" className="sm:col-span-2"><Textarea rows={6} maxLength={50000} value={values.body} onChange={(event) => update('body', event.target.value)} /></Field>
            <Field label="Starts at"><Input required type="datetime-local" value={values.startsAt} onChange={(event) => update('startsAt', event.target.value)} /></Field>
            <Field label="Ends at (optional)"><Input type="datetime-local" value={values.endsAt} onChange={(event) => update('endsAt', event.target.value)} /></Field>
            <Field label="Venue"><Input required maxLength={255} value={values.venue} onChange={(event) => update('venue', event.target.value)} /></Field>
            <Field label="Registration URL (optional)"><Input type="url" maxLength={2048} value={values.registrationUrl} onChange={(event) => update('registrationUrl', event.target.value)} /></Field>
          </>
        )}
        {tab === 'resources' && (
          <>
            <Field label="Description" className="sm:col-span-2"><Textarea required rows={3} maxLength={2000} value={values.description} onChange={(event) => update('description', event.target.value)} /></Field>
            <Field label="PDF resource (up to 20 MB)" className="sm:col-span-2">
              <Input type="file" accept="application/pdf,.pdf" required={!values.id} onChange={(event) => update('file', event.target.files?.[0] ?? null)} />
              {values.fileName && <span className="block text-xs text-muted">Current file: {values.fileName}</span>}
            </Field>
            <label className="flex items-center gap-2 text-sm text-navy"><input type="checkbox" checked={Boolean(values.approvedForPublication)} onChange={(event) => update('approvedForPublication', event.target.checked)} />Approved for public release</label>
          </>
        )}
        <PublicationFields values={values} update={update} />
        {tab !== 'resources' && (
          <>
            {values.currentImage && (
              <div className="sm:col-span-2">
                <p className="mb-2 text-xs font-semibold text-navy">Current cover image</p>
                <img src={values.currentImage} alt={values.imageAlt || ''} className="max-h-56 max-w-full border border-line object-contain" />
                <label className="mt-3 flex items-center gap-2 text-sm text-navy">
                  <input type="checkbox" checked={removeImage} onChange={(event) => setRemoveImage(event.target.checked)} />
                  Remove current cover if no replacement is uploaded
                </label>
              </div>
            )}
            <UploadCover values={values} update={update} />
          </>
        )}
        <SeoFields values={values} update={update} />
      </div>
      {(formError || error) && <p role="alert" className="border border-danger/30 bg-danger/5 px-4 py-3 text-sm">{formError || error}</p>}
      <div className="flex justify-end gap-3 border-t border-line pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={pending}><Save className="size-4" />{pending ? 'Saving…' : `Save ${title.toLowerCase()}`}</Button>
      </div>
    </form>
  )
}

function CategoryManager({ categories, onSave, onDelete, pending }) {
  const [values, setValues] = useState({ id: null, name: '', slug: '', sort_order: '0' })
  const [error, setError] = useState('')
  const save = async (event) => {
    event.preventDefault()
    setError('')
    try {
      if (values.id) await onSave({ id: values.id, name: values.name.trim(), slug: values.slug.trim(), sort_order: Number(values.sort_order) || 0 })
      else await onSave({ name: values.name.trim(), slug: values.slug.trim(), sort_order: Number(values.sort_order) || 0 })
      setValues({ id: null, name: '', slug: '', sort_order: '0' })
    } catch (failure) {
      setError(normaliseError(failure).message)
    }
  }
  return (
    <AdminPanel className="p-5">
      <h3 className="font-semibold text-navy">Article categories</h3>
      {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}
      <form onSubmit={save} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_7rem_auto]">
        <Field label="Category name"><Input required value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} /></Field>
        <Field label="Slug"><Input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={values.slug} onChange={(event) => setValues((current) => ({ ...current, slug: event.target.value }))} /></Field>
        <Field label="Order"><Input type="number" min="0" value={values.sort_order} onChange={(event) => setValues((current) => ({ ...current, sort_order: event.target.value }))} /></Field>
        <Button type="submit" disabled={pending} className="self-end"><Save className="size-4" />{values.id ? 'Update' : 'Add'}</Button>
      </form>
      <div className="mt-4 divide-y divide-line border-t border-line">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between gap-3 py-3">
            <div><p className="text-sm font-semibold text-navy">{category.name}</p><p className="text-xs text-muted">{category.slug} · {category.articleCount ?? 0} articles</p></div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setValues({ id: category.id, name: category.name, slug: category.slug, sort_order: String(category.sortOrder) })}>Edit</Button>
              <Button size="icon" variant="ghost" aria-label={`Delete ${category.name}`} onClick={() => onDelete(category.id)}><Trash2 className="size-4 text-danger" /></Button>
            </div>
          </div>
        ))}
      </div>
    </AdminPanel>
  )
}

export function NewsAdminPage({ initialTab = 'articles' }) {
  const queryClient = useQueryClient()
  const dedicatedEvents = initialTab === 'events'
  const [tab, setTab] = useState(initialTab)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [editor, setEditor] = useState(null)
  const [requestError, setRequestError] = useState('')
  const params = { page, per_page: 20, q: search || undefined, status: status || undefined }
  usePageMeta({ title: tab === 'events' ? 'Events administration' : 'News and resources administration', noindex: true })

  const articleQuery = useQuery({ queryKey: ['admin-news', 'articles', params], queryFn: () => newsAdminApi.listArticles(params), enabled: tab === 'articles' })
  const categoryQuery = useQuery({ queryKey: ['admin-news', 'categories'], queryFn: newsAdminApi.categories, enabled: tab === 'articles' || tab === 'categories' })
  const eventQuery = useQuery({ queryKey: ['admin-news', 'events', params], queryFn: () => newsAdminApi.listEvents(params), enabled: tab === 'events' })
  const resourceQuery = useQuery({ queryKey: ['admin-news', 'resources', params], queryFn: () => newsAdminApi.listResources(params), enabled: tab === 'resources' })
  const currentQuery = tab === 'articles' ? articleQuery : tab === 'events' ? eventQuery : resourceQuery
  const records = currentQuery.data?.data ?? []

  const refresh = (kind) => {
    queryClient.invalidateQueries({ queryKey: ['admin-news', kind] })
    if (kind === 'articles') queryClient.invalidateQueries({ queryKey: ['news'] })
    if (kind === 'events') queryClient.invalidateQueries({ queryKey: ['events'] })
    if (kind === 'resources') queryClient.invalidateQueries({ queryKey: ['resources'] })
    if (kind === 'categories') {
      queryClient.invalidateQueries({ queryKey: ['admin-news', 'categories'] })
      queryClient.invalidateQueries({ queryKey: ['news', 'categories'] })
    }
  }

  const saveContent = useMutation({
    mutationFn: ({ kind, id, data }) => {
      const methods = {
        articles: id ? () => newsAdminApi.updateArticle(id, data) : () => newsAdminApi.createArticle(data),
        events: id ? () => newsAdminApi.updateEvent(id, data) : () => newsAdminApi.createEvent(data),
        resources: id ? () => newsAdminApi.updateResource(id, data) : () => newsAdminApi.createResource(data),
      }
      return methods[kind]()
    },
    onSuccess: (_, variables) => {
      refresh(variables.kind)
      setEditor(null)
      setRequestError('')
      toast.success(`${variables.kind === 'events' ? 'Event' : variables.kind === 'articles' ? 'Article' : 'Resource'} saved.`)
    },
    onError: (failure) => setRequestError(normaliseError(failure).message),
  })
  const deleteContent = useMutation({
    mutationFn: ({ kind, id }) => ({
      articles: newsAdminApi.deleteArticle,
      events: newsAdminApi.deleteEvent,
      resources: newsAdminApi.deleteResource,
    })[kind](id),
    onSuccess: (_, variables) => {
      refresh(variables.kind)
      toast.success(`${variables.kind === 'events' ? 'Event' : variables.kind === 'articles' ? 'Article' : 'Resource'} deleted.`)
    },
    onError: (failure) => setRequestError(normaliseError(failure).message),
  })
  const categoryMutation = useMutation({
    mutationFn: ({ id, ...values }) => id ? newsAdminApi.updateCategory(id, values) : newsAdminApi.createCategory(values),
    onSuccess: () => {
      refresh('categories')
      toast.success('Category saved.')
    },
  })
  const deleteCategory = useMutation({
    mutationFn: newsAdminApi.deleteCategory,
    onSuccess: () => {
      refresh('categories')
      toast.success('Category deleted.')
    },
    onError: (failure) => setRequestError(normaliseError(failure).message),
  })

  const createRecord = () => {
    setRequestError('')
    setEditor(tab === 'articles' ? { ...EMPTY_ARTICLE } : tab === 'events' ? { ...EMPTY_EVENT } : { ...EMPTY_RESOURCE })
  }
  const editRecord = (record) => setEditor(tab === 'articles' ? articleValues(record) : tab === 'events' ? eventValues(record) : resourceValues(record))

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-navy">
            {tab === 'events' ? 'Events management' : 'News & resources'}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            {tab === 'events'
              ? 'Manage confirmed events and their public listing.'
              : 'Manage approved publications and resources cleared for public release.'}
          </p>
        </div>
        {tab !== 'categories' && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => currentQuery.refetch()} disabled={currentQuery.isFetching}><RefreshCw className="size-3.5" />Refresh</Button>
            <Button size="sm" onClick={createRecord}><Plus className="size-3.5" />Add {tab === 'articles' ? 'article' : tab === 'events' ? 'event' : 'resource'}</Button>
          </div>
        )}
      </div>
      {requestError && !editor && <ErrorState title="Content operation failed" text={requestError} onRetry={() => currentQuery.refetch()} />}
      {!dedicatedEvents && (
        <div className="flex flex-wrap gap-2 border-b border-line pb-3" role="tablist" aria-label="Content type">
          {TABS.map(([key, label, Icon]) => (
            <Button key={key} type="button" role="tab" aria-selected={tab === key} variant={tab === key ? 'primary' : 'outline'} size="sm" onClick={() => { setTab(key); setEditor(null); setRequestError(''); setPage(1); setSearch(''); setStatus('') }}>
              <Icon className="size-3.5" />{label}
            </Button>
          ))}
        </div>
      )}

      {tab !== 'categories' && (
        <div className="flex flex-wrap gap-3">
          <Input
            type="search"
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1) }}
            placeholder={`Search ${tab}…`}
            aria-label={`Search ${tab}`}
            className="max-w-sm"
          />
          <select
            value={status}
            onChange={(event) => { setStatus(event.target.value); setPage(1) }}
            aria-label={`Filter ${tab} by status`}
            className="h-10 border border-line bg-white px-3 text-sm"
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>
      )}

      {editor ? (
        <ContentForm
          tab={tab}
          record={editor}
          categories={categoryQuery.data ?? []}
          pending={saveContent.isPending}
          error={requestError}
          onCancel={() => { setEditor(null); setRequestError('') }}
          onSave={(values) => saveContent.mutateAsync(values)}
        />
      ) : tab === 'categories' ? (
        categoryQuery.isPending ? <LoadingState label="Loading categories…" /> : categoryQuery.isError
          ? <ErrorState title="Categories could not be loaded" onRetry={categoryQuery.refetch} />
          : <CategoryManager categories={categoryQuery.data ?? []} onSave={(values) => categoryMutation.mutateAsync(values)} onDelete={(id) => deleteCategory.mutate(id)} pending={categoryMutation.isPending} />
      ) : currentQuery.isPending ? (
        <LoadingState label={`Loading ${tab}…`} />
      ) : currentQuery.isError ? (
        <ErrorState title={`${tab} could not be loaded`} onRetry={currentQuery.refetch} />
      ) : records.length === 0 ? (
        <AdminPanel className="p-8 text-center">
          <p className="font-semibold text-navy">No {tab} have been created.</p>
          <p className="mt-1 text-sm text-muted">Add only content approved by CONSOL for publication.</p>
        </AdminPanel>
      ) : (
        <AdminPanel className="divide-y divide-line">
          {records.map((record) => (
            <div key={record.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-navy">{record.title}</p>
                <p className="mt-1 text-xs text-muted">
                  /{tab === 'articles' ? 'news' : tab}/{record.slug}
                  {record.publishedAt ? ` · ${new Date(record.publishedAt).toLocaleString()}` : ''}
                  {tab === 'resources' && !record.approvedForPublication ? ' · Publication approval required' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={record.status} label={record.status} />
                <Button size="sm" variant="outline" onClick={() => editRecord(record)}>Edit</Button>
                <Button size="icon" variant="ghost" aria-label={`Delete ${record.title}`} onClick={() => {
                  if (window.confirm(`Delete “${record.title}”?`)) deleteContent.mutate({ kind: tab, id: record.id })
                }}><Trash2 className="size-4 text-danger" /></Button>
              </div>
            </div>
          ))}
        </AdminPanel>
      )}
      {!editor && tab !== 'categories' && currentQuery.data?.last_page > 1 && (
        <Pagination page={currentQuery.data.current_page} pageCount={currentQuery.data.last_page} onChange={setPage} />
      )}
    </div>
  )
}
