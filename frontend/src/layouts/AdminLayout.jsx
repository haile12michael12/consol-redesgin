import {
  Award,
  Bell,
  Briefcase,
  Building2,
  ChartNoAxesCombined,
  ClipboardList,
  ExternalLink,
  Files,
  FolderKanban,
  GraduationCap,
  Images,
  Inbox,
  LayoutDashboard,
  Menu,
  Newspaper,
  Search,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { useT } from '@/i18n/LanguageProvider'
import { adminNav } from '@/lib/navigation'
import { cn } from '@/lib/utils'

const icons = {
  LayoutDashboard,
  Files,
  Building2,
  Briefcase,
  FolderKanban,
  GraduationCap,
  ClipboardList,
  Award,
  Newspaper,
  Images,
  Inbox,
  ChartNoAxesCombined,
  Users,
  Settings,
}

function SidebarLink({ item, onNavigate }) {
  const t = useT()
  const Icon = icons[item.icon] ?? Files
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 border-l-2 px-4 py-2.5 text-[0.8125rem] font-medium transition-colors',
          isActive
            ? 'border-gold bg-white/[0.07] text-white'
            : 'border-transparent text-white/60 hover:bg-white/[0.04] hover:text-white',
        )
      }
    >
      <Icon className="size-4 shrink-0 opacity-80" aria-hidden="true" />
      {t(item.labelKey)}
    </NavLink>
  )
}

function Sidebar({ onNavigate }) {
  const t = useT()
  return (
    <div className="flex h-full flex-col bg-navy">
      <div className="flex h-16 items-center border-b border-white/10 px-4">
        <Logo invert compact />
      </div>
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-white/60">
          {t('admin.title')}
        </span>
        <span className="border border-gold/50 bg-gold/10 px-1.5 py-0.5 text-[0.5rem] font-bold uppercase tracking-[0.12em] text-gold">
          Demo
        </span>
      </div>
      <nav aria-label={t('admin.title')} className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-0.5">
          {adminNav.map((item) => (
            <li key={item.to}>
              <SidebarLink item={item} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-white/10 p-3">
        <Link
          to="/"
          className="flex items-center justify-between px-2 py-2 text-[0.75rem] font-medium text-white/55 transition-colors hover:text-white"
        >
          {t('admin.viewSite')}
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

export function AdminLayout() {
  const t = useT()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const pageTitle = useMemo(() => {
    const match = adminNav.find((item) => location.pathname.startsWith(item.to))
    return match ? t(match.labelKey) : t('admin.nav.dashboard')
  }, [location.pathname, t])

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <Sidebar />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-navy/60"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-64 shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 z-10 grid size-8 place-items-center text-white/70 hover:text-white"
              aria-label={t('common.close')}
            >
              <X className="size-4" />
            </button>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-line bg-white">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="grid size-9 place-items-center border border-line text-navy lg:hidden"
              aria-label={t('nav.openMenu')}
            >
              <Menu className="size-4" />
            </button>

            <h1 className="min-w-0 truncate text-[0.9375rem] font-semibold text-navy">{pageTitle}</h1>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <div className="relative hidden md:block">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder={t('admin.search')}
                  aria-label={t('admin.search')}
                  className="h-9 w-52 rounded-[3px] border border-line bg-canvas/60 pl-9 pr-3 text-[0.8125rem] outline-none transition-colors focus:border-gold focus:bg-white"
                />
              </div>
              <div className="hidden sm:block">
                <LanguageSwitcher compact />
              </div>
              <button
                type="button"
                className="relative grid size-9 place-items-center border border-line text-muted transition-colors hover:text-navy"
                aria-label={t('admin.notifications')}
              >
                <Bell className="size-4" />
                <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-gold" aria-hidden="true" />
              </button>
              <div className="hidden items-center gap-2.5 border-l border-line pl-3 sm:flex">
                <span className="grid size-8 place-items-center rounded-full bg-navy text-[0.625rem] font-bold text-gold">
                  AD
                </span>
                <div className="leading-tight">
                  <p className="text-[0.75rem] font-semibold text-navy">Administrator</p>
                  <p className="text-[0.625rem] text-muted">Demo account</p>
                </div>
              </div>
              <Button asChild variant="ghost" size="sm" className="hidden xl:inline-flex">
                <Link to="/admin/login">{t('admin.signOut')}</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-gold/30 bg-gold/10 px-4 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-gold-deep sm:px-6">
            <span className="inline-block size-1.5 rounded-full bg-gold" aria-hidden="true" />
            {t('admin.demoBanner')}
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
