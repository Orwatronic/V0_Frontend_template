"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { UserPlus, UserMinus, CheckCircle, Clock, AlertCircle, FileText, Laptop, Key, BookOpen, Shield, Calendar, Mail, Phone, MapPin, Building, Users, Award, ArrowRight, ArrowLeft, Plus, Edit, Eye, Download, Upload, Send, CheckSquare, XCircle, Timer, Briefcase, GraduationCap, CreditCard, Home, Car, Smartphone, Monitor, Headphones, Printer, Camera, Wifi, Database, Lock, Unlock, MessageSquare, Star, TrendingUp, BarChart3, PieChart, Activity, Target, Zap, Bell, Settings, RefreshCw, Search, Filter, MoreHorizontal, PlayCircle, PauseCircle, StopCircle, RotateCcw, Save, Trash2, ClipboardList, UserCheck, AlertTriangle, Info, HelpCircle, ExternalLink, Package, Wrench, Globe, DollarSign, CalendarIcon, ClockIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data for active processes
const mockActiveProcesses = [
  {
    id: 'ONB-2024-001',
    type: 'onboarding',
    employeeName: 'Sarah Wilson',
    employeeId: 'EMP2024001',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    manager: 'John Smith',
    startDate: '2024-02-15',
    currentStep: 3,
    totalSteps: 5,
    progress: 60,
    status: 'inProgress',
    priority: 'high',
    dueDate: '2024-02-20',
    assignedTo: 'HR Team',
    tasksCompleted: 12,
    totalTasks: 20,
    lastActivity: '2 hours ago',
    avatar: '/placeholder-user.jpg'
  },
  {
    id: 'OFF-2024-001',
    type: 'offboarding',
    employeeName: 'Michael Chen',
    employeeId: 'EMP2021045',
    position: 'Product Manager',
    department: 'Product',
    manager: 'Lisa Johnson',
    endDate: '2024-02-28',
    currentStep: 2,
    totalSteps: 5,
    progress: 40,
    status: 'inProgress',
    priority: 'medium',
    dueDate: '2024-02-25',
    assignedTo: 'IT Security',
    tasksCompleted: 8,
    totalTasks: 15,
    lastActivity: '1 day ago',
    avatar: '/placeholder-user.jpg'
  },
  {
    id: 'ONB-2024-002',
    type: 'onboarding',
    employeeName: 'Ahmed Al-Rashid',
    employeeId: 'EMP2024002',
    position: 'Sales Executive',
    department: 'Sales',
    manager: 'David Wilson',
    startDate: '2024-02-10',
    currentStep: 5,
    totalSteps: 5,
    progress: 95,
    status: 'pending',
    priority: 'low',
    dueDate: '2024-02-12',
    assignedTo: 'Sales Manager',
    tasksCompleted: 19,
    totalTasks: 20,
    lastActivity: '3 hours ago',
    avatar: '/placeholder-user.jpg'
  }
]

// Mock equipment catalog
const mockEquipmentCatalog = [
  { id: 'EQ001', name: 'MacBook Pro 16"', category: 'Laptop', available: 5, cost: 2500, description: 'High-performance laptop for development work' },
  { id: 'EQ002', name: 'Dell Monitor 27"', category: 'Monitor', available: 12, cost: 350, description: '4K external monitor for productivity' },
  { id: 'EQ003', name: 'iPhone 15 Pro', category: 'Mobile', available: 8, cost: 1200, description: 'Company mobile phone with data plan' },
  { id: 'EQ004', name: 'Wireless Headphones', category: 'Audio', available: 15, cost: 200, description: 'Noise-cancelling headphones for focus' },
  { id: 'EQ005', name: 'Ergonomic Desk Chair', category: 'Furniture', available: 3, cost: 450, description: 'Adjustable ergonomic office chair' },
  { id: 'EQ006', name: 'Standing Desk', category: 'Furniture', available: 2, cost: 800, description: 'Height-adjustable standing desk' },
  { id: 'EQ007', name: 'Webcam HD', category: 'Accessories', available: 20, cost: 150, description: 'High-definition webcam for video calls' },
  { id: 'EQ008', name: 'Wireless Keyboard', category: 'Accessories', available: 25, cost: 120, description: 'Bluetooth mechanical keyboard' }
]

// Mock training courses
const mockTrainingCourses = [
  { id: 'TRN001', name: 'Company Orientation', duration: 4, mandatory: true, category: 'General', description: 'Introduction to company culture and values' },
  { id: 'TRN002', name: 'Security Awareness', duration: 2, mandatory: true, category: 'Security', description: 'Cybersecurity best practices and policies' },
  { id: 'TRN003', name: 'HR Policies & Procedures', duration: 1, mandatory: true, category: 'HR', description: 'Employee handbook and HR policies' },
  { id: 'TRN004', name: 'Technical Onboarding', duration: 8, mandatory: false, category: 'Technical', description: 'Technical systems and development environment setup' },
  { id: 'TRN005', name: 'Sales Training Program', duration: 6, mandatory: false, category: 'Sales', description: 'Sales methodology and CRM training' },
  { id: 'TRN006', name: 'Leadership Fundamentals', duration: 12, mandatory: false, category: 'Leadership', description: 'Basic leadership and management skills' }
]

// Mock system access items
const mockSystemAccess = [
  { id: 'SYS001', system: 'Email Account', description: 'Corporate email with calendar access', critical: true, provider: 'Microsoft 365' },
  { id: 'SYS002', system: 'ERP System', description: 'Main business application access', critical: true, provider: 'Feebee ERP' },
  { id: 'SYS003', system: 'Slack Workspace', description: 'Team communication platform', critical: false, provider: 'Slack' },
  { id: 'SYS004', system: 'GitHub Access', description: 'Code repository and version control', critical: false, provider: 'GitHub' },
  { id: 'SYS005', system: 'VPN Access', description: 'Secure network access for remote work', critical: true, provider: 'Cisco AnyConnect' },
  { id: 'SYS006', name: 'Office 365 Suite', description: 'Word, Excel, PowerPoint, Teams', critical: true, provider: 'Microsoft' },
  { id: 'SYS007', name: 'Building Access Card', description: 'Physical office access and security', critical: true, provider: 'Security Team' }
]

// Mock documents
const mockDocuments = [
  { id: 'DOC001', name: 'Employment Contract', type: 'Contract', required: true, status: 'pending', category: 'Legal' },
  { id: 'DOC002', name: 'Employee Handbook', type: 'Policy', required: true, status: 'sent', category: 'HR' },
  { id: 'DOC003', name: 'Benefits Enrollment Form', type: 'Form', required: true, status: 'completed', category: 'Benefits' },
  { id: 'DOC004', name: 'Emergency Contact Form', type: 'Form', required: true, status: 'pending', category: 'HR' },
  { id: 'DOC005', name: 'IT Security Agreement', type: 'Agreement', required: true, status: 'signed', category: 'IT' },
  { id: 'DOC006', name: 'Direct Deposit Form', type: 'Form', required: true, status: 'pending', category: 'Payroll' },
  { id: 'DOC007', name: 'Tax Forms (W-4)', type: 'Tax', required: true, status: 'completed', category: 'Payroll' }
]

