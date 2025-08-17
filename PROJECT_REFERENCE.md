### Feebee ERP Frontend — Complete Project Reference (authoritative, verified as of 2025-08-17)

This is the single source of truth for understanding and maintaining the project. It documents every module, file, and major function, with the hierarchy Module → File → Function/Class.

## Table of Contents

- Overview and Goals
- Quickstart (Setup, Env, Scripts)
- Architecture at a Glance
  - Directory Structure
  - Data Flow and Interconnections
- Modules
  - App (Pages and Route Handlers)
    - Analytics
    - CRM (pages and API routes)
    - Customer Portal
    - Reports
    - Other Module Landing Pages (Financial, Materials, HCM, etc.)
  - Components
    - Core Shell (App Shell, Navigation, Breadcrumbs, ProtectedRoute, Notifications)
    - CRM, Analytics, Portal, Report Builder, UI Library
  - Contexts (Auth, i18n)
  - Hooks (Permissions, API, Toast, UI Store)
  - Lib (API Client, Auth, i18n utilities, Utils)
  - Locales (en, ar, no)
  - Scripts (i18n validation, hardcoded string scan)
  - Tests (Vitest config and test suites)
  - Configuration (Next, TS, Tailwind, PostCSS, Vitest)
- Deployment/Operational Considerations
- Appendix: API Endpoints (local route handlers and external targets)

## Overview and Goals

- Next.js 14 App Router frontend for an ERP suite (CRM, Financials, Materials, HCM, Analytics, Reports, Customer Portal).
- Emphasis on:
  - Strong i18n (LTR/RTL), modular UI via shadcn/ui, and role-gated navigation.
  - Local Next API route handlers that proxy to external backend (with graceful fallback for dev).
  - Developer ergonomics (Vitest + happy-dom, typed API client with interceptors, i18n governance scripts).

## Quickstart (Setup, Env, Scripts)

- Prerequisites:
  - Node 18+ recommended.
  - npm or pnpm.

- Install and run:
```bash
npm install
npm run dev
```

- Build and start:
```bash
npm run build
npm start
```

- Tests:
```bash
npm run test
```

- i18n validation:
```bash
npm run i18n:validate
```

- Key environment variables:
  - `NEXT_PUBLIC_API_BASE_URL`: Base URL for the external API used by `lib/api-client.ts`.
  - `API_BASE_URL`: Used by Next API route handlers (e.g., `app/api/crm/*`) to proxy to external backend; if absent, routes return fallback dev data.

## Architecture at a Glance

### Directory Structure

