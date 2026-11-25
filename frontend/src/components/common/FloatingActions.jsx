import { ArrowUp, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useT } from '@/i18n/LanguageProvider'
import { contact } from '@/lib/site'

export function FloatingActions() {
  const t = useT()
  const [showBackToTop, setShowBackToTop] = useState(false)
  const whatsappNumber = contact.mobile.replace(/\D/g, '')

  useEffect(() => {
    const updateVisibility = () => setShowBackToTop(window.scrollY > 480)
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  return (
    <>
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={t('common.whatsapp')}
        className="fixed bottom-5 left-5 z-30 grid size-12 place-items-center rounded-full bg-[#25d366] text-navy shadow-float transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold"
      >
        <MessageCircle className="size-5" aria-hidden="true" />
      </a>

      {showBackToTop && (
        <button
          type="button"
          aria-label={t('common.backToTop')}
          onClick={() => {
            const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'auto'
              : 'smooth'
            window.scrollTo({ top: 0, behavior })
          }}
          className="fixed bottom-[5.25rem] left-5 z-30 grid size-12 place-items-center rounded-full border border-line bg-white text-navy shadow-card transition-colors hover:border-navy hover:bg-navy hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold"
        >
          <ArrowUp className="size-5" aria-hidden="true" />
        </button>
      )}
    </>
  )
}
