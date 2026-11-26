import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AssistantWidget } from '@/components/common/AssistantWidget'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import { me } from '@/services/authApi'
import App from '@/App'

vi.mock('@/services/coursesApi', () => {
  const course = {
    id: 1,
    slug: 'verified-training-course',
    title: 'Verified training course',
    summary: 'A course description published by CONSOL.',
    description: 'Detailed course information approved for publication.',
    category: { id: 1, slug: 'verified-category', name: 'Verified category' },
    image: null,
    imageAlt: null,
    learningObjectives: [],
    curriculum: [],
    requirements: [],
    faqs: [],
    duration: null,
    deliveryMethod: null,
    credential: null,
    certificateSupported: false,
    registrationEnabled: true,
    featured: false,
    schedules: [],
    instructors: [],
    relatedCourses: [],
  }

  return {
    fetchCourses: vi.fn(async () => ({
      current_page: 1,
      last_page: 1,
      total: 1,
      data: [course],
    })),
    fetchCourse: vi.fn(async () => course),
    fetchCourseCategories: vi.fn(async () => [course.category]),
    fetchTrainingSchedules: vi.fn(async () => ({ current_page: 1, last_page: 1, total: 0, data: [] })),
    fetchInstructors: vi.fn(async () => []),
    fetchInstructor: vi.fn(async () => { throw { response: { status: 404 } } }),
    fetchRegistrationConfirmation: vi.fn(),
    verifyCertificate: vi.fn(),
    submitRegistration: vi.fn(),
    coursesQuery: {
      all: (params = {}) => ['courses', params],
      detail: (slug) => ['courses', 'detail', slug],
      categories: ['courses', 'categories'],
      schedules: (params = {}) => ['training', 'schedules', params],
      instructors: ['training', 'instructors'],
      instructor: (slug) => ['training', 'instructors', slug],
      registration: (reference) => ['training', 'registration', reference],
    },
  }
})

vi.mock('@/services/authApi', () => ({
  getCsrfCookie: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  me: vi.fn(),
}))

vi.mock('@/services/assistantApi', () => ({
  askAssistant: vi.fn(async () => ({
    answer: 'CONSOL is a consulting, training and research institute.',
    sources: [{ title: 'About CONSOL', url: '/about' }],
  })),
}))

import { submitRegistration, verifyCertificate } from '@/services/coursesApi'
import { fetchServices } from '@/services/servicesApi'

vi.mock('@/services/newsApi', () => {
  const article = {
    id: 1,
    slug: 'approved-company-update',
    title: 'Approved company update',
    excerpt: 'A company update approved for publication.',
    body: ['Published article body.'],
    date: '2025-01-15',
    publishedAt: '2025-01-15T00:00:00Z',
    category: 'announcements',
    categoryName: 'Announcements',
    categoryId: 1,
    featured: true,
    image: null,
    imageAlt: null,
    status: 'published',
    relatedArticles: [],
  }
  const page = { current_page: 1, last_page: 1, total: 1, data: [article] }
  return {
    newsApi: {
      list: vi.fn(async (params = {}) => params.featured ? { ...page, data: [article] } : page),
      categories: vi.fn(async () => [{ id: 1, slug: 'announcements', name: 'Announcements' }]),
      show: vi.fn(async () => article),
      events: vi.fn(async () => ({ current_page: 1, last_page: 1, total: 0, data: [] })),
      showEvent: vi.fn(),
      resources: vi.fn(async () => ({ current_page: 1, last_page: 1, total: 0, data: [] })),
    },
    newsAdminApi: {
      listArticles: vi.fn(), categories: vi.fn(), createCategory: vi.fn(), updateCategory: vi.fn(),
      deleteCategory: vi.fn(), createArticle: vi.fn(), updateArticle: vi.fn(), deleteArticle: vi.fn(),
      listEvents: vi.fn(), createEvent: vi.fn(), updateEvent: vi.fn(), deleteEvent: vi.fn(),
      listResources: vi.fn(), createResource: vi.fn(), updateResource: vi.fn(), deleteResource: vi.fn(),
    },
    newsQuery: {
      all: ['news'],
      list: (params = {}) => ['news', 'list', params],
      categories: ['news', 'categories'],
      detail: (slug) => ['news', 'detail', slug],
      events: (params = {}) => ['events', params],
      event: (slug) => ['events', 'detail', slug],
      resources: (params = {}) => ['resources', params],
    },
  }
})

