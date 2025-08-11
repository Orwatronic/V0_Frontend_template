# Marketing Site Plan and Tasks

Purpose: Define the public marketing experience for each ERP module and unify the acquisition funnel for unauthenticated users. This complements the in-app navigation shell and preserves user intent with deep links. Aligns with Application Shell & Navigation guidance [^3][^2].

## Scope
- Public module pages at /solutions/[slug] with SEO metadata, features, screenshots, and CTAs.
- Funnel logic: unauthenticated users clicking module links are sent to /solutions/[slug]. CTAs preserve intent via login?next=/target&intent=[module].
- Request Demo flow at /request-demo with a server action placeholder.

## // API Endpoints for CURSOR
\`\`\`typescript
// Marketing APIs
GET  /api/v1/marketing/pages/:slug          // SSR content for public solution pages
POST /api/v1/marketing/demo-requests        // Submit demo request

// Auth intent
GET  /api/v1/auth/session                    // Resolve session state (SSR/CSR)
\`\`\`

## Deliverables
- /solutions/[slug] dynamic route with shared template and module config.
- /request-demo page with server action placeholder.
// CURSOR: API call to POST /api/v1/marketing/demo-requests
- Updated navigation and landing links to route based on auth.

## Acceptance Criteria
- Logged out: Solutions links go to /solutions/[slug] with working CTAs (login with intent/next, request demo).
- Logged in: Solutions links go directly to in-app routes (e.g., /financial).
- Metadata set per page; basic accessibility checks pass (labels, roles, focus order).
- No 404s for any linked modules.

## Future Tasks
- Rich content: case studies, testimonials, pricing plans per module.
- CMS integration for marketing content (headless CMS) with preview mode.
// CURSOR: API call to GET /api/v1/marketing/pages/:slug
- Analytics + events (page views, CTA clicks) and A/B testing.
- Localized marketing content; RTL validation.
// CURSOR: API call to GET /api/v1/i18n/translations?ns=marketing&locale={locale}
