"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, TrendingUp, Users, Building, Plus, Search, Filter, Eye, Edit, MoreHorizontal, CheckCircle, Clock, AlertCircle, ArrowUpRight, ArrowDownRight, Calendar, Trophy, Award, Zap, BarChart3, PieChart, Activity, RefreshCw, Download, Upload, FileText, Target, Briefcase, UserCheck, Star, ThumbsUp, ThumbsDown, Send, Save, History, Calculator, PiggyBank, CreditCard, Percent, TrendingDown } from 'lucide-react'
import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"

// Mock translation function
const useTranslation = () => {
  return {
    t: (key: string) => {
      const translations: Record<string, string> = {
        "compensation.title": "Compensation Review Workflow",
        "compensation.description": "Manage salary reviews, budget tracking, and approval processes",
        "compensation.tabs.dashboard": "Dashboard",
        "compensation.tabs.reviews": "Active Reviews",
        "compensation.tabs.budget": "Budget Planning",
        "compensation.tabs.approvals": "Approvals",
        "compensation.tabs.analytics": "Analytics",
        "compensation.tabs.history": "History",
        "compensation.metrics.totalBudget": "Total Budget",
        "compensation.metrics.budgetUsed": "Budget Used",
        "compensation.metrics.avgIncrease": "Avg Increase",
        "compensation.metrics.pendingReviews": "Pending Reviews",
        "compensation.metrics.completedReviews": "Completed Reviews",
        "compensation.metrics.approvalsPending": "Approvals Pending",
        "common.search": "Search...",
        "common.filter": "Filter",
        "common.add": "Add New",
        "common.export": "Export",
        "common.refresh": "Refresh",
        "common.viewDetails": "View Details",
        "common.edit": "Edit",
        "common.status": "Status",
        "common.progress": "Progress",
        "common.dueDate": "Due Date",
        "common.owner": "Owner",
        "common.department": "Department",
        "common.priority": "Priority",
        "common.high": "High",
        "common.medium": "Medium",
        "common.low": "Low",
        "common.pending": "Pending",
        "common.approved": "Approved",
        "common.rejected": "Rejected",
        "common.completed": "Completed",
        "common.inProgress": "In Progress",
        "common.draft": "Draft",
        "common.submit": "Submit",
        "common.save": "Save",
        "common.cancel": "Cancel",
        "common.approve": "Approve",
        "common.reject": "Reject",
      }
      return translations[key] || key
    },
  }
}

