/**
 * Training catalogue.
 *
 * Titles, category, certification body and duration are transcribed from the
 * published CONSOL training pages. Learning objectives, audience and curriculum
 * outlines are marked `outline: 'demo'` — they describe typical content for a
 * course of this type and must be replaced with approved syllabus text before
 * launch. No dates, fees, venues or instructors are published here.
 */
import { useT } from '@/i18n/LanguageProvider'

export const trainingCategories = [
  { id: 'all', labelKey: 'common.all' },
  { id: 'construction-management', labelKey: 'training.cat.construction' },
  { id: 'construction-management-software', labelKey: 'training.cat.software' },
  { id: 'engineering-software', labelKey: 'training.cat.engineering' },
  { id: 'pmi-certification', labelKey: 'training.cat.pmi' },
  { id: 'autodesk-certification', labelKey: 'training.cat.autodesk' },
]

const genericObjectives = [
  'Apply the core concepts and terminology in day-to-day project work',
  'Use the methods and tools introduced during the sessions on a live project',
  'Interpret and produce the documents required by the process',
  'Identify common failure points and the controls that prevent them',
]

const genericAudience = [
  'Engineers, architects and construction professionals',
  'Project and programme managers',
  'Contractors, consultants and client representatives',
  'Technical staff moving into a management role',
]

const genericCurriculum = [
  { title: 'Foundations', text: 'Terminology, standards and the operating context.' },
  { title: 'Methods', text: 'The core techniques, applied to worked examples.' },
  { title: 'Application', text: 'Exercises based on realistic project scenarios.' },
  { title: 'Review', text: 'Assessment, feedback and next steps.' },
]

function course(record) {
  return {
    id: record.id,
    title: record.title,
    category: record.category,
    duration: record.duration,
    durationUnit: record.durationUnit ?? 'hours',
    certificationBody: record.certificationBody ?? null,
    image: record.image,
    summary: record.summary,
    objectives: record.objectives ?? genericObjectives,
    audience: record.audience ?? genericAudience,
    curriculum: record.curriculum ?? genericCurriculum,
    source: 'published',
    outline: 'demo',
    featured: Boolean(record.featured),
    level: record.level ?? 'Professional',
  }
}