```
app/
  analytics/page.tsx
  api/
    crm/
      accounts/[id]/route.ts
      accounts/import/route.ts
      accounts/import/template/route.ts
      accounts/route.ts
      contacts/[id]/route.ts
      contacts/route.ts
      customers/[id]/route.ts
      customers/[id]/activities/route.ts
      customers/[id]/contacts/route.ts
      customers/[id]/invoices/route.ts
      customers/[id]/opportunities/route.ts
      customers/[id]/summary/route.ts
      dashboard/activity-feed/route.ts
      dashboard/kpis/route.ts
      dashboard/tasks/route.ts
      events/route.ts
      leads/[id]/route.ts
      leads/bulk-status/route.ts
      leads/import/route.ts
      leads/import/template/route.ts
      leads/route.ts
      opportunities/[id]/stage/route.ts
      orders/[id]/route.ts
      orders/route.ts
      quotes/[id]/route.ts
      quotes/route.ts
      search/route.ts
    organizations/route.ts
    sales/pipeline/opportunities/route.ts
  crm/
    accounts/[id]/page.tsx
    accounts/page.tsx
    contacts/[id]/page.tsx
    contacts/page.tsx
    customers/[id]/page.tsx
    leads/[id]/page.tsx
    leads/page.tsx
    opportunities/page.tsx
    orders/[id]/page.tsx
    orders/page.tsx
    quotes/[id]/page.tsx
    quotes/page.tsx
    page.tsx
  customer-portal/page.tsx
  dashboard/page.tsx
  employees/page.tsx
  financial/page.tsx
  layout.tsx
  login/actions.ts
  login/page.tsx
  materials/page.tsx
  mdm/page.tsx
  onboarding/page.tsx
  org-management/page.tsx
  plant-maintenance/page.tsx
  pricing/page.tsx
  production/page.tsx
  project-system/page.tsx
  quality/page.tsx
  reports/page.tsx
  request-demo/actions.ts
  request-demo/loading.tsx
  request-demo/page.tsx
  sales/page.tsx
  solutions/[slug]/page.tsx
  test-i18n/page.tsx
  testimonials/page.tsx
  unauthorized/page.tsx
  error.tsx
  global-error.tsx
  not-found.tsx
  globals.css
  page.tsx
components/
  analytics/
    date-range-picker.tsx
    employee-turnover-chart.tsx
    expense-breakdown-chart.tsx
    kpi-card.tsx
    sales-by-region-map.tsx
    stock-demand-forecast-chart.tsx
    supplier-performance-dashboard.tsx
    top-customers-table.tsx
  ui/ (alert, avatar, badge, button, calendar, card, chart, checkbox, command, dialog,
       dropdown-menu, input, label, popover, progress, radio-group, select, separator,
       sheet, slider, table, tabs, textarea, toast, tooltip, tree)
  test/ (cross-module i18n governance test UIs)
  accounts-payable.tsx
  accounts-receivable.tsx
  aging-analysis-reports.tsx
  analytics-dashboard.tsx
  app-shell.tsx
  asset-accounting.tsx
  bank-reconciliation.tsx
  breadcrumbs.tsx
  chart-of-accounts.tsx
  collections-management-dashboard.tsx
  compensation-review-workflow.tsx
  cost-center-management.tsx
  crm-dashboard.tsx
  crm-page-content.tsx
  custom-report-builder.tsx
  customer-360.tsx
  customer-master.tsx
  customer-portal.tsx
  dashboard-overview.tsx
  dashboard-page.tsx
  features.tsx
  financial-management-container.tsx
  financial-reporting.tsx
  footer.tsx
  global-search.tsx
  goal-tracking-dashboard.tsx
  hero-section.tsx
  human-capital-management.tsx
  interactive-org-chart.tsx
  journal-entries.tsx
  language-switcher.tsx
  login-page.tsx
  master-data-management.tsx
  material-master.tsx
  materials-management.tsx
  navigation.tsx
  notifications-panel.tsx
  om-dashboard.tsx
  onboarding-offboarding-wizards.tsx
  onboarding-wizard.tsx
  order-to-cash-workflow.tsx
  payment-run-wizard.tsx
  pick-list-optimization.tsx
  po-invoice-reconciliation.tsx
  pricing-section.tsx
  procurement-workflow.tsx
  protected-route.tsx
  recruitment-pipeline.tsx
  sales-distribution.tsx
  sales-order-entry-form.tsx
  sales-pipeline.tsx
  sidebar.tsx
  solutions-grid.tsx
  testimonials-section.tsx
  theme-provider.tsx
  thirty-sixty-feedback.tsx
  three-way-match.tsx
  vendor-selection-interface.tsx
  warehouse-map.tsx
contexts/
  auth-context.tsx
  i18n-context.tsx
hooks/
  use-api.ts
  use-permissions.ts
  use-toast.ts
  use-ui-store.ts
lib/
  api-client.ts
  auth-api.ts
  auth.ts
  i18n.ts
  modules.ts
  utils.ts
locales/
  en/translation.json
  en/i18n-structure-prompt.md
  ar/translation.json
  no/translation.json
scripts/
  check-hardcoded-strings.ts
  check-i18n-keys.ts
  i18n-scan-and-merge.js
  run-i18n-check.ts
tests/
  accounts-payable.test.tsx
  accounts-receivable.test.tsx
  crm-leads.test.tsx
  pages-rbac-smoke.test.tsx
  protected-route.test.tsx
  security-headers.test.ts
  setup.ts
config files:
  next.config.mjs
  tsconfig.json
  tailwind.config.ts
  postcss.config.mjs
  vitest.config.ts
root docs:
  PROJECT_REFERENCE.md
  project_status.md
  ERP_Frontend_Prompt_Collection.md
  COMPREHENSIVE_FRONTEND_DEVELOPMENT_PROMPT.md
  docs/i18n-workflow.md
  docs/realtime-crm-sse.md
public/ (images, icons)
styles/globals.css
types/index.ts
```

### Data Flow and Interconnections

- Pages render within `AppShell` and may be gated by `ProtectedRoute` using `usePermissions` + `useAuth`.
- Components use `useI18n` for translations and formatting; keys live in `locales/*/translation.json`.
- Frontend calls:
  - Local Next API routes under `app/api/*` for CRM dashboard/feeds/tasks/opportunities (proxying to external API if `API_BASE_URL` is set; otherwise fallback).
  - Direct external API via `lib/api-client.ts` for authenticated calls using `NEXT_PUBLIC_API_BASE_URL` and Axios interceptors (access token + refresh logic).
- Realtime: CRM uses SSE stream at `app/api/crm/events/route.ts`; `crm-dashboard.tsx` and `crm/opportunities/page.tsx` consume it.

## Modules

### Frontend Completeness by Module (target parity: CRM)

- CRM: Near v1. Lists, detail flows, Kanban (opportunities), local API proxies with fallbacks, SSE demo, i18n, basic tests.
- Financials: UI shell with tabs present; submodules mostly mock. Missing unified list UX, details, mutations, local API route handlers, tests.
- HCM: Rich tabbed UI with mock data. Missing list/detail persistence patterns, local API routes, tests.
- Materials (Warehouse): Shell present; warehouse operations minimal. Missing warehouse lists, movements, map data, local API routes, tests.
- MDM: Customer master UI with mock data. Missing real list/detail flows via local routes, import/export parity, tests.
- Org Management: KPIs + units list mocked. Missing list/detail, mutations (create/update org units), local routes, tests.
- Quality: Inspections list stub. Missing list/detail, status transitions, local routes, tests.
- Plant Maintenance: Minimal list; far from complete. Missing list/detail, work order actions, local routes, tests.
- Production: Landing placeholder. Missing orders list/detail, progress updates, local routes, tests.
- Project System: Minimal list; far from complete. Missing list/detail (WBS/tasks), local routes, tests.
- Reports: Builder UI complete; no analytics endpoints wiring. Missing local proxy routes for analytics, tests.
- Customer Portal: Full UI; mocks only. Missing local proxy routes and actions, tests.

### App (Pages and Route Handlers)

#### Analytics
- `app/analytics/page.tsx`
  - Purpose: Protected analytics dashboard page.
  - Key components: wraps `AnalyticsDashboard` in `AppShell` inside `ProtectedRoute required="view:analytics"`.

#### CRM

- `app/crm/page.tsx`
  - Purpose: CRM landing page; protected with `view:sales`. Renders `components/crm-page-content.tsx` within `AppShell`.

