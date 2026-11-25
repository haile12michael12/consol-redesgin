import { useQuery } from '@tanstack/react-query'

/**
 * Wrap the services layer's `{ data, source, error }` result in TanStack Query.
 * `source === 'demo'` means the API was unavailable and labelled demo data is
 * being displayed; `source === 'error'` means no data could be shown.
 */
export function useApiQuery({ queryKey, queryFn, fallbackData, staleTime = 5 * 60 * 1000, enabled = true }) {
  const query = useQuery({
    queryKey,
    queryFn,
    placeholderData: fallbackData,
    staleTime,
    enabled,
    retry: 1,
  })

  const envelope = query.data
  const data = envelope?.data ?? fallbackData ?? null

  return {
    ...query,
    data,
    source: envelope?.source ?? 'demo',
    error: envelope?.error ?? null,
    isDemo: envelope ? envelope.source === 'demo' : envelope === undefined,
  }
}
