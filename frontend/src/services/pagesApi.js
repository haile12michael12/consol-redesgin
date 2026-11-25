import { api } from './api'

export const pagesApi = {
  list: (params) => api.get('/pages', { params }),
  get: (slug) => api.get(`/pages/${slug}`),
  adminList: (params) => api.get('/admin/pages', { params }),
  create: (values) => api.post('/admin/pages', values),
  update: (id, values) => api.put(`/admin/pages/${id}`, values),
  delete: (id) => api.delete(`/admin/pages/${id}`),
}
