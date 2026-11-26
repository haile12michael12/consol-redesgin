import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Lock } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { FormField } from '@/components/forms/FormField'
import { SubmitButton } from '@/components/forms/SubmitButton'
import { AlertCircle } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageProvider'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { usePageMeta } from '@/lib/seo'
import { loginSchema } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { getCsrfCookie, login } from '@/services/authApi'

export function AdminLoginPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [status, setStatus] = useState('idle')

  usePageMeta({ title: 'Staff sign in', description: 'CONSOL administration.', noindex: true })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  /** Sign in through Laravel's CSRF-protected Sanctum session flow. */
  const onSubmit = async (credentials) => {
    setStatus('pending')
    try {
      await getCsrfCookie()
      await login(credentials)
      navigate('/admin/dashboard')
    } catch (error) {
      setStatus(error?.response?.data?.message ?? 'Sign in failed. Check your credentials and administrator access.')
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-navy lg:block">
        <img
          src="/media/hero-construction.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/90 to-navy/70" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo invert />
          <div>
            <p className="eyebrow eyebrow-invert">CONSOL Administration</p>
            <h1 className="mt-5 max-w-md text-[clamp(2rem,3vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-white">
              Manage the website, programmes and inbound enquiries.
            </h1>
            <p className="mt-5 max-w-sm text-[0.875rem] leading-relaxed text-white/55">
              Administrator access is restricted to authorised CONSOL staff through Laravel session authentication.
            </p>
          </div>
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white/55">
            Construction Solutions PLC · Addis Ababa
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col bg-white">
        <div className="flex items-center justify-between border-b border-line px-5 py-4 lg:justify-end lg:border-0">
          <div className="lg:hidden">
            <Logo compact />
          </div>
          <LanguageSwitcher compact />
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10">
          <div className="w-full max-w-sm">
            <span className="grid size-11 place-items-center border border-line bg-canvas">
              <Lock className="size-4 text-gold-deep" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-[1.6rem] font-semibold tracking-[-0.025em] text-navy">
              {t('admin.login.title')}
            </h2>
            <p className="mt-1.5 text-[0.875rem] text-muted">{t('admin.login.subtitle')}</p>

            <div className="mt-6 flex items-start gap-2.5 border border-gold/50 bg-gold/10 px-3.5 py-3">
              <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-gold-deep" aria-hidden="true" />
              <p className="text-[0.6875rem] leading-relaxed text-navy">
                Use your authorised CONSOL administrator account. Demo credentials are not accepted.
              </p>
            </div>
            {status !== 'idle' && status !== 'pending' && (
              <p role="alert" className="mt-4 border border-danger/30 bg-danger/5 px-3.5 py-3 text-[0.75rem] text-ink">
                {status}
              </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
              <FormField
                id="admin-email"
                label={t('admin.login.email')}
                type="email"
                required
                autoComplete="username"
                placeholder="name@constructionsolutionsplc.com"
                register={register('email')}
                error={errors.email ? t(errors.email.message) : undefined}
              />
              <FormField
                id="admin-password"
                label={t('admin.login.password')}
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                register={register('password')}
                error={errors.password ? t(errors.password.message) : undefined}
              />
              <SubmitButton
                pending={status === 'pending'}
                pendingLabel={t('common.loading')}
                className="w-full"
                size="lg"
              >
                {t('admin.login.submit')}
              </SubmitButton>
            </form>

            <p className="mt-4 text-[0.6875rem] leading-relaxed text-muted">{t('admin.login.notice')}</p>

            <Link to="/admin/forgot-password" className="mt-4 inline-flex text-sm font-medium text-gold-deep underline">
              Forgot your password?
            </Link>

            <div className="mt-8 border-t border-line pt-5">
              <Button asChild variant="link" size="sm" className="h-auto p-0">
                <Link to="/">
                  <ArrowLeft className="size-3.5" aria-hidden="true" />
                  {t('admin.login.back')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
