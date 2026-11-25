import { api, resolveWithFallback } from './api'

export function fetchAbout() {
  return resolveWithFallback(() => api.get('/about'), null)
}
