import { ArrowRight, ArrowUpRight, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/common/Reveal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/LanguageProvider'
import { getDurationLabel, trainingCategories, useFeaturedCourses } from '@/data/courses'

export function TrainingSection() {
  const t = useT()
  const courses = useFeaturedCourses(4)

  return (
    <section className="section bg-white" aria-labelledby="training-heading">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">{t('home.training.eyebrow')}</p>
            <h2
              id="training-heading"
              className="mt-5 text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-[1.09] tracking-[-0.035em] text-navy"
            >
              {t('home.training.title')}
            </h2>
            <p className="mt-5 max-w-md text-[0.9375rem] leading-[1.85] text-muted">{t('home.training.text')}</p>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              {['PMI® ATP', 'Autodesk® ATC', 'Pearson VUE'].map((item) => (
                <span
                  key={item}
                  className="border border-line px-2.5 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-muted"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild variant="primary">
                <Link to="/training">
                  {t('home.training.cta')}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/training#calendar">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {t('home.training.calendar')}
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {courses.map((course, index) => (
              <Reveal key={course.id} delay={index * 0.05}>
                <article className="group flex h-full flex-col border border-line bg-white transition-all duration-300 hover:border-line-strong hover:shadow-card">
                  <Link to={`/training/${course.id}`} className="relative block aspect-[16/10] overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {course.certificationBody && (
                      <span className="absolute left-3 top-3 bg-white/95 px-2 py-1 text-[0.5rem] font-bold uppercase tracking-[0.12em] text-navy">
                        {course.certificationBody}
                      </span>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[0.5rem] font-bold uppercase tracking-[0.14em] text-muted">
                      {t(trainingCategories.find((cat) => cat.id === course.category)?.labelKey ?? 'common.category')}
                    </p>
                    <h3 className="mt-2 text-[0.9375rem] font-semibold leading-snug text-navy">
                      <Link to={`/training/${course.id}`} className="hover:text-gold-deep">
                        {course.title}
                      </Link>
                    </h3>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <Badge variant="outline">
                        {t('common.duration')}: {getDurationLabel(course)}
                      </Badge>
                      <ArrowUpRight className="size-4 text-gold-deep opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
