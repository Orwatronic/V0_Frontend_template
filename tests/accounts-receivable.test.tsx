import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { I18nProvider } from '@/contexts/i18n-context'
import { AccountsReceivable } from '@/components/accounts-receivable'

describe('AccountsReceivable', () => {
  beforeEach(() => {
    // Ensure mock mode
    window.localStorage.setItem('feebee:auth:mock', '1')
  })

  it('renders mock AR invoices and filters by search', async () => {
    render(
      <I18nProvider>
        <AccountsReceivable />
      </I18nProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('CINV-201')).toBeTruthy()
    })

    const input = screen.getByPlaceholderText(/search/i)
    fireEvent.change(input, { target: { value: 'CINV-205' } })

    await waitFor(() => {
      expect(screen.getByText('CINV-205')).toBeTruthy()
      expect(screen.queryByText('CINV-201')).toBeNull()
    })
  })
})