- `components/crm-page-content.tsx`
  - Purpose: Renders `CrmDashboard` main content.
  - Dependencies: `useI18n` for label `crm.page.title`.

- `components/crm-dashboard.tsx`
  - Purpose: CRM dashboard with KPIs, funnel, tasks, and activity feed; subscribes to SSE.
  - Key types: `KPI`, `ActivityItem`, `FunnelStage`, `TaskItem`.
  - Key functions:
    - `fetchKpis()`: GET `/api/crm/dashboard/kpis` (proxy to `/api/v1/crm/dashboard/kpis`).
    - `fetchActivityFeed()`: GET `/api/crm/dashboard/activity-feed`.
    - `fetchTasks()`: GET `/api/crm/dashboard/tasks`.
    - `fetchFunnel()`: GET `/api/sales/pipeline/opportunities` and compute funnel stages with percentages.
  - Realtime: EventSource `/api/crm/events` pushes `activity` and `opportunityUpdated` events.
  - i18n: Labels sourced from `crm.dashboard.*` keys.

- `app/crm/leads/page.tsx`
  - Purpose: Leads list with server-side pagination params, sorting, search; bulk status updates; saved views and column chooser; CSV import/export + template download.
  - Data model: `Lead { id, company, owner, status, createdAt, score }`.
  - Key flows:
    - Fetch: GET `/api/crm/leads?page=&limit=&sortBy=&sortDir=&q=`.
    - Bulk status: PATCH `/api/crm/leads/bulk-status` with `{ ids, status }`.
    - Import: POST `/api/crm/leads/import` (text/csv).
    - Template: GET `/api/crm/leads/import/template`.
  - RBAC: Requires `view:sales`.

- `app/crm/accounts/page.tsx`
  - Purpose: Accounts list with server params; CSV import/export + template.
  - Data model: `Account { id, name, type, status, country }`.
  - Fetch: GET `/api/crm/accounts?...`.

- `app/crm/contacts/page.tsx`
  - Purpose: Contacts list with server params; export.
  - Data model: `Contact { id, name, role, email, account }`.
  - Fetch: GET `/api/crm/contacts?...`.

- `app/crm/opportunities/page.tsx`
  - Purpose: Kanban board with DnD (dnd-kit). Realtime updates via SSE; client-side totals/forecast.
  - Data model: `Opportunity { id, name, amount, stage }`.
  - Fetch: GET `/api/sales/pipeline/opportunities`.
  - Update: PATCH `/api/crm/opportunities/[id]/stage`.

- `app/crm/orders/page.tsx`
  - Purpose: Orders list with filtering/search.
  - Data model: `Order { id, customer, orderDate, deliveryDate?, amount, status }`.
  - Fetch: GET `/api/crm/orders`.

- `app/crm/quotes/page.tsx`
  - Purpose: Quotes list with pagination/sorting/search.
  - Data model: `Quote { id, customer, date, amount, status }`.
  - Fetch: GET `/api/crm/quotes?...`.

Route Handlers (proxies with fallbacks when `API_BASE_URL` is missing):

- `app/api/crm/dashboard/kpis/route.ts`
  - GET → proxies `/api/v1/crm/dashboard/kpis`; returns fallback array of KPIs on failure or when `API_BASE_URL` unset.
  - Security: Forwards `authorization` and `cookie` headers.

- `app/api/crm/dashboard/activity-feed/route.ts`
  - GET → proxies `/api/v1/crm/dashboard/activity-feed`; returns fallback `ActivityItem[]` when needed.

- `app/api/crm/dashboard/tasks/route.ts`
  - GET → proxies `/api/v1/crm/dashboard/tasks`; returns fallback tasks.

- `app/api/sales/pipeline/opportunities/route.ts`
  - GET → proxies `/api/v1/sales/pipeline/opportunities`; returns fallback opportunities.

- `app/api/crm/events/route.ts`
  - GET → Server-Sent Events stream; emits periodic `activity` and `opportunityUpdated` events; keep-alive comments for connection.

- Additional CRM entity routes exist under `app/api/crm/...` for accounts, contacts, leads (bulk, import, template), opportunities (stage), orders, quotes, search, customers (children routes), dashboard.

#### Customer Portal

- `app/customer-portal/page.tsx`
  - Purpose: Protected page `view:sales` rendering `components/customer-portal.tsx` within `AppShell`.

- `components/customer-portal.tsx`
  - Purpose: Multi-tab customer portal (Dashboard, Orders, Invoices, Catalog, Support, Account) with mock data and i18n.
  - Notable logic: Filtering orders; status badge renderer; actions for reorder/quote request; support ticket create form (mock handlers with CURSOR comments for future APIs).
  - i18n keys under `customerPortal.*`.

#### Reports

- `app/reports/page.tsx`
  - Purpose: Protected page rendering the Custom Report Builder UI.

- `components/custom-report-builder.tsx`
  - Purpose: Self-service report builder with data source/table/field selection, filters, grouping/sorting, chart/table preview, save/export stubs.
  - Data structures: in-memory mock `dataSources`, `mockChartData`; `reportConfig` state shape; `savedReports` sample list.
  - Key functions: `handleFieldSelection`, `addFilter`, `updateFilter`, `removeFilter`, `saveReport`, `loadReport`, `exportReport`, `renderChart`.
  - Planned APIs (CURSOR annotations):
    - `/api/v1/analytics/reports` (CRUD, execute, export, preview)
    - `/api/v1/analytics/datasources/*` for listing tables/fields

