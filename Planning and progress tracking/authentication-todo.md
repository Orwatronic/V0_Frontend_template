# Authentication Module — Phase 1 Hardening

Status: Active

## Goals
- Enforce multi-tenant isolation in login and post-login flows.
- Add MFA and device trust with accessible UX and full i18n.
- Prepare API integrations with CURSOR annotations.

## Scope delivered in this iteration
- MFA scaffolding and device trust step in login flow (client-side).
- Accessible error handling with aria-live alerts and focus management.
- Lockout UI (front-end only) with attempt counter and retry timer.
- Organizations selector powered by local API using a server action (mock data).
- Testing mode to bypass backend constraints during preview/dev.

## Immediate Tasks
- Organization discovery returns only orgs authorized for the current identity (email/SSO).
- Hide the company selector for single-tenant users; show only allowed orgs for multi-tenant users.
- Maintain mock bypass for local testing, disabled in production builds.

## Acceptance Criteria
- BMW users never see VW (and vice versa) in the org selector. Privacy-first default when identity is unknown. [Enterprise security standard] [^4]
- If exactly one allowed org is returned, it is auto-selected and the selector is hidden.
- Login supports steps: credentials → mfa → deviceTrust with proper focus order and keyboard navigation. [i18n/RTL compliant]
- All user-facing strings come from i18n bundles (en/ar/no). No hardcoded strings.
- Lockout UI appears after N failed attempts and counts down to retry.
- Organizations are loaded via API; errors are localized and visible.
- All UI is localized and RTL-compatible; accessible labels and aria-live regions are present. [^2]
- Testing toggle allows bypassing backend and navigating to the dashboard.
- All backend call sites include CURSOR annotations.

## Next Actions
- Wire credentials, MFA, and device trust to real backend endpoints.
- Persist device-trust via secure cookie; ensure HttpOnly, Secure, SameSite=strict.
- Add unit tests for lockout logic and focus management.
- Begin Phase B i18n: Intl number/date/currency helpers; pseudo-locale; dev missing-key warnings.

### // API Endpoints for CURSOR
- GET /api/v1/organizations?email={email} — Discover organizations for the specified identity
- POST /api/v1/auth/login — Credentials step
- POST /api/v1/auth/mfa/verify — Verify MFA code
- POST /api/v1/auth/device-trust — Trust this device (optional)

## Notes
- Replace domain-based mock with real backend lookups (directory/claims).
- For SSO, derive org list from IdP claims or SCIM provisioning.
- Add an unauthorized screen and secure cookie for device trust in the next iteration.
