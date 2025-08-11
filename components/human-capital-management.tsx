"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  UserPlus,
  Calendar,
  DollarSign,
  TrendingUp,
  Search,
  Download,
  Eye,
  Edit,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Target,
  Star,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Settings,
  Building,
} from "lucide-react"
import { useI18n } from "@/contexts/i18n-context"

// Import the new components
import InteractiveOrgChart from "./interactive-org-chart"
import AdvancedRecruitmentPipeline from "./advanced-recruitment-pipeline"
import OnboardingOffboardingWizards from "./onboarding-offboarding-wizards"
import ThirtySixtyFeedback from "./thirty-sixty-feedback"
import GoalTrackingDashboard from "./goal-tracking-dashboard"
import CompensationReviewWorkflow from "./compensation-review-workflow"

// --- MOCK DATA ---

const mockEmployees = [
  {
    id: "emp-1",
    employeeId: "EMP001",
    name: "John Smith",
    position: "Senior Software Engineer",
    department: "Engineering",
    manager: "Sarah Johnson",
    location: "San Francisco, CA",
    hireDate: "2022-03-15",
    salary: 145000,
    status: "Active",
    email: "john.smith@company.com",
    phone: "+1 (555) 123-4567",
    performance: 4.2,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "emp-2",
    employeeId: "EMP002",
    name: "Sarah Johnson",
    position: "Engineering Manager",
    department: "Engineering",
    manager: "Michael Chen",
    location: "San Francisco, CA",
    hireDate: "2021-01-10",
    salary: 165000,
    status: "Active",
    email: "sarah.johnson@company.com",
    phone: "+1 (555) 234-5678",
    performance: 4.8,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "emp-3",
    employeeId: "EMP003",
    name: "Michael Chen",
    position: "VP of Engineering",
    department: "Engineering",
    manager: "CEO",
    location: "San Francisco, CA",
    hireDate: "2020-06-01",
    salary: 220000,
    status: "Active",
    email: "michael.chen@company.com",
    phone: "+1 (555) 345-6789",
    performance: 4.9,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "emp-4",
    employeeId: "EMP004",
    name: "Emily Rodriguez",
    position: "UX Designer",
    department: "Design",
    manager: "Lisa Thompson",
    location: "Austin, TX",
    hireDate: "2022-08-20",
    salary: 95000,
    status: "Active",
    email: "emily.rodriguez@company.com",
    phone: "+1 (555) 456-7890",
    performance: 4.1,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "emp-5",
    employeeId: "EMP005",
    name: "David Kim",
    position: "Data Scientist",
    department: "Analytics",
    manager: "Robert Davis",
    location: "Seattle, WA",
    hireDate: "2023-02-14",
    salary: 130000,
    status: "Active",
    email: "david.kim@company.com",
    phone: "+1 (555) 567-8901",
    performance: 4.3,
    avatar: "/placeholder-user.jpg",
  },
]

const mockDashboardData = {
  totalEmployees: 247,
  newHires: 12,
  openPositions: 8,
  avgSalary: 125000,
  turnoverRate: 8.5,
  satisfactionScore: 4.2,
  departmentDistribution: [
    { department: "Engineering", count: 89, percentage: 36 },
    { department: "Sales", count: 45, percentage: 18 },
    { department: "Marketing", count: 32, percentage: 13 },
    { department: "Operations", count: 28, percentage: 11 },
    { department: "HR", count: 18, percentage: 7 },
    { department: "Finance", count: 15, percentage: 6 },
    { department: "Design", count: 12, percentage: 5 },
    { department: "Analytics", count: 8, percentage: 3 },
  ],
  recentActivities: [
    { id: 1, type: "hire", message: "New hire: Alex Thompson joined Engineering", time: "2 hours ago" },
    { id: 2, type: "promotion", message: "Sarah Johnson promoted to Senior Manager", time: "1 day ago" },
    { id: 3, type: "review", message: "Q4 performance reviews completed", time: "3 days ago" },
    { id: 4, type: "training", message: "Leadership training program launched", time: "1 week ago" },
  ],
}

// --- HELPER FUNCTIONS ---

const formatSalary = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const getPerformanceColor = (rating: number) => {
  if (rating >= 4.5) return "text-green-600"
  if (rating >= 4.0) return "text-blue-600"
  if (rating >= 3.5) return "text-yellow-600"
  return "text-red-600"
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "hire":
      return <UserPlus className="h-4 w-4 text-green-500" />
    case "promotion":
      return <TrendingUp className="h-4 w-4 text-blue-500" />
    case "review":
      return <Star className="h-4 w-4 text-yellow-500" />
    case "training":
      return <GraduationCap className="h-4 w-4 text-purple-500" />
    default:
      return <Activity className="h-4 w-4 text-gray-500" />
  }
}

// --- SUB-COMPONENTS ---

