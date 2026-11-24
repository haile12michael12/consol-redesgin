/**
 * ADMIN DEMONSTRATION DATA.
 *
 * Every record in this file is fabricated for interface demonstration only.
 * None of it represents real CONSOL visitors, inquiries, registrations,
 * people or activity. The admin UI labels it as demo everywhere it appears.
 * Replace each dataset with a Laravel API response before launch.
 */
export const kpis = [
  { key: 'visitors', labelKey: 'admin.kpi.visitors', value: '4,182', delta: '+12.4%', trend: 'up' },
  { key: 'inquiries', labelKey: 'admin.kpi.inquiries', value: '86', delta: '+8.1%', trend: 'up' },
  { key: 'consultations', labelKey: 'admin.kpi.consultations', value: '31', delta: '+3.2%', trend: 'up' },
  { key: 'registrations', labelKey: 'admin.kpi.registrations', value: '147', delta: '−2.6%', trend: 'down' },
]

export const trafficSeries = [
  { day: 'Wk 1', sessions: 720, inquiries: 14 },
  { day: 'Wk 2', sessions: 895, inquiries: 19 },
  { day: 'Wk 3', sessions: 1040, inquiries: 16 },
  { day: 'Wk 4', sessions: 1180, inquiries: 24 },
  { day: 'Wk 5', sessions: 1347, inquiries: 31 },
]

export const inquiriesBySource = [
  { name: 'Contact form', value: 34, share: 0.4 },
  { name: 'Consultation form', value: 31, share: 0.36 },
  { name: 'Direct email', value: 13, share: 0.15 },
  { name: 'Telephone', value: 8, share: 0.09 },
]

export const registrationsByArea = [
  { name: 'Construction management', value: 52 },
  { name: 'Project management software', value: 38 },
  { name: 'Engineering software', value: 29 },
  { name: 'Certification', value: 28 },
]

export const recentActivity = [
  { id: 1, action: 'New consultation request', subject: 'Demo record — infrastructure programme', time: '14 min ago', kind: 'consultation' },
  { id: 2, action: 'Course registration', subject: 'Demo record — PMP® preparation', time: '52 min ago', kind: 'registration' },
  { id: 3, action: 'Article published', subject: 'Demo record — Pearson VUE announcement', time: '3 hours ago', kind: 'news' },
  { id: 4, action: 'Project updated', subject: 'Demo record — OPM maturity programme', time: 'Yesterday', kind: 'project' },
  { id: 5, action: 'Inquiry received', subject: 'Demo record — general enquiry', time: 'Yesterday', kind: 'inquiry' },
]

export const pages = [
  { id: 1, title: 'Home', path: '/', status: 'published', updated: '2026-11-12', sections: 10 },
  { id: 2, title: 'About CONSOL', path: '/about', status: 'published', updated: '2026-11-08', sections: 4 },
  { id: 3, title: 'Vision & mission', path: '/about/vision-mission', status: 'published', updated: '2026-10-30', sections: 2 },
  { id: 4, title: 'Leadership', path: '/about/leadership', status: 'published', updated: '2026-10-30', sections: 2 },
  { id: 5, title: 'Services', path: '/services', status: 'published', updated: '2026-11-02', sections: 3 },
  { id: 6, title: 'Projects', path: '/projects', status: 'published', updated: '2026-11-15', sections: 2 },
  { id: 7, title: 'Training', path: '/training', status: 'published', updated: '2026-11-18', sections: 4 },
  { id: 8, title: 'News & insights', path: '/news', status: 'published', updated: '2026-11-20', sections: 3 },
  { id: 9, title: 'Contact', path: '/contact', status: 'published', updated: '2026-11-05', sections: 3 },
  { id: 10, title: 'Privacy notice', path: '/privacy', status: 'draft', updated: '2026-11-21', sections: 1 },
]

export const registrations = [
  { id: 'REG-1042', name: 'Demo Participant A', course: 'PMI® PMP® preparation', organisation: 'Demo Organisation', date: '2026-11-20', status: 'new' },
  { id: 'REG-1041', name: 'Demo Participant B', course: 'Revit Architecture', organisation: 'Demo Organisation', date: '2026-11-20', status: 'open' },
  { id: 'REG-1040', name: 'Demo Participant C', course: 'ETABS — Structural Analysis', organisation: 'Demo Organisation', date: '2026-11-19', status: 'closed' },
  { id: 'REG-1039', name: 'Demo Participant D', course: 'Construction Project Management', organisation: 'Demo Organisation', date: '2026-11-18', status: 'new' },
  { id: 'REG-1038', name: 'Demo Participant E', course: 'Primavera P6', organisation: 'Demo Organisation', date: '2026-11-17', status: 'open' },
]

export const inquiries = [
  { id: 'INQ-208', name: 'Demo Contact A', type: 'Consultation', subject: 'Demo subject — PMO setup', date: '2026-11-20', status: 'new' },
  { id: 'INQ-207', name: 'Demo Contact B', type: 'General', subject: 'Demo subject — training schedule', date: '2026-11-20', status: 'open' },
  { id: 'INQ-206', name: 'Demo Contact C', type: 'Consultation', subject: 'Demo subject — feasibility study', date: '2026-11-19', status: 'closed' },
  { id: 'INQ-205', name: 'Demo Contact D', type: 'Certification', subject: 'Demo subject — Pearson VUE exam', date: '2026-11-18', status: 'open' },
]

