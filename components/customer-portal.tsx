"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Package, CreditCard, FileText, ShoppingCart, User, Phone, Mail, MapPin, Download, Search, Filter, RefreshCw, Plus, Eye, Truck, Calendar, DollarSign, AlertCircle, CheckCircle, Clock, Star, MessageSquare, Building2 } from 'lucide-react'
import { useI18n } from "@/contexts/i18n-context"

// Mock customer data
const mockCustomerData = {
  profile: {
    id: "CUST-001",
    name: "Acme Corporation",
    contactPerson: "John Smith",
    email: "john.smith@acme.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Ave, Suite 100, New York, NY 10001",
    accountManager: {
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 987-6543"
    },
    creditLimit: 50000,
    availableCredit: 35000,
    paymentTerms: "Net 30",
    customerSince: "2020-03-15"
  },
  metrics: {
    totalOrders: 156,
    totalSpent: 485000,
    averageOrderValue: 3109,
    onTimeDelivery: 94.2
  }
}

// CURSOR: API call to GET /api/v1/customer-portal/orders?customerId={customerId}&status={status}&dateRange={dateRange}
const mockOrders = [
  {
    id: "SO-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 15420.50,
    items: 8,
    deliveryDate: "2024-01-20",
    trackingNumber: "1Z999AA1234567890",
    carrier: "UPS"
  },
  {
    id: "SO-2024-002",
    date: "2024-01-18",
    status: "in_transit",
    total: 8750.00,
    items: 5,
    deliveryDate: "2024-01-25",
    trackingNumber: "1Z999BB1234567891",
    carrier: "FedEx"
  },
  {
    id: "SO-2024-003",
    date: "2024-01-20",
    status: "processing",
    total: 12300.75,
    items: 12,
    deliveryDate: "2024-01-28",
    trackingNumber: null,
    carrier: null
  }
]

// CURSOR: API call to GET /api/v1/customer-portal/invoices?customerId={customerId}&status={status}
const mockInvoices = [
  {
    id: "INV-2024-001",
    orderId: "SO-2024-001",
    date: "2024-01-15",
    dueDate: "2024-02-14",
    amount: 15420.50,
    status: "paid",
    paidDate: "2024-02-10"
  },
  {
    id: "INV-2024-002",
    orderId: "SO-2024-002",
    date: "2024-01-18",
    dueDate: "2024-02-17",
    amount: 8750.00,
    status: "pending",
    paidDate: null
  },
  {
    id: "INV-2024-003",
    orderId: "SO-2024-003",
    date: "2024-01-20",
    dueDate: "2024-02-19",
    amount: 12300.75,
    status: "overdue",
    paidDate: null
  }
]

// CURSOR: API call to GET /api/v1/customer-portal/products?category={category}&search={search}
const mockProducts = [
  {
    id: "PROD-001",
    name: "Industrial Bearing Set",
    sku: "IBS-2024-A",
    price: 245.50,
    availability: "in_stock",
    leadTime: "2-3 days",
    category: "Mechanical Parts",
    description: "High-quality industrial bearing set for heavy machinery"
  },
  {
    id: "PROD-002",
    name: "Hydraulic Pump Assembly",
    sku: "HPA-2024-B",
    price: 1850.00,
    availability: "limited",
    leadTime: "5-7 days",
    category: "Hydraulic Systems",
    description: "Complete hydraulic pump assembly with mounting hardware"
  },
  {
    id: "PROD-003",
    name: "Control Panel Module",
    sku: "CPM-2024-C",
    price: 675.25,
    availability: "out_of_stock",
    leadTime: "2-3 weeks",
    category: "Electronics",
    description: "Advanced control panel module with digital display"
  }
]

