# Complete ERP Frontend Development Prompts Collection

## Table of Contents
1. [Foundation & Architecture Setup](#foundation--architecture-setup)
2. [Design System & Component Library](#design-system--component-library)
3. [Core Infrastructure & Shell](#core-infrastructure--shell)
4. [Authentication & User Management](#authentication--user-management)
5. [Master Data Management UI](#master-data-management-ui)
6. [Financial Management UI](#financial-management-ui)
7. [Human Capital Management UI](#human-capital-management-ui)
8. [Materials Management UI](#materials-management-ui)
9. [Sales & Distribution UI](#sales--distribution-ui)
10. [Production & Manufacturing UI](#production--manufacturing-ui)
11. [Cross-Module Features](#cross-module-features)
12. [Analytics & Reporting](#analytics--reporting)
13. [Mobile & Progressive Web App](#mobile--progressive-web-app)
14. [Performance & Optimization](#performance--optimization)
15. [Testing & Quality Assurance](#testing--quality-assurance)

---

## Foundation & Architecture Setup

### Prompt 1: Frontend Architecture & Technology Stack Setup
**Act as a senior frontend architect specializing in enterprise applications.** Create the foundational architecture for a comprehensive ERP frontend that meets the highest standards of performance, usability, and maintainability. Design a scalable, modular architecture with:

**Core Setup:**
- Next.js 14 project with App Router and TypeScript configuration
- Monorepo structure using Turborepo for module management
- Design system package with shared components
- Module-specific packages for each ERP module
- Shared utilities and API client packages
- Environment configuration for development, staging, and production
- Docker setup for consistent development environments

**Technical Stack:**
```typescript
// Core Dependencies
- Next.js 14 with App Router
- TypeScript 5.x with strict configuration
- React 18 with Suspense and Server Components
- Tailwind CSS for utility-first styling
- Radix UI for accessible primitives
- TanStack Query for server state
- Zustand for client state
- React Hook Form + Zod for forms
- Framer Motion for animations
- Recharts for data visualization
```

**Project Structure:**
```
frontend/
├── apps/
│   ├── web/                    # Main Next.js application
│   └── mobile/                 # React Native app (future)
├── packages/
│   ├── ui/                     # Design system components
│   ├── api-client/             # Type-safe API client
│   ├── utils/                  # Shared utilities
│   ├── hooks/                  # Shared React hooks
│   └── types/                  # Shared TypeScript types
├── modules/
│   ├── auth/                   # Authentication module
│   ├── mdm/                    # Master Data Management
│   ├── financial/              # Financial Management
│   ├── hcm/                    # Human Capital Management
│   ├── materials/              # Materials Management
│   ├── sales/                  # Sales & Distribution
│   └── shared/                 # Shared module components
└── config/
    ├── eslint/                 # ESLint configurations
    ├── typescript/             # TypeScript configs
    └── tailwind/               # Tailwind presets
```

**Development Standards:**
- Accessibility: WCAG 2.1 AAA compliance
- Performance: Core Web Vitals optimization
- Internationalization: Multi-language support from day one
- Security: Content Security Policy, HTTPS only
- Testing: Unit, integration, and E2E test setup

### Prompt 2: Design System & Component Library Foundation
**Act as a senior UI/UX architect.** Create a comprehensive design system that serves as the visual and functional foundation for the entire ERP system. Build:

**Design Tokens:**
```typescript
// Color System
export const colors = {
  // Semantic colors for business context
  status: {
    draft: { light: '#E5E7EB', DEFAULT: '#6B7280', dark: '#374151' },
    active: { light: '#D1FAE5', DEFAULT: '#10B981', dark: '#059669' },
    warning: { light: '#FEF3C7', DEFAULT: '#F59E0B', dark: '#D97706' },
    error: { light: '#FEE2E2', DEFAULT: '#EF4444', dark: '#DC2626' },
    info: { light: '#DBEAFE', DEFAULT: '#3B82F6', dark: '#2563EB' }
  },
  // Module-specific colors
  modules: {
    financial: '#1E40AF',
    sales: '#7C3AED',
    inventory: '#059669',
    production: '#DC2626',
    hr: '#F59E0B'
  }
}

// Typography Scale
export const typography = {
  // Optimized for data-heavy interfaces
  display: { size: '2.25rem', leading: '2.5rem', tracking: '-0.02em' },
  headline: { size: '1.875rem', leading: '2.25rem', tracking: '-0.01em' },
  title: { size: '1.25rem', leading: '1.75rem', tracking: '0' },
  body: { size: '0.875rem', leading: '1.25rem', tracking: '0' },
  caption: { size: '0.75rem', leading: '1rem', tracking: '0.01em' }
}

// Spacing System
export const spacing = {
  // Dense spacing for data tables
  dataTable: { row: '0.5rem', cell: '0.75rem' },
  // Comfortable spacing for forms
  form: { field: '1.5rem', section: '2rem' },
  // Page-level spacing
  page: { section: '3rem', header: '1.5rem' }
}
```

**Core Components:**
- Data Table with virtualization, sorting, filtering, and export
- Form components with validation and error handling
- Dashboard cards with real-time updates
- Navigation components (sidebar, breadcrumbs, tabs)
- Modal and drawer systems
- Notification and toast systems
- Loading states and skeletons
- Empty states with actionable guidance

**Enterprise Patterns:**
- Master-detail layouts for data management
- Wizard patterns for complex workflows
- Bulk action interfaces
- Advanced search and filter interfaces
- Keyboard navigation throughout

---

## Core Infrastructure & Shell

### Prompt 3: Application Shell & Navigation System
**Act as a senior frontend architect.** Build the main application shell that provides consistent navigation and layout across all ERP modules. Create:

**Layout Architecture:**
```typescript
// Responsive layout system
interface LayoutConfig {
  sidebar: {
    collapsed: boolean;
    width: { expanded: '16rem', collapsed: '4rem' };
    breakpoint: 'lg';
  };
  header: {
    height: '4rem';
    sticky: boolean;
  };
  content: {
    maxWidth: '1920px';
    padding: { mobile: '1rem', desktop: '2rem' };
  };
}

// Module-aware navigation
interface NavigationItem {
  id: string;
  label: string;
  icon: IconType;
  href?: string;
  module: ModuleType;
  permissions: string[];
  children?: NavigationItem[];
  badge?: {
    type: 'count' | 'status';
    value: string | number;
  };
}
```

**Shell Components:**
- Adaptive sidebar with module switching
- Global search with command palette (Cmd+K)
- User profile and settings dropdown
- Notification center with real-time updates
- Breadcrumb navigation with module context
- Quick actions toolbar
- Module-specific toolbars
- Responsive mobile navigation

**State Management:**
```typescript
// Global UI state
interface UIStore {
  // Layout
  sidebarCollapsed: boolean;
  activeModule: ModuleType;
  
  // User preferences
  theme: 'light' | 'dark' | 'system';
  density: 'compact' | 'comfortable' | 'spacious';
  locale: string;
  
  // Navigation
  recentItems: RecentItem[];
  bookmarks: Bookmark[];
  
  // Actions
  toggleSidebar: () => void;
  setActiveModule: (module: ModuleType) => void;
  addRecentItem: (item: RecentItem) => void;
}
```

### Prompt 4: API Client & Data Management Layer
**Act as a senior frontend architect.** Create a robust API client and data management layer that handles all backend communication efficiently. Build:

**Type-Safe API Client:**
```typescript
// Auto-generated types from OpenAPI spec
import { paths } from './generated/api-types';

// Type-safe API client
class ERPApiClient {
  private client: AxiosInstance;
  
  constructor(config: ApiConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
    });
    
    this.setupInterceptors();
  }
  
  // Request interceptor for auth
  private setupInterceptors() {
    this.client.interceptors.request.use(
      async (config) => {
        const token = await this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.refreshToken();
          return this.client.request(error.config);
        }
        return Promise.reject(this.transformError(error));
      }
    );
  }
}
```

**Data Fetching Patterns:**
```typescript
// Optimistic updates
export function useCreateSalesOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateOrderData) => api.sales.createOrder(data),
    onMutate: async (newOrder) => {
      // Cancel in-flight queries
      await queryClient.cancelQueries({ queryKey: ['orders'] });
      
      // Snapshot previous value
      const previousOrders = queryClient.getQueryData(['orders']);
      
      // Optimistically update
      queryClient.setQueryData(['orders'], (old) => [...old, newOrder]);
      
      return { previousOrders };
    },
    onError: (err, newOrder, context) => {
      // Rollback on error
      queryClient.setQueryData(['orders'], context.previousOrders);
      toast.error('Failed to create order');
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

// Real-time subscriptions
export function useRealtimeOrders() {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const subscription = api.realtime.subscribe('orders', (event) => {
      queryClient.setQueryData(['orders'], (old) => {
        switch (event.type) {
          case 'created':
            return [...old, event.data];
          case 'updated':
            return old.map(order => 
              order.id === event.data.id ? event.data : order
            );
          case 'deleted':
            return old.filter(order => order.id !== event.data.id);
        }
      });
    });
    
    return () => subscription.unsubscribe();
  }, [queryClient]);
}
```

---

## Authentication & User Management

### Prompt 5: Authentication & Authorization UI
**Act as a senior frontend architect.** Implement a comprehensive authentication and authorization system with enterprise-grade security. Create:

**Authentication Flow:**
```typescript
// Multi-step authentication
interface AuthFlow {
  steps: {
    credentials: { email: string; password: string };
    mfa?: { method: 'totp' | 'sms' | 'email'; code: string };
    deviceTrust?: { trustDevice: boolean; deviceName: string };
  };
  
  state: {
    currentStep: keyof AuthFlow['steps'];
    attemptCount: number;
    lockedUntil?: Date;
  };
}

// Secure session management
interface SessionManager {
  // Token management
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiry: Date | null;
  
  // Session info
  user: User | null;
  permissions: Permission[];
  activeOrganization: Organization;
  
  // Methods
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  switchOrganization: (orgId: string) => Promise<void>;
}
```

**UI Components:**
- Multi-step login form with MFA support
- Password strength indicator
- Session timeout warning modal
- Organization/company switcher
- Permission-aware UI components
- Role management interface
- User profile management
- Security settings (MFA setup, sessions)

**Authorization Patterns:**
```typescript
// Permission-based rendering
export function CanAccess({ 
  permission, 
  fallback = null, 
  children 
}: CanAccessProps) {
  const { hasPermission } = useAuth();
  
  if (!hasPermission(permission)) {
    return fallback;
  }
  
  return children;
}

// Route protection
export function ProtectedRoute({ 
  permissions, 
  children 
}: ProtectedRouteProps) {
  const { user, hasAllPermissions } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (!hasAllPermissions(permissions)) {
      router.push('/unauthorized');
    }
  }, [user, permissions]);
  
  if (!user || !hasAllPermissions(permissions)) {
    return <LoadingScreen />;
  }
  
  return children;
}
```

---

## Master Data Management UI

### Prompt 6: Master Data Management Interface
**Act as a senior frontend architect.** Build comprehensive interfaces for managing master data across the ERP system. Create:

**Customer Master Interface:**
```typescript
// Advanced search and filtering
interface CustomerSearchFilters {
  basic: {
    code: string;
    name: string;
    type: CustomerType[];
    status: Status[];
  };
  
  advanced: {
    creditLimit: { min: number; max: number };
    location: { country: string; region: string; city: string };
    industry: string[];
    createdDate: { from: Date; to: Date };
  };
  
  saved: SavedFilter[];
}

// Master-detail layout
interface CustomerMasterLayout {
  list: {
    view: 'table' | 'cards' | 'kanban';
    columns: ColumnConfig[];
    sorting: SortConfig[];
    pageSize: number;
  };
  
  detail: {
    tabs: {
      general: CustomerGeneralInfo;
      contacts: CustomerContact[];
      addresses: CustomerAddress[];
      financial: CustomerFinancial;
      documents: Document[];
      history: AuditLog[];
    };
  };
}
```

**Material Master Interface:**
- Hierarchical category browser
- Advanced attribute management
- Multi-unit of measure configuration
- Variant and option management
- Image and document gallery
- Inventory level visualization
- Price history charts
- Related items suggestions

**Common MDM Patterns:**
- Bulk import with validation preview
- Duplicate detection and merging
- Mass update workflows
- Approval chains for changes
- Data quality dashboards
- Integration status monitoring

---

## Financial Management UI

### Prompt 7: Financial Management Interfaces
**Act as a senior frontend architect.** Create sophisticated financial management interfaces that handle complex accounting workflows. Build:

**Chart of Accounts Management:**
```typescript
// Hierarchical account tree
interface AccountTreeView {
  // Tree visualization
  display: {
    type: 'tree' | 'sunburst' | 'treemap';
    expandLevel: number;
    showBalances: boolean;
    highlightActive: boolean;
  };
  
  // Drag-drop reorganization
  reorder: {
    enabled: boolean;
    validation: (source: Account, target: Account) => boolean;
    onMove: (source: Account, target: Account) => Promise<void>;
  };
  
  // Account details panel
  details: {
    position: 'right' | 'bottom' | 'modal';
    tabs: ['general', 'settings', 'balances', 'history'];
  };
}
```

**Journal Entry Interface:**
- Smart account search with recent selections
- Auto-balancing with visual indicators
- Template library for recurring entries
- Multi-currency support with rate lookup
- Attachment management
- Approval workflow visualization
- Keyboard shortcuts for rapid entry

**Financial Dashboards:**
```typescript
// Executive dashboard
interface FinancialDashboard {
  kpis: {
    revenue: TrendCard;
    expenses: TrendCard;
    cashFlow: TrendCard;
    profitability: TrendCard;
  };
  
  charts: {
    incomeStatement: WaterfallChart;
    balanceSheet: SankeyDiagram;
    cashFlow: AreaChart;
    budgetVariance: BulletChart;
  };
  
  alerts: {
    creditLimit: Alert[];
    paymentDue: Alert[];
    budgetExceeded: Alert[];
  };
}
```

**Reports & Analytics:**
- Interactive financial statements
- Drill-down capabilities
- Period comparison tools
- Export to Excel with formatting
- Scheduled report generation
- Custom report builder

### Prompt 8: Accounts Payable & Receivable UI
**Act as a senior frontend architect.** Implement comprehensive interfaces for managing payables and receivables. Create:

**Invoice Processing Interface:**
```typescript
// Three-way matching UI
interface InvoiceMatching {
  // Visual comparison
  display: {
    layout: 'side-by-side' | 'overlay' | 'diff';
    documents: {
      purchaseOrder: Document;
      receipt: Document;
      invoice: Document;
    };
  };
  
  // Matching logic
  matching: {
    tolerance: {
      quantity: number;
      price: number;
      total: number;
    };
    
    status: 'matched' | 'partial' | 'exception';
    discrepancies: Discrepancy[];
  };
  
  // Actions
  actions: {
    approve: () => Promise<void>;
    reject: (reason: string) => Promise<void>;
    requestInfo: (message: string) => Promise<void>;
  };
}
```

**Payment Processing:**
- Payment run wizard
- Bank file generation
- Payment method selection
- Discount optimization
- Foreign exchange handling
- Remittance advice generation

**Collections Management:**
- Aging analysis with heatmaps
- Customer credit dashboard
- Dunning letter automation
- Promise-to-pay tracking
- Collection effectiveness metrics
- Customer communication log

---

## Human Capital Management UI

### Prompt 9: Human Capital Management Interfaces
**Act as a senior frontend architect.** Build comprehensive HCM interfaces that provide intuitive employee lifecycle management. Create:

**Employee Directory & Profiles:**
```typescript
// Rich employee profiles
interface EmployeeProfile {
  // Overview card
  summary: {
    photo: Avatar;
    basicInfo: EmployeeBasic;
    currentPosition: Position;
    reportingLine: OrgChart;
    quickActions: Action[];
  };
  
  // Detailed sections
  sections: {
    personal: PersonalInfo;
    employment: EmploymentHistory;
    compensation: CompensationData;
    benefits: BenefitEnrollment;
    performance: PerformanceReviews;
    training: TrainingRecords;
    documents: DocumentLibrary;
    timeOff: LeaveBalances;
  };
  
  // Timeline view
  timeline: {
    events: TimelineEvent[];
    filters: EventFilter[];
    view: 'chronological' | 'grouped';
  };
}
```

**Organization Chart Visualization:**
- Interactive org chart with zoom/pan
- Multiple view modes (hierarchy, matrix, flat)
- Position-based or person-based view
- Drag-drop reorganization
- Succession planning overlay
- Headcount analytics
- Export capabilities

**Self-Service Portals:**
```typescript
// Employee self-service
interface EmployeeSelfService {
  // Dashboard widgets
  widgets: {
    timeOffBalance: LeaveWidget;
    upcomingEvents: EventsWidget;
    payslip: PayslipWidget;
    benefits: BenefitsWidget;
    goals: GoalsWidget;
  };
  
  // Quick actions
  actions: {
    requestTimeOff: () => void;
    submitTimesheet: () => void;
    updateInfo: () => void;
    viewPayslip: () => void;
  };
}

// Manager self-service
interface ManagerSelfService {
  // Team overview
  team: {
    members: TeamMember[];
    metrics: TeamMetrics;
    calendar: TeamCalendar;
    workload: WorkloadChart;
  };
  
  // Approvals
  pending: {
    timeOff: LeaveRequest[];
    timesheets: Timesheet[];
    expenses: ExpenseClaim[];
    requisitions: JobRequisition[];
  };
}
```

**Time & Attendance:**
- Calendar-based time entry
- Project/task allocation
- Overtime calculations
- Shift scheduling
- Clock in/out interface
- Absence management
- Timesheet approvals

---

## Materials Management UI

### Prompt 10: Materials Management Interfaces
**Act as a senior frontend architect.** Create comprehensive interfaces for procurement, inventory, and warehouse management. Build:

**Procurement Interface:**
```typescript
// Purchase requisition workflow
interface RequisitionWorkflow {
  // Smart form with catalog integration
  form: {
    items: {
      search: CatalogSearch;
      recent: RecentItems;
      templates: ItemTemplate[];
    };
    
    validation: {
      budget: BudgetCheck;
      approval: ApprovalChain;
      compliance: ComplianceCheck;
    };
  };
  
  // Approval visualization
  approval: {
    chain: ApprovalStep[];
    currentStep: number;
    timeline: ApprovalTimeline;
    delegates: Approver[];
  };
  
  // Vendor selection
  vendorSelection: {
    comparison: VendorComparison;
    history: PurchaseHistory;
    performance: VendorMetrics;
    recommendation: AIRecommendation;
  };
}
```

**Inventory Management Dashboard:**
```typescript
// Real-time inventory monitoring
interface InventoryDashboard {
  // Stock levels visualization
  stockLevels: {
    view: 'heatmap' | 'treemap' | 'list';
    metrics: {
      onHand: number;
      available: number;
      reserved: number;
      inTransit: number;
    };
    alerts: StockAlert[];
  };
  
  // Warehouse layout
  warehouseMap: {
    layout: WarehouseLayout;
    locations: Location[];
    utilization: UtilizationHeatmap;
    picker: PathOptimization;
  };
  
  // Movement tracking
  movements: {
    recent: Movement[];
    pending: Movement[];
    issues: MovementIssue[];
  };
}
```

**Warehouse Operations:**
- Pick list optimization
- Barcode scanning interface
- Put-away suggestions
- Cycle count management
- Shipping/receiving docs
- Load planning visualization
- RFID integration

---

## Sales & Distribution UI

### Prompt 11: Sales & Distribution Interfaces
**Act as a senior frontend architect.** Build comprehensive sales interfaces that streamline the entire sales cycle. Create:

**Sales Order Management:**
```typescript
// Order entry interface
interface SalesOrderEntry {
  // Customer selection
  customer: {
    search: CustomerSearch;
    recent: RecentCustomer[];
    creditCheck: CreditStatus;
    history: OrderHistory;
  };
  
  // Product configuration
  products: {
    catalog: ProductCatalog;
    configurator: ProductConfigurator;
    pricing: PricingEngine;
    availability: ATPCheck;
  };
  
  // Order details
  details: {
    items: OrderLine[];
    totals: OrderTotals;
    taxes: TaxCalculation;
    shipping: ShippingOptions;
  };
  
  // Actions
  actions: {
    save: 'draft' | 'quote' | 'order';
    simulate: () => OrderSimulation;
    checkCredit: () => CreditCheckResult;
    schedule: () => DeliverySchedule;
  };
}
```

**Sales Pipeline Visualization:**
```typescript
// Kanban-style pipeline
interface SalesPipeline {
  // Stages configuration
  stages: {
    lead: PipelineStage;
    qualified: PipelineStage;
    proposal: PipelineStage;
    negotiation: PipelineStage;
    closed: PipelineStage;
  };
  
  // Opportunity cards
  opportunities: {
    card: OpportunityCard;
    quickView: OpportunityQuickView;
    actions: OpportunityActions;
  };
  
  // Analytics overlay
  analytics: {
    conversion: ConversionFunnel;
    velocity: SalesVelocity;
    forecast: SalesForecast;
  };
}
```

**Customer Portal:**
- Order tracking interface
- Invoice history
- Product catalog browsing
- Quote requests
- Support ticket creation
- Document downloads
- Reorder functionality

---

## Production & Manufacturing UI

### Prompt 12: Production Planning & MES Interfaces
**Act as a senior frontend architect.** Create sophisticated interfaces for production planning and shop floor execution. Build:

**Production Planning Board:**
```typescript
// Gantt-based planning
interface ProductionPlanner {
  // Timeline view
  gantt: {
    resources: Resource[];
    orders: ProductionOrder[];
    constraints: Constraint[];
    view: 'day' | 'week' | 'month';
  };
  
  // Capacity visualization
  capacity: {
    utilization: UtilizationChart;
    bottlenecks: Bottleneck[];
    availability: ResourceAvailability;
  };
  
  // Drag-drop scheduling
  scheduling: {
    rules: SchedulingRule[];
    optimization: OptimizationParams;
    conflicts: Conflict[];
    suggestions: ScheduleSuggestion[];
  };
}
```

**Shop Floor Terminal:**
```typescript
// Touch-optimized interface
interface ShopFloorTerminal {
  // Work order display
  currentWork: {
    order: WorkOrder;
    operation: Operation;
    instructions: WorkInstruction[];
    drawings: TechnicalDrawing[];
  };
  
  // Data collection
  dataEntry: {
    quantity: QuantityEntry;
    quality: QualityCheck[];
    time: TimeTracking;
    issues: IssueReporting;
  };
  
  // Real-time updates
  realtime: {
    progress: ProgressBar;
    alerts: ProductionAlert[];
    kpis: ProductionKPI[];
  };
}
```

**Bill of Materials Editor:**
- Tree structure visualization
- Where-used analysis
- Version comparison
- Cost rollup display
- Change impact analysis
- CAD integration viewer
- Effectivity date management

---

## Cross-Module Features

### Prompt 13: Unified Search & Command Palette
**Act as a senior frontend architect.** Implement a powerful unified search system that works across all ERP modules. Create:

**Global Search Interface:**
```typescript
// Intelligent search system
interface UnifiedSearch {
  // Search input with AI
  input: {
    query: string;
    suggestions: SearchSuggestion[];
    history: SearchHistory[];
    voice: VoiceInput;
  };
  
  // Multi-source results
  results: {
    grouped: {
      customers: SearchResult[];
      orders: SearchResult[];
      products: SearchResult[];
      documents: SearchResult[];
    };
    
    actions: {
      preview: (item: SearchResult) => void;
      open: (item: SearchResult) => void;
      favorite: (item: SearchResult) => void;
    };
  };
  
  // Advanced filters
  filters: {
    modules: Module[];
    dateRange: DateRange;
    users: User[];
    tags: Tag[];
    custom: CustomFilter[];
  };
}
```

**Command Palette:**
```typescript
// Action-oriented interface
interface CommandPalette {
  // Command types
  commands: {
    navigation: NavCommand[];      // Go to...
    creation: CreateCommand[];     // Create new...
    actions: ActionCommand[];      // Run report...
    settings: SettingCommand[];    // Configure...
  };
  
  // Keyboard shortcuts
  shortcuts: {
    mapping: ShortcutMap;
    customizable: boolean;
    cheatsheet: CheatSheet;
  };
  
  // Context awareness
  context: {
    module: Module;
    permissions: Permission[];
    recentActions: Action[];
  };
}
```

### Prompt 14: Notifications & Activity Feed
**Act as a senior frontend architect.** Build a comprehensive notification system with real-time updates. Create:

**Notification Center:**
```typescript
// Multi-channel notifications
interface NotificationSystem {
  // Notification types
  types: {
    approval: ApprovalNotification;
    alert: AlertNotification;
    reminder: ReminderNotification;
    update: UpdateNotification;
    message: MessageNotification;
  };
  
  // Delivery preferences
  preferences: {
    channels: ('inApp' | 'email' | 'sms' | 'push')[];
    frequency: 'realtime' | 'digest' | 'summary';
    quiet: { start: Time; end: Time; };
    rules: NotificationRule[];
  };
  
  // UI components
  ui: {
    badge: NotificationBadge;
    dropdown: NotificationDropdown;
    center: NotificationCenter;
    toast: ToastNotification;
  };
}
```

**Activity Feed:**
- Real-time activity stream
- Filterable by module/type
- User mentions and tags
- Comment threads
- File attachments
- Action buttons
- Infinite scroll

### Prompt 15: Dashboard Framework
**Act as a senior frontend architect.** Create a flexible dashboard framework that supports customizable, role-based dashboards. Build:

**Dashboard Builder:**
```typescript
// Drag-drop dashboard creation
interface DashboardBuilder {
  // Widget library
  widgets: {
    charts: ChartWidget[];
    metrics: MetricWidget[];
    lists: ListWidget[];
    custom: CustomWidget[];
  };
  
  // Layout system
  layout: {
    grid: GridLayout;
    responsive: ResponsiveRules;
    templates: LayoutTemplate[];
  };
  
  // Configuration
  config: {
    dataSource: DataSourceConfig;
    refresh: RefreshConfig;
    interactions: InteractionConfig;
    sharing: SharingConfig;
  };
}
```

**Widget Framework:**
```typescript
// Extensible widget system
interface WidgetFramework {
  // Base widget
  base: {
    header: WidgetHeader;
    body: WidgetBody;
    footer: WidgetFooter;
    actions: WidgetAction[];
  };
  
  // Data binding
  data: {
    source: DataSource;
    transform: DataTransform;
    cache: CacheStrategy;
    error: ErrorHandler;
  };
  
  // Interactivity
  interaction: {
    drill: DrillDownConfig;
    filter: FilterConfig;
    export: ExportConfig;
    fullscreen: FullscreenConfig;
  };
}
```

---

## Analytics & Reporting

### Prompt 16: Business Intelligence & Analytics UI
**Act as a senior frontend architect.** Build comprehensive analytics interfaces that provide actionable insights. Create:

**Analytics Dashboard:**
```typescript
// Executive analytics
interface AnalyticsDashboard {
  // KPI scorecards
  scorecards: {
    financial: FinancialScorecard;
    operational: OperationalScorecard;
    sales: SalesScorecard;
    hr: HRScorecard;
  };
  
  // Interactive visualizations
  visualizations: {
    charts: {
      revenue: TimeSeriesChart;
      pipeline: FunnelChart;
      geography: GeoMap;
      relationships: NetworkGraph;
    };
    
    filters: {
      time: TimeRangeSelector;
      dimension: DimensionFilter;
      measure: MeasureSelector;
    };
  };
  
  // Insights engine
  insights: {
    automated: AutomatedInsight[];
    anomalies: AnomalyDetection[];
    predictions: Prediction[];
    recommendations: Recommendation[];
  };
}
```

**Report Builder:**
```typescript
// Self-service reporting
interface ReportBuilder {
  // Visual query builder
  query: {
    sources: DataSource[];
    joins: JoinConfig[];
    filters: FilterCriteria[];
    grouping: GroupByConfig[];
    sorting: SortConfig[];
  };
  
  // Report design
  design: {
    layout: ReportLayout;
    components: ReportComponent[];
    styling: StyleConfig;
    branding: BrandConfig;
  };
  
  // Distribution
  distribution: {
    schedule: ScheduleConfig;
    recipients: Recipient[];
    format: ExportFormat[];
    delivery: DeliveryMethod[];
  };
}
```

### Prompt 17: Data Visualization Components
**Act as a senior frontend architect.** Create a comprehensive library of data visualization components optimized for business data. Build:

**Chart Components:**
```typescript
// Business-focused charts
interface ChartLibrary {
  // Time series
  timeSeries: {
    line: LineChart;
    area: AreaChart;
    candlestick: CandlestickChart;
    sparkline: SparklineChart;
  };
  
  // Comparison
  comparison: {
    bar: BarChart;
    column: ColumnChart;
    bullet: BulletChart;
    waterfall: WaterfallChart;
  };
  
  // Composition
  composition: {
    pie: PieChart;
    donut: DonutChart;
    treemap: TreemapChart;
    sunburst: SunburstChart;
  };
  
  // Relationship
  relationship: {
    scatter: ScatterChart;
    bubble: BubbleChart;
    sankey: SankeyDiagram;
    network: NetworkGraph;
  };
  
  // Specialized
  specialized: {
    gantt: GanttChart;
    heatmap: HeatmapChart;
    gauge: GaugeChart;
    funnel: FunnelChart;
  };
}
```

**Interactive Features:**
- Zoom and pan
- Drill-down capabilities
- Cross-filtering
- Annotations
- Export options
- Responsive design
- Accessibility support

---

## Mobile & Progressive Web App

### Prompt 18: Mobile Application Framework
**Act as a senior mobile architect.** Create mobile interfaces optimized for field operations and on-the-go access. Build:

**Mobile Shell:**
```typescript
// Adaptive mobile layout
interface MobileLayout {
  // Navigation
  navigation: {
    type: 'bottom' | 'drawer' | 'tabs';
    items: MobileNavItem[];
    gestures: GestureConfig;
  };
  
  // Offline capability
  offline: {
    storage: OfflineStorage;
    sync: SyncStrategy;
    conflict: ConflictResolution;
    indicator: OfflineIndicator;
  };
  
  // Performance
  performance: {
    lazyLoad: LazyLoadConfig;
    cache: CacheStrategy;
    prefetch: PrefetchConfig;
  };
}
```

**Mobile-Specific Features:**
```typescript
// Device integration
interface DeviceFeatures {
  // Camera
  camera: {
    capture: PhotoCapture;
    scan: BarcodeScan;
    ocr: TextRecognition;
  };
  
  // Location
  location: {
    tracking: LocationTracking;
    geofence: Geofencing;
    maps: MapIntegration;
  };
  
  // Biometrics
  biometrics: {
    faceId: FaceAuthentication;
    touchId: FingerprintAuth;
    pattern: PatternLock;
  };
  
  // Notifications
  push: {
    register: PushRegistration;
    handle: NotificationHandler;
    actions: NotificationAction[];
  };
}
```

**Module-Specific Mobile Apps:**
- Sales mobile app with CRM features
- Warehouse app with scanning
- Field service app with work orders
- Expense app with receipt capture
- Approval app for managers
- Time tracking app

### Prompt 19: Progressive Web App Implementation
**Act as a senior frontend architect.** Transform the ERP frontend into a Progressive Web App with native-like capabilities. Implement:

**PWA Configuration:**
```typescript
// Service worker setup
interface ServiceWorkerConfig {
  // Caching strategies
  caching: {
    static: CacheFirstStrategy;
    api: NetworkFirstStrategy;
    images: StaleWhileRevalidate;
  };
  
  // Background sync
  sync: {
    queue: RequestQueue;
    retry: RetryStrategy;
    notification: SyncNotification;
  };
  
  // Update mechanism
  update: {
    strategy: 'prompt' | 'auto' | 'manual';
    notification: UpdateNotification;
    migration: DataMigration;
  };
}
```

**Offline Functionality:**
- Offline data access
- Queue management for actions
- Conflict resolution UI
- Sync status indicators
- Offline mode detection
- Data compression
- Selective sync

---

## Performance & Optimization

### Prompt 20: Performance Optimization Framework
**Act as a senior performance engineer.** Implement comprehensive performance optimizations for enterprise-scale operations. Create:

**Performance Monitoring:**
```typescript
// Real user monitoring
interface PerformanceMonitoring {
  // Core Web Vitals
  metrics: {
    lcp: LargestContentfulPaint;
    fid: FirstInputDelay;
    cls: CumulativeLayoutShift;
    ttfb: TimeToFirstByte;
  };
  
  // Custom metrics
  custom: {
    moduleLoad: ModuleLoadTime;
    apiLatency: APILatency;
    renderTime: RenderTime;
  };
  
  // Reporting
  reporting: {
    realtime: RealtimeDashboard;
    analytics: PerformanceAnalytics;
    alerts: PerformanceAlert[];
  };
}
```

**Optimization Techniques:**
```typescript
// Code splitting strategy
interface CodeSplitting {
  // Route-based splitting
  routes: {
    lazy: LazyRoute[];
    prefetch: PrefetchStrategy;
    preload: PreloadStrategy;
  };
  
  // Component splitting
  components: {
    heavy: HeavyComponent[];
    conditional: ConditionalLoad[];
    progressive: ProgressiveEnhancement[];
  };
  
  // Bundle optimization
  bundles: {
    vendor: VendorBundle;
    common: CommonChunks;
    analyze: BundleAnalyzer;
  };
}
```

**Runtime Optimizations:**
- Virtual scrolling for large lists
- Image lazy loading and optimization
- Debounced search and filtering
- Memoization strategies
- Worker threads for heavy computation
- Request deduplication
- Progressive enhancement

### Prompt 21: Caching & State Management
**Act as a senior frontend architect.** Implement sophisticated caching and state management for optimal performance. Build:

**Multi-Layer Caching:**
```typescript
// Caching hierarchy
interface CachingStrategy {
  // Browser cache
  browser: {
    memory: MemoryCache;
    sessionStorage: SessionCache;
    localStorage: LocalCache;
    indexedDB: IndexedDBCache;
  };
  
  // Application cache
  application: {
    query: QueryCache;
    computed: ComputedCache;
    component: ComponentCache;
  };
  
  // CDN cache
  cdn: {
    static: StaticAssetCache;
    dynamic: DynamicContentCache;
    invalidation: CacheInvalidation;
  };
}
```

**State Management:**
```typescript
// Optimized state architecture
interface StateArchitecture {
  // Module stores
  stores: {
    auth: AuthStore;
    ui: UIStore;
    cache: CacheStore;
    [module: string]: ModuleStore;
  };
  
  // Persistence
  persistence: {
    strategy: PersistStrategy;
    migration: StateMigration;
    hydration: HydrationStrategy;
  };
  
  // Performance
  performance: {
    selectors: MemoizedSelectors;
    updates: BatchedUpdates;
    subscriptions: OptimizedSubscriptions;
  };
}
```

---

## Testing & Quality Assurance

### Prompt 22: Comprehensive Testing Framework
**Act as a senior QA architect.** Establish a comprehensive testing framework ensuring enterprise-grade quality. Create:

**Testing Strategy:**
```typescript
// Multi-level testing
interface TestingFramework {
  // Unit tests
  unit: {
    components: ComponentTests;
    hooks: HookTests;
    utils: UtilityTests;
    coverage: CoverageRequirements;
  };
  
  // Integration tests
  integration: {
    api: APIIntegrationTests;
    modules: ModuleIntegrationTests;
    workflows: WorkflowTests;
  };
  
  // E2E tests
  e2e: {
    critical: CriticalPathTests;
    regression: RegressionTests;
    performance: PerformanceTests;
    accessibility: A11yTests;
  };
  
  // Visual tests
  visual: {
    snapshots: SnapshotTests;
    regression: VisualRegression;
    responsive: ResponsiveTests;
  };
}
```

**Test Automation:**
```typescript
// Automated testing pipeline
interface TestAutomation {
  // CI/CD integration
  pipeline: {
    preCommit: PreCommitTests;
    preBuild: PreBuildTests;
    postDeploy: PostDeployTests;
  };
  
  // Test data
  data: {
    fixtures: TestFixtures;
    factories: DataFactories;
    seeds: TestSeeds;
  };
  
  // Reporting
  reporting: {
    coverage: CoverageReport;
    performance: PerformanceReport;
    accessibility: A11yReport;
  };
}
```

### Prompt 23: Accessibility & Internationalization
**Act as a senior frontend architect.** Ensure the ERP system meets the highest accessibility standards and supports global operations. Implement:

**Accessibility Framework:**
```typescript
// WCAG 2.1 AAA compliance
interface AccessibilityFramework {
  // Screen reader support
  screenReader: {
    landmarks: ARIALandmarks;
    liveRegions: LiveRegions;
    announcements: Announcements;
  };
  
  // Keyboard navigation
  keyboard: {
    shortcuts: KeyboardShortcuts;
    focus: FocusManagement;
    skip: SkipLinks;
  };
  
  // Visual accessibility
  visual: {
    contrast: ContrastChecker;
    zoom: ZoomSupport;
    reducedMotion: MotionPreferences;
  };
  
  // Testing
  testing: {
    automated: A11yAutomatedTests;
    manual: A11yChecklistTests;
    tools: A11yTestingTools;
  };
}
```

**Internationalization:**
```typescript
// Multi-language support
interface I18nFramework {
  // Translations
  translations: {
    management: TranslationManagement;
    fallback: FallbackStrategy;
    pluralization: PluralizationRules;
    interpolation: InterpolationEngine;
  };
  
  // Localization
  localization: {
    numbers: NumberFormatting;
    dates: DateFormatting;
    currency: CurrencyFormatting;
    units: UnitConversion;
  };
  
  // RTL support
  rtl: {
    layout: RTLLayout;
    components: RTLComponents;
    testing: RTLTesting;
  };
}
```

---

## Deployment & Monitoring

### Prompt 24: Production Deployment & Monitoring
**Act as a senior DevOps engineer.** Set up production deployment and comprehensive monitoring for the frontend. Create:

**Deployment Pipeline:**
```typescript
// CI/CD configuration
interface DeploymentPipeline {
  // Build process
  build: {
    optimization: BuildOptimization;
    validation: BuildValidation;
    artifacts: BuildArtifacts;
  };
  
  // Deployment stages
  stages: {
    dev: DevDeployment;
    staging: StagingDeployment;
    production: ProductionDeployment;
    rollback: RollbackStrategy;
  };
  
  // Feature flags
  features: {
    flags: FeatureFlags;
    targeting: UserTargeting;
    gradual: GradualRollout;
  };
}
```

**Monitoring Setup:**
```typescript
// Comprehensive monitoring
interface MonitoringFramework {
  // Application monitoring
  application: {
    errors: ErrorTracking;
    performance: PerformanceTracking;
    usage: UsageAnalytics;
  };
  
  // Infrastructure monitoring
  infrastructure: {
    uptime: UptimeMonitoring;
    resources: ResourceMonitoring;
    costs: CostTracking;
  };
  
  // Business monitoring
  business: {
    kpis: KPITracking;
    conversion: ConversionTracking;
    user: UserBehaviorTracking;
  };
  
  // Alerting
  alerting: {
    rules: AlertRules;
    channels: AlertChannels;
    escalation: EscalationPolicy;
  };
}
```

### Prompt 25: Security Implementation
**Act as a senior security architect.** Implement comprehensive security measures for the frontend application. Create:

**Security Framework:**
```typescript
// Frontend security
interface SecurityFramework {
  // Authentication
  auth: {
    jwt: JWTManagement;
    refresh: TokenRefresh;
    storage: SecureStorage;
    mfa: MFAImplementation;
  };
  
  // Data protection
  data: {
    encryption: ClientEncryption;
    sanitization: InputSanitization;
    validation: DataValidation;
    masking: SensitiveDataMasking;
  };
  
  // Network security
  network: {
    https: HTTPSEnforcement;
    cors: CORSConfiguration;
    csp: ContentSecurityPolicy;
    headers: SecurityHeaders;
  };
  
  // Vulnerability protection
  protection: {
    xss: XSSPrevention;
    csrf: CSRFProtection;
    clickjacking: ClickjackingDefense;
    injection: InjectionPrevention;
  };
}
```

---

## 🎯 Summary

This comprehensive collection of 25 prompts provides a systematic approach to building an enterprise-grade ERP frontend that meets the highest standards of:

- **Technical Excellence**: Modern architecture, performance optimization, comprehensive testing
- **User Experience**: Intuitive interfaces, responsive design, accessibility
- **Visual Design**: Consistent design system, beautiful components, smooth animations
- **Enterprise Features**: Complex workflows, real-time updates, offline capability
- **Scalability**: Modular architecture, code splitting, caching strategies
- **Security**: Multiple layers of protection, compliance ready
- **Maintainability**: Clean code, comprehensive documentation, automated testing

**Development Sequence:**
1. **Foundation (Prompts 1-4):** Architecture, design system, shell, API layer
2. **Core Modules (Prompts 5-12):** Module-specific interfaces with deep functionality
3. **Cross-Cutting (Prompts 13-17):** Search, notifications, dashboards, analytics
4. **Mobile & PWA (Prompts 18-19):** Mobile optimization and offline capability
5. **Optimization (Prompts 20-21):** Performance and caching strategies
6. **Quality (Prompts 22-23):** Testing, accessibility, internationalization
7. **Production (Prompts 24-25):** Deployment, monitoring, and security

Use these prompts sequentially to build a world-class ERP frontend that provides an exceptional user experience while handling the complexity of enterprise operations. 