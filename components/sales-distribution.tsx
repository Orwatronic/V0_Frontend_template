"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DollarSign, ShoppingCart, TrendingUp, Users, Package, Truck, FileText, RotateCcw, Search, Filter, Download, Plus, Edit, Eye, MoreHorizontal, CheckCircle, Clock, AlertCircle, XCircle, Star, Calendar, CreditCard, MapPin, Phone, Mail, Building } from 'lucide-react'
import SalesPipeline from "./sales-pipeline"
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SalesOrderEntryForm } from "./sales-order-entry-form"

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
    const statusConfig: Record<string, Record<string, { color: string; label: string }>> = {
      inquiry: {
        open: { color: "bg-blue-100 text-blue-700", label: "Open" },
        quoted: { color: "bg-yellow-100 text-yellow-700", label: "Quoted" },
        lost: { color: "bg-red-100 text-red-700", label: "Lost" },
        converted: { color: "bg-green-100 text-green-700", label: "Converted" },
      },
      quotation: {
        draft: { color: "bg-gray-100 text-gray-700", label: "Draft" },
        sent: { color: "bg-blue-100 text-blue-700", label: "Sent" },
        accepted: { color: "bg-green-100 text-green-700", label: "Accepted" },
        rejected: { color: "bg-red-100 text-red-700", label: "Rejected" },
        expired: { color: "bg-orange-100 text-orange-700", label: "Expired" },
      },
      order: {
        draft: { color: "bg-gray-100 text-gray-700", label: "Draft" },
        confirmed: { color: "bg-blue-100 text-blue-700", label: "Confirmed" },
        in_progress: { color: "bg-yellow-100 text-yellow-700", label: "In Progress" },
        delivered: { color: "bg-green-100 text-green-700", label: "Delivered" },
        invoiced: { color: "bg-purple-100 text-purple-700", label: "Invoiced" },
        completed: { color: "bg-green-100 text-green-700", label: "Completed" },
      },
      delivery: {
        planned: { color: "bg-gray-100 text-gray-700", label: "Planned" },
        picked: { color: "bg-blue-100 text-blue-700", label: "Picked" },
        packed: { color: "bg-yellow-100 text-yellow-700", label: "Packed" },
        shipped: { color: "bg-purple-100 text-purple-700", label: "Shipped" },
        delivered: { color: "bg-green-100 text-green-700", label: "Delivered" },
      },
      invoice: {
        draft: { color: "bg-gray-100 text-gray-700", label: "Draft" },
        sent: { color: "bg-blue-100 text-blue-700", label: "Sent" },
        paid: { color: "bg-green-100 text-green-700", label: "Paid" },
        overdue: { color: "bg-red-100 text-red-700", label: "Overdue" },
        cancelled: { color: "bg-gray-100 text-gray-700", label: "Cancelled" },
      },
      return: {
        requested: { color: "bg-yellow-100 text-yellow-700", label: "Requested" },
        authorized: { color: "bg-blue-100 text-blue-700", label: "Authorized" },
        received: { color: "bg-purple-100 text-purple-700", label: "Received" },
        processed: { color: "bg-green-100 text-green-700", label: "Processed" },
        refunded: { color: "bg-green-100 text-green-700", label: "Refunded" },
      },
    }

    const config = statusConfig[type]?.[status] || { color: "bg-gray-100 text-gray-700", label: status }
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-green-100 text-green-700",
    }
    return (
      <Badge className={`${colors[priority as keyof typeof colors]} border-0`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  const formatCurrency = (amount: number, currency: string = "USD") => {
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
          <h1 className="text-3xl font-bold text-foreground">Sales & Distribution</h1>
          <p className="text-muted-foreground">
            Manage the complete sales lifecycle from inquiry to delivery and returns
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
            </DialogTrigger>
            <SalesOrderEntryForm />
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          <TabsTrigger value="quotations">Quotations</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardMetrics.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+{dashboardMetrics.monthlyGrowth}%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardMetrics.activeOrders}</div>
                <p className="text-xs text-muted-foreground">Orders in progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Quotations</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardMetrics.pendingQuotations}</div>
                <p className="text-xs text-muted-foreground">Awaiting customer response</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Deliveries in Transit</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardMetrics.deliveriesInTransit}</div>
                <p className="text-xs text-muted-foreground">Currently shipping</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{dashboardMetrics.overdueInvoices}</div>
                <p className="text-xs text-muted-foreground">Require immediate attention</p>
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
              <h2 className="text-2xl font-bold">Sales Inquiries</h2>
              <p className="text-muted-foreground">Manage customer inquiries and convert to quotations</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Inquiry
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inquiries Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inquiry ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sales Rep</TableHead>
                    <TableHead>Actions</TableHead>
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
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Inquiry
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Create Quotation
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
              <h2 className="text-2xl font-bold">Sales Quotations</h2>
              <p className="text-muted-foreground">Manage quotations and convert to sales orders</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Quotation
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search quotations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quotations Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sales Rep</TableHead>
                    <TableHead>Actions</TableHead>
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
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Quotation
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Convert to Order
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
              <h2 className="text-2xl font-bold">Sales Orders</h2>
              <p className="text-muted-foreground">Manage sales orders with availability and credit checks</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Order
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
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Credit</TableHead>
                    <TableHead>Actions</TableHead>
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
                      <TableCell>{getStatusBadge(order.status, "order")}</TableCell>
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
                      <TableCell>
                        <Badge
                          className={
                            order.creditStatus === "approved"
                              ? "bg-green-100 text-green-700"
                              : order.creditStatus === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          {order.creditStatus}
                        </Badge>
                      </TableCell>
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
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Order
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Truck className="mr-2 h-4 w-4" />
                              Create Delivery
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
              <h2 className="text-2xl font-bold">Deliveries & Shipping</h2>
              <p className="text-muted-foreground">Track deliveries from picking to customer receipt</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Delivery
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search deliveries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="picked">Picked</SelectItem>
                <SelectItem value="packed">Packed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Deliveries Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Delivery ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tracking</TableHead>
                    <TableHead>Carrier</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.id}</TableCell>
                      <TableCell>{delivery.orderId}</TableCell>
                      <TableCell>{delivery.customerName}</TableCell>
                      <TableCell>{formatDate(delivery.deliveryDate)}</TableCell>
                      <TableCell>{getStatusBadge(delivery.status, "delivery")}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-2" />
                          {delivery.trackingNumber}
                        </div>
                      </TableCell>
                      <TableCell>{delivery.carrier}</TableCell>
                      <TableCell>{delivery.items}</TableCell>
                      <TableCell>{delivery.weight} kg</TableCell>
                      <TableCell>{formatCurrency(delivery.value)}</TableCell>
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
                              Track Shipment
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MapPin className="mr-2 h-4 w-4" />
                              View Route
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
              <h2 className="text-2xl font-bold">Billing & Invoices</h2>
              <p className="text-muted-foreground">Manage invoicing and payment tracking</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Invoices Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Invoice Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Paid Amount</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Actions</TableHead>
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
                      <TableCell>
                        <span
                          className={
                            invoice.totalAmount - invoice.paidAmount === 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {formatCurrency(invoice.totalAmount - invoice.paidAmount)}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status, "invoice")}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          {invoice.paymentMethod}
                        </div>
                      </TableCell>
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
                              View Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send to Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <DollarSign className="mr-2 h-4 w-4" />
                              Record Payment
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
              <h2 className="text-2xl font-bold">Returns Management</h2>
              <p className="text-muted-foreground">Process customer returns and refunds</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Process Return
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search returns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="requested">Requested</SelectItem>
                <SelectItem value="authorized">Authorized</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Returns Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Return ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Return Value</TableHead>
                    <TableHead>Refund Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
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
                      <TableCell>{returnItem.items}</TableCell>
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
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Authorize Return
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="mr-2 h-4 w-4" />
                              Goods Receipt
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <DollarSign className="mr-2 h-4 w-4" />
                              Process Refund
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
