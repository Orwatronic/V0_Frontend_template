'use server'

/**
 * Server actions for organization discovery in login flow.
 * In production, replace with real backend calls and auth checks.
 */

export interface Organization {
  code: string
  name: string
}

/**
 * Mock discovery by email domain. Replace with real backend lookups or SSO claims.
 * - bmw.com  -> BMW AG
 * - vw.com   -> Volkswagen AG
 * - feebee.com (our internal) -> both
 * - others -> none (require invite link or company code)
 */
export async function discoverOrganizationsByEmail(email: string): Promise<Organization[]> {
  // CURSOR: API call to GET /api/v1/organizations?email={email}
  const domain = (email.split('@')[1] || '').toLowerCase().trim()

  const ORGS: Record<string, Organization> = {
    BMW: { code: 'BMW', name: 'BMW AG' },
    VW: { code: 'VW', name: 'Volkswagen AG' },
  }

  // Mock policy: internal staff can see both; customers see only their org.
  if (domain === 'feebee.com') return [ORGS.BMW, ORGS.VW]
  if (domain === 'bmw.com') return [ORGS.BMW]
  if (domain === 'vw.com') return [ORGS.VW]
  return []
}

/**
 * Compatibility helper (unused by the new flow, but available for internal-only pages).
 * Returns nothing by default to avoid cross-tenant leakage.
 */
export async function getOrganizations(): Promise<Organization[]> {
  // CURSOR: API call to GET /api/v1/organizations (internal-only)
  return []
}