export const mediaItems = [
  { id: 1, name: 'hero-construction.jpg', type: 'Image', size: '160 KB', updated: '2026-11-20', usage: 'Homepage hero' },
  { id: 2, name: 'consultancy.jpg', type: 'Image', size: '197 KB', updated: '2026-11-19', usage: 'Services' },
  { id: 3, name: 'training.jpg', type: 'Image', size: '237 KB', updated: '2026-11-18', usage: 'Training' },
  { id: 4, name: 'company-profile.pdf', type: 'Document', size: '—', updated: 'Pending', usage: 'About' },
]

export const users = [
  { id: 1, name: 'Demo Administrator', email: 'admin@example.com', role: 'Administrator', lastActive: 'Today', status: 'open' },
  { id: 2, name: 'Demo Editor', email: 'editor@example.com', role: 'Editor', lastActive: 'Yesterday', status: 'open' },
  { id: 3, name: 'Demo Training Officer', email: 'training@example.com', role: 'Training manager', lastActive: '3 days ago', status: 'closed' },
]

export const certificates = [
  { id: 'CERT-031', holder: 'Demo Participant A', course: 'Construction Project Management', issued: '2026-09-12', status: 'published' },
  { id: 'CERT-030', holder: 'Demo Participant B', course: 'Revit Architecture', issued: '2026-09-04', status: 'published' },
  { id: 'CERT-029', holder: 'Demo Participant C', course: 'PMI® PMP® preparation', issued: '—', status: 'review' },
]

/** Module-specific demo tables (see the file header: illustration only). */
export const serviceRows = [
  { id: 1, title: 'Construction Management Consultancy', slug: 'construction-management-consultancy', services: 7, status: 'published', updated: '2026-11-02' },
  { id: 2, title: 'Business Management Consultancy', slug: 'business-management-consultancy', services: 8, status: 'published', updated: '2026-11-02' },
  { id: 3, title: 'Professional Training & Certification', slug: 'professional-training', services: 7, status: 'published', updated: '2026-11-16' },
  { id: 4, title: 'Research & Industry Development', slug: 'research-industry-development', services: 5, status: 'review', updated: '2026-11-18' },
]

export const projectRows = [
  { id: 1, title: 'OPM maturity improvement', client: 'UIIDP programme', year: 2022, status: 'published', updated: '2026-11-15' },
  { id: 2, title: 'Ethiopian Construction Project Management Manuals', client: 'ECMI', year: 2017, status: 'published', updated: '2026-11-12' },
  { id: 3, title: 'Value for Money assessment', client: 'UIIDP programme', year: 2022, status: 'published', updated: '2026-11-11' },
  { id: 4, title: 'CICBF capacity gap assessment', client: 'Construction Management Institute', year: 2021, status: 'review', updated: '2026-11-19' },
]

export const courseRows = [
  { id: 'pmp-certification-preparation', title: 'PMI® PMP® preparation', category: 'PMI® certification', sessions: 2, status: 'published', updated: '2026-11-18' },
  { id: 'revit-architecture-bim', title: 'Revit Architecture', category: 'Autodesk® certification', sessions: 1, status: 'published', updated: '2026-11-18' },
  { id: 'construction-project-management', title: 'Construction Project Management', category: 'Construction management', sessions: 3, status: 'published', updated: '2026-11-16' },
  { id: 'etabs-structural-analysis', title: 'ETABS — Structural Analysis', category: 'Engineering software', sessions: 1, status: 'draft', updated: '2026-11-14' },
]

export const newsRows = [
  { id: 1, title: 'Pearson VUE authorized test center', type: 'Announcement', date: '2023-03-16', status: 'published', updated: '2026-11-20' },
  { id: 2, title: 'OPM maturity programme presented for UIIDP', type: 'Consultancy', date: '2022-10-27', status: 'published', updated: '2026-11-19' },
  { id: 3, title: 'Upcoming quarterly training plan', type: 'Training', date: null, status: 'review', updated: '2026-11-21' },
  { id: 4, title: 'Draft — 2026 industry outlook', type: 'Industry', date: null, status: 'draft', updated: '2026-11-22' },
]

export const profileSections = [
  { id: 1, section: 'Company overview', status: 'published', source: 'Published wording', updated: '2026-11-12' },
  { id: 2, section: 'Vision & mission', status: 'published', source: 'Published wording', updated: '2026-10-30' },
  { id: 3, section: 'Core values', status: 'review', source: 'Awaiting approval', updated: '2026-11-21' },
  { id: 4, section: 'Leadership & team', status: 'published', source: 'Contact page', updated: '2026-10-30' },
  { id: 5, section: 'Company profile PDF', status: 'review', source: 'Pending file', updated: '2026-11-21' },
]
