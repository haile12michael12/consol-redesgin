import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import { TranslationsAdminPage } from '@/pages/admin/TranslationsAdminPage'

const apiMocks = vi.hoisted(() => ({
  list: vi.fn(),
  save: vi.fn(),
  approve: vi.fn(),
  me: vi.fn(),
}))

vi.mock('@/services/contentTranslationsApi', () => ({
  contentTranslationsApi: {
    list: (...args) => apiMocks.list(...args),
    save: (...args) => apiMocks.save(...args),
    approve: (...args) => apiMocks.approve(...args),
  },
  contentTranslationsQuery: {
    list: (type) => ['admin', 'translations', type],
  },
}))

vi.mock('@/services/authApi', () => ({
  me: (...args) => apiMocks.me(...args),
}))

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <MemoryRouter>
          <TranslationsAdminPage />
        </MemoryRouter>
      </LanguageProvider>
    </QueryClientProvider>,
  )
}

describe('content translations admin', () => {
  beforeEach(() => {
    window.localStorage.clear()
    apiMocks.list.mockReset()
    apiMocks.save.mockReset()
    apiMocks.approve.mockReset()
    apiMocks.me.mockResolvedValue({
      data: { user: { is_admin: true, roles: [] } },
    })
  })

  it('lets an administrator submit and approve an Amharic translation', async () => {
    const record = {
      id: 8,
      slug: 'approved-company-update',
      title: 'Approved company update',
      status: 'missing',
      fields: {},
      publishedFields: {},
      sourceFields: { title: 'Approved company update', excerpt: 'English source excerpt' },
    }
    apiMocks.list.mockImplementation(async () => ({
      data: {
        type: 'news',
        fields: [
          { key: 'title', label: 'Title', input: 'text' },
          { key: 'excerpt', label: 'Excerpt', input: 'textarea' },
        ],
        items: [record],
      },
    }))
    apiMocks.save.mockImplementation(async (_type, _id, payload) => {
      record.fields = payload.fields
      record.status = payload.status
      return { data: record }
    })
    apiMocks.approve.mockImplementation(async () => {
      record.status = 'published'
      record.publishedFields = record.fields
      return { data: record }
    })

    const user = userEvent.setup()
    renderPage()

    await screen.findByRole('heading', { name: 'Approved company update' })
    await user.type(screen.getByRole('textbox', { name: 'Title — አማርኛ' }), 'የዜና ርዕስ')
    await user.type(screen.getByRole('textbox', { name: 'Excerpt — አማርኛ' }), 'የዜና ማጠቃለያ')
    await user.click(screen.getByRole('button', { name: 'Submit for approval' }))

    expect(apiMocks.save).toHaveBeenCalledWith('news', 8, {
      fields: { title: 'የዜና ርዕስ', excerpt: 'የዜና ማጠቃለያ' },
      status: 'pending_review',
    })

    await user.click(await screen.findByRole('button', { name: 'Approve and publish' }))
    expect(apiMocks.approve).toHaveBeenCalledWith('news', 8)
  })
})