// CURSOR: API call to GET /api/v1/customer-portal/support-tickets?customerId={customerId}&status={status}
const mockSupportTickets = [
  {
    id: "TICK-001",
    subject: "Delivery delay inquiry",
    status: "open",
    priority: "medium",
    created: "2024-01-22",
    lastUpdate: "2024-01-23",
    assignedTo: "Support Team"
  },
  {
    id: "TICK-002",
    subject: "Product specification question",
    status: "resolved",
    priority: "low",
    created: "2024-01-20",
    lastUpdate: "2024-01-21",
    assignedTo: "Technical Support"
  }
]

const CustomerPortal = () => {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [orderFilter, setOrderFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [supportTicketForm, setSupportTicketForm] = useState({
    subject: "",
    priority: "medium",
    description: ""
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      delivered: { variant: "default" as const, label: t("customerPortal.status.delivered"), icon: CheckCircle },
      in_transit: { variant: "secondary" as const, label: t("customerPortal.status.inTransit"), icon: Truck },
      processing: { variant: "outline" as const, label: t("customerPortal.status.processing"), icon: Clock },
      paid: { variant: "default" as const, label: t("customerPortal.status.paid"), icon: CheckCircle },
      pending: { variant: "secondary" as const, label: t("customerPortal.status.pending"), icon: Clock },
      overdue: { variant: "destructive" as const, label: t("customerPortal.status.overdue"), icon: AlertCircle },
      in_stock: { variant: "default" as const, label: t("customerPortal.status.inStock"), icon: CheckCircle },
      limited: { variant: "secondary" as const, label: t("customerPortal.status.limited"), icon: AlertCircle },
      out_of_stock: { variant: "destructive" as const, label: t("customerPortal.status.outOfStock"), icon: AlertCircle },
      open: { variant: "secondary" as const, label: t("customerPortal.status.open"), icon: Clock },
      resolved: { variant: "default" as const, label: t("customerPortal.status.resolved"), icon: CheckCircle }
    }
    
    const config = statusConfig[status] || { variant: "outline" as const, label: status, icon: Clock }
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const handleReorder = async (orderId: string) => {
    // CURSOR: API call to POST /api/v1/customer-portal/reorder with orderId
    console.log(`Reordering ${orderId}...`)
  }

  const handleQuoteRequest = async (productId: string) => {
    // CURSOR: API call to POST /api/v1/customer-portal/quote-request with productId
    console.log(`Requesting quote for ${productId}...`)
  }

  const handleSupportTicketSubmit = async () => {
    // CURSOR: API call to POST /api/v1/customer-portal/support-tickets with ticket data
    console.log("Submitting support ticket:", supportTicketForm)
    setSupportTicketForm({ subject: "", priority: "medium", description: "" })
  }

  const filteredOrders = mockOrders.filter(order => 
    orderFilter === "all" || order.status === orderFilter
  )

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("customerPortal.title")}</h1>
          <p className="text-muted-foreground">
            {t("customerPortal.welcome", { name: mockCustomerData.profile.contactPerson })}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("customerPortal.refresh")}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t("customerPortal.export")}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">{t("customerPortal.tabs.dashboard")}</TabsTrigger>
          <TabsTrigger value="orders">{t("customerPortal.tabs.orders")}</TabsTrigger>
          <TabsTrigger value="invoices">{t("customerPortal.tabs.invoices")}</TabsTrigger>
          <TabsTrigger value="catalog">{t("customerPortal.tabs.catalog")}</TabsTrigger>
          <TabsTrigger value="support">{t("customerPortal.tabs.support")}</TabsTrigger>
          <TabsTrigger value="account">{t("customerPortal.tabs.account")}</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("customerPortal.metrics.totalOrders")}</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockCustomerData.metrics.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Since {new Date(mockCustomerData.profile.customerSince).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("customerPortal.metrics.totalSpent")}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${mockCustomerData.metrics.totalSpent.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg: ${mockCustomerData.metrics.averageOrderValue.toLocaleString()} per order
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("customerPortal.metrics.availableCredit")}</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${mockCustomerData.profile.availableCredit.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  of ${mockCustomerData.profile.creditLimit.toLocaleString()} limit
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("customerPortal.metrics.onTimeDelivery")}</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockCustomerData.metrics.onTimeDelivery}%</div>
                <p className="text-xs text-green-600">
                  {t("customerPortal.metrics.onTimeDeliveryNote")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("customerPortal.recentOrders.title")}</CardTitle>
                <CardDescription>{t("customerPortal.recentOrders.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()} • ${order.total.toLocaleString()}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("customerPortal.accountManager.title")}</CardTitle>
                <CardDescription>{t("customerPortal.accountManager.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{mockCustomerData.profile.accountManager.name}</p>
                      <p className="text-sm text-muted-foreground">Account Manager</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{mockCustomerData.profile.accountManager.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{mockCustomerData.profile.accountManager.phone}</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t("customerPortal.accountManager.contact")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Select value={orderFilter} onValueChange={setOrderFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("customerPortal.orders.filterByStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("customerPortal.orders.allOrders")}</SelectItem>
                  <SelectItem value="processing">{t("customerPortal.status.processing")}</SelectItem>
                  <SelectItem value="in_transit">{t("customerPortal.status.inTransit")}</SelectItem>
                  <SelectItem value="delivered">{t("customerPortal.status.delivered")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
              <CardHeader>
                <CardTitle>{t("customerPortal.orders.title")}</CardTitle>
                <CardDescription>{t("customerPortal.orders.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("customerPortal.orders.table.orderId")}</TableHead>
                    <TableHead>{t("customerPortal.orders.table.date")}</TableHead>
                    <TableHead>{t("customerPortal.orders.table.status")}</TableHead>
                    <TableHead>{t("customerPortal.orders.table.items")}</TableHead>
                    <TableHead>{t("customerPortal.orders.table.total")}</TableHead>
                    <TableHead>{t("customerPortal.orders.table.delivery")}</TableHead>
                    <TableHead>{t("customerPortal.orders.table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.items} {t("customerPortal.common.items")}</TableCell>
                      <TableCell>${order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : t("customerPortal.common.tbd")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.trackingNumber && (
                            <Button variant="outline" size="sm">
                              <Truck className="h-4 w-4" />
                            </Button>
                          )}
                              <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReorder(order.id)}
                          >
                                {t("customerPortal.orders.actions.reorder")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
              <CardHeader>
                <CardTitle>{t("customerPortal.invoices.title")}</CardTitle>
                <CardDescription>{t("customerPortal.invoices.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("customerPortal.invoices.table.invoiceId")}</TableHead>
                    <TableHead>{t("customerPortal.invoices.table.orderId")}</TableHead>
                    <TableHead>{t("customerPortal.invoices.table.date")}</TableHead>
                    <TableHead>{t("customerPortal.invoices.table.dueDate")}</TableHead>
                    <TableHead>{t("customerPortal.invoices.table.amount")}</TableHead>
                    <TableHead>{t("customerPortal.invoices.table.status")}</TableHead>
                    <TableHead>{t("customerPortal.invoices.table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.orderId}</TableCell>
                      <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Catalog Tab */}
        <TabsContent value="catalog" className="space-y-6">
              <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("customerPortal.catalog.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
                  {t("customerPortal.catalog.filter")}
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>{t("customerPortal.catalog.sku")}: {product.sku}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">${product.price}</span>
                      {getStatusBadge(product.availability)}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{t("customerPortal.catalog.leadTime")}: {product.leadTime}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1"
                        onClick={() => handleQuoteRequest(product.id)}
                      >
                        {t("customerPortal.catalog.requestQuote")}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("customerPortal.support.create.title")}</CardTitle>
                <CardDescription>{t("customerPortal.support.create.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subject">{t("customerPortal.support.create.subject.label")}</Label>
                  <Input
                    id="subject"
                    value={supportTicketForm.subject}
                    onChange={(e) => setSupportTicketForm({
                      ...supportTicketForm,
                      subject: e.target.value
                    })}
                    placeholder={t("customerPortal.support.create.subject.placeholder")}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">{t("customerPortal.support.create.priority.label")}</Label>
                  <Select 
                    value={supportTicketForm.priority} 
                    onValueChange={(value) => setSupportTicketForm({
                      ...supportTicketForm,
                      priority: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t("customerPortal.support.create.priority.low")}</SelectItem>
                      <SelectItem value="medium">{t("customerPortal.support.create.priority.medium")}</SelectItem>
                      <SelectItem value="high">{t("customerPortal.support.create.priority.high")}</SelectItem>
                      <SelectItem value="urgent">{t("customerPortal.support.create.priority.urgent")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">{t("customerPortal.support.create.description.label")}</Label>
                  <Textarea
                    id="description"
                    value={supportTicketForm.description}
                    onChange={(e) => setSupportTicketForm({
                      ...supportTicketForm,
                      description: e.target.value
                    })}
                    placeholder={t("customerPortal.support.create.description.placeholder")}
                    rows={4}
                  />
                </div>
                <Button onClick={handleSupportTicketSubmit} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("customerPortal.support.create.submit")}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("customerPortal.support.history.title")}</CardTitle>
                <CardDescription>{t("customerPortal.support.history.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSupportTickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{ticket.id}</span>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <p className="text-sm font-medium mb-1">{ticket.subject}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{t("customerPortal.support.history.created")}: {new Date(ticket.created).toLocaleDateString()}</span>
                        <span>{t("customerPortal.support.history.updated")}: {new Date(ticket.lastUpdate).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("customerPortal.support.history.assignedTo")}: {ticket.assignedTo}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("customerPortal.account.companyInfo.title")}</CardTitle>
                <CardDescription>{t("customerPortal.account.companyInfo.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>{t("customerPortal.account.companyInfo.companyName")}</Label>
                  <Input value={mockCustomerData.profile.name} readOnly />
                </div>
                <div className="grid gap-2">
                  <Label>{t("customerPortal.account.companyInfo.customerId")}</Label>
                  <Input value={mockCustomerData.profile.id} readOnly />
                </div>
                <div className="grid gap-2">
                  <Label>{t("customerPortal.account.companyInfo.contactPerson")}</Label>
                  <Input value={mockCustomerData.profile.contactPerson} readOnly />
                </div>
                <div className="grid gap-2">
                  <Label>{t("customerPortal.account.companyInfo.email")}</Label>
                  <Input value={mockCustomerData.profile.email} readOnly />
                </div>
                <div className="grid gap-2">
                  <Label>{t("customerPortal.account.companyInfo.phone")}</Label>
                  <Input value={mockCustomerData.profile.phone} readOnly />
                </div>
                <div className="grid gap-2">
                  <Label>{t("customerPortal.account.companyInfo.address")}</Label>
                  <Textarea value={mockCustomerData.profile.address} readOnly rows={3} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("customerPortal.account.details.title")}</CardTitle>
                <CardDescription>{t("customerPortal.account.details.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>{t("customerPortal.account.details.creditLimit")}</Label>
                  <Input value={`$${mockCustomerData.profile.creditLimit.toLocaleString()}`} readOnly />
                </div>
                <div className="grid gap-2">
                  <Label>{t("customerPortal.account.details.availableCredit")}</Label>
                  <Input value={`$${mockCustomerData.profile.availableCredit.toLocaleString()}`} readOnly />
                </div>
                <div className="grid gap-2">
                  <Label>{t("customerPortal.account.details.paymentTerms")}</Label>
                  <Input value={mockCustomerData.profile.paymentTerms} readOnly />
                </div>
                <div className="grid gap-2">
                  <Label>{t("customerPortal.account.details.customerSince")}</Label>
                  <Input value={new Date(mockCustomerData.profile.customerSince).toLocaleDateString()} readOnly />
                </div>
                <div className="pt-4">
                  <h4 className="font-medium mb-2">{t("customerPortal.account.details.accountManager")}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{mockCustomerData.profile.accountManager.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{mockCustomerData.profile.accountManager.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{mockCustomerData.profile.accountManager.phone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CustomerPortal
