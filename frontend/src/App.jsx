import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { LoadingState } from '@/components/common/StateBlocks'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import AppRoutes from '@/routes/AppRoutes'

const AssistantWidget = lazy(() =>
  import('@/components/common/AssistantWidget').then((module) => ({
    default: module.AssistantWidget,
  })),
)

export default function App() {
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

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <BrowserRouter>
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