vi.mock('@/services/servicesApi', () => {
  const serviceRecords = [
    { slug: 'construction-management-consultancy', title: 'Construction Management Consultancy', summary: 'Published construction consultancy.', category: 'construction-management', image: '/media/site-inspection.jpg', imageAlt: 'Construction site', scope: [], benefits: [], status: 'published' },
    { slug: 'business-management-consultancy', title: 'Business Management Consultancy', summary: 'Published business consultancy.', category: 'business-management', image: '/media/consultancy.jpg', imageAlt: 'Consultancy meeting', scope: [], benefits: [], status: 'published' },
    { slug: 'professional-training', title: 'Professional Training & Certification', summary: 'Published professional training.', category: 'training', image: '/media/training.jpg', imageAlt: 'Training', scope: [], benefits: [], status: 'published' },
    { slug: 'research-industry-development', title: 'Research & Industry Development', summary: 'Published research.', category: 'research', image: '/media/adama-city.jpg', imageAlt: 'Research', scope: [], benefits: [], status: 'published' },
  ]

  return {
    fetchServices: vi.fn(async () => ({ data: serviceRecords, source: 'api', error: null })),
    fetchService: vi.fn(async (slug) => {
      const service = serviceRecords.find((item) => item.slug === slug)
      return service
        ? { data: service, source: 'api', error: null }
        : { data: null, source: 'error', error: { status: 404, message: 'Not found' } }
    }),
    servicesAdminApi: {
      list: vi.fn(async () => ({ data: serviceRecords })),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  }
})

vi.mock('@/services/projectsApi', () => {
  const project = {
    id: 1,
    slug: 'opm-maturity-improvement-construction-industry',
    title: 'Organisational Project Management (OPM) maturity improvement in the construction industry',
    summary: 'Preparation of an implementation manual and training delivery.',
    overview: 'Preparation of an implementation manual and training delivery.',
    client: 'Ministry of Urban & Infrastructure, UIIDP Program (World Bank funded project)',
    location: 'Federal programme, Ethiopia',
    year: 2022,
    duration: null,
    categories: [{ id: 1, slug: 'construction-management', name: 'Construction management' }],
    scope: ['Preparation of an implementation manual'],
    services: ['OPM maturity assessment'],
    outcomes: [],
    images: [],
    coverImage: null,
    featured: true,
    status: 'published',
    relatedProjects: [],
  }

  return {
    projectsApi: {
      list: vi.fn(async (params = {}) => ({
        data: {
          current_page: 1,
          last_page: 1,
          total: params.featured === 0 ? 0 : 1,
          data: params.featured === 0 ? [] : [project],
        },
      })),
      show: vi.fn(async () => ({ data: project })),
      categories: vi.fn(async () => ({ data: [{ id: 1, slug: 'construction-management', name: 'Construction management' }] })),
    },
    projectsAdminApi: {
      list: vi.fn(async () => ({ data: { data: [], current_page: 1, last_page: 1, total: 0 } })),
      categories: vi.fn(async () => ({ data: [] })),
      createCategory: vi.fn(),
      updateCategory: vi.fn(),
      deleteCategory: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    projectsQuery: {
      all: ['projects'],
      list: (params) => ['projects', 'list', params],
      detail: (slug) => ['projects', 'detail', slug],
      categories: ['projects', 'categories'],
    },
  }
})

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.lang = 'en'
  me.mockRejectedValue({ response: { status: 401, data: { message: 'Unauthenticated.' } } })
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

  it('renders API course details without inventing a schedule or credential', async () => {
    renderApp('/training/verified-training-course')
    expect(
      await screen.findByRole(
        'heading',
        { level: 1, name: 'Verified training course' },
        { timeout: 5000 },
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('No dates published')).toBeInTheDocument()
    expect(screen.queryByText(/credential information/i)).not.toBeInTheDocument()
  })

  it('loads published training and schedule information from the API', async () => {
    renderApp('/training')
    expect(await screen.findByRole('heading', { level: 1, name: /professional training and development/i })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: 'Verified training course' })).toHaveAttribute(
      'href',
      '/training/verified-training-course',
    )
    expect(screen.getByText('No upcoming schedules published')).toBeInTheDocument()
  })

  it('renders only API-published news and leaves the resource library empty until approved files exist', async () => {
    const newsRender = renderApp('/news')
    expect(await screen.findAllByRole('heading', { name: 'Approved company update' })).toHaveLength(2)
    expect(screen.queryByText(/Ethiopian Construction Project Management Manual Series/)).not.toBeInTheDocument()

    newsRender.unmount()
    renderApp('/resources')
    expect(await screen.findByText('No approved resources published')).toBeInTheDocument()
  })

  it('shows the 404 page for an unknown route', async () => {
    renderApp('/this-does-not-exist')
    expect(await screen.findByText('Page not found')).toBeInTheDocument()
  })

  it('renders the certificate verification form', async () => {
    renderApp('/verify-certificate')
    expect(await screen.findByRole('heading', { name: 'Certificate verification' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /verification code/i })).toBeInTheDocument()
    expect(verifyCertificate).not.toHaveBeenCalled()
  })

  it('requires administrator authentication before opening the admin dashboard', async () => {
    renderApp('/admin/dashboard')
    expect(
      await screen.findByRole('heading', { name: /staff sign in/i }, { timeout: 5000 }),
    ).toBeInTheDocument()
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

  it('links the training menu to confirmed schedules and certificate verification', async () => {
    const user = userEvent.setup()
    renderApp('/training')
    const nav = await screen.findByRole('navigation', { name: /main navigation/i })
    const training = within(nav).getByRole('button', { name: /training/i })
    expect(training).toHaveAttribute('aria-current', 'page')
    await user.click(training)
    expect(within(nav).getByRole('link', { name: /training calendar/i })).toHaveAttribute('href', '/training/schedule')
    expect(within(nav).getByRole('link', { name: /verify a certificate/i })).toHaveAttribute('href', '/verify-certificate')
  })

  it('opens and closes the mobile drawer with focus restored to its trigger', async () => {
    const user = userEvent.setup()
    renderApp('/')
    const menuButton = screen.getByRole('button', { name: /open menu/i })
    await user.click(menuButton)
    const drawer = await screen.findByRole('dialog', { name: /mobile navigation/i })
    await user.click(within(drawer).getByRole('button', { name: /close menu/i }))
    expect(menuButton).toHaveFocus()
  })

  it('offers verified email actions for newsletter and legal document requests', async () => {
    const user = userEvent.setup()
    renderApp('/')
    const privacyLink = await screen.findByRole('link', { name: /privacy policy/i })
    expect(privacyLink.getAttribute('href')).toContain('mailto:info@')

    await user.type(screen.getByPlaceholderText(/your email address/i), 'reader@example.com')
    await user.click(screen.getByRole('button', { name: /prepare request/i }))
    const requestLink = await screen.findByRole('link', { name: /open email to send/i })
    expect(requestLink.getAttribute('href')).toContain('mailto:info@constructionsolutionsplc.com')
    expect(requestLink.getAttribute('href')).toContain('reader%40example.com')
  })

  it('uses the verified company mobile for WhatsApp and supports back to top', async () => {
    const user = userEvent.setup()
    renderApp('/')
    expect(screen.getByRole('link', { name: /contact consol on whatsapp/i })).toHaveAttribute(
      'href',
      'https://wa.me/251911513011',
    )

    const originalScrollY = window.scrollY
    try {
      act(() => {
        Object.defineProperty(window, 'scrollY', { configurable: true, value: 600 })
        window.dispatchEvent(new Event('scroll'))
      })
      const backToTop = await screen.findByRole('button', { name: /back to top/i })
      await user.click(backToTop)
      expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'smooth' })
    } finally {
      Object.defineProperty(window, 'scrollY', { configurable: true, value: originalScrollY })
    }
  })
})

