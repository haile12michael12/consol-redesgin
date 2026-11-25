import { api } from './api'

export const mediaApi = {
  list: (params) => api.get('/admin/media', { params }),
  upload: (values) => api.post('/admin/media', values),
  download: (id) => api.get(`/admin/media/${id}/file`, { responseType: 'blob' }),
  delete: (id) => api.delete(`/admin/media/${id}`),
}
