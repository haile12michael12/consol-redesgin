import { ClientsSection } from '@/components/home/ClientsSection'
import { ConsultationCta } from '@/components/home/ConsultationCta'
import { CredibilitySection } from '@/components/home/CredibilitySection'
import { FeaturedProjects } from '@/components/home/FeaturedProjects'
import { Hero } from '@/components/home/Hero'
import { IntroSection } from '@/components/home/IntroSection'
import { NewsSection } from '@/components/home/NewsSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { TrainingSection } from '@/components/home/TrainingSection'
import { WhySection } from '@/components/home/WhySection'
import { useLanguage } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'

export function HomePage() {
  const { lang } = useLanguage()

  usePageMeta({
    title: 'Building Expertise. Strengthening Organisations.',
    description:
      'Construction Solutions PLC (CONSOL) is an Ethiopian construction management consultancy, training and research institute. Consultancy, professional training, PMI® and Autodesk® certification, and industry research since 2005.',
    path: '/',
    image: '/media/hero-construction.jpg',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Construction Solutions PLC',
      alternateName: 'CONSOL',
      url: 'https://www.constructionsolutionsplc.com/',
      logo: 'https://www.constructionsolutionsplc.com/favicon.svg',
      email: 'info@constructionsolutionsplc.com',
      telephone: '+251 114 70 04 52',
      foundingDate: '2005',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Meskel Flower to Wello Sefer Street, Martereza Building, 3rd Floor, Suite 301',
        addressLocality: 'Addis Ababa',
        addressCountry: 'ET',
      },
    },
  })

  return (
    <div lang={lang}>
      <Hero />
      <IntroSection />
      <CredibilitySection />
      <ServicesSection />
      <FeaturedProjects />
      <TrainingSection />
      <WhySection />
      <ClientsSection />
      <NewsSection />
      <ConsultationCta />
    </div>
  )
}
