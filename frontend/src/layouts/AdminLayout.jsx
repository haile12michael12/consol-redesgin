import {
  Award,
  Bell,
  Briefcase,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  ExternalLink,
  Files,
  FolderKanban,
  GraduationCap,
  Images,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Languages,
  Menu,
  Newspaper,
  Search,
  Settings,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { ErrorState, LoadingState } from '@/components/common/StateBlocks'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { useT } from '@/i18n/LanguageProvider'
import { adminNav } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { me, logout } from '@/services/authApi'
import { normaliseError } from '@/services/api'

const icons = {
  LayoutDashboard,
  Languages,
  Files,
  CalendarDays,
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
  KeyRound,
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

const permissionByPath = {
  '/admin/dashboard': 'analytics.view',
  '/admin/pages': 'pages.manage',
  '/admin/translations': 'translations.manage',
  '/admin/services': 'services.manage',
  '/admin/projects': 'projects.manage',
  '/admin/training': 'training.manage',
  '/admin/registrations': 'registrations.manage',
  '/admin/certificates': 'certificates.manage',
  '/admin/news': 'news.manage',
  '/admin/events': 'events.manage',
  '/admin/media': 'media.manage',
  '/admin/inquiries': 'inquiries.manage',
  '/admin/analytics': 'analytics.view',
  '/admin/users': 'users.manage',
  '/admin/settings': 'settings.manage',
}

function Sidebar({ onNavigate, user }) {
  const t = useT()
  const isAdministrator = user.is_admin || user.roles?.some((role) => ['administrator', 'super_admin'].includes(role.name))
  const permissions = new Set(user.roles?.flatMap((role) => role.permissions.map((permission) => permission.name)) ?? [])
  const visibleNavigation = adminNav.filter((item) => (
    !permissionByPath[item.to] || isAdministrator || permissions.has(permissionByPath[item.to])
  ))
  return (
    <div className="flex h-full flex-col bg-navy">
      <div className="flex h-16 items-center border-b border-white/10 px-4">
        <Logo invert compact />
      </div>
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-white/60">
          {t('admin.title')}
        </span>
      </div>
      <nav aria-label={t('admin.title')} className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-0.5">
          {visibleNavigation.map((item) => (
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
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [mobileOpen, setMobileOpen] = useState(false)
  const auth = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => (await me()).data.user,
    retry: false,
  })
  const signOut = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['auth', 'me'] })
      navigate('/admin/login', { replace: true })
    },
  })

  useEffect(() => {
    const handleExpiredSession = () => {
      queryClient.removeQueries({ queryKey: ['auth', 'me'] })
      navigate('/admin/login', { replace: true, state: { from: location } })
    }
    window.addEventListener('consol:auth-expired', handleExpiredSession)
    return () => window.removeEventListener('consol:auth-expired', handleExpiredSession)
  }, [location, navigate, queryClient])

  const pageTitle = useMemo(() => {
    const match = adminNav.find((item) => location.pathname.startsWith(item.to))
    return match ? t(match.labelKey) : t('admin.nav.dashboard')
  }, [location.pathname, t])

  if (auth.isPending) return <LoadingState className="shell section" label="Checking administrator access…" />
  if (auth.isError) {
    if (auth.error?.response?.status === 403) {
      return <Unauthorized />
    }
    if (auth.error?.response?.status === 401) {
      return <Navigate to="/admin/login" replace state={{ from: location }} />
    }
    return (
      <div className="shell section">
        <ErrorState
          title="Administrator access could not be verified"
          text={normaliseError(auth.error).message}
          onRetry={() => auth.refetch()}
        />
      </div>
    )
  }
  if (!auth.data?.is_admin && !auth.data?.roles?.length) return <Navigate to="/admin/login" replace state={{ from: location }} />

  const activeSection = [...adminNav]
    .sort((left, right) => right.to.length - left.to.length)
    .find((item) => location.pathname.startsWith(item.to))
    ?? (location.pathname === '/admin' ? adminNav[0] : null)
  const requiredPermission = activeSection ? permissionByPath[activeSection.to] : null
  const userPermissions = new Set(auth.data.roles?.flatMap((role) => role.permissions.map((permission) => permission.name)) ?? [])
  const isAdministrator = auth.data.is_admin || auth.data.roles?.some((role) => ['administrator', 'super_admin'].includes(role.name))
  if (requiredPermission && !isAdministrator && !userPermissions.has(requiredPermission)) {
    const firstAllowedSection = adminNav.find((item) => userPermissions.has(permissionByPath[item.to]))
    if (firstAllowedSection) return <Navigate to={firstAllowedSection.to} replace />
    return (
      <div className="shell section">
        <Unauthorized />
      </div>
    )
  }

  function Unauthorized() {
    return (
      <div className="shell section">
        <div className="mx-auto max-w-lg border border-line bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-navy">Administrator access required</h1>
          <p className="mt-2 text-sm text-muted">Your account is not authorised for this area. Contact a CONSOL super administrator if you believe this is an error.</p>
          <Link className="mt-5 inline-flex text-sm font-semibold text-gold-deep underline" to="/">Return to the website</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <Sidebar user={auth.data} />
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
            <Sidebar user={auth.data} onNavigate={() => setMobileOpen(false)} />
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
                  {(auth.data.name ?? 'A').slice(0, 2).toUpperCase()}
                </span>
                <div className="leading-tight">
                  <p className="text-[0.75rem] font-semibold text-navy">{auth.data.name}</p>
                  <p className="text-[0.625rem] text-muted">{auth.data.email}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="inline-flex"
                disabled={signOut.isPending}
                onClick={() => signOut.mutate()}
              >
                {signOut.isPending ? 'Signing out…' : t('admin.signOut')}
              </Button>
            </div>
          </div>
          {signOut.isError && (
            <p role="alert" className="border-t border-danger/30 bg-danger/5 px-4 py-2 text-xs text-danger">
              Sign out failed. Please retry.
            </p>
          )}
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
