"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Users, User, Target, MessageSquare, BarChart3, Plus, ChevronRight, Brain, Star, Check, ArrowLeft } from 'lucide-react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// --- MOCK DATA AND TYPES ---

type Employee = {
  id: string
  name: string
  position: string
  imageUrl?: string
}

type FeedbackParticipant = Employee & { role: 'manager' | 'peer' | 'direct_report' | 'self' }

type Competency = {
  id: string
  name: string
  description: string
}

type FeedbackSubmission = {
  participantId: string
  ratings: Record<string, number> // competencyId -> rating
  comments: {
    strengths: string
    areasForImprovement: string
  }
}

type FeedbackCycle = {
  id: string
  subject: Employee
  participants: FeedbackParticipant[]
  competencies: Competency[]
  submissions: FeedbackSubmission[]
  status: 'draft' | 'in_progress' | 'completed'
  dueDate: string
}

const mockEmployees: Employee[] = [
  { id: 'EMP001', name: 'John Smith', position: 'Senior Software Engineer', imageUrl: '/public/placeholder-user.jpg' },
  { id: 'EMP002', name: 'Sarah Johnson', position: 'Engineering Manager', imageUrl: '/public/placeholder-user.jpg' },
  { id: 'EMP003', name: 'Ahmed Al-Rashid', position: 'Sales Executive', imageUrl: '/public/placeholder-user.jpg' },
  { id: 'EMP005', name: 'Jane Doe', position: 'Frontend Developer', imageUrl: '/public/placeholder-user.jpg' },
  { id: 'EMP006', name: 'Michael Chen', position: 'CEO', imageUrl: '/public/placeholder-user.jpg' },
]

const mockCompetencies: Competency[] = [
  { id: 'c1', name: 'Technical Skills', description: 'Demonstrates strong technical proficiency and knowledge.' },
  { id: 'c2', name: 'Communication', description: 'Effectively conveys information and ideas to others.' },
  { id: 'c3', name: 'Teamwork & Collaboration', description: 'Works effectively with others to achieve common goals.' },
  { id: 'c4', name: 'Leadership', description: 'Inspires and guides others towards achieving goals.' },
  { id: 'c5', name: 'Problem Solving', description: 'Identifies and resolves problems in a timely manner.' },
  { id: 'c6', name: 'Innovation', description: 'Generates new and creative ideas.' },
]

const mockFeedbackCycle: FeedbackCycle = {
  id: 'cycle-01',
  subject: mockEmployees[0],
  participants: [
    { ...mockEmployees[1], role: 'manager' },
    { ...mockEmployees[4], role: 'peer' },
    { id: 'EMP007', name: 'David Wilson', position: 'Backend Developer', role: 'peer' },
    { ...mockEmployees[0], role: 'self' },
  ],
  competencies: mockCompetencies,
  submissions: [
    { participantId: 'EMP002', ratings: { c1: 5, c2: 4, c3: 5, c4: 3, c5: 5, c6: 4 }, comments: { strengths: 'Excellent technical skills.', areasForImprovement: 'Could be more proactive in leading team discussions.' } },
    { participantId: 'EMP005', ratings: { c1: 4, c2: 5, c3: 5, c4: 4, c5: 4, c6: 5 }, comments: { strengths: 'Great collaborator and communicator.', areasForImprovement: 'Sometimes gets bogged down in details.' } },
    { participantId: 'EMP007', ratings: { c1: 5, c2: 4, c3: 4, c4: 3, c5: 5, c6: 3 }, comments: { strengths: 'Incredibly strong problem solver.', areasForImprovement: 'Can be quiet in larger group settings.' } },
    { participantId: 'EMP001', ratings: { c1: 4, c2: 4, c3: 5, c4: 3, c5: 4, c6: 4 }, comments: { strengths: 'I feel I am a strong team player.', areasForImprovement: 'I want to develop my leadership skills.' } },
  ],
  status: 'completed',
  dueDate: '2024-08-30',
}

// --- SUB-COMPONENTS ---

