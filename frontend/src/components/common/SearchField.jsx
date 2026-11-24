import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Search input with a clear affordance, used across catalogue pages. */
export function SearchField({ value, onChange, placeholder, id = 'search', className, label }) {
  return (
    <div className={cn('relative', className)}>
      <label htmlFor={id} className="sr-only">
        {label ?? placeholder ?? 'Search'}
      </label>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-[3px] border border-line-strong bg-white pl-10 pr-10 text-[0.875rem] text-ink outline-none transition-colors placeholder:text-muted/80 focus:border-gold focus:ring-2 focus:ring-gold/25"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center text-muted transition-colors hover:text-navy"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}
