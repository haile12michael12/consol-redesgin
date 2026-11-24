import {
  Activity,
  ClipboardList,
  FolderKanban,
  Inbox,
  Mail,
  Newspaper,
  Plus,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  AdminKpi,
  AdminPanel,
  AdminRowLink,
  SimpleBarChart,
  Sparkline,
  StatusBadge,
} from '@/components/admin/AdminUI'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import {
  inquiriesBySource,
  kpis,
  recentActivity,
  registrationsByArea,
  trafficSeries,
} from '@/data/adminDemo'

const kpiIcons = { visitors: Activity, inquiries: Inbox, consultations: Mail, registrations: ClipboardList }

export function DashboardPage() {
  const t = useT()
  usePageMeta({ title: 'Admin dashboard', description: 'CONSOL administration preview.', noindex: true })

  const quickActions = [
    { labelKey: 'admin.quick.news', to: '/admin/news', Icon: Newspaper },
    { labelKey: 'admin.quick.course', to: '/admin/training', Icon: ClipboardList },
    { labelKey: 'admin.quick.project', to: '/admin/projects', Icon: FolderKanban },
    { labelKey: 'admin.quick.inquiry', to: '/admin/inquiries', Icon: Inbox },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-gold-deep">
            {t('admin.welcome')}
          </p>
          <h2 className="mt-1.5 text-[1.5rem] font-semibold tracking-[-0.02em] text-navy">
            Welcome back, Administrator
          </h2>
          <p className="mt-1 text-[0.8125rem] text-muted">{t('admin.welcomeText')}</p>
        </div>
        <Button asChild variant="primary" size="md">
          <Link to="/admin/news">
            <Plus className="size-4" aria-hidden="true" />
            {t('admin.quick.news')}
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <AdminKpi
            key={kpi.key}
            label={t(kpi.labelKey)}
            value={kpi.value}
            delta={kpi.delta}
            trend={kpi.trend}
            icon={kpiIcons[kpi.key]}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <AdminPanel
          title={t('admin.chart.traffic')}
          description={t('admin.chart.trafficText')}
          action={<span className="text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-gold-deep">Demo data</span>}
        >
          <div className="p-5">
            <div className="flex items-baseline gap-3">
              <p className="font-display text-[2.25rem] leading-none text-navy">5,182</p>
              <span className="text-[0.75rem] font-semibold text-success">▲ 14.2%</span>
            </div>
            <p className="mt-1 text-[0.6875rem] text-muted">Sessions · last 5 weeks</p>
            <div className="mt-4">
              <Sparkline data={trafficSeries} />
            </div>
            <ul className="mt-3 grid grid-cols-5 gap-1 border-t border-line pt-3">
              {trafficSeries.map((item) => (
                <li key={item.day} className="text-center">
                  <p className="text-[0.5625rem] uppercase tracking-[0.08em] text-muted">{item.day}</p>
                  <p className="text-[0.6875rem] font-semibold text-navy">{item.sessions}</p>
                </li>
              ))}
            </ul>
          </div>
        </AdminPanel>

        <AdminPanel title={t('admin.chart.inquiries')} description="Distribution of inbound requests">
          <SimpleBarChart data={inquiriesBySource} />
        </AdminPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr_1fr]">
        <AdminPanel title={t('admin.chart.registrations')} description="By course area">
          <SimpleBarChart data={registrationsByArea} />
        </AdminPanel>

        <AdminPanel title={t('admin.activity')} description={t('admin.activityText')}>
          <ul className="divide-y divide-line">
            {recentActivity.map((item) => (
              <li key={item.id} className="flex items-start gap-3 px-5 py-3.5">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-[0.8125rem] font-medium text-navy">{item.action}</p>
                  <p className="mt-0.5 truncate text-[0.6875rem] text-muted">{item.subject}</p>
                </div>
                <span className="ml-auto shrink-0 text-[0.625rem] text-muted">{item.time}</span>
              </li>
            ))}
          </ul>
        </AdminPanel>

        <div className="space-y-6">
          <AdminPanel title={t('admin.quickActions')}>
            <ul className="divide-y divide-line">
              {quickActions.map(({ labelKey, to, Icon }) => (
                <li key={to + labelKey}>
                  <Link
                    to={to}
                    className="flex items-center gap-3 px-5 py-3 text-[0.8125rem] font-medium text-navy transition-colors hover:bg-canvas/60"
                  >
                    <Icon className="size-4 text-gold-deep" aria-hidden="true" />
                    {t(labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </AdminPanel>

          <AdminPanel title={t('admin.nav.registrations')} action={<AdminRowLink label="Open" />}>
            <ul className="divide-y divide-line">
              {[
                { name: 'Demo Participant A', course: 'PMI® PMP®', status: 'new' },
                { name: 'Demo Participant B', course: 'Revit Architecture', status: 'open' },
                { name: 'Demo Participant C', course: 'ETABS', status: 'closed' },
              ].map((item) => (
                <li key={item.name} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <p className="text-[0.75rem] font-medium text-navy">{item.name}</p>
                    <p className="text-[0.625rem] text-muted">{item.course}</p>
                  </div>
                  <StatusBadge status={item.status} label={t(`admin.status.${item.status}`)} />
                </li>
              ))}
            </ul>
          </AdminPanel>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: t('admin.kpi.sessions'), value: '32', hint: 'Training sessions this quarter' },
          { label: t('admin.kpi.published'), value: '38', hint: 'Published website pages' },
          { label: t('admin.nav.users'), value: '3', hint: 'Active staff accounts' },
        ].map((item) => (
          <div key={item.label} className="border border-line bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted">{item.label}</p>
              <Users className="size-4 text-line-strong" aria-hidden="true" />
            </div>
            <p className="mt-3 font-display text-[1.75rem] leading-none text-navy">{item.value}</p>
            <p className="mt-2 text-[0.6875rem] text-muted">{item.hint}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
