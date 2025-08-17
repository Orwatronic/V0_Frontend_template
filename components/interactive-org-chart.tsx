"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  Handle,
  Position,
} from 'reactflow'
import ELK from 'elkjs/lib/elk.bundled.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Network, Users, Briefcase, Search, Filter, Download, Maximize2, Minimize2, Phone, Mail, MapPin, Calendar, Award, TrendingUp, Users2, Building, ChevronDown, ChevronRight, Eye, Edit, MoreHorizontal, Zap, Target, Clock, DollarSign } from 'lucide-react'
import type { Employee } from '@/types'
import { getLevelColor } from '@/lib/utils'

import 'reactflow/dist/style.css'

// Enhanced Mock Data with comprehensive employee information
const mockOrgData: Employee[] = [
  { 
    id: '1', 
    name: 'Michael Chen', 
    position: 'Chief Executive Officer', 
    department: 'Executive',
    managerId: null, 
    imageUrl: '/placeholder-user.jpg',
    email: 'michael.chen@feebee.com',
    phone: '+971-50-123-0001',
    location: 'Dubai, UAE',
    joinDate: '2019-01-15',
    salary: 25000,
    directReports: 3,
    level: 1,
    skills: ['Leadership', 'Strategy', 'Vision'],
    performance: 4.9,
    status: 'active'
  },
  { 
    id: '2', 
    name: 'Sarah Johnson', 
    position: 'VP Engineering', 
    department: 'Engineering',
    managerId: '1', 
    imageUrl: '/placeholder-user.jpg',
    email: 'sarah.johnson@feebee.com',
    phone: '+971-50-123-0002',
    location: 'Dubai, UAE',
    joinDate: '2020-03-10',
    salary: 18000,
    directReports: 8,
    level: 2,
    skills: ['Engineering Management', 'Architecture', 'Team Leadership'],
    performance: 4.8,
    status: 'active'
  },
  { 
    id: '3', 
    name: 'Lisa Chen', 
    position: 'VP Sales & Marketing', 
    department: 'Sales',
    managerId: '1', 
    imageUrl: '/placeholder-user.jpg',
    email: 'lisa.chen@feebee.com',
    phone: '+971-50-123-0003',
    location: 'Abu Dhabi, UAE',
    joinDate: '2020-06-01',
    salary: 16000,
    directReports: 12,
    level: 2,
    skills: ['Sales Strategy', 'Marketing', 'Customer Relations'],
    performance: 4.7,
    status: 'active'
  },
  { 
    id: '4', 
    name: 'David Wilson', 
    position: 'VP Finance & Operations', 
    department: 'Finance',
    managerId: '1', 
    imageUrl: '/placeholder-user.jpg',
    email: 'david.wilson@feebee.com',
    phone: '+971-50-123-0004',
    location: 'Dubai, UAE',
    joinDate: '2020-02-15',
    salary: 17000,
    directReports: 6,
    level: 2,
    skills: ['Financial Planning', 'Operations', 'Analytics'],
    performance: 4.6,
    status: 'active'
  },
  { 
    id: '5', 
    name: 'John Smith', 
    position: 'Senior Software Engineer', 
    department: 'Engineering',
    managerId: '2', 
    imageUrl: '/placeholder-user.jpg',
    email: 'john.smith@feebee.com',
    phone: '+971-50-123-0005',
    location: 'Dubai, UAE',
    joinDate: '2021-09-01',
    salary: 12000,
    directReports: 2,
    level: 3,
    skills: ['React', 'Node.js', 'TypeScript', 'System Design'],
    performance: 4.5,
    status: 'active'
  },
  { 
    id: '6', 
    name: 'Jane Doe', 
    position: 'Frontend Developer', 
    department: 'Engineering',
    managerId: '2', 
    imageUrl: '/placeholder-user.jpg',
    email: 'jane.doe@feebee.com',
    phone: '+971-50-123-0006',
    location: 'Dubai, UAE',
    joinDate: '2022-01-15',
    salary: 9000,
    directReports: 0,
    level: 3,
    skills: ['React', 'CSS', 'UI/UX', 'JavaScript'],
    performance: 4.3,
    status: 'active'
  },
  { 
    id: '7', 
    name: 'Ahmed Al-Rashid', 
    position: 'Sales Manager', 
    department: 'Sales',
    managerId: '3', 
    imageUrl: '/placeholder-user.jpg',
    email: 'ahmed.alrashid@feebee.com',
    phone: '+971-50-123-0007',
    location: 'Abu Dhabi, UAE',
    joinDate: '2021-04-01',
    salary: 11000,
    directReports: 4,
    level: 3,
    skills: ['Sales Management', 'CRM', 'Team Leadership'],
    performance: 4.4,
    status: 'active'
  },
  { 
    id: '8', 
    name: 'Fatima Khan', 
    position: 'Marketing Manager', 
    department: 'Sales',
    managerId: '3', 
    imageUrl: '/placeholder-user.jpg',
    email: 'fatima.khan@feebee.com',
    phone: '+971-50-123-0008',
    location: 'Dubai, UAE',
    joinDate: '2021-07-15',
    salary: 10000,
    directReports: 3,
    level: 3,
    skills: ['Digital Marketing', 'Content Strategy', 'Analytics'],
    performance: 4.6,
    status: 'active'
  },
  { 
    id: '9', 
    name: 'Peter Jones', 
    position: 'Finance Manager', 
    department: 'Finance',
    managerId: '4', 
    imageUrl: '/placeholder-user.jpg',
    email: 'peter.jones@feebee.com',
    phone: '+971-50-123-0009',
    location: 'Dubai, UAE',
    joinDate: '2021-11-01',
    salary: 11500,
    directReports: 2,
    level: 3,
    skills: ['Financial Analysis', 'Budgeting', 'Reporting'],
    performance: 4.5,
    status: 'active'
  },
  { 
    id: '10', 
    name: 'Maria Rodriguez', 
    position: 'HR Manager', 
    department: 'Human Resources',
    managerId: '4', 
    imageUrl: '/placeholder-user.jpg',
    email: 'maria.rodriguez@feebee.com',
    phone: '+971-50-123-0010',
    location: 'Dubai, UAE',
    joinDate: '2020-12-01',
    salary: 10500,
    directReports: 3,
    level: 3,
    skills: ['HR Management', 'Recruitment', 'Employee Relations'],
    performance: 4.7,
    status: 'active'
  },
]

