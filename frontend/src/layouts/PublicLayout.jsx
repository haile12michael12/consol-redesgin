import { Outlet } from 'react-router-dom'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { useScrollRestoration } from '@/lib/scroll'

export function PublicLayout() {
  useScrollRestoration()
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
