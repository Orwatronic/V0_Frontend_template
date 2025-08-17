### Feebee ERP Frontend — Project Status (as of 2025-08-14)

#### Architecture & Tooling
- **App framework**: Next.js 14.2.16 with App Router (per `package.json`)
- **TypeScript**: Strict mode enabled (`tsconfig.json`)
- **Styling**: Tailwind CSS 3.4 with shadcn/ui patterns
- **Design system**: Present; shared UI in `components/ui/*`
- **Monorepo**: Not used (prompts reference a Turborepo monorepo; current repo is a single app)

#### Internationalization (i18n)
- **Locales**: `en`, `ar`, `no` with JSON bundles in `locales/*/translation.json`
- **Provider**: `I18nProvider` mounted in `app/layout.tsx`
- **Features**: RTL detection for `ar`, pseudo-locale support (`en-XA`), missing-key tracking
- **Health checks**: Scripts exist (`scripts/check-i18n-keys.ts`, `scripts/check-hardcoded-strings.ts`) and npm scripts `i18n:check-keys`, `i18n:check-strings`, `i18n:validate`

#### Authentication
- **Context**: `AuthProvider` present with mock login/logout (`lib/auth.ts`)
- **Session storage**: localStorage tokens and user info
- **Routing**: Redirects to `/dashboard` on login; `/` on logout
- **Note**: Real API integration is stubbed (prompts expect full JWT/MFA flows)

#### UI Shell & Navigation
- **Providers**: `ThemeProvider`, `I18nProvider`, `AuthProvider` mounted in `app/layout.tsx`
- **Components**: Rich set under `components/` (dashboards, forms, analytics, etc.)
- **Pages**: Multiple module entry pages in `app/*/page.tsx`

#### Configuration
- **Tailwind**: Content scanning for `app`, `components`, `pages`, `src`
- **Next config**: Security headers configured (CSP, Referrer-Policy, X-Content-Type-Options, X-Frame-Options, HSTS, Permissions-Policy). Build-time TypeScript and ESLint errors are currently ignored to keep local builds unblocked (to be tightened on CI).
- **TypeScript paths**: `@/*` alias configured

#### Analytics & Reporting
- **Charts**: Recharts and custom analytics components exist
- **Dashboards**: KPI/analytics components present
- **Financial Reporting**: Wired with mock/real API toggle, loading/error states

#### Testing & Quality
- **Linting**: `next lint` configured; unit tests present for auth, RBAC, AP/AR
- **Scripts**: Precommit script chains i18n validation and lint (note: must be run manually here)

#### Windows Compatibility
- Prompts require PowerShell-safe commands. Current npm scripts are compatible.

---

### Gap Analysis vs Prompt Collection

- **Monorepo structure (Prompts 1–4)**: Not implemented; current single-app layout is used.
- **API client (Prompt 4)**: Centralized API client added with interceptors and refresh; auth still mocked by default.
- **Auth/MFA (Prompt 5)**: Basic context only; no MFA, refresh, or permission guard components.
- **RBAC/Protected routes**: `components/protected-route.tsx` enforced on key pages with `required` permissions.
- **Testing framework (Prompt 22)**: Missing automated unit/integration/E2E tests.
- **A11y (Prompt 23)**: No explicit a11y test tooling; components mostly Radix/shadcn which are accessible by default.
- **PWA/Mobile (Prompts 18–19)**: Not configured.
- **Performance/Caching (Prompts 20–21)**: No dedicated monitoring/caching layers beyond React Query references in prompts.
- **Notifications/Realtime (Prompt 14/16)**: SSE demo exists in CRM only; other modules have none.
- **Security & CSP (Prompt 25)**: CSP and other security headers are configured in `next.config.mjs`; form/input hardening and client-side security utilities still needed.

---

### Planning Docs Reconciliation

Reviewed: `Planning and progress tracking/phase-1-core-modules.md`, `phase-2-advanced-features.md`, `authentication-todo.md`, `next-immediate-tasks.md`, `assessment-and-next-task-2025-08-08.md`.

- Application Shell & Auth:
  - Planning doc says 100% complete; actual auth is mocked and lacks refresh/MFA/guards → adjust to 50–60%.
- Materials Management, Cross-Module Workflows:
  - Planning doc claims 100% and full workflows; actual repo shows UI components without backend wiring → adjust to 40–60% pending integration.
- Sales & Distribution, MDM, Financial:
  - Planning doc shows 70–85%; actual now has API client and FI wiring; FI ~70–80% pending real backend; others ~40–60% pending integration.
- HCM:
  - Planning shows 65%; actual contains HCM components, not integrated → keep ~50% pending real data and workflows.
- Analytics/Reporting:
  - Foundational charts exist; real-time, drill-down, export may be partial → ~40–50%.
