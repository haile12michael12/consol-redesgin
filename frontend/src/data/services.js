/**
 * Services.
 *
 * Scope lists are transcribed from the published consultancy pages.
 * Learning/delivery detail is added only where CONSOL publishes it.
 */
import { useT } from '@/i18n/LanguageProvider'

export const services = [
  {
    slug: 'construction-management-consultancy',
    titleKey: 'service.cm.title',
    shortKey: 'service.cm.shortTitle',
    summaryKey: 'service.cm.summary',
    category: 'construction-management',
    image: '/media/site-inspection.jpg',
    imageAlt: 'Civil engineers reviewing drawings on a construction site',
    order: 1,
    scope: [
      'Project Management Office (PMO) set-up and consultancy — manual preparation based on the PMI® Guide to the Project Management Body of Knowledge (PMBOK®), plus additional components set out by the CONSOL PMO team',
      'Construction company Enterprise Resource Planning (ERP) system',
      'Construction project performance related pay (PRP) structure and system for contractors',
      'Assessment of company and professional capacity gap and solution design',
      'Assessing the maturity of project management based on the PMI® standard OPM3 — organisational project management maturity assessment and continuous improvement, using assessment tools customised for the Ethiopian construction industry',
      'Web-based construction project/contracting parties (client–consultant–contractor) performance monitoring and evaluation system',
      'BIM solution implementation',
    ],
    benefits: [
      'A PMO that fits the client’s mandate rather than a generic template',
      'Objective, measurable performance comparison across projects and contracting parties',
      'Maturity baselines that make improvement measurable over time',
    ],
    process: [
      { title: 'Diagnose', text: 'Review the organisation, its projects and its current management systems.' },
      { title: 'Design', text: 'Agree the target system, manuals and performance measures.' },
      { title: 'Implement', text: 'Set up the PMO or system with the client team and train its users.' },
      { title: 'Sustain', text: 'Assess maturity and support continuous improvement.' },
    ],
    relatedProjectSlugs: [
      'opm-maturity-improvement-construction-industry',
      'contractor-performance-evaluation-information-system',
      'ethiopian-construction-project-management-manuals',
    ],
  },
  {
    slug: 'business-management-consultancy',
    titleKey: 'service.bm.title',
    shortKey: 'service.bm.shortTitle',
    summaryKey: 'service.bm.summary',
    category: 'business-management',
    image: '/media/consultancy.jpg',
    imageAlt: 'Consultancy team reviewing project documents',
    order: 2,
    scope: [
      'Strategy and operational plan',
      'Feasibility study',
      'Project performance audit and assessment',
      'Marketing plan',
      'Project evaluation and impact assessment',
      'Value for Money (VfM) assessment',
      'Organisational structure, job description, specification, grading, job evaluation, salary scale construction, benefit packages and incentive scheme',
      'Employee performance management system development',
    ],
    benefits: [
      'Decisions supported by structured evidence rather than assumption',
      'Organisation structures and reward systems that can actually be administered',
      'Independent assessment suitable for boards, funders and regulators',
    ],
    process: [
      { title: 'Scope', text: 'Define the decision the organisation needs to make.' },
      { title: 'Evidence', text: 'Collect and analyse the financial, operational and market data.' },
      { title: 'Recommend', text: 'Present options with implications, costs and risks.' },
      { title: 'Support', text: 'Assist implementation and follow-up measurement.' },
    ],
    relatedProjectSlugs: [
      'value-for-money-assessment-uiidp',
      'business-process-reengineering-balanced-scorecard',
      'defence-enterprises-organisational-structure',
    ],
  },
  {
    slug: 'professional-training',
    titleKey: 'service.training.title',
    shortKey: 'service.training.shortTitle',
    summaryKey: 'service.training.summary',
    category: 'training',
    image: '/media/training.jpg',
    imageAlt: 'Professional training workshop in progress',
    order: 3,
    scope: [
      'Custom-made training tailored to a client’s specific need, scheduled on demand',
      'Off-the-shelf training scheduled for companies at their convenience',
      'Quarterly training plan for individuals',
      'PMI® certification preparation — PMP® and CAPM® (Authorized PMI® Training Partner)',
      'Autodesk® certification training — Revit, Civil 3D, Navisworks, BIM 360, AutoCAD, Infraworks (Authorized Autodesk® Training Center)',
      'Engineering software training — ETABS, SAP, InRoads, WaterCAD, SewerCAD, StormCAD, HEC-RAS, HEC-HMS, MODFLOW and related tools',
      'Pearson VUE authorized test centre access for internationally recognised certification exams',
    ],
    benefits: [
      'Training delivered by practitioners with field experience',
      'Internationally accredited certification pathways',
      'In-company scheduling that limits time away from projects',
    ],
    process: [
      { title: 'Assess', text: 'Identify the capability gap and the participants.' },
      { title: 'Design', text: 'Select or tailor the curriculum and duration.' },
      { title: 'Deliver', text: 'Deliver the programme with applied exercises.' },
      { title: 'Certify', text: 'Facilitate assessment or certification where applicable.' },
    ],
    relatedProjectSlugs: [
      'pmi-pmp-master-framework-agreement',
      'professional-competence-assessment-certification-system',
    ],
  },
  {
    slug: 'research-industry-development',
    titleKey: 'service.research.title',
    shortKey: 'service.research.shortTitle',
    summaryKey: 'service.research.summary',
    category: 'research',
    image: '/media/library-research.jpg',
    imageAlt: 'Technical reports and survey data being reviewed',
    order: 4,
    scope: [
      'Applied research on construction industry performance and capacity',
      'Preparation of bodies of knowledge and occupational standards',
      'Construction Industry Capacity Building Framework (CICBF) implementation manuals and working systems',
      'Education quality and employment opportunity studies',
      'Feasibility and market studies for industrial and infrastructure investments',
    ],
    benefits: [
      'Evidence that stands up to government and funder review',
      'Frameworks that can be adopted, not just referenced',
      'Findings translated into implementable manuals and systems',
    ],
    process: [
      { title: 'Frame', text: 'Agree the research question and the decisions it informs.' },
      { title: 'Gather', text: 'Collect primary and secondary evidence across the sector.' },
      { title: 'Analyse', text: 'Test findings and validate them with stakeholders.' },
      { title: 'Publish', text: 'Deliver the report, manual or framework, with training as needed.' },
    ],
    relatedProjectSlugs: [
      'civil-engineering-education-employment-review',
      'capacity-gap-assessment-cicbf',
      'professional-competence-assessment-certification-system',
    ],
  },
]

export function getServiceBySlug(slug) {
  return services.find((service) => service.slug === slug)
}

/** Hook returning services with translated copy resolved. */
export function useServices() {
  const t = useT()
  return services.map((service) => ({
    ...service,
    title: t(service.titleKey),
    shortTitle: t(service.shortKey),
    summary: t(service.summaryKey),
  }))
}

export function useService(slug) {
  const list = useServices()
  return list.find((service) => service.slug === slug)
}
