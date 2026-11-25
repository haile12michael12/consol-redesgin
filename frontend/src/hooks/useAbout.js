import { useApiQuery } from './useApiQuery'
import { fetchAbout } from '@/services/aboutApi'

export function useAbout() {
  return useApiQuery({
    queryKey: ['about'],
    queryFn: fetchAbout,
  })
}
