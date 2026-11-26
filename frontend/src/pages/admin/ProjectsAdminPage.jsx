import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Plus, RefreshCw, Save, Trash2, X } from 'lucide-react'
import { AdminPanel, StatusBadge } from '@/components/admin/AdminUI'
import { ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { Pagination } from '@/components/common/Pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/Textarea'
import { useAdminProjectCategories, useAdminProjects } from '@/hooks/useProjects'
import { useT } from '@/i18n/LanguageProvider'
import { normaliseError } from '@/services/api'
import { projectsAdminApi } from '@/services/projectsApi'

const emptyProject = {
  id: null,
  title: '',
  slug: '',
  summary: '',
  overview: '',
  projectType: '',
  projectDate: '',
  context: '',
  objectives: [],
  challenge: '',
  approach: '',
  milestones: [],
  client: '',
  clientApproved: false,
  location: '',
  locationApproved: false,
  duration: '',
  year: '',
  categories: [],
  scope: [],
  services: [],
  outcomes: [],
  status: 'draft',
  featured: false,
  seoTitle: '',
  seoDescription: '',
  images: [],
}

function lines(value) {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
}

function makeProjectFormData(values, uploads, removeImageIds) {
  const formData = new FormData()
  const fields = {
    title: values.title.trim(),
    slug: values.slug.trim(),
    summary: values.summary.trim(),
    overview: values.overview.trim(),
    project_type: values.projectType.trim(),
    project_date: values.projectDate,
    context: values.context.trim(),
    challenge: values.challenge.trim(),
    approach: values.approach.trim(),
    client: values.client.trim(),
    client_approved: values.clientApproved ? '1' : '0',
    location: values.location.trim(),
    location_approved: values.locationApproved ? '1' : '0',
    duration: values.duration.trim(),
    year: values.year,
    status: values.status,
    featured: values.featured ? '1' : '0',
    seo_title: values.seoTitle.trim(),
    seo_description: values.seoDescription.trim(),
  }
  Object.entries(fields).forEach(([key, value]) => formData.append(key, value))
  values.categories.forEach((id) => formData.append('categories[]', String(id)))
  lines(values.scope).forEach((value) => formData.append('scope[]', value))
  lines(values.objectives).forEach((value) => formData.append('objectives[]', value))
  lines(values.services).forEach((value) => formData.append('services[]', value))
  lines(values.outcomes).forEach((value) => formData.append('outcomes[]', value))
  lines(values.milestones).forEach((line, index) => {
    const [date = '', title = '', ...description] = line.split('|').map((part) => part.trim())
    if (!title) return
    formData.append(`milestones[${index}][date]`, date)
    formData.append(`milestones[${index}][title]`, title)
    formData.append(`milestones[${index}][description]`, description.join('|'))
  })
  uploads.forEach(({ file, alt }, index) => {
    formData.append('images[]', file)
    if (alt.trim()) formData.append(`image_alts[${index}]`, alt.trim())
  })
  removeImageIds.forEach((id) => formData.append('remove_image_ids[]', String(id)))
  return formData
}

function projectValues(project) {
  const asLines = (value) => Array.isArray(value) ? value.join('\n') : value ?? ''
  return {
    ...emptyProject,
    ...project,
    categories: (project.categories ?? []).map((category) => (
      typeof category === 'object' ? category.id : category
    )),
    scope: asLines(project.scope),
    objectives: asLines(project.objectives),
    services: asLines(project.services),
    outcomes: asLines(project.outcomes),
    milestones: Array.isArray(project.milestones)
      ? project.milestones.map((milestone) => [
          milestone.date ?? '',
          milestone.title ?? '',
          milestone.description ?? '',
        ].join(' | ')).join('\n')
      : project.milestones ?? '',
    images: project.images ?? [],
    clientApproved: Boolean(project.clientApproved),
    locationApproved: Boolean(project.locationApproved),
  }
}

function formatError(error) {
  const normalized = normaliseError(error)
  const details = Object.values(normalized.errors ?? {}).flat()
  return [normalized.message, ...details].join(' ')
}

function Field({ label, className = '', children }) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="text-[0.75rem] font-semibold text-navy">{label}</span>
      {children}
    </label>
  )
}

