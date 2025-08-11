"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShoppingCart, Package, Truck, FileText, DollarSign, CheckCircle, Clock, AlertCircle, ArrowRight, Eye, Edit, MoreHorizontal, Search, Filter, Download, Plus, PlayCircle, PauseCircle, RefreshCw, TrendingUp, Users, Calendar, MapPin } from 'lucide-react'

// Workflow stage definitions
interface WorkflowStage {
  id: string
  name: string
  description: string
  icon: any
  color: string
  status: "completed" | "active" | "pending" | "blocked"
  estimatedDuration: number
  actualDuration?: number
}

interface OrderWorkflow {
  id: string
  orderId: string
  customerName: string
  orderValue: number
  currency: string
  priority: "high" | "medium" | "low"
  currentStage: string
  overallStatus: "on_track" | "delayed" | "at_risk" | "completed"
  startDate: string
  expectedCompletionDate: string
  actualCompletionDate?: string
  stages: WorkflowStage[]
  totalProgress: number
}

interface WorkflowMetrics {
  totalOrders: number
  completedOrders: number
  avgCycleTime: number
  onTimeDelivery: number
  revenueInPipeline: number
  bottleneckStage: string
}

const OrderToCashWorkflow = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [workflows, setWorkflows] = useState<OrderWorkflow[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<OrderWorkflow | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [metrics, setMetrics] = useState<WorkflowMetrics | null>(null)

  // Mock data initialization
  useEffect(() => {
    // CURSOR: API call to GET /api/v1/workflows/order-to-cash
    const mockWorkflows: OrderWorkflow[] = [
      {
        id: "WF001",
        orderId: "SO001",
        customerName: "TechCorp Solutions",
        orderValue: 89000,
        currency: "USD",
        priority: "high",
        currentStage: "delivery",
        overallStatus: "on_track",
        startDate: "2024-01-18T08:00:00Z",
        expectedCompletionDate: "2024-02-18T17:00:00Z",
        totalProgress: 75,
        stages: [
          {
            id: "order_creation",
            name: "Order Creation",
            description: "Sales order created and validated",
            icon: ShoppingCart,
            color: "bg-green-100 text-green-700",
            status: "completed",
            estimatedDuration: 1,
            actualDuration: 0.5,
          },
          {
            id: "order_processing",
            name: "Order Processing",
            description: "Credit check, availability check, and approval",
            icon: FileText,
            color: "bg-green-100 text-green-700",
            status: "completed",
            estimatedDuration: 2,
            actualDuration: 1.8,
          },
          {
            id: "fulfillment",
            name: "Fulfillment",
            description: "Pick, pack, and prepare for shipment",
            icon: Package,
            color: "bg-green-100 text-green-700",
            status: "completed",
            estimatedDuration: 5,
            actualDuration: 4.2,
          },
          {
            id: "delivery",
            name: "Delivery",
            description: "Shipment and delivery to customer",
            icon: Truck,
            color: "bg-blue-100 text-blue-700",
            status: "active",
            estimatedDuration: 7,
            actualDuration: 5.5,
          },
          {
            id: "invoicing",
            name: "Invoicing",
            description: "Generate and send customer invoice",
            icon: FileText,
            color: "bg-gray-100 text-gray-700",
            status: "pending",
            estimatedDuration: 1,
          },
          {
            id: "payment",
            name: "Payment",
            description: "Receive and process customer payment",
            icon: DollarSign,
            color: "bg-gray-100 text-gray-700",
            status: "pending",
            estimatedDuration: 15,
          },
        ],
      },
      {
        id: "WF002",
        orderId: "SO002",
        customerName: "Global Manufacturing",
        orderValue: 45000,
        currency: "USD",
        priority: "medium",
        currentStage: "invoicing",
        overallStatus: "delayed",
        startDate: "2024-01-17T10:00:00Z",
        expectedCompletionDate: "2024-02-17T17:00:00Z",
        totalProgress: 85,
        stages: [
          {
            id: "order_creation",
            name: "Order Creation",
            description: "Sales order created and validated",
            icon: ShoppingCart,
            color: "bg-green-100 text-green-700",
            status: "completed",
            estimatedDuration: 1,
            actualDuration: 1.2,
          },
          {
            id: "order_processing",
            name: "Order Processing",
            description: "Credit check, availability check, and approval",
            icon: FileText,
            color: "bg-green-100 text-green-700",
            status: "completed",
            estimatedDuration: 2,
            actualDuration: 3.5,
          },
          {
            id: "fulfillment",
            name: "Fulfillment",
            description: "Pick, pack, and prepare for shipment",
            icon: Package,
            color: "bg-green-100 text-green-700",
            status: "completed",
            estimatedDuration: 5,
            actualDuration: 6.8,
          },
          {
            id: "delivery",
            name: "Delivery",
            description: "Shipment and delivery to customer",
            icon: Truck,
            color: "bg-green-100 text-green-700",
            status: "completed",
            estimatedDuration: 7,
            actualDuration: 8.2,
          },
          {
            id: "invoicing",
            name: "Invoicing",
            description: "Generate and send customer invoice",
            icon: FileText,
            color: "bg-yellow-100 text-yellow-700",
            status: "active",
            estimatedDuration: 1,
            actualDuration: 2.1,
          },
          {
            id: "payment",
            name: "Payment",
            description: "Receive and process customer payment",
            icon: DollarSign,
            color: "bg-gray-100 text-gray-700",
            status: "pending",
            estimatedDuration: 15,
          },
        ],
      },
      {
        id: "WF003",
        orderId: "SO003",
        customerName: "Retail Plus Inc",
        orderValue: 32000,
        currency: "USD",
        priority: "low",
        currentStage: "order_processing",
        overallStatus: "at_risk",
        startDate: "2024-01-19T14:00:00Z",
        expectedCompletionDate: "2024-02-19T17:00:00Z",
        totalProgress: 25,
        stages: [
          {
            id: "order_creation",
            name: "Order Creation",
            description: "Sales order created and validated",
            icon: ShoppingCart,
            color: "bg-green-100 text-green-700",
            status: "completed",
            estimatedDuration: 1,
            actualDuration: 0.8,
          },
          {
            id: "order_processing",
            name: "Order Processing",
            description: "Credit check, availability check, and approval",
            icon: FileText,
            color: "bg-red-100 text-red-700",
            status: "blocked",
            estimatedDuration: 2,
            actualDuration: 4.5,
          },
          {
            id: "fulfillment",
            name: "Fulfillment",
            description: "Pick, pack, and prepare for shipment",
            icon: Package,
            color: "bg-gray-100 text-gray-700",
            status: "pending",
            estimatedDuration: 5,
          },
          {
            id: "delivery",
            name: "Delivery",
            description: "Shipment and delivery to customer",
            icon: Truck,
            color: "bg-gray-100 text-gray-700",
            status: "pending",
            estimatedDuration: 7,
          },
          {
            id: "invoicing",
            name: "Invoicing",
            description: "Generate and send customer invoice",
            icon: FileText,
            color: "bg-gray-100 text-gray-700",
            status: "pending",
            estimatedDuration: 1,
          },
          {
            id: "payment",
            name: "Payment",
            description: "Receive and process customer payment",
            icon: DollarSign,
            color: "bg-gray-100 text-gray-700",
            status: "pending",
            estimatedDuration: 15,
          },
        ],
      },
    ]

    // CURSOR: API call to GET /api/v1/workflows/order-to-cash/metrics
    const mockMetrics: WorkflowMetrics = {
      totalOrders: 156,
      completedOrders: 142,
      avgCycleTime: 28.5,
      onTimeDelivery: 94.2,
      revenueInPipeline: 2450000,
      bottleneckStage: "order_processing",
    }

    setWorkflows(mockWorkflows)
    setMetrics(mockMetrics)
  }, [])

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || workflow.overallStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      on_track: { color: "bg-green-100 text-green-700", label: "On Track" },
      delayed: { color: "bg-yellow-100 text-yellow-700", label: "Delayed" },
      at_risk: { color: "bg-red-100 text-red-700", label: "At Risk" },
      completed: { color: "bg-gray-100 text-gray-700", label: "Completed" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { color: "bg-gray-100", label: status }
    return <Badge className={`${config.color} border-0`}>{config.label}</Badge>
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

  const getStageStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "active":
        return <PlayCircle className="w-4 h-4 text-blue-500" />
      case "blocked":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
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

  const handleAdvanceStage = (workflowId: string) => {
    // CURSOR: API call to POST /api/v1/workflows/order-to-cash/{workflowId}/advance
    console.log("Advancing workflow stage:", workflowId)
  }

  const handleResolveBlockage = (workflowId: string, stageId: string) => {
    // CURSOR: API call to POST /api/v1/workflows/order-to-cash/{workflowId}/stages/{stageId}/resolve
    console.log("Resolving blockage for workflow:", workflowId, "stage:", stageId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order-to-Cash Workflow</h1>
          <p className="text-muted-foreground">
            Track and manage the complete order fulfillment process from order to payment
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
          <TabsTrigger value="bottlenecks">Bottleneck Analysis</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {metrics.completedOrders} completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Cycle Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.avgCycleTime} days</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">-2.1 days</span> improvement
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">On-time Delivery</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.onTimeDelivery}%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+1.8%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue Pipeline</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(metrics.revenueInPipeline)}</div>
                  <p className="text-xs text-muted-foreground">In active workflows</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bottleneck Stage</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Processing</div>
                  <p className="text-xs text-muted-foreground">Avg delay: 2.3 days</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Workflow Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Workflows</CardTitle>
                <CardDescription>Latest order-to-cash workflows and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflows.slice(0, 5).map((workflow) => (
                    <div key={workflow.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{workflow.orderId}</p>
                        <p className="text-sm text-muted-foreground">{workflow.customerName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(workflow.overallStatus)}
                          <span className="text-xs text-muted-foreground">
                            {workflow.stages.find(s => s.status === "active")?.name || "Completed"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(workflow.orderValue)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={workflow.totalProgress} className="w-16" />
                          <span className="text-xs text-muted-foreground">{workflow.totalProgress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stage Performance</CardTitle>
                <CardDescription>Average time spent in each workflow stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Order Creation", avgTime: 0.8, target: 1.0, status: "good" },
                    { name: "Order Processing", avgTime: 2.8, target: 2.0, status: "warning" },
                    { name: "Fulfillment", avgTime: 5.2, target: 5.0, status: "good" },
                    { name: "Delivery", avgTime: 7.1, target: 7.0, status: "good" },
                    { name: "Invoicing", avgTime: 1.5, target: 1.0, status: "warning" },
                    { name: "Payment", avgTime: 14.2, target: 15.0, status: "good" },
                  ].map((stage) => (
                    <div key={stage.name} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{stage.name}</p>
                        <p className="text-xs text-muted-foreground">Target: {stage.target} days</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{stage.avgTime} days</span>
                        <div className={`w-2 h-2 rounded-full ${
                          stage.status === "good" ? "bg-green-500" : "bg-yellow-500"
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Active Workflows Tab */}
        <TabsContent value="workflows" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Active Workflows</h2>
              <p className="text-muted-foreground">Monitor and manage ongoing order-to-cash processes</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="on_track">On Track</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="at_risk">At Risk</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Workflows Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Current Stage</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expected Completion</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkflows.map((workflow) => (
                    <TableRow key={workflow.id}>
                      <TableCell className="font-medium">{workflow.orderId}</TableCell>
                      <TableCell>{workflow.customerName}</TableCell>
                      <TableCell>{formatCurrency(workflow.orderValue)}</TableCell>
                      <TableCell>{getPriorityBadge(workflow.priority)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStageStatusIcon(workflow.stages.find(s => s.id === workflow.currentStage)?.status || "pending")}
                          <span className="text-sm">
                            {workflow.stages.find(s => s.id === workflow.currentStage)?.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={workflow.totalProgress} className="w-16" />
                          <span className="text-sm text-muted-foreground">{workflow.totalProgress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(workflow.overallStatus)}</TableCell>
                      <TableCell>{formatDate(workflow.expectedCompletionDate)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedWorkflow(workflow)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAdvanceStage(workflow.id)}>
                              <PlayCircle className="mr-2 h-4 w-4" />
                              Advance Stage
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Workflow
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

        {/* Bottleneck Analysis Tab */}
        <TabsContent value="bottlenecks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stage Bottlenecks</CardTitle>
                <CardDescription>Identify stages causing delays in the workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { stage: "Order Processing", avgDelay: 2.3, impact: "high", orders: 12 },
                    { stage: "Invoicing", avgDelay: 1.8, impact: "medium", orders: 8 },
                    { stage: "Fulfillment", avgDelay: 0.9, impact: "low", orders: 4 },
                    { stage: "Delivery", avgDelay: 0.5, impact: "low", orders: 2 },
                  ].map((bottleneck) => (
                    <div key={bottleneck.stage} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{bottleneck.stage}</p>
                        <p className="text-sm text-muted-foreground">
                          {bottleneck.orders} orders affected
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{bottleneck.avgDelay} days delay</p>
                        <Badge className={
                          bottleneck.impact === "high" ? "bg-red-100 text-red-700" :
                          bottleneck.impact === "medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }>
                          {bottleneck.impact} impact
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resolution Actions</CardTitle>
                <CardDescription>Recommended actions to resolve bottlenecks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "Automate credit checks",
                      stage: "Order Processing",
                      impact: "Reduce processing time by 40%",
                      priority: "high"
                    },
                    {
                      action: "Implement batch invoicing",
                      stage: "Invoicing",
                      impact: "Reduce invoicing time by 60%",
                      priority: "medium"
                    },
                    {
                      action: "Optimize pick routes",
                      stage: "Fulfillment",
                      impact: "Reduce fulfillment time by 15%",
                      priority: "low"
                    },
                  ].map((action, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">{action.action}</p>
                        <Badge className={
                          action.priority === "high" ? "bg-red-100 text-red-700" :
                          action.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }>
                          {action.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Stage: {action.stage}</p>
                      <p className="text-sm text-green-600">{action.impact}</p>
                      <Button size="sm" className="mt-2">
                        Implement
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Workflow Efficiency</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.3%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+3.2%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.6/5</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+0.2</span> improvement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue Velocity</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$85K/day</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> increase
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Process Automation</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">73%</div>
                <p className="text-xs text-muted-foreground">
                  Automated stages
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cycle Time Trends</CardTitle>
                <CardDescription>Average order-to-cash cycle time over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Cycle time trend chart would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stage Performance</CardTitle>
                <CardDescription>Time spent in each workflow stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Stage performance chart would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Workflow Details Dialog */}
      {selectedWorkflow && (
        <Dialog open={!!selectedWorkflow} onOpenChange={() => setSelectedWorkflow(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Workflow Details - {selectedWorkflow.orderId}</DialogTitle>
              <DialogDescription>
                Complete order-to-cash workflow visualization and management
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Workflow Header */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer:</span>
                      <span>{selectedWorkflow.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Value:</span>
                      <span>{formatCurrency(selectedWorkflow.orderValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      {getPriorityBadge(selectedWorkflow.priority)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      {getStatusBadge(selectedWorkflow.overallStatus)}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Start Date:</span>
                      <span>{formatDate(selectedWorkflow.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected Completion:</span>
                      <span>{formatDate(selectedWorkflow.expectedCompletionDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Progress:</span>
                      <span>{selectedWorkflow.totalProgress}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow Stages */}
              <div>
                <h4 className="font-medium mb-4">Workflow Stages</h4>
                <div className="space-y-3">
                  {selectedWorkflow.stages.map((stage, index) => (
                    <div key={stage.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${stage.color}`}>
                          <stage.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">{stage.name}</p>
                          <p className="text-sm text-muted-foreground">{stage.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex-1" />
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {getStageStatusIcon(stage.status)}
                          <Badge className={stage.color}>
                            {stage.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {stage.actualDuration ? 
                            `${stage.actualDuration} days` : 
                            `Est. ${stage.estimatedDuration} days`
                          }
                        </p>
                      </div>
                      
                      {index < selectedWorkflow.stages.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedWorkflow(null)}>
                Close
              </Button>
              <Button onClick={() => handleAdvanceStage(selectedWorkflow.id)}>
                <PlayCircle className="w-4 h-4 mr-2" />
                Advance Stage
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default OrderToCashWorkflow
