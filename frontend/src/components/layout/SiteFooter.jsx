import { ArrowUpRight, Globe, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Logo } from '@/components/common/Logo'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { company, contact, credentials, social } from '@/lib/site'
import { footerNav } from '@/lib/navigation'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function FooterColumn({ heading, links }) {
  const t = useT()
  return (
    <div>
      <h2 className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-white/55">{heading}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.to + link.labelKey}>
            <Link
              to={link.to}
              className="group inline-flex items-start gap-1 text-[0.8125rem] leading-snug text-white/70 transition-colors hover:text-white"
            >
              {t(link.labelKey)}
              <ArrowUpRight
                className="mt-0.5 size-3 shrink-0 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Newsletter capture. There is no mailing-list backend yet, so submissions are
 * acknowledged client-side only; wire `onSubmit` to the chosen provider when
 * one is approved. The form never invents a sending address.
 */
function NewsletterForm() {
  const t = useT()
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)

  const onSubmit = (event) => {
    event.preventDefault()
    const value = email.trim()
    if (!EMAIL_PATTERN.test(value)) {
      setError(t('footer.newsletterError'))
      return
    }
    setError(null)
    setDone(true)
    toast.success(t('footer.newsletterSuccess').replace('{email}', value))
  }

  return (
    <div>
      <h2 className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-white/55">
        {t('footer.newsletter')}
      </h2>
      <p className="mt-4 text-[0.8125rem] leading-relaxed text-white/55">
        {t('footer.newsletterText')}
      </p>
      {done ? (
        <p className="mt-4 border border-gold/40 bg-gold/10 px-3.5 py-3 text-[0.8125rem] leading-snug text-gold-soft" role="status">
          {t('footer.newsletterSuccess').replace('{email}', email.trim())}
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mt-4">
          <label htmlFor="footer-newsletter-email" className="sr-only">
            {t('footer.newsletterPlaceholder')}
          </label>
          <div className="flex">
            <input
              id="footer-newsletter-email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (error) setError(null)
              }}
              placeholder={t('footer.newsletterPlaceholder')}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'footer-newsletter-error' : undefined}
              className="h-11 w-full min-w-0 border border-white/20 bg-white/5 px-3.5 text-[0.875rem] text-white placeholder:text-white/40 outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/25"
            />
            <button
              type="submit"
              className="flex h-11 shrink-0 items-center gap-2 bg-gold px-4 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-navy transition-colors hover:bg-gold-soft"
            >
              {t('footer.newsletterButton')}
              <Send className="size-3.5" aria-hidden="true" />
            </button>
          </div>
          {error && (
            <p id="footer-newsletter-error" className="mt-2 text-[0.75rem] text-gold-soft" role="alert">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  )
}

/**
 * Social section. `social` in src/lib/site.js only ever contains verified
 * company profiles — it is empty today, so the verified website link is the
 * only external destination shown. Never add invented profile URLs here.
 */
function SocialLinks() {
  const t = useT()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[0.625rem] font-bold uppercase tracking-[0.18em] text-white/55">
        {t('footer.social')}
      </span>
      {social.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={item.name}
          className="grid size-9 place-items-center border border-white/20 text-white/70 transition-colors hover:border-gold hover:text-gold-soft"
        >
          <Globe className="size-4" aria-hidden="true" />
        </a>
      ))}
      <a
        href={company.website}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex h-9 items-center gap-1.5 border border-white/20 px-3 text-[0.6875rem] font-semibold tracking-[0.04em] text-white/70 transition-colors hover:border-gold hover:text-gold-soft"
      >
        <Globe className="size-3.5 text-gold" aria-hidden="true" />
        constructionsolutionsplc.com
        <ArrowUpRight className="size-3" aria-hidden="true" />
      </a>
    </div>
  )
}

export function SiteFooter() {
  const t = useT()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy-900 text-white">
      <div className="h-px w-full bg-gradient-to-r from-gold/0 via-gold/50 to-gold/0" aria-hidden="true" />

      <div className="shell grid gap-12 pb-14 pt-16 lg:grid-cols-[1.4fr_2.6fr] lg:gap-16 lg:pb-16 lg:pt-20">
        <div>
          <Logo invert />
          <p className="mt-6 max-w-sm text-[0.875rem] leading-relaxed text-white/55">
            {t('footer.aboutText')}
          </p>

          <div className="mt-7 flex flex-wrap gap-1.5">
            {credentials.map((credential) => (
              <span
                key={credential.id}
                className="border border-white/15 px-2 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-white/55"
              >
                {credential.short}
              </span>
            ))}
          </div>

          <Button asChild variant="outline-invert" size="sm" className="mt-7">
            <Link to="/request-consultation">
              {t('nav.requestConsultation')}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          <FooterColumn heading={t('footer.explore')} links={footerNav.company} />
          <FooterColumn heading={t('footer.expertise')} links={footerNav.expertise} />
          <FooterColumn heading={t('footer.knowledge')} links={footerNav.knowledge} />
          <FooterColumn heading={t('footer.engage')} links={footerNav.engage} />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell grid gap-8 py-10 md:grid-cols-3">
          <div>
            <h2 className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-white/55">
              {t('footer.contact')}
            </h2>
            <ul className="mt-4 space-y-3 text-[0.8125rem] text-white/65">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-gold" aria-hidden="true" />
                <span>
                  {contact.addressLines.map((line) => (
                    <span key={line} className="block leading-snug">
                      {line}
                    </span>
                  ))}
                </span>
              </li>
              <li>
                <a href={contact.landlineHref} className="flex gap-2.5 transition-colors hover:text-white">
                  <Phone className="mt-0.5 size-3.5 shrink-0 text-gold" aria-hidden="true" />
                  {contact.landline}
                </a>
              </li>
              <li>
                <a href={contact.mobileHref} className="flex gap-2.5 transition-colors hover:text-white">
                  <Phone className="mt-0.5 size-3.5 shrink-0 text-gold/60" aria-hidden="true" />
                  {contact.mobile}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex gap-2.5 break-all transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 size-3.5 shrink-0 text-gold" aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-white/55">
              {t('footer.legal')}
            </h2>
            <ul className="mt-4 space-y-2.5 text-[0.8125rem] text-white/65">
              <li>
                <Link to="/about" className="transition-colors hover:text-white">
                  {t('nav.overview')}
                </Link>
              </li>
              <li>
                <Link to="/about/certifications" className="transition-colors hover:text-white">
                  {t('nav.certifications')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="transition-colors hover:text-white">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition-colors hover:text-white">
                  {t('footer.termsOfUse')}
                </Link>
              </li>
            </ul>
          </div>

          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-5 py-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-white/55">
              {t('footer.established')}
            </h2>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-white/55">
              {company.legalName} · {company.address.city}, {company.address.country}
            </p>
          </div>
          <SocialLinks />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-5 text-[0.6875rem] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName}. {t('footer.rights')}
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/privacy" className="transition-colors hover:text-white">
              {t('footer.privacyPolicy')}
            </Link>
            <Link to="/terms" className="transition-colors hover:text-white">
              {t('footer.termsOfUse')}
            </Link>
            <span className="flex items-center gap-2">
              <span className="inline-block size-1 rounded-full bg-gold" aria-hidden="true" />
              {company.tagline}
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