const FeedbackResults = ({ cycle }: { cycle: FeedbackCycle }) => {
  const chartData = useMemo(() => {
    // CURSOR: API call to GET /api/v1/hcm/feedback/360/cycles/{cycle.id}/results
    const aggregated: Record<string, { self: number[], manager: number[], peer: number[] }> = {}

    cycle.competencies.forEach(c => {
      aggregated[c.id] = { self: [], manager: [], peer: [] }
    })

    cycle.submissions.forEach(sub => {
      const participant = cycle.participants.find(p => p.id === sub.participantId)
      if (!participant) return

      for (const [competencyId, rating] of Object.entries(sub.ratings)) {
        if (participant.role === 'self') aggregated[competencyId].self.push(rating)
        else if (participant.role === 'manager') aggregated[competencyId].manager.push(rating)
        else if (participant.role === 'peer') aggregated[competencyId].peer.push(rating)
      }
    })

    return cycle.competencies.map(c => {
      const selfAvg = aggregated[c.id].self.length > 0 ? aggregated[c.id].self.reduce((a, b) => a + b, 0) / aggregated[c.id].self.length : 0
      const managerAvg = aggregated[c.id].manager.length > 0 ? aggregated[c.id].manager.reduce((a, b) => a + b, 0) / aggregated[c.id].manager.length : 0
      const peerAvg = aggregated[c.id].peer.length > 0 ? aggregated[c.id].peer.reduce((a, b) => a + b, 0) / aggregated[c.id].peer.length : 0
      return {
        subject: c.name,
        Self: selfAvg,
        Manager: managerAvg,
        Peers: peerAvg,
        fullMark: 5,
      }
    })
  }, [cycle])

  const getCommentsByRole = (role: FeedbackParticipant['role']) => {
    return cycle.submissions
      .filter(s => cycle.participants.find(p => p.id === s.participantId)?.role === role)
      .map(s => s.comments)
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><BarChart3 className="mr-2 h-5 w-5" />Feedback Summary</CardTitle>
          <CardDescription>Aggregated scores across all competencies and reviewer types.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 5]} />
              <Radar name="Self" dataKey="Self" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Radar name="Manager" dataKey="Manager" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
              <Radar name="Peers" dataKey="Peers" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Strengths</CardTitle>
            <CardDescription>Common themes identified as strengths.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {getCommentsByRole('manager').map((c, i) => <p key={i} className="text-sm p-3 bg-muted rounded-md"><strong>Manager:</strong> {c.strengths}</p>)}
            {getCommentsByRole('peer').map((c, i) => <p key={i} className="text-sm p-3 bg-muted rounded-md"><strong>Peer:</strong> {c.strengths}</p>)}
            {getCommentsByRole('self').map((c, i) => <p key={i} className="text-sm p-3 bg-muted rounded-md"><strong>Self:</strong> {c.strengths}</p>)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Areas for Improvement</CardTitle>
            <CardDescription>Opportunities for growth and development.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {getCommentsByRole('manager').map((c, i) => <p key={i} className="text-sm p-3 bg-muted rounded-md"><strong>Manager:</strong> {c.areasForImprovement}</p>)}
            {getCommentsByRole('peer').map((c, i) => <p key={i} className="text-sm p-3 bg-muted rounded-md"><strong>Peer:</strong> {c.areasForImprovement}</p>)}
            {getCommentsByRole('self').map((c, i) => <p key={i} className="text-sm p-3 bg-muted rounded-md"><strong>Self:</strong> {c.areasForImprovement}</p>)}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const FeedbackForm = ({ cycle, participant, onBack }: { cycle: FeedbackCycle, participant: FeedbackParticipant, onBack: () => void }) => {
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [comments, setComments] = useState({ strengths: '', areasForImprovement: '' })

  const handleSubmit = () => {
    // CURSOR: API call to POST /api/v1/hcm/feedback/360/cycles/{cycle.id}/submit
    console.log({ participantId: participant.id, ratings, comments })
    alert('Feedback submitted successfully!')
    onBack()
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Overview</Button>
      <Card>
        <CardHeader>
          <CardTitle>Feedback for {cycle.subject.name}</CardTitle>
          <CardDescription>Your feedback is valuable. Please be honest and constructive.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {cycle.competencies.map(c => (
            <div key={c.id} className="space-y-3 p-4 border rounded-lg">
              <h4 className="font-semibold">{c.name}</h4>
              <p className="text-sm text-muted-foreground">{c.description}</p>
              <div className="flex items-center gap-4">
                <Slider
                  defaultValue={[3]}
                  max={5}
                  min={1}
                  step={1}
                  onValueChange={(value) => setRatings(prev => ({ ...prev, [c.id]: value[0] }))}
                />
                <Badge variant="secondary" className="w-12 justify-center">{ratings[c.id] || 'N/A'}</Badge>
              </div>
            </div>
          ))}
          <div className="space-y-4">
            <div>
              <label className="font-semibold">Strengths</label>
              <p className="text-sm text-muted-foreground mb-2">What are this person's key strengths?</p>
              <Textarea value={comments.strengths} onChange={e => setComments(c => ({ ...c, strengths: e.target.value }))} />
            </div>
            <div>
              <label className="font-semibold">Areas for Improvement</label>
              <p className="text-sm text-muted-foreground mb-2">What are some areas where this person could improve?</p>
              <Textarea value={comments.areasForImprovement} onChange={e => setComments(c => ({ ...c, areasForImprovement: e.target.value }))} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit}>Submit Feedback</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// --- MAIN COMPONENT ---

export default function ThirtySixtyFeedback() {
  const [cycles, setCycles] = useState<FeedbackCycle[]>([mockFeedbackCycle])
  const [selectedCycle, setSelectedCycle] = useState<FeedbackCycle | null>(mockFeedbackCycle)
  const [view, setView] = useState<'overview' | 'results' | 'form'>('overview')
  const [currentUser, setCurrentUser] = useState<Employee>(mockEmployees[1]) // Mock current user as manager

  const handleCreateCycle = () => {
    // CURSOR: API call to POST /api/v1/hcm/feedback/360/cycles
    alert("This would open a wizard to create a new feedback cycle.")
  }

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">360° Feedback Cycles</h2>
        <Button onClick={handleCreateCycle}><Plus className="mr-2 h-4 w-4" /> Create New Cycle</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Active & Recent Cycles</CardTitle>
        </CardHeader>
        <CardContent>
          {/* CURSOR: API call to GET /api/v1/hcm/feedback/360/cycles */}
          {cycles.map(cycle => {
            const completion = (cycle.submissions.length / cycle.participants.length) * 100
            return (
              <div key={cycle.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={cycle.subject.imageUrl || "/placeholder.svg"} />
                    <AvatarFallback>{cycle.subject.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{cycle.subject.name}'s 360° Feedback</p>
                    <p className="text-sm text-muted-foreground">Due: {cycle.dueDate} • Status: <Badge variant={cycle.status === 'completed' ? 'default' : 'secondary'}>{cycle.status}</Badge></p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-48">
                    <p className="text-sm text-muted-foreground mb-1">Completion: {cycle.submissions.length} of {cycle.participants.length}</p>
                    <Progress value={completion} />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedCycle(cycle); setView('results') }}>View Report</Button>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedCycle(cycle); setView('form') }}>Give Feedback</Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    if (!selectedCycle) return renderOverview()

    switch (view) {
      case 'results':
        return <FeedbackResults cycle={selectedCycle} />
      case 'form':
        const participant = selectedCycle.participants.find(p => p.id === currentUser.id)
        if (!participant) {
          alert("You are not a participant in this feedback cycle.")
          setView('overview')
          return null
        }
        return <FeedbackForm cycle={selectedCycle} participant={participant} onBack={() => setView('overview')} />
      case 'overview':
      default:
        return renderOverview()
    }
  }

  return (
    <div className="p-4">
      {renderContent()}
    </div>
  )
}
