"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, TrendingUp, Users, Building, Plus, Search, Filter, Eye, Edit, MoreHorizontal, CheckCircle, Clock, AlertCircle, ArrowUpRight, ArrowDownRight, Calendar, Trophy, Award, Zap, BarChart3, PieChart, Activity, RefreshCw, Download, Upload } from 'lucide-react'
import { useState, useEffect } from "react"

// Mock translation function
const useTranslation = () => {
  return {
    t: (key: string) => {
      const translations: Record<string, string> = {
        "goals.title": "Goal Tracking & OKRs",
        "goals.description": "Track Objectives and Key Results across Individual, Team, and Company levels",
        "goals.tabs.individual": "Individual Goals",
        "goals.tabs.team": "Team Goals", 
        "goals.tabs.company": "Company Goals",
        "goals.tabs.analytics": "Analytics",
        "goals.metrics.totalGoals": "Total Goals",
        "goals.metrics.onTrack": "On Track",
        "goals.metrics.atRisk": "At Risk",
        "goals.metrics.completed": "Completed",
        "goals.metrics.avgProgress": "Avg Progress",
        "goals.metrics.dueThisMonth": "Due This Month",
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
        "common.onTrack": "On Track",
        "common.atRisk": "At Risk",
        "common.completed": "Completed",
        "common.notStarted": "Not Started",
        "common.overdue": "Overdue",
      }
      return translations[key] || key
    },
  }
}

