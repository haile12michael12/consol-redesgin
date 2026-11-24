import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowRight } from 'lucide-react'
import { FormField, FormGrid } from './FormField'
import { FormError, FormSuccess } from './FormFeedback'
import { SubmitButton } from './SubmitButton'
import { useT } from '@/i18n/LanguageProvider'
import { registrationSchema } from '@/lib/schemas'
import { contact } from '@/lib/site'
import { submitRegistration } from '@/services/coursesApi'

/**
 * Course registration interest.
 * Posts to POST /api/registrations when Laravel is connected. In demo mode the
 * workflow completes locally and says so explicitly.
 */
export function RegistrationForm({ course }) {
  const t = useT()
  const [status, setStatus] = useState('idle')
  const [source, setSource] = useState(null)
  const [serverError, setServerError] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      organisation: '',
      role: '',
      city: '',
      cohort: '',
      notes: '',
      consent: false,
    },
  })

  const onSubmit = async (values) => {
    setStatus('pending')
    setServerError(null)
    try {
      await submitRegistration({ ...values, course_id: course.id, course_title: course.title })
      setSource('api')
      setStatus('success')
      reset()
    } catch {
      const demo = import.meta.env.VITE_ENABLE_DEMO_DATA === 'true'
      if (demo) {
        await new Promise((resolve) => {
          window.setTimeout(resolve, 650)
        })
        setSource('demo')
        setStatus('success')
        reset()
      } else {
        setServerError(true)
        setStatus('error')
      }
    }
  }

  if (status === 'success') {
    return (
      <FormSuccess
        title={t('training.register.success')}
        text={t('training.register.successText')}
        source={source}
        onReset={() => setStatus('idle')}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <FormError title={t('common.error')} text={t('common.errorText')} email={contact.email} />
      )}

      <FormGrid>
        <FormField
          id="reg-name"
          label={t('common.name')}
          required
          autoComplete="name"
          register={register('name')}
          error={errors.name ? t(errors.name.message) : undefined}
        />
        <FormField
          id="reg-email"
          label={t('common.email')}
          type="email"
          required
          autoComplete="email"
          register={register('email')}
          error={errors.email ? t(errors.email.message) : undefined}
        />
        <FormField
          id="reg-phone"
          label={t('common.phone')}
          type="tel"
          required
          autoComplete="tel"
          placeholder="+251 …"
          register={register('phone')}
          error={errors.phone ? t(errors.phone.message) : undefined}
        />
        <FormField
          id="reg-organisation"
          label={t('common.organisation')}
          hint={t('common.optional')}
          autoComplete="organization"
          register={register('organisation')}
          error={errors.organisation ? t(errors.organisation.message) : undefined}
        />
        <FormField
          id="reg-role"
          label="Job title"
          hint={t('common.optional')}
          register={register('role')}
          error={errors.role ? t(errors.role.message) : undefined}
        />
        <FormField
          id="reg-city"
          label="City"
          hint={t('common.optional')}
          register={register('city')}
          error={errors.city ? t(errors.city.message) : undefined}
        />
      </FormGrid>

      <FormField
        id="reg-notes"
        label="Anything we should know"
        hint={t('common.optional')}
        textarea
        rows={3}
        placeholder="Preferred timing, in-company delivery, group booking…"
        register={register('notes')}
        error={errors.notes ? t(errors.notes.message) : undefined}
      />

      <div className="border border-line bg-canvas/60 px-4 py-3">
        <p className="text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-muted">Course selected</p>
        <p className="mt-1 text-[0.875rem] font-semibold text-navy">{course.title}</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="reg-consent" className="flex cursor-pointer items-start gap-3">
          <input
            id="reg-consent"
            type="checkbox"
            className="mt-1 size-4 shrink-0 rounded-[2px] border-line-strong accent-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? 'reg-consent-error' : undefined}
            {...register('consent')}
          />
          <span className="text-[0.8125rem] leading-relaxed text-muted">{t('contact.form.consent')}</span>
        </label>
        {errors.consent && (
          <p id="reg-consent-error" className="field-error" role="alert">
            {t(errors.consent.message)}
          </p>
        )}
      </div>

      <SubmitButton pending={status === 'pending'} pendingLabel={t('common.sending')} size="lg" variant="primary">
        {t('training.registerCta')}
        <ArrowRight className="size-4" aria-hidden="true" />
      </SubmitButton>

      <p className="text-[0.6875rem] leading-relaxed text-muted">
        This is a registration <strong className="font-semibold text-navy">interest</strong>, not a confirmed place.
        CONSOL confirms the next intake, venue and fee directly. No fee is charged through this website.
      </p>
    </form>
  )
}
