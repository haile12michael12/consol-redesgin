import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { LoadingState, ErrorState, EmptyState } from '@/components/common/StateBlocks'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { me } from '@/services/authApi'
import { normaliseError } from '@/services/api'
import { contentTranslationsApi, contentTranslationsQuery } from '@/services/contentTranslationsApi'

const types = ['news', 'services', 'projects', 'training']
const emptyFields = []

function isAdministrator(user) {
  return user?.is_admin || user?.roles?.some((role) => ['administrator', 'super_admin'].includes(role.name))
}

function editableValues(record, fields) {
  const saved = { ...(record?.publishedFields ?? {}), ...(record?.fields ?? {}) }
  return Object.fromEntries(fields.map(({ key, input }) => {
    const value = saved[key]
    return [key, input === 'json' ? (value == null ? '' : JSON.stringify(value, null, 2)) : (value ?? '')]
  }))
}

export function TranslationsAdminPage() {
  const t = useT()
  usePageMeta({ title: t('translations.title'), noindex: true })
  const queryClient = useQueryClient()
  const [type, setType] = useState('news')
  const [recordId, setRecordId] = useState('')
  const [values, setValues] = useState({})
  const [parseError, setParseError] = useState('')

  const recordsQuery = useQuery({
    queryKey: contentTranslationsQuery.list(type),
    queryFn: async () => (await contentTranslationsApi.list(type)).data,
  })
  const authQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => (await me()).data.user,
    retry: false,
  })

  const records = recordsQuery.data?.items ?? []
  const selected = records.find((record) => String(record.id) === recordId) ?? records[0]
  const fields = recordsQuery.data?.fields ?? emptyFields
  const user = authQuery.data
  const permissions = new Set(user?.roles?.flatMap((role) => role.permissions.map((permission) => permission.name)) ?? [])
  const canEdit = isAdministrator(user) || permissions.has('translations.manage')
  const canApprove = isAdministrator(user) || permissions.has('translations.approve')

  useEffect(() => {
    setValues(editableValues(selected, fields))
    setParseError('')
  }, [selected, fields])

  const saveMutation = useMutation({
    mutationFn: (payload) => contentTranslationsApi.save(type, selected.id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contentTranslationsQuery.list(type) }),
  })
  const approveMutation = useMutation({
    mutationFn: () => contentTranslationsApi.approve(type, selected.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: contentTranslationsQuery.list(type) }),
  })

  const requestError = saveMutation.isError
    ? normaliseError(saveMutation.error).message
    : approveMutation.isError
      ? normaliseError(approveMutation.error).message
      : ''

  const statusLabel = useMemo(() => {
    const status = selected?.status ?? 'missing'
    return t(`translations.status.${status}`)
  }, [selected, t])

  function submit(status) {
    setParseError('')
    let fieldsPayload
    try {
      fieldsPayload = Object.fromEntries(fields.map(({ key, input }) => {
        if (input !== 'json') return [key, values[key] ?? '']
        const raw = values[key]?.trim()
        if (!raw) return [key, []]
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) throw new Error(t('translations.jsonArrayError'))
        return [key, parsed]
      }))
    } catch (error) {
      setParseError(error.message)
      return
    }

    saveMutation.mutate({ fields: fieldsPayload, status })
  }

  if (recordsQuery.isPending || authQuery.isPending) {
    return <LoadingState className="py-16" label={t('translations.loading')} />
  }

  if (recordsQuery.isError) {
    return (
      <ErrorState
        title={t('translations.loadError')}
        text={normaliseError(recordsQuery.error).message}
        onRetry={() => recordsQuery.refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">{t('admin.title')}</p>
        <h2 className="mt-2 text-2xl font-semibold text-navy">{t('translations.title')}</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted">{t('translations.intro')}</p>
      </div>

      <div className="grid gap-4 border border-line bg-white p-5 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="block text-xs font-semibold text-navy">{t('translations.contentType')}</span>
          <select
            className="h-11 w-full rounded-sm border border-input bg-white px-3 text-sm text-ink"
            value={type}
            onChange={(event) => {
              setType(event.target.value)
              setRecordId('')
            }}
          >
            {types.map((item) => <option key={item} value={item}>{t(`translations.type.${item}`)}</option>)}
          </select>
        </label>

        <label className="space-y-2">
          <span className="block text-xs font-semibold text-navy">{t('translations.contentItem')}</span>
          <select
            className="h-11 w-full rounded-sm border border-input bg-white px-3 text-sm text-ink"
            value={selected ? String(selected.id) : ''}
            onChange={(event) => setRecordId(event.target.value)}
            disabled={!records.length}
          >
            {records.map((record) => (
              <option key={record.id} value={record.id}>{record.title} ({record.slug})</option>
            ))}
          </select>
        </label>
      </div>

      {!selected ? (
        <EmptyState title={t('translations.emptyTitle')} text={t('translations.emptyText')} />
      ) : (
        <section className="space-y-5 border border-line bg-white p-5 sm:p-7" aria-label={t('translations.editor')}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <h3 className="font-semibold text-navy">{selected.title}</h3>
              <p className="mt-1 text-xs text-muted">{selected.slug}</p>
            </div>
            <span className="inline-flex items-center border border-line px-3 py-1 text-xs font-semibold text-navy">
              {statusLabel}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-muted">{t('translations.approvalNotice')}</p>

          {fields.map(({ key, label, input }) => {
            const source = selected.sourceFields?.[key]
            const isTextarea = input !== 'text'
            return (
              <div key={key} className="space-y-2">
                <label htmlFor={`translation-${key}`} className="block text-xs font-semibold text-navy" lang="am">
                  {label}
                </label>
                <details className="border border-line bg-canvas/60 px-3 py-2">
                  <summary className="cursor-pointer text-xs font-semibold text-muted">{t('translations.englishSource')}</summary>
                  <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-ink" lang="en" dir="ltr">
                    {Array.isArray(source) ? JSON.stringify(source, null, 2) : source ?? ''}
                  </pre>
                </details>
                {isTextarea ? (
                  <Textarea
                    id={`translation-${key}`}
                    rows={input === 'json' ? 8 : 5}
                    value={values[key] ?? ''}
                    onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
                    disabled={!canEdit}
                    lang="am"
                    dir="ltr"
                    aria-label={`${label} — አማርኛ`}
                    placeholder={input === 'json' ? t('translations.jsonPlaceholder') : ''}
                  />
                ) : (
                  <Input
                    id={`translation-${key}`}
                    value={values[key] ?? ''}
                    onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
                    disabled={!canEdit}
                    lang="am"
                    dir="ltr"
                    aria-label={`${label} — አማርኛ`}
                  />
                )}
              </div>
            )
          })}

          {parseError && <p role="alert" className="text-sm text-danger">{parseError}</p>}
          {requestError && <p role="alert" className="text-sm text-danger">{requestError}</p>}

          <div className="flex flex-wrap gap-3 border-t border-line pt-5">
            {canEdit && (
              <>
                <Button type="button" variant="outline" disabled={saveMutation.isPending || approveMutation.isPending} onClick={() => submit('draft')}>
                  {t('translations.saveDraft')}
                </Button>
                <Button type="button" disabled={saveMutation.isPending || approveMutation.isPending} onClick={() => submit('pending_review')}>
                  {t('translations.submitReview')}
                </Button>
              </>
            )}
            {canApprove && selected.status === 'pending_review' && (
              <Button
                type="button"
                variant="gold"
                disabled={saveMutation.isPending || approveMutation.isPending}
                onClick={() => approveMutation.mutate()}
              >
                {t('translations.approve')}
              </Button>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
