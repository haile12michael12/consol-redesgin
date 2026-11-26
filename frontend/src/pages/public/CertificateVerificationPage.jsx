import { useState } from 'react'
import { BadgeCheck, Search } from 'lucide-react'
import { usePageMeta } from '@/lib/seo'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/common/StateBlocks'
import { FormError } from '@/components/forms/FormFeedback'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { normaliseError } from '@/services/api'
import { verifyCertificate } from '@/services/coursesApi'

export function CertificateVerificationPage() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [pending, setPending] = useState(false)

  usePageMeta({
    title: 'Certificate verification',
    description: 'Verify a CONSOL certificate using its verification code.',
    noindex: true,
  })

  const onSubmit = async (event) => {
    event.preventDefault()
    setPending(true)
    setError(null)
    setResult(null)
    try {
      setResult(await verifyCertificate(code.trim()))
    } catch (requestError) {
      setError(normaliseError(requestError).message)
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="section bg-canvas">
      <div className="shell max-w-2xl">
        <div className="border border-line bg-white p-7 sm:p-10">
          <p className="eyebrow">Training records</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-navy">Certificate verification</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Enter the verification code printed on a certificate. Only certificates actually issued and not revoked by CONSOL can be verified.
          </p>
          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <Field label="Verification code" htmlFor="verification-code" required>
              {(aria) => (
                <Input
                  {...aria}
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  autoComplete="off"
                  maxLength={40}
                  required
                />
              )}
            </Field>
            <Button type="submit" variant="primary" disabled={pending || !code.trim()}>
              <Search className="size-4" />
              {pending ? 'Checking…' : 'Verify certificate'}
            </Button>
          </form>

          {error && <FormError className="mt-6" title="Verification could not be completed" text={error} />}
          {result && !result.valid && (
            <ErrorState className="mt-6" title="No valid certificate found" text="Check the code and try again. A revoked or unissued certificate will not verify." />
          )}
          {result?.valid && (
            <div className="mt-7 border border-success/30 bg-success/5 p-6" role="status">
              <BadgeCheck className="size-7 text-success" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-semibold text-navy">Certificate verified</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div><dt className="text-muted">Recipient</dt><dd className="font-semibold text-navy">{result.recipientName}</dd></div>
                <div><dt className="text-muted">Course</dt><dd className="font-semibold text-navy">{result.courseTitle}</dd></div>
                <div><dt className="text-muted">Issued</dt><dd className="font-semibold text-navy">{new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date(result.issuedAt))}</dd></div>
                <div><dt className="text-muted">Verification code</dt><dd className="break-all font-mono font-semibold text-navy">{result.verificationCode}</dd></div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
