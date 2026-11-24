/**
 * Project records.
 *
 * `source: 'published'` — title, client and scope are transcribed from
 * engagements published on constructionsolutionsplc.com. Do not edit the facts.
 * `source: 'demo'` — illustrative records showing structure only. Never present
 * these as CONSOL work.
 *
 * Photographs are licensed illustrative imagery, not verified project photos.
 */
export const projectCategories = [
  { id: 'all', labelKey: 'common.all' },
  { id: 'construction-management', label: 'Construction management' },
  { id: 'business-management', label: 'Business management' },
  { id: 'capacity-development', label: 'Capacity development' },
  { id: 'research', label: 'Research & assessment' },
]

export const projects = [
  {
    slug: 'opm-maturity-improvement-construction-industry',
    title:
      'Organisational Project Management (OPM) maturity improvement in the construction industry',
    client: 'Ministry of Urban & Infrastructure, UIIDP Program (World Bank funded project)',
    location: 'Federal programme, Ethiopia',
    year: 2022,
    category: 'construction-management',
    featured: true,
    source: 'published',
    image: '/media/conference.jpg',
    imageNote: 'illustrative',
    summary:
      'Preparation of an implementation manual, training delivery and formulation of a strategic document for implementing Organisational Project Management maturity improvement in organisations that conduct construction projects.',
    scope: [
      'Preparation of an implementation manual for OPM maturity improvement',
      'Training delivery, including OPM3 assessor training in Bahir Dar (October 2022)',
      'Formulation of a strategic document for implementation across participating organisations',
    ],
    services: ['OPM3 maturity assessment', 'Strategic documentation', 'Trainer and assessor development'],
    published: 'October 2022',
  },
  {
    slug: 'professional-competence-assessment-certification-system',
    title:
      'Professionals competence assessment and certification system for engineering, architecture and related fields',
    client: 'Ethiopian Construction Management Institute',
    location: 'National',
    year: 2019,
    category: 'capacity-development',
    featured: true,
    source: 'published',
    image: '/media/site-inspection.jpg',
    imageNote: 'illustrative',
    summary:
      'Preparation of a body of knowledge, occupational standards and a professionals competence assessment and certification system.',
    scope: [
      'Preparation of the occupational body of knowledge',
      'Development of occupational standards',
      'Design of the competence assessment and certification system',
    ],
    services: ['Competency frameworks', 'Occupational standards', 'Certification system design'],
    published: '2019',
  },
  {
    slug: 'ethiopian-construction-project-management-manuals',
    title: 'Ethiopian Construction Project Management Manual Series (ECP-MMS)',
    client: 'Ethiopian Construction Management Institute',
    location: 'National',
    year: 2017,
    category: 'construction-management',
    featured: true,
    source: 'published',
    image: '/media/library-research.jpg',
    imageNote: 'illustrative',
    summary:
      'Consultancy service for the preparation of the Ethiopian Construction Project Management Manual Series — 19 manuals.',
    scope: [
      'Authoring of 19 project management manuals',
      'Alignment with national construction project management practice',
      'Consultation and review with the client institute',
    ],
    services: ['Manual development', 'Process documentation', 'Technical authorship'],
    published: '2017',
  },
  {
    slug: 'value-for-money-assessment-uiidp',
    title: 'Value for Money (VfM) assessment of capital investments for EFY 2013',
    client: 'Ministry of Urban & Infrastructure, UIIDP Program (World Bank funded project)',
    location: '91 urban local governments, all regions',
    year: 2022,
    category: 'business-management',
    featured: false,
    source: 'published',
    image: '/media/civil-works.jpg',
    imageNote: 'illustrative',
    summary:
      'Full technical and financial review of various activities and contracts, and an assessment of the quality of infrastructure of capital investments for EFY 2013 (2020/21) across 91 urban local governments participating in UIIDP.',
    scope: [
      'Technical and financial review of contracts',
      'Assessment of infrastructure quality of capital investments',
      'Coverage across 91 urban local governments in all regions',
    ],
    services: ['Value for money assessment', 'Technical audit', 'Financial review'],
    published: '2022',
    event: 'Kick-off meeting 27 December 2021',
  },
  {
    slug: 'business-process-reengineering-balanced-scorecard',
    title: 'Business process re-engineering (BPR) and Balanced Score Card (BSC) design and implementation',
    client: 'Ministry of Urban Development, Housing & Construction — Government Office Construction Project Office',
    location: 'Addis Ababa',
    year: 2015,
    category: 'business-management',
    featured: false,
    source: 'published',
    image: '/media/consultancy.jpg',
    imageNote: 'illustrative',
    summary:
      'Consultancy service to redesign business processes and design and implement a Balanced Score Card system.',
    scope: [
      'Business process re-engineering',
      'Balanced Score Card design',
      'Implementation support',
    ],
    services: ['Business process re-engineering', 'Performance management', 'Implementation support'],
    published: '2015',
  },
  {
    slug: 'civil-engineering-education-employment-review',
    title:
      'Reviewing the quality of civil engineering education and employment opportunities for civil engineers in Ethiopia',
    client: 'Ethiopian Association of Civil Engineers (EACE)',
    location: 'National',
    year: 2017,
    category: 'research',
    featured: false,
    source: 'published',
    image: '/media/training.jpg',
    imageNote: 'illustrative',
    summary:
      'Assessment of the quality of education and employment opportunities for civil engineering graduates, with a final presentation in July 2017.',
    scope: [
      'Review of civil engineering education quality',
      'Assessment of employment opportunities for graduates',
      'Final presentation to the client association (July 2017)',
    ],
    services: ['Applied research', 'Labour-market assessment', 'Education quality review'],
    published: 'July 2017',
  },
  {
    slug: 'performance-related-pay-system-teklebrhan-ambaye',
    title: 'Design and implementation of an effective project performance related pay (PRP) system',
    client: 'Teklebrhan Ambaye Construction PLC',
    location: 'Ethiopia',
    year: 2017,
    category: 'business-management',
    featured: false,
    source: 'published',
    image: '/media/office-team.jpg',
    imageNote: 'illustrative',
    summary:
      'Consultancy service to design and implement an effective project performance related pay system for a private construction contractor.',
    scope: [
      'Design of the performance related pay system',
      'Implementation support inside the contracting organisation',
      'Performance measurement criteria',
    ],
    services: ['Performance related pay', 'Compensation design', 'Implementation support'],
    published: '2017',
  },
  {
    slug: 'capacity-gap-assessment-cicbf',
    title:
      'Assessment of construction professionals and companies capacity gap under the Construction Industry Capacity Building Framework',
    client: 'Construction Management Institute',
    location: 'National',
    year: 2021,
    category: 'capacity-development',
    featured: false,
    source: 'published',
    image: '/media/adama-city.jpg',
    imageNote: 'illustrative',
    summary:
      'Assessment of the capacity gap of contractors, consultants, employers, SMEs and professionals, and development of an implementation manual and working systems as per the approved CICBF.',
    scope: [
      'Capacity gap assessment across contractor, consultant, employer and SME segments',
      'Development of an implementation manual',
      'Design of working systems aligned to the approved CICBF',
    ],
    services: ['Capacity assessment', 'Framework development', 'Working systems design'],
    published: '2021',
    event: 'Project completion workshop 30 June 2023',
  },
  {
    slug: 'contractor-performance-evaluation-information-system',
    title: 'Web-based contractor performance evaluation and construction information management system',
    client: 'SNNPRS South Construction Bureau',
    location: 'Southern Nations, Nationalities and Peoples Regional State',
    year: 2018,
    category: 'construction-management',
    featured: false,
    source: 'published',
    image: '/media/road-infrastructure.jpg',
    imageNote: 'illustrative',
    summary:
      'Assessment of more than 600 completed and ongoing building projects (2012–2017) and delivery of a web-based contractor performance evaluation and construction information management system.',
    scope: [
      'Assessment of 600+ building projects (2012–2017)',
      'Web-based contractor performance evaluation system',
      'Construction information management system',
      'Final presentation May 2018',
    ],
    services: ['Project performance assessment', 'Information system design', 'Data collection at scale'],
    published: 'May 2018',
  },
  {
    slug: 'defence-enterprises-organisational-structure',
    title: 'Organisational structure, job grading, evaluation and financial analysis',
    client: 'Defense Design Enterprise, Defense Construction Enterprise, Defense Construction Material Manufacturing Enterprise',
    location: 'Ethiopia',
    year: 2019,
    category: 'business-management',
    featured: false,
    source: 'published',
    image: '/media/consultancy.jpg',
    imageNote: 'illustrative',
    summary:
      'Preparation of organisational structure, job grading and evaluation, and financial analysis for three defence-sector enterprises.',
    scope: [
      'Organisational structure design',
      'Job grading and evaluation',
      'Financial analysis',
    ],
    services: ['Organisational design', 'Job evaluation', 'Financial analysis'],
    published: '2019',
  },
  {
    slug: 'feasibility-study-army-shoe-canned-food-factory',
    title: 'Feasibility study — Army shoe and canned food factory',
    client: 'Defence Army Foundation',
    location: 'Ethiopia',
    year: 2021,
    category: 'business-management',
    featured: false,
    source: 'published',
    image: '/media/civil-works.jpg',
    imageNote: 'illustrative',
    summary:
      'Feasibility study for the establishment of an army shoe production and canned food factory.',
    scope: ['Market and technical feasibility', 'Financial modelling', 'Investment recommendation'],
    services: ['Feasibility study', 'Financial analysis', 'Industrial planning'],
    published: '2021',
  },
  {
    slug: 'pmi-pmp-master-framework-agreement',
    title: 'PMI® PMP® training and exam facilitation — two-year Master Framework Agreement',
    client: 'Construction Management Institute',
    location: 'Ethiopia',
    year: 2023,
    category: 'capacity-development',
    featured: false,
    source: 'published',
    image: '/media/training.jpg',
    imageNote: 'illustrative',
    summary:
      'Delivery of PMI® PMP® training and exam facilitation under a two-year Master Framework Agreement (2023–2024). 200 professionals were trained in the first year and exams were facilitated for 90 candidates at the time of publication.',
    scope: [
      'PMI® PMP® training delivery',
      'Examination facilitation',
      'Delivery to construction industry professionals',
    ],
    services: ['Certification training', 'Exam facilitation', 'Programme management'],
    published: '2023',
  },

  // --- Demonstration records -------------------------------------------------
  {
    slug: 'demo-campus-infrastructure-programme',
    title: 'Campus infrastructure delivery assurance',
    client: null,
    location: null,
    year: 2024,
    category: 'construction-management',
    featured: false,
    source: 'demo',
    image: '/media/structure.jpg',
    imageNote: 'illustrative',
    summary:
      'Illustrative record showing how a programme-level delivery assurance engagement is presented. Not a CONSOL engagement.',
    scope: [
      'Independent schedule and cost review across a multi-site programme',
      'Risk register consolidation and reporting',
      'Monthly delivery assurance reports to the client board',
    ],
    services: ['Programme assurance', 'Risk management', 'Reporting'],
    published: null,
  },
  {
    slug: 'demo-water-utility-capacity-review',
    title: 'Water utility capacity and operating model review',
    client: null,
    location: null,
    year: 2024,
    category: 'capacity-development',
    featured: false,
    source: 'demo',
    image: '/media/civil-works.jpg',
    imageNote: 'illustrative',
    summary:
      'Illustrative record showing the structure of an organisational capacity review. Not a CONSOL engagement.',
    scope: [
      'Functional capacity assessment across delivery units',
      'Operating model options with costs',
      'Implementation roadmap',
    ],
    services: ['Capacity assessment', 'Operating model design'],
    published: null,
  },
]

export const publishedProjects = projects.filter((project) => project.source === 'published')

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug)
}

export function getFeaturedProjects(limit = 3) {
  return publishedProjects.filter((project) => project.featured).slice(0, limit)
}

export function getRelatedProjects(project, limit = 3) {
  return publishedProjects
    .filter((item) => item.slug !== project.slug && item.category === project.category)
    .slice(0, limit)
}

export function getProjectYears() {
  return [...new Set(publishedProjects.map((project) => project.year))].sort((a, b) => b - a)
}
