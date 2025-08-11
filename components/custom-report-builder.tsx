"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import { Plus, Trash2, Save, Download, Eye, Settings, Database, Filter, BarChart3, LineChartIcon, PieChartIcon, TableIcon, Calendar, Users, DollarSign, Package, FileText } from 'lucide-react'

// Mock data sources from all ERP modules
const dataSources = {
  sales: {
    name: "Sales Orders",
    icon: DollarSign,
    tables: {
      orders: {
        name: "Sales Orders",
        fields: [
          { name: "order_id", type: "string", label: "Order ID" },
          { name: "customer_name", type: "string", label: "Customer" },
          { name: "order_date", type: "date", label: "Order Date" },
          { name: "total_amount", type: "number", label: "Total Amount" },
          { name: "status", type: "string", label: "Status" },
          { name: "sales_rep", type: "string", label: "Sales Rep" }
        ]
      },
      customers: {
        name: "Customers",
        fields: [
          { name: "customer_id", type: "string", label: "Customer ID" },
          { name: "company_name", type: "string", label: "Company Name" },
          { name: "industry", type: "string", label: "Industry" },
          { name: "credit_limit", type: "number", label: "Credit Limit" },
          { name: "region", type: "string", label: "Region" }
        ]
      }
    }
  },
  financial: {
    name: "Financial",
    icon: FileText,
    tables: {
      gl_accounts: {
        name: "GL Accounts",
        fields: [
          { name: "account_code", type: "string", label: "Account Code" },
          { name: "account_name", type: "string", label: "Account Name" },
          { name: "account_type", type: "string", label: "Account Type" },
          { name: "balance", type: "number", label: "Balance" }
        ]
      },
      invoices: {
        name: "Invoices",
        fields: [
          { name: "invoice_id", type: "string", label: "Invoice ID" },
          { name: "customer_name", type: "string", label: "Customer" },
          { name: "invoice_date", type: "date", label: "Invoice Date" },
          { name: "amount", type: "number", label: "Amount" },
          { name: "status", type: "string", label: "Status" }
        ]
      }
    }
  },
  inventory: {
    name: "Inventory",
    icon: Package,
    tables: {
      materials: {
        name: "Materials",
        fields: [
          { name: "material_id", type: "string", label: "Material ID" },
          { name: "material_name", type: "string", label: "Material Name" },
          { name: "category", type: "string", label: "Category" },
          { name: "stock_quantity", type: "number", label: "Stock Quantity" },
          { name: "unit_price", type: "number", label: "Unit Price" }
        ]
      }
    }
  },
  hr: {
    name: "Human Resources",
    icon: Users,
    tables: {
      employees: {
        name: "Employees",
        fields: [
          { name: "employee_id", type: "string", label: "Employee ID" },
          { name: "full_name", type: "string", label: "Full Name" },
          { name: "department", type: "string", label: "Department" },
          { name: "position", type: "string", label: "Position" },
          { name: "salary", type: "number", label: "Salary" },
          { name: "hire_date", type: "date", label: "Hire Date" }
        ]
      }
    }
  }
}

// Mock data for charts
const mockChartData = [
  { name: 'Jan', value: 4000, sales: 2400, orders: 24 },
  { name: 'Feb', value: 3000, sales: 1398, orders: 18 },
  { name: 'Mar', value: 2000, sales: 9800, orders: 32 },
  { name: 'Apr', value: 2780, sales: 3908, orders: 28 },
  { name: 'May', value: 1890, sales: 4800, orders: 35 },
  { name: 'Jun', value: 2390, sales: 3800, orders: 29 }
]

const chartTypes = [
  { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
  { value: 'line', label: 'Line Chart', icon: LineChartIcon },
  { value: 'pie', label: 'Pie Chart', icon: PieChartIcon },
  { value: 'table', label: 'Data Table', icon: TableIcon }
]

const aggregationTypes = [
  { value: 'sum', label: 'Sum' },
  { value: 'avg', label: 'Average' },
  { value: 'count', label: 'Count' },
  { value: 'min', label: 'Minimum' },
  { value: 'max', label: 'Maximum' }
]

const filterOperators = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'between', label: 'Between' }
]