function HCMDashboard() {
  const { t } = useI18n()
  const data = mockDashboardData

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("hcm.metrics.totalEmployees")}</p>
                <p className="text-2xl font-bold">{data.totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("hcm.metrics.newHires")}</p>
                <p className="text-2xl font-bold text-green-600">+{data.newHires}</p>
              </div>
              <UserPlus className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("hcm.metrics.openPositions")}</p>
                <p className="text-2xl font-bold text-orange-600">{data.openPositions}</p>
              </div>
              <Briefcase className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("hcm.metrics.avgSalary")}</p>
                <p className="text-2xl font-bold">{formatSalary(data.avgSalary)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("hcm.metrics.turnoverRate")}</p>
                <p className="text-2xl font-bold text-red-600">{data.turnoverRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t("hcm.metrics.satisfaction")}</p>
                <p className="text-2xl font-bold text-green-600">{data.satisfactionScore}/5</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Distribution and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              {t("hcm.departmentDistribution")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.departmentDistribution.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full bg-blue-500"
                      style={{
                        backgroundColor: `hsl(${index * 45}, 70%, 50%)`,
                      }}
                    ></div>
                    <span className="text-sm font-medium">{dept.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{dept.count}</span>
                    <Badge variant="secondary">{dept.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {t("hcm.recentActivities")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {t("hcm.quickActions")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <UserPlus className="h-6 w-6" />
              <span className="text-xs">{t("hcm.actions.addEmployee")}</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Calendar className="h-6 w-6" />
              <span className="text-xs">{t("hcm.actions.scheduleReview")}</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <FileText className="h-6 w-6" />
              <span className="text-xs">{t("hcm.actions.generateReport")}</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Mail className="h-6 w-6" />
              <span className="text-xs">{t("hcm.actions.sendAnnouncement")}</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Award className="h-6 w-6" />
              <span className="text-xs">{t("hcm.actions.recognition")}</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Settings className="h-6 w-6" />
              <span className="text-xs">{t("hcm.actions.settings")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function EmployeeManagement() {
  const { t } = useI18n()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredEmployees = mockEmployees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment
    const matchesStatus = selectedStatus === "all" || employee.status === selectedStatus

    return matchesSearch && matchesDepartment && matchesStatus
  })

  const departments = Array.from(new Set(mockEmployees.map((emp) => emp.department)))

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("hcm.searchEmployees")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t("hcm.allDepartments")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("hcm.allDepartments")}</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder={t("common.status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("hcm.allStatus")}</SelectItem>
              <SelectItem value="Active">{t("common.active")}</SelectItem>
              <SelectItem value="Inactive">{t("common.inactive")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t("common.export")}
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            {t("hcm.addEmployee")}
          </Button>
        </div>
      </div>

      {/* Employee Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4 font-medium">{t("hcm.employee")}</th>
                  <th className="text-left p-4 font-medium">{t("hcm.position")}</th>
                  <th className="text-left p-4 font-medium">{t("hcm.department")}</th>
                  <th className="text-left p-4 font-medium">{t("hcm.manager")}</th>
                  <th className="text-left p-4 font-medium">{t("hcm.location")}</th>
                  <th className="text-left p-4 font-medium">{t("hcm.hireDate")}</th>
                  <th className="text-left p-4 font-medium">{t("hcm.performance")}</th>
                  <th className="text-left p-4 font-medium">{t("common.status")}</th>
                  <th className="text-left p-4 font-medium">{t("common.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{employee.position}</p>
                      <p className="text-sm text-muted-foreground">{formatSalary(employee.salary)}</p>
                    </td>
                    <td className="p-4">{employee.department}</td>
                    <td className="p-4">{employee.manager}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{employee.location}</span>
                      </div>
                    </td>
                    <td className="p-4">{formatDate(employee.hireDate)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < employee.performance ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className={`text-sm font-medium ${getPerformanceColor(employee.performance)}`}>
                          {employee.performance}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={employee.status === "Active" ? "default" : "secondary"}>
                        {employee.status === "Active" ? t("common.active") : t("common.inactive")}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// --- MAIN COMPONENT ---

const HumanCapitalManagement = () => {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("hcm.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("hcm.description")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t("common.export")}
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            {t("hcm.addEmployee")}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="dashboard">{t("hcm.tabs.dashboard")}</TabsTrigger>
          <TabsTrigger value="employees">{t("hcm.tabs.employees")}</TabsTrigger>
          <TabsTrigger value="org-chart">{t("hcm.tabs.orgChart")}</TabsTrigger>
          <TabsTrigger value="recruitment">{t("hcm.tabs.recruitment")}</TabsTrigger>
          <TabsTrigger value="onboarding">{t("hcm.tabs.onboarding")}</TabsTrigger>
          <TabsTrigger value="performance">{t("hcm.tabs.performance")}</TabsTrigger>
          <TabsTrigger value="goals">{t("hcm.tabs.goals")}</TabsTrigger>
          <TabsTrigger value="compensation">{t("hcm.tabs.compensation")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("hcm.tabs.analytics")}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <HCMDashboard />
        </TabsContent>

        <TabsContent value="employees" className="mt-6">
          <EmployeeManagement />
        </TabsContent>

        <TabsContent value="org-chart" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {t("hcm.interactiveOrgChart")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InteractiveOrgChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recruitment" className="mt-6">
          <AdvancedRecruitmentPipeline />
        </TabsContent>

        <TabsContent value="onboarding" className="mt-6">
          <OnboardingOffboardingWizards />
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                {t("hcm.feedbackSystem")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ThirtySixtyFeedback />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {t("hcm.goalTracking")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GoalTrackingDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compensation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {t("hcm.compensationReview")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CompensationReviewWorkflow />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {t("hcm.analytics")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t("hcm.advancedAnalytics")}</h3>
                <p className="text-muted-foreground">{t("hcm.analyticsDescription")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default HumanCapitalManagement
