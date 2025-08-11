export type ModuleKey =
  | "financials"
  | "sales"
  | "materials"
  | "hcm"
  | "master-data"
  | "reports"
  | "customer-portal"
  | "organization"
  | "crm"
  | "production"
  | "quality"
  | "maintenance"
  | "projects"

export type ModuleSlug =
  | "financials"
  | "sales"
  | "materials"
  | "hcm"
  | "master-data"
  | "organization"
  | "production"
  | "projects"
  | "quality"
  | "maintenance"
  | "crm"
  | "reports"
  | "customer-portal"

export interface ModuleDef {
  key: ModuleKey
  label: string
  appPath: string
  slug: ModuleSlug
  category: "Finance" | "Operations" | "People" | "Customer" | "Platform"
  description: string
  features: string[]
}

// Central definition of non-AI modules
export const MODULES: ModuleDef[] = [
  {
    key: "financials",
    label: "Financial Management",
    appPath: "/financial",
    slug: "financials",
    category: "Finance",
    description:
      "Complete accounting with General Ledger, multi-currency, fiscal periods, and powerful reporting.",
    features: ["General Ledger", "Multi-Currency", "Fiscal Periods", "Journal Entries", "Financial Reporting"],
  },
  {
    key: "sales",
    label: "Sales & Distribution",
    appPath: "/sales",
    slug: "sales",
    category: "Customer",
    description:
      "Quotations, order management, pricing, delivery tracking, and customer returns processing.",
    features: ["Order Management", "Pricing", "Deliveries", "Returns", "Sales Analytics"],
  },
  {
    key: "materials",
    label: "Materials Management",
    appPath: "/materials",
    slug: "materials",
    category: "Operations",
    description:
      "Material master data, inventory control, warehouse management, and procurement processes.",
    features: ["Inventory", "Warehousing", "Procurement", "Material Master", "Stock Movements"],
  },
  {
    key: "hcm",
    label: "Human Capital Management",
    appPath: "/employees",
    slug: "hcm",
    category: "People",
    description:
      "Employee lifecycle, payroll processing, time tracking, leave management, and org structure.",
    features: ["Employees", "Payroll", "Time Tracking", "Leave", "Org Structure"],
  },
  {
    key: "master-data",
    label: "Master Data Management",
    appPath: "/mdm",
    slug: "master-data",
    category: "Platform",
    description: "Centralized reference data for customers, vendors, materials, and hierarchies.",
    features: ["Customers", "Vendors", "Materials", "Hierarchies"],
  },
  {
    key: "reports",
    label: "Reports & Analytics",
    appPath: "/reports",
    slug: "reports",
    category: "Platform",
    description: "Interactive financial statements, drill-down, export to Excel, and scheduled reports.",
    features: ["Interactive Reports", "Drill-down", "Comparisons", "Excel Export", "Schedules"],
  },
  {
    key: "customer-portal",
    label: "Customer Portal",
    appPath: "/customer-portal",
    slug: "customer-portal",
    category: "Customer",
    description:
      "Order tracking, invoice history, product catalog, quotes, support tickets, and document downloads.",
    features: ["Order Tracking", "Invoices", "Catalog", "Quotes", "Support Tickets"],
  },
  {
    key: "organization",
    label: "Organizational Management",
    appPath: "/organizational",
    slug: "organization",
    category: "Platform",
    description: "Companies, cost centers, profit centers, roles, and permissions management.",
    features: ["Company Structure", "Cost Centers", "Profit Centers", "Auth Management"],
  },
  {
    key: "crm",
    label: "Customer Relationship Management",
    appPath: "/crm",
    slug: "crm",
    category: "Customer",
    description: "Leads, opportunities, customer service, and pipeline visibility.",
    features: ["Leads", "Opportunities", "Cases", "Pipeline", "Customer 360"],
  },
  {
    key: "production",
    label: "Production Planning",
    appPath: "/production",
    slug: "production",
    category: "Operations",
    description: "Manufacturing execution, BOM management, and production scheduling with work orders.",
    features: ["BOMs", "Routings", "Scheduling", "Work Orders", "Capacity Planning"],
  },
  {
    key: "quality",
    label: "Quality Management",
    appPath: "/quality",
    slug: "quality",
    category: "Operations",
    description: "Quality control processes, compliance management, audits, and certifications.",
    features: ["QC Plans", "Inspections", "Non-conformance", "CAPA", "Compliance"],
  },
  {
    key: "maintenance",
    label: "Plant Maintenance",
    appPath: "/maintenance",
    slug: "maintenance",
    category: "Operations",
    description: "Asset management, preventive maintenance, work orders, and equipment lifecycle.",
    features: ["Assets", "PM Plans", "Work Orders", "Spare Parts", "Downtime"],
  },
  {
    key: "projects",
    label: "Project System",
    appPath: "/project",
    slug: "projects",
    category: "Operations",
    description: "Project lifecycle, resource planning, milestone tracking, and budgeting.",
    features: ["WBS", "Resources", "Milestones", "Budgeting", "Actuals"],
  },
]

type Mapping = {
  slug: ModuleSlug
  appPath: string
}

const mappings: Mapping[] = [
  { slug: "financials", appPath: "/financial" },
  { slug: "sales", appPath: "/sales" },
  { slug: "materials", appPath: "/materials" },
  { slug: "hcm", appPath: "/employees" },
  { slug: "master-data", appPath: "/mdm" },
  { slug: "organization", appPath: "/organizational" },
  { slug: "production", appPath: "/production" },
  { slug: "projects", appPath: "/project" },
  { slug: "quality", appPath: "/quality" },
  { slug: "maintenance", appPath: "/maintenance" },
  { slug: "crm", appPath: "/crm" },
  { slug: "reports", appPath: "/reports" },
  { slug: "customer-portal", appPath: "/customer-portal" },
]

export function appPathToSlug(appPath: string): ModuleSlug | null {
  const m = mappings.find((x) => x.appPath === appPath)
  return m ? m.slug : null
}

export function slugToAppPath(slug: ModuleSlug): string {
  const m = mappings.find((x) => x.slug === slug)
  return m ? m.appPath : "/"
}

export function resolveDestination(appPath: string, isAuthenticated: boolean): string {
  if (isAuthenticated) return appPath
  const slug = appPathToSlug(appPath) || "financials"
  const next = encodeURIComponent(appPath)
  return `/solutions/${slug}?next=${next}&intent=${slug}`
}

export function loginCtaHref(moduleKey: ModuleKey) {
  const mod = MODULES.find((m) => m.key === moduleKey)!
  // Preserve user intent for deep-linking after login
  const search = new URLSearchParams({ next: mod.appPath, intent: mod.key }).toString()
  return `/login?${search}`
}

export function requestDemoHref(moduleKey: ModuleKey) {
  const mod = MODULES.find((m) => m.key === moduleKey)!
  const search = new URLSearchParams({ intent: mod.key }).toString()
  return `/request-demo?${search}`
}
