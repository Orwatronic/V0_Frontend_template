"use client"

import React, { useState, useMemo } from "react"
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, DollarSign, TrendingUp, Target, Calendar, User, Star, CheckCircle, XCircle } from 'lucide-react'

// --- MOCK DATA AND TYPES ---

interface Opportunity {
  id: string
  title: string
  customerName: string
  value: number
  currency: string
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'
  closeDate: string
  salesRep: string
  priority: "high" | "medium" | "low"
}

const initialOpportunities: Opportunity[] = [
  { id: 'opp-1', title: 'Cloud Migration Project', customerName: 'TechCorp Solutions', value: 150000, currency: 'USD', stage: 'proposal', closeDate: '2024-08-30', salesRep: 'Alice Johnson', priority: 'high' },
  { id: 'opp-2', title: 'ERP System Upgrade', customerName: 'Global Tech Ltd', value: 250000, currency: 'USD', stage: 'negotiation', closeDate: '2024-09-15', salesRep: 'Carol Davis', priority: 'high' },
  { id: 'opp-3', title: 'Retail Analytics Platform', customerName: 'Retail Plus Inc', value: 75000, currency: 'USD', stage: 'qualified', closeDate: '2024-08-20', salesRep: 'Bob Wilson', priority: 'medium' },
  { id: 'opp-4', title: 'New Marketing Website', customerName: 'Creative Minds Agency', value: 45000, currency: 'USD', stage: 'lead', closeDate: '2024-09-01', salesRep: 'Alice Johnson', priority: 'low' },
  { id: 'opp-5', title: 'Cybersecurity Audit', customerName: 'SecureNet Systems', value: 95000, currency: 'USD', stage: 'qualified', closeDate: '2024-08-25', salesRep: 'David Lee', priority: 'high' },
  { id: 'opp-6', title: 'Office 365 Deployment', customerName: 'Innovate LLC', value: 60000, currency: 'USD', stage: 'proposal', closeDate: '2024-09-10', salesRep: 'Bob Wilson', priority: 'medium' },
  { id: 'opp-7', title: 'Hardware Refresh', customerName: 'TechCorp Solutions', value: 220000, currency: 'USD', stage: 'closed-won', closeDate: '2024-07-28', salesRep: 'Carol Davis', priority: 'high' },
  { id: 'opp-8', title: 'Custom Software Dev', customerName: 'Pioneer Corp', value: 350000, currency: 'USD', stage: 'lead', closeDate: '2024-10-01', salesRep: 'Alice Johnson', priority: 'high' },
  { id: 'opp-9', title: 'Data Warehouse Solution', customerName: 'Global Tech Ltd', value: 180000, currency: 'USD', stage: 'negotiation', closeDate: '2024-08-28', salesRep: 'David Lee', priority: 'medium' },
  { id: 'opp-10', title: 'SEO & Content Strategy', customerName: 'Retail Plus Inc', value: 30000, currency: 'USD', stage: 'closed-lost', closeDate: '2024-07-15', salesRep: 'Bob Wilson', priority: 'low' },
];

const stagesConfig = [
  { id: 'lead', title: 'Lead', color: 'bg-gray-500' },
  { id: 'qualified', title: 'Qualified', color: 'bg-blue-500' },
  { id: 'proposal', title: 'Proposal', color: 'bg-yellow-500' },
  { id: 'negotiation', title: 'Negotiation', color: 'bg-orange-500' },
  { id: 'closed-won', title: 'Closed Won', color: 'bg-green-600' },
  { id: 'closed-lost', title: 'Closed Lost', color: 'bg-red-600' },
] as const;

type StageId = typeof stagesConfig[number]['id'];

// --- HELPER FUNCTIONS ---