export default function OnboardingOffboardingWizards() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedProcess, setSelectedProcess] = useState(null)
  const [wizardStep, setWizardStep] = useState(1)
  const [wizardData, setWizardData] = useState({})
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [showNewProcessDialog, setShowNewProcessDialog] = useState(false)
  const [newProcessType, setNewProcessType] = useState('onboarding')

  // Helper functions
  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      inProgress: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      overdue: 'bg-red-100 text-red-800 border-red-200',
      notStarted: 'bg-gray-100 text-gray-800 border-gray-200',
      signed: 'bg-green-100 text-green-800 border-green-200',
      sent: 'bg-blue-100 text-blue-800 border-blue-200',
      revoked: 'bg-red-100 text-red-800 border-red-200',
      returned: 'bg-green-100 text-green-800 border-green-200',
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getTypeIcon = (type) => {
    return type === 'onboarding' ? UserPlus : UserMinus
  }

  const getTypeColor = (type) => {
    return type === 'onboarding' ? 'text-green-600' : 'text-orange-600'
  }

  // Filter processes
  const filteredProcesses = mockActiveProcesses.filter(process => {
    const matchesSearch = process.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || process.status === filterStatus
    const matchesType = filterType === 'all' || process.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  // Process management functions
  const startNewProcess = (type) => {
    setSelectedProcess({ type, isNew: true })
    setWizardStep(1)
    setWizardData({})
    setActiveTab('wizard')
    setShowNewProcessDialog(false)
  }

  const openExistingProcess = (process) => {
    setSelectedProcess(process)
    setWizardStep(process.currentStep)
    setActiveTab('wizard')
  }

  const handleWizardNext = () => {
    if (wizardStep < 5) {
      setWizardStep(wizardStep + 1)
    }
  }

  const handleWizardBack = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1)
    }
  }

  const handleWizardComplete = async () => {
    setLoading(true)
    // CURSOR: API call to POST /api/v1/hcm/onboarding/complete or /api/v1/hcm/offboarding/complete
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    setActiveTab('overview')
    setSelectedProcess(null)
  }

  const handleSaveProgress = async () => {
    setLoading(true)
    // CURSOR: API call to PATCH /api/v1/hcm/onboarding/:id/step or /api/v1/hcm/offboarding/:id/step
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  // Overview component
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Onboarding</CardTitle>
            <UserPlus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Offboarding</CardTitle>
            <UserMinus className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">3</div>
            <p className="text-xs text-muted-foreground">-1 from last week</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">2</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">94%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Dialog open={showNewProcessDialog} onOpenChange={setShowNewProcessDialog}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setShowNewProcessDialog(true)}
                  className="h-20 flex-col bg-green-600 hover:bg-green-700"
                >
                  <UserPlus className="h-6 w-6 mb-2" />
                  <span>Start New Onboarding</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start New Process</DialogTitle>
                  <DialogDescription>
                    Choose the type of process you want to start
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <RadioGroup value={newProcessType} onValueChange={setNewProcessType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="onboarding" id="onboarding" />
                      <Label htmlFor="onboarding" className="flex items-center space-x-2 cursor-pointer">
                        <UserPlus className="h-4 w-4 text-green-600" />
                        <span>Employee Onboarding</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="offboarding" id="offboarding" />
                      <Label htmlFor="offboarding" className="flex items-center space-x-2 cursor-pointer">
                        <UserMinus className="h-4 w-4 text-orange-600" />
                        <span>Employee Offboarding</span>
                      </Label>
                    </div>
                  </RadioGroup>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowNewProcessDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => startNewProcess(newProcessType)}>
                      Start Process
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              onClick={() => startNewProcess('offboarding')} 
              variant="outline" 
              className="h-20 flex-col border-orange-200 hover:bg-orange-50"
            >
              <UserMinus className="h-6 w-6 mb-2 text-orange-600" />
              <span>Start Employee Offboarding</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Processes Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Active Processes
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search processes..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="inProgress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="offboarding">Offboarding</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProcesses.map((process) => {
                const TypeIcon = getTypeIcon(process.type)
                return (
                  <TableRow key={process.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {process.employeeName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{process.employeeName}</div>
                          <div className="text-xs text-muted-foreground">{process.employeeId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <TypeIcon className={`h-4 w-4 ${getTypeColor(process.type)}`} />
                        <span className="capitalize">{process.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{process.position}</div>
                        <div className="text-xs text-muted-foreground">{process.department}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Step {process.currentStep}/{process.totalSteps}</span>
                          <span>{process.progress}%</span>
                        </div>
                        <Progress value={process.progress} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {process.tasksCompleted}/{process.totalTasks} tasks
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(getStatusColor(process.status))}>
                        {process.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(getPriorityColor(process.priority))}>
                        {process.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{process.dueDate}</TableCell>
                    <TableCell className="text-sm">{process.assignedTo}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openExistingProcess(process)}
                        >
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
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  // Onboarding wizard component
  const renderOnboardingWizard = () => {
    const steps = [
      { id: 1, title: 'Employee Information', icon: Users, description: 'Basic employee details and contact information' },
      { id: 2, title: 'Documentation', icon: FileText, description: 'Required documents and forms' },
      { id: 3, title: 'Equipment & Access', icon: Laptop, description: 'IT equipment and system access setup' },
      { id: 4, title: 'Training & Orientation', icon: BookOpen, description: 'Training programs and orientation schedule' },
      { id: 5, title: 'Final Review', icon: CheckCircle, description: 'Review and complete onboarding process' }
    ]

    const renderStepContent = () => {
      switch (wizardStep) {
        case 1: // Employee Information
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" placeholder="Enter first name" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" placeholder="Enter last name" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="employee@company.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+1 (555) 123-4567" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Input id="position" placeholder="Job title" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manager">Reporting Manager *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john.smith">John Smith - Engineering Manager</SelectItem>
                      <SelectItem value="sarah.johnson">Sarah Johnson - Sales Director</SelectItem>
                      <SelectItem value="michael.chen">Michael Chen - VP Engineering</SelectItem>
                      <SelectItem value="lisa.thompson">Lisa Thompson - Marketing Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input id="startDate" type="date" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary">Annual Salary</Label>
                  <Input id="salary" type="number" placeholder="75000" />
                </div>
                <div>
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fulltime">Full-time</SelectItem>
                      <SelectItem value="parttime">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="intern">Intern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="Full address" rows={3} />
              </div>
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea id="notes" placeholder="Any special requirements or notes..." rows={3} />
              </div>
            </div>
          )

        case 2: // Documentation
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Required Documents</CardTitle>
                    <CardDescription>Documents that must be collected from employee</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockDocuments.filter(doc => doc.required).map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center space-x-3">
                          <Checkbox checked={doc.status === 'completed' || doc.status === 'signed'} />
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-muted-foreground">{doc.type} • {doc.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={cn(getStatusColor(doc.status))}>
                            {doc.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Company Documents</CardTitle>
                    <CardDescription>Documents to be provided to employee</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: 'Employment Contract', status: 'sent', category: 'Legal' },
                      { name: 'Employee Handbook', status: 'pending', category: 'HR' },
                      { name: 'Benefits Guide', status: 'pending', category: 'Benefits' },
                      { name: 'IT Security Policies', status: 'sent', category: 'IT' },
                      { name: 'Code of Conduct', status: 'pending', category: 'HR' },
                      { name: 'Org Chart', status: 'sent', category: 'HR' }
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-muted-foreground">{doc.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={cn(getStatusColor(doc.status))}>
                            {doc.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Document Upload</CardTitle>
                  <CardDescription>Upload employee documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                    </p>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )

        case 3: // Equipment & Access
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Laptop className="h-5 w-5 mr-2" />
                      Equipment Assignment
                    </CardTitle>
                    <CardDescription>Select equipment to assign to the employee</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockEquipmentCatalog.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                          <div className="flex items-center space-x-3">
                            <Checkbox />
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">{item.description}</div>
                              <div className="text-xs text-muted-foreground">
                                {item.category} • Available: {item.available}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">${item.cost}</div>
                            <div className="text-xs text-muted-foreground">Cost</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Key className="h-5 w-5 mr-2" />
                      System Access
                    </CardTitle>
                    <CardDescription>Configure system access permissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockSystemAccess.map((access, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                          <div className="flex items-center space-x-3">
                            <Checkbox defaultChecked={access.critical} />
                            <div>
                              <div className="font-medium">{access.system}</div>
                              <div className="text-sm text-muted-foreground">{access.description}</div>
                              <div className="text-xs text-muted-foreground">Provider: {access.provider}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {access.critical && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                Critical
                              </Badge>
                            )}
                            <div className={`w-3 h-3 rounded-full ${access.critical ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Access Request Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">7</div>
                      <div className="text-sm text-muted-foreground">Systems Requested</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">5</div>
                      <div className="text-sm text-muted-foreground">Critical Systems</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">2-3</div>
                      <div className="text-sm text-muted-foreground">Days to Setup</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )

        case 4: // Training & Orientation
          return (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Training Schedule
                  </CardTitle>
                  <CardDescription>Assign training courses and set schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTrainingCourses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center space-x-4">
                          <Checkbox defaultChecked={course.mandatory} />
                          <div>
                            <div className="font-medium">{course.name}</div>
                            <div className="text-sm text-muted-foreground">{course.description}</div>
                            <div className="text-xs text-muted-foreground">
                              {course.duration} hours • {course.category}
                            </div>
                            {course.mandatory && (
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200 mt-1">
                                Mandatory
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Orientation Schedule</CardTitle>
                    <CardDescription>First day orientation timeline</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { time: '9:00 AM', activity: 'Welcome & Introduction', duration: '30 min', location: 'Reception' },
                        { time: '9:30 AM', activity: 'Office Tour', duration: '45 min', location: 'Main Office' },
                        { time: '10:15 AM', activity: 'Meet the Team', duration: '60 min', location: 'Team Area' },
                        { time: '11:15 AM', activity: 'HR Orientation', duration: '90 min', location: 'Conference Room A' },
                        { time: '1:00 PM', activity: 'Lunch with Manager', duration: '60 min', location: 'Cafeteria' },
                        { time: '2:00 PM', activity: 'IT Setup & Training', duration: '60 min', location: 'IT Department' },
                        { time: '3:00 PM', activity: 'Department Overview', duration: '90 min', location: 'Department Office' },
                        { time: '4:30 PM', activity: 'Q&A Session', duration: '30 min', location: 'Manager Office' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border-l-4 border-blue-500 pl-4 bg-blue-50/50">
                          <div>
                            <div className="font-medium">{item.activity}</div>
                            <div className="text-sm text-muted-foreground">{item.time} • {item.location}</div>
                          </div>
                          <Badge variant="outline">{item.duration}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Buddy Assignment</CardTitle>
                    <CardDescription>Assign a workplace buddy</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 border rounded-lg bg-green-50/50">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Sarah Johnson</div>
                          <div className="text-sm text-muted-foreground">Senior Software Engineer</div>
                          <div className="text-xs text-muted-foreground">sarah.johnson@company.com • +1 (555) 234-5678</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
                        <p><strong>Buddy Responsibilities:</strong></p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Help navigate first few weeks</li>
                          <li>Answer questions about company culture</li>
                          <li>Introduce to team members</li>
                          <li>Provide guidance on processes and tools</li>
                          <li>Check in regularly during first month</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )

        case 5: // Final Review
          return (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Onboarding Summary
                  </CardTitle>
                  <CardDescription>Review all onboarding details before completion</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Employee Information
                        </h4>
                        <div className="text-sm space-y-1 bg-muted/50 p-3 rounded-lg">
                          <p><strong>Name:</strong> Sarah Wilson</p>
                          <p><strong>Position:</strong> Senior Software Engineer</p>
                          <p><strong>Department:</strong> Engineering</p>
                          <p><strong>Start Date:</strong> February 15, 2024</p>
                          <p><strong>Manager:</strong> John Smith</p>
                          <p><strong>Email:</strong> sarah.wilson@company.com</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Documentation Status
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm p-2 bg-green-50 rounded">
                            <span>Required Documents</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">6/7 Complete</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm p-2 bg-blue-50 rounded">
                            <span>Company Documents</span>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">6/6 Sent</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Laptop className="h-4 w-4 mr-2" />
                          Equipment & Access
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm p-2 bg-blue-50 rounded">
                            <span>Equipment Assigned</span>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">4 Items</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm p-2 bg-yellow-50 rounded">
                            <span>System Access</span>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">6/7 Pending</Badge>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Training & Orientation
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm p-2 bg-green-50 rounded">
                            <span>Mandatory Training</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Scheduled</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm p-2 bg-blue-50 rounded">
                            <span>Orientation</span>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Feb 15, 9:00 AM</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm p-2 bg-green-50 rounded">
                            <span>Buddy Assigned</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Sarah Johnson</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                    Pending Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Emergency contact form still required</span>
                      </div>
                      <Button variant="outline" size="sm">Follow Up</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">GitHub access pending IT approval</span>
                      </div>
                      <Button variant="outline" size="sm">Notify IT</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Desk and workspace prepared</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Complete</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Completion Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { task: 'Employee information collected', completed: true },
                      { task: 'Required documents submitted', completed: false },
                      { task: 'Equipment assigned and configured', completed: true },
                      { task: 'System access provisioned', completed: false },
                      { task: 'Training courses scheduled', completed: true },
                      { task: 'Orientation timeline confirmed', completed: true },
                      { task: 'Buddy assigned and notified', completed: true },
                      { task: 'Manager briefed on new hire', completed: true }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Checkbox checked={item.completed} />
                        <span className={`text-sm ${item.completed ? 'text-muted-foreground line-through' : ''}`}>
                          {item.task}
                        </span>
                        {item.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )

        default:
          return null
      }
    }

    return (
      <div className="space-y-6">
        {/* Progress Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  {selectedProcess?.isNew ? 'New Employee Onboarding' : `Onboarding: ${selectedProcess?.employeeName}`}
                </CardTitle>
                <CardDescription>
                  Step {wizardStep} of 5 - {steps.find(s => s.id === wizardStep)?.title}
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setActiveTab('overview')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Overview
              </Button>
            </div>
            <div className="mt-4">
              <Progress value={(wizardStep / 5) * 100} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Step Navigation */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon
                const isActive = step.id === wizardStep
                const isCompleted = step.id < wizardStep
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2",
                      isActive ? "border-blue-500 bg-blue-500 text-white" :
                      isCompleted ? "border-green-500 bg-green-500 text-white" :
                      "border-gray-300 bg-white text-gray-400"
                    )}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3 max-w-32">
                      <div className={cn(
                        "text-sm font-medium",
                        isActive ? "text-blue-600" :
                        isCompleted ? "text-green-600" :
                        "text-gray-400"
                      )}>
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {step.description}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "flex-1 h-0.5 mx-4",
                        isCompleted ? "bg-green-500" : "bg-gray-300"
                      )} />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardContent className="p-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={handleWizardBack}
                disabled={wizardStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handleSaveProgress} disabled={loading}>
                  {loading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Progress
                </Button>
                {wizardStep < 5 ? (
                  <Button onClick={handleWizardNext}>
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleWizardComplete}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Complete Onboarding
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Offboarding wizard component
  const renderOffboardingWizard = () => {
    const steps = [
      { id: 1, title: 'Exit Interview', icon: MessageSquare, description: 'Conduct exit interview and collect feedback' },
      { id: 2, title: 'Asset Recovery', icon: Package, description: 'Collect company assets and equipment' },
      { id: 3, title: 'Access Revocation', icon: Lock, description: 'Revoke system access and permissions' },
      { id: 4, title: 'Final Documentation', icon: FileText, description: 'Generate final documents and handover notes' },
      { id: 5, title: 'Completion', icon: CheckCircle, description: 'Complete offboarding process' }
    ]

    const renderStepContent = () => {
      switch (wizardStep) {
        case 1: // Exit Interview
          return (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Exit Interview Details</CardTitle>
                  <CardDescription>Collect feedback and departure information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="exitDate">Last Working Day</Label>
                      <Input id="exitDate" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="reason">Reason for Leaving</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="resignation">Voluntary Resignation</SelectItem>
                          <SelectItem value="termination">Termination</SelectItem>
                          <SelectItem value="retirement">Retirement</SelectItem>
                          <SelectItem value="contract-end">Contract End</SelectItem>
                          <SelectItem value="layoff">Layoff</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newPosition">New Position/Company (if applicable)</Label>
                    <Input id="newPosition" placeholder="New role or company name" />
                  </div>
                  <div>
                    <Label htmlFor="feedback">Overall Experience Feedback</Label>
                    <Textarea id="feedback" placeholder="Please share your experience working with us..." rows={4} />
                  </div>
                  <div>
                    <Label htmlFor="improvements">Suggestions for Improvement</Label>
                    <Textarea id="improvements" placeholder="What could we have done better?" rows={3} />
                  </div>
                  <div>
                    <Label htmlFor="challenges">Biggest Challenges Faced</Label>
                    <Textarea id="challenges" placeholder="What were the main challenges in your role?" rows={3} />
                  </div>
                  <div>
                    <Label>Would you recommend us as an employer?</Label>
                    <RadioGroup defaultValue="yes" className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="recommend-yes" />
                        <Label htmlFor="recommend-yes">Yes, definitely</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="maybe" id="recommend-maybe" />
                        <Label htmlFor="recommend-maybe">Maybe, with improvements</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="recommend-no" />
                        <Label htmlFor="recommend-no">No, I would not recommend</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label>Rate your satisfaction with:</Label>
                    <div className="space-y-3 mt-2">
                      {[
                        'Management and Leadership',
                        'Work-Life Balance',
                        'Career Development',
                        'Compensation and Benefits',
                        'Company Culture',
                        'Work Environment'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm font-medium">{item}</span>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button key={rating} className="p-1">
                                <Star className="h-4 w-4 text-gray-300 hover:text-yellow-400" />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )

        case 2: // Asset Recovery
          return (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Company Assets Recovery</CardTitle>
                  <CardDescription>Items to be returned by the employee</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { item: 'MacBook Pro 16"', serialNumber: 'MBP2023001', status: 'pending', condition: '', category: 'Laptop', cost: 2500 },
                      { item: 'iPhone 15 Pro', serialNumber: 'IP2023045', status: 'returned', condition: 'Good', category: 'Mobile', cost: 1200 },
                      { item: 'Dell Monitor 27"', serialNumber: 'DM2023012', status: 'pending', condition: '', category: 'Monitor', cost: 350 },
                      { item: 'Wireless Headphones', serialNumber: 'WH2023089', status: 'returned', condition: 'Excellent', category: 'Audio', cost: 200 },
                      { item: 'Office Keys', serialNumber: 'KEY-456', status: 'pending', condition: '', category: 'Access', cost: 0 },
                      { item: 'Access Card', serialNumber: 'AC-789', status: 'returned', condition: 'Good', category: 'Access', cost: 25 },
                      { item: 'Ergonomic Chair', serialNumber: 'CH-123', status: 'pending', condition: '', category: 'Furniture', cost: 450 }
                    ].map((asset, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center space-x-4">
                          <Checkbox checked={asset.status === 'returned'} />
                          <div>
                            <div className="font-medium">{asset.item}</div>
                            <div className="text-sm text-muted-foreground">S/N: {asset.serialNumber}</div>
                            <div className="text-xs text-muted-foreground">
                              {asset.category} • ${asset.cost}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {asset.condition && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              {asset.condition}
                            </Badge>
                          )}
                          <Badge variant="outline" className={cn(getStatusColor(asset.status))}>
                            {asset.status}
                          </Badge>
                          <Select>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excellent">Excellent</SelectItem>
                              <SelectItem value="good">Good</SelectItem>
                              <SelectItem value="fair">Fair</SelectItem>
                              <SelectItem value="damaged">Damaged</SelectItem>
                              <SelectItem value="missing">Missing</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Asset Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">Total Assets</span>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">7 Items</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium">Returned</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">3 Items</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium">Pending</span>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">4 Items</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium">Total Value</span>
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">$4,725</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Return Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="font-medium mb-1">IT Equipment</div>
                        <p className="text-muted-foreground">Return to IT Department during business hours. Ensure all personal data is backed up.</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="font-medium mb-1">Access Cards & Keys</div>
                        <p className="text-muted-foreground">Return to Security or HR. Required before final departure.</p>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="font-medium mb-1">Furniture</div>
                        <p className="text-muted-foreground">Leave at workstation. Facilities team will handle collection.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )

        case 3: // Access Revocation
          return (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Access Revocation</CardTitle>
                  <CardDescription>Disable access to all company systems and services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { system: 'Email Account', status: 'revoked', critical: true, revokedBy: 'IT Admin', revokedAt: '2024-02-20 10:30', description: 'Corporate email and calendar access' },
                      { system: 'ERP System', status: 'pending', critical: true, revokedBy: '', revokedAt: '', description: 'Main business application access' },
                      { system: 'Slack Workspace', status: 'revoked', critical: false, revokedBy: 'HR Admin', revokedAt: '2024-02-20 11:15', description: 'Team communication platform' },
                      { system: 'GitHub Access', status: 'pending', critical: false, revokedBy: '', revokedAt: '', description: 'Code repository access' },
                      { system: 'VPN Access', status: 'revoked', critical: true, revokedBy: 'Security Team', revokedAt: '2024-02-20 09:45', description: 'Remote network access' },
                      { system: 'Office 365', status: 'pending', critical: true, revokedBy: '', revokedAt: '', description: 'Microsoft Office suite' },
                      { system: 'Building Access', status: 'revoked', critical: true, revokedBy: 'Facilities', revokedAt: '2024-02-20 12:00', description: 'Physical office access' },
                      { system: 'AWS Console', status: 'pending', critical: true, revokedBy: '', revokedAt: '', description: 'Cloud infrastructure access' }
                    ].map((access, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            access.status === 'revoked' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></div>
                          <div>
                            <div className="font-medium">{access.system}</div>
                            <div className="text-sm text-muted-foreground">{access.description}</div>
                            {access.critical && (
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200 mt-1">
                                Critical System
                              </Badge>
                            )}
                            {access.revokedAt && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Revoked by {access.revokedBy} at {access.revokedAt}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={cn(
                            access.status === 'revoked' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          )}>
                            {access.status}
                          </Badge>
                          {access.status === 'pending' && (
                            <Button variant="outline" size="sm">
                              <Lock className="h-4 w-4 mr-2" />
                              Revoke Now
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Access Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">Total Systems</span>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">8 Systems</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-sm font-medium">Access Revoked</span>
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">4 Systems</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium">Pending Revocation</span>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">4 Systems</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                        <span className="text-sm font-medium">Critical Systems</span>
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">6 Systems</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Security Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { task: 'Change shared account passwords', completed: true },
                        { task: 'Remove from security groups', completed: false },
                        { task: 'Disable MFA tokens', completed: true },
                        { task: 'Revoke API keys', completed: false },
                        { task: 'Remove from distribution lists', completed: true },
                        { task: 'Update emergency contacts', completed: false }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Checkbox checked={item.completed} />
                          <span className={`text-sm ${item.completed ? 'text-muted-foreground line-through' : ''}`}>
                            {item.task}
                          </span>
                          {item.completed && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )

        case 4: // Final Documentation
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Final Documents</CardTitle>
                    <CardDescription>Generate and provide final employment documents</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: 'Final Pay Slip', status: 'completed', generated: true, description: 'Final salary and benefits calculation' },
                      { name: 'Experience Certificate', status: 'pending', generated: false, description: 'Employment verification letter' },
                      { name: 'Tax Documents (W-2)', status: 'completed', generated: true, description: 'Annual tax documentation' },
                      { name: 'Benefits Summary', status: 'pending', generated: false, description: 'COBRA and benefits continuation info' },
                      { name: 'Non-Disclosure Agreement', status: 'completed', generated: true, description: 'Confidentiality reminder' },
                      { name: 'Return of Property Receipt', status: 'pending', generated: false, description: 'Asset return confirmation' }
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-xs text-muted-foreground">{doc.description}</div>
                            {doc.generated && (
                              <div className="text-xs text-green-600 mt-1">✓ Generated</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={cn(getStatusColor(doc.status))}>
                            {doc.status}
                          </Badge>
                          {doc.generated ? (
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm">
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Knowledge Transfer</CardTitle>
                    <CardDescription>Document handover and transition details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="handover">Handover Notes</Label>
                      <Textarea 
                        id="handover" 
                        placeholder="Document key responsibilities, ongoing projects, and important contacts..."
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="successor">Successor/Replacement</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select successor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sarah.johnson">Sarah Johnson - Senior Engineer</SelectItem>
                          <SelectItem value="david.wilson">David Wilson - Team Lead</SelectItem>
                          <SelectItem value="temp-assignment">Temporary Assignment</SelectItem>
                          <SelectItem value="external-hire">External Hire (TBD)</SelectItem>
                          <SelectItem value="redistribute">Redistribute Responsibilities</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="projects">Ongoing Projects</Label>
                      <Textarea 
                        id="projects" 
                        placeholder="List ongoing projects and their current status..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contacts">Key Contacts</Label>
                      <Textarea 
                        id="contacts" 
                        placeholder="Important clients, vendors, or internal contacts..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Final Payroll & Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg bg-green-50">
                      <div className="text-sm font-medium text-green-800">Final Pay</div>
                      <div className="text-2xl font-bold text-green-600">$8,750</div>
                      <div className="text-xs text-green-600">Including unused PTO</div>
                    </div>
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <div className="text-sm font-medium text-blue-800">COBRA Eligible</div>
                      <div className="text-2xl font-bold text-blue-600">18 Mo</div>
                      <div className="text-xs text-blue-600">Health insurance continuation</div>
                    </div>
                    <div className="p-4 border rounded-lg bg-purple-50">
                      <div className="text-sm font-medium text-purple-800">401(k) Balance</div>
                      <div className="text-2xl font-bold text-purple-600">$45,230</div>
                      <div className="text-xs text-purple-600">Rollover options available</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )

        case 5: // Completion
          return (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Offboarding Summary
                  </CardTitle>
                  <CardDescription>Complete overview of the offboarding process</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Employee Information
                        </h4>
                        <div className="text-sm space-y-1 bg-muted/50 p-3 rounded-lg">
                          <p><strong>Name:</strong> Michael Chen</p>
                          <p><strong>Position:</strong> Product Manager</p>
                          <p><strong>Department:</strong> Product</p>
                          <p><strong>Last Working Day:</strong> February 28, 2024</p>
                          <p><strong>Reason:</strong> Voluntary Resignation</p>
                          <p><strong>New Company:</strong> Tech Startup Inc.</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Exit Interview
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm p-2 bg-green-50 rounded">
                            <span>Interview Completed</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">✓ Done</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm p-2 bg-green-50 rounded">
                            <span>Feedback Collected</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">✓ Complete</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm p-2 bg-blue-50 rounded">
                            <span>Overall Rating</span>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">4.2/5.0</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Package className="h-4 w-4 mr-2" />
                          Asset Recovery
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm p-2 bg-green-50 rounded">
                            <span>Assets Returned</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">6/7 Items</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm p-2 bg-yellow-50 rounded">
                            <span>Pending Items</span>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">1 Item</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm p-2 bg-purple-50 rounded">
                            <span>Total Value</span>
                            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">$4,725</Badge>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <Lock className="h-4 w-4 mr-2" />
                          Access & Documentation
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm p-2 bg-red-50 rounded">
                            <span>System Access</span>
                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">✓ Revoked</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm p-2 bg-green-50 rounded">
                            <span>Final Documents</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">5/6 Ready</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm p-2 bg-green-50 rounded">
                            <span>Knowledge Transfer</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">✓ Complete</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <ClipboardList className="h-5 w-5 mr-2 text-blue-600" />
                    Final Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Exit interview completed and documented</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Done</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">MacBook Pro return pending</span>
                      </div>
                      <Button variant="outline" size="sm">Follow Up</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">All system access revoked</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Done</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Experience certificate pending HR approval</span>
                      </div>
                      <Button variant="outline" size="sm">Generate</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Knowledge transfer completed</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Done</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Final payroll processed</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Done</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Process Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Offboarding Process Complete</h3>
                    <p className="text-muted-foreground mb-4">
                      Michael Chen's offboarding has been successfully completed. All required steps have been finished except for one pending asset return.
                    </p>
                    <div className="flex justify-center space-x-2">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download Summary
                      </Button>
                      <Button variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Confirmation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )

        default:
          return null
      }
    }

    return (
      <div className="space-y-6">
        {/* Progress Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  {selectedProcess?.isNew ? 'New Employee Offboarding' : `Offboarding: ${selectedProcess?.employeeName}`}
                </CardTitle>
                <CardDescription>
                  Step {wizardStep} of 5 - {steps.find(s => s.id === wizardStep)?.title}
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => setActiveTab('overview')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Overview
              </Button>
            </div>
            <div className="mt-4">
              <Progress value={(wizardStep / 5) * 100} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Step Navigation */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon
                const isActive = step.id === wizardStep
                const isCompleted = step.id < wizardStep
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2",
                      isActive ? "border-orange-500 bg-orange-500 text-white" :
                      isCompleted ? "border-green-500 bg-green-500 text-white" :
                      "border-gray-300 bg-white text-gray-400"
                    )}>
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3 max-w-32">
                      <div className={cn(
                        "text-sm font-medium",
                        isActive ? "text-orange-600" :
                        isCompleted ? "text-green-600" :
                        "text-gray-400"
                      )}>
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {step.description}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={cn(
                        "flex-1 h-0.5 mx-4",
                        isCompleted ? "bg-green-500" : "bg-gray-300"
                      )} />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card>
          <CardContent className="p-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={handleWizardBack}
                disabled={wizardStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handleSaveProgress} disabled={loading}>
                  {loading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Progress
                </Button>
                {wizardStep < 5 ? (
                  <Button onClick={handleWizardNext}>
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleWizardComplete}
                    disabled={loading}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Complete Offboarding
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Analytics component
  const renderAnalytics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Onboarding Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Average Time to Complete</span>
              <span className="font-medium">5.2 days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Success Rate</span>
              <span className="font-medium text-green-600">94%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Employee Satisfaction</span>
              <span className="font-medium">4.6/5.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Time to Productivity</span>
              <span className="font-medium">12.3 days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Offboarding Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Average Time to Complete</span>
              <span className="font-medium">3.8 days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Asset Recovery Rate</span>
              <span className="font-medium text-green-600">98%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Exit Interview Rate</span>
              <span className="font-medium">87%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Knowledge Transfer Rate</span>
              <span className="font-medium">92%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Process Efficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Automation Rate</span>
              <span className="font-medium text-blue-600">73%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Manual Interventions</span>
              <span className="font-medium">2.1 per process</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Cost per Process</span>
              <span className="font-medium">$245</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Error Rate</span>
              <span className="font-medium text-green-600">0.8%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>New Hires</span>
              <span className="font-medium text-green-600">+12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Departures</span>
              <span className="font-medium text-red-600">-8</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Net Growth</span>
              <span className="font-medium text-blue-600">+4</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Turnover Rate</span>
              <span className="font-medium">3.2%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Department Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Engineering</span>
              <span className="font-medium">5 onboarding</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Sales</span>
              <span className="font-medium">2 onboarding</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Marketing</span>
              <span className="font-medium">1 onboarding</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Product</span>
              <span className="font-medium">1 offboarding</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Documentation Complete</span>
              <span className="font-medium text-green-600">96%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Training Completion</span>
              <span className="font-medium text-green-600">94%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Access Provisioning</span>
              <span className="font-medium text-yellow-600">89%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Asset Tracking</span>
              <span className="font-medium text-green-600">98%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Employee Onboarding & Offboarding</h1>
                  <p className="text-sm text-muted-foreground">Comprehensive workflows for employee lifecycle management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="wizard" className="flex items-center space-x-2" disabled={!selectedProcess}>
              <Settings className="h-4 w-4" />
              <span>Process Wizard</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <PieChart className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="wizard" className="mt-6">
            {selectedProcess?.type === 'onboarding' ? renderOnboardingWizard() : renderOffboardingWizard()}
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            {renderAnalytics()}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
