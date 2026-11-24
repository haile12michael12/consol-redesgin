import { useApiQuery } from './useApiQuery'

export function useInquiries() {
  return useApiQuery({
    queryKey: ['inquiries'],
    queryFn: async () => ({ data: [], source: 'demo', error: null }),
    fallbackData: { data: [], source: 'demo', error: null },
  })
}
