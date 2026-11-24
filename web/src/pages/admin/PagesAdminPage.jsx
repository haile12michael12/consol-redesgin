import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AdminCell,
  AdminPagination,
  AdminPanel,
  AdminRowLink,
  AdminTable,
  StatusBadge,
} from '@/components/admin/AdminUI'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { pages } from '@/data/adminDemo'

export function PagesAdminPage() {
  const t = useT()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [confirming, setConfirming] = useState(null)
  const [editing, setEditing] = useState(null)

  usePageMeta({ title: 'Website pages', description: 'CONSOL admin pages preview.', noindex: true })

  const filtered = useMemo(
    () =>
      pages.filter((page) => {
        const matchesStatus = status === 'all' || page.status === status
        const matchesSearch =
          !search || page.title.toLowerCase().includes(search.toLowerCase()) || page.path.includes(search)
        return matchesStatus && matchesSearch
      }),
    [search, status],
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-navy">{t('admin.nav.pages')}</h2>
          <p className="mt-1 text-[0.8125rem] text-muted">{t('admin.pages.intro')}</p>
        </div>
        <Button variant="primary" onClick={() => toast.info('Page editor is part of the next admin module.')}>
          <Plus className="size-4" aria-hidden="true" />
          Add page
        </Button>
      </div>

      <AdminPanel>
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search pages…"
            aria-label="Search pages"
            className="sm:max-w-xs"
          />
          <div className="flex items-center gap-2">
            <label htmlFor="page-status" className="text-[0.625rem] font-bold uppercase tracking-[0.1em] text-muted">
              {t('admin.table.status')}
            </label>
            <select
              id="page-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 rounded-[3px] border border-line-strong bg-white px-2.5 text-[0.75rem] text-navy outline-none focus:border-gold"
            >
              <option value="all">{t('admin.filters.status')}</option>
              <option value="published">{t('admin.status.published')}</option>
              <option value="draft">{t('admin.status.draft')}</option>
            </select>
          </div>
        </div>

        <AdminTable
          columns={[
            { key: 'title', label: 'Page' },
            { key: 'path', label: 'Path' },
            { key: 'sections', label: 'Sections' },
            { key: 'status', label: t('admin.table.status') },
            { key: 'updated', label: t('admin.table.updated') },
            { key: 'actions', label: t('admin.table.actions') },
          ]}
          rows={filtered}
          empty={{ title: 'No pages match', text: 'Adjust the search or status filter.' }}
          renderRow={(page) => (
            <>
              <AdminCell className="font-medium text-navy">{page.title}</AdminCell>
              <AdminCell className="font-mono text-[0.75rem] text-muted">{page.path}</AdminCell>
              <AdminCell>{page.sections}</AdminCell>
              <AdminCell>
                <StatusBadge status={page.status} label={t(`admin.status.${page.status}`)} />
              </AdminCell>
              <AdminCell className="text-muted">{page.updated}</AdminCell>
              <AdminCell>
                <div className="flex items-center gap-2.5">
                  <AdminRowLink label={t('admin.edit')} onClick={() => setEditing(page)} />
                  <button
                    type="button"
                    onClick={() => setConfirming(page)}
                    className="text-muted transition-colors hover:text-danger"
                    aria-label={`Delete ${page.title}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </AdminCell>
            </>
          )}
        />
        <AdminPagination page={1} total={1} />
      </AdminPanel>

      <p className="text-[0.6875rem] text-muted">
        All rows are demonstration records. Production data is served by the Laravel pages endpoint with server-side
        authorisation.
      </p>

      {/* Delete confirmation */}
      <Dialog open={Boolean(confirming)} onOpenChange={() => setConfirming(null)}>
        <DialogContent>
          <DialogTitle>{t('admin.confirmDelete')}</DialogTitle>
          <DialogDescription>
            “{confirming?.title}” — {t('admin.confirmDeleteText')}
          </DialogDescription>
          <div className="mt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                {t('admin.cancel')}
              </Button>
            </DialogClose>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                toast.success('Demo action — nothing was deleted')
                setConfirming(null)
              }}
            >
              {t('admin.delete')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={Boolean(editing)} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          <DialogTitle>{editing?.title}</DialogTitle>
          <DialogDescription>
            Page metadata preview. Publishing, validation and audit logging are handled by Laravel.
          </DialogDescription>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="edit-title" className="field-label">
                Title
              </label>
              <Input id="edit-title" defaultValue={editing?.title} />
            </div>
            <div>
              <label htmlFor="edit-path" className="field-label">
                Path
              </label>
              <Input id="edit-path" defaultValue={editing?.path} readOnly className="bg-canvas" />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <Button asChild variant="link" size="sm" className="h-auto p-0">
              <Link to={editing?.path ?? '/'} target="_blank">
                <Eye className="size-3.5" aria-hidden="true" />
                {t('admin.viewSite')}
              </Link>
            </Button>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="ghost" size="sm">
                  {t('admin.cancel')}
                </Button>
              </DialogClose>
              <Button
                size="sm"
                onClick={() => {
                  toast.success('Demo action — changes were not saved')
                  setEditing(null)
                }}
              >
                <Pencil className="size-3.5" aria-hidden="true" />
                {t('admin.save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
