import { ErrorState, LoadingState } from '@/components/common/StateBlocks'

export function AboutContentState({ query, children }) {
  if (query.isPending) {
    return <LoadingState className="shell section" label="Loading company information…" />
  }

  if (query.source === 'error') {
    return (
      <div className="shell section">
        <ErrorState
          title="Company information is unavailable"
          text={query.error?.message ?? 'We could not load company information. Please try again.'}
          onRetry={() => query.refetch()}
        />
      </div>
    )
  }

  if (!query.data) {
    return (
      <div className="shell section">
        <ErrorState title="Company information is unavailable" />
      </div>
    )
  }

  return children(query.data)
}
