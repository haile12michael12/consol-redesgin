import axios from 'axios'

/**
 * Axios instance for the Laravel API.
 *
 * - Base URL comes from VITE_API_BASE_URL (local and production).
 * - Sanctum: cookie-based session auth for the admin area. `withCredentials`
 *   is enabled for Laravel's XSRF-TOKEN / session cookies. No tokens are
 *   stored in localStorage.
 * - Backend secrets never reach this file.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'

export const DEMO_ENABLED =
  import.meta.env.MODE !== 'production' && import.meta.env.VITE_ENABLE_DEMO_DATA === 'true'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

api.interceptors.request.use((config) => {
  // Laravel Sanctum CSRF cookie pattern (SPA authentication).
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)
    if (match) config.headers['X-XSRF-TOKEN'] = decodeURIComponent(match[1])
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error?.config?.url ?? ''
    const isAdminRequest = requestUrl.startsWith('/admin/')
      || requestUrl.startsWith('/auth/me')
      || requestUrl.startsWith('/auth/sessions')
      || requestUrl.startsWith('/auth/password')

    if (error?.response?.status === 401 && isAdminRequest && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('consol:auth-expired'))
    }

    return Promise.reject(error)
  },
)

/** Normalised error shape so UI components never depend on Axios internals. */
export function normaliseError(error) {
  if (error?.response) {
    const { status, data } = error.response
    return {
      status,
      message: data?.message ?? 'The server rejected the request.',
      errors: data?.errors ?? null,
    }
  }
  if (error?.code === 'ECONNABORTED') {
    return { status: 0, message: 'The request timed out.', errors: null }
  }
  return {
    status: 0,
    message: 'The CONSOL service could not be reached.',
    errors: null,
  }
}

/**
 * Resolve API content, falling back to labelled demonstration data when the
 * backend is not available and demo mode is enabled. The UI always receives
 * `{ data, source, error }` so it can show the correct provenance.
 */
export async function resolveWithFallback(request, fallback, { transform } = {}) {
  try {
    const response = await request()
    const payload = transform ? transform(response.data) : response.data
    return { data: payload, source: 'api', error: null }
  } catch (error) {
    const normalised = normaliseError(error)
    if (!DEMO_ENABLED) {
      return { data: null, source: 'error', error: normalised }
    }
    return {
      data: typeof fallback === 'function' ? fallback() : fallback,
      source: 'demo',
      error: normalised,
    }
  }
}

export async function healthCheck() {
  try {
    const { data } = await api.get('/health')
    return { ok: true, data }
  } catch (error) {
    return { ok: false, error: normaliseError(error) }
  }
}
