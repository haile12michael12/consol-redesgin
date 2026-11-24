import { api } from './api'

/**
 * Administrator authentication (Laravel Sanctum SPA cookies).
 *
 * Not wired to a route yet: the demo admin preview does not authenticate.
 * When Laravel is ready, call `getCsrfCookie()` once, then `login()`.
 *
 *   POST /sanctum/csrf-cookie   (served from the app root, not /api)
 *   POST /api/auth/login
 *   POST /api/auth/logout
 *   GET  /api/auth/me
 */
const APP_ROOT = (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '')

export async function getCsrfCookie() {
  return api.get(`${APP_ROOT}/sanctum/csrf-cookie`, { baseURL: '' })
}

export function login(credentials) {
  return api.post('/auth/login', credentials)
}

export function logout() {
  return api.post('/auth/logout')
}

export function me() {
  return api.get('/auth/me')
}
