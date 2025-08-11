# Customer Relationship Management (CRM) Module - Implementation Blueprint

## 📊 Module Status: 0% 🔵 (New Module - Consolidation View)

**Architectural Note:** Core CRM functionalities (e.g., sales pipeline, customer data, support tickets) are already implemented within the Sales & Distribution, Master Data Management, and Customer Portal modules. This plan outlines the creation of a **new, unified CRM Dashboard** to provide a 360-degree view of the customer by consolidating data from these existing sources.

---

## 🎯 Phase 1: Unified CRM Dashboard & Core Views

This phase focuses on creating the central hub for all customer-related activities.

### **1. CRM Dashboard Component (`/components/crm-dashboard.tsx`)**
- [x] **High-Level KPIs:** Cards for key metrics like New Leads, Conversion Rate, Customer Lifetime Value (CLV), and Customer Satisfaction (CSAT) score.
- [x] **Activity Feed:** A real-time, consolidated feed of all customer interactions (e.g., "Quotation sent to TechCorp," "Support ticket created by Acme Inc.," "Invoice paid by Global Tech").
- [x] **Lead & Opportunity Funnel:** A visual funnel chart summarizing the current state of the sales pipeline (data sourced from the Sales Pipeline).
- [x] **Upcoming Tasks & Follow-ups:** A list of scheduled calls, meetings, and follow-ups for the logged-in user.

### **2. Customer 360° View (`/components/customer-360-view.tsx`)**
- [ ] **Master-Detail Layout:** A searchable list of all customers, leading to a detailed 360° view.
- [ ] **Header:** Displays key customer information (Name, Status, CLV, Account Manager) and quick actions (Log Interaction, Create Opportunity).
- [ ] **Consolidated Data Tabs:**
    - [ ] **Profile:** Core master data from the MDM module.
    - [ ] **Interactions:** A detailed, filterable log of every email, call, and meeting.
    - [ ] **Opportunities:** A list of all past and present sales opportunities for this customer.
    - [ ] **Orders:** A complete history of all sales orders.
    - [ ] **Invoices:** A complete history of all invoices and their payment status.
    - [ ] **Support Tickets:** A history of all support requests.
    - [ ] **Analytics:** Customer-specific analytics, such as spending trends and top-purchased products.

### **3. Lead Management Interface**
- [ ] **Lead Capture Form:** A simple form for manually entering new leads.
- [ ] **Lead Qualification Workflow:** A process to convert a qualified lead into an account, contact, and opportunity.
- [ ] **Data Table:** A view for all unqualified leads, separate from the main customer list.

### **4. Campaign Management (Basic)**
- [ ] **Campaign Creation:** A form to define a marketing campaign (Name, Goal, Budget, Target Audience).
- [ ] **Campaign Dashboard:** A view to track the performance of campaigns (e.g., leads generated, conversion rate).

---

## 🔧 Backend Integration Points

### // API Endpoints for CURSOR

