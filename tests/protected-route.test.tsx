import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({ push: vi.fn() }),
  }
})

vi.mock('@/contexts/auth-context', async () => {
  return {
    useAuth: () => ({ token: 't', isLoading: false, isLoggingOut: false }),
  } as any
})

vi.mock('@/hooks/use-permissions', async () => {
  return {
    usePermissions: () => ({ hasPermission: (p: string) => p === 'allowed:perm' }),
  }
})

import ProtectedRoute from '@/components/protected-route'

describe('ProtectedRoute', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders children when permission is allowed', () => {
    render(
      <ProtectedRoute required="allowed:perm">
        <div data-testid="ok">content</div>
      </ProtectedRoute>,
    )
    expect(screen.getByTestId('ok')).toBeTruthy()
  })

  it('does not render children when permission is missing', () => {
    render(
      <ProtectedRoute required="view:financials">
        <div data-testid="nope">content</div>
      </ProtectedRoute>,
    )
    expect(screen.queryByTestId('nope')).toBeNull()
  })
})