const formatCurrency = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// --- SUB-COMPONENTS ---

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: opportunity.id });

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
      <Card className={`mb-4 bg-card hover:shadow-md transition-shadow border-l-4 ${priorityConfig[opportunity.priority].color}`}>
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-sm text-foreground leading-tight">{opportunity.title}</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Details</DropdownMenuItem>
                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Edit Opportunity</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{opportunity.customerName}</p>
          <div className="flex justify-between items-center mt-3">
            <p className="text-sm font-bold text-primary">{formatCurrency(opportunity.value)}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(opportunity.closeDate)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <User className="h-3 w-3" />
            <span>{opportunity.salesRep}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PipelineColumn({ stage, opportunities }: { stage: { id: StageId; title: string; color: string }, opportunities: Opportunity[] }) {
  const { setNodeRef } = useSortable({ id: stage.id });
  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);

  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-72">
      <Card className="bg-muted/50 h-full">
        <CardHeader className="p-3 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
              <h3 className="font-semibold text-sm">{stage.title}</h3>
            </div>
            <Badge variant="secondary">{opportunities.length}</Badge>
          </div>
          <p className="text-xs text-muted-foreground pt-1">{formatCurrency(totalValue)}</p>
        </CardHeader>
        <CardContent className="p-2 h-[calc(100%-4rem)] overflow-y-auto">
          <SortableContext items={opportunities.map(o => o.id)} strategy={verticalListSortingStrategy}>
            {opportunities.map(opp => <OpportunityCard key={opp.id} opportunity={opp} />)}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}

// --- MAIN COMPONENT ---

export default function SalesPipeline() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [activeOpp, setActiveOpp] = useState<Opportunity | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  }));

  const opportunitiesByStage = useMemo(() => {
    // CURSOR: API call to GET /api/v1/sales/opportunities
    const grouped: Record<StageId, Opportunity[]> = {
      lead: [], qualified: [], proposal: [], negotiation: [], 'closed-won': [], 'closed-lost': []
    };
    opportunities.forEach(opp => {
      if (grouped[opp.stage]) {
        grouped[opp.stage].push(opp);
      }
    });
    return grouped;
  }, [opportunities]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const opp = opportunities.find(o => o.id === active.id);
    if (opp) setActiveOpp(opp);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveOpp(null);

    if (over && active.id !== over.id) {
      setOpportunities(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newStage = (Object.keys(opportunitiesByStage).includes(over.id as string) ? over.id : items.find(i => i.id === over.id)?.stage) as StageId;
        
        if (!newStage) return items;

        // CURSOR: API call to PATCH /api/v1/sales/opportunities/{active.id} with { stage: newStage }
        const updatedItems = items.map(item => item.id === active.id ? { ...item, stage: newStage } : item);
        
        const activeItem = updatedItems.find(item => item.id === active.id);
        if (!activeItem) return items;

        const itemsInNewStage = updatedItems.filter(item => item.stage === newStage && item.id !== active.id);
        const overInNewStageIndex = itemsInNewStage.findIndex(item => item.id === over.id);

        const reorderedItems = arrayMove(updatedItems.filter(i => i.id !== active.id), oldIndex, overInNewStageIndex);
        
        // This is a simplified re-ordering. A more robust solution would re-order within stages.
        // For now, we just update the stage.
        const finalItems = [...items];
        const activeIndex = finalItems.findIndex(i => i.id === active.id);
        if (activeIndex !== -1) {
          finalItems[activeIndex] = { ...finalItems[activeIndex], stage: newStage };
        }
        return finalItems;
      });
    }
  };

  const analyticsData = {
    // CURSOR: API call to GET /api/v1/sales/pipeline/analytics
    totalValue: opportunities.reduce((sum, opp) => sum + opp.value, 0),
    conversionRate: 45.8,
    avgDealSize: 125000,
  };

  return (
    <div className="space-y-6">
      {/* Analytics Overlay */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.totalValue)}</div>
            <p className="text-xs text-muted-foreground">Total value of all open opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">From lead to closed-won</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Deal Size</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.avgDealSize)}</div>
            <p className="text-xs text-muted-foreground">Average value of won deals</p>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stagesConfig.map(stage => (
            <PipelineColumn key={stage.id} stage={stage} opportunities={opportunitiesByStage[stage.id]} />
          ))}
        </div>
        <DragOverlay>
          {activeOpp ? <OpportunityCard opportunity={activeOpp} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
