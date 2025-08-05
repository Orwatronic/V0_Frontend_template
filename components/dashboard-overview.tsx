"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  DollarSign,
  Package,
  ShoppingCart,
  Building,
  Activity,
  Bell,
  Settings,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  Database,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

// Mock translation function
const useTranslation = () => {
  return {
    t: (key: string) => {
      const translations: Record<string, string> = {
        "dashboard.welcome": "Welcome back",
        "dashboard.metrics.revenue": "Total Revenue",
        "dashboard.metrics.employees": "Active Employees",
        "dashboard.metrics.inventory": "Inventory Value",
        "dashboard.metrics.orders": "Sales Orders",
        "dashboard.metrics.activity": "System Activity",
        "dashboard.recentActivity": "Recent Activity",
        "dashboard.quickActions": "Quick Actions",
        "dashboard.status.active": "Active",
        "dashboard.lastAccessed": "Last accessed",
        "modules.financial.title": "Financial Management",
        "modules.financial.description": "General Ledger, AP/AR, Asset Accounting",
        "modules.hcm.title": "Human Capital Management",
        "modules.hcm.description": "Employee lifecycle, Payroll, Time & Attendance",
        "modules.materials.title": "Materials Management",
        "modules.materials.description": "Material Master, Inventory, Warehouse, Procurement",
        "modules.sales.title": "Sales & Distribution",
        "modules.sales.description": "Quotations, Orders, Pricing, Delivery, Returns",
        "modules.mdm.title": "Master Data Management",
        "modules.mdm.description": "Centralized reference data management",
        "modules.organizational.title": "Organizational Management",
        "modules.organizational.description": "Company structure, Cost centers, Profit centers",
      }
      return translations[key] || key
    },
  }
}

const DashboardOverview = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const [metrics, setMetrics] = useState({
    revenue: { value: "$2,847,392", change: "+12.5%", trend: "up" },
    employees: { value: "1,247", change: "+8.2%", trend: "up" },
    inventory: { value: "$1,892,450", change: "+3.1%", trend: "up" },
    orders: { value: "156", change: "+15.3%", trend: "up" },
    activity: { value: "89", change: "-2.1%", trend: "down" },
  })
  const [recentActivity, setRecentActivity] = useState([
    {
      title: "New invoice created",
      description: "Invoice #INV-2024-001 for $15,230",
      time: "5 min ago",
      module: "financial",
    },
    {
      title: "Employee onboarded",
      description: "Sarah Johnson joined Marketing team",
      time: "1 hour ago",
      module: "hcm",
    },
    {
      title: "Purchase order approved",
      description: "PO #PO-2024-045 for raw materials",
      time: "2 hours ago",
      module: "materials",
    },
    {
      title: "Sales order completed",
      description: "Order #SO-2024-089 shipped to customer",
      time: "3 hours ago",
      module: "sales",
    },
    {
      title: "Material master updated",
      description: "Material ABC-123 specifications modified",
      time: "4 hours ago",
      module: "mdm",
    },
  ])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching dashboard data from real backend
    const fetchDashboardData = async () => {
      // Simulate API delay
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
    fetchDashboardData()
  }, [])

  const metricCards = [
    {
      title: t("dashboard.metrics.revenue"),
      value: metrics.revenue.value,
      change: metrics.revenue.change,
      trend: metrics.revenue.trend,
      icon: DollarSign,
      route: "/financial",
      color: "text-green-600",
    },
    {
      title: t("dashboard.metrics.employees"),
      value: metrics.employees.value,
      change: metrics.employees.change,
      trend: metrics.employees.trend,
      icon: Users,
      route: "/employees",
      color: "text-blue-600",
    },
    {
      title: t("dashboard.metrics.inventory"),
      value: metrics.inventory.value,
      change: metrics.inventory.change,
      trend: metrics.inventory.trend,
      icon: Package,
      route: "/inventory",
      color: "text-purple-600",
    },
    {
      title: t("dashboard.metrics.orders"),
      value: metrics.orders.value,
      change: metrics.orders.change,
      trend: metrics.orders.trend,
      icon: ShoppingCart,
      route: "/sales",
      color: "text-orange-600",
    },
    {
      title: t("dashboard.metrics.activity"),
      value: metrics.activity.value,
      change: metrics.activity.change,
      trend: metrics.activity.trend,
      icon: Activity,
      route: "/system",
      color: "text-red-600",
    },
  ]

  const moduleCards = [
    {
      title: t("modules.financial.title"),
      description: t("modules.financial.description"),
      icon: DollarSign,
      route: "/financial",
      lastAccessed: "2 hours ago",
    },
    {
      title: t("modules.hcm.title"),
      description: t("modules.hcm.description"),
      icon: Users,
      route: "/employees",
      lastAccessed: "1 day ago",
    },
    {
      title: t("modules.materials.title"),
      description: t("modules.materials.description"),
      icon: Package,
      route: "/materials",
      lastAccessed: "3 hours ago",
    },
    {
      title: t("modules.sales.title"),
      description: t("modules.sales.description"),
      icon: ShoppingCart,
      route: "/sales",
      lastAccessed: "30 min ago",
    },
    {
      title: t("modules.mdm.title"),
      description: t("modules.mdm.description"),
      icon: Database,
      route: "/mdm",
      lastAccessed: "1 week ago",
    },
    {
      title: t("modules.organizational.title"),
      description: t("modules.organizational.description"),
      icon: Building,
      route: "/organizational",
      lastAccessed: "2 days ago",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-hero-gradient rounded-lg animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Company */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-hero-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Feebee ERP</h1>
                <p className="text-sm text-muted-foreground">Feebee Technologies</p>
              </div>
            </div>

            {/* User & Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary-foreground">JD</span>
                </div>
                <span className="text-sm font-medium">John Doe</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/login")}
                className="text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">{t("dashboard.welcome")}, John!</h2>
            <p className="text-muted-foreground">Here's what's happening with your business today.</p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {metricCards.map((metric, index) => {
              const IconComponent = metric.icon
              const TrendIcon = metric.trend === "up" ? ArrowUpRight : ArrowDownRight
              const trendColor = metric.trend === "up" ? "text-green-600" : "text-red-600"

              return (
                <Card
                  key={index}
                  className="hover:shadow-hover transition-all duration-300 cursor-pointer"
                  onClick={() => router.push(metric.route)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className={`flex items-center text-xs ${trendColor}`}>
                      <TrendIcon className="h-3 w-3 mr-1" />
                      <span>{metric.change} from last month</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Module Cards Grid */}
          <div>
            <h3 className="text-xl font-semibold mb-6">ERP Modules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {moduleCards.map((module, index) => {
                const IconComponent = module.icon
                return (
                  <Card
                    key={index}
                    className="group hover:shadow-hover transition-all duration-300 cursor-pointer"
                    onClick={() => router.push(module.route)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{module.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{t("dashboard.status.active")}</Badge>
                        <div className="text-sm text-muted-foreground">
                          {t("dashboard.lastAccessed")}: {module.lastAccessed}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  {t("dashboard.recentActivity")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t("dashboard.quickActions")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/financial")}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/employees")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/materials")}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Update Inventory
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/sales")}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  New Sales Order
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/mdm")}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Manage Master Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardOverview
