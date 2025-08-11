"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, Plus, MoreHorizontal, Eye, Edit, Calendar, Mail, Phone, MapPin, Star, Clock, DollarSign, Users, TrendingUp, FileText, Download, Send, CheckCircle, XCircle, AlertCircle, User, Briefcase, GraduationCap, Award } from 'lucide-react'

// --- TYPES AND INTERFACES ---

interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  position: string
  location: string
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'
  appliedDate: string
  source: string
  experience: number
  expectedSalary: number
  currentSalary: number
  skills: string[]
  education: string
  rating: number
  notes: string
  resumeUrl?: string
  imageUrl?: string
  recruiter: string
  priority: 'high' | 'medium' | 'low'
  interviews: Interview[]
  evaluations: Evaluation[]
}

interface Interview {
  id: string
  date: string
  time: string
  interviewer: string
  type: 'phone' | 'video' | 'onsite'
  status: 'scheduled' | 'completed' | 'cancelled'
  feedback?: string
  rating?: number
}

interface Evaluation {
  id: string
  evaluator: string
  date: string
  technicalScore: number
  communicationScore: number
  culturalFitScore: number
  overallScore: number
  comments: string
}

interface RecruitmentMetrics {
  totalCandidates: number
  newThisWeek: number
  averageTimeToHire: number
  conversionRate: number
  topSources: { source: string; count: number }[]
  stageDistribution: { stage: string; count: number }[]
}

// --- MOCK DATA ---

const mockCandidates: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    position: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    stage: 'interview',
    appliedDate: '2024-01-15',
    source: 'LinkedIn',
    experience: 5,
    expectedSalary: 140000,
    currentSalary: 120000,
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    education: 'BS Computer Science - Stanford',
    rating: 4.5,
    notes: 'Strong technical background, excellent communication skills',
    imageUrl: '/placeholder-user.jpg',
    recruiter: 'Jane Smith',
    priority: 'high',
    interviews: [
      {
        id: 'int-1',
        date: '2024-01-20',
        time: '10:00 AM',
        interviewer: 'John Doe',
        type: 'video',
        status: 'completed',
        feedback: 'Excellent technical skills, good cultural fit',
        rating: 4
      }
    ],
    evaluations: [
      {
        id: 'eval-1',
        evaluator: 'John Doe',
        date: '2024-01-20',
        technicalScore: 4.5,
        communicationScore: 4.0,
        culturalFitScore: 4.2,
        overallScore: 4.2,
        comments: 'Strong candidate with excellent technical skills'
      }
    ]
  },
  {
    id: 'cand-2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    position: 'Product Manager',
    location: 'New York, NY',
    stage: 'offer',
    appliedDate: '2024-01-10',
    source: 'Indeed',
    experience: 7,
    expectedSalary: 160000,
    currentSalary: 145000,
    skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'],
    education: 'MBA - Harvard Business School',
    rating: 4.8,
    notes: 'Exceptional product management experience',
    imageUrl: '/placeholder-user.jpg',
    recruiter: 'Jane Smith',
    priority: 'high',
    interviews: [],
    evaluations: []
  },
  {
    id: 'cand-3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1 (555) 345-6789',
    position: 'UX Designer',
    location: 'Austin, TX',
    stage: 'screening',
    appliedDate: '2024-01-18',
    source: 'Company Website',
    experience: 3,
    expectedSalary: 95000,
    currentSalary: 80000,
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    education: 'BFA Design - Art Center',
    rating: 4.0,
    notes: 'Creative portfolio, strong design thinking',
    imageUrl: '/placeholder-user.jpg',
    recruiter: 'Bob Wilson',
    priority: 'medium',
    interviews: [],
    evaluations: []
  },
  {
    id: 'cand-4',
    name: 'David Kim',
    email: 'david.kim@email.com',
    phone: '+1 (555) 456-7890',
    position: 'Data Scientist',
    location: 'Seattle, WA',
    stage: 'applied',
    appliedDate: '2024-01-22',
    source: 'Referral',
    experience: 4,
    expectedSalary: 130000,
    currentSalary: 110000,
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    education: 'PhD Statistics - MIT',
    rating: 0,
    notes: 'Recently applied, initial screening pending',
    imageUrl: '/placeholder-user.jpg',
    recruiter: 'Alice Brown',
    priority: 'medium',
    interviews: [],
    evaluations: []
  },
  {
    id: 'cand-5',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    phone: '+1 (555) 567-8901',
    position: 'Marketing Manager',
    location: 'Chicago, IL',
    stage: 'hired',
    appliedDate: '2023-12-15',
    source: 'LinkedIn',
    experience: 6,
    expectedSalary: 110000,
    currentSalary: 95000,
    skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
    education: 'MBA Marketing - Northwestern',
    rating: 4.7,
    notes: 'Excellent hire, started last week',
    imageUrl: '/placeholder-user.jpg',
    recruiter: 'Jane Smith',
    priority: 'high',
    interviews: [],
    evaluations: []
  },
  {
    id: 'cand-6',
    name: 'Robert Davis',
    email: 'robert.davis@email.com',
    phone: '+1 (555) 678-9012',
    position: 'DevOps Engineer',
    location: 'Denver, CO',
    stage: 'rejected',
    appliedDate: '2024-01-05',
    source: 'Glassdoor',
    experience: 2,
    expectedSalary: 100000,
    currentSalary: 75000,
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    education: 'BS Computer Engineering - CU Boulder',
    rating: 2.5,
    notes: 'Insufficient experience for senior role',
    imageUrl: '/placeholder-user.jpg',
    recruiter: 'Bob Wilson',
    priority: 'low',
    interviews: [],
    evaluations: []
  }
]

