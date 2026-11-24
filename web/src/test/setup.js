import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// jsdom lacks these APIs; components use them for scroll, motion and dialogs.
window.matchMedia =
  window.matchMedia ||
  ((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

window.scrollTo = vi.fn()
window.HTMLElement.prototype.scrollIntoView = vi.fn()
window.HTMLElement.prototype.hasPointerCapture = vi.fn()
window.HTMLElement.prototype.releasePointerCapture = vi.fn()
window.ResizeObserver =
  window.ResizeObserver ||
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

// Framer Motion's whileInView needs IntersectionObserver.
window.IntersectionObserver =
  window.IntersectionObserver ||
  class {
    constructor(callback) {
      this.callback = callback
    }
    observe(element) {
      this.callback([{ isIntersecting: true, target: element }], this)
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
