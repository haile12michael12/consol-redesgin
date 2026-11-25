import { Download, FileImage, FileText, Search, Trash2, Upload } from 'lucide-react'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AdminPanel } from '@/components/admin/AdminUI'
import { ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { Pagination } from '@/components/common/Pagination'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { normaliseError } from '@/services/api'
import { mediaApi } from '@/services/mediaApi'
import { usePageMeta } from '@/lib/seo'
import { toast } from 'sonner'

function fileSize(bytes) {
  if (!bytes) return '—'
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export function MediaAdminPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)
  const [file, setFile] = useState(null)
  const [alt, setAlt] = useState('')
  const [collection, setCollection] = useState('general')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const params = { q: search || undefined, type: type || undefined, page, per_page: 24 }
  const query = useQuery({
    queryKey: ['admin-media', params],
    queryFn: async () => (await mediaApi.list(params)).data,
  })

  usePageMeta({ title: 'Media library', noindex: true })

  async function upload(event) {
    event.preventDefault()
    if (!file) return
    setError('')
    setUploading(true)
    const body = new FormData()
    body.append('file', file)
    body.append('alt', alt)
    body.append('collection', collection)
    try {
      await mediaApi.upload(body)
      setFile(null)
      setAlt('')
      event.currentTarget.reset()
      await queryClient.invalidateQueries({ queryKey: ['admin-media'] })
      toast.success('File uploaded.')
    } catch (requestError) {
      const normalized = normaliseError(requestError)
      setError([normalized.message, ...Object.values(normalized.errors ?? {}).flat()].join(' '))
    } finally {
      setUploading(false)
    }
  }

  async function download(item) {
    try {
      const { data } = await mediaApi.download(item.id)
      const url = URL.createObjectURL(data)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = item.originalName
      anchor.click()
      URL.revokeObjectURL(url)
    } catch (requestError) {
      setError(normaliseError(requestError).message)
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete “${item.originalName}”? This cannot be undone.`)) return
    setError('')
    try {
      await mediaApi.delete(item.id)
      await queryClient.invalidateQueries({ queryKey: ['admin-media'] })
      toast.success('File deleted.')
    } catch (requestError) {
      setError(normaliseError(requestError).message)
    }
  }

  if (query.isPending) return <LoadingState label="Loading media library…" />
  if (query.isError) {
    return <ErrorState title="Media could not be loaded" text={normaliseError(query.error).message} onRetry={query.refetch} />
  }

  const records = query.data?.data ?? []

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-navy">Media library</h2>
        <p className="mt-1 text-sm text-muted">Approved images and PDF documents stored privately by Laravel.</p>
      </div>

      <AdminPanel title="Upload media" description="JPEG, PNG, WebP or PDF · maximum 20 MB">
        <form onSubmit={upload} className="grid gap-4 p-5 md:grid-cols-[1.4fr_1fr_0.8fr_auto] md:items-end">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-navy">File</span>
            <Input required type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-navy">Alt text</span>
            <Input maxLength={255} value={alt} onChange={(event) => setAlt(event.target.value)} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-navy">Collection</span>
            <Input required pattern="[a-z0-9_-]+" maxLength={80} value={collection} onChange={(event) => setCollection(event.target.value)} />
          </label>
          <Button type="submit" disabled={uploading || !file}><Upload className="size-4" aria-hidden="true" />{uploading ? 'Uploading…' : 'Upload'}</Button>
        </form>
        {error && <p role="alert" className="mx-5 mb-5 border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>}
      </AdminPanel>

      <AdminPanel>
        <div className="flex flex-wrap gap-3 border-b border-line p-4">
          <label className="relative min-w-56 flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Search file names" aria-label="Search media" className="pl-9" />
          </label>
          <select value={type} onChange={(event) => { setType(event.target.value); setPage(1) }} aria-label="Filter by file type" className="h-10 border border-line bg-white px-3 text-sm">
            <option value="">All file types</option><option value="image">Images</option><option value="document">PDF documents</option>
          </select>
        </div>
        {records.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-muted">No media files match these filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="bg-canvas text-xs uppercase text-muted"><tr><th className="p-3">File</th><th className="p-3">Collection</th><th className="p-3">Size</th><th className="p-3">Uploaded</th><th className="p-3 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-line">
                {records.map((item) => {
                  const isImage = item.mimeType.startsWith('image/')
                  const Icon = isImage ? FileImage : FileText
                  return (
                    <tr key={item.id}>
                      <td className="p-3"><div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center border border-line bg-canvas text-gold-deep"><Icon className="size-4" aria-hidden="true" /></span><div className="min-w-0"><p className="truncate font-medium text-navy">{item.originalName}</p><p className="mt-0.5 truncate text-xs text-muted">{item.alt || item.mimeType}</p></div></div></td>
                      <td className="p-3 text-muted">{item.collection}</td>
                      <td className="p-3 text-muted">{fileSize(item.fileSize)}</td>
                      <td className="p-3 text-xs text-muted">{item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString() : '—'}</td>
                      <td className="p-3"><div className="flex justify-end gap-2"><Button size="sm" variant="outline" onClick={() => download(item)}><Download className="size-3.5" aria-hidden="true" />Download</Button><Button size="icon" variant="ghost" aria-label={`Delete ${item.originalName}`} onClick={() => remove(item)}><Trash2 className="size-4 text-danger" aria-hidden="true" /></Button></div></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="border-t border-line px-4 py-3"><Pagination page={query.data.current_page} pageCount={query.data.last_page} onChange={setPage} /></div>
      </AdminPanel>
    </div>
  )
}