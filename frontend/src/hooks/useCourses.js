import { useApiQuery } from './useApiQuery'
import { courses } from '@/data/courses'
import { fetchCourses } from '@/services/coursesApi'

export function useCourses(options = {}) {
  return useApiQuery({
    queryKey: ['courses'],
    queryFn: () => fetchCourses(options),
    fallbackData: { data: courses, source: 'demo', error: null },
  })
}
