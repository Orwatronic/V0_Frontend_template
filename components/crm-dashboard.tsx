"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, TrendingUp, DollarSign, Smile, ArrowRight } from "lucide-react"
import { useI18n } from "@/contexts/i18n-context"

type KpiApiItem = {
  id: string
  labelKey: string
  value: string
  helper?: string
  icon: "users" | "trendingUp" | "dollarSign" | "smile"
}

type KpiResponse = { data: KpiApiItem[] }
type ActivityFeedResponse = {
  data: (
    | { id: string; type: "quotation"; company: string; at: string }
    | { id: string; type: "support"; customer: string; at: string }
    | { id: string; type: "invoice"; customer: string; at: string }
  )[]
}
type TasksResponse = { data: { id: string; type: "call" | "meeting" | "followup"; with: string; at: string }[] }
type OpportunitiesResponse = { data: { id: string; stage: "lead" | "qualified" | "proposal" | "won" }[] }

type KPI = {
  id: string
  labelKey: string
  value: string
  helper?: string
  icon: React.ComponentType<{ className?: string }>
}
type ActivityItem =
  | { id: string; type: "quotation"; company: string; at: string }
  | { id: string; type: "support"; customer: string; at: string }
  | { id: string; type: "invoice"; customer: string; at: string }
type FunnelStage = { id: string; labelKey: string; value: number; percent: number }
type TaskItem = { id: string; type: "call" | "meeting" | "followup"; with: string; at: string }

const iconMap = {
  users: Users,
  trendingUp: TrendingUp,
  dollarSign: DollarSign,
  smile: Smile,
} as const

