import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProjectsAdminPage } from '@/pages/admin/ProjectsAdminPage'
import { ProjectDetailPage } from '@/pages/public/ProjectDetailPage'
import { ProjectsPage } from '@/pages/public/ProjectsPage'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import { projectsAdminApi, projectsApi } from '@/services/projectsApi'

vi.mock('@/services/projectsApi', () => ({
  projectsApi: {
    list: vi.fn(),
    show: vi.fn(),
    categories: vi.fn(),
  },
  projectsAdminApi: {
    list: vi.fn(),
    categories: vi.fn(),
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
}))

const project = {
  id: 21,
  slug: 'verified-project',
  title: 'Verified Project',
  summary: 'A project record published by CONSOL.',
  overview: 'Approved project overview.',
  client: null,
  location: null,
  duration: null,
  year: 2022,
  categories: [{ id: 3, slug: 'research', name: 'Research' }],
  scope: ['Verified scope item'],
  services: ['Verified service'],
  outcomes: [],
  images: [],
  coverImage: null,
  featured: true,
  status: 'published',
  relatedProjects: [],
}

function renderPage(element, initialEntry = '/') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          {element}
        </MemoryRouter>
      </LanguageProvider>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Projects module', () => {
  it('loads project listings and configurable categories from the API', async () => {
    projectsApi.list.mockImplementation(async (params = {}) => ({
      data: {
        data: params.featured === 1 ? [project] : [],
        current_page: 1,
        last_page: 1,
        total: params.featured === 1 ? 1 : 0,
      },
    }))
    projectsApi.categories.mockResolvedValue({
      data: [{ id: 3, slug: 'research', name: 'Research' }],
    })
    renderPage(<ProjectsPage />)

    expect(await screen.findByRole('heading', { name: project.title, level: 2 })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Research' })).toBeInTheDocument()
    expect(projectsApi.list).toHaveBeenCalledWith(expect.objectContaining({ featured: 1 }))
  })

  it('loads published project details and marks generic imagery as illustrative', async () => {
    projectsApi.show.mockResolvedValue({ data: project })
    renderPage(
      <Routes>
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
      </Routes>,
      `/projects/${project.slug}`,
    )

    expect(await screen.findByRole('heading', { level: 1, name: project.title })).toBeInTheDocument()
    expect(screen.getByText('Illustrative imagery is shown because no project-specific photograph has been provided.')).toBeInTheDocument()
    expect(screen.getByText('No approved project outcomes have been provided for publication.')).toBeInTheDocument()
  })

  it('allows administrators to create a published project with approved client information', async () => {
    const user = userEvent.setup()
    projectsAdminApi.list.mockResolvedValue({ data: { data: [], current_page: 1, last_page: 1, total: 0 } })
    projectsAdminApi.categories.mockResolvedValue({
      data: [{ id: 3, slug: 'research', name: 'Research', sortOrder: 1, projectCount: 0 }],
    })
    projectsAdminApi.create.mockResolvedValue({ data: project })
    renderPage(<ProjectsAdminPage />)

    await user.click(await screen.findByRole('button', { name: /add project/i }))
    await user.type(screen.getByLabelText('Project title'), 'New verified work')
    await user.type(screen.getByLabelText('URL slug'), 'new-verified-work')
    await user.type(screen.getByLabelText('Short summary'), 'Approved summary.')
    await user.type(screen.getByLabelText('Project overview'), 'Approved overview.')
    await user.click(screen.getByLabelText('Research'))
    await user.type(screen.getByLabelText('Client name'), 'Approved Client')
    await user.click(screen.getByLabelText('Client approved for publication'))
    await user.selectOptions(screen.getByLabelText('Publication status'), 'published')
    await user.click(screen.getByRole('button', { name: /save project/i }))

    await waitFor(() => expect(projectsAdminApi.create).toHaveBeenCalledTimes(1))
    const formData = projectsAdminApi.create.mock.calls[0][0]
    expect(formData).toBeInstanceOf(FormData)
    expect(formData.get('title')).toBe('New verified work')
    expect(formData.get('client')).toBe('Approved Client')
    expect(formData.get('client_approved')).toBe('1')
    expect(formData.get('status')).toBe('published')
    expect(formData.getAll('categories[]')).toEqual(['3'])
  })

  it('shows recoverable listing failures', async () => {
    projectsApi.list.mockRejectedValue({
      response: { data: { message: 'Project API unavailable.' } },
    })
    projectsApi.categories.mockResolvedValue({ data: [] })
    renderPage(<ProjectsPage />)

    const alerts = await screen.findAllByRole('alert')
    expect(alerts.some((alert) => alert.textContent.includes('Project API unavailable.'))).toBe(true)
  })
})
