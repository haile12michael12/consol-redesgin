import {
  ArrowLeft,
  ClipboardList,
  FileText,
  FolderKanban,
  GraduationCap,
  Images,
  Inbox,
  LayoutDashboard,
  Newspaper,
  ShieldAlert,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { AdminCell, AdminPagination, AdminPanel, AdminTable, SimpleBarChart, StatusBadge } from '@/components/admin/AdminUI'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import {
  certificates,
  courseRows,
  inquiries,
  mediaItems,
  newsRows,
  profileSections,
  projectRows,
  registrations,
  registrationsByArea,
  serviceRows,
  users,
} from '@/data/adminDemo'

const moduleConfig = {
  registrations: { titleKey: 'admin.nav.registrations', Icon: ClipboardList, data: registrations, kind: 'registrations' },
  certificates: { titleKey: 'admin.nav.certificates', Icon: ShieldAlert, data: certificates, kind: 'certificates' },
  inquiries: { titleKey: 'admin.nav.inquiries', Icon: Inbox, data: inquiries, kind: 'inquiries' },
  media: { titleKey: 'admin.nav.media', Icon: Images, data: mediaItems, kind: 'media' },
  users: { titleKey: 'admin.nav.users', Icon: FileText, data: users, kind: 'users' },
  analytics: { titleKey: 'admin.nav.analytics', Icon: LayoutDashboard, data: null, kind: 'analytics' },
  profile: { titleKey: 'admin.nav.profile', Icon: FileText, data: profileSections, kind: 'profile' },
  services: { titleKey: 'admin.nav.services', Icon: FileText, data: serviceRows, kind: 'services' },
  projects: { titleKey: 'admin.nav.projects', Icon: FolderKanban, data: projectRows, kind: 'projects' },
  training: { titleKey: 'admin.nav.training', Icon: GraduationCap, data: courseRows, kind: 'training' },
  news: { titleKey: 'admin.nav.news', Icon: Newspaper, data: newsRows, kind: 'news' },
}

export function AdminModulePage({ moduleKey }) {
  const t = useT()
  const config = moduleConfig[moduleKey] ?? { titleKey: 'admin.nav.dashboard', Icon: FileText, data: null, kind: 'empty' }

  usePageMeta({ title: t(config.titleKey), description: 'CONSOL administration preview.', noindex: true })

  if (config.kind === 'analytics') {
    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-navy">{t('admin.nav.analytics')}</h2>
          <p className="mt-1 text-[0.8125rem] text-muted">
            Traffic and engagement reporting will read from the Laravel analytics endpoint.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <AdminPanel title={t('admin.chart.registrations')} description="Demonstration distribution">
            <SimpleBarChart data={registrationsByArea} />
          </AdminPanel>
          <AdminPanel title={t('admin.chart.inquiries')} description="Demonstration distribution">
            <SimpleBarChart data={inquiries.map((item) => ({ name: item.type, value: item.id.slice(-1) * 4 }))} />
          </AdminPanel>
        </div>

        <PlaceholderPanel title={t('admin.nav.analytics')} />
      </div>
    )
  }

  if (config.kind === 'empty') {
    return (
      <div className="space-y-5">
        <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-navy">{t(config.titleKey)}</h2>
        <PlaceholderPanel title={t(config.titleKey)} />
      </div>
    )
  }

  const ColumnSets = {
    registrations: {
      columns: [
        { key: 'id', label: 'Reference' },
        { key: 'name', label: 'Participant' },
        { key: 'course', label: 'Course' },
        { key: 'date', label: 'Received' },
        { key: 'status', label: t('admin.table.status') },
      ],
      render: (row) => (
        <>
          <AdminCell className="font-mono text-[0.75rem] text-muted">{row.id}</AdminCell>
          <AdminCell className="font-medium text-navy">{row.name}</AdminCell>
          <AdminCell>{row.course}</AdminCell>
          <AdminCell className="text-muted">{row.date}</AdminCell>
          <AdminCell>
            <StatusBadge status={row.status} label={t(`admin.status.${row.status}`)} />
          </AdminCell>
        </>
      ),
    },
    certificates: {
      columns: [
        { key: 'id', label: 'Reference' },
        { key: 'holder', label: 'Holder' },
        { key: 'course', label: 'Course' },
        { key: 'issued', label: 'Issued' },
        { key: 'status', label: t('admin.table.status') },
      ],
      render: (row) => (
        <>
          <AdminCell className="font-mono text-[0.75rem] text-muted">{row.id}</AdminCell>
          <AdminCell className="font-medium text-navy">{row.holder}</AdminCell>
          <AdminCell>{row.course}</AdminCell>
          <AdminCell className="text-muted">{row.issued}</AdminCell>
          <AdminCell>
            <StatusBadge status={row.status} label={t(`admin.status.${row.status}`)} />
          </AdminCell>
        </>
      ),
    },
    inquiries: {
      columns: [
        { key: 'id', label: 'Reference' },
        { key: 'name', label: 'From' },
        { key: 'type', label: 'Type' },
        { key: 'subject', label: 'Subject' },
        { key: 'date', label: 'Received' },
        { key: 'status', label: t('admin.table.status') },
      ],
      render: (row) => (
        <>
          <AdminCell className="font-mono text-[0.75rem] text-muted">{row.id}</AdminCell>
          <AdminCell className="font-medium text-navy">{row.name}</AdminCell>
          <AdminCell>{row.type}</AdminCell>
          <AdminCell className="max-w-[16rem] truncate">{row.subject}</AdminCell>
          <AdminCell className="text-muted">{row.date}</AdminCell>
          <AdminCell>
            <StatusBadge status={row.status} label={t(`admin.status.${row.status}`)} />
          </AdminCell>
        </>
      ),
    },
    media: {
      columns: [
        { key: 'name', label: 'File' },
        { key: 'type', label: 'Type' },
        { key: 'size', label: 'Size' },
        { key: 'usage', label: 'Used on' },
        { key: 'updated', label: t('admin.table.updated') },
      ],
      render: (row) => (
        <>
          <AdminCell className="font-medium text-navy">{row.name}</AdminCell>
          <AdminCell>{row.type}</AdminCell>
          <AdminCell className="text-muted">{row.size}</AdminCell>
          <AdminCell className="text-muted">{row.usage}</AdminCell>
          <AdminCell className="text-muted">{row.updated}</AdminCell>
        </>
      ),
    },
    users: {
      columns: [
        { key: 'name', label: 'User' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'lastActive', label: 'Last active' },
        { key: 'status', label: t('admin.table.status') },
      ],
      render: (row) => (
        <>
          <AdminCell className="font-medium text-navy">{row.name}</AdminCell>
          <AdminCell className="text-muted">{row.email}</AdminCell>
          <AdminCell>{row.role}</AdminCell>
          <AdminCell className="text-muted">{row.lastActive}</AdminCell>
          <AdminCell>
            <StatusBadge status={row.status} label={t(`admin.status.${row.status}`)} />
          </AdminCell>
        </>
      ),
    },
    services: {
      columns: [
        { key: 'title', label: 'Service' },
        { key: 'services', label: 'Scopes' },
        { key: 'status', label: t('admin.table.status') },
        { key: 'updated', label: t('admin.table.updated') },
      ],
      render: (row) => (
        <>
          <AdminCell className="font-medium text-navy">{row.title}</AdminCell>
          <AdminCell>{row.services}</AdminCell>
          <AdminCell>
            <StatusBadge status={row.status} label={t(`admin.status.${row.status}`)} />
          </AdminCell>
          <AdminCell className="text-muted">{row.updated}</AdminCell>
        </>
      ),
    },
    projects: {
      columns: [
        { key: 'title', label: 'Project' },
        { key: 'client', label: 'Client' },
        { key: 'year', label: 'Year' },
        { key: 'status', label: t('admin.table.status') },
        { key: 'updated', label: t('admin.table.updated') },
      ],
      render: (row) => (
        <>
          <AdminCell className="font-medium text-navy">{row.title}</AdminCell>
          <AdminCell className="text-muted">{row.client}</AdminCell>
          <AdminCell>{row.year}</AdminCell>
          <AdminCell>
            <StatusBadge status={row.status} label={t(`admin.status.${row.status}`)} />
          </AdminCell>
          <AdminCell className="text-muted">{row.updated}</AdminCell>
        </>
      ),
    },
    training: {
      columns: [
        { key: 'title', label: 'Course' },
        { key: 'category', label: 'Category' },
        { key: 'sessions', label: 'Sessions' },
        { key: 'status', label: t('admin.table.status') },
        { key: 'updated', label: t('admin.table.updated') },
      ],
      render: (row) => (
        <>
          <AdminCell className="font-medium text-navy">{row.title}</AdminCell>
          <AdminCell className="text-muted">{row.category}</AdminCell>
          <AdminCell>{row.sessions}</AdminCell>
          <AdminCell>
            <StatusBadge status={row.status} label={t(`admin.status.${row.status}`)} />
          </AdminCell>
          <AdminCell className="text-muted">{row.updated}</AdminCell>
        </>
      ),
    },
    news: {
      columns: [
        { key: 'title', label: 'Content' },
        { key: 'type', label: 'Type' },
        { key: 'date', label: 'Published' },
        { key: 'status', label: t('admin.table.status') },
        { key: 'updated', label: t('admin.table.updated') },
      ],
      render: (row) => (
        <>
          <AdminCell className="max-w-[18rem] truncate font-medium text-navy">{row.title}</AdminCell>
          <AdminCell className="text-muted">{row.type}</AdminCell>
          <AdminCell>{row.date ?? '—'}</AdminCell>
          <AdminCell>
            <StatusBadge status={row.status} label={t(`admin.status.${row.status}`)} />
          </AdminCell>
          <AdminCell className="text-muted">{row.updated}</AdminCell>
        </>
      ),
    },
    profile: {
      columns: [
        { key: 'section', label: 'Section' },
        { key: 'source', label: 'Content source' },
        { key: 'status', label: t('admin.table.status') },
        { key: 'updated', label: t('admin.table.updated') },
      ],
      render: (row) => (
        <>
          <AdminCell className="font-medium text-navy">{row.section}</AdminCell>
          <AdminCell className="text-muted">{row.source}</AdminCell>
          <AdminCell>
            <StatusBadge status={row.status} label={t(`admin.status.${row.status}`)} />
          </AdminCell>
          <AdminCell className="text-muted">{row.updated}</AdminCell>
        </>
      ),
    },
  }

  const set = ColumnSets[config.kind]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-navy">{t(config.titleKey)}</h2>
          <p className="mt-1 text-[0.8125rem] text-muted">
            Interface preview with demonstration records. Connect the Laravel endpoint to load production data.
          </p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin/dashboard">
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            {t('admin.placeholder.back')}
          </Link>
        </Button>
      </div>

      <AdminPanel>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
          <input
            type="search"
            placeholder="Search records…"
            aria-label="Search records"
            className="h-10 w-full max-w-xs rounded-[3px] border border-line bg-white px-3 text-[0.8125rem] outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
          <span className="text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-gold-deep">Demo data</span>
        </div>
        <AdminTable columns={set.columns} rows={config.data} renderRow={set.render} />
        <AdminPagination page={1} total={1} />
      </AdminPanel>
    </div>
  )
}

function PlaceholderPanel({ title }) {
  const t = useT()
  return (
    <AdminPanel>
      <div className="px-6 py-14 text-center">
        <LayoutDashboard className="mx-auto size-7 text-line-strong" aria-hidden="true" />
        <h3 className="mt-4 text-[1.0625rem] font-semibold text-navy">{t('admin.placeholder.title')}</h3>
        <p className="mx-auto mt-2 max-w-md text-[0.8125rem] leading-relaxed text-muted">
          {t('admin.placeholder.text')}
        </p>
        <p className="mt-3 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-gold-deep">{title}</p>
        <Button asChild variant="outline" size="sm" className="mt-5">
          <Link to="/admin/dashboard">{t('admin.placeholder.back')}</Link>
        </Button>
      </div>
    </AdminPanel>
  )
}
