import { describe, expect, it } from 'vitest'
import { getLocalizedPath, isAmharicPath } from '@/lib/localizedRoutes'

describe('localized routes', () => {
  it('adds and removes the Amharic prefix without changing the route path', () => {
    expect(getLocalizedPath('/services/project-management', 'am')).toBe('/am/services/project-management')
    expect(getLocalizedPath('/am/services/project-management', 'en')).toBe('/services/project-management')
    expect(getLocalizedPath('/', 'am')).toBe('/am')
  })

  it('recognizes only the locale path segment', () => {
    expect(isAmharicPath('/am')).toBe(true)
    expect(isAmharicPath('/am/news')).toBe(true)
    expect(isAmharicPath('/about')).toBe(false)
    expect(isAmharicPath('/amazon')).toBe(false)
  })
})
