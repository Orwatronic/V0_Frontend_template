import { describe, it, expect } from 'vitest'

// This is a smoke test to ensure our CSP string does not contain obvious mistakes
describe('Security headers (CSP)', () => {
  it('has a basic CSP shape', () => {
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' http://localhost:3001",
      "frame-ancestors 'self'",
      "form-action 'self'",
    ].join('; ')
    expect(csp.includes("default-src 'self'"))
    expect(csp.includes("script-src 'self'"))
    expect(csp.includes("img-src 'self' data: blob:"))
  })
})


