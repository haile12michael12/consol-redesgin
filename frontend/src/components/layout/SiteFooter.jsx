import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useT } from '@/i18n/LanguageProvider'
import { company, contact, credentials } from '@/lib/site'
import { footerNav } from '@/lib/navigation'

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

function NewsletterForm() {
  const t = useT()
  const [email, setEmail] = useState('')
  const [requestReady, setRequestReady] = useState(false)
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(
    'Newsletter subscription request',
  )}&body=${encodeURIComponent(`Please add ${email} to CONSOL email updates.`)}`

  return (
    <div>
      <h2 className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-white/55">
        {t('footer.newsletter')}
      </h2>
      <p className="mt-4 text-[0.8125rem] leading-relaxed text-white/65">
        {t('footer.newsletterText')}
      </p>
      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault()
          setRequestReady(true)
        }}
      >
        <label htmlFor="footer-newsletter-email" className="sr-only">
          {t('common.email')}
        </label>
        <Input
          id="footer-newsletter-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setRequestReady(false)
          }}
          placeholder={t('footer.newsletterPlaceholder')}
          className="h-10 border-white/25 bg-white/10 text-white placeholder:text-white/55 focus-visible:border-gold focus-visible:ring-gold"
        />
        <Button type="submit" variant="gold" size="sm">
          {t('footer.newsletterSubmit')}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Button>
      </form>
      {requestReady && (
        <p className="mt-3 text-[0.75rem] text-white/70" role="status">
          {t('footer.newsletterReady')}{' '}
          <a
            href={mailto}
            className="font-semibold text-gold-soft underline underline-offset-4 hover:text-white"
          >
            {t('footer.newsletterSend')}
          </a>
        </p>
      )}
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
        <div className="shell grid gap-8 py-10 md:grid-cols-2 xl:grid-cols-4">
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
            <p className="mt-4 text-[0.75rem] leading-relaxed text-white/55">
              {t('footer.legalNote')}
            </p>
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
                <Link to="/contact" className="transition-colors hover:text-white">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}?subject=${encodeURIComponent('Request for CONSOL Privacy Policy')}`}
                  aria-label={`${t('footer.privacy')} — ${t('footer.requestDocument')}`}
                  className="transition-colors hover:text-white"
                >
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}?subject=${encodeURIComponent('Request for CONSOL Terms of Use')}`}
                  aria-label={`${t('footer.terms')} — ${t('footer.requestDocument')}`}
                  className="transition-colors hover:text-white"
                >
                  {t('footer.terms')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-white/55">
              {t('footer.established')}
            </h2>
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-white/55">
              {company.legalName} · {company.address.city}, {company.address.country}
            </p>
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-flex items-center gap-1.5 text-[0.75rem] font-semibold text-gold-soft transition-colors hover:text-white"
            >
              constructionsolutionsplc.com
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
          </div>

          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-5 text-[0.6875rem] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName}. {t('footer.rights')}
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block size-1 rounded-full bg-gold" aria-hidden="true" />
            {company.tagline}
          </p>
        </div>
      </div>
    </footer>
  )
}
