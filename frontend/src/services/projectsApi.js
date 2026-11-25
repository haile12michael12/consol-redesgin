import { api } from './api'

export const projectsApi = {
  list: (params = {}) => api.get('/projects', { params }),
  show: (slug) => api.get(`/projects/${slug}`),
  categories: () => api.get('/projects/categories'),
}

export const projectsAdminApi = {
  list: (params = {}) => api.get('/admin/projects', { params }),
  categories: () => api.get('/admin/projects/categories'),
  createCategory: (category) => api.post('/admin/projects/categories', category),
  updateCategory: (id, category) => api.put(`/admin/projects/categories/${id}`, category),
  deleteCategory: (id) => api.delete(`/admin/projects/categories/${id}`),
  create: (formData) => api.post('/admin/projects', formData),
  update: (id, formData) => {
    formData.append('_method', 'PUT')
    return api.post(`/admin/projects/${id}`, formData)
  },
  delete: (id) => api.delete(`/admin/projects/${id}`),
}

export const projectsQuery = {
  all: ['projects'],
  list: (params) => ['projects', 'list', params],
  detail: (slug) => ['projects', 'detail', slug],
  categories: ['projects', 'categories'],
}
