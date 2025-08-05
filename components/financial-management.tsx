"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/card"
import {
  DollarSign,
  Plus,
  Search,
  Download,
  Upload,
  Edit,
  Eye,
  MoreHorizontal,
  TrendingUp,
  Building,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

// Mock translation function
const useTranslation = () => {
  return {
    t: (key: string) => {
      const translations: Record<string, string> = {
        "modules.financial.title": "Financial Management",
        "modules.financial.description": "General Ledger, Accounts Payable/Receivable, Asset Accounting",
        "financial.metrics.revenue": "Total Revenue",
        "financial.metrics.expenses": "Total Expenses",
        "financial.metrics.profit": "Net Profit",
        "financial.metrics.cashflow": "Cash Flow",
        "financial.accounts.title": "Chart of Accounts",
        "financial.account.code": "Account Code",
        "financial.account.name": "Account Name",
        "financial.account.type": "Account Type",
        "financial.account.balance": "Balance",
        "financial.account.currency": "Currency",
        "common.search": "Search accounts...",
        "common.filter": "Filter",
        "common.add": "Add Account",
        "common.edit": "Edit",
        "common.delete": "Delete",
        "common.export": "Export",
        "common.import": "Import",
        "common.status": "Status",
        "common.active": "Active",
        "common.inactive": "Inactive",
        "common.pending": "Pending",
        "common.items": "accounts",
        "common.loading": "Loading...",
        "common.actions": "Actions",
      }
      return translations[key] || key
    },
  }
}

const FinancialManagement = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItems, setSelectedItems] = useState([])
  const [filterType, setFilterType] = useState("all")

  // Mock financial metrics
  const [metrics, setMetrics] = useState({
    revenue: { value: 2847392, change: 12.5, trend: "up", currency: "USD" },
    expenses: { value: 1892450, change: -3.2, trend: "down", currency: "USD" },
    profit: { value: 954942, change: 18.7, trend: "up", currency: "USD" },
    cashflow: { value: 1234567, change: 5.4, trend: "up", currency: "USD" },
  })

  // Mock chart of accounts data
  const mockAccounts = [
    {
      id: "1000",
      code: "1000",
      name: "Cash and Cash Equivalents",
      type: "Asset",
      balance: 1234567.89,
      currency: "USD",
      status: "active",
      level: 1,
      hasChildren: true,
    },
    {
      id: "1100",
      code: "1100",
      name: "Petty Cash",
      type: "Asset",
      balance: 5000.0,
      currency: "USD",
      status: "active",
      level: 2,
      hasChildren: false,
      parent: "1000",
    },
    {
      id: "1200",
      code: "1200",
      name: "Bank Account - Main",
      type: "Asset",
      balance: 1229567.89,
      currency: "USD",
      status: "active",
      level: 2,
      hasChildren: false,
      parent: "1000",
    },
    {
      id: "2000",
      code: "2000",
      name: "Accounts Payable",
      type: "Liability",
      balance: -456789.12,
      currency: "USD",
      status: "active",
      level: 1,
      hasChildren: true,
    },
    {
      id: "2100",
      code: "2100",
      name: "Trade Payables",
      type: "Liability",
      balance: -356789.12,
      currency: "USD",
      status: "active",
      level: 2,
      hasChildren: false,
      parent: "2000",
    },
    {
      id: "3000",
      code: "3000",
      name: "Equity",
      type: "Equity",
      balance: 2000000.0,
      currency: "USD",
      status: "active",
      level: 1,
      hasChildren: true,
    },
    {
      id: "4000",
      code: "4000",
      name: "Revenue",
      type: "Revenue",
      balance: 2847392.0,
      currency: "USD",
      status: "active",
      level: 1,
      hasChildren: true,
    },
    {
      id: "4100",
      code: "4100",
      name: "Sales Revenue",
      type: "Revenue",
      balance: 2647392.0,
      currency: "USD",
      status: "active",
      level: 2,
      hasChildren: false,
      parent: "4000",
    },
    {
      id: "5000",
      code: "5000",
      name: "Operating Expenses",
      type: "Expense",
      balance: 1892450.0,
      currency: "USD",
      status: "active",
      level: 1,
      hasChildren: true,
    },
    {
      id: "5100",
      code: "5100",
      name: "Cost of Goods Sold",
      type: "Expense",
      balance: 1200000.0,
      currency: "USD",
      status: "active",
      level: 2,
      hasChildren: false,
      parent: "5000",
    },
  ]

  useEffect(() => {
    fetchFinancialData()
  }, [])

  const fetchFinancialData = async () => {
    // Simulate API call to backend
    setLoading(true)
    try {
      // In real implementation, this would be:
      // const response = await fetch('/api/financial/accounts')
      // const data = await response.json()
      setTimeout(() => {
        setAccounts(mockAccounts)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching financial data:", error)
      setLoading(false)
    }
  }

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) || account.code.includes(searchTerm)
    const matchesFilter = filterType === "all" || account.type.toLowerCase() === filterType.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(Math.abs(amount))
  }

  const getAccountTypeColor = (type) => {
    const colors = {
      Asset: "bg-green-100 text-green-800",
      Liability: "bg-red-100 text-red-800",
      Equity: "bg-blue-100 text-blue-800",
      Revenue: "bg-purple-100 text-purple-800",
      Expense: "bg-orange-100 text-orange-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  const getBalanceColor = (balance, type) => {
    if (type === "Liability" || type === "Revenue") {
      return balance < 0 ? "text-green-600" : "text-red-600"
    }
    return balance >= 0 ? "text-green-600" : "text-red-600"
  }

  const metricsCards = [
    {
      title: t("financial.metrics.revenue"),
      value: metrics.revenue.value,
      change: metrics.revenue.change,
      trend: metrics.revenue.trend,
      currency: metrics.revenue.currency,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: t("financial.metrics.expenses"),
      value: metrics.expenses.value,
      change: metrics.expenses.change,
      trend: metrics.expenses.trend,
      currency: metrics.expenses.currency,
      icon: FileText,
      color: "text-red-600",
    },
    {
      title: t("financial.metrics.profit"),
      value: metrics.profit.value,
      change: metrics.profit.change,
      trend: metrics.profit.trend,
      currency: metrics.profit.currency,
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: t("financial.metrics.cashflow"),
      value: metrics.cashflow.value,
      change: metrics.cashflow.change,
      trend: metrics.cashflow.trend,
      currency: metrics.cashflow.currency,
      icon: Building,
      color: "text-purple-600",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-6 w-48 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="w-8 h-8 bg-primary/20 rounded-lg animate-pulse mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t("common.loading")}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Module Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Module Icon & Title */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{t("modules.financial.title")}</h1>
                  <p className="text-sm text-muted-foreground">{t("modules.financial.description")}</p>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t("common.export")}
              </Button>
              <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                {t("common.add")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Module Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <div className="text-2xl font-bold">{formatCurrency(metric.value, metric.currency)}</div>
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

          {/* Action Bar */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Search Input */}
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("common.search")}
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {/* Filter Dropdown */}
                  <select
                    className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="asset">Assets</option>
                    <option value="liability">Liabilities</option>
                    <option value="equity">Equity</option>
                    <option value="revenue">Revenue</option>
                    <option value="expense">Expenses</option>
                  </select>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    {t("common.import")}
                  </Button>
                  <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    {t("common.add")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart of Accounts Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t("financial.accounts.title")}</span>
                <Badge variant="secondary">
                  {filteredAccounts.length} {t("common.items")}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input type="checkbox" className="rounded" />
                      </TableHead>
                      <TableHead>{t("financial.account.code")}</TableHead>
                      <TableHead>{t("financial.account.name")}</TableHead>
                      <TableHead>{t("financial.account.type")}</TableHead>
                      <TableHead className="text-right">{t("financial.account.balance")}</TableHead>
                      <TableHead>{t("financial.account.currency")}</TableHead>
                      <TableHead>{t("common.status")}</TableHead>
                      <TableHead className="w-12">{t("common.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((account) => (
                      <TableRow key={account.id} className="hover:bg-muted/50">
                        <TableCell>
                          <input type="checkbox" className="rounded" />
                        </TableCell>
                        <TableCell className="font-mono font-medium">{account.code}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="mr-2" style={{ marginLeft: `${(account.level - 1) * 20}px` }}>
                              {account.hasChildren && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                            </div>
                            <span className="font-medium">{account.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getAccountTypeColor(account.type)}>
                            {account.type}
                          </Badge>
                        </TableCell>
                        <TableCell className={`font-mono text-right ${getBalanceColor(account.balance, account.type)}`}>
                          {formatCurrency(account.balance, account.currency)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{account.currency}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={account.status === "active" ? "default" : "secondary"}
                            className={account.status === "active" ? "bg-green-100 text-green-800" : ""}
                          >
                            {t(`common.${account.status}`)}
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
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAccounts.length} of {accounts.length} accounts
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default FinancialManagement
