import { Breadcrumbs } from './Breadcrumbs'
import { cn } from '@/lib/utils'

/**
 * Interior page masthead. Navy field with the brand's hairline grid, a
 * breadcrumb trail and the page title. Optional image is decorative only.
 */
export function PageHero({ eyebrow, title, text, breadcrumbs, image, actions, children, className }) {
  return (
    <section className={cn('relative isolate overflow-hidden bg-navy text-white', className)}>
      {image && (
        <>
          <img
            src={image.src}
            alt={image.alt ?? ''}
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
            fetchPriority="high"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/92 to-navy/55" />
        </>
      )}
      <div className="hairline-grid absolute inset-0 -z-10 opacity-40" aria-hidden="true" />
      <div className="shell relative pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} invert className="mb-8" />}
        {eyebrow && <p className="eyebrow eyebrow-invert">{eyebrow}</p>}
        <h1 className="mt-4 max-w-4xl text-[clamp(2.1rem,5vw,3.9rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-white">
          {title}
        </h1>
        {text && <p className="mt-6 max-w-2xl text-[1rem] leading-[1.8] text-white/65">{text}</p>}
        {actions && <div className="mt-9 flex flex-wrap gap-3">{actions}</div>}
        {children}
      </div>
    </section>
  )
}
