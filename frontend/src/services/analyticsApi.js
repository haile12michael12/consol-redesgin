import { api } from './api'

export const analyticsApi = {
  summary: () => api.get('/admin/analytics'),
}
