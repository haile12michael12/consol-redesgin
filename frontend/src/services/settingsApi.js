import { api } from './api'

export const settingsApi = {
  list: () => api.get('/admin/settings'),
  create: (values) => api.post('/admin/settings', values),
  update: (id, values) => api.put(`/admin/settings/${id}`, values),
  delete: (id) => api.delete(`/admin/settings/${id}`),
}