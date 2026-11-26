import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense, useCallback, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { LoadingState } from '@/components/common/StateBlocks'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import { getInitialRouterBasename, getLocalizedPath } from '@/lib/localizedRoutes'
import AppRoutes from '@/routes/AppRoutes'

const AssistantWidget = lazy(() =>
  import('@/components/common/AssistantWidget').then((module) => ({
    default: module.AssistantWidget,
  })),
)

export default function App() {
  const [routerBasename, setRouterBasename] = useState(getInitialRouterBasename)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 60_000,
          },
        },
      }),
  )

  const changeLanguagePath = useCallback((language) => {
      const { pathname, search, hash } = window.location
      const nextPath = getLocalizedPath(pathname, language)

      if (nextPath !== pathname) {
        window.history.pushState(null, '', `${nextPath}${search}${hash}`)
      }

      setRouterBasename(language === 'am' ? '/am' : '/')
      queryClient.clear()
  }, [queryClient])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
          <LanguageProvider onLanguageChange={changeLanguagePath}>
            <BrowserRouter basename={routerBasename} key={routerBasename}>
            <AppRoutes />
            <Suspense fallback={null}>
              <AssistantWidget />
            </Suspense>
            <Toaster />
          </BrowserRouter>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export { LoadingState }
