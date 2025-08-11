"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Search, Filter, Download, Star, MapPin, Phone, Mail, Calendar, TrendingUp, TrendingDown, Minus, Award, Shield, Truck, DollarSign, Clock, AlertTriangle, CheckCircle, Building, Users, FileText, BarChart3, Target, Zap } from 'lucide-react'

// Mock vendor data
const mockVendors = [
  {
    id: "VEN001",
    name: "Steel Corp Industries",
    category: "Raw Materials",
    location: "Pittsburgh, PA",
    contactPerson: "John Smith",
    phone: "+1-412-555-0123",
    email: "john.smith@steelcorp.com",
    contractStatus: "preferred",
    riskLevel: "low",
    overallPerformance: 94,
    qualityScore: 96,
    deliveryScore: 92,
    costScore: 89,
    serviceScore: 95,
    leadTime: 7,
    defectRate: 0.2,
    totalOrders: 156,
    totalValue: 2450000,
    responseTime: 2.5,
    lastAudit: "2024-01-10",
    certifications: ["ISO 9001", "AS9100", "ISO 14001"],
    sustainabilityScore: 88,
    trend: "up",
    priceCompetitiveness: 92,
    contractExpiry: "2024-12-31",
    paymentTerms: "Net 30",
    minimumOrder: 1000,
  },
  {
    id: "VEN002",
    name: "Global Electronics Supply",
    category: "Electronics",
    location: "San Jose, CA",
    contactPerson: "Sarah Chen",
    phone: "+1-408-555-0456",
    email: "sarah.chen@globalsupply.com",
    contractStatus: "active",
    riskLevel: "medium",
    overallPerformance: 87,
    qualityScore: 89,
    deliveryScore: 85,
    costScore: 91,
    serviceScore: 83,
    leadTime: 14,
    defectRate: 0.8,
    totalOrders: 89,
    totalValue: 1850000,
    responseTime: 4.2,
    lastAudit: "2023-11-15",
    certifications: ["ISO 9001", "RoHS", "REACH"],
    sustainabilityScore: 76,
    trend: "down",
    priceCompetitiveness: 88,
    contractExpiry: "2024-08-15",
    paymentTerms: "Net 45",
    minimumOrder: 500,
  },
  {
    id: "VEN003",
    name: "Premium Logistics Partners",
    category: "Logistics",
    location: "Chicago, IL",
    contactPerson: "Mike Johnson",
    phone: "+1-312-555-0789",
    email: "mike.johnson@premiumlogistics.com",
    contractStatus: "active",
    riskLevel: "low",
    overallPerformance: 91,
    qualityScore: 93,
    deliveryScore: 95,
    costScore: 85,
    serviceScore: 92,
    leadTime: 3,
    defectRate: 0.1,
    totalOrders: 234,
    totalValue: 890000,
    responseTime: 1.8,
    lastAudit: "2024-01-05",
    certifications: ["ISO 9001", "C-TPAT", "SmartWay"],
    sustainabilityScore: 92,
    trend: "up",
    priceCompetitiveness: 79,
    contractExpiry: "2025-03-20",
    paymentTerms: "Net 15",
    minimumOrder: 100,
  },
  {
    id: "VEN004",
    name: "Quality Components Ltd",
    category: "Components",
    location: "Detroit, MI",
    contactPerson: "Lisa Rodriguez",
    phone: "+1-313-555-0321",
    email: "lisa.rodriguez@qualitycomp.com",
    contractStatus: "inactive",
    riskLevel: "high",
    overallPerformance: 72,
    qualityScore: 68,
    deliveryScore: 74,
    costScore: 78,
    serviceScore: 69,
    leadTime: 21,
    defectRate: 2.1,
    totalOrders: 45,
    totalValue: 650000,
    responseTime: 6.8,
    lastAudit: "2023-08-22",
    certifications: ["ISO 9001"],
    sustainabilityScore: 65,
    trend: "down",
    priceCompetitiveness: 85,
    contractExpiry: "2023-12-31",
    paymentTerms: "Net 60",
    minimumOrder: 2000,
  },
]