#### Other Module Landing Pages

- Landing pages under `app/*/page.tsx` (financial, materials, hcm, etc.) render respective module components within `AppShell` and are i18n’d.

### Components

#### Core Shell

- `components/app-shell.tsx`
  - Purpose: Shared layout with header/sidebar and content region.
  - Dependencies: `navigation.tsx`, `sidebar.tsx`, `breadcrumbs.tsx`, `notifications-panel.tsx`.

- `components/protected-route.tsx`
  - Purpose: Client-side guard. Redirects to `/login` if unauthenticated; to `/unauthorized` if lacking permission.
  - Key logic: Uses `useAuth()` for token/loading state; `usePermissions()` for permission check; `next/navigation` for redirects.
  - Props: `{ required?: string }` permission code string.

- `components/navigation.tsx`, `components/sidebar.tsx`, `components/breadcrumbs.tsx`, `components/notifications-panel.tsx`
  - Purpose: UI scaffolding for navigation, sidebars, breadcrumb trails, notifications (panel skeleton present).

#### CRM and Analytics

- `components/crm-dashboard.tsx` (detailed above), `components/crm-page-content.tsx` (wrapper), `components/analytics-dashboard.tsx` (analytics KPIs/charts).

#### Report Builder and Analytics UI

- `components/custom-report-builder.tsx` (detailed above); `components/analytics/*` reusable charts and cards.

#### Customer Portal UI

- `components/customer-portal.tsx` (detailed above).

#### UI Library (shadcn/ui style)

- `components/ui/*`
  - Purpose: Primitive UI components (button, card, input, table, select, dialog, tabs, etc.). Used across pages and modules.

### Contexts

- `contexts/auth-context.tsx`
  - Purpose: Manage authentication state (token, refresh token, user, company), mock vs real login/logout, and route navigation.
  - Public API:
    - `AuthProvider`: wraps app.
    - `useAuth()`: returns `{ user, company, token, refreshToken, isLoading, isLoggingOut, login(email, company), logout() }`.
  - Storage keys: `erp-token`, `erp-refresh-token`, `erp-user`, `erp-company`.
  - Mock toggle: `feebee:auth:mock` localStorage flag. If absent, defaults to mock.

- `contexts/i18n-context.tsx`
  - Purpose: Locale state, translation function `t(key, vars?, count?)`, Intl formatters, and RTL/LTR direction in `<html>`.
  - Public API:
    - `I18nProvider`: initializes locale from storage or browser; supports pseudo-locale (`en-XA`) for dev via `?pseudo=true`.
    - `useI18n()`: returns `{ locale, setLocale, t, dir, formatters, isPseudoLocale, isReady }`.
  - Storage key: `feebee_locale`.

### Hooks

- `hooks/use-permissions.ts`
  - Purpose: Client-side permission check backed by a static role→permissions map; admin implies all.
  - Public API: `usePermissions().hasPermission(code: string): boolean`.

- `hooks/use-api.ts`
  - Purpose: Typed wrapper around `lib/api-client.ts` with toastified error handling.
  - Public API: `{ get, post, put, patch, del }` generic helpers.

- `hooks/use-toast.ts`, `hooks/use-ui-store.ts`
  - Purpose: Toast notification and UI state management (used across components).

### Lib

- `lib/api-client.ts`
  - Purpose: Axios instance with base URL resolution, Authorization header injection from `localStorage`, and 401 refresh token retry logic.
  - Key functions:
    - `getBaseURL()`: env and window-based resolution; default `http://localhost:3001/api/v1`.
    - `refreshAccessToken(client)`: POST `/auth/refresh` with `{ refreshToken }`, updates localStorage.
    - `normalizeApiError(err)`: consistent `{ status, message, details }` shape.

- `lib/auth.ts`
  - Purpose: Auth types and mock login/logout flows returning mock tokens and user roles.
  - Types: `User`, `AuthState`.
  - Functions: `mockLogin(email, company)`, `mockLogout()`.

- `lib/i18n.ts`
  - Purpose: i18n bundles load, translation resolution with fallback, missing key tracking, pseudo-locale transformation, and Intl formatters.
  - Public API:
    - Types: `Locale`, `TranslateFn`.
    - Constants: `LOCALES`, `DEFAULT_LOCALE`, `PSEUDO_LOCALE`.
    - Functions: `getDir`, `getBrowserLocale`, `getTranslationWithFallback`, `trackMissingKey`, `useFormatters`, `formatNumber`, `formatCurrency`, `formatDate`, `formatRelativeTime`, `formatWithVars`.

- `lib/utils.ts`
  - Purpose: Styling helpers and minor UI utilities.
  - Functions: `cn(...classes)`, `getLevelColor(level)`.

### Locales

- `locales/en/translation.json`, `locales/ar/translation.json`, `locales/no/translation.json`
  - Purpose: Full translation bundles (CRM, Customer Portal, Reports, Analytics, Financials, etc.).
  - Governance: Validated by `scripts/check-i18n-keys.ts`; hardcoded string scanner `scripts/check-hardcoded-strings.ts`.

### Scripts

- `scripts/check-i18n-keys.ts`
  - Purpose: Ensures non-base locales match the base (`en`) keys; reports missing/extra/duplicate keys.
  - Key fns: `flattenKeys`, `findMissingKeys`, `findExtraKeys`.

