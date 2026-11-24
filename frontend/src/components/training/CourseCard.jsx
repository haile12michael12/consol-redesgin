import { ArrowUpRight, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useT } from '@/i18n/LanguageProvider'
import { getDurationLabel, trainingCategories } from '@/data/courses'

export function CourseCard({ course }) {
  const t = useT()
  return (
    <article className="group flex h-full flex-col border border-line bg-white transition-all duration-300 hover:border-line-strong hover:shadow-card">
      <Link to={`/training/${course.id}`} className="relative block aspect-[16/10] overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {course.certificationBody && (
          <span className="absolute left-3 top-3 bg-navy/90 px-2 py-1 text-[0.5rem] font-bold uppercase tracking-[0.12em] text-gold backdrop-blur-sm">
            {course.certificationBody}
          </span>
        )}
        {course.featured && (
          <span className="absolute right-3 top-3 bg-gold px-2 py-1 text-[0.5rem] font-bold uppercase tracking-[0.12em] text-navy">
            Featured
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.5rem] font-bold uppercase tracking-[0.14em] text-muted">
          {t(trainingCategories.find((item) => item.id === course.category)?.labelKey ?? 'common.category')}
        </p>
        <h3 className="mt-2 text-[0.9375rem] font-semibold leading-snug text-navy">
          <Link to={`/training/${course.id}`} className="transition-colors hover:text-gold-deep">
            {course.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-[0.8125rem] leading-relaxed text-muted">{course.summary}</p>

        <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5">
          <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold text-navy">
            <Clock className="size-3 text-gold-deep" aria-hidden="true" />
            {getDurationLabel(course)}
          </span>
          <Link
            to={`/training/${course.id}`}
            className="inline-flex items-center gap-1 text-[0.5625rem] font-bold uppercase tracking-[0.14em] text-navy transition-colors hover:text-gold-deep"
          >
            {t('common.readMore')}
            <ArrowUpRight className="size-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
