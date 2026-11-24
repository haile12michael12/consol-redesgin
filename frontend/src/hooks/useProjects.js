import { useApiQuery } from './useApiQuery'
import { projects } from '@/data/projects'
import { fetchProjects } from '@/services/projectsApi'

export function useProjects(options = {}) {
  return useApiQuery({
    queryKey: ['projects'],
    queryFn: () => fetchProjects(options),
    fallbackData: { data: projects, source: 'demo', error: null },
  })
}