export const courses = [
  // Construction management --------------------------------------------------
  course({
    id: 'construction-project-management',
    title: 'Construction Project Management',
    category: 'construction-management',
    duration: 34,
    image: '/media/training.jpg',
    featured: true,
    summary:
      'A practice-based programme covering the planning, coordination and control of construction projects from inception to handover.',
    objectives: [
      'Structure a construction project using a work breakdown structure',
      'Build and maintain a schedule and a cost baseline',
      'Manage change, claims and communication on site',
      'Run progress meetings and report performance to the client',
    ],
    curriculum: [
      { title: 'Project initiation and scope', text: 'Brief, stakeholders, scope definition and the WBS.' },
      { title: 'Time and cost planning', text: 'Scheduling, resource planning and cost baselines.' },
      { title: 'Execution and control', text: 'Progress measurement, earned value and change control.' },
      { title: 'Closing', text: 'Handover, close-out documentation and lessons learned.' },
    ],
  }),
  course({
    id: 'claims-dispute-resolution',
    title: 'Claims, Claims Analysis, Dispute & Dispute Resolution',
    category: 'construction-management',
    duration: 24,
    image: '/media/consultancy.jpg',
    summary:
      'How construction claims arise, how they are analysed and evidenced, and how disputes are resolved without damaging the project.',
  }),
  course({
    id: 'construction-supervision-contract-administration',
    title: 'Construction Supervision & Contract Administration',
    category: 'construction-management',
    duration: 24,
    image: '/media/site-inspection.jpg',
    summary:
      'Supervision duties, contract administration and the documentation that protects both client and contractor.',
  }),
  course({
    id: 'road-project-management',
    title: 'Enhanced Construction Management — Road Project Management',
    category: 'construction-management',
    duration: 28,
    image: '/media/road-infrastructure.jpg',
    summary:
      'Construction management applied to road works: sequencing, plant and materials, quality control and progress management.',
  }),
  course({
    id: 'road-maintenance-management',
    title: 'Road Maintenance Management',
    category: 'construction-management',
    duration: 28,
    image: '/media/road-infrastructure.jpg',
    summary:
      'Planning and managing road maintenance programmes, from condition assessment to works delivery.',
  }),
  course({
    id: 'construction-resource-management',
    title: 'Construction Resource Management',
    category: 'construction-management',
    duration: 52,
    image: '/media/office-team.jpg',
    summary:
      'Managing labour, plant, materials and subcontractors so that resources match the programme and the budget.',
  }),
  course({
    id: 'construction-claim-adjudication-arbitration',
    title: 'Construction Claim, Adjudication & Arbitration',
    category: 'construction-management',
    duration: 24,
    image: '/media/library-research.jpg',
    summary:
      'The formal routes for resolving construction disputes, and how to prepare a case that survives scrutiny.',
  }),
  course({
    id: 'construction-management-non-engineers',
    title: 'Construction Management for Non-Engineering Professionals',
    category: 'construction-management',
    duration: 28,
    image: '/media/consultancy.jpg',
    summary:
      'Construction management for finance, legal, procurement and administrative professionals working alongside engineering teams.',
  }),
  course({
    id: 'procurement-civil-construction-works',
    title: 'Procurement for Civil Construction Works',
    category: 'construction-management',
    duration: 34,
    image: '/media/civil-works.jpg',
    summary:
      'Procurement strategy, tender documents, evaluation and contract award for civil construction works.',
  }),

  // Construction management software ---------------------------------------
  course({
    id: 'ms-project',
    title: 'MS Project',
    category: 'construction-management-software',
    duration: 30,
    image: '/media/software-workstation.jpg',
    summary:
      'Building, resourcing and tracking a construction programme in Microsoft Project.',
  }),
  course({
    id: 'navisworks-manage',
    title: 'Autodesk® Navisworks Manage',
    category: 'construction-management-software',
    duration: 40,
    image: '/media/software-workstation.jpg',
    certificationBody: 'Autodesk® ATC',
    summary:
      'Clash detection, model aggregation and construction simulation for project coordination.',
  }),
  course({
    id: 'advanced-excel-civil-engineers',
    title: 'Advanced Excel for Civil Engineers',
    category: 'construction-management-software',
    duration: 32,
    image: '/media/library-research.jpg',
    summary:
      'Spreadsheet methods for quantity take-off, progress tracking and engineering calculations.',
  }),
  course({
    id: 'primavera-planning-scheduling',
    title: 'Construction Planning & Scheduling using Primavera P6',
    category: 'construction-management-software',
    duration: 39,
    image: '/media/software-workstation.jpg',
    featured: true,
    summary:
      'Planning and scheduling construction projects in Primavera, including baselines, progress updates and reporting.',
  }),

  // Engineering software ----------------------------------------------------
  course({
    id: 'sap-structural-analysis',
    title: 'SAP — Structural Analysis',
    category: 'engineering-software',
    duration: 36,
    image: '/media/structure.jpg',
    summary: 'Structural modelling, analysis and design checks using SAP.',
  }),
  course({
    id: 'etabs-structural-analysis',
    title: 'ETABS — Structural Analysis & Design',
    category: 'engineering-software',
    duration: 40,
    image: '/media/structure.jpg',
    featured: true,
    summary:
      'Building structural modelling, analysis and design in ETABS, from model set-up to design output.',
  }),
  course({
    id: 'inroads-road-design',
    title: 'InRoads — Road Design',
    category: 'engineering-software',
    duration: 36,
    image: '/media/road-infrastructure.jpg',
    summary: 'Road geometry, alignment and corridor design using InRoads.',
  }),
  course({
    id: 'watercad',
    title: 'WaterCAD',
    category: 'engineering-software',
    duration: 36,
    image: '/media/civil-works.jpg',
    summary: 'Water distribution network modelling, analysis and design.',
  }),
  course({
    id: 'sewercad',
    title: 'SewerCAD',
    category: 'engineering-software',
    duration: 40,
    image: '/media/civil-works.jpg',
    summary: 'Sanitary sewer network modelling and design.',
  }),
  course({
    id: 'stormcad',
    title: 'StormCAD',
    category: 'engineering-software',
    duration: 36,
    image: '/media/civil-works.jpg',
    summary: 'Storm drainage network analysis and design.',
  }),
  course({
    id: 'hecrash',
    title: 'HEC-RAS',
    category: 'engineering-software',
    duration: 36,
    image: '/media/structure.jpg',
    summary: 'River hydraulics, flood profiles and bridge hydraulic analysis.',
  }),
  course({
    id: 'hechms',
    title: 'HEC-HMS',
    category: 'engineering-software',
    duration: 36,
    image: '/media/civil-works.jpg',
    summary: 'Hydrologic modelling and rainfall-runoff analysis for catchments.',
  }),
  course({
    id: 'modflow',
    title: 'MODFLOW',
    category: 'engineering-software',
    duration: 36,
    image: '/media/civil-works.jpg',
    summary: 'Groundwater flow modelling for water resource assessment.',
  }),
  course({
    id: 'eaglepoint-water-irrigation',
    title: 'Eagle Point — Water & Irrigation',
    category: 'engineering-software',
    duration: 36,
    image: '/media/road-infrastructure.jpg',
    summary: 'Design of water supply and irrigation systems.',
  }),
  course({
    id: 'autocad-utilities',
    title: 'AutoCAD® — Management of Utilities',
    category: 'engineering-software',
    duration: 24,
    image: '/media/software-workstation.jpg',
    certificationBody: 'Autodesk® ATC',
    summary: 'Drafting and managing utility drawing sets in AutoCAD.',
  }),

  // PMI certification -------------------------------------------------------
  course({
    id: 'pmp-certification-preparation',
    title: 'PMI® PMP® — Project Management Professional',
    category: 'pmi-certification',
    duration: 35,
    durationUnit: 'PDUs',
    certificationBody: 'PMI® ATP',
    image: '/media/training.jpg',
    featured: true,
    summary:
      'Certification preparation for the PMI® Project Management Professional credential, delivered as an Authorized PMI® Training Partner.',
    objectives: [
      'Cover the PMP® examination content outline with an accredited instructor',
      'Apply predictive, agile and hybrid delivery approaches to scenarios',
      'Practise examination-style questions with feedback',
      'Prepare the application and examination process',
    ],
  }),
  course({
    id: 'capm-certification-preparation',
    title: 'PMI® CAPM® — Certified Associate in Project Management',
    category: 'pmi-certification',
    duration: 24,
    durationUnit: 'PDUs',
    certificationBody: 'PMI® ATP',
    image: '/media/office-team.jpg',
    summary:
      'Entry-level project management certification preparation for early-career professionals.',
  }),

  // Autodesk certification --------------------------------------------------
  course({
    id: 'revit-architecture-bim',
    title: 'BIM for Architecture — Revit Architecture',
    category: 'autodesk-certification',
    duration: 36,
    certificationBody: 'Autodesk® ATC',
    image: '/media/software-workstation.jpg',
    featured: true,
    summary:
      'Building information modelling for architecture using Autodesk® Revit, delivered as an Authorized Autodesk® Training Center.',
  }),
  course({
    id: 'revit-structure-bim',
    title: 'BIM for Structure — Revit Structure',
    category: 'autodesk-certification',
    duration: 36,
    certificationBody: 'Autodesk® ATC',
    image: '/media/structure.jpg',
    summary: 'Structural modelling and documentation workflows in Revit.',
  }),
  course({
    id: 'revit-mep-bim',
    title: 'BIM for MEP — Revit MEP',
    category: 'autodesk-certification',
    duration: 36,
    certificationBody: 'Autodesk® ATC',
    image: '/media/software-workstation.jpg',
    summary: 'Mechanical, electrical and plumbing modelling and coordination in Revit.',
  }),
  course({
    id: 'bim-360-collaboration',
    title: 'Virtual Collaboration & BIM 360',
    category: 'autodesk-certification',
    duration: 32,
    certificationBody: 'Autodesk® ATC',
    image: '/media/consultancy.jpg',
    summary: 'Collaborative BIM project delivery and model management using BIM 360.',
  }),
  course({
    id: 'civil3d',
    title: 'Autodesk® Civil 3D',
    category: 'autodesk-certification',
    duration: 36,
    certificationBody: 'Autodesk® ATC',
    image: '/media/road-infrastructure.jpg',
    summary: 'Civil design using Civil 3D — surfaces, alignments, profiles and corridors.',
  }),
  course({
    id: 'autocad',
    title: 'Autodesk® AutoCAD',
    category: 'autodesk-certification',
    duration: 40,
    certificationBody: 'Autodesk® ATC',
    image: '/media/software-workstation.jpg',
    summary: 'Professional 2D drafting and drawing production in AutoCAD.',
  }),
]

