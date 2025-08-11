"use client"

import { useState, useEffect, useMemo } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MapPin, Route, Clock, Users, Package, TrendingUp, Play, Pause, CheckCircle, AlertCircle, MoreHorizontal, Eye, Edit, Zap, Target, Timer, Search, Filter, Download, Plus, Navigation, Activity, BarChart3, Settings } from 'lucide-react'

// Mock data structures
interface PickList {
  id: string
  orderId: string
  customerName: string
  priority: "high" | "medium" | "low"
  status: "pending" | "assigned" | "in_progress" | "completed" | "paused"
  assignedPicker: string | null
  totalItems: number
  pickedItems: number
  estimatedTime: number
  actualTime: number
  createdAt: string
  dueDate: string
  zone: string
  optimizationScore: number
}

interface Picker {
  id: string
  name: string
  status: "available" | "picking" | "break" | "offline"
  currentPickList: string | null
  efficiency: number
  itemsPerHour: number
  accuracy: number
  zone: string
  experience: "junior" | "senior" | "expert"
}

interface PickItem {
  id: string
  pickListId: string
  productId: string
  productName: string
  sku: string
  quantity: number
  pickedQuantity: number
  location: string
  zone: string
  aisle: string
  shelf: string
  bin: string
  weight: number
  status: "pending" | "picked" | "short" | "damaged"
  pickSequence: number
  estimatedPickTime: number
  actualPickTime: number
}

interface OptimizationSettings {
  mode: "distance" | "time" | "weight" | "zone"
  batchSize: number
  autoAssign: boolean
  considerPickerSkill: boolean
  prioritizeUrgent: boolean
}

