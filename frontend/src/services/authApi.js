import { API_BASE_URL, api } from './api'

/**
 * Administrator authentication via Sanctum's session guard and CSRF cookies.
 *
 *   GET /sanctum/csrf-cookie
 *   POST /api/auth/login
 *   POST /api/auth/logout
 *   GET  /api/auth/me
 */
export async function getCsrfCookie() {
  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '')
  return api.get(`${apiOrigin}/sanctum/csrf-cookie`)
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

export function changePassword(values) {
  return api.put('/auth/password', values)
}

export function listSessions() {
  return api.get('/auth/sessions')
}

export function revokeSession(id) {
  return api.delete(`/auth/sessions/${encodeURIComponent(id)}`)
}

export function revokeOtherSessions() {
  return api.delete('/auth/sessions/others')
}

export function requestPasswordReset(email) {
  return api.post('/auth/password/forgot', { email })
}

export function resetPassword(values) {
  return api.post('/auth/password/reset', values)
}