const GoalTrackingDashboard = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("individual")
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")

  // Mock metrics data
  const [metrics, setMetrics] = useState({
    totalGoals: { value: 156, change: 12.5, trend: "up" },
    onTrack: { value: 89, change: 8.3, trend: "up" },
    atRisk: { value: 23, change: -15.2, trend: "down" },
    completed: { value: 44, change: 25.7, trend: "up" },
    avgProgress: { value: 67.8, change: 5.4, trend: "up" },
    dueThisMonth: { value: 18, change: -8.1, trend: "down" },
  })

  // Mock individual goals data
  const [individualGoals, setIndividualGoals] = useState([
    {
      id: "IND001",
      title: "Improve React Development Skills",
      description: "Master advanced React patterns and performance optimization",
      owner: "John Smith",
      ownerId: "EMP001",
      department: "Engineering",
      priority: "high",
      status: "onTrack",
      progress: 75,
      startDate: "2024-01-01",
      dueDate: "2024-06-30",
      keyResults: [
        { id: "KR001", title: "Complete 3 advanced React courses", progress: 100, target: 3, current: 3 },
        { id: "KR002", title: "Build 2 performance-optimized components", progress: 50, target: 2, current: 1 },
        { id: "KR003", title: "Achieve 95% test coverage on new features", progress: 80, target: 95, current: 76 },
      ],
      lastUpdated: "2024-01-15",
    },
    {
      id: "IND002", 
      title: "Increase Sales Performance",
      description: "Exceed quarterly sales targets and improve client relationships",
      owner: "Ahmed Al-Rashid",
      ownerId: "EMP003",
      department: "Sales",
      priority: "high",
      status: "atRisk",
      progress: 45,
      startDate: "2024-01-01",
      dueDate: "2024-03-31",
      keyResults: [
        { id: "KR004", title: "Generate $500K in new revenue", progress: 60, target: 500000, current: 300000 },
        { id: "KR005", title: "Acquire 15 new clients", progress: 40, target: 15, current: 6 },
        { id: "KR006", title: "Achieve 90% client satisfaction score", progress: 35, target: 90, current: 78 },
      ],
      lastUpdated: "2024-01-12",
    },
  ])

  // Mock team goals data
  const [teamGoals, setTeamGoals] = useState([
    {
      id: "TEAM001",
      title: "Launch New Product Feature",
      description: "Deliver the advanced analytics dashboard for Q1 release",
      team: "Engineering Team",
      teamId: "TEAM_ENG",
      manager: "Sarah Johnson",
      managerId: "EMP002",
      priority: "high",
      status: "onTrack",
      progress: 82,
      startDate: "2023-12-01",
      dueDate: "2024-03-15",
      teamMembers: [
        { id: "EMP001", name: "John Smith", role: "Frontend Developer", contribution: 85 },
        { id: "EMP007", name: "David Wilson", role: "Backend Developer", contribution: 78 },
        { id: "EMP008", name: "Lisa Chen", role: "UI/UX Designer", contribution: 90 },
      ],
      keyResults: [
        { id: "KR007", title: "Complete UI/UX design", progress: 100, target: 100, current: 100 },
        { id: "KR008", title: "Implement backend APIs", progress: 85, target: 100, current: 85 },
        { id: "KR009", title: "Achieve 95% test coverage", progress: 70, target: 95, current: 67 },
      ],
      lastUpdated: "2024-01-14",
    },
    {
      id: "TEAM002",
      title: "Improve Customer Support Response Time",
      description: "Reduce average response time and increase customer satisfaction",
      team: "Customer Support",
      teamId: "TEAM_CS",
      manager: "Maria Rodriguez",
      managerId: "EMP009",
      priority: "medium",
      status: "completed",
      progress: 100,
      startDate: "2023-10-01",
      dueDate: "2024-01-31",
      teamMembers: [
        { id: "EMP010", name: "Alex Thompson", role: "Support Lead", contribution: 95 },
        { id: "EMP011", name: "Emma Davis", role: "Support Specialist", contribution: 88 },
        { id: "EMP012", name: "Ryan Park", role: "Support Specialist", contribution: 92 },
      ],
      keyResults: [
        { id: "KR010", title: "Reduce response time to under 2 hours", progress: 100, target: 2, current: 1.5 },
        { id: "KR011", title: "Achieve 95% customer satisfaction", progress: 100, target: 95, current: 97 },
        { id: "KR012", title: "Implement 24/7 support coverage", progress: 100, target: 100, current: 100 },
      ],
      lastUpdated: "2024-01-31",
    },
  ])

  // Mock company goals data
  const [companyGoals, setCompanyGoals] = useState([
    {
      id: "COMP001",
      title: "Achieve 40% Revenue Growth",
      description: "Drive significant revenue growth through new products and market expansion",
      owner: "Executive Team",
      priority: "high",
      status: "onTrack",
      progress: 68,
      startDate: "2024-01-01",
      dueDate: "2024-12-31",
      departments: ["Sales", "Marketing", "Product", "Engineering"],
      keyResults: [
        { id: "KR013", title: "Increase ARR to $50M", progress: 70, target: 50000000, current: 35000000 },
        { id: "KR014", title: "Launch 3 new product features", progress: 67, target: 3, current: 2 },
        { id: "KR015", title: "Expand to 2 new markets", progress: 50, target: 2, current: 1 },
      ],
      lastUpdated: "2024-01-15",
    },
    {
      id: "COMP002",
      title: "Improve Employee Satisfaction",
      description: "Create a better workplace culture and improve employee retention",
      owner: "HR Team",
      priority: "high",
      status: "onTrack",
      progress: 75,
      startDate: "2024-01-01",
      dueDate: "2024-12-31",
      departments: ["HR", "All Departments"],
      keyResults: [
        { id: "KR016", title: "Achieve 4.5/5 employee satisfaction score", progress: 80, target: 4.5, current: 4.2 },
        { id: "KR017", title: "Reduce turnover rate to under 8%", progress: 70, target: 8, current: 9.2 },
        { id: "KR018", title: "Implement 5 new employee benefits", progress: 80, target: 5, current: 4 },
      ],
      lastUpdated: "2024-01-10",
    },
  ])

  useEffect(() => {
    fetchGoalsData()
  }, [activeTab])

  const fetchGoalsData = async () => {
    setLoading(true)
    try {
      // CURSOR: API call to GET /api/v1/hcm/performance/goals/progress
      // CURSOR: API call to GET /api/v1/hcm/performance/goals/individual
      // CURSOR: API call to GET /api/v1/hcm/performance/goals/team
      // CURSOR: API call to GET /api/v1/hcm/performance/goals/company
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching goals data:", error)
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      onTrack: "bg-green-100 text-green-800",
      atRisk: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
      notStarted: "bg-gray-100 text-gray-800",
      overdue: "bg-red-100 text-red-800",
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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 60) return "bg-blue-500"
    if (progress >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const metricsCards = [
    {
      title: t("goals.metrics.totalGoals"),
      value: metrics.totalGoals.value.toString(),
      change: metrics.totalGoals.change,
      trend: metrics.totalGoals.trend,
      icon: Target,
      color: "text-blue-600",
    },
    {
      title: t("goals.metrics.onTrack"),
      value: metrics.onTrack.value.toString(),
      change: metrics.onTrack.change,
      trend: metrics.onTrack.trend,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: t("goals.metrics.atRisk"),
      value: metrics.atRisk.value.toString(),
      change: metrics.atRisk.change,
      trend: metrics.atRisk.trend,
      icon: AlertCircle,
      color: "text-yellow-600",
    },
    {
      title: t("goals.metrics.completed"),
      value: metrics.completed.value.toString(),
      change: metrics.completed.change,
      trend: metrics.completed.trend,
      icon: Trophy,
      color: "text-purple-600",
    },
    {
      title: t("goals.metrics.avgProgress"),
      value: `${metrics.avgProgress.value}%`,
      change: metrics.avgProgress.change,
      trend: metrics.avgProgress.trend,
      icon: TrendingUp,
      color: "text-indigo-600",
    },
    {
      title: t("goals.metrics.dueThisMonth"),
      value: metrics.dueThisMonth.value.toString(),
      change: metrics.dueThisMonth.change,
      trend: metrics.dueThisMonth.trend,
      icon: Calendar,
      color: "text-orange-600",
    },
  ]

  const renderGoalCard = (goal: any, type: string) => (
    <Card key={goal.id} className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{goal.title}</CardTitle>
            <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{type === 'individual' ? goal.owner : type === 'team' ? goal.team : goal.owner}</span>
              </div>
              {goal.department && (
                <div className="flex items-center space-x-1">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{goal.department}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{goal.dueDate}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant="outline" className={getStatusColor(goal.status)}>
              {t(`common.${goal.status}`)}
            </Badge>
            <Badge variant="outline" className={getPriorityColor(goal.priority)}>
              {t(`common.${goal.priority}`)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-bold">{goal.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(goal.progress)}`}
              style={{ width: `${goal.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Key Results */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Key Results</h4>
          {goal.keyResults.map((kr: any) => (
            <div key={kr.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{kr.title}</span>
                <span className="text-xs font-bold">{kr.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(kr.progress)}`}
                  style={{ width: `${kr.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Current: {typeof kr.current === 'number' && kr.current > 1000 
                    ? formatCurrency(kr.current) 
                    : kr.current}
                </span>
                <span>
                  Target: {typeof kr.target === 'number' && kr.target > 1000 
                    ? formatCurrency(kr.target) 
                    : kr.target}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Team Members (for team goals) */}
        {type === 'team' && goal.teamMembers && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium text-sm mb-3">Team Contributions</h4>
            <div className="space-y-2">
              {goal.teamMembers.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${member.contribution}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium w-8">{member.contribution}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <span className="text-xs text-muted-foreground">
            Updated: {goal.lastUpdated}
          </span>
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
        </div>
      </CardContent>
    </Card>
  )

  const renderAnalytics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Goal Completion Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Completion Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">This Quarter</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-green-600">78%</span>
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Last Quarter</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold">65%</span>
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Year to Date</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-blue-600">71%</span>
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Building className="h-5 w-5 mr-2 text-blue-600" />
            Department Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Engineering</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm font-medium w-8">85%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Sales</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
                <span className="text-sm font-medium w-8">72%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Marketing</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <span className="text-sm font-medium w-8">68%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">HR</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
                <span className="text-sm font-medium w-8">90%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-purple-600" />
            Goal Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Revenue Growth</span>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                32%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Product Development</span>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                28%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Customer Satisfaction</span>
              <Badge variant="outline" className="bg-purple-100 text-purple-800">
                20%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Employee Development</span>
              <Badge variant="outline" className="bg-orange-100 text-orange-800">
                20%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">High Risk Goals</span>
              <Badge variant="outline" className="bg-red-100 text-red-800">
                8
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Medium Risk Goals</span>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                15
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Low Risk Goals</span>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                133
              </Badge>
            </div>
            <div className="pt-2 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">85%</div>
                <div className="text-xs text-muted-foreground">Goals on Track</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Average Goal Duration</span>
              <span className="font-medium">4.2 months</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Goals per Employee</span>
              <span className="font-medium">2.8</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Key Results per Goal</span>
              <span className="font-medium">3.2</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Update Frequency</span>
              <span className="font-medium">Weekly</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span>Goal Alignment Score</span>
                <span className="font-medium text-green-600">92%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-5 w-5 mr-2 text-orange-600" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Q1 Sales Target</div>
                <div className="text-xs text-muted-foreground">Ahmed Al-Rashid</div>
              </div>
              <Badge variant="outline" className="bg-red-100 text-red-800">
                3 days
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Product Launch</div>
                <div className="text-xs text-muted-foreground">Engineering Team</div>
              </div>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                2 weeks
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Training Completion</div>
                <div className="text-xs text-muted-foreground">John Smith</div>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                1 month
              </Badge>
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
            <p className="text-muted-foreground">Loading goals data...</p>
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
          <h2 className="text-2xl font-bold text-foreground">{t("goals.title")}</h2>
          <p className="text-sm text-muted-foreground">{t("goals.description")}</p>
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
            {t("common.add")}
          </Button>
        </div>
      </div>

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
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="individual" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{t("goals.tabs.individual")}</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{t("goals.tabs.team")}</span>
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>{t("goals.tabs.company")}</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>{t("goals.tabs.analytics")}</span>
              </TabsTrigger>
            </TabsList>

            {/* Search and Filter Bar */}
            {activeTab !== "analytics" && (
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
                      <SelectItem value="onTrack">On Track</SelectItem>
                      <SelectItem value="atRisk">At Risk</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <TabsContent value="individual" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {individualGoals.map((goal) => renderGoalCard(goal, 'individual'))}
              </div>
            </TabsContent>

            <TabsContent value="team" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {teamGoals.map((goal) => renderGoalCard(goal, 'team'))}
              </div>
            </TabsContent>

            <TabsContent value="company" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {companyGoals.map((goal) => renderGoalCard(goal, 'company'))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              {renderAnalytics()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default GoalTrackingDashboard
