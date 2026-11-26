import { api } from './api'

export const contentTranslationsApi = {
  list: (type) => api.get('/admin/translations', { params: { type } }),
  save: (type, id, values) => api.put(`/admin/translations/${type}/${id}`, values),
  approve: (type, id) => api.post(`/admin/translations/${type}/${id}/approve`),
}

export const contentTranslationsQuery = {
  list: (type) => ['admin', 'translations', type],
}
