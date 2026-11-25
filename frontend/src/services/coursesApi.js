import { api } from './api'

export async function fetchCourses(params = {}) {
  const { data } = await api.get('/courses', { params })
  return data
}

export async function fetchCourse(slug) {
  const { data } = await api.get(`/courses/${encodeURIComponent(slug)}`)
  return data
}

export async function fetchCourseCategories() {
  const { data } = await api.get('/courses/categories')
  return data
}

export async function fetchTrainingSchedules(params = {}) {
  const { data } = await api.get('/schedules', { params })
  return data
}

export async function fetchInstructors() {
  const { data } = await api.get('/instructors')
  return data
}

export async function fetchInstructor(slug) {
  const { data } = await api.get(`/instructors/${encodeURIComponent(slug)}`)
  return data
}

export async function fetchRegistrationConfirmation(reference) {
  const { data } = await api.get(`/registrations/${encodeURIComponent(reference)}`)
  return data
}

export async function verifyCertificate(verificationCode) {
  const { data } = await api.post('/certificates/verify', { verification_code: verificationCode })
  return data
}

export async function submitRegistration(payload) {
  const { data } = await api.post('/registrations', payload)
  return data
}

export const coursesQuery = {
  all: (params = {}) => ['courses', params],
  detail: (slug) => ['courses', 'detail', slug],
  categories: ['courses', 'categories'],
  schedules: (params = {}) => ['training', 'schedules', params],
  instructors: ['training', 'instructors'],
  instructor: (slug) => ['training', 'instructors', slug],
  registration: (reference) => ['training', 'registration', reference],
}
