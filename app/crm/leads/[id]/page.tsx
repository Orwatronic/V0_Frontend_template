"use client"

import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { useI18n } from "@/contexts/i18n-context"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type LeadDetail = {
  id: string
  company: string
  owner: string
  status: "new" | "contacted" | "qualified" | "lost"
  createdAt: string
  score: number
  notes: { id: string; text: string; at: string; by: string }[]
  attachments: { id: string; name: string; size: string }[]
  activities: { id: string; type: string; subject: string; at: string; by: string }[]
  audit: { id: string; field: string; old?: string; new?: string; at: string; by: string }[]
}

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute required="view:sales">
      <AppShell>
        <LeadDetailContent id={params.id} />
      </AppShell>
    </ProtectedRoute>
  )
}

function LeadDetailContent({ id }: { id: string }) {
  const { t } = useI18n()
  const [lead, setLead] = useState<LeadDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/crm/leads/${id}`, { cache: "no-store" })
        const json = await res.json()
        if (!mounted) return
        setLead(json?.data ?? null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    // Live activity updates via SSE (append to activities)
    try {
      const es = new EventSource('/api/crm/events')
      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data)
          if (data?.type === 'activity') {
            const p = data.payload
            const nowIso = new Date().toISOString()
            const subject = p?.kind === 'quotation'
              ? t('crm.activities.stream.quotation', { company: p.company })
              : p?.kind === 'invoice'
              ? t('crm.activities.stream.invoice', { customer: p.customer })
              : p?.kind === 'support'
              ? t('crm.activities.stream.support', { customer: p.customer })
              : null
            if (!subject) return
            setLead((prev) => (
              prev ? { ...prev, activities: [{ id: p?.id ?? `a-${Date.now()}`, type: p?.kind ?? 'event', subject, at: p?.at ?? nowIso, by: 'System' }, ...prev.activities].slice(0, 50) } : prev
            ))
          }
        } catch {}
      }
      return () => { es.close(); mounted = false }
    } catch {}
    return () => { mounted = false }
  }, [id])

  const dateFormatter = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" })
    } catch {
      return null
    }
  }, [])

  return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-6" aria-label={t("crm.leads.detail.title")}>
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("crm.leads.detail.header", { id })}
          </h1>
          {lead ? (
            <div className="flex items-center gap-2">
              <Badge variant="outline">{t(`crm.leads.status.${lead.status}`)}</Badge>
              <span className="text-muted-foreground text-sm">{lead.company}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("crm.leads.detail.activities")}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-sm text-muted-foreground">{t("common.loading")}</p>}
            {!loading && (!lead || lead.activities.length === 0) && (
              <p className="text-sm text-muted-foreground">{t("crm.leads.detail.noActivity")}</p>
            )}
            <ul className="space-y-3">
              {(lead?.activities ?? []).map((a) => (
                <li key={a.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{a.subject}</span>
                    <span className="text-xs text-muted-foreground">
                      {dateFormatter ? dateFormatter.format(new Date(a.at)) : a.at}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t("crm.leads.detail.byUser", { name: a.by })}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("crm.leads.detail.notes")}</CardTitle>
            </CardHeader>
            <CardContent>
              {(lead?.notes ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("crm.leads.detail.noNotes")}</p>
              ) : (
                <ul className="space-y-2">
                  {lead?.notes.map((n) => (
                    <li key={n.id} className="text-sm">
                      <span className="font-medium">{n.by}</span>: {n.text}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("crm.leads.detail.attachments")}</CardTitle>
            </CardHeader>
            <CardContent>
              {(lead?.attachments ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("crm.leads.detail.noAttachments")}</p>
              ) : (
                <ul className="space-y-2">
                  {lead?.attachments.map((f) => (
                    <li key={f.id} className="text-sm">
                      {f.name} <span className="text-muted-foreground">({f.size})</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("crm.leads.detail.audit")}</CardTitle>
            </CardHeader>
            <CardContent>
              {(lead?.audit ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("crm.leads.detail.noAudit")}</p>
              ) : (
                <ul className="space-y-2">
                  {lead?.audit.map((e) => (
                    <li key={e.id} className="text-sm">
                      <span className="font-medium">{e.field}</span>: {e.old} → {e.new}
                      <span className="text-muted-foreground"> — {t("crm.leads.detail.byUser", { name: e.by })}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}


