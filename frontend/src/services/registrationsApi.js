import { api } from './api'

export const registrationsApi = {
  create: (payload) => api.post('/registrations', payload),
}
