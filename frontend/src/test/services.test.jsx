import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ServicesAdminPage } from '@/pages/admin/ServicesAdminPage'
import { ServiceDetailPage } from '@/pages/public/ServiceDetailPage'
import { ServicesPage } from '@/pages/public/ServicesPage'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import { fetchService, fetchServices, servicesAdminApi } from '@/services/servicesApi'

vi.mock('@/services/servicesApi', () => ({
  fetchService: vi.fn(),
  fetchServices: vi.fn(),
  servicesAdminApi: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

const service = {
  id: 7,
  slug: 'construction-management-consultancy',
  title: 'Construction Management Consultancy',
  category: 'construction-management',
  summary: 'Published description from CONSOL.',
  description: null,
  image: '/media/site-inspection.jpg',
  imageAlt: 'Engineers reviewing construction documents',
  scope: ['PMO set-up and consultancy'],
  benefits: [],
  deliveryApproach: null,
  relatedProjects: [],
  faqs: [],
  status: 'published',
  order: 1,
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
  fetchService.mockReset()
  fetchServices.mockReset()
  servicesAdminApi.list.mockReset()
  servicesAdminApi.create.mockReset()
  servicesAdminApi.update.mockReset()
  servicesAdminApi.delete.mockReset()
})

describe('Services module', () => {
  it('renders only the service records returned by the Laravel API', async () => {
    fetchServices.mockResolvedValue({ data: [service], source: 'api', error: null })
    renderPage(<ServicesPage />)

    expect(await screen.findByRole('heading', { name: service.title, level: 3 })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /read more/i })[0]).toHaveAttribute(
      'href',
      `/services/${service.slug}`,
    )
  })

  it('shows approved service details and placeholders for unpublished detail', async () => {
    fetchService.mockResolvedValue({ data: service, source: 'api', error: null })
    fetchServices.mockResolvedValue({ data: [service], source: 'api', error: null })

    renderPage(
      <Routes>
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
      </Routes>,
      `/services/${service.slug}`,
    )

    expect(await screen.findByRole('heading', { level: 1, name: service.title })).toBeInTheDocument()
    expect(screen.getAllByText('PMO set-up and consultancy')).toHaveLength(2)
    expect(screen.getByText('A more detailed description is pending publication by CONSOL.')).toBeInTheDocument()
    expect(screen.getByText('Service benefits will be added when confirmed by CONSOL.')).toBeInTheDocument()
    expect(screen.getByText('The delivery approach is pending confirmation and publication by CONSOL.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /discuss this service/i })).toHaveAttribute(
      'href',
      `/request-consultation?service=${service.slug}`,
    )
  })

  it('lets an administrator create and publish a service record', async () => {
    const user = userEvent.setup()
    servicesAdminApi.list.mockResolvedValue({ data: [] })
    servicesAdminApi.create.mockResolvedValue({ data: { ...service, id: 8 } })
    renderPage(<ServicesAdminPage />)

    await user.click(await screen.findByRole('button', { name: /add service/i }))
    await user.type(screen.getByLabelText('Service title'), 'New verified service')
    await user.type(screen.getByLabelText('URL slug'), 'new-verified-service')
    await user.selectOptions(screen.getByLabelText('Category'), 'research')
    await user.selectOptions(screen.getByLabelText('Publication status'), 'published')
    await user.type(screen.getByLabelText('Short summary'), 'Approved summary.')
    await user.click(screen.getByRole('button', { name: /save service/i }))

    await waitFor(() => {
      expect(servicesAdminApi.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New verified service',
          slug: 'new-verified-service',
          category: 'research',
          status: 'published',
          summary: 'Approved summary.',
        }),
      )
    })
  })

  it('supports changing publication status and deleting a service', async () => {
    const user = userEvent.setup()
    servicesAdminApi.list.mockResolvedValue({ data: [service] })
    servicesAdminApi.update.mockResolvedValue({ data: { ...service, status: 'draft' } })
    servicesAdminApi.delete.mockResolvedValue({ data: { message: 'Service deleted.' } })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderPage(<ServicesAdminPage />)

    await user.click(await screen.findByRole('button', { name: 'Edit' }))
    await user.selectOptions(screen.getByLabelText('Publication status'), 'draft')
    await user.click(screen.getByRole('button', { name: /save service/i }))
    await waitFor(() => {
      expect(servicesAdminApi.update).toHaveBeenCalledWith(
        service.id,
        expect.objectContaining({ status: 'draft' }),
      )
    })

    await user.click(screen.getByRole('button', { name: `Delete ${service.title}` }))
    await waitFor(() => expect(servicesAdminApi.delete).toHaveBeenCalledWith(service.id))
    vi.restoreAllMocks()
  })

  it('shows recoverable API errors on the listing page', async () => {
    fetchServices.mockResolvedValue({
      data: null,
      source: 'error',
      error: { message: 'Service API unavailable.' },
    })
    renderPage(<ServicesPage />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Service API unavailable.')
  })
})