function ProjectForm({ project, categories, pending, error, onCancel, onSave }) {
  const [values, setValues] = useState(() => projectValues(project))
  const [uploads, setUploads] = useState([])
  const [removeImageIds, setRemoveImageIds] = useState([])
  const [validationError, setValidationError] = useState('')

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function setCategory(id, checked) {
    setValues((current) => ({
      ...current,
      categories: checked
        ? [...current.categories, id]
        : current.categories.filter((categoryId) => categoryId !== id),
    }))
  }

  function selectFiles(event) {
    const newFiles = Array.from(event.target.files ?? [])
    setUploads((current) => [
      ...current,
      ...newFiles.map((file) => ({ file, alt: '' })),
    ].slice(0, 12 - (values.images.length - removeImageIds.length)))
    event.target.value = ''
  }

  function submit(event) {
    event.preventDefault()
    setValidationError('')
    if (!values.categories.length) {
      setValidationError('Select at least one project category.')
      return
    }
    if (uploads.length + values.images.length - removeImageIds.length > 12) {
      setValidationError('A project can have at most 12 gallery images.')
      return
    }
    onSave(makeProjectFormData(values, uploads, removeImageIds))
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="eyebrow">Portfolio content</p>
          <h3 className="mt-2 text-[1.25rem] font-semibold text-navy">
            {project.id ? 'Edit project' : 'Create project'}
          </h3>
          <p className="mt-1 text-[0.8125rem] text-muted">
            Only publish verified project details and client-approved information.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="grid size-9 place-items-center border border-line text-muted hover:text-navy"
          aria-label="Close editor"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Project title">
          <Input required maxLength={255} value={values.title} onChange={(event) => update('title', event.target.value)} />
        </Field>
        <Field label="URL slug">
          <Input
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            value={values.slug}
            onChange={(event) => update('slug', event.target.value)}
          />
        </Field>
        <Field label="Year">
          <Input type="number" min="1900" max="2100" value={values.year ?? ''} onChange={(event) => update('year', event.target.value)} />
        </Field>
        <Field label="Project type">
          <Input maxLength={100} value={values.projectType ?? ''} onChange={(event) => update('projectType', event.target.value)} placeholder="Only if documented" />
        </Field>
        <Field label="Project date">
          <Input type="date" value={values.projectDate ?? ''} onChange={(event) => update('projectDate', event.target.value)} />
        </Field>
        <Field label="Project duration">
          <Input maxLength={255} value={values.duration ?? ''} onChange={(event) => update('duration', event.target.value)} placeholder="Only if documented" />
        </Field>
        <Field label="Publication status">
          <select
            value={values.status}
            onChange={(event) => update('status', event.target.value)}
            className="h-11 w-full rounded-sm border border-input bg-white px-3.5 text-sm text-ink outline-none focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25"
          >
            <option value="draft">Draft / unpublished</option>
            <option value="published">Published</option>
          </select>
        </Field>
        <label className="flex min-h-11 items-center gap-2 text-sm font-medium text-navy">
          <input type="checkbox" checked={values.featured} onChange={(event) => update('featured', event.target.checked)} />
          Feature this project
        </label>
        <Field label="Short summary" className="sm:col-span-2">
          <Textarea required maxLength={2000} rows={3} value={values.summary} onChange={(event) => update('summary', event.target.value)} />
        </Field>
        <Field label="Project overview" className="sm:col-span-2">
          <Textarea required maxLength={20000} rows={6} value={values.overview} onChange={(event) => update('overview', event.target.value)} />
        </Field>
        <Field label="Project context and objectives" className="sm:col-span-2">
          <Textarea maxLength={20000} rows={4} value={values.context ?? ''} onChange={(event) => update('context', event.target.value)} />
        </Field>
        <Field label="Objectives (one verified objective per line)" className="sm:col-span-2">
          <Textarea rows={3} value={values.objectives} onChange={(event) => update('objectives', event.target.value)} />
        </Field>
        <Field label="Client challenge" className="sm:col-span-2">
          <Textarea maxLength={20000} rows={4} value={values.challenge ?? ''} onChange={(event) => update('challenge', event.target.value)} />
        </Field>
        <Field label="CONSOL's approach and methodology" className="sm:col-span-2">
          <Textarea maxLength={20000} rows={5} value={values.approach ?? ''} onChange={(event) => update('approach', event.target.value)} />
        </Field>
        <fieldset className="sm:col-span-2">
          <legend className="text-[0.75rem] font-semibold text-navy">Categories</legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 border border-line bg-white px-3 py-2 text-sm text-navy">
                <input
                  type="checkbox"
                  checked={values.categories.includes(category.id)}
                  onChange={(event) => setCategory(category.id, event.target.checked)}
                />
                {category.name}
              </label>
            ))}
          </div>
        </fieldset>
        <Field label="Client name">
          <Input maxLength={255} value={values.client ?? ''} onChange={(event) => update('client', event.target.value)} />
        </Field>
        <label className="flex items-center gap-2 self-end pb-3 text-sm text-navy">
          <input type="checkbox" checked={values.clientApproved} onChange={(event) => update('clientApproved', event.target.checked)} />
          Client approved for publication
        </label>
        <Field label="Location">
          <Input maxLength={255} value={values.location ?? ''} onChange={(event) => update('location', event.target.value)} />
        </Field>
        <label className="flex items-center gap-2 self-end pb-3 text-sm text-navy">
          <input type="checkbox" checked={values.locationApproved} onChange={(event) => update('locationApproved', event.target.checked)} />
          Location approved for publication
        </label>
        <Field label="Scope of work (one verified item per line)" className="sm:col-span-2">
          <Textarea rows={5} value={values.scope} onChange={(event) => update('scope', event.target.value)} />
        </Field>
        <Field label="Services provided (one per line)" className="sm:col-span-2">
          <Textarea rows={4} value={values.services} onChange={(event) => update('services', event.target.value)} />
        </Field>
        <Field label="Documented outcomes (one approved item per line)" className="sm:col-span-2">
          <Textarea rows={4} value={values.outcomes} onChange={(event) => update('outcomes', event.target.value)} />
        </Field>
        <Field label="Project milestones (one per line: date | milestone | optional notes)" className="sm:col-span-2">
          <Textarea rows={4} value={values.milestones} onChange={(event) => update('milestones', event.target.value)} placeholder="2024-06 | Inception | Approved inception meeting" />
        </Field>
        <Field label="SEO title" className="sm:col-span-2">
          <Input maxLength={255} value={values.seoTitle ?? ''} onChange={(event) => update('seoTitle', event.target.value)} />
        </Field>
        <Field label="SEO description" className="sm:col-span-2">
          <Textarea maxLength={1000} rows={3} value={values.seoDescription ?? ''} onChange={(event) => update('seoDescription', event.target.value)} />
        </Field>
        <Field label="Add project gallery images (JPEG, PNG or WebP; up to 10 MB each)" className="sm:col-span-2">
          <Input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={selectFiles} />
        </Field>
      </div>

      {values.images.length > 0 && (
        <fieldset className="space-y-3">
          <legend className="text-[0.75rem] font-semibold text-navy">Current gallery (first image is the cover)</legend>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {values.images.map((image, index) => {
              const removing = removeImageIds.includes(image.id)
              return (
                <label key={image.id} className={`border p-3 ${removing ? 'border-danger opacity-50' : 'border-line'}`}>
                  <img
                    src={image.url}
                    alt={image.alt || `Project image ${index + 1}`}
                    className="aspect-video w-full object-cover"
                  />
                  <span className="mt-2 flex items-center gap-2 text-xs text-navy">
                    <input
                      type="checkbox"
                      checked={removing}
                      onChange={(event) => setRemoveImageIds((current) => event.target.checked
                        ? [...current, image.id]
                        : current.filter((id) => id !== image.id))}
                    />
                    Remove this image
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>
      )}

      {uploads.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {uploads.map((upload, index) => (
            <NewImagePreview
              key={`${upload.file.name}-${upload.file.lastModified}-${index}`}
              upload={upload}
              onAltChange={(alt) => setUploads((current) => current.map((item, itemIndex) => (
                itemIndex === index ? { ...item, alt } : item
              )))}
              onRemove={() => setUploads((current) => current.filter((_, itemIndex) => itemIndex !== index))}
            />
          ))}
        </div>
      )}

      {(validationError || error) && (
        <p role="alert" className="border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-ink">
          {validationError || error}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-3 border-t border-line pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={pending}>
          <Save className="size-4" aria-hidden="true" />
          {pending ? 'Saving…' : 'Save project'}
        </Button>
      </div>
    </form>
  )
}

function NewImagePreview({ upload, onAltChange, onRemove }) {
  const [url] = useState(() => URL.createObjectURL(upload.file))
  useEffect(() => () => URL.revokeObjectURL(url), [url])
  return (
    <div className="border border-line p-3">
      <img src={url} alt="" className="aspect-video w-full object-cover" />
      <p className="mt-2 truncate text-xs text-muted">{upload.file.name}</p>
      <Field label="Image description">
        <Input maxLength={255} value={upload.alt} onChange={(event) => onAltChange(event.target.value)} />
      </Field>
      <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={onRemove}>
        <X className="size-3.5" aria-hidden="true" />
        Remove
      </Button>
    </div>
  )
}

function ProjectCategoriesAdmin({ categories, loading, error, onSave, onDelete, pending }) {
  const [editor, setEditor] = useState(null)
  const [requestError, setRequestError] = useState('')

  function save(event) {
    event.preventDefault()
    const values = {
      name: editor.name.trim(),
      slug: editor.slug.trim(),
      sort_order: Number(editor.sortOrder) || 0,
    }
    onSave({ id: editor.id, values }).then(() => setEditor(null)).catch((failure) => {
      setRequestError(formatError(failure))
    })
  }

  return (
    <AdminPanel className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-navy">Project categories</h3>
          <p className="mt-1 text-xs text-muted">Configure the categories used by published project records.</p>
        </div>
        {!editor && (
          <Button size="sm" variant="outline" onClick={() => { setRequestError(''); setEditor({ id: null, name: '', slug: '', sortOrder: 0 }) }}>
            <Plus className="size-3.5" aria-hidden="true" />
            Add category
          </Button>
        )}
      </div>
      {requestError && <p role="alert" className="mt-4 text-sm text-danger">{requestError}</p>}
      {error && <ErrorState className="mt-4" title="Categories could not be loaded" text={error} />}
      {editor && (
        <form onSubmit={save} className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-[1fr_1fr_8rem_auto_auto]">
          <Field label="Category name">
            <Input required maxLength={255} value={editor.name} onChange={(event) => setEditor((current) => ({ ...current, name: event.target.value }))} />
          </Field>
          <Field label="Slug">
            <Input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={255} value={editor.slug} onChange={(event) => setEditor((current) => ({ ...current, slug: event.target.value }))} />
          </Field>
          <Field label="Order">
            <Input type="number" min="0" value={editor.sortOrder} onChange={(event) => setEditor((current) => ({ ...current, sortOrder: event.target.value }))} />
          </Field>
          <Button type="submit" disabled={pending} className="self-end">
            <Save className="size-4" aria-hidden="true" />
            Save
          </Button>
          <Button type="button" variant="outline" onClick={() => setEditor(null)} className="self-end">Cancel</Button>
        </form>
      )}
      {loading ? (
        <LoadingState label="Loading categories…" />
      ) : (
        <div className="mt-4 divide-y divide-line border-t border-line">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-semibold text-navy">{category.name}</p>
                <p className="mt-0.5 text-xs text-muted">{category.slug} · {category.projectCount ?? 0} projects</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setRequestError(''); setEditor({ id: category.id, name: category.name, slug: category.slug, sortOrder: category.sortOrder }) }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`Delete ${category.name}`}
                  onClick={() => {
                    if (window.confirm(`Delete category “${category.name}”?`)) {
                      onDelete(category.id).catch((failure) => setRequestError(formatError(failure)))
                    }
                  }}
                >
                  <Trash2 className="size-4 text-danger" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminPanel>
  )
}

export function ProjectsAdminPage() {
  const t = useT()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState(null)
  const [requestError, setRequestError] = useState('')
  const projectsQuery = useAdminProjects({ page, q: search || undefined, per_page: 20 })
  const categoriesQuery = useAdminProjectCategories()
  const projects = projectsQuery.data?.data ?? []
  const categories = categoriesQuery.data ?? []

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] })
    queryClient.invalidateQueries({ queryKey: ['projects'] })
    queryClient.invalidateQueries({ queryKey: ['admin', 'project-categories'] })
    queryClient.invalidateQueries({ queryKey: ['projects', 'categories'] })
  }

  const saveProject = useMutation({
    mutationFn: ({ id, formData }) => id
      ? projectsAdminApi.update(id, formData)
      : projectsAdminApi.create(formData),
    onSuccess: () => {
      refresh()
      setEditor(null)
      setRequestError('')
    },
    onError: (error) => setRequestError(formatError(error)),
  })

  const deleteProject = useMutation({
    mutationFn: (id) => projectsAdminApi.delete(id),
    onSuccess: () => {
      refresh()
      setRequestError('')
    },
    onError: (error) => setRequestError(formatError(error)),
  })

  const saveCategory = useMutation({
    mutationFn: ({ id, values }) => id
      ? projectsAdminApi.updateCategory(id, values)
      : projectsAdminApi.createCategory(values),
    onSuccess: refresh,
  })

  const deleteCategory = useMutation({
    mutationFn: (id) => projectsAdminApi.deleteCategory(id),
    onSuccess: refresh,
  })

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-navy">{t('admin.nav.projects')}</h2>
          <p className="mt-1 max-w-2xl text-[0.8125rem] text-muted">
            Maintain verified portfolio entries. Only publish client details and outcomes that are approved for disclosure.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => projectsQuery.refetch()} disabled={projectsQuery.isFetching}>
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => { setRequestError(''); setEditor(projectValues({})) }}>
            <Plus className="size-3.5" aria-hidden="true" />
            Add project
          </Button>
        </div>
      </div>

      {requestError && !editor && (
        <ErrorState title="Project update failed" text={requestError} onRetry={() => projectsQuery.refetch()} />
      )}

      <ProjectCategoriesAdmin
        categories={categories}
        loading={categoriesQuery.isLoading}
        error={categoriesQuery.isError ? formatError(categoriesQuery.error) : ''}
        pending={saveCategory.isPending}
        onSave={(payload) => saveCategory.mutateAsync(payload).then(() => setRequestError(''))}
        onDelete={(id) => deleteCategory.mutateAsync(id)}
      />

      {editor && (
        <AdminPanel className="p-5 sm:p-7">
          <ProjectForm
            key={editor.id ?? 'new'}
            project={editor}
            categories={categories}
            pending={saveProject.isPending}
            error={saveProject.isError ? requestError : ''}
            onCancel={() => { setEditor(null); setRequestError('') }}
            onSave={(formData) => {
              setRequestError('')
              saveProject.mutate({ id: editor.id, formData })
            }}
          />
        </AdminPanel>
      )}

      <AdminPanel>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
          <Input
            type="search"
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1) }}
            placeholder="Search projects…"
            aria-label="Search projects"
            className="h-10 w-full max-w-xs"
          />
          <span className="text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-muted">
            {projectsQuery.data?.total ?? 0} projects
          </span>
        </div>
        {projectsQuery.isPending ? (
          <LoadingState label="Loading projects…" className="px-5" />
        ) : projectsQuery.isError ? (
          <ErrorState
            title="Projects could not be loaded"
            text={formatError(projectsQuery.error)}
            onRetry={() => projectsQuery.refetch()}
          />
        ) : projects.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] text-left text-sm">
              <thead className="border-b border-line bg-canvas text-[0.625rem] uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-5 py-3">Project</th>
                  <th className="px-5 py-3">Categories</th>
                  <th className="px-5 py-3">Year</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Featured</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-navy">{project.title}</p>
                      <p className="mt-1 text-[0.6875rem] text-muted">/{project.slug}</p>
                    </td>
                    <td className="px-5 py-4 text-muted">{project.categories.map((item) => item.name).join(', ')}</td>
                    <td className="px-5 py-4">{project.year ?? '—'}</td>
                    <td className="px-5 py-4"><StatusBadge status={project.status} label={project.status} /></td>
                    <td className="px-5 py-4">{project.featured ? 'Yes' : 'No'}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setRequestError(''); setEditor(projectValues(project)) }}>
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Delete ${project.title}`}
                          disabled={deleteProject.isPending}
                          onClick={() => {
                            if (window.confirm(`Delete “${project.title}” and its uploaded images? This cannot be undone.`)) {
                              deleteProject.mutate(project.id)
                            }
                          }}
                        >
                          <Trash2 className="size-4 text-danger" aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-sm text-muted">
            No projects found. Add verified project details to create a portfolio entry.
          </div>
        )}
        <Pagination
          className="m-5"
          page={projectsQuery.data?.current_page ?? page}
          pageCount={projectsQuery.data?.last_page ?? 1}
          onChange={setPage}
        />
      </AdminPanel>
    </div>
  )
}