const stagesConfig = [
  { 
    id: 'applied', 
    title: 'Applied', 
    color: 'bg-gray-500',
    description: 'New applications received'
  },
  { 
    id: 'screening', 
    title: 'Screening', 
    color: 'bg-blue-500',
    description: 'Initial screening in progress'
  },
  { 
    id: 'interview', 
    title: 'Interview', 
    color: 'bg-purple-500',
    description: 'Interview process'
  },
  { 
    id: 'offer', 
    title: 'Offer', 
    color: 'bg-yellow-500',
    description: 'Offer extended'
  },
  { 
    id: 'hired', 
    title: 'Hired', 
    color: 'bg-green-600',
    description: 'Successfully hired'
  },
  { 
    id: 'rejected', 
    title: 'Rejected', 
    color: 'bg-red-600',
    description: 'Not selected'
  },
] as const

type StageId = typeof stagesConfig[number]['id']

const mockMetrics: RecruitmentMetrics = {
  totalCandidates: 156,
  newThisWeek: 12,
  averageTimeToHire: 18,
  conversionRate: 23,
  topSources: [
    { source: 'LinkedIn', count: 45 },
    { source: 'Indeed', count: 32 },
    { source: 'Referral', count: 28 },
    { source: 'Company Website', count: 25 }
  ],
  stageDistribution: [
    { stage: 'Applied', count: 42 },
    { stage: 'Screening', count: 28 },
    { stage: 'Interview', count: 18 },
    { stage: 'Offer', count: 8 },
    { stage: 'Hired', count: 35 },
    { stage: 'Rejected', count: 25 }
  ]
}

// --- HELPER FUNCTIONS ---

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric",
    year: "numeric"
  })
}

const formatSalary = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'border-red-500 bg-red-50'
    case 'medium': return 'border-yellow-500 bg-yellow-50'
    case 'low': return 'border-gray-400 bg-gray-50'
    default: return 'border-gray-400 bg-gray-50'
  }
}

const getStageIcon = (stage: string) => {
  switch (stage) {
    case 'applied': return <FileText className="h-4 w-4" />
    case 'screening': return <Search className="h-4 w-4" />
    case 'interview': return <Users className="h-4 w-4" />
    case 'offer': return <Send className="h-4 w-4" />
    case 'hired': return <CheckCircle className="h-4 w-4" />
    case 'rejected': return <XCircle className="h-4 w-4" />
    default: return <User className="h-4 w-4" />
  }
}

// --- SUB-COMPONENTS ---

