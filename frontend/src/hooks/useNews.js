import { useQuery } from '@tanstack/react-query'
import { newsApi, newsQuery } from '@/services/newsApi'

export function useNews(params = {}) {
  return useQuery({
    queryKey: newsQuery.list(params),
    queryFn: () => newsApi.list(params),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  })
}

export function useNewsCategories() {
  return useQuery({
    queryKey: newsQuery.categories,
    queryFn: newsApi.categories,
    staleTime: 5 * 60 * 1000,
  })
}

export function useArticle(slug) {
  return useQuery({
    queryKey: newsQuery.detail(slug),
    queryFn: () => newsApi.show(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  })
}

export function useEvents(params = {}) {
  return useQuery({
    queryKey: newsQuery.events(params),
    queryFn: () => newsApi.events(params),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  })
}

export function useEvent(slug) {
  return useQuery({
    queryKey: newsQuery.event(slug),
    queryFn: () => newsApi.showEvent(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  })
}

export function useResources(params = {}) {
  return useQuery({
    queryKey: newsQuery.resources(params),
    queryFn: () => newsApi.resources(params),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  })
}
