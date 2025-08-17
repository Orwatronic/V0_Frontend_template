"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Truck,
  FileText,
  Search,
  Download,
  Plus,
  Edit,
  Eye,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import SalesPipeline from "./sales-pipeline"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { SalesOrderEntryForm } from "./sales-order-entry-form"
import { useI18n } from "@/contexts/i18n-context"

// Mock data structures matching backend requirements
interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  address: string
  creditLimit: number
  creditUsed: number
  status: "active" | "inactive" | "blocked"
  customerGroup: string
  paymentTerms: string
  currency: string
}

interface SalesInquiry {
  id: string
  customerId: string
  customerName: string
  inquiryDate: string
  validUntil: string
  status: "open" | "quoted" | "lost" | "converted"
  totalValue: number
  currency: string
  items: number
  salesRep: string
  priority: "high" | "medium" | "low"
}

interface Quotation {
  id: string
  customerId: string
  customerName: string
  quotationDate: string
  validUntil: string
  status: "draft" | "sent" | "accepted" | "rejected" | "expired"
  totalValue: number
  currency: string
  items: number
  salesRep: string
  probability: number
}

interface SalesOrder {
  id: string
  customerId: string
  customerName: string
  orderDate: string
  deliveryDate: string
  status: "draft" | "confirmed" | "in_progress" | "delivered" | "invoiced" | "completed"
  totalValue: number
  currency: string
  items: number
  salesRep: string
  paymentStatus: "pending" | "partial" | "paid"
  availabilityStatus: "available" | "partial" | "unavailable"
  creditStatus: "approved" | "pending" | "rejected"
}

interface Delivery {
  id: string
  orderId: string
  customerName: string
  deliveryDate: string
  status: "planned" | "picked" | "packed" | "shipped" | "delivered"
  trackingNumber: string
  carrier: string
  items: number
  weight: number
  value: number
  address: string
}

interface Invoice {
  id: string
  orderId: string
  customerId: string
  customerName: string
  invoiceDate: string
  dueDate: string
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  totalAmount: number
  paidAmount: number
  currency: string
  paymentMethod: string
}

interface Return {
  id: string
  orderId: string
  customerId: string
  customerName: string
  returnDate: string
  status: "requested" | "authorized" | "received" | "processed" | "refunded"
  reason: string
  totalValue: number
  currency: string
  items: number
  refundAmount: number
}