- `scripts/check-hardcoded-strings.ts`
  - Purpose: Heuristically detect hardcoded user-facing strings in TS/TSX files and recommend i18n usage.
  - Patterns: JSX text, placeholder/title/alt/aria attributes; exclusions for technical strings.

### Tests

- `vitest.config.ts`
  - Purpose: happy-dom environment, global tests, setup file `tests/setup.ts`, alias `@` to project root.

- Suites:
  - `tests/crm-leads.test.tsx`: Renders CRM Leads page; mocks `fetch` for `/api/crm/leads` and asserts row rendering.
  - `tests/pages-rbac-smoke.test.tsx`: Verifies `ProtectedRoute`-gated pages render under `view:sales`.
  - `tests/protected-route.test.tsx`: Validates basic guarded behavior (presence in repo).
  - `tests/accounts-payable.test.tsx`, `tests/accounts-receivable.test.tsx`: Financial module UI tests (presence in repo).
  - `tests/security-headers.test.ts`: CSP shape smoke test.

### Configuration

- `next.config.mjs`
  - Purpose: Security headers (CSP, Referrer-Policy, X-Content-Type-Options, X-Frame-Options, HSTS, Permissions-Policy), relaxed TS/ESLint build checks, unoptimized images.
  - Notable: CSP differs in dev vs prod (`'unsafe-eval'/'unsafe-inline'` enabled in dev).

- `tsconfig.json`
  - Purpose: Strict TS, path alias `@/*`, bundler module resolution, DOM libs, JSX preserved.

- `tailwind.config.ts`
  - Purpose: Tailwind theme extensions, animations, dark mode via class, content globs; plugin `tailwindcss-animate`.

- `postcss.config.mjs`
  - Purpose: Tailwind plugin inclusion.

- `vitest.config.ts`
  - Purpose: Test runner config (see Tests above).

## Deployment/Operational Considerations

- Security headers are injected globally via Next headers() in `next.config.mjs`.
- For proxying to backend services from route handlers, set `API_BASE_URL` (e.g., `http://localhost:3001`). Without it, handlers serve fallback data for development.
- For direct browser-side API via Axios client, set `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:3001/api/v1`).
- Authentication currently supports a mock flow toggled by `localStorage['feebee:auth:mock']`. For production, wire `lib/auth-api.ts` and disable mock.

## Appendix: API Endpoints

Local Next API route handlers (selected):

- CRM Dashboard
  - GET `/api/crm/dashboard/kpis` → proxies `/api/v1/crm/dashboard/kpis` (fallbacks present).
  - GET `/api/crm/dashboard/activity-feed` → proxies `/api/v1/crm/dashboard/activity-feed` (fallbacks).
  - GET `/api/crm/dashboard/tasks` → proxies `/api/v1/crm/dashboard/tasks` (fallbacks).
- Sales Pipeline
  - GET `/api/sales/pipeline/opportunities` → proxies `/api/v1/sales/pipeline/opportunities` (fallbacks).
- CRM SSE
  - GET `/api/crm/events` → SSE event stream (activity and opportunity updates).
- CRM Entities
  - Under `/api/crm/{leads,accounts,contacts,quotes,orders,search}` including subroutes like `/bulk-status`, `/import`, `/import/template`, `/[id]`, `/[id]/stage`.

- Plant Maintenance
  - GET `/api/plant-maintenance/orders` → proxies `/api/v1/maintenance/orders` (fallbacks present).

- Projects
  - GET `/api/projects` → proxies `/api/v1/projects` (fallbacks present).

- Materials
  - GET `/api/materials/categories` → proxies `/api/v1/materials/categories` (fallbacks present).
  - GET `/api/materials/materials?category={id}` → proxies `/api/v1/materials` with `category` filter (fallbacks present).

- MDM
  - GET `/api/mdm/customers` → proxies `/api/v1/mdm/customers` (fallbacks present).
  - GET `/api/mdm/customers/[id]` → proxies `/api/v1/mdm/customers/{id}` (fallbacks present).

External targets (CURSOR annotations in code, actual backend expected to serve):

- Auth: `/api/v1/auth/login`, `/api/v1/auth/logout`, `/auth/refresh` (used by Axios client).
- CRM Dashboard: `/api/v1/crm/dashboard/{kpis,activity-feed,tasks}`.
- Sales Pipeline: `/api/v1/sales/pipeline/opportunities`.
- Analytics/Reports: `/api/v1/analytics/*` (builder integration planned).
- Customer Portal: `/api/v1/customer-portal/*` (orders, invoices, products, support).

---

This document is maintained as the single source of truth. When adding or modifying features, update the relevant Module → File → Function entries here along with any new endpoints, configuration, or environment variable changes.


## Additional per-file breakdown (expanded)

### App root and login

- `app/layout.tsx`
  - Purpose: Root HTML shell and providers composition.
  - Providers: `I18nProvider` (locale/dir + t), `AuthProvider` (session, login/logout), `ThemeProvider` (class-based theming).
  - Metadata: `title`, `description`.

- `app/login/page.tsx`
  - Purpose: Thin page that renders `components/login-page` (login UI and flow). Works with `AuthProvider.login`.

- `app/login/actions.ts`
  - Purpose: Server actions or helpers for the login flow (e.g., org discovery) as needed by the login component.

- `app/page.tsx`
  - Purpose: Public landing page of the application.
  - Composition: Renders marketing components such as `Navigation`, `HeroSection`, `Features`, `SolutionsGrid`, and `Footer`.
  - i18n: Uses marketing/landing translation keys where applicable.

### Lib (additional)

