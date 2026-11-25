/**
 * Assistant service layer.
 *
 * Today: prepared answers built strictly from content published on the CONSOL
 * website (vision, services, credentials, training catalogue, contact details).
 * Later: the Laravel backend proxies an approved AI provider. The browser only
 * calls our own API — provider keys must never reach this file.
 */
import { company, contact, credentials } from '@/lib/site'

const ENDPOINT = import.meta.env.VITE_ASSISTANT_ENDPOINT

const knowledge = [
  {
    test: /(what|who|about).*(consol|company|do|does|organisation|organization)/i,
    answer:
      'Construction Solutions PLC (CONSOL) is a consulting, training and research institute established in 2005 in Addis Ababa. Its core focus is developing the efficiency and effectiveness of business and public agents in the construction, telecom, information technology, banking and insurance industries.',
  },
  {
    test: /service|consultanc|consulting/i,
    answer:
      'CONSOL works in four areas: Construction Management Consultancy (PMO set-up, OPM3 maturity assessment, PRP and performance systems, BIM implementation), Business Management Consultancy (strategy, feasibility studies, organisational design, job evaluation, value-for-money assessment), Professional Training & Certification, and Research & Industry Development.',
  },
  {
    test: /training|course|pmp|revit|certif/i,
    answer: 'The Training page lists courses and instructor profiles currently published by CONSOL. Course details are added when confirmed.',
  },
  {
    test: /project|client|worked/i,
    answer:
      'Published engagements include work for the Ethiopian Construction Management Institute, the Ministry of Urban & Infrastructure (UIIDP, World Bank funded), the Ethiopian Association of Civil Engineers, Commercial Bank of Ethiopia, Ethiotelecom and the Defence Army Foundation. The Projects page lists each engagement with its published scope.',
  },
  {
    test: /contact|phone|email|address|location|office|where/i,
    answer: `The office is at ${contact.addressLines.join(', ')}. Telephone ${contact.landline} (office) or ${contact.mobile} (mobile). Email ${contact.email}.`,
  },
  {
    test: /certif|autodesk|pmi|pearson|accredit/i,
    answer: `CONSOL publishes ${credentials.map((item) => item.name).join(', ')}. These authorisations cover certification training and secure test delivery.`,
  },
  {
    test: /vision|mission|value/i,
    answer:
      'Vision: to be the most recognised solution provider for helping companies and professionals become internationally certified and globally competitive. Mission: to build and grow world-class professionals and companies in the Horn of Africa.',
  },
  {
    test: /history|founded|established|since|year/i,
    answer: `CONSOL was founded in ${company.founded} G.C. as a consulting, training and research institute based in Addis Ababa, Ethiopia.`,
  },
  {
    test: /consult|meeting|quote|request/i,
    answer:
      'You can request a consultation using the Request Consultation page, or contact the office directly on +251 114 70 04 52. Consultations begin with a short conversation about your organisation and objectives.',
  },
  {
    test: /register|enrol|enroll|join/i,
    answer:
      'Registration interest can be submitted from any course page, or from the training catalogue. Dates, venue and fees are confirmed by the CONSOL training team once an intake is scheduled.',
  },
]

function localAnswer(question) {
  const normalised = question.toLowerCase()
  const match = knowledge.find((entry) => entry.test.test(normalised))
  if (match) return match.answer
  if (/fee|price|cost/i.test(normalised)) {
    return 'Fees are not published on the website. The CONSOL team confirms fees when an intake is scheduled — please submit a registration interest or contact the office.'
  }
  if (/date|schedule|calendar|when/i.test(normalised)) {
    return 'Check the Training Schedule page for confirmed upcoming sessions. A schedule will appear there after CONSOL publishes it.'
  }
  return null
}

const FALLBACK =
  'I do not have an approved answer for that yet. The CONSOL team can help directly — use the contact page or call +251 114 70 04 52.'

/**
 * Ask the assistant. Resolves with a plain-text answer.
 * Throws when a live endpoint is configured but fails, so the UI can show its
 * error state (the local knowledge base is only used in demo mode).
 */
export async function askAssistant(question) {
  if (ENDPOINT && import.meta.env.VITE_ENABLE_DEMO_DATA !== 'true') {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ message: question }),
    })
    if (!response.ok) throw new Error(`Assistant request failed (${response.status})`)
    const data = await response.json()
    return data.answer ?? data.message ?? FALLBACK
  }

  // Demonstration latency so the loading state is exercised honestly.
  await new Promise((resolve) => {
    window.setTimeout(resolve, 620)
  })
  return localAnswer(question) ?? FALLBACK
}

export { FALLBACK as assistantFallback }
