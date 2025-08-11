# Product Analytics Tracking Plan (Feebee ERP)

Purpose: Define a first-class, privacy-conscious analytics system for Feebee ERP to measure acquisition, activation, and engagement across public marketing pages and the authenticated app. Initial focus is on CTA clicks, navigation interactions, and solution funnels; later phases add dashboards, funnels, and experimentation. This plan follows the foundation and cross-module guidance in the ERP prompts [^1][^2].

## Objectives
- Capture high-signal user interactions (e.g., CTA clicks, nav clicks, solution card opens) with consistent schemas.
- Preserve user intent in funnels (e.g., marketing → signup/login → deep link) while honoring privacy and compliance (GDPR/CCPA, DNT).
- Enable module-level insights (Financials, Sales, Materials, HCM, MDM, Org Mgmt, CRM, Production, Quality, Plant Maintenance, Project System) without coupling UI to storage backends. [^2]
- Provide a clear rollout path with measurable acceptance criteria.

## Scope (Phase 0 → Phase 2)
- Phase 0 (Foundations): Event taxonomy, schema, client SDK wrapper, consent handling, CURSOR endpoints, and automated QA hooks.
- Phase 1 (Core events): page_view, cta_click, nav_click, solution_view, request_demo_submit, login_submit, signup_submit.
- Phase 2 (Depth): table_interaction, search_performed, filter_changed, form_submit_success/fail, error_view, export_download, notification_interaction, web_vitals.

## Event Taxonomy (Initial)
- page_view: Any route view (marketing or app).
- cta_click: Clicks on primary/secondary CTAs (hero buttons, solution cards, pricing, request-demo, signup, login).
- nav_click: Header dropdown, sidebar, breadcrumbs.
- solution_view: Viewing a /solutions/[slug] page; include module key.
- request_demo_submit: Demo request completed (server action).
- login_submit, signup_submit: Submission attempts and results.
- web_vitals: FID/INP/LCP/CLS/TTFB for performance monitoring.
- error_view: Error boundaries or failed data fetch UI states.
- table_interaction: Sort, paginate, mass-select, export.
- search_performed: Global search queries (hashed/obfuscated) and module context.
- filter_changed: Facet changes in data-heavy lists.

## Event Schema (Draft)
\`\`\`typescript
export type AnalyticsEventName =
  | "page_view"
  | "cta_click"
  | "nav_click"
  | "solution_view"
  | "request_demo_submit"
  | "login_submit"
  | "signup_submit"
  | "web_vitals"
  | "error_view"
  | "table_interaction"
  | "search_performed"
  | "filter_changed"

export interface AnalyticsEventBase {
  name: AnalyticsEventName
  ts: string // ISO timestamp
  sessionId: string
  userId?: string // if authenticated
  orgId?: string
  role?: string
  path: string
  referrer?: string
  locale?: string
  module?: string // e.g., "financials","sales","materials"...
  component?: string // e.g., "hero","solutions-grid","sidebar"
  metadata?: Record<string, unknown> // redacted PII only
}

export interface CTAEvent extends AnalyticsEventBase {
  name: "cta_click"
  label: string // e.g., "hero_start_trial","solutions_learn_more"
  value?: number
  currency?: string
}
\`\`\`

## Priority Instrumentation (Phase 1 Targets)
- Landing page:
  - Hero primary CTA (Start Free Trial), secondary CTA (Watch Demo): cta_click
  - Solutions grid “Learn More” button: cta_click, solution_view on destination
- Navigation:
  - Solutions dropdown links (implemented + recent): nav_click
  - Login/Get Started: cta_click
- Marketing:
  - /solutions/[slug]: page_view on load; CTAs → cta_click; Request Demo → request_demo_submit (server action)
- Auth:
  - /login and /signup submits: login_submit/signup_submit with outcome
- App shell:
  - Sidebar nav items: nav_click
- Pricing:
  - Start Trial: cta_click

## Data Flow

```mermaid title="Analytics Data Flow" type="diagram"
graph LR;
A["UI Interaction"]B["Client Analytics SDK"];
BC["Batch Queue #43; Retry"];
CD["/api/v1/analytics/ingest (CURSOR)"];
DE["Processor #43; Validation"];
EF["Warehouse/DB (Neon)"];
EG["Real-time Dashboard"];
