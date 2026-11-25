/**
 * Primary navigation model. Labels are translation keys resolved by `useT`,
 * paths are real client routes.
 */
export const primaryNav = [
  { labelKey: 'nav.home', to: '/' },
  {
    labelKey: 'nav.about',
    to: '/about',
    columns: [
      {
        headingKey: 'nav.aboutCompany',
        links: [
          { labelKey: 'nav.overview', to: '/about', descriptionKey: 'nav.overviewDesc' },
          {
            labelKey: 'nav.visionMission',
            to: '/about/vision-mission',
            descriptionKey: 'nav.visionMissionDesc',
          },
          {
            labelKey: 'nav.leadership',
            to: '/about/leadership',
            descriptionKey: 'nav.leadershipDesc',
          },
          {
            labelKey: 'nav.history',
            to: '/about/history',
            descriptionKey: 'nav.historyDesc',
          },
        ],
      },
      {
        headingKey: 'nav.aboutInstitution',
        links: [
          { labelKey: 'nav.structure', to: '/about/structure' },
          { labelKey: 'nav.certifications', to: '/about/certifications' },
          { labelKey: 'nav.clientsPartners', to: '/about/clients-partners' },
        ],
      },
    ],
    feature: {
      labelKey: 'nav.aboutFeature',
      titleKey: 'nav.aboutFeatureTitle',
      textKey: 'nav.aboutFeatureText',
      to: '/about',
    },
  },
  {
    labelKey: 'nav.services',
    to: '/services',
    columns: [
      {
        headingKey: 'nav.consultancy',
        links: [
          {
            labelKey: 'service.cm.title',
            to: '/services/construction-management-consultancy',
          },
          {
            labelKey: 'service.bm.title',
            to: '/services/business-management-consultancy',
          },
        ],
      },
      {
        headingKey: 'nav.development',
        links: [
          {
            labelKey: 'service.training.title',
            to: '/services/professional-training',
          },
          {
            labelKey: 'service.research.title',
            to: '/services/research-industry-development',
          },
          { labelKey: 'nav.allServices', to: '/services' },
        ],
      },
    ],
    feature: {
      labelKey: 'nav.servicesFeature',
      titleKey: 'service.cm.title',
      textKey: 'nav.servicesFeatureText',
      to: '/services/construction-management-consultancy',
    },
  },
  { labelKey: 'nav.projects', to: '/projects' },
  {
    labelKey: 'nav.training',
    to: '/training',
    alignEnd: true,
    columns: [
      {
        headingKey: 'nav.courseAreas',
        links: [
          { labelKey: 'nav.training', to: '/training' },
          { labelKey: 'nav.trainingCalendar', to: '/training/schedule' },
          { labelKey: 'nav.trainingInstructors', to: '/training/instructors' },
        ],
      },
      {
        headingKey: 'nav.certification',
        links: [
          { labelKey: 'nav.verifyCertificate', to: '/verify-certificate' },
          { labelKey: 'nav.contact', to: '/contact' },
        ],
      },
    ],
    feature: {
      labelKey: 'nav.training',
      titleKey: 'training.featureTitle',
      textKey: 'nav.trainingFeatureText',
      to: '/training',
    },
  },
  {
    labelKey: 'nav.news',
    to: '/news',
    alignEnd: true,
    columns: [
      {
        headingKey: 'nav.insights',
        links: [
          { labelKey: 'nav.newsInsights', to: '/news' },
          { labelKey: 'nav.events', to: '/events' },
        ],
      },
      {
        headingKey: 'nav.resources',
        links: [
          { labelKey: 'nav.downloads', to: '/news#resources' },
          { labelKey: 'nav.consultation', to: '/request-consultation' },
        ],
      },
    ],
    feature: {
      labelKey: 'nav.newsFeature',
      titleKey: 'nav.newsFeatureTitle',
      textKey: 'nav.newsFeatureText',
      to: '/news',
    },
  },
  { labelKey: 'nav.contact', to: '/contact' },
]

export const footerNav = {
  company: [
    { labelKey: 'nav.about', to: '/about' },
    { labelKey: 'nav.visionMission', to: '/about/vision-mission' },
    { labelKey: 'nav.leadership', to: '/about/leadership' },
    { labelKey: 'nav.certifications', to: '/about/certifications' },
    { labelKey: 'nav.clientsPartners', to: '/about/clients-partners' },
  ],
  expertise: [
    { labelKey: 'service.cm.title', to: '/services/construction-management-consultancy' },
    { labelKey: 'service.bm.title', to: '/services/business-management-consultancy' },
    { labelKey: 'service.training.title', to: '/services/professional-training' },
    { labelKey: 'service.research.title', to: '/services/research-industry-development' },
    { labelKey: 'nav.projects', to: '/projects' },
  ],
  knowledge: [
    { labelKey: 'nav.training', to: '/training' },
    { labelKey: 'nav.trainingCalendar', to: '/training/schedule' },
    { labelKey: 'nav.verifyCertificate', to: '/verify-certificate' },
    { labelKey: 'nav.newsInsights', to: '/news' },
    { labelKey: 'nav.events', to: '/events' },
    { labelKey: 'nav.downloads', to: '/news#resources' },
  ],
  engage: [
    { labelKey: 'nav.requestConsultation', to: '/request-consultation' },
    { labelKey: 'nav.contact', to: '/contact' },
    { labelKey: 'nav.adminPortal', to: '/admin/login' },
  ],
}

export const adminNav = [
  { labelKey: 'admin.nav.dashboard', to: '/admin/dashboard', icon: 'LayoutDashboard' },
  { labelKey: 'admin.nav.pages', to: '/admin/pages', icon: 'Files' },
  { labelKey: 'admin.nav.profile', to: '/admin/company-profile', icon: 'Building2' },
  { labelKey: 'admin.nav.services', to: '/admin/services', icon: 'Briefcase' },
  { labelKey: 'admin.nav.projects', to: '/admin/projects', icon: 'FolderKanban' },
  { labelKey: 'admin.nav.training', to: '/admin/training', icon: 'GraduationCap' },
  { labelKey: 'admin.nav.registrations', to: '/admin/registrations', icon: 'ClipboardList' },
  { labelKey: 'admin.nav.certificates', to: '/admin/certificates', icon: 'Award' },
  { labelKey: 'admin.nav.news', to: '/admin/news', icon: 'Newspaper' },
  { labelKey: 'admin.nav.media', to: '/admin/media', icon: 'Images' },
  { labelKey: 'admin.nav.inquiries', to: '/admin/inquiries', icon: 'Inbox' },
  { labelKey: 'admin.nav.analytics', to: '/admin/analytics', icon: 'ChartNoAxesCombined' },
  { labelKey: 'admin.nav.users', to: '/admin/users', icon: 'Users' },
  { labelKey: 'admin.nav.settings', to: '/admin/settings', icon: 'Settings' },
]

export const serviceCategories = [
  { id: 'all', labelKey: 'common.all' },
  { id: 'construction-management', labelKey: 'service.cm.shortTitle' },
  { id: 'business-management', labelKey: 'service.bm.shortTitle' },
  { id: 'training', labelKey: 'service.training.shortTitle' },
  { id: 'research', labelKey: 'service.research.shortTitle' },
]
