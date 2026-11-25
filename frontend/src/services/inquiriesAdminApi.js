import { api } from './api'

const getData = async (request) => (await request).data

export const inquiriesAdminApi = {
  list: (params) => getData(api.get('/admin/inquiries', { params })),
  assignees: () => getData(api.get('/admin/inquiries/assignees')),
  show: (id) => getData(api.get(`/admin/inquiries/${id}`)),
  update: (id, values) => getData(api.put(`/admin/inquiries/${id}`, values)),
  addNote: (id, body) => getData(api.post(`/admin/inquiries/${id}/notes`, { body })),
  export: (params) => api.get('/admin/inquiries/export', { params, responseType: 'blob' }),
}