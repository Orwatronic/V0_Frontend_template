import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { I18nProvider } from '@/contexts/i18n-context'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(), back: vi.fn(), forward: vi.fn() }),
  usePathname: () => '/crm',
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

import CRMPage from '@/app/crm/page'
import CustomerPortalPage from '@/app/customer-portal/page'

describe('Page RBAC smoke', () => {
  it('renders CRM when permission view:sales is granted', () => {
    const { container } = render(
      <I18nProvider>
        <CRMPage />
      </I18nProvider>,
    )
    expect(container).toBeTruthy()
  })
  it('renders Customer Portal when permission view:sales is granted', () => {
    const { container } = render(
      <I18nProvider>
        <CustomerPortalPage />
      </I18nProvider>,
    )
    expect(container).toBeTruthy()
  })
})


