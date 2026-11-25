import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { normaliseError } from '@/services/api'
import { trainingAdminApi } from '@/services/trainingAdminApi'
import { usePageMeta } from '@/lib/seo'
import { useState } from 'react'

export function CertificatesAdminPage() {
  const queryClient = useQueryClient()
  const [error, setError] = useState('')
  const certificatesQuery = useQuery({
    queryKey: ['admin-training', 'certificates'],
    queryFn: () => trainingAdminApi.certificates({ per_page: 50 }),
  })
  const registrationsQuery = useQuery({
    queryKey: ['admin-training', 'registrations', 'certificate-eligible'],
    queryFn: () => trainingAdminApi.registrations({ per_page: 100 }),
  })

  usePageMeta({ title: 'Training certificates', noindex: true })

  const run = async (action) => {
    setError('')
    try {
      await action()
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-training', 'certificates'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-training', 'registrations'] }),
      ])
    } catch (requestError) {
      setError(normaliseError(requestError).message)
    }
  }

  if (certificatesQuery.isPending || registrationsQuery.isPending) return <LoadingState label="Loading certificate records…" />
  if (certificatesQuery.isError || registrationsQuery.isError) {
    const query = certificatesQuery.isError ? certificatesQuery : registrationsQuery
    return <ErrorState title="Certificate records could not be loaded" text={normaliseError(query.error).message} onRetry={() => {
      certificatesQuery.refetch()
      registrationsQuery.refetch()
    }} />
  }

  const certificates = certificatesQuery.data?.data ?? []
  const candidates = (registrationsQuery.data?.data ?? []).filter((item) =>
    item.course.certificateSupported && item.attendance?.status === 'attended' && !item.certificateIssued,
  )

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-navy">Training certificates</h2>
        <p className="mt-1 text-sm text-muted">Certificates can be issued only for courses configured to support them and registrations recorded as attended.</p>
      </div>
      {error && <p role="alert" className="border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>}

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-navy">Eligible registrations</h3>
        {candidates.length === 0 ? <p className="border border-dashed border-line p-6 text-sm text-muted">There are no attended registrations eligible for certificate issuing.</p> : (
          <div className="divide-y divide-line border border-line bg-white">
            {candidates.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div><p className="font-semibold text-navy">{item.fullName}</p><p className="text-sm text-muted">{item.course.title} · {item.reference}</p></div>
              <Button size="sm" onClick={() => run(() => trainingAdminApi.issueCertificate(item.id))}>Issue certificate</Button>
            </div>)}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-navy">Issued certificates</h3>
          <Button asChild size="sm" variant="outline"><Link to="/verify-certificate">Public verification page</Link></Button>
        </div>
        {certificates.length === 0 ? <p className="border border-dashed border-line p-6 text-sm text-muted">No certificates have been issued.</p> : (
          <div className="overflow-x-auto border border-line bg-white">
            <table className="w-full min-w-[46rem] text-left text-sm">
              <thead className="bg-canvas text-xs uppercase text-muted"><tr><th className="p-3">Recipient</th><th className="p-3">Course</th><th className="p-3">Verification code</th><th className="p-3">Issued</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
              <tbody className="divide-y divide-line">
                {certificates.map((certificate) => <tr key={certificate.id}>
                  <td className="p-3 font-medium text-navy">{certificate.recipientName}</td>
                  <td className="p-3">{certificate.course.title}</td>
                  <td className="p-3 font-mono text-xs">{certificate.verificationCode}</td>
                  <td className="p-3 text-xs text-muted">{certificate.issuedAt ? new Date(certificate.issuedAt).toLocaleDateString() : '—'}</td>
                  <td className="p-3">{certificate.valid ? 'Valid' : 'Revoked'}</td>
                  <td className="p-3">{certificate.valid && <Button size="sm" variant="ghost" onClick={() => run(() => trainingAdminApi.revokeCertificate(certificate.id))}>Revoke</Button>}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
