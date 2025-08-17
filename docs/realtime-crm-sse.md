## Realtime CRM Updates (SSE)

### Overview
The CRM uses Server-Sent Events (SSE) to push live updates to the UI without polling. A lightweight stream endpoint provides activity events and pipeline stage updates that hydrate the CRM dashboard, Opportunities board, and entity detail pages.

### Endpoint
- Path: `/api/crm/events`
- Behavior: Emits JSON events with `data:` lines, heartbeats via comments (`:`), and keep-alives.
- Event shapes:
  - `{ type: 'activity', payload: { id, kind: 'quotation'|'invoice'|'support', company?, customer?, at } }`
  - `{ type: 'opportunityUpdated', payload: { id, stage } }`

### Consumers
- Dashboard (`components/crm-dashboard.tsx`)
  - Appends new activity rows (quotation, invoice, support)
  - Refreshes funnel metrics on `opportunityUpdated`
- Opportunities (`app/crm/opportunities/page.tsx`)
  - Listens for `opportunityUpdated` to sync stage changes
- Lead detail (`app/crm/leads/[id]/page.tsx`)
  - Prepends human-readable activity entries to the timeline
- Account detail (`app/crm/accounts/[id]/page.tsx`)
  - Prepends entries to Recent Activity

### Fallback & Resilience
- If the stream fails, UI remains functional using initial fetches.
- The stream sends periodic keep-alives to keep connections open through proxies.

### Extending
- Add more event `type`s or enrich payloads (e.g., user info) in `/api/crm/events` and handle in consumers.
- For backend integration, point the UI to a real SSE backend and preserve the event shapes.