const elk = new ELK()

const elkOptions = {
  'elk.algorithm': 'layered',
  'elk.direction': 'DOWN',
  'elk.spacing.nodeNode': '100',
  'elk.layered.spacing.nodeNodeBetweenLayers': '150',
}

const getLayoutedElements = async (nodes: Node[], edges: Edge[]): Promise<{ nodes: Node[], edges: Edge[] }> => {
  const graph = {
    id: 'root',
    layoutOptions: elkOptions,
    children: nodes.map((node) => ({
      ...node,
      width: 280,
      height: 120,
    })),
    edges: edges,
  }

  const layoutedGraph = await elk.layout(graph)
  
  return {
    nodes: layoutedGraph.children!.map((node: any) => ({
      ...node,
      position: { x: node.x, y: node.y },
    })),
    edges: layoutedGraph.edges || [],
  }
}

// Enhanced Employee Node Component with collapse/expand of children
const EmployeeNode = ({ data }: { data: { employee: Employee; hasChildren: boolean; isCollapsed: boolean; onToggleCollapse: () => void } }) => {
  const employee = data.employee

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-blue-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-16 !h-2 !-top-1 !rounded-none !bg-transparent !border-none"
      />
      <div className={`bg-card border-2 rounded-lg shadow-lg w-[280px] transition-all duration-300 hover:shadow-xl ${getLevelColor(employee.level)}`}>
        {/* Main Employee Card */}
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={employee.imageUrl || "/placeholder.svg"} alt={employee.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {employee.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground truncate">{employee.name}</h3>
                {data.hasChildren && (
                  <Button
                    title={data.isCollapsed ? 'Expand' : 'Collapse'}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={data.onToggleCollapse}
                  >
                    {data.isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-medium truncate">{employee.position}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {employee.department}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Award className="h-3 w-3 text-muted-foreground" />
                  <span className={`text-xs font-medium ${getPerformanceColor(employee.performance)}`}>
                    {employee.performance}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t">
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Users2 className="h-3 w-3" />
              <span>{employee.directReports} reports</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{employee.location.split(',')[0]}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Date(employee.joinDate).getFullYear()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t bg-muted/30 p-3 flex items-center justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-6 text-xs">
                <Eye className="h-3 w-3 mr-1" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={employee.imageUrl || "/placeholder.svg"} alt={employee.name} />
                    <AvatarFallback>{employee.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{employee.name}</h2>
                    <p className="text-muted-foreground">{employee.position}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <EmployeeDetailView employee={employee} />
            </DialogContent>
          </Dialog>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Edit className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-16 !h-2 !-bottom-1 !rounded-none !bg-transparent !border-none"
      />
    </>
  )
}

// Employee Detail View Component
const EmployeeDetailView = ({ employee }: { employee: Employee }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{employee.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{employee.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{employee.location}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              Employment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Department:</span>
              <span className="font-medium">{employee.department}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Join Date:</span>
              <span className="font-medium">{new Date(employee.joinDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Level:</span>
              <span className="font-medium">Level {employee.level}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Direct Reports:</span>
              <span className="font-medium">{employee.directReports}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance & Compensation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Rating:</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">{employee.performance}</span>
                <span className="text-sm text-muted-foreground">/5.0</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${(employee.performance / 5) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Compensation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly Salary:</span>
              <span className="text-lg font-bold">{formatCurrency(employee.salary)}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">Annual:</span>
              <span className="text-sm font-medium">{formatCurrency(employee.salary * 12)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills & Competencies */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Skills & Competencies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {employee.skills.map((skill: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-4 border-t">
        <Button variant="outline" className="flex-1">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
        <Button variant="outline" className="flex-1">
          <TrendingUp className="h-4 w-4 mr-2" />
          Performance Review
        </Button>
        <Button variant="outline" className="flex-1">
          <Users className="h-4 w-4 mr-2" />
          View Team
        </Button>
      </div>
    </div>
  )
}

const nodeTypes = {
  employeeNode: EmployeeNode,
}

const InteractiveOrgChart = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Get unique departments and levels for filters
  const departments = useMemo(() => {
    const depts = [...new Set(mockOrgData.map(emp => emp.department))]
    return depts.sort()
  }, [])

  const levels = useMemo(() => {
    const lvls = [...new Set(mockOrgData.map(emp => emp.level))]
    return lvls.sort()
  }, [])

  // Filter employees based on search and filters
  const filteredEmployees = useMemo(() => {
    return mockOrgData.filter(employee => {
      const matchesSearch = searchTerm === "" || 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter
      const matchesLevel = levelFilter === "all" || employee.level.toString() === levelFilter
      
      return matchesSearch && matchesDepartment && matchesLevel
    })
  }, [searchTerm, departmentFilter, levelFilter])

  useEffect(() => {
    const fetchAndLayoutData = async () => {
      setLoading(true)
      // CURSOR: API call to GET /api/v1/hcm/organizational-chart
      
      // Create nodes for filtered employees
      const collapsedById = new Map<string, boolean>()
      const initialNodes: Node[] = filteredEmployees.map(employee => ({
        id: employee.id,
        type: 'employeeNode',
        data: {
          employee,
          hasChildren: filteredEmployees.some(e => e.managerId === employee.id),
          isCollapsed: collapsedById.get(employee.id) ?? false,
          onToggleCollapse: () => {
            setNodes((prev) => prev.map(n => n.id === employee.id ? { ...n, data: { ...n.data, isCollapsed: !n.data.isCollapsed } } : n))
          },
        },
        position: { x: 0, y: 0 },
      }))

      // Create edges based on reporting relationships
      const initialEdges: Edge[] = filteredEmployees
        .filter(employee => employee.managerId && filteredEmployees.find(e => e.id === employee.managerId))
        .map(employee => ({
          id: `e-${employee.managerId}-${employee.id}`,
          source: employee.managerId!,
          target: employee.id,
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#9ca3af', strokeWidth: 1.5 },
        }))

      const { nodes: layoutedNodes, edges: layoutedEdges } = await getLayoutedElements(initialNodes, initialEdges)
      setNodes(layoutedNodes)
      setEdges(layoutedEdges)
      setLoading(false)
    }

    fetchAndLayoutData()
  }, [filteredEmployees, setNodes, setEdges])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  // Compute collapsed descendants to hide nodes/edges under collapsed parents
  const hiddenNodeIds = useMemo(() => {
    const hidden = new Set<string>()
    const isCollapsed = (id: string) => {
      const n: any = nodes.find((nn: any) => nn.id === id)
      return !!n?.data?.isCollapsed
    }
    const childrenOf = (id: string) => edges.filter(e => e.source === id).map(e => e.target)
    const dfs = (id: string) => {
      for (const child of childrenOf(id)) {
        if (!hidden.has(child)) {
          hidden.add(child)
          dfs(child)
        }
      }
    }
    nodes.forEach((n: any) => {
      if (isCollapsed(n.id)) dfs(n.id)
    })
    return hidden
  }, [nodes, edges])

  const displayedNodes = useMemo(() => nodes.filter((n: any) => !hiddenNodeIds.has(n.id)), [nodes, hiddenNodeIds])
  const displayedEdges = useMemo(() => edges.filter((e: any) => !hiddenNodeIds.has(e.source) && !hiddenNodeIds.has(e.target)), [edges, hiddenNodeIds])

  const handleExport = () => {
    // CURSOR: API call to POST /api/v1/hcm/org-chart/export
    console.log('Exporting org chart...')
  }

  const resetFilters = () => {
    setSearchTerm("")
    setDepartmentFilter("all")
    setLevelFilter("all")
  }

  if (loading) {
    return (
      <div className="h-[700px] flex items-center justify-center bg-muted/50 rounded-lg">
        <div className="text-center">
          <Network className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="mt-4 text-muted-foreground">Building Organizational Chart...</p>
          <p className="text-sm text-muted-foreground">Loading {mockOrgData.length} employees</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Network className="h-5 w-5 mr-2 text-blue-600" />
              Interactive Organizational Chart
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {filteredEmployees.length} employees
              </Badge>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees, positions, departments..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map(level => (
                  <SelectItem key={level} value={level.toString()}>Level {level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(searchTerm || departmentFilter !== "all" || levelFilter !== "all") && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Org Chart Visualization */}
      <div className={`border rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'h-[700px]'}`}>
        <ReactFlow
          nodes={displayedNodes as any}
          edges={displayedEdges as any}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-background"
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              const level = node.data?.employee?.level || 1
              return getLevelColor(level).split(' ')[0].replace('bg-', '#').replace('-100', '') // A bit of a hack to get a color
            }} 
            nodeStrokeWidth={3} 
            zoomable 
            pannable 
          />
          <Background gap={16} />
        </ReactFlow>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Levels:</span>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div>
                    <span className="text-xs">Executive</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                    <span className="text-xs">VP Level</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                    <span className="text-xs">Manager+</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Zap className="h-4 w-4" />
                <span>Click nodes to expand</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>View details for full profile</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InteractiveOrgChart
