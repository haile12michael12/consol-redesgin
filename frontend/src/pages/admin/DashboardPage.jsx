import {
  BriefcaseBusiness,
  ClipboardList,
  FolderKanban,
  GraduationCap,
  Inbox,
  Newspaper,
  Plus,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  AdminKpi,
  AdminPanel,
  SimpleBarChart,
} from '@/components/admin/AdminUI'
import { Button } from '@/components/ui/button'
import { ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { analyticsApi } from '@/services/analyticsApi'
import { normaliseError } from '@/services/api'

const kpis = [
  { key: 'totalInquiries', label: 'Total inquiries', Icon: Inbox },
  { key: 'publishedServices', label: 'Published services', Icon: BriefcaseBusiness },
  { key: 'totalProjects', label: 'Total projects', Icon: FolderKanban },
  { key: 'trainingCourses', label: 'Training courses', Icon: GraduationCap },
  { key: 'trainingRegistrations', label: 'Training registrations', Icon: ClipboardList },
  { key: 'newsArticles', label: 'News articles', Icon: Newspaper },
]

function chartData(series) {
  return series.map(({ month, count }) => ({ name: month, value: count }))
}

function formatActivityTime(value) {
  return value ? new Date(value).toLocaleString() : '—'
}

export function DashboardPage() {
  const t = useT()
  const query = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: async () => (await analyticsApi.summary()).data,
  })

  usePageMeta({ title: 'Admin dashboard', description: 'CONSOL administration preview.', noindex: true })

  if (query.isPending) return <LoadingState className="section" label="Loading dashboard data…" />
  if (query.isError) {
    return (
      <ErrorState
        title="Dashboard data could not be loaded"
        text={normaliseError(query.error).message}
        onRetry={query.refetch}
      />
    )
  }

  const data = query.data
  const activity = data.recentActivity ?? []

  const quickActions = [
    { label: t('admin.quick.news'), to: '/admin/news', Icon: Newspaper },
    { label: t('admin.quick.course'), to: '/admin/training', Icon: ClipboardList },
    { label: t('admin.quick.project'), to: '/admin/projects', Icon: FolderKanban },
    { label: t('admin.quick.inquiry'), to: '/admin/inquiries', Icon: Inbox },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-gold-deep">
            {t('admin.welcome')}
          </p>
          <h2 className="mt-1.5 text-[1.5rem] font-semibold text-navy">Welcome back, Administrator</h2>
          <p className="mt-1 text-[0.8125rem] text-muted">Live CONSOL content and training overview.</p>
        </div>
        <Button asChild variant="primary" size="md">
          <Link to="/admin/news">
            <Plus className="size-4" aria-hidden="true" />
            {t('admin.quick.news')}
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map(({ key, label, Icon }) => (
          <AdminKpi
            key={key}
            label={label}
            value={Number(data.counts[key]).toLocaleString()}
            icon={Icon}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminPanel title="Inquiries received" description="Monthly submissions · last six months">
          <SimpleBarChart data={chartData(data.charts.inquiries)} />
        </AdminPanel>
        <AdminPanel title="Training registrations" description="Monthly submissions · last six months">
          <SimpleBarChart data={chartData(data.charts.registrations)} />
        </AdminPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <AdminPanel title={t('admin.activity')} description="Recent administrator changes">
          {activity.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted">No recent changes have been recorded.</p>
          ) : (
            <ul className="divide-y divide-line">
              {activity.map((item) => (
                <li key={item.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3.5">
                  <span className="size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  <p className="min-w-0 flex-1 text-[0.8125rem] font-medium text-navy">
                    {item.actor ?? 'Former staff'} {item.action} {item.resource.replaceAll('/', ' ')}
                    {item.resourceId ? ` #${item.resourceId}` : ''}
                  </p>
                  <time className="text-[0.625rem] text-muted" dateTime={item.createdAt}>
                    {formatActivityTime(item.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </AdminPanel>

        <AdminPanel title={t('admin.quickActions')}>
          <ul className="divide-y divide-line">
            {quickActions.map((action) => {
              const Icon = action.Icon
              return (
                <li key={action.to}>
                  <Link to={action.to} className="flex items-center gap-3 px-5 py-3 text-[0.8125rem] font-medium text-navy hover:bg-canvas/60">
                    <Icon className="size-4 text-gold-deep" aria-hidden="true" />
                    {action.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </AdminPanel>
      </div>
    </div>
  )
}
