import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useT } from '@/i18n/LanguageProvider'

/** Catalogue card used on /services and cross-links. */
export function ServiceCard({ service, index = 0 }) {
  const t = useT()
  return (
    <article className="group flex h-full flex-col border border-line bg-white transition-all duration-300 hover:border-line-strong hover:shadow-card">
      <Link to={`/services/${service.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        <img
          src={service.image}
          alt={service.imageAlt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 bg-navy/90 px-2 py-1 font-display text-[0.75rem] text-gold backdrop-blur-sm">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="absolute inset-0 bg-navy/0 transition-colors duration-300 group-hover:bg-navy/10" aria-hidden="true" />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.015em] text-navy">
          <Link to={`/services/${service.slug}`} className="hover:text-gold-deep">
            {service.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-[0.8125rem] leading-[1.8] text-muted">{service.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {service.scope.slice(0, 3).map((item) => (
            <li
              key={item}
              className="border border-line px-2 py-1 text-[0.5625rem] font-medium uppercase tracking-[0.08em] text-muted"
            >
              {item.split(' — ')[0].split(' (')[0].slice(0, 34)}
            </li>
          ))}
        </ul>
        <Link
          to={`/services/${service.slug}`}
          className="mt-6 inline-flex items-center gap-2 border-t border-line pt-4 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-navy transition-colors group-hover:text-gold-deep"
        >
          {t('common.readMore')}
          <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
