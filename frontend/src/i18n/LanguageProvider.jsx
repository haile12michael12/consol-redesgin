import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import en from './en'
import am from './am'

const dictionaries = { en, am }
const STORAGE_KEY = 'consol.lang'
const supported = ['en', 'am']
const AMHARIC_PREFIX = '/am'

const LanguageContext = createContext(null)

function detectInitial() {
  if (typeof window === 'undefined') return 'en'
  if (
    window.location.pathname === AMHARIC_PREFIX
    || window.location.pathname.startsWith(`${AMHARIC_PREFIX}/`)
  ) return 'am'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored && supported.includes(stored)) return stored
  const browser = window.navigator.language?.slice(0, 2)
  return browser === 'am' ? 'am' : 'en'
}

export function LanguageProvider({ children, onLanguageChange }) {
  const [lang, setLang] = useState(detectInitial)

  useEffect(() => {
    document.documentElement.lang = lang
    window.localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  const t = useCallback(
    (key, vars) => {
      const dict = dictionaries[lang] ?? en
      let value = dict[key] ?? en[key] ?? key
      if (vars) {
        Object.entries(vars).forEach(([name, replacement]) => {
          value = value.replaceAll(`{${name}}`, String(replacement))
        })
      }
      return value
    },
    [lang],
  )

  const setLanguage = useCallback((next) => {
    if (!supported.includes(next) || next === lang) return
    setLang(next)
    onLanguageChange?.(next)
  }, [lang, onLanguageChange])

  const value = useMemo(
    () => ({ lang, locale: lang, setLanguage, t, isAmharic: lang === 'am' }),
    [lang, setLanguage, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}

export function useT() {
  return useLanguage().t
}

export const languages = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'am', label: 'አማርኛ', short: 'አማ' },
]
