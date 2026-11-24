/**
 * News, insights and events.
 *
 * Every record marked `source: 'published'` is an announcement or engagement
 * description published by CONSOL. Dates shown are the dates CONSOL publishes.
 * Longer articles are marked `bodyStatus: 'summary-only'` — only the published
 * summary is reproduced, with no invented detail.
 */
export const newsCategories = [
  { id: 'all', labelKey: 'common.all' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'consultancy', label: 'Consultancy' },
  { id: 'training', label: 'Training' },
  { id: 'industry', label: 'Industry' },
]

export const news = [
  {
    slug: 'pearson-vue-authorized-test-center',
    title: 'CONSOL joins the Pearson VUE network as an authorized test center',
    excerpt:
      'We are glad to announce that Construction Solutions joined the Pearson VUE network to offer accessible and secure certification testing. As an authorized test center, we will deliver the world’s leading certification exams for the most recognized programs.',
    date: '2023-03-16',
    category: 'announcements',
    featured: true,
    source: 'published',
    image: '/media/conference.jpg',
    imageNote: 'illustrative',
    bodyStatus: 'summary-only',
    body: [
      'Construction Solutions PLC has become an authorized Pearson VUE test center, extending the company’s certification activity from training delivery to secure examination delivery.',
      'Pearson VUE delivers certification exams for a wide range of professional and technology programmes. As an authorized test center, CONSOL delivers these examinations in Addis Ababa under Pearson VUE test security requirements.',
    ],
    cta: { label: 'Enquire about certification testing', to: '/contact' },
  },
  {
    slug: 'opm-maturity-uiidp-strategic-document',
    title: 'OPM maturity improvement programme presented for the UIIDP',
    excerpt:
      'Preparation of an implementation manual, training delivery and formulation of a strategic document for implementing Organisational Project Management (OPM) maturity improvement initiatives in organisations that conduct construction projects — October 2022.',
    date: '2022-10-27',
    category: 'consultancy',
    featured: true,
    source: 'published',
    image: '/media/site-inspection.jpg',
    imageNote: 'illustrative',
    bodyStatus: 'summary-only',
    body: [
      'Under the Urban Institutional & Infrastructure Development Program (UIIDP) supported by the World Bank, CONSOL delivered an implementation manual, OPM3 assessor training in Bahir Dar, and a strategic document for organisations that deliver construction projects.',
      'The work builds on CONSOL’s use of the PMI® OPM3 standard, with assessment tools customised for the Ethiopian construction industry.',
    ],
    cta: { label: 'See the project record', to: '/projects/opm-maturity-improvement-construction-industry' },
  },
  {
    slug: 'pmp-training-ministry-innovation-technology',
    title: 'PMI® PMP® training delivered for the Ministry of Innovation & Technology',
    excerpt:
      'PMI® PMP® training delivered by CONSOL for the Ministry of Innovation & Technology.',
    date: '2023-05-10',
    category: 'training',
    featured: false,
    source: 'published',
    image: '/media/training.jpg',
    imageNote: 'illustrative',
    bodyStatus: 'summary-only',
    body: [
      'CONSOL delivered PMI® PMP® training for the Ministry of Innovation & Technology as part of its ongoing certification training programme.',
    ],
    cta: { label: 'View PMP® preparation course', to: '/training?category=pmi-certification' },
  },
  {
    slug: 'value-for-money-assessment-kickoff',
    title: 'Value for Money assessment kick-off across 91 urban local governments',
    excerpt:
      'Value for Money assessment of the quality of capital investments for EFY 2013 in 91 ULGs. Kick-off meeting, 27 December 2021.',
    date: '2021-12-27',
    category: 'consultancy',
    featured: false,
    source: 'published',
    image: '/media/adama-city.jpg',
    imageNote: 'illustrative',
    bodyStatus: 'summary-only',
    body: [
      'The assessment covers the full technical and financial review of activities and contracts, together with an assessment of the quality of infrastructure of capital investments for EFY 2013 (2020/21).',
      'The scope covers 91 urban local governments in all regions participating in the UIIDP programme.',
    ],
    cta: { label: 'See the project record', to: '/projects/value-for-money-assessment-uiidp' },
  },
  {
    slug: 'pmi-pmp-training-ethiotelecom',
    title: 'PMI® PMP® training delivered under the Ethiotelecom Master Framework Agreement',
    excerpt:
      'PMI® PMP® training delivered under a Master Framework Agreement with Ethiotelecom (2018–2020).',
    date: '2020-11-19',
    category: 'training',
    featured: false,
    source: 'published',
    image: '/media/office-team.jpg',
    imageNote: 'illustrative',
    bodyStatus: 'summary-only',
    body: [
      'CONSOL delivered PMI® PMP® training to Ethiotelecom under a three-year Master Framework Agreement (2018–2020), training 300 professionals on PMP® and facilitating the certification examination for 16 candidates.',
    ],
    cta: { label: 'Training for organisations', to: '/services/professional-training' },
  },
  {
    slug: 'cicbf-capacity-assessment-completion',
    title: 'CICBF capacity assessment project completion workshop',
    excerpt:
      'Consultancy service for the assessment of construction professionals’ and companies’ capacity gap and development of working systems to address the identified gaps as per the approved Construction Industry Capacity Building Framework (CICBF).',
    date: '2023-06-30',
    category: 'consultancy',
    featured: false,
    source: 'published',
    image: '/media/conference.jpg',
    imageNote: 'illustrative',
    bodyStatus: 'summary-only',
    body: [
      'The project completion workshop was held on 30 June 2023 with the Construction Management Institute, presenting the capacity assessment and the working systems developed against the approved framework.',
    ],
    cta: { label: 'See the project record', to: '/projects/capacity-gap-assessment-cicbf' },
  },
  {
    slug: 'civil-engineering-education-employment-study',
    title: 'Civil engineering education quality and employment study presented',
    excerpt:
      'Assessment of the quality of education and employment opportunities of civil engineering graduates — final presentation, July 2017.',
    date: '2017-07-14',
    category: 'industry',
    featured: false,
    source: 'published',
    image: '/media/library-research.jpg',
    imageNote: 'illustrative',
    bodyStatus: 'summary-only',
    body: [
      'The study, prepared for the Ethiopian Association of Civil Engineers (EACE), assessed the quality of civil engineering education and the employment opportunities available to graduates.',
    ],
    cta: { label: 'See the project record', to: '/projects/civil-engineering-education-employment-review' },
  },
  {
    slug: 'construction-procurement-training-ercc',
    title: 'Engineering procurement training for the Ethiopian Road Construction Corporation',
    excerpt:
      'Engineering procurement training delivered in October 2015 at the Ghion Hotel, Addis Ababa.',
    date: '2015-10-12',
    category: 'training',
    featured: false,
    source: 'published',
    image: '/media/road-infrastructure.jpg',
    imageNote: 'illustrative',
    bodyStatus: 'summary-only',
    body: [
      'CONSOL delivered procurement training for the Ethiopian Road Construction Corporation at the Ghion Hotel in October 2015.',
    ],
    cta: { label: 'Procurement course', to: '/training?category=construction-management' },
  },
]

