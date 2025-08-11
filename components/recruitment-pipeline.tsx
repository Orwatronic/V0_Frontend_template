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
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, DollarSign, Briefcase, Calendar, User, Star, CheckCircle, XCircle, Mail, Phone, ClipboardList } from 'lucide-react'

// --- MOCK DATA AND TYPES ---

interface Candidate {
  id: string
  name: string
  email: string
  positionTitle: string
  stage: 'sourced' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'
  appliedDate: string
  recruiter: string
  priority: "high" | "medium" | "low"
  imageUrl?: string
}

const initialCandidates: Candidate[] = [
  { id: 'cand-1', name: 'Alex Thompson', email: 'alex.t@example.com', positionTitle: 'Senior Software Engineer', stage: 'interview', appliedDate: '2024-07-20', recruiter: 'Jane Doe', priority: 'high', imageUrl: '/public/placeholder-user.jpg' },
  { id: 'cand-2', name: 'Maria Rodriguez', email: 'maria.r@example.com', positionTitle: 'Product Manager', stage: 'offer', appliedDate: '2024-07-15', recruiter: 'John Smith', priority: 'high', imageUrl: '/public/placeholder-user.jpg' },
  { id: 'cand-3', name: 'Chen Wei', email: 'chen.w@example.com', positionTitle: 'UX Designer', stage: 'screening', appliedDate: '2024-07-22', recruiter: 'Jane Doe', priority: 'medium', imageUrl: '/public/placeholder-user.jpg' },
  { id: 'cand-4', name: 'Emily Carter', email: 'emily.c@example.com', positionTitle: 'Data Scientist', stage: 'sourced', appliedDate: '2024-07-25', recruiter: 'John Smith', priority: 'low', imageUrl: '/public/placeholder-user.jpg' },
  { id: 'cand-5', name: 'David Lee', email: 'david.l@example.com', positionTitle: 'Senior Software Engineer', stage: 'interview', appliedDate: '2024-07-18', recruiter: 'Jane Doe', priority: 'high', imageUrl: '/public/placeholder-user.jpg' },
  { id: 'cand-6', name: 'Fatima Al-Sayed', email: 'fatima.a@example.com', positionTitle: 'Marketing Specialist', stage: 'hired', appliedDate: '2024-06-10', recruiter: 'John Smith', priority: 'medium', imageUrl: '/public/placeholder-user.jpg' },
  { id: 'cand-7', name: 'Brian O\'Connell', email: 'brian.o@example.com', positionTitle: 'DevOps Engineer', stage: 'rejected', appliedDate: '2024-07-05', recruiter: 'Jane Doe', priority: 'medium', imageUrl: '/public/placeholder-user.jpg' },
  { id: 'cand-8', name: 'Sophia Williams', email: 'sophia.w@example.com', positionTitle: 'UX Designer', stage: 'screening', appliedDate: '2024-07-24', recruiter: 'Jane Doe', priority: 'medium' },
];

const stagesConfig = [
  { id: 'sourced', title: 'Sourced', color: 'bg-gray-400' },
  { id: 'screening', title: 'Screening', color: 'bg-blue-500' },
  { id: 'interview', title: 'Interview', color: 'bg-purple-500' },
  { id: 'offer', title: 'Offer', color: 'bg-yellow-500' },
  { id: 'hired', title: 'Hired', color: 'bg-green-600' },
  { id: 'rejected', title: 'Rejected', color: 'bg-red-600' },
] as const;

type StageId = typeof stagesConfig[number]['id'];

// --- HELPER FUNCTIONS ---

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// --- SUB-COMPONENTS ---

function CandidateCard({ candidate }: { candidate: Candidate }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityConfig = {
    high: { color: "border-red-500", icon: <Star className="h-3 w-3 text-red-500" /> },
    medium: { color: "border-yellow-500", icon: <Star className="h-3 w-3 text-yellow-500" /> },
    low: { color: "border-gray-400", icon: <Star className="h-3 w-3 text-gray-400" /> },
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className={`mb-4 bg-card hover:shadow-md transition-shadow border-l-4 ${priorityConfig[candidate.priority].color}`}>
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={candidate.imageUrl || "/placeholder.svg"} alt={candidate.name} />
                <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm text-foreground leading-tight">{candidate.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{candidate.positionTitle}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Profile</DropdownMenuItem>
                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Edit Application</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>Applied: {formatDate(candidate.appliedDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              <span>{candidate.recruiter}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PipelineColumn({ stage, candidates }: { stage: { id: StageId; title: string; color: string }, candidates: Candidate[] }) {
  const { setNodeRef } = useSortable({ id: stage.id });

  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-80">
      <Card className="bg-muted/50 h-full flex flex-col">
        <CardHeader className="p-3 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
              <h3 className="font-semibold text-sm">{stage.title}</h3>
            </div>
            <Badge variant="secondary">{candidates.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-2 flex-1 overflow-y-auto">
          <SortableContext items={candidates.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {candidates.map(cand => <CandidateCard key={cand.id} candidate={cand} />)}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}

// --- MAIN COMPONENT ---

export default function RecruitmentPipeline() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // CURSOR: API call to GET /api/v1/hcm/recruitment/pipeline
    setCandidates(initialCandidates);
    setLoading(false);
  }, []);

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  }));

  const candidatesByStage = useMemo(() => {
    const grouped: Record<StageId, Candidate[]> = {
      sourced: [], screening: [], interview: [], offer: [], hired: [], rejected: []
    };
    candidates.forEach(cand => {
      if (grouped[cand.stage]) {
        grouped[cand.stage].push(cand);
      }
    });
    return grouped;
  }, [candidates]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const cand = candidates.find(c => c.id === active.id);
    if (cand) setActiveCandidate(cand);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCandidate(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeContainer = candidates.find(c => c.id === activeId)?.stage;
    let overContainer: StageId | undefined;

    if (stagesConfig.some(s => s.id === overId)) {
      overContainer = overId as StageId;
    } else {
      overContainer = candidates.find(c => c.id === overId)?.stage;
    }

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setCandidates(prev => {
      const activeIndex = prev.findIndex(c => c.id === activeId);
      if (activeIndex !== -1) {
        // CURSOR: API call to PATCH /api/v1/hcm/recruitment/candidates/{activeId} with { stage: overContainer }
        console.log(`Moving candidate ${activeId} to stage ${overContainer}`);
        const updatedCandidate = { ...prev[activeIndex], stage: overContainer! };
        const newCandidates = [...prev];
        newCandidates[activeIndex] = updatedCandidate;
        return newCandidates;
      }
      return prev;
    });
  };
  
  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-muted/50 rounded-lg">
        <div className="text-center">
          <ClipboardList className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="mt-4 text-muted-foreground">Loading Recruitment Pipeline...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stagesConfig.map(stage => (
            <PipelineColumn key={stage.id} stage={stage} candidates={candidatesByStage[stage.id]} />
          ))}
        </div>
        <DragOverlay>
          {activeCandidate ? <CandidateCard candidate={activeCandidate} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
