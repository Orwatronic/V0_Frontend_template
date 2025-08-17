## CRM Module Completion To‑Do

### Milestone 1: Core Sales Entities (Lists + Detail)
- Leads: list, detail, bulk actions, import/export, saved views [DONE: list/detail, bulk, views]
- Accounts: list + detail with related contacts & activity [DONE: v1]
- Contacts: list + detail [DONE: v1]
- Opportunities: Kanban (DnD), stage metrics, forecasting [DONE: DnD; TODO: metrics/forecast]
- Quotes: list + detail, status flow, approvals [TODO]
- Orders: list + detail, fulfillment status [TODO]

Acceptance:
- Pagination, server filtering/sorting, ARIA roles, i18n (en), error states, empty states.

### Milestone 2: Global UX & Productivity
- Global CRM search with saved segments [TODO]
- Saved views (columns/filters) for all lists [PARTIAL: Leads]
- Column chooser across entities [PARTIAL]
- Shareable views (URL params) [TODO]

### Milestone 3: Collaboration & Timeline
- Activity timeline with mentions, file attachments on Leads/Accounts/Contacts [PARTIAL]
- Tasks/todos linked to entities; reminders [TODO]
- Email/call logging stubs [TODO]

### Milestone 4: Permissions & Realtime
- Permission‑aware UI (sales_rep/manager/admin), field hiding [TODO]
- Realtime updates (WS/SSE) for pipeline/activity [DONE: dashboard, opps, lead/account detail]

### Milestone 5: Data Ops & Integrations
- Import/export CSV with server validation & templates [PARTIAL]
- File uploads service (mock) for attachments [TODO]
- API integration toggled by API_BASE_URL, graceful fallbacks [DONE pattern]

### Milestone 6: Quality
- Tests: unit/integration for lists, permissions, funnel math; basic E2E smoke [PARTIAL]
- A11y: ARIA, keyboard DnD fallback, focus management [TODO]
- Perf: pagination/infinite scroll, memoization, skeletons [PARTIAL]

---

Next up: Implement Quotes list/detail with API stubs and English i18n, link from CRM dashboard. Add server-side pagination/sorting for Leads/Accounts/Contacts lists.


