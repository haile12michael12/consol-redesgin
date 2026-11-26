import { KeyRound, LogOut, Monitor, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AdminPanel } from '@/components/admin/AdminUI'
import { ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePageMeta } from '@/lib/seo'
import { normaliseError } from '@/services/api'
import { changePassword, listSessions, revokeOtherSessions, revokeSession } from '@/services/authApi'
import { toast } from 'sonner'

export function AdminSecurityPage() {
  const queryClient = useQueryClient()
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const sessions = useQuery({ queryKey: ['auth', 'sessions'], queryFn: async () => (await listSessions()).data })

  usePageMeta({ title: 'Account security', noindex: true })

  const updatePassword = useMutation({
    mutationFn: changePassword,
    onSuccess: async () => {
      setCurrentPassword('')
      setPassword('')
      setConfirmation('')
      setError('')
      await queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] })
      toast.success('Password changed. Other sessions were signed out.')
    },
    onError: (failure) => setError(errorMessage(failure)),
  })

  const removeSession = useMutation({
    mutationFn: revokeSession,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] })
      toast.success('Session signed out.')
    },
    onError: (failure) => setError(errorMessage(failure)),
  })

  const removeOthers = useMutation({
    mutationFn: revokeOtherSessions,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] })
      toast.success('Other sessions signed out.')
    },
    onError: (failure) => setError(errorMessage(failure)),
  })

  async function submitPassword(event) {
    event.preventDefault()
    setError('')
    if (password !== confirmation) {
      setError('The new password confirmation does not match.')
      return
    }
    updatePassword.mutate({
      current_password: currentPassword,
      password,
      password_confirmation: confirmation,
    })
  }

  if (sessions.isPending) return <LoadingState label="Loading account security…" />
  if (sessions.isError) {
    return <ErrorState title="Account security could not be loaded" text={errorMessage(sessions.error)} onRetry={sessions.refetch} />
  }

  const records = sessions.data ?? []

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-navy">Account security</h2>
        <p className="mt-1 text-sm text-muted">Update your password and review signed-in devices.</p>
      </div>

      {error && <p role="alert" className="border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{error}</p>}

      <AdminPanel title="Change password" description="Use a unique password with at least 12 characters. Other active sessions will be revoked.">
        <form onSubmit={submitPassword} className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Current password"><Input required type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></Field>
          <span className="hidden sm:block" />
          <Field label="New password"><Input required type="password" minLength={12} maxLength={255} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /></Field>
          <Field label="Confirm new password"><Input required type="password" minLength={12} maxLength={255} autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></Field>
          <div className="sm:col-span-2"><Button type="submit" disabled={updatePassword.isPending}><KeyRound className="size-4" aria-hidden="true" />{updatePassword.isPending ? 'Updating…' : 'Update password'}</Button></div>
        </form>
      </AdminPanel>

      <AdminPanel
        title="Active sessions"
        description="Sign out devices you no longer use. Your current session cannot be ended here."
        action={records.some((session) => !session.current) && (
          <Button type="button" size="sm" variant="outline" disabled={removeOthers.isPending} onClick={() => {
            if (window.confirm('Sign out all other active sessions?')) removeOthers.mutate()
          }}>
            <LogOut className="size-3.5" aria-hidden="true" />Sign out other sessions
          </Button>
        )}
      >
        {records.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">No active browser sessions were found.</p>
        ) : (
          <ul className="divide-y divide-line">
            {records.map((session) => (
              <li key={session.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div className="flex min-w-0 items-start gap-3">
                  {session.current
                    ? <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                    : <Monitor className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden="true" />}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy">{session.current ? 'This device' : session.userAgent || 'Unknown device'}</p>
                    <p className="mt-1 text-xs text-muted">
                      {session.ipAddress || 'IP unavailable'} · Last active {new Date(session.lastActivity).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <Button type="button" size="sm" variant="outline" disabled={removeSession.isPending} onClick={() => {
                    if (window.confirm('Sign out this session?')) removeSession.mutate(session.id)
                  }}>
                    Sign out
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </AdminPanel>
    </div>
  )
}

function errorMessage(error) {
  const normalized = normaliseError(error)
  return [normalized.message, ...Object.values(normalized.errors ?? {}).flat()].join(' ')
}

function Field({ label, children }) {
  return <label className="block space-y-1.5"><span className="text-xs font-semibold text-navy">{label}</span>{children}</label>
}
