import { api, normaliseError } from './api'

/** Laravel endpoints: GET /api/services, GET /api/services/{slug}. */
export async function fetchServices() {
  try {
    const { data } = await api.get('/services')
    return { data, source: 'api', error: null }
  } catch (error) {
    return { data: null, source: 'error', error: normaliseError(error) }
  }
}

export async function fetchService(slug) {
  try {
    const { data } = await api.get(`/services/${slug}`)
    return { data, source: 'api', error: null }
  } catch (error) {
    return { data: null, source: 'error', error: normaliseError(error) }
  }
}

export const servicesAdminApi = {
  list: () => api.get('/admin/services'),
  create: (service) => api.post('/admin/services', service),
  update: (id, service) => api.put(`/admin/services/${id}`, service),
  delete: (id) => api.delete(`/admin/services/${id}`),
}

export const servicesQuery = {
  all: ['services'],
  detail: (slug) => ['services', 'detail', slug],
}
