import { ArrowLeft, KeyRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePageMeta } from '@/lib/seo'
import { normaliseError } from '@/services/api'
import { getCsrfCookie, requestPasswordReset, resetPassword } from '@/services/authApi'

export function AdminPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  usePageMeta({ title: token ? 'Reset staff password' : 'Forgot staff password', noindex: true })

  async function submit(event) {
    event.preventDefault()
    setPending(true)
    setError('')
    setMessage('')

    try {
      if (token) {
        await getCsrfCookie()
        await resetPassword({
          email: email.trim(),
          token,
          password,
          password_confirmation: passwordConfirmation,
        })
        setMessage('Password reset. You can now sign in with your new password.')
        window.setTimeout(() => navigate('/admin/login', { replace: true }), 1200)
      } else {
        await getCsrfCookie()
        await requestPasswordReset(email.trim())
        setMessage('If an account exists for that address, password reset instructions will be emailed.')
      }
    } catch (requestError) {
      const normalized = normaliseError(requestError)
      setError([normalized.message, ...Object.values(normalized.errors ?? {}).flat()].join(' '))
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-4 py-10">
      <section className="w-full max-w-md border border-line bg-white p-6 sm:p-8">
        <span className="grid size-11 place-items-center border border-line bg-canvas">
          <KeyRound className="size-4 text-gold-deep" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold text-navy">
          {token ? 'Set a new password' : 'Reset your password'}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {token
            ? 'Choose a new password with at least 12 characters.'
            : 'We will email reset instructions if this address belongs to an eligible staff account.'}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Work email">
            <Input required type="email" autoComplete="email" maxLength={255} value={email} onChange={(event) => setEmail(event.target.value)} />
          </Field>
          {token && (
            <>
              <Field label="New password">
                <Input required type="password" autoComplete="new-password" minLength={12} maxLength={255} value={password} onChange={(event) => setPassword(event.target.value)} />
              </Field>
              <Field label="Confirm new password">
                <Input required type="password" autoComplete="new-password" minLength={12} maxLength={255} value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} />
              </Field>
            </>
          )}
          {error && <p role="alert" className="border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>}
          {message && <p role="status" className="border border-success/30 bg-success/5 p-3 text-sm text-navy">{message}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Please wait…' : token ? 'Reset password' : 'Email reset instructions'}
          </Button>
        </form>

        <Link to="/admin/login" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-deep underline">
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to sign in
        </Link>
      </section>
    </main>
  )
}

function Field({ label, children }) {
  return <label className="block space-y-1.5"><span className="text-xs font-semibold text-navy">{label}</span>{children}</label>
}