const SalesDistribution = () => {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  // Mock data
  const dashboardMetrics = {
    totalRevenue: 2450000,
    monthlyGrowth: 12.5,
    activeOrders: 156,
    pendingQuotations: 23,
    deliveriesInTransit: 45,
    overdueInvoices: 8,
  }

  const customers: Customer[] = [
    {
      id: "CUST001",
      name: "John Smith",
      email: "john.smith@techcorp.com",
      phone: "+1-555-0123",
      company: "TechCorp Solutions",
      address: "123 Business Ave, New York, NY 10001",
      creditLimit: 100000,
      creditUsed: 45000,
      status: "active",
      customerGroup: "Enterprise",
      paymentTerms: "Net 30",
      currency: "USD",
    },
    {
      id: "CUST002",
      name: "Sarah Johnson",
      email: "sarah.j@retailplus.com",
      phone: "+1-555-0124",
      company: "Retail Plus Inc",
      address: "456 Commerce St, Los Angeles, CA 90210",
      creditLimit: 75000,
      creditUsed: 32000,
      status: "active",
      customerGroup: "Premium",
      paymentTerms: "Net 15",
      currency: "USD",
    },
    {
      id: "CUST003",
      name: "Michael Chen",
      email: "m.chen@globaltech.com",
      phone: "+1-555-0125",
      company: "Global Tech Ltd",
      address: "789 Innovation Blvd, San Francisco, CA 94105",
      creditLimit: 150000,
      creditUsed: 89000,
      status: "active",
      customerGroup: "Enterprise",
      paymentTerms: "Net 45",
      currency: "USD",
    },
  ]

  const inquiries: SalesInquiry[] = [
    {
      id: "INQ001",
      customerId: "CUST001",
      customerName: "TechCorp Solutions",
      inquiryDate: "2024-01-15",
      validUntil: "2024-02-15",
      status: "open",
      totalValue: 45000,
      currency: "USD",
      items: 5,
      salesRep: "Alice Johnson",
      priority: "high",
    },
    {
      id: "INQ002",
      customerId: "CUST002",
      customerName: "Retail Plus Inc",
      inquiryDate: "2024-01-14",
      validUntil: "2024-02-14",
      status: "quoted",
      totalValue: 32000,
      currency: "USD",
      items: 3,
      salesRep: "Bob Wilson",
      priority: "medium",
    },
  ]

  const quotations: Quotation[] = [
    {
      id: "QUO001",
      customerId: "CUST001",
      customerName: "TechCorp Solutions",
      quotationDate: "2024-01-16",
      validUntil: "2024-02-16",
      status: "sent",
      totalValue: 45000,
      currency: "USD",
      items: 5,
      salesRep: "Alice Johnson",
      probability: 75,
    },
    {
      id: "QUO002",
      customerId: "CUST003",
      customerName: "Global Tech Ltd",
      quotationDate: "2024-01-12",
      validUntil: "2024-02-12",
      status: "accepted",
      totalValue: 89000,
      currency: "USD",
      items: 8,
      salesRep: "Carol Davis",
      probability: 95,
    },
  ]

  const salesOrders: SalesOrder[] = [
    {
      id: "SO001",
      customerId: "CUST003",
      customerName: "Global Tech Ltd",
      orderDate: "2024-01-18",
      deliveryDate: "2024-02-18",
      status: "confirmed",
      totalValue: 89000,
      currency: "USD",
      items: 8,
      salesRep: "Carol Davis",
      paymentStatus: "pending",
      availabilityStatus: "available",
      creditStatus: "approved",
    },
    {
      id: "SO002",
      customerId: "CUST001",
      customerName: "TechCorp Solutions",
      orderDate: "2024-01-17",
      deliveryDate: "2024-02-17",
      status: "in_progress",
      totalValue: 45000,
      currency: "USD",
      items: 5,
      salesRep: "Alice Johnson",
      paymentStatus: "partial",
      availabilityStatus: "partial",
      creditStatus: "approved",
    },
  ]

  const deliveries: Delivery[] = [
    {
      id: "DEL001",
      orderId: "SO001",
      customerName: "Global Tech Ltd",
      deliveryDate: "2024-02-18",
      status: "shipped",
      trackingNumber: "TRK123456789",
      carrier: "FedEx",
      items: 8,
      weight: 125.5,
      value: 89000,
      address: "789 Innovation Blvd, San Francisco, CA 94105",
    },
    {
      id: "DEL002",
      orderId: "SO002",
      customerName: "TechCorp Solutions",
      deliveryDate: "2024-02-17",
      status: "packed",
      trackingNumber: "TRK987654321",
      carrier: "UPS",
      items: 5,
      weight: 78.2,
      value: 45000,
      address: "123 Business Ave, New York, NY 10001",
    },
  ]

  const invoices: Invoice[] = [
    {
      id: "INV001",
      orderId: "SO001",
      customerId: "CUST003",
      customerName: "Global Tech Ltd",
      invoiceDate: "2024-01-20",
      dueDate: "2024-03-05",
      status: "sent",
      totalAmount: 89000,
      paidAmount: 0,
      currency: "USD",
      paymentMethod: "Bank Transfer",
    },
    {
      id: "INV002",
      orderId: "SO002",
      customerId: "CUST001",
      customerName: "TechCorp Solutions",
      invoiceDate: "2024-01-19",
      dueDate: "2024-02-18",
      status: "paid",
      totalAmount: 45000,
      paidAmount: 45000,
      currency: "USD",
      paymentMethod: "Credit Card",
    },
  ]

  const returns: Return[] = [
    {
      id: "RET001",
      orderId: "SO001",
      customerId: "CUST003",
      customerName: "Global Tech Ltd",
      returnDate: "2024-01-25",
      status: "authorized",
      reason: "Defective item",
      totalValue: 5000,
      currency: "USD",
      items: 1,
      refundAmount: 5000,
    },
  ]

  const getStatusBadge = (status: string, type: string) => {
    const statusConfig: Record<string, Record<string, { color: string; labelKey: string }>> = {
      inquiry: {
        open: { color: "bg-blue-100 text-blue-700", labelKey: "sales.status.open" },
        quoted: { color: "bg-yellow-100 text-yellow-700", labelKey: "sales.status.quoted" },
        lost: { color: "bg-red-100 text-red-700", labelKey: "sales.status.lost" },
        converted: { color: "bg-green-100 text-green-700", labelKey: "sales.status.converted" },
      },
      quotation: {
        draft: { color: "bg-gray-100 text-gray-700", labelKey: "sales.status.draft" },
        sent: { color: "bg-blue-100 text-blue-700", labelKey: "sales.status.sent" },
        accepted: { color: "bg-green-100 text-green-700", labelKey: "sales.status.accepted" },
        rejected: { color: "bg-red-100 text-red-700", labelKey: "sales.status.rejected" },
        expired: { color: "bg-orange-100 text-orange-700", labelKey: "sales.status.expired" },
      },
      order: {
        draft: { color: "bg-gray-100 text-gray-700", labelKey: "sales.status.draft" },
        confirmed: { color: "bg-blue-100 text-blue-700", labelKey: "sales.status.confirmed" },
        in_progress: { color: "bg-yellow-100 text-yellow-700", labelKey: "sales.status.inProgress" },
        delivered: { color: "bg-green-100 text-green-700", labelKey: "sales.status.delivered" },
        invoiced: { color: "bg-purple-100 text-purple-700", labelKey: "sales.status.invoiced" },
        completed: { color: "bg-green-100 text-green-700", labelKey: "sales.status.completed" },
      },
      delivery: {
        planned: { color: "bg-gray-100 text-gray-700", labelKey: "sales.status.planned" },
        picked: { color: "bg-blue-100 text-blue-700", labelKey: "sales.status.picked" },
        packed: { color: "bg-yellow-100 text-yellow-700", labelKey: "sales.status.packed" },
        shipped: { color: "bg-purple-100 text-purple-700", labelKey: "sales.status.shipped" },
        delivered: { color: "bg-green-100 text-green-700", labelKey: "sales.status.delivered" },
      },
      invoice: {
        draft: { color: "bg-gray-100 text-gray-700", labelKey: "sales.status.draft" },
        sent: { color: "bg-blue-100 text-blue-700", labelKey: "sales.status.sent" },
        paid: { color: "bg-green-100 text-green-700", labelKey: "sales.status.paid" },
        overdue: { color: "bg-red-100 text-red-700", labelKey: "sales.status.overdue" },
        cancelled: { color: "bg-gray-100 text-gray-700", labelKey: "sales.status.cancelled" },
      },
      return: {
        requested: { color: "bg-yellow-100 text-yellow-700", labelKey: "sales.status.requested" },
        authorized: { color: "bg-blue-100 text-blue-700", labelKey: "sales.status.authorized" },
        received: { color: "bg-purple-100 text-purple-700", labelKey: "sales.status.received" },
        processed: { color: "bg-green-100 text-green-700", labelKey: "sales.status.processed" },
        refunded: { color: "bg-green-100 text-green-700", labelKey: "sales.status.refunded" },
      },
    }

    const config = statusConfig[type]?.[status] || {
      color: "bg-gray-100 text-gray-700",
      labelKey: "sales.status.unknown",
    }
    return <Badge className={`${config.color} border-0`}>{t(config.labelKey)}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-green-100 text-green-700",
    }
    return (
      <Badge className={`${colors[priority as keyof typeof colors]} border-0`}>{t(`sales.priority.${priority}`)}</Badge>
    )
  }

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("sales.title")}</h1>
          <p className="text-muted-foreground">{t("sales.description")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {t("common.export")}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t("sales.newOrder")}
              </Button>
            </DialogTrigger>
            <SalesOrderEntryForm />
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dashboard">{t("sales.tabs.dashboard")}</TabsTrigger>
          <TabsTrigger value="pipeline">{t("sales.tabs.pipeline")}</TabsTrigger>
          <TabsTrigger value="inquiries">{t("sales.tabs.inquiries")}</TabsTrigger>
          <TabsTrigger value="quotations">{t("sales.tabs.quotations")}</TabsTrigger>
          <TabsTrigger value="orders">{t("sales.tabs.orders")}</TabsTrigger>
          <TabsTrigger value="deliveries">{t("sales.tabs.deliveries")}</TabsTrigger>
          <TabsTrigger value="invoices">{t("sales.tabs.invoices")}</TabsTrigger>
          <TabsTrigger value="returns">{t("sales.tabs.returns")}</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("sales.metrics.totalRevenue")}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardMetrics.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{dashboardMetrics.monthlyGrowth}%</span>{" "}
                  {t("sales.metrics.fromLastMonth")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("sales.metrics.activeOrders")}</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardMetrics.activeOrders}</div>
                <p className="text-xs text-muted-foreground">{t("sales.metrics.ordersInProgress")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("sales.metrics.pendingQuotations")}</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardMetrics.pendingQuotations}</div>
                <p className="text-xs text-muted-foreground">{t("sales.metrics.awaitingResponse")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("sales.metrics.deliveriesInTransit")}</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardMetrics.deliveriesInTransit}</div>
                <p className="text-xs text-muted-foreground">{t("sales.metrics.currentlyShipping")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("sales.metrics.overdueInvoices")}</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{dashboardMetrics.overdueInvoices}</div>
                <p className="text-xs text-muted-foreground">{t("sales.metrics.requireAttention")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+{dashboardMetrics.monthlyGrowth}%</div>
                <p className="text-xs text-muted-foreground">Revenue growth rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest sales orders and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.totalValue)}</p>
                        {getStatusBadge(order.status, "order")}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>Customers by revenue contribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers.slice(0, 5).map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{customer.company}</p>
                        <p className="text-sm text-muted-foreground">{customer.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(customer.creditUsed)}</p>
                        <p className="text-sm text-muted-foreground">
                          {Math.round((customer.creditUsed / customer.creditLimit) * 100)}% credit used
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6">
          <SalesPipeline />
        </TabsContent>

        {/* Inquiries Tab */}
        <TabsContent value="inquiries" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{t("sales.inquiries.title")}</h2>
              <p className="text-muted-foreground">{t("sales.inquiries.description")}</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t("sales.inquiries.newInquiry")}
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t("sales.inquiries.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("sales.filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("sales.filters.allStatus")}</SelectItem>
                <SelectItem value="open">{t("sales.status.open")}</SelectItem>
                <SelectItem value="quoted">{t("sales.status.quoted")}</SelectItem>
                <SelectItem value="lost">{t("sales.status.lost")}</SelectItem>
                <SelectItem value="converted">{t("sales.status.converted")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inquiries Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("sales.columns.inquiryId")}</TableHead>
                    <TableHead>{t("sales.columns.customer")}</TableHead>
                    <TableHead>{t("sales.columns.date")}</TableHead>
                    <TableHead>{t("sales.columns.validUntil")}</TableHead>
                    <TableHead>{t("sales.columns.value")}</TableHead>
                    <TableHead>{t("sales.columns.items")}</TableHead>
                    <TableHead>{t("sales.columns.priority")}</TableHead>
                    <TableHead>{t("sales.columns.status")}</TableHead>
                    <TableHead>{t("sales.columns.salesRep")}</TableHead>
                    <TableHead>{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell className="font-medium">{inquiry.id}</TableCell>
                      <TableCell>{inquiry.customerName}</TableCell>
                      <TableCell>{formatDate(inquiry.inquiryDate)}</TableCell>
                      <TableCell>{formatDate(inquiry.validUntil)}</TableCell>
                      <TableCell>{formatCurrency(inquiry.totalValue)}</TableCell>
                      <TableCell>{inquiry.items}</TableCell>
                      <TableCell>{getPriorityBadge(inquiry.priority)}</TableCell>
                      <TableCell>{getStatusBadge(inquiry.status, "inquiry")}</TableCell>
                      <TableCell>{inquiry.salesRep}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              {t("common.view")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              {t("common.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              {t("sales.createQuotation")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quotations Tab */}
        <TabsContent value="quotations" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{t("sales.quotations.title")}</h2>
              <p className="text-muted-foreground">{t("sales.quotations.description")}</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t("sales.quotations.newQuotation")}
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t("sales.quotations.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("sales.filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("sales.filters.allStatus")}</SelectItem>
                <SelectItem value="draft">{t("sales.status.draft")}</SelectItem>
                <SelectItem value="sent">{t("sales.status.sent")}</SelectItem>
                <SelectItem value="accepted">{t("sales.status.accepted")}</SelectItem>
                <SelectItem value="rejected">{t("sales.status.rejected")}</SelectItem>
                <SelectItem value="expired">{t("sales.status.expired")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quotations Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("sales.columns.quoteId")}</TableHead>
                    <TableHead>{t("sales.columns.customer")}</TableHead>
                    <TableHead>{t("sales.columns.date")}</TableHead>
                    <TableHead>{t("sales.columns.validUntil")}</TableHead>
                    <TableHead>{t("sales.columns.value")}</TableHead>
                    <TableHead>{t("sales.columns.items")}</TableHead>
                    <TableHead>{t("sales.columns.salesRep")}</TableHead>
                    <TableHead>{t("sales.columns.probability")}</TableHead>
                    <TableHead>{t("sales.columns.status")}</TableHead>
                    <TableHead>{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotations.map((quotation) => (
                    <TableRow key={quotation.id}>
                      <TableCell className="font-medium">{quotation.id}</TableCell>
                      <TableCell>{quotation.customerName}</TableCell>
                      <TableCell>{formatDate(quotation.quotationDate)}</TableCell>
                      <TableCell>{formatDate(quotation.validUntil)}</TableCell>
                      <TableCell>{formatCurrency(quotation.totalValue)}</TableCell>
                      <TableCell>{quotation.items}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${quotation.probability}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{quotation.probability}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(quotation.status, "quotation")}</TableCell>
                      <TableCell>{quotation.salesRep}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              {t("common.view")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              {t("common.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              {t("sales.convertToOrder")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{t("sales.orders.title")}</h2>
              <p className="text-muted-foreground">{t("sales.orders.description")}</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  {t("sales.orders.newOrder")}
                </Button>
              </DialogTrigger>
              <SalesOrderEntryForm />
            </Dialog>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t("sales.orders.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("sales.filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("sales.filters.allStatus")}</SelectItem>
                <SelectItem value="draft">{t("sales.status.draft")}</SelectItem>
                <SelectItem value="confirmed">{t("sales.status.confirmed")}</SelectItem>
                <SelectItem value="in_progress">{t("sales.status.inProgress")}</SelectItem>
                <SelectItem value="delivered">{t("sales.status.delivered")}</SelectItem>
                <SelectItem value="invoiced">{t("sales.status.invoiced")}</SelectItem>
                <SelectItem value="completed">{t("sales.status.completed")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("sales.columns.orderId")}</TableHead>
                    <TableHead>{t("sales.columns.customer")}</TableHead>
                    <TableHead>{t("sales.columns.orderDate")}</TableHead>
                    <TableHead>{t("sales.columns.deliveryDate")}</TableHead>
                    <TableHead>{t("sales.columns.value")}</TableHead>
                    <TableHead>{t("sales.columns.items")}</TableHead>
                    <TableHead>{t("sales.columns.salesRep")}</TableHead>
                    <TableHead>{t("sales.columns.paymentStatus")}</TableHead>
                    <TableHead>{t("sales.columns.availability")}</TableHead>
                    <TableHead>{t("sales.columns.status")}</TableHead>
                    <TableHead>{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{formatDate(order.orderDate)}</TableCell>
                      <TableCell>{formatDate(order.deliveryDate)}</TableCell>
                      <TableCell>{formatCurrency(order.totalValue)}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>{order.salesRep}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : order.paymentStatus === "partial"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }
                        >
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            order.availabilityStatus === "available"
                              ? "bg-green-100 text-green-700"
                              : order.availabilityStatus === "partial"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }
                        >
                          {order.availabilityStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status, "order")}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              {t("common.view")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              {t("common.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Truck className="mr-2 h-4 w-4" />
                              {t("sales.createDelivery")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Generate Invoice
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deliveries Tab */}
        <TabsContent value="deliveries" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{t("sales.deliveries.title")}</h2>
              <p className="text-muted-foreground">{t("sales.deliveries.description")}</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t("sales.deliveries.newDelivery")}
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t("sales.deliveries.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("sales.filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("sales.filters.allStatus")}</SelectItem>
                <SelectItem value="planned">{t("sales.status.planned")}</SelectItem>
                <SelectItem value="picked">{t("sales.status.picked")}</SelectItem>
                <SelectItem value="packed">{t("sales.status.packed")}</SelectItem>
                <SelectItem value="shipped">{t("sales.status.shipped")}</SelectItem>
                <SelectItem value="delivered">{t("sales.status.delivered")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Deliveries Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("sales.columns.deliveryId")}</TableHead>
                    <TableHead>{t("sales.columns.orderId")}</TableHead>
                    <TableHead>{t("sales.columns.customer")}</TableHead>
                    <TableHead>{t("sales.columns.plannedDate")}</TableHead>
                    <TableHead>{t("sales.columns.actualDate")}</TableHead>
                    <TableHead>{t("sales.columns.carrier")}</TableHead>
                    <TableHead>{t("sales.columns.trackingNumber")}</TableHead>
                    <TableHead>{t("sales.columns.status")}</TableHead>
                    <TableHead>{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.id}</TableCell>
                      <TableCell>{delivery.orderId}</TableCell>
                      <TableCell>{delivery.customerName}</TableCell>
                      <TableCell>{formatDate(delivery.deliveryDate)}</TableCell>
                      <TableCell>{delivery.deliveryDate ? formatDate(delivery.deliveryDate) : "-"}</TableCell>
                      <TableCell>{delivery.carrier}</TableCell>
                      <TableCell>{delivery.trackingNumber}</TableCell>
                      <TableCell>{getStatusBadge(delivery.status, "delivery")}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              {t("common.view")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              {t("common.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Truck className="mr-2 h-4 w-4" />
                              {t("sales.trackDelivery")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{t("sales.invoices.title")}</h2>
              <p className="text-muted-foreground">{t("sales.invoices.description")}</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t("sales.invoices.newInvoice")}
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t("sales.invoices.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("sales.filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("sales.filters.allStatus")}</SelectItem>
                <SelectItem value="draft">{t("sales.status.draft")}</SelectItem>
                <SelectItem value="sent">{t("sales.status.sent")}</SelectItem>
                <SelectItem value="paid">{t("sales.status.paid")}</SelectItem>
                <SelectItem value="overdue">{t("sales.status.overdue")}</SelectItem>
                <SelectItem value="cancelled">{t("sales.status.cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Invoices Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("sales.columns.invoiceId")}</TableHead>
                    <TableHead>{t("sales.columns.orderId")}</TableHead>
                    <TableHead>{t("sales.columns.customer")}</TableHead>
                    <TableHead>{t("sales.columns.invoiceDate")}</TableHead>
                    <TableHead>{t("sales.columns.dueDate")}</TableHead>
                    <TableHead>{t("sales.columns.amount")}</TableHead>
                    <TableHead>{t("sales.columns.paidAmount")}</TableHead>
                    <TableHead>{t("sales.columns.status")}</TableHead>
                    <TableHead>{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.orderId}</TableCell>
                      <TableCell>{invoice.customerName}</TableCell>
                      <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                      <TableCell>{formatCurrency(invoice.paidAmount)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status, "invoice")}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              {t("common.view")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              {t("common.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              {t("sales.downloadPdf")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Returns Tab */}
        <TabsContent value="returns" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{t("sales.returns.title")}</h2>
              <p className="text-muted-foreground">{t("sales.returns.description")}</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t("sales.returns.processReturn")}
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t("sales.returns.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("sales.filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("sales.filters.allStatus")}</SelectItem>
                <SelectItem value="requested">{t("sales.status.requested")}</SelectItem>
                <SelectItem value="authorized">{t("sales.status.authorized")}</SelectItem>
                <SelectItem value="received">{t("sales.status.received")}</SelectItem>
                <SelectItem value="processed">{t("sales.status.processed")}</SelectItem>
                <SelectItem value="refunded">{t("sales.status.refunded")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Returns Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("sales.columns.returnId")}</TableHead>
                    <TableHead>{t("sales.columns.orderId")}</TableHead>
                    <TableHead>{t("sales.columns.customer")}</TableHead>
                    <TableHead>{t("sales.columns.requestDate")}</TableHead>
                    <TableHead>{t("sales.columns.reason")}</TableHead>
                    <TableHead>{t("sales.columns.returnValue")}</TableHead>
                    <TableHead>{t("sales.columns.refundAmount")}</TableHead>
                    <TableHead>{t("sales.columns.status")}</TableHead>
                    <TableHead>{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {returns.map((returnItem) => (
                    <TableRow key={returnItem.id}>
                      <TableCell className="font-medium">{returnItem.id}</TableCell>
                      <TableCell>{returnItem.orderId}</TableCell>
                      <TableCell>{returnItem.customerName}</TableCell>
                      <TableCell>{formatDate(returnItem.returnDate)}</TableCell>
                      <TableCell>{returnItem.reason}</TableCell>
                      <TableCell>{formatCurrency(returnItem.totalValue)}</TableCell>
                      <TableCell>{formatCurrency(returnItem.refundAmount)}</TableCell>
                      <TableCell>{getStatusBadge(returnItem.status, "return")}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              {t("common.view")}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {t("sales.approveReturn")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SalesDistribution
