import { api } from './api'

export const usersAdminApi = {
  users: (params) => api.get('/admin/users', { params }),
  createUser: (values) => api.post('/admin/users', values),
  updateUser: (id, values) => api.put(`/admin/users/${id}`, values),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  roles: () => api.get('/admin/roles'),
  permissions: () => api.get('/admin/roles/permissions'),
  createRole: (values) => api.post('/admin/roles', values),
  updateRole: (id, values) => api.put(`/admin/roles/${id}`, values),
  deleteRole: (id) => api.delete(`/admin/roles/${id}`),
}