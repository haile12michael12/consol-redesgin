import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'Construction Solutions PLC'
const BASE_URL = 'https://www.constructionsolutionsplc.com'

function setMeta(attr, key, content) {
  if (!content) return
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = href
}

function setJsonLd(id, data) {
  let script = document.head.querySelector(`script[data-seo="${id}"]`)
  if (!data) {
    script?.remove()
    return
  }
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.seo = id
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

/**
 * Apply page metadata. Runs on mount, update and locale change.
 */
export function usePageMeta({ title, description, path, image, jsonLd, noindex = false }) {
  const location = useLocation()
  const url = `${BASE_URL}${path ?? location.pathname}`

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | CONSOL`
    document.title = fullTitle
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title ? `${title} | CONSOL` : 'CONSOL')
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:type', 'website')
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    if (image) {
      setMeta('property', 'og:image', image)
      setMeta('name', 'twitter:image', image)
    }
    setCanonical(url)
    setJsonLd('page', jsonLd ?? null)
  }, [title, description, url, image, jsonLd, noindex])
}

export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${BASE_URL}${item.to}`,
    })),
  }
}
