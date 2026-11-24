import { api, resolveWithFallback } from './api'
import { services, getServiceBySlug } from '@/data/services'

/** Anticipated Laravel endpoints: GET /api/services, GET /api/services/{slug} */
export function fetchServices() {
  return resolveWithFallback(() => api.get('/services'), () => services)
}

export function fetchService(slug) {
  return resolveWithFallback(
    () => api.get(`/services/${slug}`),
    () => getServiceBySlug(slug) ?? null,
  )
}

export const servicesQuery = {
  all: ['services'],
  detail: (slug) => ['services', 'detail', slug],
}
