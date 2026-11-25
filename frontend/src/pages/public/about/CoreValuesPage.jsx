import { AboutContentState } from '@/components/about/AboutContentState'
import { AboutSubNav } from '@/components/about/AboutSubNav'
import { CoreValuesSection } from '@/components/about/CoreValuesSection'
import { PageHero } from '@/components/common/PageHero'
import { useAbout } from '@/hooks/useAbout'
import { useT } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'

export function CoreValuesPage() {
  const t = useT()
  const about = useAbout()
  usePageMeta({
    title: 'Core Values',
    description: 'CONSOL’s approved core values, published when company-approved content is available.',
    image: '/media/structure.jpg',
  })

  return (
    <>
      <PageHero
        eyebrow="Core values"
        title="The principles that guide our work."
        text="CONSOL’s core values will be displayed here once formally approved for publication."
        breadcrumbs={[
          { label: t('nav.about'), to: '/about' },
          { label: 'Core values', to: '/about/core-values' },
        ]}
        image={{ src: '/media/structure.jpg', alt: 'Structural works under construction' }}
      />
      <AboutSubNav />
      <AboutContentState query={about}>
        {(content) => <CoreValuesSection values={content.coreValues} />}
      </AboutContentState>
    </>
  )
}
