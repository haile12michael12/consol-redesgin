import { ArrowRight, ArrowUpRight, ChevronDown, Mail, Menu, Phone, X } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { Button } from '@/components/ui/button'
import { useLanguage, useT } from '@/i18n/LanguageProvider'
import { company, contact } from '@/lib/site'
import { primaryNav } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from './LanguageSwitcher'

function isActivePath(pathname, to, search = '', hash = '') {
  const target = new URL(to, 'https://consol.local')
  const pathMatches =
    target.pathname === '/'
      ? pathname === '/'
      : pathname === target.pathname || pathname.startsWith(`${target.pathname}/`)
  if (!pathMatches) return false

  const targetParams = new URLSearchParams(target.search)
  const currentParams = new URLSearchParams(search)
  for (const [key, value] of targetParams) {
    if (currentParams.get(key) !== value) return false
  }
  if (target.hash && target.pathname === pathname && hash !== target.hash) return false
  return true
}

function DesktopDropdown({ item, openKey, setOpenKey, pathname, search, hash }) {
  const t = useT()
  const reduceMotion = useReducedMotion()
  const id = useId()
  const open = openKey === item.labelKey
  const active = isActivePath(pathname, item.to, search, hash)
  const timer = useRef(null)
  const hoverOpened = useRef(false)
  const triggerRef = useRef(null)

  const cancelClose = () => {
    if (timer.current) window.clearTimeout(timer.current)
  }
  const scheduleClose = () => {
    cancelClose()
    timer.current = window.setTimeout(() => setOpenKey(null), 140)
  }

  useEffect(() => () => cancelClose(), [])

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose()
        if (openKey !== item.labelKey) hoverOpened.current = true
        setOpenKey(item.labelKey)
      }}
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement)) scheduleClose()
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpenKey(null)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          setOpenKey(null)
          triggerRef.current?.focus()
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-haspopup="true"
        onClick={(event) => {
          if (event.detail === 0) {
            setOpenKey(open ? null : item.labelKey)
          } else if (hoverOpened.current) {
            hoverOpened.current = false
            setOpenKey(item.labelKey)
          } else {
            setOpenKey(open ? null : item.labelKey)
          }
        }}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'relative flex h-20 items-center gap-1.5 px-3 text-[0.8125rem] font-semibold transition-colors',
          'after:absolute after:inset-x-3 after:bottom-0 after:h-[2px] after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300',
          open || active
            ? 'text-gold-deep after:scale-x-100'
            : 'text-navy hover:text-gold-deep',
        )}
      >
        {t(item.labelKey)}
        <ChevronDown
          className={cn('size-3.5 transition-transform duration-300', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      <motion.div
        id={id}
        className={cn(
          'absolute left-0 top-full z-40 w-[min(44rem,calc(100vw-5rem))] border border-line bg-white shadow-[0_40px_80px_-40px_rgba(16,29,50,0.5)]',
          item.alignEnd && 'right-0 left-auto',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        initial={false}
        animate={{ opacity: open ? 1 : 0, y: open ? 0 : -8 }}
        transition={{ duration: reduceMotion ? 0 : 0.18, ease: 'easeOut' }}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="grid grid-cols-[1.55fr_1fr]">
          <div className="grid grid-cols-2 gap-8 p-8">
            {item.columns.map((column) => (
              <div key={column.headingKey}>
                <p className="mb-4 text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-muted">
                  {t(column.headingKey)}
                </p>
                <ul className="space-y-1">
                  {column.links.map((link) => (
                    <li key={link.to + link.labelKey}>
                      <Link
                        to={link.to}
                        onClick={() => setOpenKey(null)}
                        aria-current={isActivePath(pathname, link.to, search, hash) ? 'page' : undefined}
                        className="group block border-l border-transparent py-1.5 pl-0 transition-all hover:border-gold hover:pl-3"
                      >
                        <span className="flex items-center gap-1.5 text-[0.875rem] font-medium text-navy transition-colors group-hover:text-gold-deep">
                          {t(link.labelKey)}
                        </span>
                        {link.descriptionKey && (
                          <span className="mt-0.5 block text-[0.75rem] leading-snug text-muted">
                            {t(link.descriptionKey)}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {item.feature && (
            <Link
              to={item.feature.to}
              onClick={() => setOpenKey(null)}
              className="group relative flex flex-col justify-between border-l border-line bg-navy p-7 text-white"
            >
              <div>
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-gold">
                  {t(item.feature.labelKey)}
                </p>
                <p className="mt-3 text-[1.0625rem] font-semibold leading-snug text-white">
                  {t(item.feature.titleKey)}
                </p>
                <p className="mt-2.5 text-[0.75rem] leading-relaxed text-white/60">
                  {t(item.feature.textKey)}
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-gold-soft">
                {t('common.readMore')}
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export function SiteHeader() {
  const t = useT()
  const { isAmharic } = useLanguage()
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const [openKey, setOpenKey] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileSection, setMobileSection] = useState(null)
  const menuRef = useRef(null)
  const menuButtonRef = useRef(null)
  const closeMobileMenu = () => {
    setMobileOpen(false)
    menuButtonRef.current?.focus()
  }

  useEffect(() => {
    setMobileOpen(false)
    setOpenKey(null)
    setMobileSection(null)
  }, [location.pathname, location.search])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        menuButtonRef.current?.focus()
      }
      if (event.key === 'Tab' && menuRef.current) {
        const focusables = menuRef.current.querySelectorAll(
          'a[href], button:not([disabled])',
        )
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    const focusTimeout = window.setTimeout(
      () => menuRef.current?.querySelector('a,button')?.focus(),
      60,
    )
    return () => {
      window.clearTimeout(focusTimeout)
      document.removeEventListener('keydown', onKey)
    }
  }, [mobileOpen])

  useEffect(() => {
    const onClickOutside = (event) => {
      if (openKey && !event.target.closest('[data-nav-dropdown]')) {
        setOpenKey(null)
      }
    }
    document.addEventListener('pointerdown', onClickOutside)
    return () => document.removeEventListener('pointerdown', onClickOutside)
  }, [openKey])

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[100] translate-y-[-150%] bg-gold px-4 py-2 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-navy transition-transform focus:translate-y-0"
      >
        {t('common.skipToContent')}
      </a>

      {/* Utility bar — verified contact information */}
      <div
        className={cn(
          'relative z-30 hidden bg-navy text-white/70 lg:block',
        )}
      >
        <div className="shell flex h-9 items-center justify-between text-[0.6875rem] tracking-[0.03em]">
          <p className="flex items-center gap-2 font-medium">
            <span className="inline-block size-1.5 rounded-full bg-gold" aria-hidden="true" />
            {company.address.line1}, {company.address.city} · Established {company.founded}
          </p>
          <div className="flex items-center gap-6">
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 transition-colors hover:text-white">
              <Mail className="size-3 text-gold" aria-hidden="true" />
              {contact.email}
            </a>
            <a href={contact.landlineHref} className="flex items-center gap-2 transition-colors hover:text-white">
              <Phone className="size-3 text-gold" aria-hidden="true" />
              {contact.landline}
            </a>
            <span className="h-3 w-px bg-white/15" aria-hidden="true" />
            <LanguageSwitcher invert compact />
          </div>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-40 border-b bg-white/95 backdrop-blur-md transition-shadow duration-300',
          scrolled ? 'border-line shadow-[0_10px_30px_-24px_rgba(16,29,50,0.5)]' : 'border-line/70',
        )}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
          <Logo />

          <nav
            aria-label={t('nav.mainNavigation')}
            className={cn('hidden items-center', isAmharic ? '2xl:flex' : 'xl:flex')}
          >
            {primaryNav.map((item) =>
              item.columns ? (
                <div key={item.labelKey} data-nav-dropdown>
                  <DesktopDropdown
                    item={item}
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    pathname={location.pathname}
                    search={location.search}
                    hash={location.hash}
                  />
                </div>
              ) : (
                <NavLink
                  key={item.labelKey}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative flex h-20 items-center px-3 text-[0.8125rem] font-semibold transition-colors',
                      'after:absolute after:inset-x-3 after:bottom-0 after:h-[2px] after:origin-left after:bg-gold after:transition-transform after:duration-300',
                      isActive ||
                      isActivePath(location.pathname, item.to, location.search, location.hash)
                        ? 'text-navy after:scale-x-100'
                        : 'text-navy hover:text-gold-deep',
                    )
                  }
                >
                  {t(item.labelKey)}
                </NavLink>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2.5">
            <Button asChild variant="gold" size="md" className="hidden h-11 px-5 sm:inline-flex">
              <Link to="/request-consultation">
                {t('nav.requestConsultation')}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </Button>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label={t('nav.openMenu')}
              className={cn(
                'grid size-11 place-items-center border border-line-strong text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white',
                isAmharic ? '2xl:hidden' : 'xl:hidden',
              )}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50',
          isAmharic ? '2xl:hidden' : 'xl:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!mobileOpen}
      >
        <motion.div
          className={cn(
            'absolute inset-0 bg-navy/60 backdrop-blur-[2px]',
          )}
          animate={{ opacity: mobileOpen ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.25 }}
          onClick={closeMobileMenu}
        />
        <motion.div
          ref={menuRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.mobileNavigation')}
          className={cn(
            'absolute right-0 top-0 flex h-full w-[min(24rem,92vw)] flex-col bg-white shadow-2xl',
          )}
          initial={{ x: '100%' }}
          animate={{ x: mobileOpen ? '0%' : '100%' }}
          transition={{
            duration: reduceMotion ? 0 : 0.3,
            ease: [0.22, 0.61, 0.36, 1],
          }}
          inert={!mobileOpen}
        >
          <div className="flex h-[4.5rem] items-center justify-between border-b border-line px-5">
            <Logo compact />
            <button
              type="button"
              onClick={closeMobileMenu}
              aria-label={t('nav.closeMenu')}
              className="grid size-10 place-items-center border border-line text-navy transition-colors hover:bg-canvas"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label={t('nav.mobileNavigation')} className="flex-1 overflow-y-auto px-5 py-4">
            <ul>
              {primaryNav.map((item) =>
                item.columns ? (
                  <li key={item.labelKey} className="border-b border-line/70">
                    <button
                      type="button"
                      aria-expanded={mobileSection === item.labelKey}
                      onClick={() =>
                        setMobileSection(mobileSection === item.labelKey ? null : item.labelKey)
                      }
                      className="flex w-full items-center justify-between py-4 text-left text-[0.9375rem] font-semibold text-navy"
                    >
                      {t(item.labelKey)}
                      <ChevronDown
                        className={cn(
                          'size-4 text-muted transition-transform duration-300',
                          mobileSection === item.labelKey && 'rotate-180 text-gold-deep',
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      className={cn(
                        'grid transition-all duration-300',
                        mobileSection === item.labelKey
                          ? 'grid-rows-[1fr] pb-3 opacity-100'
                          : 'grid-rows-[0fr] opacity-0',
                      )}
                      inert={mobileSection !== item.labelKey}
                    >
                      <ul className="overflow-hidden pl-1">
                        {item.columns.flatMap((column) =>
                          column.links.map((link) => (
                            <li key={link.to + link.labelKey}>
                              <Link
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                aria-current={
                                  isActivePath(location.pathname, link.to, location.search, location.hash)
                                    ? 'page'
                                    : undefined
                                }
                                className={cn(
                                  'flex items-center justify-between gap-2 border-l border-line py-2.5 pl-4 text-[0.875rem] transition-colors hover:border-gold hover:text-navy',
                                  isActivePath(
                                    location.pathname,
                                    link.to,
                                    location.search,
                                    location.hash,
                                  )
                                    ? 'border-gold font-semibold text-navy'
                                    : 'text-muted',
                                )}
                              >
                                {t(link.labelKey)}
                                <ArrowUpRight className="size-3.5 opacity-40" aria-hidden="true" />
                              </Link>
                            </li>
                          )),
                        )}
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li key={item.labelKey} className="border-b border-line/70">
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between py-4 text-[0.9375rem] font-semibold',
                          isActive ? 'text-gold-deep' : 'text-navy',
                        )
                      }
                    >
                      {t(item.labelKey)}
                    </NavLink>
                  </li>
                ),
              )}
            </ul>

            <Button asChild variant="gold" className="mt-5 w-full">
              <Link to="/request-consultation" onClick={() => setMobileOpen(false)}>
                {t('nav.requestConsultation')}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>

            <div className="mt-6 space-y-2 pb-6 text-[0.8125rem] text-muted">
              <a href={contact.landlineHref} className="flex items-center gap-2.5 hover:text-navy">
                <Phone className="size-3.5 text-gold-deep" aria-hidden="true" />
                {contact.landline}
              </a>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2.5 break-all hover:text-navy">
                <Mail className="size-3.5 shrink-0 text-gold-deep" aria-hidden="true" />
                {contact.email}
              </a>
            </div>
          </nav>

          <div className="flex items-center justify-between border-t border-line px-5 py-3">
            <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-muted">
              {t('common.language')}
            </span>
            <LanguageSwitcher compact />
          </div>
        </motion.div>
      </div>
    </>
  )
}
