import { Download, FileText } from 'lucide-react'
import { useState } from 'react'
import { PageHero } from '@/components/common/PageHero'
import { Pagination } from '@/components/common/Pagination'
import { SearchField } from '@/components/common/SearchField'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { Badge } from '@/components/ui/badge'
import { useResources } from '@/hooks/useNews'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'

const PER_PAGE = 12

function formatFileSize(bytes) {
  if (!bytes) return null
  return new Intl.NumberFormat(undefined, {
    style: 'unit',
    unit: 'megabyte',
    maximumFractionDigits: 1,
  }).format(bytes / (1024 * 1024))
}

export function ResourcesPage() {
  const t = useT()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const resourcesQuery = useResources({ q: query || undefined, page, per_page: PER_PAGE })
  const resources = resourcesQuery.data?.data ?? []

  usePageMeta({
    title: 'Resources',
    description: 'Approved publications and downloadable resources from Construction Solutions PLC.',
  })

  return (
    <>
      <PageHero
        eyebrow={t('nav.resources')}
        title="Company resources."
        text="Download company publications approved for public release."
        breadcrumbs={[{ label: t('nav.news'), to: '/news' }, { label: t('nav.resources'), to: '/resources' }]}
        image={{ src: '/media/library-research.jpg', alt: 'Resource library' }}
      />
      <section className="section bg-canvas">
        <div className="shell">
          <div className="mb-8 max-w-xl">
            <SearchField
              id="resource-search"
              value={query}
              onChange={(value) => {
                setQuery(value)
                setPage(1)
              }}
              placeholder="Search approved resources…"
            />
          </div>
          {resourcesQuery.isPending && !resources.length ? (
            <LoadingState label="Loading approved resources…" />
          ) : resourcesQuery.isError ? (
            <ErrorState title="Resources could not be loaded" onRetry={resourcesQuery.refetch} />
          ) : resources.length === 0 ? (
            <EmptyState
              title="No approved resources published"
              text="Documents will appear here after CONSOL has approved them for public release."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <article key={resource.slug} className="flex flex-col border border-line bg-white p-6">
                  <div className="flex items-start justify-between gap-4">
                    <FileText className="size-5 text-gold-deep" aria-hidden="true" />
                    <Badge variant="outline">PDF</Badge>
                  </div>
                  <h2 className="mt-5 text-base font-semibold leading-snug text-navy">{resource.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{resource.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                    <span className="text-xs text-muted">
                      {resource.fileName}{resource.fileSize ? ` · ${formatFileSize(resource.fileSize)}` : ''}
                    </span>
                    <a
                      href={resource.downloadUrl}
                      className="inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy hover:text-gold-deep"
                    >
                      <Download className="size-4" aria-hidden="true" />Download
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
          {resourcesQuery.data?.last_page > 1 && (
            <Pagination
              className="mt-10"
              page={resourcesQuery.data.current_page}
              pageCount={resourcesQuery.data.last_page}
              onChange={setPage}
            />
          )}
        </div>
      </section>
    </>
  )
}
