import { act, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import { HistoryPage } from '@/pages/public/about/HistoryPage'
import { LeadershipPage } from '@/pages/public/about/LeadershipPage'
import { CoreValuesPage } from '@/pages/public/about/CoreValuesPage'
import { AboutPage } from '@/pages/public/AboutPage'
import { fetchAbout } from '@/services/aboutApi'

vi.mock('@/services/aboutApi', () => ({
  fetchAbout: vi.fn(),
}))

const aboutContent = {
  overview: {
    introduction: 'Construction Solutions PLC is an Ethiopian institute.',
    background: 'Published company background.',
    purpose: 'Published company purpose.',
    capabilities: [],
  },
  milestones: [{ year: '2023', title: 'Published milestone', text: 'Verified milestone detail.' }],
  visionMission: { vision: 'Published vision.', mission: 'Published mission.' },
  coreValues: [],
  leadership: [
    {
      fullName: 'Martha Zelleke',
      position: 'General Manager',
      biography: null,
      professionalBackground: null,
      photograph: null,
    },
  ],
  organizationalStructure: {
    management: { title: 'General Management', support: 'Supported by the Project Management Office.' },
    practiceAreas: [],
  },
  whyChoose: [],
}

function renderPage(Page) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <MemoryRouter>
          <Page />
        </MemoryRouter>
      </LanguageProvider>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.lang = 'en'
  fetchAbout.mockReset()
  fetchAbout.mockResolvedValue({ data: aboutContent, source: 'api', error: null })
})

describe('About module', () => {
  it('loads published milestones from the API and shows a loading state', async () => {
    let resolveRequest
    fetchAbout.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve
      }),
    )

    renderPage(HistoryPage)
    expect(await screen.findByText(/loading company information/i)).toBeInTheDocument()

    await act(async () => {
      resolveRequest({ data: aboutContent, source: 'api', error: null })
    })

    expect(await screen.findByRole('heading', { name: 'Published milestone' })).toBeInTheDocument()
    expect(screen.getByText('Verified milestone detail.')).toBeInTheDocument()
  })

  it('shows placeholders instead of invented leadership biography or portrait', async () => {
    renderPage(LeadershipPage)

    expect(await screen.findByRole('heading', { name: 'Martha Zelleke' })).toBeInTheDocument()
    expect(screen.getByText('Biography pending approved information from CONSOL.')).toBeInTheDocument()
    expect(screen.getByText('Professional background has not been published.')).toBeInTheDocument()
    expect(screen.getByText('Photograph not provided')).toBeInTheDocument()
  })

  it('shows an explicit placeholder when no approved core values are available', async () => {
    renderPage(CoreValuesPage)

    expect(
      await screen.findByText('Core values are being prepared for publication.'),
    ).toBeInTheDocument()
  })

  it('renders the API error state with a retry action', async () => {
    fetchAbout.mockResolvedValue({
      data: null,
      source: 'error',
      error: { message: 'The service is unavailable.' },
    })
    renderPage(AboutPage)

    expect(await screen.findByRole('alert')).toHaveTextContent('The service is unavailable.')
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })
})
