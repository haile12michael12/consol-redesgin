import { AboutPreview } from '@/components/home/AboutPreview'
import { ClientsSection } from '@/components/home/ClientsSection'
import { ConsultationCta } from '@/components/home/ConsultationCta'
import { CredibilitySection } from '@/components/home/CredibilitySection'
import { FeaturedProjects } from '@/components/home/FeaturedProjects'
import { Hero } from '@/components/home/Hero'
import { IntroSection } from '@/components/home/IntroSection'
import { NewsSection } from '@/components/home/NewsSection'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { TrainingSection } from '@/components/home/TrainingSection'
import { WhySection } from '@/components/home/WhySection'
import { useLanguage } from '@/i18n/LanguageProvider'
import { usePageMeta } from '@/lib/seo'

export function HomePage() {
  const { lang } = useLanguage()

  usePageMeta({
    title: 'Building Expertise. Strengthening Organizations. Advancing the Construction Industry.',
    description:
      'Construction Solutions PLC (CONSOL) is an Ethiopian consulting, training, and research institute providing management consultancy, professional training and applied research since 2005.',
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
    <div lang={lang} className="min-h-screen">
      {/* 1. Hero section with strong visual hierarchy */}
      <Hero />

      {/* 2. Company introduction */}
      <IntroSection />

      {/* 3. About CONSOL preview */}
      <AboutPreview />

      {/* 4. Core services */}
      <ServicesSection />

      {/* 5. Featured projects */}
      <FeaturedProjects />

      {/* 6. Professional training and certification */}
      <TrainingSection />

      {/* 7. Why Choose CONSOL */}
      <WhySection />

      {/* 8. Industry experience and company statistics, only when verified */}
      <CredibilitySection />

      {/* 9. Partners and clients, using approved logos */}
      <ClientsSection />

      {/* 10. Latest news and events */}
      <NewsSection />

      {/* 11. Testimonials, only when approved */}
      <TestimonialsSection />

      {/* 12. Consultation call-to-action */}
      <ConsultationCta />

      {/* 13. Newsletter subscription */}
      <NewsletterSection />

      {/* 14. Complete corporate footer is rendered by PublicLayout */}
    </div>
  )
}
