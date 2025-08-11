# Feebee ERP Frontend Assessment and Next Task (2025-08-08)

Author: Lead Frontend Architect

## Role Reminder
I am responsible for delivering a production-grade ERP frontend that adheres to the comprehensive enterprise prompts and quality bars for security, performance, accessibility, internationalization, and maintainability, implementing the sequence: foundations → core modules → advanced features, and following the CURSOR integration protocol. [^1][^2]

## Current Status Summary
- Application Shell and Navigation: Partially implemented with responsive layout, company switcher, global search, notifications, and permission-aware nav. Solid foundation aligning with the shell prompt. [^2]
- Authentication: Context and login page exist but are not yet complete (JWT/refresh/MFA/secure storage/route guards). [^1][^2]
- Planning: FI module audit is defined; many other module todos require expansion to match FI rigor. [^1][^2]
- Cross-cutting: i18n framework, accessibility framework, testing, PWA, CSP/security hardening not fully implemented. [^1][^2]
- CURSOR protocol: Present in places; needs consistent application across modules and planning files. [^1]

## Enterprise-Grade Assessment
- Accessibility: Needs WCAG 2.1 AAA framework (landmarks, keyboard focus management, live regions, automated tests). [^2]
- Internationalization: Locale files exist; must add provider, dynamic loading, pluralization, RTL support. [^2]
- Security: Define CSP, input sanitization, CSRF/XSS mitigations, secure cookie/JWT strategy; audit client/server env usage. [^1]
- Performance: Introduce budgets, route split, image policies, TanStack Query caching, memoization patterns. [^1]
- Testing: Add unit, integration, and E2E coverage with a seedable data harness. [^1][^2]
- PWA/Offline: Not implemented; add service worker, caching strategies, background sync, and update flows. [^2]
- Observability: Structured logging and error reporting hooks TBD. [^1]
- Code hygiene: Resolve duplicate global CSS (app/globals.css vs styles/globals.css).

## Recommended Next Task (FT-001): Foundation Hardening & Authentication v1
- Objective: Deliver end-to-end, secure auth with permission gating, establish i18n provider, error boundaries, and initial tests before the FI audit.
- Deliverables:
  - Login/logout with refresh rotation, secure storage, and MFA hook points.
  - ProtectedRoute/withPermission utilities enforced in App Router.
  - i18n provider + translation loading; remove mock t() usage in nav and shell.
  - Global error boundary and route-level error UI.
  - Consolidated globals.css; stable theming.
  - Unit tests for auth utilities; integration tests for login + protected route.
  - CURSOR endpoint comments at call sites and planning updates.
- Acceptance Criteria:
  - Authenticated sessions persist and refresh; permission-driven nav and pages.
  - No hard-coded user-facing strings in shell; i18n verified for at least en + one more locale.
  - Error fallback is accessible and covers render errors.
  - Duplicate global CSS removed; visual regression ≤ minimal.

## Implementation Notes
- Use NEXT_PUBLIC_API_BASE_URL and NEXT_PUBLIC_WS_URL; server-only secrets remain on the server.
- Add error monitoring hook to simplify later observability integration.
- Ensure Windows-compatible npm scripts for any new tasks. [^1]

## // API Endpoints for CURSOR
\`\`\`typescript
// Auth
POST /api/v1/auth/login           // Authenticate with credentials; returns access/refresh tokens
POST /api/v1/auth/logout          // Invalidate session/refresh token
POST /api/v1/auth/refresh         // Rotate and return a new access token
POST /api/v1/auth/mfa/verify      // Verify MFA code (if enabled)

// User & permissions
GET  /api/v1/users/me             // Current user profile
GET  /api/v1/users/me/companies   // List of companies available to the user
GET  /api/v1/permissions          // Role/permission map for current user/session
\`\`\`

## Next Steps
1) Implement FT-001 as specified (auth, i18n, error boundaries, tests, CSS unification).
2) Update all module TODOs with explicit acceptance criteria and CURSOR endpoint maps.
3) Proceed with FI audit using enforced auth/permissions and i18n to avoid rework. [^2]
