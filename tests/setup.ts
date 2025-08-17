import React from 'react'
import { vi } from 'vitest'

// Make React available globally for JSX in tests when using preserve/automatic runtimes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).React = React

// Minimal Next.js router mocks for components using next/navigation
vi.mock('next/navigation', () => {
  const push = vi.fn()
  const replace = vi.fn()
  const prefetch = vi.fn()
  const back = vi.fn()
  const forward = vi.fn()

  return {
    useRouter: () => ({ push, replace, prefetch, back, forward }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  }
})


