import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FormField, FormGrid } from './FormField'
import { FormError } from './FormFeedback'
import { SubmitButton } from './SubmitButton'
import { useT } from '@/i18n/LanguageProvider'
import { registrationSchema } from '@/lib/schemas'
import { normaliseError } from '@/services/api'
import { submitRegistration } from '@/services/coursesApi'
import { Field } from '@/components/ui/field'

export function RegistrationForm({ course }) {
  const t = useT()
  const navigate = useNavigate()
  const [status, setStatus] = useState('idle')
  const [serverError, setServerError] = useState(null)
  const schedules = course.schedules?.filter((schedule) => schedule.registrationOpen) ?? []

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      organization: '',
      course_schedule_id: '',
      preferred_schedule: '',
      additional_information: '',
      consent: false,
    },
  })

  const onSubmit = async (values) => {
    setStatus('pending')
    setServerError(null)
    try {
      const registration = await submitRegistration({
        ...values,
        course_id: course.id,
        course_schedule_id: values.course_schedule_id ? Number(values.course_schedule_id) : null,
      })
      navigate(`/training/registration-confirmation/${registration.reference}`, { replace: true })
    } catch (error) {
      const normalised = normaliseError(error)
      const validationMessage = Object.values(normalised.errors ?? {}).flat()[0]
      setServerError(validationMessage || normalised.message)
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && <FormError title={t('common.error')} text={serverError} />}

      <FormGrid>
        <FormField
          id="reg-name"
          label={t('common.name')}
          required
          autoComplete="name"
          register={register('full_name')}
          error={errors.full_name ? t(errors.full_name.message) : undefined}
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
          id="reg-organization"
          label={t('common.organisation')}
          hint={t('common.optional')}
          autoComplete="organization"
          register={register('organization')}
          error={errors.organization ? t(errors.organization.message) : undefined}
        />
      </FormGrid>

      {schedules.length > 0 && (
        <Field label="Preferred confirmed schedule" htmlFor="reg-schedule" error={errors.course_schedule_id?.message}>
          {(aria) => (
            <select
              id="reg-schedule"
              className="h-11 w-full rounded-sm border border-input bg-white px-3.5 text-sm text-ink outline-none focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/25 aria-[invalid=true]:border-danger"
              {...aria}
              {...register('course_schedule_id')}
            >
              <option value="">Choose an available schedule</option>
              {schedules.map((schedule) => (
                <option key={schedule.id} value={schedule.id}>
                  {schedule.label} — {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(schedule.startsAt))}
                </option>
              ))}
            </select>
          )}
        </Field>
      )}

      <FormField
        id="reg-preferred-schedule"
        label={schedules.length ? 'Other timing preferences' : 'Preferred schedule'}
        hint={t('common.optional')}
        register={register('preferred_schedule')}
        error={errors.preferred_schedule ? t(errors.preferred_schedule.message) : undefined}
      />

      <FormField
        id="reg-notes"
        label="Additional information"
        hint={t('common.optional')}
        textarea
        rows={3}
        register={register('additional_information')}
        error={errors.additional_information ? t(errors.additional_information.message) : undefined}
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
        Submitting a registration is a request, not a confirmed place. CONSOL will review it and contact you about the next steps.
      </p>
    </form>
  )
}
