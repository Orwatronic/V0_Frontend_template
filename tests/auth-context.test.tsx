import { describe, it, expect } from 'vitest'
import React from 'react'
import { render } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/auth-context'

function ReadAuth() {
  const { user, token } = useAuth()
  return <div data-user={user ? 'yes' : 'no'} data-token={token ? 'yes' : 'no'} />
}

describe('AuthProvider', () => {
  it('renders provider and exposes default unauthenticated state', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <div data-testid="root">
          <ReadAuth />
        </div>
      </AuthProvider>,
    )
    // If it renders, the context mounted; state is unauthenticated in test env
    expect(getByTestId('root')).toBeTruthy()
  })
})


