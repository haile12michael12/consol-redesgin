import { api, resolveWithFallback } from './api'
import { publishedProjects, projects as demoProjects, getProjectBySlug } from '@/data/projects'

/**
 * Laravel endpoints anticipated for the portfolio module:
 *   GET /api/projects            (paginated, filterable)
 *   GET /api/projects/{slug}
 * Until these are implemented and tested, demo mode serves the verified
 * published records from src/data/projects.js.
 */
export function fetchProjects(params = {}) {
  return resolveWithFallback(
    () => api.get('/projects', { params }),
    () => demoProjects,
  )
}

export function fetchProject(slug) {
  return resolveWithFallback(
    () => api.get(`/projects/${slug}`),
    () => getProjectBySlug(slug) ?? null,
  )
}

export const projectsQuery = {
  all: ['projects'],
  list: (params) => ['projects', 'list', params],
  detail: (slug) => ['projects', 'detail', slug],
}

export { publishedProjects }
