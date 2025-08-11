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
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Database,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useI18n } from "@/contexts/i18n-context"

const DashboardOverview = () => {
  const router = useRouter()
  const { t } = useI18n()
  const { user } = useAuth()
  const [metrics, setMetrics] = useState({
    revenue: { value: "$2,847,392", change: "+12.5%", trend: "up" },
    employees: { value: "1,247", change: "+8.2%", trend: "up" },
    inventory: { value: "$1,892,450", change: "+3.1%", trend: "up" },
    orders: { value: "156", change: "+15.3%", trend: "up" },
    activity: { value: "89", change: "-2.1%", trend: "down" },
  })
  const [recentActivity, setRecentActivity] = useState([
    {
      title: t("dashboard.activity.invoiceCreated"),
      description: t("dashboard.activity.invoiceDescription"),
      time: t("dashboard.activity.timeAgo", { time: "5 min" }),
      module: "financial",
    },
    {
      title: t("dashboard.activity.employeeOnboarded"),
      description: t("dashboard.activity.employeeDescription"),
      time: t("dashboard.activity.timeAgo", { time: "1 hour" }),
      module: "hcm",
    },
    {
      title: t("dashboard.activity.purchaseOrderApproved"),
      description: t("dashboard.activity.purchaseOrderDescription"),
      time: t("dashboard.activity.timeAgo", { time: "2 hours" }),
      module: "materials",
    },
    {
      title: t("dashboard.activity.salesOrderCompleted"),
      description: t("dashboard.activity.salesOrderDescription"),
      time: t("dashboard.activity.timeAgo", { time: "3 hours" }),
      module: "sales",
    },
    {
      title: t("dashboard.activity.materialMasterUpdated"),
      description: t("dashboard.activity.materialMasterDescription"),
      time: t("dashboard.activity.timeAgo", { time: "4 hours" }),
      module: "mdm",
    },
  ])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // CURSOR: API call to GET /api/v1/dashboard/overview
    const fetchDashboardData = async () => {
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
      route: "/materials",
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
      lastAccessed: t("dashboard.timeAgo", { time: "2 hours" }),
    },
    {
      title: t("modules.hcm.title"),
      description: t("modules.hcm.description"),
      icon: Users,
      route: "/employees",
      lastAccessed: t("dashboard.timeAgo", { time: "1 day" }),
    },
    {
      title: t("modules.materials.title"),
      description: t("modules.materials.description"),
      icon: Package,
      route: "/materials",
      lastAccessed: t("dashboard.timeAgo", { time: "3 hours" }),
    },
    {
      title: t("modules.sales.title"),
      description: t("modules.sales.description"),
      icon: ShoppingCart,
      route: "/sales",
      lastAccessed: t("dashboard.timeAgo", { time: "30 min" }),
    },
    {
      title: t("modules.mdm.title"),
      description: t("modules.mdm.description"),
      icon: Database,
      route: "/mdm",
      lastAccessed: t("dashboard.timeAgo", { time: "1 week" }),
    },
    {
      title: t("modules.organizational.title"),
      description: t("modules.organizational.description"),
      icon: Building,
      route: "/organizational",
      lastAccessed: t("dashboard.timeAgo", { time: "2 days" }),
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-200 rounded-lg animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("dashboard.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {t("dashboard.welcome")}, {user?.name || t("dashboard.defaultUser")}!
        </h2>
        <p className="text-muted-foreground">{t("dashboard.welcomeDescription")}</p>
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
              className="hover:shadow-lg transition-all duration-300 cursor-pointer"
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
                  <span>
                    {metric.change} {t("dashboard.metrics.fromLastMonth")}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Module Cards Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-6">{t("dashboard.erpModules")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moduleCards.map((module, index) => {
            const IconComponent = module.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
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
              {t("dashboard.actions.createInvoice")}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => router.push("/employees")}
            >
              <Users className="h-4 w-4 mr-2" />
              {t("dashboard.actions.addEmployee")}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => router.push("/materials")}
            >
              <Package className="h-4 w-4 mr-2" />
              {t("dashboard.actions.updateInventory")}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => router.push("/sales")}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t("dashboard.actions.newSalesOrder")}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => router.push("/mdm")}
            >
              <Database className="h-4 w-4 mr-2" />
              {t("dashboard.actions.manageMasterData")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardOverview
