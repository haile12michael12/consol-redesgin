/**
 * Verified company information.
 *
 * Every field here comes from the live CONSOL website
 * (constructionsolutionsplc.com) and should only change after CONSOL approval.
 * Demonstration content is kept separately in `src/data/*` and is always
 * labelled in the UI. Never place invented facts in this file.
 */

export const company = {
  legalName: 'Construction Solutions PLC',
  name: 'Construction Solutions PLC',
  shortName: 'CONSOL',
  tagline: 'Your partner in growth',
  founded: 2005,
  summary:
    'A consulting, training and research institute focused on improving the efficiency and effectiveness of business and public agents within the construction, telecom, information technology, banking and insurance industries.',
  email: 'info@constructionsolutionsplc.com',
  emailSecondary: 'marthaconsol@gmail.com',
  landline: '+251 114 70 04 52',
  mobile: '+251 911 51 30 11',
  address: {
    line1: 'Meskel Flower to Wello Sefer Street',
    line2: 'Martereza Building, 3rd Floor, Suite 301',
    city: 'Addis Ababa',
    country: 'Ethiopia',
  },
  city: 'Addis Ababa',
  country: 'Ethiopia',
  website: 'https://www.constructionsolutionsplc.com',
  legal: {
    copyright: '© Construction Solutions PLC. All rights reserved.',
  },
}

export const contact = {
  email: company.email,
  emailSecondary: company.emailSecondary,
  landline: company.landline,
  landlineHref: 'tel:+251114700452',
  mobile: company.mobile,
  mobileHref: 'tel:+251911513011',
  // WhatsApp shortcut number. This is the verified company mobile number
  // published on the live website, so it is an official company number.
  // Confirm with CONSOL that the number accepts WhatsApp messages before
  // relying on the floating shortcut; set to null to disable it.
  whatsappNumber: '251911513011',
  whatsappHref: 'https://wa.me/251911513011',
  addressLines: [
    company.address.line1,
    `${company.address.line2}`,
    `${company.address.city}, ${company.address.country}`,
  ],
  // Business hours are not published on the current website; leave unconfirmed.
  hours: null,
}

/**
 * Verified institutional facts. Each value is traceable to the live site and is
 * shown with its provenance ("as published by CONSOL") in the UI.
 */
export const institutionalFacts = [
  {
    value: '2005',
    label: 'Founded in Addis Ababa',
    detail: 'Consulting, training and research institute established in 2005 G.C.',
    source: 'Company overview',
  },
  {
    value: '200+',
    label: 'Academics and practitioners',
    detail:
      'Highly trained academics and professional practitioners (BSc to PhD, minimum 15 years experience) have taken part as consultants, curriculum designers and trainers.',
    source: 'Company overview',
  },
  {
    value: '20,000+',
    label: 'Training participants',
    detail:
      'Training designed and administered for more than 20,000 participants representing more than 100 private and public organisations.',
    source: 'Company overview',
  },
  {
    value: '100+',
    label: 'Organisations served',
    detail:
      'Private construction and consulting companies, government institutes and enterprises, professional associations, regional clients, banks, insurers, telecom operators and NGOs.',
    source: 'Company overview',
  },
]

/** Verified credential programmes published by CONSOL. */
export const credentials = [
  {
    id: 'pmi-atp',
    name: 'Authorized PMI® Training Partner',
    short: 'PMI® ATP',
    description:
      'CONSOL is published as an Authorized Training Partner of the Project Management Institute and delivers PMI® certification preparation, including PMP® and CAPM®.',
    verify: 'https://www.credly.com/go/PMyn0GAV',
    verifyLabel: 'Verify on Credly',
  },
  {
    id: 'autodesk-atc',
    name: 'Authorized Autodesk® Training Center',
    short: 'Autodesk® ATC',
    description:
      'CONSOL is published as an Authorized Autodesk Training Center, delivering BIM, Revit, Civil 3D, Navisworks and AutoCAD training.',
    verify: null,
    verifyLabel: null,
  },
  {
    id: 'pearson-vue',
    name: 'Pearson VUE Authorized Test Center',
    short: 'Pearson VUE',
    description:
      'Construction Solutions joined the Pearson VUE network to offer accessible and secure certification testing for internationally recognised programmes.',
    verify: null,
    verifyLabel: null,
  },
]

export const social = []