export const demoCourses = courses

export function getCourseById(id) {
  return courses.find((item) => item.id === id)
}

export function useCourses() {
  const t = useT()
  return courses.map((item) => ({
    ...item,
    categoryLabel: t(trainingCategories.find((cat) => cat.id === item.category)?.labelKey ?? 'common.category'),
  }))
}

export function useFeaturedCourses(limit = 4) {
  const list = useCourses()
  return list.filter((item) => item.featured).slice(0, limit)
}

export function useRelatedCourses(course, limit = 3) {
  const list = useCourses()
  if (!course) return []
  return list
    .filter((item) => item.id !== course.id && item.category === course.category)
    .slice(0, limit)
}

export function getDurationLabel(course) {
  if (!course?.duration) return null
  return `${course.duration} ${course.durationUnit === 'PDUs' ? 'PDUs' : 'hrs'}`
}

/**
 * The quarterly training calendar. CONSOL publishes a quarterly plan; specific
 * intakes are confirmed on registration, so this shows delivery windows only.
 */
export const trainingWindows = [
  { quarter: 'Q1', months: 'January – March', note: 'Intake dates confirmed on registration' },
  { quarter: 'Q2', months: 'April – June', note: 'Intake dates confirmed on registration' },
  { quarter: 'Q3', months: 'July – September', note: 'Intake dates confirmed on registration' },
  { quarter: 'Q4', months: 'October – December', note: 'Intake dates confirmed on registration' },
]
