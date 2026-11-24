import { cn } from '@/lib/utils'

/** Verified figures strip with an explicit provenance note. */
export function StatStrip({ items, note, invert = false, className }) {
  return (
    <div className={className}>
      <dl
        className={cn(
          'grid grid-cols-2 gap-px md:grid-cols-4',
          invert ? 'bg-white/12' : 'bg-line',
        )}
      >
        {items.map((item) => (
          <div key={item.label} className={cn('p-5 sm:p-6', invert ? 'bg-navy' : 'bg-white')}>
            <dd
              className={cn(
                'font-display text-[clamp(1.8rem,3vw,2.4rem)] leading-none',
                invert ? 'text-gold' : 'text-navy',
              )}
            >
              {item.value}
            </dd>
            <dt
              className={cn(
                'mt-2 text-[0.625rem] font-semibold uppercase leading-snug tracking-[0.12em]',
                invert ? 'text-white/55' : 'text-muted',
              )}
            >
              {item.label}
            </dt>
          </div>
        ))}
      </dl>
      {note && (
        <p className={cn('mt-3 text-[0.625rem]', invert ? 'text-white/60' : 'text-muted')}>{note}</p>
      )}
    </div>
  )
}
