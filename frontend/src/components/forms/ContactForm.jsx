import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Send } from 'lucide-react'
import { FormField, FormGrid } from './FormField'
import { FormError, FormSuccess } from './FormFeedback'
import { SubmitButton } from './SubmitButton'
import { useT } from '@/i18n/LanguageProvider'
import { contactSchema } from '@/lib/schemas'
import { contact } from '@/lib/site'
import { submitInquiry } from '@/services/inquiriesApi'

export function ContactForm() {
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
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', organization: '', subject: '', message: '', consent: false, website: '' },
  })

  const onSubmit = async (values) => {
    setStatus('pending')
    setServerError(null)
    const result = await submitInquiry(values)
    if (result.ok) {
      setSource(result.source)
      setStatus('success')
      reset()
    } else {
      setServerError(result.error)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <FormSuccess
        title={t('contact.form.success')}
        text={t('contact.form.successText')}
        source={source}
        onReset={() => setStatus('idle')}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <FormError title={t('contact.form.error')} text={t('contact.form.errorText')} email={contact.email} />
      )}

      <FormGrid>
        <FormField
          id="contact-name"
          label={t('common.name')}
          required
          autoComplete="name"
          register={register('name')}
          error={errors.name ? t(errors.name.message) : undefined}
        />
        <FormField
          id="contact-email"
          label={t('common.email')}
          type="email"
          required
          autoComplete="email"
          register={register('email')}
          error={errors.email ? t(errors.email.message) : undefined}
        />
        <FormField
          id="contact-phone"
          label={t('common.phone')}
          type="tel"
          autoComplete="tel"
          hint={t('common.optional')}
          register={register('phone')}
          error={errors.phone ? t(errors.phone.message) : undefined}
        />
        <FormField
          id="contact-organization"
          label={t('common.organisation')}
          autoComplete="organization"
          hint={t('common.optional')}
          register={register('organization')}
          error={errors.organization ? t(errors.organization.message) : undefined}
        />
        <FormField
          id="contact-subject"
          label={t('common.subject')}
          required
          placeholder={t('contact.form.subjectPlaceholder')}
          register={register('subject')}
          error={errors.subject ? t(errors.subject.message) : undefined}
        />
      </FormGrid>

      <FormField
        id="contact-message"
        label={t('common.message')}
        required
        textarea
        rows={6}
        placeholder={t('contact.form.messagePlaceholder')}
        register={register('message')}
        error={errors.message ? t(errors.message.message) : undefined}
      />

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-10000px] h-px w-px overflow-hidden"
        {...register('website')}
      />

      <div className="space-y-2">
        <label htmlFor="contact-consent" className="flex cursor-pointer items-start gap-3">
          <input
            id="contact-consent"
            type="checkbox"
            className="mt-1 size-4 shrink-0 rounded-[2px] border-line-strong accent-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? 'contact-consent-error' : undefined}
            {...register('consent')}
          />
          <span className="text-[0.8125rem] leading-relaxed text-muted">{t('contact.form.consent')}</span>
        </label>
        {errors.consent && (
          <p id="contact-consent-error" className="field-error" role="alert">
            {t(errors.consent.message)}
          </p>
        )}
      </div>

      <SubmitButton pending={status === 'pending'} pendingLabel={t('common.sending')} size="lg">
        {t('common.send')}
        <Send className="size-4" aria-hidden="true" />
      </SubmitButton>
    </form>
  )
}
