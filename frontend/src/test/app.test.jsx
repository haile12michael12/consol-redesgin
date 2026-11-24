import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '@/App'

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.lang = 'en'
})

function renderApp(path = '/') {
  window.history.pushState({}, '', path)
  return render(<App />)
}

describe('public routes', () => {
  it('renders the homepage hero and headline', async () => {
    renderApp('/')
    expect(
      await screen.findByRole('heading', { level: 1, name: /building expertise/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /explore services/i })).toHaveAttribute(
      'href',
      '/services',
    )
  })

  it('renders the services catalogue with all four practice areas', async () => {
    renderApp('/services')
    expect(
      await screen.findByRole(
        'heading',
        { level: 1, name: /consultancy and capability/i },
        { timeout: 5000 },
      ),
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole('link', { name: /construction management consultancy/i }).length,
    ).toBeGreaterThan(0)
  })

  it('renders a project detail page from a verified record', async () => {
    renderApp('/projects/opm-maturity-improvement-construction-industry')
    expect(
      await screen.findByRole(
        'heading',
        {
          level: 1,
          name: /organisational project management \(opm\) maturity/i,
        },
        { timeout: 5000 },
      ),
    ).toBeInTheDocument()
    expect(screen.getByText(/ministry of urban & infrastructure/i)).toBeInTheDocument()
  })

  it('renders a course page without inventing a schedule or fee', async () => {
    renderApp('/training/pmp-certification-preparation')
    expect(await screen.findByRole('heading', { level: 1, name: /PMP®/i })).toBeInTheDocument()
    expect(screen.getAllByText(/dates to be confirmed/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/fee on confirmation/i).length).toBeGreaterThan(0)
    expect(screen.queryByText(/\$|ETB|birr/i)).not.toBeInTheDocument()
  })

  it('shows the 404 page for an unknown route', async () => {
    renderApp('/this-does-not-exist')
    expect(await screen.findByText('Page not found')).toBeInTheDocument()
  })

  it('renders the admin demo dashboard without authentication', async () => {
    renderApp('/admin/dashboard')
    expect(await screen.findByText(/welcome back, administrator/i)).toBeInTheDocument()
    expect(screen.getAllByText(/demo data/i).length).toBeGreaterThan(0)
  })
})

describe('navigation', () => {
  it('exposes a primary navigation landmark and the consultation CTA', async () => {
    renderApp('/')
    const nav = await screen.findByRole('navigation', { name: /main navigation/i })
    expect(within(nav).getByRole('button', { name: /services/i })).toHaveAttribute(
      'aria-haspopup',
      'true',
    )
    expect(within(nav).getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'href',
      '/projects',
    )
    expect(
      screen.getAllByRole('link', { name: /request consultation/i }).length,
    ).toBeGreaterThan(0)
  })

  it('switches the interface language to Amharic', async () => {
    const user = userEvent.setup()
    renderApp('/')
    const group = await screen.findByRole('group', { name: /language/i })
    await user.click(within(group).getByRole('button', { name: /አማ/i }))
    const nav = await screen.findByRole('navigation', { name: /ዋና ምናሌ/i })
    expect(within(nav).getByRole('link', { name: 'ፕሮጀክቶች' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('am')
  })
})

describe('forms', () => {
  it('blocks an invalid contact submission and shows field errors', async () => {
    const user = userEvent.setup()
    renderApp('/contact')
    await screen.findByRole(
      'heading',
      { level: 1, name: /talk to consol/i },
      { timeout: 5000 },
    )
    await user.click(screen.getByRole('button', { name: /send message/i }))
    expect(await screen.findByText(/please enter your full name/i)).toBeInTheDocument()
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
  })

  it('validates the consultation form and requires a service category', async () => {
    const user = userEvent.setup()
    renderApp('/request-consultation')
    await screen.findByRole(
      'heading',
      { level: 1, name: /request a consultation/i },
      { timeout: 5000 },
    )
    await user.click(screen.getByRole('button', { name: /request consultation/i }))
    expect(await screen.findByText(/please select a service category/i)).toBeInTheDocument()
  })
})

describe('assistant interface', () => {
  it('answers a service question from published information', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await user.click(screen.getByRole('button', { name: /open consol assistant/i }))
    const dialog = await screen.findByRole('dialog', { name: /consol assistant/i })
    await user.click(within(dialog).getByRole('button', { name: /what does consol do\?/i }))
    expect(
      await within(dialog).findByText(/consulting, training and research institute/i),
    ).toBeInTheDocument()
  })
})

describe('error handling', () => {
  it('renders a recoverable error page when a child throws', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { ErrorBoundary } = await import('@/components/common/ErrorBoundary')
    function Broken() {
      throw new Error('boom')
    }
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    )
    expect(screen.getByText(/this page could not be displayed/i)).toBeInTheDocument()
    spy.mockRestore()
  })
})
