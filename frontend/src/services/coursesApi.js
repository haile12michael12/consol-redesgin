import { api, resolveWithFallback } from './api'
import { courses, getCourseById } from '@/data/courses'

/** Anticipated Laravel endpoints: GET /api/courses, GET /api/courses/{slug} */
export function fetchCourses(params = {}) {
  return resolveWithFallback(() => api.get('/courses', { params }), () => courses)
}

export function fetchCourse(id) {
  return resolveWithFallback(
    () => api.get(`/courses/${id}`),
    () => getCourseById(id) ?? null,
  )
}

/**
 * POST /api/registrations — course registration interest.
 * Validation, duplication checks, notifications and persistence belong to
 * Laravel. This function only transmits the payload.
 */
export function submitRegistration(payload) {
  return api.post('/registrations', payload)
}

export const coursesQuery = {
  all: ['courses'],
  detail: (id) => ['courses', 'detail', id],
}
