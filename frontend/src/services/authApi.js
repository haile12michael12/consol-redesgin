import { api } from './api'

/**
 * Administrator authentication via Laravel's session guard and CSRF cookies.
 *
 *   GET /api/auth/csrf-cookie
 *   POST /api/auth/login
 *   POST /api/auth/logout
 *   GET  /api/auth/me
 */
export async function getCsrfCookie() {
  return api.get('/auth/csrf-cookie')
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
