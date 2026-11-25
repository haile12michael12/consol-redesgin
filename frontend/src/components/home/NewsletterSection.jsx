import { CheckCircle2, Loader2, Mail, Send } from 'lucide-react'
import { useState } from 'react'
import { Reveal } from '@/components/common/Reveal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useT } from '@/i18n/LanguageProvider'

export function NewsletterSection() {
  const t = useT()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('')
  const [interests, setInterests] = useState({
    training: true,
    consulting: true,
    research: false,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }

    setStatus('submitting')
    // Simulate brief network submission with accessible state change
    setTimeout(() => {
      setStatus('success')
    }, 700)
  }

  return (
    <section className="border-t border-line bg-navy-900 py-16 text-white sm:py-20" aria-labelledby="newsletter-heading">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.3fr] lg:items-center lg:gap-16">
          <Reveal>
            <p className="eyebrow eyebrow-invert">{t('home.newsletter.eyebrow')}</p>
            <h2
              id="newsletter-heading"
              className="mt-4 text-[clamp(1.85rem,3.2vw,2.65rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-white"
            >
              {t('home.newsletter.title')}
            </h2>
            <p className="mt-4 max-w-xl text-[0.9375rem] leading-[1.8] text-white/60">
              {t('home.newsletter.lead')}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border border-white/12 bg-white/[0.03] p-7 backdrop-blur-sm sm:p-9">
              {status === 'success' ? (
                <div className="flex flex-col items-start gap-4 py-4" role="status">
                  <div className="flex size-12 items-center justify-center bg-gold/20 text-gold">
                    <CheckCircle2 className="size-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{t('home.newsletter.success')}</h3>
                    <p className="mt-2 text-[0.8125rem] text-white/65">
                      We have noted your interest. You will receive executive briefings and announcements from CONSOL.
                    </p>
                  </div>
                  <Button
                    variant="outline-invert"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setStatus('idle')
                      setEmail('')
                    }}
                  >
                    Subscribe another email
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <label htmlFor="newsletter-email" className="sr-only">
                        {t('common.email')}
                      </label>
                      <Input
                        id="newsletter-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('home.newsletter.emailPlaceholder')}
                        required
                        className="h-12 border-white/20 bg-white/10 text-white placeholder:text-white/45 focus-visible:border-gold focus-visible:ring-gold"
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="gold"
                      size="lg"
                      disabled={status === 'submitting'}
                      className="h-12 shrink-0 px-6 font-semibold"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                          <span>{t('home.newsletter.subscribing')}</span>
                        </>
                      ) : (
                        <>
                          <span>{t('home.newsletter.subscribe')}</span>
                          <Send className="size-4" aria-hidden="true" />
                        </>
                      )}
                    </Button>
                  </div>

                  {status === 'error' && errorMessage && (
                    <p className="mt-3 text-[0.8125rem] text-gold-soft" role="alert">
                      {errorMessage}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.75rem] text-white/60">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={interests.training}
                        onChange={(e) => setInterests((prev) => ({ ...prev, training: e.target.checked }))}
                        className="size-3.5 accent-gold"
                      />
                      <span>{t('home.newsletter.interestTraining')}</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={interests.consulting}
                        onChange={(e) => setInterests((prev) => ({ ...prev, consulting: e.target.checked }))}
                        className="size-3.5 accent-gold"
                      />
                      <span>{t('home.newsletter.interestConsulting')}</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={interests.research}
                        onChange={(e) => setInterests((prev) => ({ ...prev, research: e.target.checked }))}
                        className="size-3.5 accent-gold"
                      />
                      <span>{t('home.newsletter.interestResearch')}</span>
                    </label>
                  </div>

                  <p className="mt-6 border-t border-white/10 pt-4 text-[0.6875rem] text-white/45">
                    {t('home.newsletter.privacy')}
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
