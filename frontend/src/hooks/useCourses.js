import { useQuery } from '@tanstack/react-query'
import {
  coursesQuery,
  fetchCourse,
  fetchCourseCategories,
  fetchCourses,
  fetchInstructors,
  fetchInstructor,
  fetchRegistrationConfirmation,
  fetchTrainingSchedules,
} from '@/services/coursesApi'

export function useCourses(options = {}) {
  return useQuery({
    queryKey: coursesQuery.all(options),
    queryFn: () => fetchCourses(options),
  })
}

export function useCourse(slug) {
  return useQuery({
    queryKey: coursesQuery.detail(slug),
    queryFn: () => fetchCourse(slug),
    enabled: Boolean(slug),
  })
}

export function useCourseCategories() {
  return useQuery({
    queryKey: coursesQuery.categories,
    queryFn: fetchCourseCategories,
  })
}

export function useTrainingSchedules(params = {}) {
  return useQuery({
    queryKey: coursesQuery.schedules(params),
    queryFn: () => fetchTrainingSchedules(params),
  })
}

export function useInstructors() {
  return useQuery({
    queryKey: coursesQuery.instructors,
    queryFn: fetchInstructors,
  })
}

export function useInstructor(slug) {
  return useQuery({
    queryKey: coursesQuery.instructor(slug),
    queryFn: () => fetchInstructor(slug),
    enabled: Boolean(slug),
  })
}

export function useRegistrationConfirmation(reference) {
  return useQuery({
    queryKey: coursesQuery.registration(reference),
    queryFn: () => fetchRegistrationConfirmation(reference),
    enabled: Boolean(reference),
  })
}
