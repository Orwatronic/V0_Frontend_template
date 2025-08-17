"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { useI18n } from "@/contexts/i18n-context"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type StageId = 'lead' | 'qualified' | 'proposal' | 'won' | 'lost'

type Opportunity = {
  id: string
  name: string
  amount: number
  stage: StageId
}

type OppsResponse = { data: Opportunity[] }

export default function OpportunitiesPage() {
  return (
    <ProtectedRoute required="view:sales">
      <AppShell>
        <OpportunitiesPageContent />
      </AppShell>
    </ProtectedRoute>
  )
}

function OpportunitiesPageContent() {
  const { t } = useI18n()
  const [items, setItems] = useState<Opportunity[]>([])
  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/sales/pipeline/opportunities', { cache: 'no-store' })
        const json: OppsResponse = await res.json()
        if (!mounted) return
        setItems(json.data || [])
      } finally {}
    })()
    // SSE realtime updates
    try {
      const es = new EventSource('/api/crm/events')
      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data)
          if (data?.type === 'opportunityUpdated') {
            setItems((prev) => prev.map((o) => (o.id === data.payload.id ? { ...o, stage: data.payload.stage } : o)))
          }
        } catch {}
      }
      return () => { es.close(); mounted = false }
    } catch {}
    return () => { mounted = false }
  }, [])

  const byStage = useMemo(() => {
    const map: Record<StageId, Opportunity[]> = { lead: [], qualified: [], proposal: [], won: [], lost: [] }
    for (const o of items) map[o.stage].push(o)
    return map
  }, [items])

  const stages: { id: StageId; label: string }[] = [
    { id: 'lead', label: t('crm.opps.stages.lead') },
    { id: 'qualified', label: t('crm.opps.stages.qualified') },
    { id: 'proposal', label: t('crm.opps.stages.proposal') },
    { id: 'won', label: t('crm.opps.stages.won') },
    { id: 'lost', label: t('crm.opps.stages.lost') },
  ]

  const totals = useMemo(() => {
    const sum = (arr: Opportunity[]) => arr.reduce((acc, o) => acc + (o.amount || 0), 0)
    const total = sum(items)
    const wonAmt = sum(items.filter((o) => o.stage === 'won'))
    const pipelineAmt = sum(items.filter((o) => o.stage !== 'won' && o.stage !== 'lost'))
    const weights: Record<StageId, number> = { lead: 0.1, qualified: 0.5, proposal: 0.7, won: 1, lost: 0 }
    const forecast = items.reduce((acc, o) => acc + o.amount * (weights[o.stage] ?? 0), 0)
    return { total, wonAmt, pipelineAmt, forecast }
  }, [items])

  const wipLimits: Partial<Record<StageId, number>> = { lead: 15, qualified: 10, proposal: 8 }

  return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-6" aria-label={t('crm.opps.title')}>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">{t('crm.opps.title')}</h1>
        <p className="text-muted-foreground">{t('crm.opps.subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Card>
          <CardHeader className="py-2"><CardTitle className="text-sm">{t('crm.opps.metrics.total')}</CardTitle></CardHeader>
          <CardContent className="py-2 text-xl font-semibold">{totals.total}</CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2"><CardTitle className="text-sm">{t('crm.opps.metrics.won')}</CardTitle></CardHeader>
          <CardContent className="py-2 text-xl font-semibold">{totals.wonAmt}</CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2"><CardTitle className="text-sm">{t('crm.opps.metrics.pipeline')}</CardTitle></CardHeader>
          <CardContent className="py-2 text-xl font-semibold">{totals.pipelineAmt}</CardContent>
        </Card>
        <Card>
          <CardHeader className="py-2"><CardTitle className="text-sm">{t('crm.opps.metrics.forecast')}</CardTitle></CardHeader>
          <CardContent className="py-2 text-xl font-semibold">{Math.round(totals.forecast)}</CardContent>
        </Card>
      </div>

      <DndContext
        sensors={sensors}
        onDragEnd={async (event: DragEndEvent) => {
          const { active, over } = event
          if (!over || !active) return
          const [type, id] = String(active.id).split(':')
          let overStage: StageId | null = null
          const overId = String(over.id)
          if (overId.startsWith('opp:')) {
            const overOppId = overId.split(':')[1]
            const overOpp = items.find((i) => i.id === overOppId)
            overStage = (overOpp?.stage as StageId) || null
          } else if (["lead","qualified","proposal","won","lost"].includes(overId)) {
            overStage = overId as StageId
          }
          if (!overStage) return
          if (type !== 'opp') return
          setItems((prev) => prev.map((o) => (o.id === id ? { ...o, stage: overStage } : o)))
          try {
            await fetch(`/api/crm/opportunities/${id}/stage`, {
              method: 'PATCH',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ stage: overStage }),
            })
          } catch {}
        }}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {stages.map((s) => (
            <Card key={s.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{s.label}</span>
                  <div className="flex items-center gap-2">
                    {wipLimits[s.id] && (
                      <span className={byStage[s.id].length > (wipLimits[s.id] || 0) ? 'text-red-600 text-xs' : 'text-muted-foreground text-xs'}>
                        WIP {byStage[s.id].length}/{wipLimits[s.id]}
                      </span>
                    )}
                    <Badge variant="secondary">{byStage[s.id].length}</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SortableContext items={byStage[s.id].map((o) => `opp:${o.id}`)} strategy={verticalListSortingStrategy} id={s.id}>
                  <ul className="space-y-2" id={s.id}>
                    {byStage[s.id].map((o) => (
                      <SortableOpp key={`opp:${o.id}`} opp={o} />
                    ))}
                  </ul>
                </SortableContext>
              </CardContent>
            </Card>
          ))}
        </div>
      </DndContext>
    </main>
  )
}

function SortableOpp({ opp }: { opp: Opportunity }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `opp:${opp.id}` })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners} className="rounded-md border p-2 text-sm bg-background">
      <div className="flex items-center justify-between">
        <span className="font-medium">{opp.name}</span>
        <span className="text-muted-foreground">{opp.amount}</span>
      </div>
    </li>
  )
}


