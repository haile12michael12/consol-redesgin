import { useApiQuery } from './useApiQuery'
import { useQuery } from '@tanstack/react-query'
import { fetchService, fetchServices, servicesAdminApi } from '@/services/servicesApi'

export function useServices(options = {}) {
  return useApiQuery({
    queryKey: ['services'],
    queryFn: () => fetchServices(options),
  })
}

export function useService(slug) {
  return useApiQuery({
    queryKey: ['services', 'detail', slug],
    queryFn: () => fetchService(slug),
    enabled: Boolean(slug),
  })
}

export function useAdminServices() {
  return useQuery({
    queryKey: ['admin', 'services'],
    queryFn: async () => (await servicesAdminApi.list()).data,
  })
}