describe('forms', () => {
  it('shows registration API failures instead of reporting local demo success', async () => {
    const user = userEvent.setup()
    submitRegistration.mockRejectedValueOnce({
      response: { status: 500, data: { message: 'Registration service unavailable.' } },
    })
    renderApp('/training/verified-training-course/register')
    await screen.findByRole('heading', { level: 1, name: /course registration/i })
    const form = within(screen.getByRole('main'))
    await user.type(form.getByLabelText(/^Full name/i), 'Test Applicant')
    await user.type(form.getByLabelText(/^Email/i), 'applicant@example.com')
    await user.type(form.getByLabelText(/^Phone/i), '+251 911 123 456')
    await user.click(screen.getByRole('checkbox', { name: /agree that consol may contact me/i }))
    await user.click(screen.getByRole('button', { name: /register for this course/i }))
    expect(await screen.findByText('Registration service unavailable.')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /registration request received/i })).not.toBeInTheDocument()
  })

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

  it('uses published service records from the API for consultation options', async () => {
    const user = userEvent.setup()
    fetchServices.mockResolvedValueOnce({
      data: [{ slug: 'api-published-service', title: 'API-published service' }],
      source: 'api',
      error: null,
    })
    renderApp('/request-consultation')
    await screen.findByRole('heading', { level: 1, name: /request a consultation/i })
    await user.click(screen.getAllByRole('combobox')[0])
    expect(await screen.findByRole('option', { name: 'API-published service' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Construction Management Consultancy' })).not.toBeInTheDocument()
  })
})

describe('assistant interface', () => {
  it('answers a service question from published information', async () => {
    const user = userEvent.setup()
    render(
      <LanguageProvider>
        <MemoryRouter>
          <AssistantWidget />
        </MemoryRouter>
      </LanguageProvider>,
    )
    await user.click(await screen.findByRole('button', { name: /open consol assistant/i }))
    const dialog = await screen.findByRole('dialog', { name: /consol assistant/i })
    await user.click(within(dialog).getByRole('button', { name: /what does consol do\?/i }))
    expect(
      await within(dialog).findByText(/consulting, training and research institute/i),
    ).toBeInTheDocument()
    expect(within(dialog).getByRole('link', { name: 'About CONSOL' })).toHaveAttribute('href', '/about')
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