function CandidateCard({ candidate, onClick }: { candidate: Candidate, onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: candidate.id 
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card 
        className={`mb-3 hover:shadow-md transition-all duration-200 border-l-4 ${getPriorityColor(candidate.priority)} cursor-default`}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3" {...listeners}>
              <Avatar className="h-10 w-10">
                <AvatarImage src={candidate.imageUrl || "/placeholder.svg"} alt={candidate.name} />
                <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-sm text-foreground">{candidate.name}</h4>
                <p className="text-xs text-muted-foreground">{candidate.position}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onClick}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Interview
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Application
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{candidate.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Briefcase className="h-3 w-3" />
              <span>{candidate.experience} years experience</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span>{formatSalary(candidate.expectedSalary)} expected</span>
            </div>

            {candidate.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 ${i < Math.round(candidate.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({candidate.rating})</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {candidate.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                {skill}
              </Badge>
            ))}
            {candidate.skills.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0">
                +{candidate.skills.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex justify-between items-center mt-3 pt-3 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Applied {formatDate(candidate.appliedDate)}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {candidate.source}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PipelineColumn({ stage, candidates, onCandidateClick }: { 
  stage: { id: StageId; title: string; color: string; description: string }, 
  candidates: Candidate[],
  onCandidateClick: (candidate: Candidate) => void
}) {
  const { setNodeRef } = useSortable({ id: stage.id, data: { type: 'column' } })

  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-80">
      <Card className="bg-muted/30 h-full flex flex-col">
        <CardHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
              <div>
                <h3 className="font-semibold text-sm">{stage.title}</h3>
                <p className="text-xs text-muted-foreground">{stage.description}</p>
              </div>
            </div>
            <Badge variant="secondary" className="ml-2">
              {candidates.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-2 flex-1 overflow-y-auto max-h-[600px]">
          <SortableContext items={candidates.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {candidates.map(candidate => (
              <CandidateCard key={candidate.id} candidate={candidate} onClick={() => onCandidateClick(candidate)} />
            ))}
          </SortableContext>
          {candidates.length === 0 && (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <div className="text-center">
                {getStageIcon(stage.id)}
                <p className="text-sm mt-2">No candidates</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function RecruitmentMetricsPanel({ metrics }: { metrics: RecruitmentMetrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Candidates</p>
              <p className="text-2xl font-bold">{metrics.totalCandidates}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">New This Week</p>
              <p className="text-2xl font-bold text-green-600">+{metrics.newThisWeek}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Time to Hire</p>
              <p className="text-2xl font-bold">{metrics.averageTimeToHire} days</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
            </div>
            <Award className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CandidateDetailModal({ candidate, isOpen, onClose }: { 
  candidate: Candidate | null, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  if (!candidate) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={candidate.imageUrl || "/placeholder.svg"} alt={candidate.name} />
              <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{candidate.name}</h2>
              <p className="text-muted-foreground">{candidate.position}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.location}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Professional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.education}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Current: {formatSalary(candidate.currentSalary)} | 
                      Expected: {formatSalary(candidate.expectedSalary)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{candidate.notes}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interviews" className="space-y-4 pt-4">
            {candidate.interviews.length > 0 ? (
              candidate.interviews.map((interview) => (
                <Card key={interview.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Interview</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(interview.date)} at {interview.time}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Interviewer: {interview.interviewer}
                        </p>
                      </div>
                      <Badge variant={interview.status === 'completed' ? 'default' : 'secondary'}>
                        {interview.status}
                      </Badge>
                    </div>
                    {interview.feedback && (
                      <div className="mt-3">
                        <p className="text-sm font-medium">Feedback:</p>
                        <p className="text-sm text-muted-foreground">{interview.feedback}</p>
                        {interview.rating && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm">Rating:</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < interview.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No interviews scheduled yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="evaluations" className="space-y-4 pt-4">
            {candidate.evaluations.length > 0 ? (
              candidate.evaluations.map((evaluation) => (
                <Card key={evaluation.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold">Evaluation by {evaluation.evaluator}</h4>
                        <p className="text-sm text-muted-foreground">{formatDate(evaluation.date)}</p>
                      </div>
                      <Badge variant="outline">
                        Overall: {evaluation.overallScore}/5
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">Technical</p>
                        <p className="text-lg font-bold text-blue-600">{evaluation.technicalScore}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Communication</p>
                        <p className="text-lg font-bold text-green-600">{evaluation.communicationScore}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Cultural Fit</p>
                        <p className="text-lg font-bold text-purple-600">{evaluation.culturalFitScore}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Overall</p>
                        <p className="text-lg font-bold text-orange-600">{evaluation.overallScore}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Comments:</p>
                      <p className="text-sm text-muted-foreground">{evaluation.comments}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No evaluations completed yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 pt-4">
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Document management coming soon</p>
              <Button variant="outline" className="mt-4">
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// --- MAIN COMPONENT ---

export default function AdvancedRecruitmentPipeline() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [metrics, setMetrics] = useState<RecruitmentMetrics | null>(null)
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPosition, setSelectedPosition] = useState<string>("all")
  const [selectedSource, setSelectedSource] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // CURSOR: API call to GET /api/v1/hcm/recruitment/pipeline
    // CURSOR: API call to GET /api/v1/hcm/recruitment/metrics
    setTimeout(() => {
      setCandidates(mockCandidates)
      setMetrics(mockMetrics)
      setLoading(false)
    }, 1000)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesPosition = selectedPosition === "all" || candidate.position === selectedPosition
      const matchesSource = selectedSource === "all" || candidate.source === selectedSource
      
      return matchesSearch && matchesPosition && matchesSource
    })
  }, [candidates, searchTerm, selectedPosition, selectedSource])

  const candidatesByStage = useMemo(() => {
    const grouped: Record<StageId, Candidate[]> = {
      applied: [], screening: [], interview: [], offer: [], hired: [], rejected: []
    }
    filteredCandidates.forEach(candidate => {
      if (grouped[candidate.stage]) {
        grouped[candidate.stage].push(candidate)
      }
    })
    return grouped
  }, [filteredCandidates])

  const uniquePositions = useMemo(() => {
    return Array.from(new Set(mockCandidates.map(c => c.position)))
  }, [])

  const uniqueSources = useMemo(() => {
    return Array.from(new Set(mockCandidates.map(c => c.source)))
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const candidate = candidates.find(c => c.id === active.id)
    if (candidate) setActiveCandidate(candidate)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCandidate(null)

    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const activeContainer = candidates.find(c => c.id === activeId)?.stage
    let overContainer: StageId | undefined

    // Check if dropping on a column
    const overIsColumn = stagesConfig.some(s => s.id === overId)
    if (overIsColumn) {
      overContainer = overId as StageId
    } else {
      // Dropping on another card, get its container
      overContainer = candidates.find(c => c.id === overId)?.stage
    }

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return
    }

    setCandidates(prev => {
      const activeIndex = prev.findIndex(c => c.id === activeId)
      if (activeIndex !== -1) {
        // CURSOR: API call to PUT /api/v1/hcm/recruitment/candidates/{activeId}/stage with { stage: overContainer }
        console.log(`Moving candidate ${activeId} to stage ${overContainer}`)
        const updatedCandidate = { ...prev[activeIndex], stage: overContainer! }
        const newCandidates = [...prev]
        newCandidates[activeIndex] = updatedCandidate
        return newCandidates
      }
      return prev
    })
  }

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setIsDetailModalOpen(true)
  }

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-muted/50 rounded-lg">
        <div className="text-center">
          <Users className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="mt-4 text-muted-foreground">Loading Recruitment Pipeline...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Metrics Panel */}
      {metrics && <RecruitmentMetricsPanel metrics={metrics} />}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4 items-center flex-wrap">
          <div className="relative flex-1 min-w-[200px] sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedPosition} onValueChange={setSelectedPosition}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Positions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {uniquePositions.map(position => (
                <SelectItem key={position} value={position}>{position}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {uniqueSources.map(source => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Candidate
        </Button>
      </div>

      {/* Pipeline Board */}
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {stagesConfig.map(stage => (
            <PipelineColumn 
              key={stage.id} 
              stage={stage} 
              candidates={candidatesByStage[stage.id]}
              onCandidateClick={handleCandidateClick}
            />
          ))}
        </div>
        <DragOverlay>
          {activeCandidate ? <CandidateCard candidate={activeCandidate} onClick={() => {}} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Candidate Detail Modal */}
      <CandidateDetailModal 
        candidate={selectedCandidate}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  )
}
