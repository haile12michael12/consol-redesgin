import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scroll management:
 * - to top on a route change,
 * - to the hash target when a `#section` is present,
 * - respects reduced motion.
 */
export function useScrollRestoration() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (hash) {
      const id = hash.replace('#', '')
      window.requestAnimationFrame(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
        }
      })
      return
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, hash])
}
