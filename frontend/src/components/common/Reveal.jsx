import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Restrained scroll reveal used throughout the site. Motion is disabled
 * entirely for visitors who prefer reduced motion.
 */
export function Reveal({ children, delay = 0, y = 20, className, as = 'div' }) {
  const reduce = useReducedMotion()
  const Component = motion[as] ?? motion.div

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <Component
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </Component>
  )
}