export default function CrmDashboard() {
  const { t } = useI18n()

  const [kpis, setKpis] = useState<KPI[] | null>(null)
  const [activities, setActivities] = useState<ActivityItem[] | null>(null)
  const [funnel, setFunnel] = useState<FunnelStage[] | null>(null)
  const [tasks, setTasks] = useState<TaskItem[] | null>(null)
  const [loading, setLoading] = useState(true)

  async function fetchKpis(): Promise<KPI[]> {
    // CURSOR: API call to GET /api/v1/crm/dashboard/kpis
    const res = await fetch("/api/crm/dashboard/kpis", { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to load KPIs")
    const json: KpiResponse = await res.json()
    return (json.data || []).map((k) => ({
      id: k.id,
      labelKey: k.labelKey,
      value: k.value,
      helper: k.helper,
      icon: iconMap[k.icon] ?? Users,
    }))
  }

  async function fetchActivityFeed(): Promise<ActivityItem[]> {
    // CURSOR: API call to GET /api/v1/crm/dashboard/activity-feed
    const res = await fetch("/api/crm/dashboard/activity-feed", { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to load activity feed")
    const json: ActivityFeedResponse = await res.json()
    return json.data
  }

  async function fetchTasks(): Promise<TaskItem[]> {
    // CURSOR: API call to GET /api/v1/crm/dashboard/tasks
    const res = await fetch("/api/crm/dashboard/tasks", { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to load tasks")
    const json: TasksResponse = await res.json()
    return json.data
  }

  async function fetchFunnel(): Promise<FunnelStage[]> {
    // CURSOR: API call to GET /api/v1/sales/pipeline/opportunities
    const res = await fetch("/api/sales/pipeline/opportunities", { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to load opportunities")
    const json: OpportunitiesResponse = await res.json()
    const total = json.data.length || 1
    const leads = json.data.filter((o) => o.stage === "lead").length
    const qualified = json.data.filter((o) => o.stage === "qualified").length
    const proposals = json.data.filter((o) => o.stage === "proposal").length
    const won = json.data.filter((o) => o.stage === "won").length

    return [
      {
        id: "leads",
        labelKey: "crm.dashboard.funnel.stages.leads",
        value: leads,
        percent: Math.round((leads / total) * 100),
      },
      {
        id: "qualified",
        labelKey: "crm.dashboard.funnel.stages.qualified",
        value: qualified,
        percent: Math.round((qualified / total) * 100),
      },
      {
        id: "proposals",
        labelKey: "crm.dashboard.funnel.stages.proposals",
        value: proposals,
        percent: Math.round((proposals / total) * 100),
      },
      { id: "won", labelKey: "crm.dashboard.funnel.stages.won", value: won, percent: Math.round((won / total) * 100) },
    ]
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      const [kRes, aRes, fRes, tRes] = await Promise.allSettled([
        fetchKpis(),
        fetchActivityFeed(),
        fetchFunnel(),
        fetchTasks(),
      ])
      if (!mounted) return

      if (kRes.status === "fulfilled") setKpis(kRes.value)
      if (aRes.status === "fulfilled") setActivities(aRes.value)
      if (fRes.status === "fulfilled") setFunnel(fRes.value)
      if (tRes.status === "fulfilled") setTasks(tRes.value)

      setLoading(false)

      // Log any failures for debugging without breaking the page
      if (kRes.status === "rejected") console.error("CRM dashboard KPIs error:", kRes.reason)
      if (aRes.status === "rejected") console.error("CRM dashboard activity error:", aRes.reason)
      if (fRes.status === "rejected") console.error("CRM dashboard funnel error:", fRes.reason)
      if (tRes.status === "rejected") console.error("CRM dashboard tasks error:", tRes.reason)
    })()
    return () => {
      mounted = false
    }
  }, [])

  const dateFormatter = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" })
    } catch {
      return null
    }
  }, [])

  return (
    <section aria-label={t("crm.dashboard.title")} className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t("crm.dashboard.title")}</h1>
        <p className="text-muted-foreground">{t("crm.dashboard.subtitle")}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(kpis ?? []).map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.id} className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t(kpi.labelKey)}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                {kpi.helper ? <p className="text-xs text-muted-foreground">{t(kpi.helper)}</p> : null}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Funnel + Tasks */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t("crm.dashboard.funnel.title")}</span>
              <Badge variant="secondary" className="text-xs">
                {t("crm.dashboard.funnel.badge")}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div role="img" aria-label={t("crm.dashboard.funnel.alt")} className="space-y-3">
              {(funnel ?? []).map((stage) => (
                <div key={stage.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{t(stage.labelKey)}</span>
                    <span className="text-muted-foreground">{stage.value}</span>
                  </div>
                  <Progress value={stage.percent} aria-valuetext={`${stage.percent}%`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("crm.dashboard.tasks.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(tasks ?? []).map((task) => (
                <li key={task.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {task.type === "call" && t("crm.dashboard.tasks.callWith", { company: task.with })}
                      {task.type === "meeting" && t("crm.dashboard.tasks.meetingWith", { company: task.with })}
                      {task.type === "followup" && t("crm.dashboard.tasks.followUpWith", { company: task.with })}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dateFormatter ? dateFormatter.format(new Date(task.at)) : task.at}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>{t("crm.dashboard.activityFeed.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div role="feed" aria-busy={loading ? "true" : "false"}>
            {activities && activities.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">{t("crm.dashboard.activityFeed.activity")}</TableHead>
                    <TableHead className="w-[50%]">{t("crm.dashboard.activityFeed.when")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <span className="sr-only">{t("crm.dashboard.activityFeed.itemTypeLabel")}</span>
                        <span>
                          {item.type === "quotation" &&
                            t("crm.dashboard.activityFeed.items.quotation", { company: item.company })}
                          {item.type === "support" &&
                            t("crm.dashboard.activityFeed.items.support", { customer: item.customer })}
                          {item.type === "invoice" &&
                            t("crm.dashboard.activityFeed.items.invoice", { customer: item.customer })}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {dateFormatter ? dateFormatter.format(new Date(item.at)) : item.at}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">{t("crm.dashboard.activityFeed.empty")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