export const events = [
  {
    slug: 'opm3-assessors-training-bahir-dar',
    title: 'OPM3 assessors training — Bahir Dar',
    date: '2022-10-01',
    type: 'past',
    location: 'Bahir Dar, Ethiopia',
    summary:
      'Assessor training delivered as part of the OPM maturity improvement programme for organisations that conduct construction projects.',
    source: 'published',
    image: '/media/conference.jpg',
    newsSlug: 'opm-maturity-uiidp-strategic-document',
  },
  {
    slug: 'cicbf-completion-workshop',
    title: 'CICBF capacity assessment completion workshop',
    date: '2023-06-30',
    type: 'past',
    location: 'Addis Ababa, Ethiopia',
    summary:
      'Project completion workshop presenting the capacity gap assessment and working systems developed for the Construction Management Institute.',
    source: 'published',
    image: '/media/training.jpg',
    newsSlug: 'cicbf-capacity-assessment-completion',
  },
  {
    slug: 'vfM-assessment-kickoff',
    title: 'Value for Money assessment kick-off meeting',
    date: '2021-12-27',
    type: 'past',
    location: 'Addis Ababa, Ethiopia',
    summary:
      'Kick-off meeting for the Value for Money assessment of capital investments for EFY 2013 across 91 urban local governments.',
    source: 'published',
    image: '/media/site-inspection.jpg',
    newsSlug: 'value-for-money-assessment-kickoff',
  },
  {
    slug: 'contractor-performance-system-final-presentation',
    title: 'Contractor performance evaluation system — final presentation',
    date: '2018-05-10',
    type: 'past',
    location: 'Hawassa, Ethiopia',
    summary:
      'Final presentation of the web-based contractor/project performance evaluation and construction information management system for the South Construction Bureau.',
    source: 'published',
    image: '/media/road-infrastructure.jpg',
    newsSlug: null,
  },
]

export const resources = [
  {
    id: 'ecp-mms',
    title: 'Ethiopian Construction Project Management Manual Series (ECP-MMS)',
    format: '19 manuals',
    year: 2017,
    status: 'pending',
    description:
      'Prepared for the Ethiopian Construction Management Institute. Publication of the full series is a client decision.',
  },
  {
    id: 'cicbf-implementation',
    title: 'CICBF capacity gap implementation manual',
    format: 'Manual',
    year: 2021,
    status: 'pending',
    description:
      'Implementation manual and working systems developed under the approved Construction Industry Capacity Building Framework.',
  },
  {
    id: 'competence-framework',
    title: 'Engineering & architecture competence standards',
    format: 'Body of knowledge & standards',
    year: 2019,
    status: 'pending',
    description:
      'Body of knowledge and occupational standards prepared for the professionals competence assessment system.',
  },
  {
    id: 'opm-implementation',
    title: 'OPM maturity improvement implementation manual',
    format: 'Manual & strategic document',
    year: 2022,
    status: 'pending',
    description:
      'Implementation manual and strategic document prepared for the UIIDP programme.',
  },
]

export function getNewsBySlug(slug) {
  return news.find((item) => item.slug === slug)
}

export function getEventBySlug(slug) {
  return events.find((item) => item.slug === slug)
}

export function getRelatedNews(article, limit = 3) {
  return news
    .filter((item) => item.slug !== article.slug && item.category === article.category)
    .slice(0, limit)
}
