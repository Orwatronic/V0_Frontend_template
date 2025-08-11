"use client"

import { Button } from "@/components/ui/button"
import { FileText, DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react'
import { DatePickerWithRange } from "./analytics/date-range-picker"
import { KpiCard } from "./analytics/kpi-card"
import { ExpenseBreakdownChart } from "./analytics/expense-breakdown-chart"
import { TopCustomersTable } from "./analytics/top-customers-table"
import { EmployeeTurnoverChart } from "./analytics/employee-turnover-chart"
import { SalesByRegionMap } from "./analytics/sales-by-region-map"
import { StockDemandForecastChart } from "./analytics/stock-demand-forecast-chart"
import { SupplierPerformanceDashboard } from "./analytics/supplier-performance-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export default function AnalyticsDashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-muted/40 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">A high-level overview of your business metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <DatePickerWithRange />
          <Button onClick={() => (window.location.href = "/reports")}>
            <FileText className="h-4 w-4 mr-2" />
            Custom Reports
          </Button>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Revenue" value="$1,345,987" icon={DollarSign} change="+20.1% from last month" changeType="increase" />
        <KpiCard title="Subscriptions" value="+2350" icon={Users} change="+180.1% from last month" changeType="increase" />
        <KpiCard title="Sales" value="+12,234" icon={ShoppingCart} change="+19% from last month" changeType="increase" />
        <KpiCard title="Gross Profit Margin" value="45.6%" icon={TrendingUp} change="-1.2% from last month" changeType="decrease" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Chart Area - Map */}
        <div className="lg:col-span-2">
           <SalesByRegionMap />
        </div>
        
        {/* Top Customers Table */}
        <div>
          <TopCustomersTable />
        </div>

        {/* Expense Breakdown Chart */}
        <div>
          <ExpenseBreakdownChart />
        </div>

        {/* NEWLY ADDED SUPPLIER DASHBOARD */}
        <div>
          <SupplierPerformanceDashboard />
        </div>

        {/* Employee Turnover Chart */}
        <div>
          <EmployeeTurnoverChart />
        </div>

        {/* Stock vs Demand Forecast Chart */}
        <div className="lg:col-span-3">
          <StockDemandForecastChart />
        </div>
      </div>
    </div>
  )
}