#### **New Aggregation APIs (High Priority)**
\`\`\`typescript
// Dashboard APIs
GET /api/v1/crm/dashboard/kpis                  // Fetch high-level KPI metrics
GET /api/v1/crm/dashboard/activity-feed         // Get the consolidated interaction feed
GET /api/v1/crm/dashboard/tasks                 // Get upcoming tasks for the user

// Customer 360° View APIs
GET /api/v1/crm/customers/search?q=...          // Search for customers to display in the 360° view
GET /api/v1/crm/customers/{id}/360-view         // A single, powerful endpoint to get all consolidated data for one customer

// Lead & Campaign APIs
POST /api/v1/crm/leads                          // Create a new lead
POST /api/v1/crm/leads/{id}/qualify             // Convert a lead into an opportunity
GET /api/v1/crm/campaigns                       // Get all marketing campaigns
POST /api/v1/crm/campaigns                      // Create a new campaign
\`\`\`

#### **Implemented Local Proxy API Routes (development → backend)**
\`\`\`plaintext
GET /api/crm/dashboard/kpis                // Proxies to GET /api/v1/crm/dashboard/kpis
GET /api/crm/dashboard/activity-feed       // Proxies to GET /api/v1/crm/dashboard/activity-feed
GET /api/crm/dashboard/tasks               // Proxies to GET /api/v1/crm/dashboard/tasks
GET /api/sales/pipeline/opportunities      // Proxies to GET /api/v1/sales/pipeline/opportunities
\`\`\`

- Notes: All proxy route handlers forward Authorization and Cookie headers and normalize responses to `{ data: ... }` for client compatibility.

#### **Leveraged Existing APIs (Reference)**
\`\`\`typescript
// These APIs from other modules will feed the aggregation endpoints above.
GET /api/v1/sales/pipeline/opportunities
GET /api/v1/sales/orders
GET /api/v1/sales/invoices
GET /api/v1/mdm/customers/{id}
GET /api/v1/customer-portal/support-tickets
\`\`\`

---

## 🚀 Future Enhancements & Integrations (Backlog)

- [ ] **Marketing Automation:** Integration with email marketing platforms.
- [ ] **Advanced Customer Segmentation:** AI-powered tools to group customers based on behavior and attributes.
- [ ] **Contact Management:** A more detailed view of individual contacts within a customer organization.
- [ ] **Territory Management:** Assigning sales reps to specific geographic or industry-based territories.
- [ ] **Integration with Human Capital Management:** Linking sales reps (employees) to their assigned accounts and performance metrics.

---

## Status Check (2025-08-08)

Progress Update: CRM Dashboard now pulls data from local mock APIs; funnel derived from /api/sales/pipeline/opportunities. All call sites include CURSOR annotations to /api/v1 targets.

- Current UI State:
  - Present: `/app/crm/page.tsx` scaffold with heading/description and a CURSOR placeholder for opportunities.
  - Missing: `/components/crm-dashboard.tsx` and `/components/customer-360-view.tsx` (not implemented).
  - No server actions or route handlers specific to CRM; no data wiring yet.
- i18n Status:
  - Hardcoded strings found in `/app/crm/page.tsx`; no `crm.*` translation keys in locales yet. This violates our i18n rule to avoid hardcoded user-facing strings.
- Reusable Sources:
  - Sales Pipeline, Customer Portal, and MDM customers exist and can feed CRM aggregation views.
- Overall Assessment:
  - Module is scaffold-only (~0–5%). Phase 1 deliverables are not yet implemented.

---

## Next Step (Planned)

- Implement Phase 1, Item 1: CRM Dashboard (`/components/crm-dashboard.tsx`)
  - Deliver:
    - KPI cards (New Leads, Conversion Rate, CLV, CSAT) with mock data and CURSOR annotations.
    - Activity Feed (mock) with CURSOR annotations for future aggregation API.
    - Lead/Opportunity funnel stub (visual placeholder using shadcn/ui) with CURSOR annotations.
  - Integrate into `/app/crm/page.tsx` and remove hardcoded strings by introducing `crm.*` translation keys in `en/ar/no`.
  - Accessibility: Semantic regions, proper headings, keyboard focus order, and aria-live for dynamic sections.
- Acceptance Criteria:
  - `/crm` shows a functional dashboard with localized copy and responsive layout.
  - All strings localized (en/ar/no) via useI18n; RTL verified.
  - CURSOR comments present at all data call sites; endpoints listed above.
  - Responsive layout; keyboard accessible table and controls.

## Acceptance Criteria (Phase 1 Dashboard)
- `/crm` renders KPI cards, funnel, tasks, and activity feed.
- All strings localized (en/ar/no) via useI18n; RTL verified.
- CURSOR comments present at all data call sites; endpoints listed above.
- Responsive layout; keyboard accessible table and controls.
