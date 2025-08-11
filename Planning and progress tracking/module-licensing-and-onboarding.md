# ERP Module Licensing & Customer Onboarding Plan

This document defines how customers (tenants) are provisioned, how end-users register customer master records, and how module-based licensing and feature entitlements are enforced across the stack. It aligns with the Master Data Management blueprint and enterprise governance requirements. [^4][^5]

## 1) Tenancy Model & Provisioning

- Tenant (Organization): Each buyer operates in an isolated org/tenant with its own data and entitlements.
- User ↔ Org Binding: A user belongs to one or more orgs via explicit membership/roles; external users never discover orgs they’re not entitled to.
- Provisioning Paths:
  - Sales-assisted: Internal admin creates org, assigns plan, enables modules/features, invites initial admins.
  - Self-serve (optional): Buyer signs up via checkout, we auto-provision org and seed entitlements per plan, then invite initial admins.
- Org Selector UX:
  - If a user has one org: auto-select; hide the selector.
  - If multiple: show only authorized orgs.
  - If none: show support path; never show global org lists.
- Security: All requests include org context (e.g., orgId in JWT claims); backend must enforce org scoping on every query. [^5]

## 2) Customer Registration (Customer Master)

Supported entry methods for customer master data: [^4]
- Direct UI entry (MDM → Customers): 
  - Form with validation (required fields, formatting), duplicate detection (name, taxId, email/phone), and optional approval chain before activation.
  - Audit logs: who created/approved, when, what changed.
- Bulk import:
  - CSV/Excel upload → server-side validation → preview → approve → commit.
  - Partial success handling; downloadable error file for corrections.
- API ingestion:
  - Secure endpoints to create/update customers; same validation/dedupe rules as UI.
  - Optional approval workflow flags.
- Portal (optional):
  - Customer-facing portal for profile updates; all changes route to an approval queue before activation.

Governance patterns: Approval chains, duplicate detection, mass update, import validation, data quality dashboards, and integration status monitoring are standard MDM features we will support incrementally. [^4]

## 3) Module-Based Packaging & Entitlements

- Units:
  - Module: High-level domain (Financials, Sales, Materials, HCM, CRM, etc.).
  - Feature: Fine-grained capability (e.g., Sales Order Entry, Pipeline Kanban, Price Simulation).
  - Plan: A bundle of modules/features (Starter/Pro/Enterprise).
  - Add-on: Optional capabilities layered on a plan (e.g., Advanced Pricing, Extra Seats).
- Entitlement Record:
  - tenantId, moduleId, featureId (optional), planId (optional), seats, usage caps, expiresAt / trialEndsAt, status (active, suspended, expired), flags (beta, preview).
- Enforcement:
  - Backend: Check entitlements on every API call; reject unauthorized with 403. Defense in depth is mandatory; do not rely on UI alone. [^5]
  - Frontend: Hide non-entitled modules in navigation; protect routes; disable/grey out gated actions with upsell affordances. Use the same entitlement map for consistent UX.
- Lifecycle:
  - Purchase/Upgrade/Downgrade events update entitlements; we reflect changes in the UI in near real time (webhooks or polling).
  - Trials and grace periods respected by both UI and API.

## 4) UX & Workflow Rules

- Navigation:
  - Only show entitled modules/features. Non-entitled deep links render an informative, localized “not enabled” screen with a request-demo or contact-admin CTA.
- Route Guarding:
  - ProtectedRoute checks auth and entitlements; unauthorized renders a localized 401/403 page. 
- Context:
  - All queries include org context; switching org clears caches/sessions that are org-scoped to prevent data bleed.
- i18n & Accessibility:
  - No hardcoded strings; use i18n provider. RTL-friendly layouts. Proper aria labels, focus management, and live regions where appropriate. [^5]

## 5) Data Model (Backend-Oriented Sketch)

- tenants (id, name, defaultLocale, timezone, currency, createdAt, status)
- users (id, email, name, status, createdAt)
- user_tenants (userId, tenantId, roleId)
- roles (id, name, tenantScoped boolean)
- permissions (id, key)
- role_permissions (roleId, permissionId)
- modules (id, key, label, category)
- features (id, key, moduleId, label)
- plans (id, key, label, description)
- plan_modules (planId, moduleId)
- plan_features (planId, featureId)
- entitlements (tenantId, planId?, moduleId?, featureId?, seats, usageCap, status, expiresAt, flags)
- subscriptions (tenantId, provider, status, currentPeriodEnd, trialEndsAt)
- invoices (subscriptionId, amount, currency, status, providerInvoiceId)
- audit_logs (actorUserId, tenantId, entity, entityId, action, changes, createdAt)
- mdm_customers (tenantId, id, name, type, status, taxId, contacts, addresses, financial, createdAt, updatedAt)
- mdm_import_jobs (id, tenantId, type, status, fileUrl, summaryJson, createdAt)