- `lib/auth-api.ts`
  - `apiLogin(email, company): Promise<{ accessToken, refreshToken?, user }>`: POST `/auth/login` through Axios client.
  - `apiLogout(): Promise<{ success: boolean }>`: POST `/auth/logout`.
  - Uses `normalizeApiError` to surface errors consistently.

- `lib/modules.ts`
  - Purpose: Module metadata/registry. If consumed by nav or module routing, keep entries synchronized with `components/sidebar.tsx` and translation keys under `sidebar.*`.

### Hooks (additional details)

- `hooks/use-toast.ts`
  - Internal reducer (`ADD_TOAST`, `UPDATE_TOAST`, `DISMISS_TOAST`, `REMOVE_TOAST`), in-memory listeners, and `toast()` helper returning `{ id, update, dismiss }`.
  - Limits concurrent toasts via `TOAST_LIMIT`; auto-removal after `TOAST_REMOVE_DELAY` ms.

- `hooks/use-ui-store.ts`
  - Minimal external store (subscribe/getSnapshot) to persist `sidebarCollapsed` to `localStorage` under `feebee-ui:sidebar-collapsed`.
  - API: `toggleSidebar()`, `setCollapsed(boolean)`.

### Configuration (expanded)

- `next.config.mjs`
  - `buildCsp()` returns environment-aware CSP; dev adds `'unsafe-eval' 'unsafe-inline' blob:` to `script-src` for HMR.
  - Global headers applied for all paths via `headers()` (CSP, Referrer-Policy, X-Content-Type-Options, X-Frame-Options, HSTS, Permissions-Policy).
  - Build settings: ignore TS/ESLint errors (tighten on CI when ready), unoptimized images.

- `tsconfig.json`
  - Strict TS, `moduleResolution: bundler`, path alias `@/*`, DOM libs, JSX `preserve` for Next.

- `tailwind.config.ts`
  - Dark mode by `class`; content globs include `app`, `components`, `pages`, `src`, plus top-level patterns.
  - Theme: CSS variable-driven colors; border radii; accordion animations; plugin `tailwindcss-animate`.

- `postcss.config.mjs`
  - Tailwind plugin enabled (add autoprefixer as needed in production).

- `vitest.config.ts`
  - `environment: happy-dom`, globals enabled, `tests/setup.ts` for setup (e.g., polyfills/mocks), alias `@` to project root.

### Public assets

- `public/*`
  - Contains dashboard illustrations, logos, and placeholders used across marketing and module pages. Access via Next `<Image src="/..." />` or plain `<img>` where appropriate.

## Expanded module pages (Financials, HCM, Materials, MDM, Org Mgmt, Quality, Maintenance, Production, Projects, Sales, Dashboard, Solutions, Request Demo, Errors)

### Financials

- `app/financial/page.tsx`
  - Purpose: Protected page (`required="view:financials"`) rendering `components/financial-management-container.tsx` in `AppShell`.
  - Interconnections: Uses many financial subcomponents listed below.

- `components/financial-management-container.tsx`
  - Purpose: Tabbed shell wiring Financial submodules.
  - Tabs → Components:
    - `coa` → `components/chart-of-accounts.tsx`
    - `ap` → `components/accounts-payable.tsx`
    - `ar` → `components/accounts-receivable.tsx`
    - `collections` → `components/collections-management-dashboard.tsx`
    - `reconciliation` → `components/three-way-match.tsx`
    - `assets` → `components/asset-accounting.tsx`
    - `reporting` → `components/financial-reporting.tsx`
    - `aging` → `components/aging-analysis-reports.tsx`
    - `bankRec` → `components/bank-reconciliation.tsx`
    - `je` → `components/journal-entries.tsx`
  - i18n keys under `financial.*`.
  
Local API routes (fallbacks; proxy when `API_BASE_URL` set):
- GET `/api/financials/ap/invoices` → proxies `/api/v1/financials/ap/invoices`.
- GET `/api/financials/ar/invoices` → proxies `/api/v1/financials/ar/invoices`.
 - GET `/api/financials/ap/invoices/[id]`, PATCH same (echo fallback) → proxies `/api/v1/financials/ap/invoices/{id}`.
 - GET `/api/financials/ar/invoices/[id]`, PATCH same (echo fallback) → proxies `/api/v1/financials/ar/invoices/{id}`.

Component notes:
- `components/accounts-payable.tsx` now uses `/api/financials/ap/invoices`.
- `components/accounts-receivable.tsx` now uses `/api/financials/ar/invoices`.
 - Detail pages: `app/financial/ap/[id]/page.tsx`, `app/financial/ar/[id]/page.tsx` support status changes via local PATCH.

  Frontend status: Partial (UI only; mock data).
  To reach CRM parity:
  - Add unified list/table components for AP, AR, JE with pagination/sort/filter and export.
  - Implement detail pages (invoice, journal entry) with safe client-side validation; wire to local Next API proxy routes with fallback data under `app/api/financial/*`.
  - Add i18n keys for missing labels; add unit tests for lists and one detail mutation.

### Human Capital Management (HCM)

- `app/employees/page.tsx`
  - Purpose: Protected page (`required="view:hcm"`) rendering `components/human-capital-management.tsx` in `AppShell`.

