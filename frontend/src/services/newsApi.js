import { api, resolveWithFallback } from './api'
import { news, getNewsBySlug, events, getEventBySlug } from '@/data/news'

/** Anticipated endpoints: GET /api/news, GET /api/news/{slug}, GET /api/events */
export function fetchNews() {
  return resolveWithFallback(() => api.get('/news'), () => news)
}

export function fetchArticle(slug) {
  return resolveWithFallback(
    () => api.get(`/news/${slug}`),
    () => getNewsBySlug(slug) ?? null,
  )
}

export function fetchEvents() {
  return resolveWithFallback(() => api.get('/events'), () => events)
}

export function fetchEvent(slug) {
  return resolveWithFallback(
    () => api.get(`/events/${slug}`),
    () => getEventBySlug(slug) ?? null,
  )
}

export const newsQuery = {
  all: ['news'],
  detail: (slug) => ['news', 'detail', slug],
  events: ['events'],
}
