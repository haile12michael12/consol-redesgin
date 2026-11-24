import { NavLink } from 'react-router-dom'
import { useT } from '@/i18n/LanguageProvider'
import { cn } from '@/lib/utils'

const links = [
  { to: '/about', labelKey: 'about.nav.overview', end: true },
  { to: '/about/vision-mission', labelKey: 'about.nav.vision' },
  { to: '/about/leadership', labelKey: 'about.nav.leadership' },
  { to: '/about/history', labelKey: 'about.nav.history' },
  { to: '/about/structure', labelKey: 'about.nav.structure' },
  { to: '/about/certifications', labelKey: 'about.nav.certifications' },
  { to: '/about/clients-partners', labelKey: 'about.nav.clients' },
]

/** Section switcher shared by every About page. */
export function AboutSubNav() {
  const t = useT()
  return (
    <div className="border-b border-line bg-white">
      <div className="shell">
        <nav aria-label="About CONSOL" className="no-scrollbar -mx-1 overflow-x-auto">
          <ul className="flex min-w-max items-stretch">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      'relative flex h-14 items-center whitespace-nowrap px-4 text-[0.75rem] font-semibold transition-colors first:pl-0',
                      'after:absolute after:inset-x-4 after:bottom-0 after:h-[2px] after:origin-left after:bg-gold after:transition-transform after:duration-300 first:after:left-0',
                      isActive
                        ? 'text-navy after:scale-x-100'
                        : 'text-muted after:scale-x-0 hover:text-navy',
                    )
                  }
                >
                  {t(link.labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
