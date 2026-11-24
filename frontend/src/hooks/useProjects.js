import { useApiQuery } from './useApiQuery'
import { resolveWithFallback } from '@/services/api'
import { projects } from '@/data/projects'
import { fetchProjects } from '@/services/projectsApi'

export function useProjects(options = {}) {
  return useApiQuery({
    queryKey: ['projects'],
    queryFn: () => resolveWithFallback(() => fetchProjects(options), projects),
    fallbackData: { data: projects, source: 'demo', error: null },
  })
}
