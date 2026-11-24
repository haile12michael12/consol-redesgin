import { API_BASE_URL, DEMO_ENABLED, api, normaliseError } from './api'

/**
 * Public form submissions.
 *
 * Laravel owns validation, spam protection, rate limiting, notifications and
 * persistence. The browser only posts JSON. When demo mode is on and the API
 * is unreachable, the call is resolved locally and the UI states clearly that
 * nothing was stored.
 */
async function postOrDemo(path, payload) {
  try {
    const { data } = await api.post(path, payload)
    return { ok: true, source: 'api', data }
  } catch (error) {
    const normalised = normaliseError(error)
    const unreachable = normalised.status === 0
    if (DEMO_ENABLED && unreachable) {
      // Nothing is persisted in demo mode.
      await new Promise((resolve) => {
        window.setTimeout(resolve, 700)
      })
      return { ok: true, source: 'demo', data: null, error: null }
    }
    return { ok: false, source: 'error', error: normalised }
  }
}

/** POST /api/inquiries — general contact form. */
export function submitInquiry(payload) {
  return postOrDemo('/inquiries', payload)
}

/** POST /api/consultations — consultation request form. */
export function submitConsultation(payload) {
  return postOrDemo('/consultations', payload)
}

export { API_BASE_URL }
