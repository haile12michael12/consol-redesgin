import { api } from './api'

export const mediaApi = {
  list: (params) => api.get('/media', { params }),
}
