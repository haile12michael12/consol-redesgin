import { api } from './api'

export const newsApi = {
  list: (params = {}) => api.get('/news', { params }).then((response) => response.data),
  categories: () => api.get('/news/categories').then((response) => response.data),
  show: (slug) => api.get(`/news/${slug}`).then((response) => response.data),
  events: (params = {}) => api.get('/events', { params }).then((response) => response.data),
  showEvent: (slug) => api.get(`/events/${slug}`).then((response) => response.data),
  resources: (params = {}) => api.get('/resources', { params }).then((response) => response.data),
}

function multipartUpdate(formData) {
  formData.append('_method', 'PUT')
  return formData
}

export const newsAdminApi = {
  listArticles: (params = {}) => api.get('/admin/news', { params }).then((response) => response.data),
  categories: () => api.get('/admin/news/categories').then((response) => response.data),
  createCategory: (values) => api.post('/admin/news/categories', values),
  updateCategory: (id, values) => api.put(`/admin/news/categories/${id}`, values),
  deleteCategory: (id) => api.delete(`/admin/news/categories/${id}`),
  createArticle: (formData) => api.post('/admin/news', formData),
  updateArticle: (id, formData) => api.post(`/admin/news/${id}`, multipartUpdate(formData)),
  deleteArticle: (id) => api.delete(`/admin/news/${id}`),

  listEvents: (params = {}) => api.get('/admin/events', { params }).then((response) => response.data),
  createEvent: (formData) => api.post('/admin/events', formData),
  updateEvent: (id, formData) => api.post(`/admin/events/${id}`, multipartUpdate(formData)),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),

  listResources: (params = {}) => api.get('/admin/resources', { params }).then((response) => response.data),
  createResource: (formData) => api.post('/admin/resources', formData),
  updateResource: (id, formData) => api.post(`/admin/resources/${id}`, multipartUpdate(formData)),
  deleteResource: (id) => api.delete(`/admin/resources/${id}`),
}

export const newsQuery = {
  all: ['news'],
  list: (params = {}) => ['news', 'list', params],
  categories: ['news', 'categories'],
  detail: (slug) => ['news', 'detail', slug],
  events: (params = {}) => ['events', params],
  event: (slug) => ['events', 'detail', slug],
  resources: (params = {}) => ['resources', params],
}
