import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FormField, FormGrid } from './FormField'
import { FormError, FormSuccess } from './FormFeedback'
import { SubmitButton } from './SubmitButton'
import { Label } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useT } from '@/i18n/LanguageProvider'
import { consultationSchema } from '@/lib/schemas'
import { contact } from '@/lib/site'
import { services } from '@/data/services'
import { submitConsultation } from '@/services/inquiriesApi'

export function ConsultationForm() {
  const t = useT()
  const [searchParams] = useSearchParams()
  const requestedService = searchParams.get('service')
  const initialService = services.some((item) => item.slug === requestedService) ? requestedService : ''
  const [status, setStatus] = useState('idle')
  const [source, setSource] = useState(null)
  const [serverError, setServerError] = useState(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      name: '',
      organisation: '',
      email: '',
      phone: '',
      service: initialService,
      subject: '',
      message: '',
      preferredContact: 'email',
    },
  })

  const service = watch('service')

  const onSubmit = async (values) => {
    setStatus('pending')
    setServerError(null)
    const result = await submitConsultation({
      ...values,
      source: 'website-consultation',
    })
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
        title={t('consult.form.success')}
        text={t('consult.form.successText')}
        source={source}
        onReset={() => setStatus('idle')}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <FormError title={t('consult.form.error')} text={t('consult.form.errorText')} email={contact.email} />
      )}

      <FormGrid>
        <FormField
          id="consult-name"
          label={t('common.name')}
          required
          autoComplete="name"
          placeholder="e.g. Selam Bekele"
          register={register('name')}
          error={errors.name ? t(errors.name.message) : undefined}
        />
        <FormField
          id="consult-organisation"
          label={t('common.organisation')}
          required
          autoComplete="organization"
          placeholder="Company or institution"
          register={register('organisation')}
          error={errors.organisation ? t(errors.organisation.message) : undefined}
        />
        <FormField
          id="consult-email"
          label={t('common.email')}
          type="email"
          required
          autoComplete="email"
          placeholder="name@organisation.com"
          register={register('email')}
          error={errors.email ? t(errors.email.message) : undefined}
        />
        <FormField
          id="consult-phone"
          label={t('common.phone')}
          type="tel"
          required
          autoComplete="tel"
          placeholder="+251 …"
          register={register('phone')}
          error={errors.phone ? t(errors.phone.message) : undefined}
        />
      </FormGrid>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="consult-service">
            {t('consult.form.service')} <span className="text-gold-deep">*</span>
          </Label>
          <Select
            value={service}
            onValueChange={(value) =>
              setValue('service', value, { shouldValidate: true, shouldDirty: true })
            }
          >
            <SelectTrigger id="consult-service" invalid={Boolean(errors.service)} aria-describedby={errors.service ? 'consult-service-error' : undefined}>
              <SelectValue placeholder={t('consult.form.servicePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {services.map((item) => (
                <SelectItem key={item.slug} value={item.slug}>
                  {t(item.titleKey)}
                </SelectItem>
              ))}
              <SelectItem value="training">{t('service.training.shortTitle')}</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <input type="hidden" {...register('service')} />
          {errors.service && (
            <p id="consult-service-error" className="field-error" role="alert">
              {t(errors.service.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="consult-preferred">{t('consult.form.preferred')}</Label>
          <Select
            defaultValue="email"
            onValueChange={(value) => setValue('preferredContact', value)}
          >
            <SelectTrigger id="consult-preferred">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">{t('consult.form.preferredEmail')}</SelectItem>
              <SelectItem value="phone">{t('consult.form.preferredPhone')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <FormField
        id="consult-subject"
        label={t('common.subject')}
        required
        placeholder={t('contact.form.subjectPlaceholder')}
        register={register('subject')}
        error={errors.subject ? t(errors.subject.message) : undefined}
      />

      <FormField
        id="consult-message"
        label={t('common.message')}
        required
        textarea
        rows={5}
        placeholder={t('contact.form.messagePlaceholder')}
        register={register('message')}
        error={errors.message ? t(errors.message.message) : undefined}
      />

      <SubmitButton pending={status === 'pending'} pendingLabel={t('common.sending')} variant="primary" size="lg">
        {t('nav.requestConsultation')}
        <ArrowRight className="size-4" aria-hidden="true" />
      </SubmitButton>
    </form>
  )
}