- Testing/A11y/PWA/Security:
  - Planning acknowledges gaps; actual code lacks frameworks → ~10–20%.

Conclusion: Planning files overstate completion relative to current repository. Use this `project_status.md` as the single source of truth and update planning docs to reference it for percentages.

---

### Frontend-Only Parity Plan (no backend changes)

1) Standardize list/table UX
   - Build shared hooks/components for pagination, sorting, filtering, saved views, columns, export/import.
   - Apply to Financials (AP/AR/JE), HCM (Employees), Materials (Warehouse stock/movements), MDM (Customers), Org, Quality, Maintenance, Projects, Sales.

2) Add local Next API proxy routes with fallbacks per domain
   - Create `app/api/{financial,hcm,materials,mdm,org,quality,maintenance,production,projects,sales}/*` mirroring the minimal endpoints each page needs.
   - Keep graceful fallback data to run without backend.
   - Implemented now:
     - Maintenance: `app/api/plant-maintenance/orders/route.ts`, `[id]/route.ts`; list and detail page wired
     - Projects: `app/api/projects/route.ts`, `[id]/route.ts`; list and detail page wired
     - Materials: `app/api/materials/categories/route.ts`, `materials/route.ts`; `MaterialMaster` fetches by category
     - Materials (warehouse schema): `app/api/materials/warehouse/schema/route.ts`; admin editor at `app/materials/warehouse/admin/page.tsx`
     - MDM: `app/api/mdm/customers/route.ts`, `customers/[id]/route.ts`; `CustomerMaster` list/detail wired
     - Org Mgmt: `app/api/org/units/route.ts`; list uses local route, detail page added
     - Quality: `app/api/quality/inspections/route.ts`; list uses local route, detail page added
     - Financials: `app/api/financials/ap/invoices/route.ts`, `[id]/route.ts`; `app/api/financials/ar/invoices/route.ts`, `[id]/route.ts`; lists use local routes, detail pages added
     - HCM Employees: `app/api/hcm/employees/route.ts`, `[id]/route.ts`; Employees tab loads list, detail page added
     - HCM Recruitment: `app/api/hcm/recruitment/{pipeline,metrics}/route.ts`, `candidates/[id]/stage/route.ts`; pipeline loads/updates via local routes

3) Implement minimal detail pages and safe mutations
   - For each module, add one detail page with at least one client-side state change (status/assignment/update) persisted via the local route.

4) i18n completion and tests
   - Fill missing keys; run `npm run i18n:validate`.
   - Add 2–3 tests per module (list render, mutation happy path, error state).

5) Hardening
   - Pin dependencies; add CI to run build/tests/i18n checks.
   - Update CSP connect-src when integrating with backend later.

6) Materials — Warehouse configurability (data-driven)
   - Admin UI for warehouses/zones/racks/bins; local schema route with fallback; `WarehouseMap` consumes schema when available.

### Recent Progress (frontend parity implemented)
- Plant Maintenance: List/detail wired to local routes; status updates via PATCH echo
- Project System: List/detail wired to local routes
- Materials: Category/materials fetch; data-driven warehouse schema + admin editor; warehouse map uses schema
- MDM: Customer list + details via local routes
- Org Management: Units list via local route; detail page simulates updates
- Quality: Inspections list via local route; detail page simulates updates
- Financials: AP/AR lists via local routes; detail pages with editable status (local PATCH)
- HCM: Employees list via local route; employee detail page; org chart collapse/expand; recruitment pipeline fetch + stage update via local routes

---

### Notable Inconsistencies
- Non-CRM modules previously implied fuller completeness; they are partial/minimal. This plan explicitly targets frontend parity with CRM via local routes and fallbacks.

- Prompts describe a Turborepo monorepo; this repo is single-package (acceptable per current scope).

---

### Planning & Tracking Enhancements

- Single source of truth: Treat `project_status.md` as canonical status. All planning docs should link here for percentages.
- Standardize acceptance criteria templates across todos (auth, FI, MDM, etc.).
- Add a lightweight roadmap table to `project_status.md` with status, owner, target date.
- Introduce milestone tags (Foundation, Core Modules, Integration, Hardening) and track by milestone.
- Add a simple progress badge per module in each module’s todo file (pulling percentages from this file).

---

### Next Strategic Task

FT-001: Foundation hardening and API client + Auth v1
- Build a typed API client with auth interceptors and error normalization.
- Replace auth mocks with real endpoints (login/logout/refresh), add route guards and permission helpers.
- Add a minimal test harness (Vitest + React Testing Library) for providers and auth.
- Keep Windows-safe npm scripts; no monorepo changes.

Acceptance: Login flows work against backend when available; protected routes enforce permissions; basic tests pass; `project_status.md` updated.