const CompensationReviewWorkflow = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDepartment, setFilterDepartment] = useState("all")

  // Mock metrics data
  const [metrics, setMetrics] = useState({
    totalBudget: { value: 2850000, change: 15.2, trend: "up", currency: "USD" },
    budgetUsed: { value: 1420000, change: 8.7, trend: "up", currency: "USD" },
    avgIncrease: { value: 8.5, change: 2.1, trend: "up" },
    pendingReviews: { value: 23, change: -12.5, trend: "down" },
    completedReviews: { value: 156, change: 25.3, trend: "up" },
    approvalsPending: { value: 8, change: -18.2, trend: "down" },
  })

  // Mock compensation review data
  const [compensationReviews, setCompensationReviews] = useState([
    {
      id: "CR001",
      employeeId: "EMP001",
      employeeName: "John Smith",
      department: "Engineering",
      position: "Senior Software Engineer",
      manager: "Sarah Johnson",
      managerId: "EMP002",
      currentSalary: 12000,
      proposedSalary: 13200,
      increaseAmount: 1200,
      increasePercentage: 10.0,
      currency: "USD",
      reviewPeriod: "2024 Annual Review",
      status: "inProgress",
      priority: "medium",
      dueDate: "2024-03-15",
      lastUpdated: "2024-01-15",
      performanceRating: 4.5,
      marketComparison: "Above Market",
      budgetImpact: "Within Budget",
      justification: "Exceptional performance, leading critical projects, mentoring junior developers",
      managerRecommendation: "Strongly Recommend",
      hrNotes: "Performance consistently exceeds expectations. Market analysis supports increase.",
      approvalChain: [
        { level: 1, approver: "Sarah Johnson", status: "approved", date: "2024-01-10" },
        { level: 2, approver: "Michael Chen", status: "pending", date: null },
        { level: 3, approver: "HR Director", status: "pending", date: null },
      ],
    },
    {
      id: "CR002",
      employeeId: "EMP003",
      employeeName: "Ahmed Al-Rashid",
      department: "Sales",
      position: "Sales Executive",
      manager: "Lisa Chen",
      managerId: "EMP004",
      currentSalary: 8500,
      proposedSalary: 9350,
      increaseAmount: 850,
      increasePercentage: 10.0,
      currency: "USD",
      reviewPeriod: "2024 Annual Review",
      status: "pending",
      priority: "high",
      dueDate: "2024-02-28",
      lastUpdated: "2024-01-12",
      performanceRating: 4.2,
      marketComparison: "At Market",
      budgetImpact: "Within Budget",
      justification: "Exceeded sales targets by 25%, acquired 12 new major clients",
      managerRecommendation: "Recommend",
      hrNotes: "Strong sales performance. Increase aligns with market standards.",
      approvalChain: [
        { level: 1, approver: "Lisa Chen", status: "pending", date: null },
        { level: 2, approver: "Sales Director", status: "pending", date: null },
        { level: 3, approver: "HR Director", status: "pending", date: null },
      ],
    },
    {
      id: "CR003",
      employeeId: "EMP005",
      employeeName: "Maria Rodriguez",
      department: "Marketing",
      position: "Marketing Manager",
      manager: "David Wilson",
      managerId: "EMP007",
      currentSalary: 11000,
      proposedSalary: 11880,
      increaseAmount: 880,
      increasePercentage: 8.0,
      currency: "USD",
      reviewPeriod: "2024 Annual Review",
      status: "approved",
      priority: "medium",
      dueDate: "2024-03-31",
      lastUpdated: "2024-01-20",
      performanceRating: 4.3,
      marketComparison: "At Market",
      budgetImpact: "Within Budget",
      justification: "Led successful product launch campaigns, improved brand awareness by 40%",
      managerRecommendation: "Recommend",
      hrNotes: "Solid performance and market-aligned increase.",
      approvalChain: [
        { level: 1, approver: "David Wilson", status: "approved", date: "2024-01-18" },
        { level: 2, approver: "Marketing Director", status: "approved", date: "2024-01-19" },
        { level: 3, approver: "HR Director", status: "approved", date: "2024-01-20" },
      ],
    },
  ])

  // Mock budget planning data
  const [budgetData, setBudgetData] = useState([
    {
      department: "Engineering",
      totalEmployees: 45,
      currentBudget: 1200000,
      proposedBudget: 1380000,
      budgetIncrease: 180000,
      increasePercentage: 15.0,
      avgCurrentSalary: 26667,
      avgProposedSalary: 30667,
      budgetUtilization: 75.2,
      status: "inProgress",
    },
    {
      department: "Sales",
      totalEmployees: 28,
      currentBudget: 650000,
      proposedBudget: 715000,
      budgetIncrease: 65000,
      increasePercentage: 10.0,
      avgCurrentSalary: 23214,
      avgProposedSalary: 25536,
      budgetUtilization: 68.5,
      status: "pending",
    },
    {
      department: "Marketing",
      totalEmployees: 18,
      currentBudget: 450000,
      proposedBudget: 486000,
      budgetIncrease: 36000,
      increasePercentage: 8.0,
      avgCurrentSalary: 25000,
      avgProposedSalary: 27000,
      budgetUtilization: 82.1,
      status: "approved",
    },
    {
      department: "HR",
      totalEmployees: 12,
      currentBudget: 320000,
      proposedBudget: 345600,
      budgetIncrease: 25600,
      increasePercentage: 8.0,
      avgCurrentSalary: 26667,
      avgProposedSalary: 28800,
      budgetUtilization: 71.8,
      status: "inProgress",
    },
  ])

  // Mock approval queue data
  const [approvalQueue, setApprovalQueue] = useState([
    {
      id: "CR001",
      employeeName: "John Smith",
      department: "Engineering",
      currentSalary: 12000,
      proposedSalary: 13200,
      increasePercentage: 10.0,
      approverLevel: 2,
      approverName: "Michael Chen",
      submittedDate: "2024-01-10",
      daysWaiting: 5,
      priority: "medium",
      performanceRating: 4.5,
      justification: "Exceptional performance, leading critical projects",
    },
    {
      id: "CR004",
      employeeName: "Emma Davis",
      department: "Finance",
      currentSalary: 9500,
      proposedSalary: 10450,
      increasePercentage: 10.0,
      approverLevel: 1,
      approverName: "Finance Manager",
      submittedDate: "2024-01-12",
      daysWaiting: 3,
      priority: "high",
      performanceRating: 4.7,
      justification: "Outstanding financial analysis and process improvements",
    },
  ])

  useEffect(() => {
    fetchCompensationData()
  }, [activeTab])

  const fetchCompensationData = async () => {
    setLoading(true)
    try {
      // CURSOR: API call to GET /api/v1/hcm/compensation/reviews
      // CURSOR: API call to GET /api/v1/hcm/compensation/budget
      // CURSOR: API call to GET /api/v1/hcm/compensation/approvals
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching compensation data:", error)
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      inProgress: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-purple-100 text-purple-800",
      draft: "bg-gray-100 text-gray-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    }
    return colors[priority] || "bg-gray-100 text-gray-800"
  }

  const getPerformanceStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-200 text-yellow-400" />)
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  const metricsCards = [
    {
      title: t("compensation.metrics.totalBudget"),
      value: formatCurrency(metrics.totalBudget.value, metrics.totalBudget.currency),
      change: metrics.totalBudget.change,
      trend: metrics.totalBudget.trend,
      icon: PiggyBank,
      color: "text-blue-600",
    },
    {
      title: t("compensation.metrics.budgetUsed"),
      value: formatCurrency(metrics.budgetUsed.value, metrics.budgetUsed.currency),
      change: metrics.budgetUsed.change,
      trend: metrics.budgetUsed.trend,
      icon: CreditCard,
      color: "text-green-600",
    },
    {
      title: t("compensation.metrics.avgIncrease"),
      value: `${metrics.avgIncrease.value}%`,
      change: metrics.avgIncrease.change,
      trend: metrics.avgIncrease.trend,
      icon: Percent,
      color: "text-purple-600",
    },
    {
      title: t("compensation.metrics.pendingReviews"),
      value: metrics.pendingReviews.value.toString(),
      change: metrics.pendingReviews.change,
      trend: metrics.pendingReviews.trend,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: t("compensation.metrics.completedReviews"),
      value: metrics.completedReviews.value.toString(),
      change: metrics.completedReviews.change,
      trend: metrics.completedReviews.trend,
      icon: CheckCircle,
      color: "text-indigo-600",
    },
    {
      title: t("compensation.metrics.approvalsPending"),
      value: metrics.approvalsPending.value.toString(),
      change: metrics.approvalsPending.change,
      trend: metrics.approvalsPending.trend,
      icon: AlertCircle,
      color: "text-red-600",
    },
  ]

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {metricsCards.map((metric, index) => {
          const IconComponent = metric.icon
          const TrendIcon = metric.trend === "up" ? ArrowUpRight : ArrowDownRight
          const trendColor = metric.trend === "up" ? "text-green-600" : "text-red-600"

          return (
            <Card key={index} className="hover:shadow-hover transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className={`flex items-center text-xs mt-1 ${trendColor}`}>
                  <TrendIcon className="h-3 w-3 mr-1" />
                  <span>{Math.abs(metric.change)}%</span>
                  <span className="text-muted-foreground ml-1">from last cycle</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Start New Review Cycle
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calculator className="h-4 w-4 mr-2" />
              Budget Calculator
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Generate Reports
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Bulk Approvals
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Reviews
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Maria Rodriguez review approved</span>
              <span className="text-muted-foreground text-xs">2h ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>John Smith review submitted for approval</span>
              <span className="text-muted-foreground text-xs">4h ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Engineering budget updated</span>
              <span className="text-muted-foreground text-xs">1d ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Q1 review cycle initiated</span>
              <span className="text-muted-foreground text-xs">2d ago</span>
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <Clock className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium">Reviews Due Soon</div>
                <div className="text-muted-foreground">8 reviews due within 7 days</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <DollarSign className="h-4 w-4 text-red-500 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium">Budget Alert</div>
                <div className="text-muted-foreground">Engineering dept at 85% budget usage</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium">Pending Approvals</div>
                <div className="text-muted-foreground">8 reviews awaiting your approval</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Budget Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-purple-600" />
              Budget Utilization by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetData.map((dept) => (
                <div key={dept.department} className="flex justify-between items-center">
                  <span className="text-sm">{dept.department}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          dept.budgetUtilization > 80 ? 'bg-red-500' : 
                          dept.budgetUtilization > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${dept.budgetUtilization}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12">{dept.budgetUtilization}%</span>
                    <span className="text-xs text-muted-foreground w-16">
                      {formatCurrency(dept.currentBudget)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Compensation Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Salary Increase</span>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-green-600">8.5%</span>
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Market Competitiveness</span>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-blue-600">105%</span>
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Employee Retention</span>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-purple-600">94.8%</span>
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Budget Efficiency</span>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-orange-600">87%</span>
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderReviewsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <input type="checkbox" className="rounded" />
          </TableHead>
          <TableHead>Employee</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Current Salary</TableHead>
          <TableHead>Proposed Salary</TableHead>
          <TableHead>Increase</TableHead>
          <TableHead>Performance</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {compensationReviews.map((review) => (
          <TableRow key={review.id}>
            <TableCell>
              <input type="checkbox" className="rounded" />
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">
                    {review.employeeName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{review.employeeName}</div>
                  <div className="text-xs text-muted-foreground">{review.position}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="text-xs">
                {review.department}
              </Badge>
            </TableCell>
            <TableCell className="font-mono">
              {formatCurrency(review.currentSalary, review.currency)}
            </TableCell>
            <TableCell className="font-mono font-medium">
              {formatCurrency(review.proposedSalary, review.currency)}
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-green-600">
                  +{formatCurrency(review.increaseAmount, review.currency)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({review.increasePercentage}%)
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-1">
                {getPerformanceStars(review.performanceRating)}
                <span className="text-xs ml-1">{review.performanceRating}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={getStatusColor(review.status)}>
                {t(`common.${review.status}`)}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">{review.dueDate}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const renderBudgetTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Department</TableHead>
          <TableHead>Employees</TableHead>
          <TableHead>Current Budget</TableHead>
          <TableHead>Proposed Budget</TableHead>
          <TableHead>Increase</TableHead>
          <TableHead>Avg Current</TableHead>
          <TableHead>Avg Proposed</TableHead>
          <TableHead>Utilization</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {budgetData.map((dept) => (
          <TableRow key={dept.department}>
            <TableCell>
              <div className="font-medium">{dept.department}</div>
            </TableCell>
            <TableCell className="text-center">{dept.totalEmployees}</TableCell>
            <TableCell className="font-mono">
              {formatCurrency(dept.currentBudget)}
            </TableCell>
            <TableCell className="font-mono font-medium">
              {formatCurrency(dept.proposedBudget)}
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-green-600">
                  +{formatCurrency(dept.budgetIncrease)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({dept.increasePercentage}%)
                </span>
              </div>
            </TableCell>
            <TableCell className="font-mono text-sm">
              {formatCurrency(dept.avgCurrentSalary)}
            </TableCell>
            <TableCell className="font-mono text-sm font-medium">
              {formatCurrency(dept.avgProposedSalary)}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      dept.budgetUtilization > 80 ? 'bg-red-500' : 
                      dept.budgetUtilization > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${dept.budgetUtilization}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{dept.budgetUtilization}%</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={getStatusColor(dept.status)}>
                {t(`common.${dept.status}`)}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Calculator className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const renderApprovalsQueue = () => (
    <div className="space-y-6">
      {approvalQueue.map((approval) => (
        <Card key={approval.id} className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {approval.employeeName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-lg">{approval.employeeName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{approval.department}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getPriorityColor(approval.priority)}>
                  {t(`common.${approval.priority}`)} Priority
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  Level {approval.approverLevel}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Compensation Details */}
              <div className="space-y-4">
                <h4 className="font-medium">Compensation Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current Salary:</span>
                    <span className="font-mono">{formatCurrency(approval.currentSalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Proposed Salary:</span>
                    <span className="font-mono font-medium">{formatCurrency(approval.proposedSalary)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Increase:</span>
                    <span className="font-medium text-green-600">
                      +{formatCurrency(approval.proposedSalary - approval.currentSalary)} ({approval.increasePercentage}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Performance Rating:</span>
                    <div className="flex items-center space-x-1">
                      {getPerformanceStars(approval.performanceRating)}
                      <span className="text-sm ml-1">{approval.performanceRating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approval Details */}
              <div className="space-y-4">
                <h4 className="font-medium">Approval Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Approver:</span>
                    <span className="font-medium">{approval.approverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Submitted:</span>
                    <span>{approval.submittedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Waiting:</span>
                    <span className={approval.daysWaiting > 5 ? 'text-red-600 font-medium' : ''}>
                      {approval.daysWaiting} days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Justification */}
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Justification</h4>
              <p className="text-sm text-muted-foreground">{approval.justification}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  {t("common.reject")}
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {t("common.approve")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderAnalytics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Salary Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Salary Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">$0 - $50K</span>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                15%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">$50K - $100K</span>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                45%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">$100K - $150K</span>
              <Badge variant="outline" className="bg-purple-100 text-purple-800">
                25%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">$150K+</span>
              <Badge variant="outline" className="bg-orange-100 text-orange-800">
                15%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Cycle Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Review Cycle Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Avg Review Time</span>
              <span className="font-medium">12 days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>On-Time Completion</span>
              <span className="font-medium text-green-600">87%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Manager Participation</span>
              <span className="font-medium">94%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Employee Satisfaction</span>
              <span className="font-medium text-blue-600">4.2/5</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Efficiency */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <PiggyBank className="h-5 w-5 mr-2 text-purple-600" />
            Budget Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Budget Utilization</span>
              <span className="font-medium">76.8%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Cost per Review</span>
              <span className="font-medium">$125</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>ROI on Increases</span>
              <span className="font-medium text-green-600">285%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Budget Variance</span>
              <span className="font-medium text-green-600">-2.3%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Target className="h-5 w-5 mr-2 text-indigo-600" />
            Market Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Above Market</span>
              <span className="font-medium text-green-600">25%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>At Market</span>
              <span className="font-medium">60%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Below Market</span>
              <span className="font-medium text-red-600">15%</span>
            </div>
            <div className="pt-2 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">105%</div>
                <div className="text-xs text-muted-foreground">Market Competitiveness</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Retention Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <UserCheck className="h-5 w-5 mr-2 text-orange-600" />
            Retention Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Pre-Review Retention</span>
              <span className="font-medium">91.2%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Post-Review Retention</span>
              <span className="font-medium text-green-600">94.8%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Improvement</span>
              <span className="font-medium text-green-600">+3.6%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Cost of Turnover Saved</span>
              <span className="font-medium">$450K</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Efficiency */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-teal-600" />
            Approval Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Avg Approval Time</span>
              <span className="font-medium">3.2 days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>First-Pass Approval</span>
              <span className="font-medium text-green-600">78%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Rejection Rate</span>
              <span className="font-medium">8%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Escalation Rate</span>
              <span className="font-medium">14%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="w-8 h-8 bg-primary/20 rounded-lg animate-pulse mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading compensation data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t("compensation.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("compensation.description")}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("common.refresh")}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t("common.export")}
          </Button>
          <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Start Review Cycle
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>{t("compensation.tabs.dashboard")}</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>{t("compensation.tabs.reviews")}</span>
              </TabsTrigger>
              <TabsTrigger value="budget" className="flex items-center space-x-2">
                <PiggyBank className="h-4 w-4" />
                <span>{t("compensation.tabs.budget")}</span>
              </TabsTrigger>
              <TabsTrigger value="approvals" className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>{t("compensation.tabs.approvals")}</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>{t("compensation.tabs.analytics")}</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <History className="h-4 w-4" />
                <span>{t("compensation.tabs.history")}</span>
              </TabsTrigger>
            </TabsList>

            {/* Search and Filter Bar */}
            {!["dashboard", "analytics"].includes(activeTab) && (
              <div className="flex items-center justify-between space-x-4 mt-6">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("common.search")}
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inProgress">In Progress</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <TabsContent value="dashboard" className="mt-6">
              {renderDashboard()}
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Compensation Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderReviewsTable()}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="budget" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Department Budget Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderBudgetTable()}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="approvals" className="mt-6">
              {renderApprovalsQueue()}
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              {renderAnalytics()}
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Review History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Historical compensation data will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default CompensationReviewWorkflow
