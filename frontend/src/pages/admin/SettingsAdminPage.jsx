import { Plus, Save, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AdminPanel } from '@/components/admin/AdminUI'
import { ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { normaliseError } from '@/services/api'
import { settingsApi } from '@/services/settingsApi'
import { usePageMeta } from '@/lib/seo'
import { toast } from 'sonner'

const AVAILABLE_SETTINGS = [
  ['site.description', 'Website description'],
  ['seo.title', 'Default SEO title'],
  ['seo.description', 'Default SEO description'],
]

function valueAsText(value) {
  if (typeof value === 'string') return value
  return value == null ? '' : JSON.stringify(value)
}

export function SettingsAdminPage() {
  const queryClient = useQueryClient()
  const [values, setValues] = useState({})
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [error, setError] = useState('')
  const query = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => (await settingsApi.list()).data,
  })

  usePageMeta({ title: 'Website settings', noindex: true })

  async function save(id, value) {
    setError('')
    try {
      await settingsApi.update(id, { value })
      await queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
      toast.success('Setting saved.')
    } catch (requestError) {
      setError(normaliseError(requestError).message)
    }
  }

  async function create(event) {
    event.preventDefault()
    setError('')
    try {
      await settingsApi.create({ key: newKey, value: newValue })
      setNewKey('')
      setNewValue('')
      await queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
      toast.success('Setting added.')
    } catch (requestError) {
      const normalized = normaliseError(requestError)
      setError([normalized.message, ...Object.values(normalized.errors ?? {}).flat()].join(' '))
    }
  }

  async function remove(setting) {
    if (!window.confirm(`Delete “${setting.key}”? This cannot be undone.`)) return
    setError('')
    try {
      await settingsApi.delete(setting.id)
      await queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
      toast.success('Setting deleted.')
    } catch (requestError) {
      setError(normaliseError(requestError).message)
    }
  }

  if (query.isPending) return <LoadingState label="Loading website settings…" />
  if (query.isError) {
    return <ErrorState title="Website settings could not be loaded" text={normaliseError(query.error).message} onRetry={query.refetch} />
  }

  const settings = query.data ?? []
  const available = AVAILABLE_SETTINGS.filter(([key]) => !settings.some((setting) => setting.key === key))

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-navy">Website settings</h2>
        <p className="mt-1 text-sm text-muted">Only allowlisted public company and SEO values are editable here.</p>
      </div>
      {error && <p role="alert" className="border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>}

      <AdminPanel title="Public website values">
        {settings.length === 0 ? <p className="p-6 text-sm text-muted">No settings are configured.</p> : (
          <div className="divide-y divide-line">
            {settings.map((setting) => {
              const value = values[setting.id] ?? valueAsText(setting.value)
              const multiline = setting.key.endsWith('address') || setting.key.endsWith('description')
              const Control = multiline ? Textarea : Input
              return (
                <div key={setting.id} className="grid gap-3 p-4 md:grid-cols-[12rem_1fr_auto_auto] md:items-center">
                  <div><p className="text-sm font-semibold text-navy">{setting.key}</p><p className="mt-0.5 text-xs text-muted">{setting.group} · public</p></div>
                  <Control rows={multiline ? 3 : undefined} value={value} onChange={(event) => setValues((current) => ({ ...current, [setting.id]: event.target.value }))} aria-label={`Value for ${setting.key}`} />
                  <Button size="sm" onClick={() => save(setting.id, value)}><Save className="size-3.5" aria-hidden="true" />Save</Button>
                  <Button size="icon" variant="ghost" aria-label={`Delete ${setting.key}`} onClick={() => remove(setting)}><Trash2 className="size-4 text-danger" aria-hidden="true" /></Button>
                </div>
              )
            })}
          </div>
        )}
      </AdminPanel>

      {available.length > 0 && (
        <AdminPanel title="Add setting">
          <form onSubmit={create} className="grid gap-4 p-5 md:grid-cols-[1fr_2fr_auto] md:items-end">
            <label className="block space-y-1.5"><span className="text-xs font-semibold text-navy">Setting</span><select required value={newKey} onChange={(event) => setNewKey(event.target.value)} className="h-11 w-full border border-line bg-white px-3 text-sm"><option value="">Choose a setting</option>{available.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
            <label className="block space-y-1.5"><span className="text-xs font-semibold text-navy">Value</span><Input required value={newValue} onChange={(event) => setNewValue(event.target.value)} /></label>
            <Button type="submit"><Plus className="size-4" aria-hidden="true" />Add</Button>
          </form>
        </AdminPanel>
      )}
    </div>
  )
}