const PickListOptimization = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [pickLists, setPickLists] = useState<PickList[]>([])
  const [pickers, setPickers] = useState<Picker[]>([])
  const [pickItems, setPickItems] = useState<PickItem[]>([])
  const [selectedPickList, setSelectedPickList] = useState<PickList | null>(null)
  const [optimizationSettings, setOptimizationSettings] = useState<OptimizationSettings>({
    mode: "distance",
    batchSize: 10,
    autoAssign: true,
    considerPickerSkill: true,
    prioritizeUrgent: true,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data initialization
  useEffect(() => {
    // CURSOR: API call to GET /api/v1/materials/pick-lists
    const mockPickLists: PickList[] = [
      {
        id: "PL001",
        orderId: "SO001",
        customerName: "TechCorp Solutions",
        priority: "high",
        status: "in_progress",
        assignedPicker: "PICK001",
        totalItems: 12,
        pickedItems: 8,
        estimatedTime: 45,
        actualTime: 32,
        createdAt: "2024-01-20T08:00:00Z",
        dueDate: "2024-01-20T14:00:00Z",
        zone: "A",
        optimizationScore: 92,
      },
      {
        id: "PL002",
        orderId: "SO002",
        customerName: "Global Manufacturing",
        priority: "medium",
        status: "assigned",
        assignedPicker: "PICK002",
        totalItems: 8,
        pickedItems: 0,
        estimatedTime: 30,
        actualTime: 0,
        createdAt: "2024-01-20T09:15:00Z",
        dueDate: "2024-01-20T16:00:00Z",
        zone: "B",
        optimizationScore: 88,
      },
      {
        id: "PL003",
        orderId: "SO003",
        customerName: "Retail Plus Inc",
        priority: "low",
        status: "pending",
        assignedPicker: null,
        totalItems: 15,
        pickedItems: 0,
        estimatedTime: 60,
        actualTime: 0,
        createdAt: "2024-01-20T10:30:00Z",
        dueDate: "2024-01-21T10:00:00Z",
        zone: "C",
        optimizationScore: 85,
      },
    ]

    // CURSOR: API call to GET /api/v1/materials/pickers
    const mockPickers: Picker[] = [
      {
        id: "PICK001",
        name: "John Smith",
        status: "picking",
        currentPickList: "PL001",
        efficiency: 95,
        itemsPerHour: 48,
        accuracy: 99.2,
        zone: "A",
        experience: "expert",
      },
      {
        id: "PICK002",
        name: "Sarah Johnson",
        status: "available",
        currentPickList: null,
        efficiency: 88,
        itemsPerHour: 42,
        accuracy: 98.5,
        zone: "B",
        experience: "senior",
      },
      {
        id: "PICK003",
        name: "Mike Wilson",
        status: "break",
        currentPickList: null,
        efficiency: 82,
        itemsPerHour: 38,
        accuracy: 97.8,
        zone: "C",
        experience: "junior",
      },
    ]

    // CURSOR: API call to GET /api/v1/materials/pick-items
    const mockPickItems: PickItem[] = [
      {
        id: "PI001",
        pickListId: "PL001",
        productId: "PROD001",
        productName: "Quantum Processor X1",
        sku: "QP-X1-2024",
        quantity: 2,
        pickedQuantity: 2,
        location: "A-01-03-B2",
        zone: "A",
        aisle: "01",
        shelf: "03",
        bin: "B2",
        weight: 0.5,
        status: "picked",
        pickSequence: 1,
        estimatedPickTime: 3,
        actualPickTime: 2.5,
      },
      {
        id: "PI002",
        pickListId: "PL001",
        productName: "HyperCore RAM 32GB",
        productId: "PROD002",
        sku: "HC-RAM-32G",
        quantity: 4,
        pickedQuantity: 4,
        location: "A-02-01-A1",
        zone: "A",
        aisle: "02",
        shelf: "01",
        bin: "A1",
        weight: 0.2,
        status: "picked",
        pickSequence: 2,
        estimatedPickTime: 4,
        actualPickTime: 3.8,
      },
    ]

    setPickLists(mockPickLists)
    setPickers(mockPickers)
    setPickItems(mockPickItems)
  }, [])

  // Computed metrics
  const metrics = useMemo(() => {
    const totalPickLists = pickLists.length
    const activePickLists = pickLists.filter(pl => pl.status === "in_progress").length
    const availablePickers = pickers.filter(p => p.status === "available").length
    const avgEfficiency = pickers.reduce((sum, p) => sum + p.efficiency, 0) / pickers.length || 0
    const completionRate = pickLists.filter(pl => pl.status === "completed").length / totalPickLists * 100 || 0

    return {
      totalPickLists,
      activePickLists,
      availablePickers,
      avgEfficiency,
      completionRate,
    }
  }, [pickLists, pickers])

  const filteredPickLists = useMemo(() => {
    return pickLists.filter(pl => {
      const matchesSearch = pl.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pl.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || pl.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [pickLists, searchTerm, statusFilter])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-700", label: "Pending" },
      assigned: { color: "bg-blue-100 text-blue-700", label: "Assigned" },
      in_progress: { color: "bg-green-100 text-green-700", label: "In Progress" },
      completed: { color: "bg-gray-100 text-gray-700", label: "Completed" },
      paused: { color: "bg-orange-100 text-orange-700", label: "Paused" },
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

  const getPickerStatusBadge = (status: string) => {
    const statusConfig = {
      available: { color: "bg-green-100 text-green-700", label: "Available" },
      picking: { color: "bg-blue-100 text-blue-700", label: "Picking" },
      break: { color: "bg-yellow-100 text-yellow-700", label: "On Break" },
      offline: { color: "bg-gray-100 text-gray-700", label: "Offline" },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || { color: "bg-gray-100", label: status }
    return <Badge className={`${config.color} border-0`}>{config.label}</Badge>
  }

  const handleOptimizeRoute = (pickListId: string) => {
    // CURSOR: API call to POST /api/v1/materials/pick-lists/{pickListId}/optimize
    console.log("Optimizing route for pick list:", pickListId, "with settings:", optimizationSettings)
    // Update pick list with optimized route
  }

  const handleAssignPicker = (pickListId: string, pickerId: string) => {
    // CURSOR: API call to POST /api/v1/materials/pick-lists/{pickListId}/assign
    console.log("Assigning picker", pickerId, "to pick list", pickListId)
    setPickLists(prev => prev.map(pl => 
      pl.id === pickListId ? { ...pl, assignedPicker: pickerId, status: "assigned" } : pl
    ))
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pick List Optimization</h1>
          <p className="text-muted-foreground">
            Optimize picking routes and manage warehouse operations efficiently
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Pick List
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="optimization">Route Optimization</TabsTrigger>
          <TabsTrigger value="tracking">Real-time Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Pick Lists</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activePickLists}</div>
                <p className="text-xs text-muted-foreground">
                  of {metrics.totalPickLists} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Pickers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.availablePickers}</div>
                <p className="text-xs text-muted-foreground">
                  of {pickers.length} total pickers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.avgEfficiency.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+2.3%</span> from yesterday
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.completionRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">On-time delivery rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Pick Time</CardTitle>
                <Timer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.8m</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">-0.2m</span> improvement
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Pick Lists Management */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Pick Lists</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search pick lists..."
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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pick List ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Assigned Picker</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPickLists.map((pickList) => (
                        <TableRow key={pickList.id}>
                          <TableCell className="font-medium">{pickList.id}</TableCell>
                          <TableCell>{pickList.customerName}</TableCell>
                          <TableCell>{getPriorityBadge(pickList.priority)}</TableCell>
                          <TableCell>{getStatusBadge(pickList.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress 
                                value={(pickList.pickedItems / pickList.totalItems) * 100} 
                                className="w-16"
                              />
                              <span className="text-sm text-muted-foreground">
                                {pickList.pickedItems}/{pickList.totalItems}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {pickList.assignedPicker ? (
                              pickers.find(p => p.id === pickList.assignedPicker)?.name || "Unknown"
                            ) : (
                              <span className="text-muted-foreground">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(pickList.dueDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedPickList(pickList)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOptimizeRoute(pickList.id)}>
                                  <Route className="mr-2 h-4 w-4" />
                                  Optimize Route
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Users className="mr-2 h-4 w-4" />
                                  Assign Picker
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Picker Status */}
            <Card>
              <CardHeader>
                <CardTitle>Picker Status</CardTitle>
                <CardDescription>Current status of all warehouse pickers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pickers.map((picker) => (
                  <div key={picker.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{picker.name}</p>
                      <p className="text-sm text-muted-foreground">Zone {picker.zone} • {picker.experience}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getPickerStatusBadge(picker.status)}
                        <span className="text-xs text-muted-foreground">
                          {picker.efficiency}% efficiency
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{picker.itemsPerHour} items/hr</p>
                      <p className="text-xs text-muted-foreground">{picker.accuracy}% accuracy</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Route Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Optimization Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Optimization Settings</CardTitle>
                <CardDescription>Configure route optimization parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="optimization-mode">Optimization Mode</Label>
                  <Select 
                    value={optimizationSettings.mode} 
                    onValueChange={(value: any) => setOptimizationSettings(prev => ({ ...prev, mode: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">Minimize Distance</SelectItem>
                      <SelectItem value="time">Minimize Time</SelectItem>
                      <SelectItem value="weight">Weight-based</SelectItem>
                      <SelectItem value="zone">Zone-based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="batch-size">Batch Size</Label>
                  <Input
                    id="batch-size"
                    type="number"
                    value={optimizationSettings.batchSize}
                    onChange={(e) => setOptimizationSettings(prev => ({ 
                      ...prev, 
                      batchSize: parseInt(e.target.value) 
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="auto-assign"
                      checked={optimizationSettings.autoAssign}
                      onChange={(e) => setOptimizationSettings(prev => ({ 
                        ...prev, 
                        autoAssign: e.target.checked 
                      }))}
                    />
                    <Label htmlFor="auto-assign">Auto-assign to pickers</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="consider-skill"
                      checked={optimizationSettings.considerPickerSkill}
                      onChange={(e) => setOptimizationSettings(prev => ({ 
                        ...prev, 
                        considerPickerSkill: e.target.checked 
                      }))}
                    />
                    <Label htmlFor="consider-skill">Consider picker skill level</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="prioritize-urgent"
                      checked={optimizationSettings.prioritizeUrgent}
                      onChange={(e) => setOptimizationSettings(prev => ({ 
                        ...prev, 
                        prioritizeUrgent: e.target.checked 
                      }))}
                    />
                    <Label htmlFor="prioritize-urgent">Prioritize urgent orders</Label>
                  </div>
                </div>

                <Button className="w-full" onClick={() => console.log("Running optimization...")}>
                  <Zap className="w-4 h-4 mr-2" />
                  Run Optimization
                </Button>
              </CardContent>
            </Card>

            {/* Optimization Results */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Route Optimization Results</CardTitle>
                <CardDescription>Optimized picking routes and assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pickLists.filter(pl => pl.status !== "completed").map((pickList) => (
                    <div key={pickList.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{pickList.id} - {pickList.customerName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {pickList.totalItems} items • Zone {pickList.zone}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-700">
                              {pickList.optimizationScore}% optimized
                            </Badge>
                            {getPriorityBadge(pickList.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Est. time: {formatTime(pickList.estimatedTime)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Suggested Route:</p>
                          <p className="font-medium">A-01 → A-02 → A-03 → B-01</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Best Picker:</p>
                          <p className="font-medium">
                            {pickList.assignedPicker ? 
                              pickers.find(p => p.id === pickList.assignedPicker)?.name : 
                              "Auto-assign available"
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <Navigation className="w-4 h-4 mr-2" />
                          View Route
                        </Button>
                        <Button size="sm" variant="outline">
                          <Users className="w-4 h-4 mr-2" />
                          Assign Picker
                        </Button>
                        <Button size="sm">
                          <Play className="w-4 h-4 mr-2" />
                          Start Picking
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Real-time Tracking Tab */}
        <TabsContent value="tracking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Pick Lists */}
            <Card>
              <CardHeader>
                <CardTitle>Active Pick Lists</CardTitle>
                <CardDescription>Real-time progress tracking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pickLists.filter(pl => pl.status === "in_progress").map((pickList) => (
                  <div key={pickList.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{pickList.id}</h4>
                        <p className="text-sm text-muted-foreground">{pickList.customerName}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Pause className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{pickList.pickedItems}/{pickList.totalItems} items</span>
                      </div>
                      <Progress value={(pickList.pickedItems / pickList.totalItems) * 100} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Picker</p>
                        <p className="font-medium">
                          {pickers.find(p => p.id === pickList.assignedPicker)?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Time Elapsed</p>
                        <p className="font-medium">{formatTime(pickList.actualTime)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Activity className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600">Currently picking in Zone {pickList.zone}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Pick Item Details */}
            <Card>
              <CardHeader>
                <CardTitle>Pick Item Details</CardTitle>
                <CardDescription>Item-by-item tracking for selected pick list</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedPickList ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{selectedPickList.id}</h4>
                      <Badge>{selectedPickList.status}</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {pickItems.filter(item => item.pickListId === selectedPickList.id).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-3">
                            {item.status === "picked" ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                            )}
                            <div>
                              <p className="font-medium text-sm">{item.productName}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.location} • Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">#{item.pickSequence}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(item.actualPickTime || item.estimatedPickTime)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Select a pick list to view item details
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Picking Performance</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+1.2%</span> from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Items/Hour</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42.8</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+3.2</span> improvement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.8%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600">+0.3%</span> from target
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On-time Completion</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96.5%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+2.1%</span> improvement
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Productivity Trends</CardTitle>
                <CardDescription>Items picked per hour over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Productivity chart would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Picker Performance</CardTitle>
                <CardDescription>Individual picker efficiency comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pickers.map((picker) => (
                    <div key={picker.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{picker.name}</p>
                        <p className="text-sm text-muted-foreground">Zone {picker.zone}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24">
                          <Progress value={picker.efficiency} />
                        </div>
                        <span className="text-sm font-medium w-12">{picker.efficiency}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Pick List Details Dialog */}
      {selectedPickList && (
        <Dialog open={!!selectedPickList} onOpenChange={() => setSelectedPickList(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Pick List Details - {selectedPickList.id}</DialogTitle>
              <DialogDescription>
                Detailed view of pick list items and progress
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Pick List Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer:</span>
                    <span>{selectedPickList.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority:</span>
                    {getPriorityBadge(selectedPickList.priority)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    {getStatusBadge(selectedPickList.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assigned Picker:</span>
                    <span>
                      {selectedPickList.assignedPicker ? 
                        pickers.find(p => p.id === selectedPickList.assignedPicker)?.name : 
                        "Unassigned"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Progress:</span>
                    <span>{selectedPickList.pickedItems}/{selectedPickList.totalItems} items</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Performance Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Time:</span>
                    <span>{formatTime(selectedPickList.estimatedTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Actual Time:</span>
                    <span>{formatTime(selectedPickList.actualTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Optimization Score:</span>
                    <span>{selectedPickList.optimizationScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Zone:</span>
                    <span>{selectedPickList.zone}</span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedPickList(null)}>
                Close
              </Button>
              <Button onClick={() => handleOptimizeRoute(selectedPickList.id)}>
                <Route className="w-4 h-4 mr-2" />
                Optimize Route
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default PickListOptimization
