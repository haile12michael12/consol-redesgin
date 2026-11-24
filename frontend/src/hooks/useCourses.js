import { useApiQuery } from './useApiQuery'
import { resolveWithFallback } from '@/services/api'
import { courses } from '@/data/courses'
import { fetchCourses } from '@/services/coursesApi'

export function useCourses(options = {}) {
  return useApiQuery({
    queryKey: ['courses'],
    queryFn: () => resolveWithFallback(() => fetchCourses(options), courses),
    fallbackData: { data: courses, source: 'demo', error: null },
  })
}
