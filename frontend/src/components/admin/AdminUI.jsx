import { ArrowUpRight, ChevronLeft, ChevronRight, SearchX } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function AdminPanel({ title, description, action, children, className }) {
  return (
    <section className={cn('border border-line bg-white', className)}>
      {(title || action) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            {title && <h2 className="text-[0.9375rem] font-semibold text-navy">{title}</h2>}
            {description && <p className="mt-0.5 text-[0.75rem] text-muted">{description}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

const statusStyles = {
  published: 'positive',
  draft: 'outline',
  review: 'gold',
  new: 'gold',
  open: 'navy',
  closed: 'outline',
}

export function StatusBadge({ status, label }) {
  return <Badge variant={statusStyles[status] ?? 'outline'}>{label ?? status}</Badge>
}

export function AdminKpi({ label, value, delta, trend, icon: Icon }) {
  return (
    <div className="border border-line bg-white p-5">
      <div className="flex items-start justify-between">
        <p className="text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
        {Icon && <Icon className="size-4 text-line-strong" aria-hidden="true" />}
      </div>
      <p className="mt-3 font-display text-[2rem] leading-none text-navy">{value}</p>
      {delta && (
        <p
          className={cn(
            'mt-2.5 inline-flex items-center gap-1 text-[0.6875rem] font-semibold',
            trend === 'up' ? 'text-success' : 'text-danger',
          )}
        >
          {trend === 'up' ? '▲' : '▼'} {delta}
          <span className="font-normal text-muted">vs previous period</span>
        </p>
      )}
    </div>
  )
}

export function AdminTable({ columns, rows, renderRow, empty }) {
  if (!rows.length) {
    return (
      <div className="px-5 py-16 text-center">
        <SearchX className="mx-auto size-6 text-muted/60" aria-hidden="true" />
        <p className="mt-3 text-[0.875rem] font-semibold text-navy">{empty?.title ?? 'No records'}</p>
        <p className="mt-1 text-[0.75rem] text-muted">{empty?.text ?? 'Records appear once the API is connected.'}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[42rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-line bg-canvas/60">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-5 py-3 text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-muted"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row, index) => (
            <tr key={row.id ?? index} className="transition-colors hover:bg-canvas/40">
              {renderRow(row)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function AdminCell({ children, className }) {
  return <td className={cn('px-5 py-3.5 text-[0.8125rem] text-ink', className)}>{children}</td>
}

export function AdminPagination({ page = 1, total = 1 }) {
  return (
    <div className="flex items-center justify-between border-t border-line px-5 py-3">
      <p className="text-[0.6875rem] text-muted">
        Page {page} of {total} · demo dataset
      </p>
      <div className="flex gap-1">
        <button
          type="button"
          disabled={page === 1}
          className="grid size-7 place-items-center border border-line text-navy disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-3.5" />
        </button>
        <button
          type="button"
          disabled={page === total}
          className="grid size-7 place-items-center border border-line text-navy disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

export function AdminRowLink({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold text-navy hover:text-gold-deep"
    >
      {label}
      <ArrowUpRight className="size-3" aria-hidden="true" />
    </button>
  )
}

export function SimpleBarChart({ data, valueKey = 'value', labelKey = 'name' }) {
  const max = Math.max(...data.map((item) => item[valueKey]), 1)
  return (
    <ul className="space-y-3.5 p-5">
      {data.map((item) => (
        <li key={item[labelKey]}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[0.75rem] font-medium text-ink">{item[labelKey]}</span>
            <span className="text-[0.6875rem] font-semibold text-navy">{item[valueKey]}</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full bg-canvas">
            <div
              className="h-full bg-gold"
              style={{ width: `${Math.round((item[valueKey] / max) * 100)}%` }}
              aria-hidden="true"
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function Sparkline({ data, valueKey = 'sessions', height = 72 }) {
  const values = data.map((item) => item[valueKey])
  const max = Math.max(...values)
  const min = Math.min(...values)
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100
      const y = height - ((value - min) / (max - min || 1)) * (height - 8) - 4
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      className="h-24 w-full"
      role="img"
      aria-label="Trend chart"
    >
      <polyline points={points} fill="none" stroke="#C99A43" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <polyline
        points={`0,${height} ${points} 100,${height}`}
        fill="rgba(201,154,67,0.10)"
        stroke="none"
      />
    </svg>
  )
}
