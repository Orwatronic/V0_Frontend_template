import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(), back: vi.fn(), forward: vi.fn() }),
  usePathname: () => '/crm/leads',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/contexts/auth-context', async () => {
  return {
    useAuth: () => ({ token: 't', isLoading: false, isLoggingOut: false }),
  } as any
})

vi.mock('@/hooks/use-permissions', async () => {
  return {
    usePermissions: () => ({ hasPermission: (p: string) => p === 'view:sales' }),
  }
})

// Mock fetch to return deterministic data for leads route
global.fetch = vi.fn(async (input: RequestInfo) => {
  if (typeof input === 'string' && input.includes('/api/crm/leads')) {
    return {
      ok: true,
      json: async () => ({
        data: [
          { id: 'L-1001', company: 'Contoso', owner: 'Alice', status: 'new', createdAt: '2025-08-01T09:00:00Z', score: 62 },
          { id: 'L-1002', company: 'Northwind', owner: 'Bob', status: 'qualified', createdAt: '2025-08-03T10:30:00Z', score: 48 },
        ],
      }),
    } as any
  }
  return { ok: true, json: async () => ({ data: [] }) } as any
})

import LeadsPage from '@/app/crm/leads/page'
import { I18nProvider } from '@/contexts/i18n-context'

describe('CRM Leads list', () => {
  it('renders table and rows from API', async () => {
    render(
      <I18nProvider>
        <LeadsPage />
      </I18nProvider>,
    )
    const row = await screen.findByTestId('lead-row-L-1001')
    expect(row).toBeTruthy()
    const cells = within(row).getAllByRole('cell')
    expect(cells[1].textContent).toContain('L-1001')
    expect(cells[2].textContent).toContain('Contoso')
  })
})


