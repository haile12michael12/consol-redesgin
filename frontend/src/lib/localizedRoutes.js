const AMHARIC_PREFIX = '/am'

export function isAmharicPath(pathname) {
  return pathname === AMHARIC_PREFIX || pathname.startsWith(`${AMHARIC_PREFIX}/`)
}

export function getLocalizedPath(pathname, language) {
  const path = isAmharicPath(pathname) ? pathname.slice(AMHARIC_PREFIX.length) || '/' : pathname
  if (language !== 'am') return path
  return path === '/' ? AMHARIC_PREFIX : `${AMHARIC_PREFIX}${path}`
}

export function getInitialRouterBasename() {
  const { pathname, search, hash } = window.location
  if (isAmharicPath(pathname)) return AMHARIC_PREFIX

  const storedLanguage = window.localStorage.getItem('consol.lang')
  const preferredLanguage = storedLanguage === 'am'
    || (!storedLanguage && window.navigator.language?.slice(0, 2) === 'am')
    ? 'am'
    : 'en'

  if (preferredLanguage === 'am') {
    window.history.replaceState(null, '', `${getLocalizedPath(pathname, 'am')}${search}${hash}`)
    return AMHARIC_PREFIX
  }

  return '/'
}
