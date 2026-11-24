import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes with correct precedence. */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/** Format an ISO date as "30 June 2023" without locale surprises. */
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function formatDate(value, locale = 'en') {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  if (locale === 'am') {
    return new Intl.DateTimeFormat('am-ET', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

/** Build a `/path?query` string, dropping empty values. */
export function withQuery(path, params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      search.set(key, String(value))
    }
  })
  const query = search.toString()
  return query ? `${path}?${query}` : path
}

/** Stable slug from a title — used for demo records and search anchors. */
export function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Group a list by a key function. */
export function groupBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item)
    ;(acc[key] ||= []).push(item)
    return acc
  }, {})
}

export function truncate(value, max = 160) {
  if (!value) return ''
  return value.length > max ? `${value.slice(0, max).trimEnd()}…` : value
}