- `components/human-capital-management.tsx`
  - Purpose: Full HCM suite UI with tabs (dashboard, employees, org-chart, recruitment, onboarding, performance, goals, compensation, analytics).
  - Subcomponents: `interactive-org-chart`, `advanced-recruitment-pipeline`, `onboarding-offboarding-wizards`, `thirty-sixty-feedback`, `goal-tracking-dashboard`, `compensation-review-workflow`.
  - Data: Mock datasets and helpers (salary/date formatting, activity icons). i18n keys under `hcm.*`.
  - Employees: Loads from local Next route `/api/hcm/employees` with fallbacks; each row links to `app/employees/[id]/page.tsx`.

- `components/interactive-org-chart.tsx`
  - Purpose: Interactive org chart using React Flow and ELK for layout.
  - Enhancement: Nodes now support collapse/expand to hide/show descendant subtrees via a toggle on the card.

- Recruitment Pipeline
  - `app/api/hcm/recruitment/pipeline/route.ts`: GET pipeline (fallbacks), proxies `/api/v1/hcm/recruitment/pipeline`.
  - `app/api/hcm/recruitment/metrics/route.ts`: GET metrics (fallbacks), proxies `/api/v1/hcm/recruitment/metrics`.
  - `app/api/hcm/recruitment/candidates/[id]/stage/route.ts`: PUT stage update (echo fallback), proxies `/api/v1/hcm/recruitment/candidates/{id}/stage`.
  - `components/advanced-recruitment-pipeline.tsx`: Now fetches from local routes and updates stage via local route.

- `app/api/hcm/employees/route.ts`
  - GET → proxies `/api/v1/hcm/employees` (returns fallback list when backend unavailable).

- `app/api/hcm/employees/[id]/route.ts`
  - GET/PATCH → proxies `/api/v1/hcm/employees/{id}` (echo fallback for PATCH).

- `app/employees/[id]/page.tsx`
  - Purpose: Employee detail view with editable status (Active/Inactive); PATCH to local route.
  
  Frontend status: Partial (UI only; mock data).
  To reach CRM parity:
  - Employees list/table with filters and pagination; employee detail drawer/page.
  - Local Next API proxy routes under `app/api/hcm/*` with graceful fallbacks.
  - Tests for list rendering and a basic update action (e.g., status change).

### Materials Management

- `app/materials/page.tsx`
  - Purpose: Protected page (`required="view:materials"`) rendering `components/materials-management.tsx`.

- `components/materials-management.tsx`
  - Purpose: Metrics + tabs (overview, master data, warehouse, procurement).
  - Subcomponents: `material-master`, `warehouse-map`, `procurement-workflow`.
  - i18n keys under `materials.*`.
  
  Frontend status: Partial; Warehouse features minimal.
  To reach CRM parity:
  - Warehouse lists: locations, stock, movements; movement create workflow.
  - Local proxy routes `app/api/materials/{warehouses,locations,movements}` with fallbacks.
  - Tests for movement creation and filtered lists.

- New: Warehouse configurability (data-driven)
  - `app/api/materials/warehouse/schema/route.ts`: GET current schema; PATCH to update (fallback echo); proxies `/api/v1/materials/warehouse/schema` when available.
  - `app/materials/warehouse/admin/page.tsx`: Admin editor to manage schema JSON (warehouses, zones, racks, bins).
  - `components/warehouse-map.tsx`: Reads schema from `/api/materials/warehouse/schema`; falls back to mock when absent.

### Master Data Management (MDM)

- `app/mdm/page.tsx`
  - Purpose: Protected page (`required="view:mdm"`) rendering `components/master-data-management.tsx`.

- `components/master-data-management.tsx`
  - Purpose: Tabs for customer vs material master UIs using `CustomerMaster` and `MaterialMaster`.
  - i18n under `modules.mdm.*` and `mdm.domains.*`.

- `components/customer-master.tsx`
  - Purpose: Rich customer master list with filters, selection, and details sheet.
  - Data structures: `mockCustomers` and `mockCustomerDetails` (general, contacts, addresses, financial, documents, history).
  - Patterns: Local filtering with `useMemo`, details in Radix Sheet with nested tabs; i18n under `crm.customerMaster.*`.
  
  Frontend status: Partial (mock data).
  To reach CRM parity:
  - Wire list/detail via local routes `app/api/mdm/customers` (fallbacks) and add export/import parity.
  - Normalize i18n scope to `mdm.customerMaster.*` to decouple from CRM.
  - Add tests for list filters and detail panel rendering.

### Organizational Management

- `app/org-management/page.tsx`
  - Purpose: Admin-only page (`required="admin:settings"`) to list org units; also renders `OmDashboard` and `CostCenterManagement`.
  - Fetch: Uses local Next route `/api/org/units` (proxies `/api/v1/org/units` with fallbacks).
  - Links: Row links to `app/org-management/[id]/page.tsx`.

- `components/om-dashboard.tsx`
  - Purpose: KPIs (headcount, departments, cost centers) and recent audit log.
  - Fetch: Planned `/om/dashboard/kpis` and `/om/audit/recent` with mock fallback; i18n `org.*` with English fallbacks.

- `app/org-management/[id]/page.tsx`
  - Purpose: Org unit detail with editable status (Active/Inactive). Simulates update client-side; proxy PATCH can be added similarly.
  
  Frontend status: Partial (mock KPIs/list).
  To reach CRM parity:
  - Org units list with pagination/sort; unit detail (attributes, parent/children).
  - Local routes `app/api/org/*` with fallbacks; tests for list + detail.

### Quality Management

- `app/quality/page.tsx`
  - Purpose: Inspections list view; protected `required="view:quality"`.
  - Fetch: Uses local Next route `/api/quality/inspections` (proxies `/api/v1/quality/inspections` with fallbacks); i18n under `quality.*`.
  - Links: Row links to `app/quality/[id]/page.tsx`.

