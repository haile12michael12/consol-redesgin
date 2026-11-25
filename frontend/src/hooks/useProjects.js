import { useQuery } from '@tanstack/react-query'
import { projectsAdminApi, projectsApi, projectsQuery } from '@/services/projectsApi'

export function useProjects(params = {}) {
  return useQuery({
    queryKey: projectsQuery.list(params),
    queryFn: async () => (await projectsApi.list(params)).data,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  })
}

export function useProject(slug) {
  return useQuery({
    queryKey: projectsQuery.detail(slug),
    queryFn: async () => (await projectsApi.show(slug)).data,
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  })
}

export function useProjectCategories() {
  return useQuery({
    queryKey: projectsQuery.categories,
    queryFn: async () => (await projectsApi.categories()).data,
    staleTime: 5 * 60 * 1000,
  })
}

export function useAdminProjects(params = {}) {
  return useQuery({
    queryKey: ['admin', 'projects', params],
    queryFn: async () => (await projectsAdminApi.list(params)).data,
  })
}

export function useAdminProjectCategories() {
  return useQuery({
    queryKey: ['admin', 'project-categories'],
    queryFn: async () => (await projectsAdminApi.categories()).data,
  })
}
