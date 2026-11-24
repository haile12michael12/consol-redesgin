import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

/**
 * CONSOL wordmark.
 *
 * The live company logo is a raster asset and is not yet supplied as an
 * approved vector. This typographic mark reproduces the published lock-up
 * (CONSOL + CONSTRUCTION SOLUTIONS PLC + tagline) until the original file is
 * provided. Swap `mark` and `wordmark` for the supplied asset in one place.
 */
export function Logo({ invert = false, compact = false, className, to = '/' }) {
  return (
    <Link
      to={to}
      aria-label="CONSOL — Construction Solutions PLC, home"
      className={cn('group inline-flex items-center gap-3', className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          'relative grid size-10 place-items-center overflow-hidden border transition-colors',
          invert ? 'border-white/25 bg-white/5' : 'border-navy/12 bg-navy',
        )}
      >
        <svg viewBox="0 0 32 32" className="size-6" fill="none">
          <path d="M6 24V11l10 8.5L26 11v13" stroke="#C99A43" strokeWidth="2.2" />
          <path d="M6 8h20" stroke="white" strokeWidth="2.2" />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={cn(
            'block font-extrabold tracking-[0.24em] transition-colors',
            compact ? 'text-[1.1rem]' : 'text-[1.35rem]',
            invert ? 'text-white' : 'text-navy',
          )}
        >
          CONSOL
        </span>
        {!compact && (
          <>
            <span
              className={cn(
                'mt-1.5 block text-[0.5rem] font-semibold uppercase leading-none tracking-[0.19em]',
                invert ? 'text-white/60' : 'text-muted',
              )}
            >
              Construction Solutions PLC
            </span>
            <span
              className={cn(
                'mt-1.5 block text-[0.4375rem] font-medium uppercase leading-none tracking-[0.22em]',
                invert ? 'text-gold-soft/90' : 'text-gold-deep',
              )}
            >
              Your partner in growth
            </span>
          </>
        )}
      </span>
    </Link>
  )
}