- `app/quality/[id]/page.tsx`
  - Purpose: Inspection detail with editable status (Open/InProgress/Closed). Simulates update client-side; proxy PATCH can be added similarly.
  
  Frontend status: Minimal.
  To reach CRM parity:
  - Inspections list and detail with status transitions.
  - Local routes `app/api/quality/*` with fallbacks; basic tests.

### Plant Maintenance

- `app/plant-maintenance/page.tsx`
  - Purpose: Maintenance orders list; protected `required="view:maintenance"`.
  - Fetch: Uses local Next route `/api/plant-maintenance/orders` (proxies `/api/v1/maintenance/orders` with fallbacks); i18n under `maintenance.*`.

- `app/plant-maintenance/[id]/page.tsx`
  - Purpose: Maintenance order detail with editable status (Open/InProgress/Closed).
  - Update: PATCH via `/api/plant-maintenance/orders/[id]` (proxies `/api/v1/maintenance/orders/{id}` with fallbacks).
  
  Frontend status: Minimal (as noted).
  To reach CRM parity:
  - Work orders list with filters; work order detail with status/assignment actions.
  - Local routes `app/api/maintenance/{orders,orders/[id]}` with fallbacks; tests for status change flow.

### Production

- `app/production/page.tsx`
  - Purpose: Landing layout with i18n; planned API calls noted in comments.
  
  Frontend status: Minimal.
  To reach CRM parity:
  - Production orders list and detail; progress updates UI.
  - Local routes `app/api/production/*` with fallbacks; tests for list + update.

### Project System

- `app/project-system/page.tsx`
  - Purpose: Projects list; protected `required="view:projects"`.
  - Fetch: Uses local Next route `/api/projects` (proxies `/api/v1/projects` with fallbacks); i18n under `projects.*`.

- `app/project-system/[id]/page.tsx`
  - Purpose: Project detail with editable status (Planned/Active/Closed).
  - Update: PATCH via `/api/projects/[id]` (proxies `/api/v1/projects/{id}` with fallbacks).
  
  Frontend status: Minimal.
  To reach CRM parity:
  - Projects list and project detail (phases/tasks overview); minimal task create/update.
  - Local routes `app/api/projects/*` with fallbacks; tests for list + task mutation.

### Sales (Distribution)

- `app/sales/page.tsx`
  - Purpose: Protected page (`required="view:sales"`) rendering `components/sales-distribution.tsx` in `AppShell`.
  
  Frontend status: Partial (UI shell; data mocked).
  To reach CRM parity:
  - Orders/quotes lists + detail using unified list UX; local routes `app/api/sales/*` with fallbacks; tests.

### Dashboard

- `app/dashboard/page.tsx`
  - Purpose: Protected landing dashboard page rendering `components/dashboard-overview.tsx`.

- `components/dashboard-overview.tsx`
  - Purpose: KPIs, module cards, recent activity, quick actions; navigates to module pages; i18n under `dashboard.*` and `modules.*`.
  
  Frontend status: Complete for current scope.

### Solutions Marketing Pages

- `app/solutions/[slug]/page.tsx`
  - Purpose: Marketing-style solution overviews with CTAs to login or demo; maps `slug` to `lib/modules.slugToAppPath` and image assets.
  - Supported slugs: `financials`, `sales`, `materials`, `hcm`, `master-data`, `organization`, `production`, `projects`, `quality`, `maintenance`, `crm`, `reports`, `customer-portal`.
  
  Frontend status: Complete for current scope.

### Request Demo

- `app/request-demo/page.tsx`
  - Purpose: Server-action-backed demo request form using `submitDemoRequest`.

- `app/request-demo/actions.ts`
  - `submitDemoRequest(formData)`: Simulates POST to marketing service; logs payload and returns `{ ok: true }`.
  
  Frontend status: Complete for current scope.

### Error and Not Found

- `app/error.tsx`
  - Purpose: Route-level error UI with i18n fallbacks, actions to retry, go home, reload, and a stub to report issues.

- `app/global-error.tsx`
  - Purpose: Global error UI (outside providers) with minimal text and retry.

- `app/not-found.tsx`
  - Purpose: 404 UI with i18n and quick actions (home/back/search).

- `app/unauthorized/page.tsx`
  - Purpose: Simple 403-like page for permission-denied routes (static text, can be i18n-ized later).
  
  Frontend status: Partial (needs i18n; better UX).

## Global Frontend Parity Plan (no backend changes)

- Standardize list/table UX: shared hooks for pagination/sort/filter/export and column chooser; apply to all entity lists.
- Implement minimal detail pages per module with safe client-side validation and optimistic UX where appropriate.
- Add local Next API proxy routes `app/api/{domain}/*` with graceful fallbacks to enable pages without a live backend.
- Complete i18n coverage for new labels; run `npm run i18n:validate`.
- Add focused unit tests per module (list renders, one mutation/transition, basic error state).

- Materials — Warehouse configurability (data-driven layout)
  - Add admin UI to manage warehouses, zones, racks, and bins with unlimited hierarchy depth as needed.
  - Add local routes: `/api/materials/warehouse/{warehouses,zones,racks,bins}` with GET/POST (fallbacks, echo on create) to simulate CRUD.
  - Wire `WarehouseMap` to a data-driven layout when provided; keep mock as fallback.
  - Provide CSV import/export stubs and validations client-side.


