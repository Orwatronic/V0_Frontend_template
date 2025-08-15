import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { I18nProvider } from '@/contexts/i18n-context'
import { AccountsPayable } from '@/components/accounts-payable'

describe('AccountsPayable', () => {
  beforeEach(() => {
    // Ensure mock mode
    window.localStorage.setItem('feebee:auth:mock', '1')
  })

  it('renders mock invoices and filters by search', async () => {
    render(
      <I18nProvider>
        <AccountsPayable />
      </I18nProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('INV-001')).toBeTruthy()
    })

    const input = screen.getByPlaceholderText(/search/i)
    fireEvent.change(input, { target: { value: 'INV-005' } })

    await waitFor(() => {
      expect(screen.getByText('INV-005')).toBeTruthy()
      expect(screen.queryByText('INV-001')).toBeNull()
    })
  })
})


