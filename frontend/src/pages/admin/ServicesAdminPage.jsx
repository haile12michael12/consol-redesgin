import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Plus, RefreshCw, Save, Trash2, X } from 'lucide-react'
import { AdminPanel, StatusBadge } from '@/components/admin/AdminUI'
import { ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/Textarea'
import { useAdminServices } from '@/hooks/useServices'
import { useT } from '@/i18n/LanguageProvider'
import { normaliseError } from '@/services/api'
import { servicesAdminApi } from '@/services/servicesApi'

const categories = [
  ['construction-management', 'Construction Management Consultancy'],
  ['business-management', 'Business Management Consultancy'],
  ['training', 'Professional Training & Certification'],
  ['research', 'Research & Industry Development'],
]

const emptyService = {
  id: null,
  title: '',
  slug: '',
  category: 'construction-management',
  summary: '',
  description: '',
  image: '',
  imageAlt: '',
  scope: [],
  benefits: [],
  deliveryApproach: '',
  relatedProjects: [],
  faqs: [],
  status: 'draft',
  order: 0,
}

function lines(value) {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
}

function ServiceForm({ service, onCancel, onSave, pending, error }) {
  const [values, setValues] = useState(() => ({
    ...emptyService,
    ...service,
    description: service?.description ?? '',
    image: service?.image ?? '',
    imageAlt: service?.imageAlt ?? '',
    deliveryApproach: service?.deliveryApproach ?? '',
    scope: (service?.scope ?? []).join('\n'),
    benefits: (service?.benefits ?? []).join('\n'),
    relatedProjects: JSON.stringify(service?.relatedProjects ?? [], null, 2),
    faqs: JSON.stringify(service?.faqs ?? [], null, 2),
  }))
  const [jsonError, setJsonError] = useState('')

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function submit(event) {
    event.preventDefault()
    setJsonError('')
    let relatedProjects
    let faqs
    try {
      relatedProjects = JSON.parse(values.relatedProjects || '[]')
      faqs = JSON.parse(values.faqs || '[]')
      if (!Array.isArray(relatedProjects) || !Array.isArray(faqs)) {
        throw new Error('Project references and FAQs must be JSON arrays.')
      }
    } catch (parseError) {
      setJsonError(parseError.message)
      return
    }

    onSave({
      title: values.title.trim(),
      slug: values.slug.trim(),
      category: values.category,
      summary: values.summary.trim(),
      description: values.description.trim() || null,
      image: values.image.trim() || null,
      image_alt: values.imageAlt.trim() || null,
      scope: lines(values.scope),
      benefits: lines(values.benefits),
      delivery_approach: values.deliveryApproach.trim() || null,
      related_projects: relatedProjects,
      faqs,
      status: values.status,
      sort_order: Number(values.order) || 0,
    })
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="eyebrow">Service content</p>
          <h3 className="mt-2 text-[1.25rem] font-semibold text-navy">
            {service?.id ? 'Edit service' : 'Create service'}
          </h3>
          <p className="mt-1 text-[0.8125rem] text-muted">Save as draft until content is verified and approved.</p>
        </div>
        <button type="button" onClick={onCancel} className="grid size-9 place-items-center border border-line text-muted hover:text-navy" aria-label="Close editor">
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Service title">
          <Input required maxLength={255} value={values.title} onChange={(event) => update('title', event.target.value)} />
        </Field>
        <Field label="URL slug">
          <Input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={values.slug} onChange={(event) => update('slug', event.target.value)} />
        </Field>
        <Field label="Category">
          <select
            required
            value={values.category}
            onChange={(event) => update('category', event.target.value)}
            className="h-11 w-full rounded-sm border border-input bg-white px-3.5 text-sm text-ink outline-none focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25"
          >
            {categories.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
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
        <Field label="Sort order">
          <Input type="number" min="0" value={values.order} onChange={(event) => update('order', event.target.value)} />
        </Field>
        <Field label="Image path or URL">
          <Input value={values.image} onChange={(event) => update('image', event.target.value)} placeholder="/media/service.jpg" />
        </Field>
        <Field label="Image description" className="sm:col-span-2">
          <Input value={values.imageAlt} onChange={(event) => update('imageAlt', event.target.value)} />
        </Field>
        <Field label="Short summary" className="sm:col-span-2">
          <Textarea required maxLength={2000} rows={3} value={values.summary} onChange={(event) => update('summary', event.target.value)} />
        </Field>
        <Field label="Detailed description" className="sm:col-span-2">
          <Textarea rows={5} value={values.description} onChange={(event) => update('description', event.target.value)} />
        </Field>
        <Field label="Scope (one item per line)" className="sm:col-span-2">
          <Textarea rows={5} value={values.scope} onChange={(event) => update('scope', event.target.value)} />
        </Field>
        <Field label="Benefits (one approved item per line)" className="sm:col-span-2">
          <Textarea rows={4} value={values.benefits} onChange={(event) => update('benefits', event.target.value)} />
        </Field>
        <Field label="Delivery approach" className="sm:col-span-2">
          <Textarea rows={4} value={values.deliveryApproach} onChange={(event) => update('deliveryApproach', event.target.value)} />
        </Field>
        <Field label="Related verified projects (JSON array)" className="sm:col-span-2">
          <Textarea rows={5} value={values.relatedProjects} onChange={(event) => update('relatedProjects', event.target.value)} />
        </Field>
        <Field label="FAQs (JSON array with question and answer)" className="sm:col-span-2">
          <Textarea rows={5} value={values.faqs} onChange={(event) => update('faqs', event.target.value)} />
        </Field>
      </div>

      {(jsonError || error) && (
        <p role="alert" className="border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-ink">
          {jsonError || error}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-3 border-t border-line pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={pending}>
          <Save className="size-4" aria-hidden="true" />
          {pending ? 'Saving…' : 'Save service'}
        </Button>
      </div>
    </form>
  )
}

function Field({ label, className = '', children }) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="text-[0.75rem] font-semibold text-navy">{label}</span>
      {children}
    </label>
  )
}

export function ServicesAdminPage() {
  const t = useT()
  const queryClient = useQueryClient()
  const query = useAdminServices()
  const [editor, setEditor] = useState(null)
  const [requestError, setRequestError] = useState('')
  const services = query.data ?? []

  const save = useMutation({
    mutationFn: ({ id, service }) => id
      ? servicesAdminApi.update(id, service)
      : servicesAdminApi.create(service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
      queryClient.invalidateQueries({ queryKey: ['services'] })
      setEditor(null)
      setRequestError('')
    },
    onError: (error) => setRequestError(normaliseError(error).message),
  })

  const remove = useMutation({
    mutationFn: (id) => servicesAdminApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
      queryClient.invalidateQueries({ queryKey: ['services'] })
      setRequestError('')
    },
    onError: (error) => setRequestError(normaliseError(error).message),
  })

  function deleteService(service) {
    if (window.confirm(`Delete “${service.title}”? This cannot be undone.`)) {
      remove.mutate(service.id)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-navy">{t('admin.nav.services')}</h2>
          <p className="mt-1 text-[0.8125rem] text-muted">
            Create and maintain verified service content. Unpublished services are not visible on the public site.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => query.refetch()} disabled={query.isFetching}>
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => { setRequestError(''); setEditor({ ...emptyService }) }}>
            <Plus className="size-3.5" aria-hidden="true" />
            Add service
          </Button>
        </div>
      </div>

      {requestError && !editor && (
        <ErrorState title="Service update failed" text={requestError} onRetry={() => query.refetch()} />
      )}

      {editor && (
        <AdminPanel className="p-5 sm:p-7">
          <ServiceForm
            key={editor.id ?? 'new'}
            service={editor}
            pending={save.isPending}
            error={editor.error}
            onCancel={() => { setEditor(null); setRequestError('') }}
            onSave={(service) => {
              setRequestError('')
              save.mutate({ id: editor.id, service })
            }}
          />
          {requestError && (
            <p role="alert" className="mt-4 border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-ink">
              {requestError}
            </p>
          )}
        </AdminPanel>
      )}

      {query.isPending ? (
        <LoadingState label="Loading services…" />
      ) : query.isError ? (
        <ErrorState
          title="Services could not be loaded"
          text={normaliseError(query.error).message}
          onRetry={() => query.refetch()}
        />
      ) : (
        <AdminPanel>
          {services.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[42rem] text-left text-sm">
                <thead className="border-b border-line bg-canvas text-[0.625rem] uppercase tracking-[0.12em] text-muted">
                  <tr>
                    <th className="px-5 py-3">Service</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-navy">{service.title}</p>
                        <p className="mt-1 text-[0.6875rem] text-muted">/{service.slug}</p>
                      </td>
                      <td className="px-5 py-4 text-muted">{service.category}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={service.status} label={service.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setRequestError(''); setEditor(service) }}>
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Delete ${service.title}`}
                            disabled={remove.isPending}
                            onClick={() => deleteService(service)}
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
              No services yet. Add verified content to publish the first service.
            </div>
          )}
        </AdminPanel>
      )}
    </div>
  )
}