Note: Final schema will be refined with the backend team.

## 6) Onboarding & Admin Workflows

- Org onboarding wizard:
  - Steps: company profile, locale/timezone/currency, default chart of accounts (if Financials), initial users/roles, modules to enable, data import (optional).
- Customer creation workflow:
  - Draft → Validate/Dedupe → Submit for Approval → Approve/Reject → Active.
- Module management:
  - Admin can enable/disable modules and features per org from an Entitlements settings page.
  - Changes logged to audit trail and applied immediately to both UI and API permissions.

## 7) Billing & Trials (Optional Integration)

- Provider (e.g., Stripe):
  - Plans → Checkout → Webhooks to update entitlements.
- Trials:
  - Trial entitlements expire automatically; grace periods supported.
- Seat management:
  - Track assigned vs. available seats; enforce seat limits in user invitations.

## 8) Observability & Compliance

- Audit logging for entitlement changes, module toggles, data imports, and approvals.
- Metrics: active tenants, module adoption, import success rate, approval times.
- RBAC reviews and least-privilege defaults.

## 9) Phased Implementation Plan (Frontend + Backend)

Phase A — Foundations
- Backend: tenants/users, RBAC, modules/features, entitlements read path; basic subscriptions.
- Frontend: show/hide modules via entitlements; protect routes; localized shell and error pages.

Phase B — MDM Customers
- Backend: mdm_customers CRUD, import jobs with validation preview, approval workflow endpoints.
- Frontend: Customer Master forms, import preview, approval actions, duplicate detection UX; fully localized and accessible. [^4]

Phase C — Billing/Trials & Add-ons
- Backend: subscription lifecycle, webhooks to entitlements, seat enforcement.
- Frontend: upsell/enablement screens, trial banners, seat usage indicators.

## 10) Acceptance Criteria (Executive Summary)

- Tenant Isolation: Users only see their authorized orgs and their data. No cross-tenant leakage.
- Entitlement Enforcement: UI reflects entitlements; backend blocks non-entitled actions (403).
- Customer Registration: Users can add customers via form; bulk import validates and previews; approvals can be enforced; audit logs exist.
- i18n & A11y: No hardcoded strings; RTL verified; aria attributes and focus management implemented.
- Observability: Entitlement changes and data imports are auditable; key metrics are emitted.

---

## 11) // API Endpoints for CURSOR

The following endpoints are proposed to the backend; the UI will include CURSOR comments at each callsite and use local proxy routes where appropriate during development.

\`\`\`ts
// Tenancy & Identity
GET    /api/v1/tenants/me                         // Current user's orgs
POST   /api/v1/tenants                             // Create org (sales-assisted or self-serve)
GET    /api/v1/tenants/{tenantId}                  // Org profile
PUT    /api/v1/tenants/{tenantId}                  // Update org profile

// Entitlements & Modules
GET    /api/v1/entitlements?tenantId=...          // Effective entitlements for org
POST   /api/v1/entitlements                        // Grant/modify entitlements (admin)
GET    /api/v1/modules                              // Catalog of modules/features
GET    /api/v1/plans                                // Plans and their modules/features

// Subscriptions (Optional billing integration)
GET    /api/v1/subscriptions?tenantId=...          // Subscription status
POST   /api/v1/subscriptions/checkout              // Start checkout
POST   /api/v1/subscriptions/webhook               // Webhook to update entitlements

// MDM: Customer Master
GET    /api/v1/mdm/customers                       // List customers (filters, pagination)
POST   /api/v1/mdm/customers                       // Create customer
GET    /api/v1/mdm/customers/{id}                  // Get customer details
PUT    /api/v1/mdm/customers/{id}                  // Update customer
DELETE /api/v1/mdm/customers/{id}                  // Soft-delete/inactivate
POST   /api/v1/mdm/customers/import                // Start import job
GET    /api/v1/mdm/customers/import/{jobId}        // Import job status/results
POST   /api/v1/mdm/customers/validate              // Validate (server-side dedupe)

// Approvals & Data Quality
GET    /api/v1/approvals/queues?type=customer     // Pending approvals
POST   /api/v1/approvals/{id}/approve              // Approve
POST   /api/v1/approvals/{id}/reject               // Reject
GET    /api/v1/data-quality/customers              // Data quality metrics

// Audit
GET    /api/v1/audit?tenantId=...&entity=customer  // Audit trail
\`\`\`

Implementation notes:
- Every backend call includes the org context and is authorization-checked server-side.
- Frontend will annotate call sites with CURSOR comments and keep proxy routes for dev until the backend is ready. [^5]
