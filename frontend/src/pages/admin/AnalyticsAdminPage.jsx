import { useQuery } from '@tanstack/react-query'
import { AdminPanel, SimpleBarChart } from '@/components/admin/AdminUI'
import { ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { usePageMeta } from '@/lib/seo'
import { analyticsApi } from '@/services/analyticsApi'
import { normaliseError } from '@/services/api'

function chartData(series) {
  return series.map(({ month, count }) => ({ name: month, value: count }))
}

export function AnalyticsAdminPage() {
  const query = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: async () => (await analyticsApi.summary()).data,
  })

  usePageMeta({ title: 'Analytics', noindex: true })

  if (query.isPending) return <LoadingState label="Loading analytics…" />
  if (query.isError) {
    return <ErrorState title="Analytics could not be loaded" text={normaliseError(query.error).message} onRetry={query.refetch} />
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-navy">Analytics</h2>
        <p className="mt-1 text-sm text-muted">Monthly inquiry and training registration submissions.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <AdminPanel title="Inquiries" description="Actual submissions · last six months">
          <SimpleBarChart data={chartData(query.data.charts.inquiries)} />
        </AdminPanel>
        <AdminPanel title="Training registrations" description="Actual registrations · last six months">
          <SimpleBarChart data={chartData(query.data.charts.registrations)} />
        </AdminPanel>
      </div>
    </div>
  )
}