export function VendorSelectionInterface() {
  const [vendors, setVendors] = useState(mockVendors)
  const [filteredVendors, setFilteredVendors] = useState(mockVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("all")
  const [selectedContractStatus, setSelectedContractStatus] = useState("all")
  const [sortBy, setSortBy] = useState("overallPerformance")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("search")

  // Filter and sort vendors
  useEffect(() => {
    let filtered = vendors.filter(vendor => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vendor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === "all" || vendor.category === selectedCategory
      const matchesRisk = selectedRiskLevel === "all" || vendor.riskLevel === selectedRiskLevel
      const matchesContract = selectedContractStatus === "all" || vendor.contractStatus === selectedContractStatus
      
      return matchesSearch && matchesCategory && matchesRisk && matchesContract
    })

    // Sort vendors
    filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a]
      const bValue = b[sortBy as keyof typeof b]
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
      }
      
      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()
      return sortOrder === 'desc' ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr)
    })

    setFilteredVendors(filtered)
  }, [vendors, searchTerm, selectedCategory, selectedRiskLevel, selectedContractStatus, sortBy, sortOrder])

  const handleVendorSelect = (vendorId: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    )
  }

  const getStatusColor = (status: string) => {
    const colors = {
      preferred: "bg-green-100 text-green-800",
      active: "bg-blue-100 text-blue-800",
      inactive: "bg-gray-100 text-gray-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getRiskColor = (risk: string) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    }
    return colors[risk as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  const exportVendorData = () => {
    // CURSOR: API call to POST /api/v1/materials/vendors/export
    console.log("Exporting vendor data...")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Vendor Selection & Comparison</h2>
          <p className="text-muted-foreground">Compare and select the best vendors for your procurement needs</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportVendorData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Vendor Search</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Vendor Comparison</TabsTrigger>
        </TabsList>

        {/* Vendor Search Tab */}
        <TabsContent value="search" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search & Filter Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="search">Search Vendors</Label>
                  <Input
                    id="search"
                    placeholder="Search by name, location, category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Raw Materials">Raw Materials</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Logistics">Logistics</SelectItem>
                      <SelectItem value="Components">Components</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="risk">Risk Level</Label>
                  <Select value={selectedRiskLevel} onValueChange={setSelectedRiskLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Risk Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contract">Contract Status</Label>
                  <Select value={selectedContractStatus} onValueChange={setSelectedContractStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="preferred">Preferred</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sort">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overallPerformance">Overall Performance</SelectItem>
                      <SelectItem value="qualityScore">Quality Score</SelectItem>
                      <SelectItem value="deliveryScore">Delivery Score</SelectItem>
                      <SelectItem value="costScore">Cost Score</SelectItem>
                      <SelectItem value="totalValue">Total Value</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map((vendor) => (
              <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedVendors.includes(vendor.id)}
                        onCheckedChange={() => handleVendorSelect(vendor.id)}
                      />
                      <div>
                        <CardTitle className="text-lg">{vendor.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {vendor.location}
                        </CardDescription>
                      </div>
                    </div>
                    {getTrendIcon(vendor.trend)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(vendor.contractStatus)}>
                      {vendor.contractStatus}
                    </Badge>
                    <Badge className={getRiskColor(vendor.riskLevel)}>
                      {vendor.riskLevel} risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Performance Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Performance</span>
                      <span className={`text-sm font-bold ${getPerformanceColor(vendor.overallPerformance)}`}>
                        {vendor.overallPerformance}%
                      </span>
                    </div>
                    <Progress value={vendor.overallPerformance} className="h-2" />
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 mr-1 text-yellow-500" />
                      Quality: {vendor.qualityScore}%
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-3 w-3 mr-1 text-blue-500" />
                      Delivery: {vendor.deliveryScore}%
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 mr-1 text-green-500" />
                      Cost: {vendor.costScore}%
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-purple-500" />
                      Lead: {vendor.leadTime}d
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {vendor.contactPerson}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {vendor.phone}
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="flex flex-wrap gap-1">
                    {vendor.certifications.slice(0, 2).map((cert) => (
                      <Badge key={cert} variant="outline" className="text-xs">
                        <Award className="h-2 w-2 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                    {vendor.certifications.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{vendor.certifications.length - 2} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance Analysis Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Vendor Performance Analysis
              </CardTitle>
              <CardDescription>
                Comprehensive performance metrics for all vendors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Vendor</th>
                      <th className="text-center p-2">Overall</th>
                      <th className="text-center p-2">Quality</th>
                      <th className="text-center p-2">Delivery</th>
                      <th className="text-center p-2">Cost</th>
                      <th className="text-center p-2">Service</th>
                      <th className="text-center p-2">Lead Time</th>
                      <th className="text-center p-2">Defect Rate</th>
                      <th className="text-center p-2">Orders</th>
                      <th className="text-center p-2">Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVendors.map((vendor) => (
                      <tr key={vendor.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{vendor.name}</div>
                            <div className="text-xs text-muted-foreground">{vendor.category}</div>
                          </div>
                        </td>
                        <td className="text-center p-2">
                          <div className="flex items-center justify-center">
                            <span className={`font-bold ${getPerformanceColor(vendor.overallPerformance)}`}>
                              {vendor.overallPerformance}%
                            </span>
                            {getTrendIcon(vendor.trend)}
                          </div>
                        </td>
                        <td className="text-center p-2">
                          <span className={getPerformanceColor(vendor.qualityScore)}>
                            {vendor.qualityScore}%
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className={getPerformanceColor(vendor.deliveryScore)}>
                            {vendor.deliveryScore}%
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className={getPerformanceColor(vendor.costScore)}>
                            {vendor.costScore}%
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className={getPerformanceColor(vendor.serviceScore)}>
                            {vendor.serviceScore}%
                          </span>
                        </td>
                        <td className="text-center p-2">{vendor.leadTime}d</td>
                        <td className="text-center p-2">
                          <span className={vendor.defectRate > 1 ? "text-red-600" : "text-green-600"}>
                            {vendor.defectRate}%
                          </span>
                        </td>
                        <td className="text-center p-2">{vendor.totalOrders}</td>
                        <td className="text-center p-2">{vendor.responseTime}h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendor Comparison Tab */}
        <TabsContent value="comparison" className="space-y-4">
          {selectedVendors.length < 2 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select Vendors to Compare</h3>
                <p className="text-muted-foreground">
                  Please select at least 2 vendors from the search tab to enable comparison
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Vendor Comparison ({selectedVendors.length} vendors)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Metric</th>
                          {selectedVendors.map((vendorId) => {
                            const vendor = vendors.find(v => v.id === vendorId)
                            return (
                              <th key={vendorId} className="text-center p-3 min-w-[150px]">
                                <div>
                                  <div className="font-medium">{vendor?.name}</div>
                                  <Badge className={getStatusColor(vendor?.contractStatus || "")}>
                                    {vendor?.contractStatus}
                                  </Badge>
                                </div>
                              </th>
                            )
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { key: 'overallPerformance', label: 'Overall Performance', suffix: '%' },
                          { key: 'qualityScore', label: 'Quality Score', suffix: '%' },
                          { key: 'deliveryScore', label: 'Delivery Score', suffix: '%' },
                          { key: 'costScore', label: 'Cost Score', suffix: '%' },
                          { key: 'serviceScore', label: 'Service Score', suffix: '%' },
                          { key: 'leadTime', label: 'Lead Time', suffix: ' days' },
                          { key: 'defectRate', label: 'Defect Rate', suffix: '%' },
                          { key: 'responseTime', label: 'Response Time', suffix: ' hours' },
                          { key: 'totalValue', label: 'Total Value', prefix: '$', format: 'currency' },
                          { key: 'sustainabilityScore', label: 'Sustainability', suffix: '%' },
                        ].map((metric) => (
                          <tr key={metric.key} className="border-b hover:bg-muted/50">
                            <td className="p-3 font-medium">{metric.label}</td>
                            {selectedVendors.map((vendorId) => {
                              const vendor = vendors.find(v => v.id === vendorId)
                              const value = vendor?.[metric.key as keyof typeof vendor]
                              let displayValue = value
                              
                              if (metric.format === 'currency' && typeof value === 'number') {
                                displayValue = new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: 'USD',
                                  minimumFractionDigits: 0,
                                }).format(value)
                              } else {
                                displayValue = `${metric.prefix || ''}${value}${metric.suffix || ''}`
                              }
                              
                              return (
                                <td key={vendorId} className="text-center p-3">
                                  <span className={
                                    typeof value === 'number' && metric.suffix === '%' 
                                      ? getPerformanceColor(value as number)
                                      : ''
                                  }>
                                    {displayValue}
                                  </span>
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Risk Assessment & Mitigation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedVendors.map((vendorId) => {
                      const vendor = vendors.find(v => v.id === vendorId)
                      if (!vendor) return null
                      
                      return (
                        <Card key={vendorId}>
                          <CardHeader>
                            <CardTitle className="text-lg">{vendor.name}</CardTitle>
                            <Badge className={getRiskColor(vendor.riskLevel)}>
                              {vendor.riskLevel} Risk
                            </Badge>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <Label>Financial Stability</Label>
                              <Progress value={vendor.overallPerformance} className="h-2" />
                            </div>
                            <div>
                              <Label>Delivery Reliability</Label>
                              <Progress value={vendor.deliveryScore} className="h-2" />
                            </div>
                            <div>
                              <Label>Quality Consistency</Label>
                              <Progress value={vendor.qualityScore} className="h-2" />
                            </div>
                            <div className="pt-2 border-t">
                              <div className="text-xs text-muted-foreground">
                                <div className="flex items-center justify-between">
                                  <span>Last Audit:</span>
                                  <span>{vendor.lastAudit}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>Contract Expiry:</span>
                                  <span>{vendor.contractExpiry}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
