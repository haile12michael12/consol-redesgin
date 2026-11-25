import { Mail, Phone } from 'lucide-react'
import { PageHero } from '@/components/common/PageHero'
import { Reveal } from '@/components/common/Reveal'
import { useT } from '@/i18n/LanguageProvider'
import { contact } from '@/lib/site'
import { usePageMeta } from '@/lib/seo'

/**
 * Terms of Use. The copy is an explicitly-labelled draft pending CONSOL
 * legal approval and references only verified contact details.
 */
export function TermsPage() {
  const t = useT()
  usePageMeta({
    title: 'Terms of Use',
    description: 'Terms governing the use of the Construction Solutions PLC (CONSOL) website.',
  })

  const sections = [
    { heading: t('terms.use'), text: t('terms.useText') },
    {
      heading: t('terms.content'),
      text: t('terms.contentText').replace('{email}', contact.email),
    },
    { heading: t('terms.liability'), text: t('terms.liabilityText') },
  ]

  return (
    <>
      <PageHero
        eyebrow={t('legal.eyebrow')}
        title={t('terms.title')}
        text={t('terms.intro')}
        breadcrumbs={[{ label: t('footer.termsOfUse'), to: '/terms' }]}
      />
      <section className="section bg-white">
        <div className="shell max-w-3xl">
          <Reveal>
            <p className="border border-gold/40 bg-gold/8 px-5 py-4 text-[0.875rem] leading-relaxed text-navy">
              {t('legal.draftNotice')}
            </p>
          </Reveal>
          {sections.map((section) => (
            <Reveal key={section.heading}>
              <div className="mt-10">
                <h2 className="text-[1.25rem] font-semibold tracking-[-0.01em] text-navy">
                  {section.heading}
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-[1.8] text-muted">{section.text}</p>
              </div>
            </Reveal>
          ))}
          <Reveal>
            <div className="mt-12 border-t border-line pt-8 text-[0.875rem] text-muted">
              <p className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 font-medium text-navy hover:text-gold-deep">
                  <Mail className="size-4 text-gold-deep" aria-hidden="true" />
                  {contact.email}
                </a>
                <a href={contact.landlineHref} className="inline-flex items-center gap-2 font-medium text-navy hover:text-gold-deep">
                  <Phone className="size-4 text-gold-deep" aria-hidden="true" />
                  {contact.landline}
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