export function CustomReportBuilder() {
  const [reportConfig, setReportConfig] = useState({
    name: "",
    description: "",
    dataSource: "",
    table: "",
    fields: [],
    chartType: "bar",
    filters: [],
    groupBy: "",
    sortBy: "",
    aggregation: "sum"
  })

  const [savedReports, setSavedReports] = useState([
    { id: 1, name: "Monthly Sales Report", description: "Sales performance by month", lastModified: "2024-01-15" },
    { id: 2, name: "Inventory Status", description: "Current stock levels", lastModified: "2024-01-14" },
    { id: 3, name: "Employee Performance", description: "HR metrics dashboard", lastModified: "2024-01-13" }
  ])

  const [previewData, setPreviewData] = useState(mockChartData)
  const [activeTab, setActiveTab] = useState("builder")

  const handleFieldSelection = (field, checked) => {
    if (checked) {
      setReportConfig(prev => ({
        ...prev,
        fields: [...prev.fields, field]
      }))
    } else {
      setReportConfig(prev => ({
        ...prev,
        fields: prev.fields.filter(f => f.name !== field.name)
      }))
    }
  }

  const addFilter = () => {
    setReportConfig(prev => ({
      ...prev,
      filters: [...prev.filters, { field: "", operator: "equals", value: "" }]
    }))
  }

  const updateFilter = (index, key, value) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.map((filter, i) => 
        i === index ? { ...filter, [key]: value } : filter
      )
    }))
  }

  const removeFilter = (index) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index)
    }))
  }

  const saveReport = () => {
    // CURSOR: API call to POST /api/v1/analytics/reports
    const newReport = {
      id: savedReports.length + 1,
      name: reportConfig.name,
      description: reportConfig.description,
      lastModified: new Date().toISOString().split('T')[0],
      config: reportConfig
    }
    setSavedReports(prev => [...prev, newReport])
    alert("Report saved successfully!")
  }

  const loadReport = (report) => {
    if (report.config) {
      setReportConfig(report.config)
    }
    setActiveTab("builder")
  }

  const exportReport = (format) => {
    // CURSOR: API call to POST /api/v1/analytics/reports/export
    alert(`Exporting report as ${format.toUpperCase()}...`)
  }

  const renderChart = () => {
    switch (reportConfig.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={previewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={previewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        )
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={previewData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {previewData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      case 'table':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Orders</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.value.toLocaleString()}</TableCell>
                  <TableCell>{row.sales.toLocaleString()}</TableCell>
                  <TableCell>{row.orders}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      default:
        return <div className="text-center text-muted-foreground">Select a chart type to preview</div>
    }
  }

  const currentDataSource = dataSources[reportConfig.dataSource]
  const currentTable = currentDataSource?.tables[reportConfig.table]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Custom Report Builder</h1>
          <p className="text-muted-foreground">Create interactive reports from your ERP data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={saveReport} disabled={!reportConfig.name}>
            <Save className="h-4 w-4 mr-2" />
            Save Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration Panel */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Report Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reportName">Report Name</Label>
                    <Input
                      id="reportName"
                      value={reportConfig.name}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter report name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={reportConfig.description}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your report"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Data Source</Label>
                    <Select 
                      value={reportConfig.dataSource} 
                      onValueChange={(value) => setReportConfig(prev => ({ ...prev, dataSource: value, table: "", fields: [] }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select data source" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(dataSources).map(([key, source]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <source.icon className="h-4 w-4" />
                              {source.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {currentDataSource && (
                    <div className="space-y-2">
                      <Label>Table</Label>
                      <Select 
                        value={reportConfig.table} 
                        onValueChange={(value) => setReportConfig(prev => ({ ...prev, table: value, fields: [] }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select table" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(currentDataSource.tables).map(([key, table]) => (
                            <SelectItem key={key} value={key}>
                              {table.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Chart Type</Label>
                    <Select 
                      value={reportConfig.chartType} 
                      onValueChange={(value) => setReportConfig(prev => ({ ...prev, chartType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {chartTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Fields Selection */}
              {currentTable && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Select Fields
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentTable.fields.map((field) => (
                        <div key={field.name} className="flex items-center space-x-2">
                          <Checkbox
                            id={field.name}
                            checked={reportConfig.fields.some(f => f.name === field.name)}
                            onCheckedChange={(checked) => handleFieldSelection(field, checked)}
                          />
                          <Label htmlFor={field.name} className="flex-1">
                            {field.label}
                            <Badge variant="outline" className="ml-2 text-xs">
                              {field.type}
                            </Badge>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Filters and Options */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                    <Button size="sm" variant="outline" onClick={addFilter}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reportConfig.filters.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No filters added yet</p>
                  ) : (
                    <div className="space-y-3">
                      {reportConfig.filters.map((filter, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Select 
                            value={filter.field} 
                            onValueChange={(value) => updateFilter(index, 'field', value)}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              {currentTable?.fields.map((field) => (
                                <SelectItem key={field.name} value={field.name}>
                                  {field.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Select 
                            value={filter.operator} 
                            onValueChange={(value) => updateFilter(index, 'operator', value)}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {filterOperators.map((op) => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Input
                            value={filter.value}
                            onChange={(e) => updateFilter(index, 'value', e.target.value)}
                            placeholder="Filter value"
                            className="flex-1"
                          />
                          
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => removeFilter(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Grouping & Sorting</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Group By</Label>
                      <Select 
                        value={reportConfig.groupBy} 
                        onValueChange={(value) => setReportConfig(prev => ({ ...prev, groupBy: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field to group by" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentTable?.fields.map((field) => (
                            <SelectItem key={field.name} value={field.name}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Sort By</Label>
                      <Select 
                        value={reportConfig.sortBy} 
                        onValueChange={(value) => setReportConfig(prev => ({ ...prev, sortBy: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field to sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentTable?.fields.map((field) => (
                            <SelectItem key={field.name} value={field.name}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Aggregation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label>Aggregation Type</Label>
                      <Select 
                        value={reportConfig.aggregation} 
                        onValueChange={(value) => setReportConfig(prev => ({ ...prev, aggregation: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {aggregationTypes.map((agg) => (
                            <SelectItem key={agg.value} value={agg.value}>
                              {agg.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Report Preview
                {reportConfig.name && (
                  <Badge variant="outline">{reportConfig.name}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reportConfig.chartType ? (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Data Source: {currentDataSource?.name} → {currentTable?.name}
                  </div>
                  {renderChart()}
                  {reportConfig.fields.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Selected Fields:</h4>
                      <div className="flex flex-wrap gap-2">
                        {reportConfig.fields.map((field) => (
                          <Badge key={field.name} variant="secondary">
                            {field.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Configure your report settings to see a preview
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>{report.description}</TableCell>
                      <TableCell>{report.lastModified}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => loadReport(report)}>
                            Load
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => exportReport('pdf')}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
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
