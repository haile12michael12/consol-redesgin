import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FormField, FormGrid } from './FormField'
import { FormError, FormSuccess } from './FormFeedback'
import { SubmitButton } from './SubmitButton'
import { Label } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useT } from '@/i18n/LanguageProvider'
import { useServices } from '@/hooks/useServices'
import { consultationSchema } from '@/lib/schemas'
import { contact } from '@/lib/site'
import { submitConsultation } from '@/services/inquiriesApi'

export function ConsultationForm() {
  const t = useT()
  const [searchParams] = useSearchParams()
  const { data: publishedServices, error: servicesError, isLoading: servicesLoading } = useServices()
  const services = useMemo(() => publishedServices ?? [], [publishedServices])
  const requestedService = searchParams.get('service')
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
      organization: '',
      email: '',
      phone: '',
      serviceOfInterest: '',
      projectDescription: '',
      preferredContactMethod: 'email',
      website: '',
    },
  })

  const service = watch('serviceOfInterest')

  useEffect(() => {
    if (!service && services.some((item) => item.slug === requestedService)) {
      setValue('serviceOfInterest', requestedService, { shouldValidate: false })
    }
  }, [requestedService, service, services, setValue])

  const onSubmit = async (values) => {
    setStatus('pending')
    setServerError(null)
    const result = await submitConsultation({
      name: values.name,
      email: values.email,
      phone: values.phone,
      organization: values.organization,
      service_of_interest: values.serviceOfInterest,
      project_description: values.projectDescription,
      preferred_contact_method: values.preferredContactMethod,
      website: values.website,
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
          id="consult-organization"
          label={t('common.organisation')}
          required
          autoComplete="organization"
          placeholder="Company or institution"
          register={register('organization')}
          error={errors.organization ? t(errors.organization.message) : undefined}
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
              setValue('serviceOfInterest', value, { shouldValidate: true, shouldDirty: true })
            }
          >
            <SelectTrigger
              id="consult-service"
              invalid={Boolean(errors.serviceOfInterest)}
              aria-describedby={errors.serviceOfInterest ? 'consult-service-error' : undefined}
            >
              <SelectValue placeholder={t('consult.form.servicePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {services.map((item) => (
                <SelectItem key={item.slug} value={item.slug}>
                  {item.title}
                </SelectItem>
              ))}
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {servicesLoading && (
            <p className="text-xs text-muted" role="status">{t('consult.form.servicesLoading')}</p>
          )}
          {servicesError && (
            <p className="text-xs text-danger" role="status">{t('consult.form.servicesError')}</p>
          )}
          <input type="hidden" {...register('serviceOfInterest')} />
          {errors.serviceOfInterest && (
            <p id="consult-service-error" className="field-error" role="alert">
              {t(errors.serviceOfInterest.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="consult-preferred">{t('consult.form.preferred')}</Label>
          <Select
            value={watch('preferredContactMethod')}
            onValueChange={(value) => setValue('preferredContactMethod', value)}
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
        id="consult-project-description"
        label={t('consult.form.description')}
        required
        textarea
        rows={5}
        placeholder={t('contact.form.messagePlaceholder')}
        register={register('projectDescription')}
        error={errors.projectDescription ? t(errors.projectDescription.message) : undefined}
      />

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-10000px] h-px w-px overflow-hidden"
        {...register('website')}
      />

      <SubmitButton pending={status === 'pending'} pendingLabel={t('common.sending')} variant="primary" size="lg">
        {t('nav.requestConsultation')}
        <ArrowRight className="size-4" aria-hidden="true" />
      </SubmitButton>
    </form>
  )
}
