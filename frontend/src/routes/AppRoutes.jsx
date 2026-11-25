import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AdminLayout } from '@/layouts/AdminLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { CardGridSkeleton } from '@/components/common/StateBlocks'
import { HomePage } from '@/pages/public/HomePage'
import { NotFoundPage } from '@/pages/public/NotFoundPage'
import { RouteFallback } from '@/pages/public/RouteFallback'

/* Public pages are code-split so the homepage stays light. */
const AboutPage = lazy(() => import('@/pages/public/AboutPage').then((m) => ({ default: m.AboutPage })))
const VisionMissionPage = lazy(() =>
  import('@/pages/public/about/VisionMissionPage').then((m) => ({ default: m.VisionMissionPage })),
)
const LeadershipPage = lazy(() =>
  import('@/pages/public/about/LeadershipPage').then((m) => ({ default: m.LeadershipPage })),
)
const HistoryPage = lazy(() =>
  import('@/pages/public/about/HistoryPage').then((m) => ({ default: m.HistoryPage })),
)
const StructurePage = lazy(() =>
  import('@/pages/public/about/StructurePage').then((m) => ({ default: m.StructurePage })),
)
const CoreValuesPage = lazy(() =>
  import('@/pages/public/about/CoreValuesPage').then((m) => ({ default: m.CoreValuesPage })),
)
const WhyChoosePage = lazy(() =>
  import('@/pages/public/about/WhyChoosePage').then((m) => ({ default: m.WhyChoosePage })),
)
const CertificationsPage = lazy(() =>
  import('@/pages/public/about/CertificationsPage').then((m) => ({ default: m.CertificationsPage })),
)
const ClientsPartnersPage = lazy(() =>
  import('@/pages/public/about/ClientsPartnersPage').then((m) => ({ default: m.ClientsPartnersPage })),
)
const ServicesPage = lazy(() =>
  import('@/pages/public/ServicesPage').then((m) => ({ default: m.ServicesPage })),
)
const ServiceDetailPage = lazy(() =>
  import('@/pages/public/ServiceDetailPage').then((m) => ({ default: m.ServiceDetailPage })),
)
const ProjectsPage = lazy(() =>
  import('@/pages/public/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
)
const ProjectDetailPage = lazy(() =>
  import('@/pages/public/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })),
)
const TrainingPage = lazy(() =>
  import('@/pages/public/TrainingPage').then((m) => ({ default: m.TrainingPage })),
)
const CourseDetailPage = lazy(() =>
  import('@/pages/public/CourseDetailPage').then((m) => ({ default: m.CourseDetailPage })),
)
const RegisterCoursePage = lazy(() =>
  import('@/pages/public/RegisterCoursePage').then((m) => ({ default: m.RegisterCoursePage })),
)
const TrainingSchedulePage = lazy(() =>
  import('@/pages/public/TrainingSchedulePage').then((m) => ({ default: m.TrainingSchedulePage })),
)
const TrainingInstructorsPage = lazy(() =>
  import('@/pages/public/TrainingInstructorsPage').then((m) => ({ default: m.TrainingInstructorsPage })),
)
const RegistrationConfirmationPage = lazy(() =>
  import('@/pages/public/RegistrationConfirmationPage').then((m) => ({ default: m.RegistrationConfirmationPage })),
)
const CertificateVerificationPage = lazy(() =>
  import('@/pages/public/CertificateVerificationPage').then((m) => ({ default: m.CertificateVerificationPage })),
)
const NewsPage = lazy(() => import('@/pages/public/NewsPage').then((m) => ({ default: m.NewsPage })))
const NewsDetailPage = lazy(() =>
  import('@/pages/public/NewsDetailPage').then((m) => ({ default: m.NewsDetailPage })),
)
const EventsPage = lazy(() => import('@/pages/public/EventsPage').then((m) => ({ default: m.EventsPage })))
const EventDetailPage = lazy(() =>
  import('@/pages/public/EventDetailPage').then((m) => ({ default: m.EventDetailPage })),
)
const ContactPage = lazy(() =>
  import('@/pages/public/ContactPage').then((m) => ({ default: m.ContactPage })),
)
const ConsultationPage = lazy(() =>
  import('@/pages/public/ConsultationPage').then((m) => ({ default: m.ConsultationPage })),
)

/* Admin */
const AdminLoginPage = lazy(() =>
  import('@/pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const PagesAdminPage = lazy(() =>
  import('@/pages/admin/PagesAdminPage').then((m) => ({ default: m.PagesAdminPage })),
)
const AdminModulePage = lazy(() =>
  import('@/pages/admin/AdminModulePage').then((m) => ({ default: m.AdminModulePage })),
)
const SettingsPage = lazy(() =>
  import('@/pages/admin/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)
const ServicesAdminPage = lazy(() =>
  import('@/pages/admin/ServicesAdminPage').then((m) => ({ default: m.ServicesAdminPage })),
)
const ProjectsAdminPage = lazy(() =>
  import('@/pages/admin/ProjectsAdminPage').then((m) => ({ default: m.ProjectsAdminPage })),
)
const TrainingAdminPage = lazy(() =>
  import('@/pages/admin/TrainingAdminPage').then((m) => ({ default: m.TrainingAdminPage })),
)
const RegistrationsAdminPage = lazy(() =>
  import('@/pages/admin/RegistrationsAdminPage').then((m) => ({ default: m.RegistrationsAdminPage })),
)
const CertificatesAdminPage = lazy(() =>
  import('@/pages/admin/CertificatesAdminPage').then((m) => ({ default: m.CertificatesAdminPage })),
)

function SuspenseBoundary({ children }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />

        <Route path="about">
          <Route index element={<SuspenseBoundary><AboutPage /></SuspenseBoundary>} />
          <Route path="vision-mission" element={<SuspenseBoundary><VisionMissionPage /></SuspenseBoundary>} />
          <Route path="leadership" element={<SuspenseBoundary><LeadershipPage /></SuspenseBoundary>} />
          <Route path="history" element={<SuspenseBoundary><HistoryPage /></SuspenseBoundary>} />
          <Route path="structure" element={<SuspenseBoundary><StructurePage /></SuspenseBoundary>} />
          <Route path="core-values" element={<SuspenseBoundary><CoreValuesPage /></SuspenseBoundary>} />
          <Route path="why-consol" element={<SuspenseBoundary><WhyChoosePage /></SuspenseBoundary>} />
          <Route path="certifications" element={<SuspenseBoundary><CertificationsPage /></SuspenseBoundary>} />
          <Route path="clients-partners" element={<SuspenseBoundary><ClientsPartnersPage /></SuspenseBoundary>} />
        </Route>

        <Route path="services">
          <Route index element={<SuspenseBoundary><ServicesPage /></SuspenseBoundary>} />
          <Route path=":slug" element={<SuspenseBoundary><ServiceDetailPage /></SuspenseBoundary>} />
        </Route>

        <Route path="projects">
          <Route index element={<SuspenseBoundary><ProjectsPage /></SuspenseBoundary>} />
          <Route path=":slug" element={<SuspenseBoundary><ProjectDetailPage /></SuspenseBoundary>} />
        </Route>

        <Route path="training">
          <Route index element={<SuspenseBoundary><TrainingPage /></SuspenseBoundary>} />
          <Route path="schedule" element={<SuspenseBoundary><TrainingSchedulePage /></SuspenseBoundary>} />
          <Route path="instructors" element={<SuspenseBoundary><TrainingInstructorsPage /></SuspenseBoundary>} />
          <Route path="instructors/:slug" element={<SuspenseBoundary><TrainingInstructorsPage /></SuspenseBoundary>} />
          <Route path="registration-confirmation/:reference" element={<SuspenseBoundary><RegistrationConfirmationPage /></SuspenseBoundary>} />
          <Route path=":slug" element={<SuspenseBoundary><CourseDetailPage /></SuspenseBoundary>} />
          <Route path=":slug/register" element={<SuspenseBoundary><RegisterCoursePage /></SuspenseBoundary>} />
        </Route>
        <Route path="verify-certificate" element={<SuspenseBoundary><CertificateVerificationPage /></SuspenseBoundary>} />

        <Route path="news">
          <Route index element={<SuspenseBoundary><NewsPage /></SuspenseBoundary>} />
          <Route path=":slug" element={<SuspenseBoundary><NewsDetailPage /></SuspenseBoundary>} />
        </Route>

        <Route path="events">
          <Route index element={<SuspenseBoundary><EventsPage /></SuspenseBoundary>} />
          <Route path=":slug" element={<SuspenseBoundary><EventDetailPage /></SuspenseBoundary>} />
        </Route>

        <Route path="contact" element={<SuspenseBoundary><ContactPage /></SuspenseBoundary>} />
        <Route
          path="request-consultation"
          element={<SuspenseBoundary><ConsultationPage /></SuspenseBoundary>}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/admin/login" element={<SuspenseBoundary><AdminLoginPage /></SuspenseBoundary>} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<SuspenseBoundary><DashboardPage /></SuspenseBoundary>} />
        <Route path="dashboard" element={<SuspenseBoundary><DashboardPage /></SuspenseBoundary>} />
        <Route path="pages" element={<SuspenseBoundary><PagesAdminPage /></SuspenseBoundary>} />
        <Route
          path="company-profile"
          element={<SuspenseBoundary><AdminModulePage moduleKey="profile" /></SuspenseBoundary>}
        />
        <Route
          path="services"
          element={<SuspenseBoundary><ServicesAdminPage /></SuspenseBoundary>}
        />
        <Route
          path="projects"
          element={<SuspenseBoundary><ProjectsAdminPage /></SuspenseBoundary>}
        />
        <Route
          path="training"
          element={<SuspenseBoundary><TrainingAdminPage /></SuspenseBoundary>}
        />
        <Route
          path="registrations"
          element={<SuspenseBoundary><RegistrationsAdminPage /></SuspenseBoundary>}
        />
        <Route
          path="certificates"
          element={<SuspenseBoundary><CertificatesAdminPage /></SuspenseBoundary>}
        />
        <Route
          path="news"
          element={<SuspenseBoundary><AdminModulePage moduleKey="news" /></SuspenseBoundary>}
        />
        <Route
          path="media"
          element={<SuspenseBoundary><AdminModulePage moduleKey="media" /></SuspenseBoundary>}
        />
        <Route
          path="inquiries"
          element={<SuspenseBoundary><AdminModulePage moduleKey="inquiries" /></SuspenseBoundary>}
        />
        <Route
          path="analytics"
          element={<SuspenseBoundary><AdminModulePage moduleKey="analytics" /></SuspenseBoundary>}
        />
        <Route
          path="users"
          element={<SuspenseBoundary><AdminModulePage moduleKey="users" /></SuspenseBoundary>}
        />
        <Route path="settings" element={<SuspenseBoundary><SettingsPage /></SuspenseBoundary>} />
      </Route>
    </Routes>
  )
}

export { CardGridSkeleton }
