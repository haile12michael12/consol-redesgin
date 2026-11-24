import { ArrowRight, CalendarDays, Info } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHero } from '@/components/common/PageHero'
import { SearchField } from '@/components/common/SearchField'
import { EmptyState, Notice } from '@/components/common/StateBlocks'
import { SectionHeading } from '@/components/common/SectionHeading'
import { CourseCard } from '@/components/training/CourseCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FilterPill } from '@/components/ui/tag'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'
import { courses, trainingCategories, trainingWindows, useFeaturedCourses } from '@/data/courses'

const howToAttend = [
  { key: 1, image: '/media/training.jpg' },
  { key: 2, image: '/media/consultancy.jpg' },
  { key: 3, image: '/media/conference.jpg' },
]

export function TrainingPage() {
  const t = useT()
  const featured = useFeaturedCourses(4)
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  const category = params.get('category') ?? 'all'

  usePageMeta({
    title: 'Training & Certification',
    description:
      'Construction management, software and engineering courses plus PMI® and Autodesk® certification training from CONSOL — an Authorized PMI® Training Partner and Authorized Autodesk® Training Center.',
    image: '/media/training.jpg',
  })

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const pool = showAll || term ? courses : courses
    return pool.filter((course) => {
      const matchesCategory = category === 'all' || course.category === category
      const haystack = [course.title, course.summary, course.certificationBody ?? ''].join(' ').toLowerCase()
      return matchesCategory && (!term || haystack.includes(term))
    })
  }, [category, query, showAll])

  const setCategory = (value) => {
    const next = new URLSearchParams(params)
    if (value === 'all') next.delete('category')
    else next.set('category', value)
    setParams(next, { replace: true })
  }

  const visible = showAll || query ? filtered : filtered.slice(0, 9)

  return (
    <>
      <PageHero
        eyebrow={t('training.hero.eyebrow')}
        title={t('training.hero.title')}
        text={t('training.hero.text')}
        breadcrumbs={[{ label: t('nav.training'), to: '/training' }]}
        image={{ src: '/media/training.jpg', alt: 'Professional training workshop' }}
        actions={
          <>
            <Button asChild variant="gold">
              <Link to="#catalogue">
                {t('training.hero.cta')}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline-invert">
              <Link to="#calendar">
                <CalendarDays className="size-4" aria-hidden="true" />
                {t('training.calendar')}
              </Link>
            </Button>
          </>
        }
      >
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-6">
          <p className="text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-white/55">
            {t('home.credibility.credentials')}
          </p>
          {['PMI® ATP', 'Autodesk® ATC', 'Pearson VUE'].map((item) => (
            <span key={item} className="text-[0.75rem] font-semibold text-white/75">
              {item}
            </span>
          ))}
        </div>
      </PageHero>

      {/* Featured */}
      <section className="section-sm border-b border-line bg-white">
        <div className="shell">
          <SectionHeading
            eyebrow={t('training.featured')}
            title="Frequently requested programmes"
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="#catalogue">{t('common.viewAll')}</Link>
              </Button>
            }
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section id="catalogue" className="section bg-canvas scroll-mt-24">
        <div className="shell">
          <SectionHeading
            eyebrow={t('training.categories')}
            title={t('training.allCourses')}
            text={t('training.notice')}
          />

          <div className="mt-8 border border-line bg-white p-4 sm:p-5">
            <SearchField
              id="course-search"
              value={query}
              onChange={setQuery}
              placeholder={t('training.searchPlaceholder')}
            />
            <div
              className="no-scrollbar mt-4 flex gap-2 overflow-x-auto border-t border-line pt-4"
              role="group"
              aria-label={t('training.categories')}
            >
              {trainingCategories.map((item) => (
                <FilterPill
                  key={item.id}
                  active={category === item.id}
                  onClick={() => setCategory(item.id)}
                >
                  {t(item.labelKey)}
                </FilterPill>
              ))}
            </div>
          </div>

          <p className="mt-5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted" aria-live="polite">
            {filtered.length} {t('training.count')}
          </p>

          {visible.length === 0 ? (
            <EmptyState
              className="mt-6"
              action={
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setQuery('')
                    setCategory('all')
                  }}
                >
                  {t('common.clearFilters')}
                </Button>
              }
            />
          ) : (
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}

          {!showAll && !query && visible.length < filtered.length && (
            <div className="mt-8 text-center">
              <Button variant="outline" onClick={() => setShowAll(true)}>
                Show all {filtered.length} courses
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Calendar */}
      <section id="calendar" className="section bg-white scroll-mt-24">
        <div className="shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow">{t('training.calendar')}</p>
            <h2 className="mt-5 text-[clamp(1.7rem,3vw,2.4rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-navy">
              {t('training.upcoming')}
            </h2>
            <p className="mt-5 max-w-sm text-[0.875rem] leading-[1.8] text-muted">{t('training.calendarNote')}</p>
            <Notice className="mt-6" tone="demo">
              {t('training.upcomingNote')}
            </Notice>
          </div>

          <div>
            <ul className="divide-y divide-line border-y border-line">
              {trainingWindows.map((window) => (
                <li key={window.quarter} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 py-5">
                  <span className="font-display text-[1.35rem] text-gold-deep">{window.quarter}</span>
                  <div>
                    <p className="text-[0.875rem] font-semibold text-navy">{window.months}</p>
                    <p className="mt-0.5 text-[0.75rem] text-muted">{window.note}</p>
                  </div>
                  <Badge variant="outline">Planned</Badge>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="primary">
                <Link to="/request-consultation">{t('training.registerCta')}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/contact">{t('training.enquire')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How to attend */}
      <section className="section bg-navy text-white">
        <div className="shell">
          <SectionHeading
            invert
            eyebrow={t('training.howToAttend')}
            title="Three ways to join a CONSOL programme."
          />
          <div className="mt-10 grid gap-px bg-white/12 md:grid-cols-3">
            {howToAttend.map((item, index) => (
              <div key={item.key} className="group relative overflow-hidden bg-navy">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={item.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="h-full w-full object-cover opacity-40 transition-opacity duration-500 group-hover:opacity-55"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" aria-hidden="true" />
                  <span className="absolute left-5 top-4 font-display text-sm text-gold">0{index + 1}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-[1rem] font-semibold text-white">{t(`training.how.${item.key}.title`)}</h3>
                  <p className="mt-2 text-[0.8125rem] leading-[1.8] text-white/55">
                    {t(`training.how.${item.key}.text`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 flex items-start gap-2 text-[0.6875rem] leading-relaxed text-white/55">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            Course durations and certification bodies are as published by CONSOL. Session dates, fees and instructors
            are confirmed on registration and are not displayed until approved.
          </p>
        </div>
      </section>
    </>
  )
}
