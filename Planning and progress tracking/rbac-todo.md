# RBAC Implementation To-Do (v1)

Owner: Lead Frontend Architect
Status: Planned

Purpose
A dedicated, versioned plan for role-based access control. RBAC is a cross-cutting foundation and must be treated as a first-class deliverable with clear acceptance criteria, endpoint maps, and testability. This follows the enterprise prompts’ guidance for access control and cross-module integration. [^4][^5]

Scope (Frontend)
- Navigation-level gating: Only render modules the user can access; reflect computed permissions in the App Shell.
- Route protection: Guard pages by permission; unauthorized → friendly 403 with recovery guidance.
- Component-level checks: withPermission HOC/hook to conditionally render critical controls (e.g., Approve, Post, Export).
- Data-scope hints: Surface current scope (org, company) and enforce through queries; drive UI affordances for restricted data.
- Caching and refresh: Cache permissions and invalidate on org switch, login, or explicit refresh.
- Telemetry: Emit events when permission blocks occur for audit and UX analysis.

Acceptance Criteria
- Rendering: Navigation, routes, and actions reflect server-provided permissions consistently.
- Security: Client cannot elevate permissions by mutating local state (UI checks complement server enforcement).
- UX: Clear, accessible 403 screens, with links to request access.
- Performance: Permission fetch avoids layout thrash; cached with reasonable TTL and invalidations on org change.
- Test Coverage: Unit tests for permission helpers; integration tests for gated routes and actions.

Risks/Notes
- Client checks are necessary but not sufficient. Backend must enforce permissions on every endpoint and payload. [^4]
- Consider ABAC extensions (attributes like org, region, cost center) after RBAC v1 stabilizes. [^5]

## Milestones

M1: Foundation (This Sprint)
- Permission types and client cache
- Fetch on login and org switch; hydrate into context
- Hook: `usePermissions().hasPermission(code)`
- Route guard utility and 403 page
- Navigation gating wired to server permissions

M2: Component-level Enforcement
- `RequirePermission` component/HOC
- Button/Action wrappers (disabled with tooltip + reason)
- Audit events for denied interactions

M3: Advanced
- ABAC groundwork (org/region)
- Admin UI for permission introspection (read-only)
- Optimistic UI for permission updates (admin flows)

## // API Endpoints for CURSOR
\`\`\`typescript
// AuthN/AuthZ
GET  /api/v1/users/me                    // Profile (includes roles and basic info)
GET  /api/v1/users/me/permissions        // Computed permissions for current org/company
POST /api/v1/auth/logout                 // Invalidate session

// Org/Company Context
GET  /api/v1/users/me/companies          // List of companies/tenants
POST /api/v1/context/switch              // Switch org/company

// Navigation Model (optional, for server-driven nav)
GET  /api/v1/navigation                  // Returns nav tree with permissions and badges
\`\`\`

Implementation Notes
- Start by hydrating permissions at login and on org switch; store in auth/context state.
- Navigation should remain resilient: if server-driven nav is unavailable, fall back to client map while respecting server permissions.
- Add E2E tests for a representative set of pages (view:dashboard, view:financials, admin:settings).
