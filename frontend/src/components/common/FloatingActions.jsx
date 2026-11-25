import { ArrowUp, MessageCircle } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useT } from '@/i18n/LanguageProvider'
import { contact } from '@/lib/site'

/**
 * Floating page actions: back-to-top and the WhatsApp shortcut.
 *
 * They sit on the LEFT edge so they never overlap the assistant widget, which
 * owns the bottom-right corner. Hidden on admin routes, matching the
 * assistant's behaviour.
 *
 * The WhatsApp link uses `contact.whatsappHref`, which is derived from the
 * verified company mobile number published on the live CONSOL website. If the
 * number is removed from src/lib/site.js (set to null), the shortcut
 * disappears — never hard-code a number here.
 */
export function FloatingActions() {
  const t = useT()
  const reduce = useReducedMotion()
  const location = useLocation()
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (location.pathname.startsWith('/admin')) return null

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <div className="fixed bottom-5 left-4 z-40 flex flex-col gap-2.5 sm:bottom-7 sm:left-7">
      {contact.whatsappHref && (
        <a
          href={contact.whatsappHref}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={t('common.whatsapp')}
          title={t('common.whatsapp')}
          className="grid size-12 place-items-center border border-[#1faa55]/30 bg-[#25D366] text-white shadow-[0_18px_40px_-16px_rgba(16,29,50,0.6)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold"
        >
          <MessageCircle className="size-5" aria-hidden="true" />
        </a>
      )}

      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            onClick={scrollToTop}
            aria-label={t('common.backToTop')}
            title={t('common.backToTop')}
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : 12 }}
            transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
            className="grid size-12 place-items-center border border-line-strong bg-white text-navy shadow-[0_18px_40px_-16px_rgba(16,29,50,0.6)] transition-colors duration-300 hover:bg-navy hover:text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold"
          >
            <ArrowUp className="size-5" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
