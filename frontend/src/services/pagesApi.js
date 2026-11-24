import { api } from './api'

export const pagesApi = {
  list: () => api.get('/pages'),
  get: (slug) => api.get(`/pages/${slug}`),
}
