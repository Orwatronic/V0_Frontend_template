"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/protected-route"
import { AppShell } from "@/components/app-shell"
import { useI18n } from "@/contexts/i18n-context"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

type Project = { id: string; name: string; status: "Planned" | "Active" | "Closed"; manager: string }

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const { t } = useI18n()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [status, setStatus] = useState<Project["status"]>("Planned")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const data = await fetch(`/api/projects/${encodeURIComponent(params.id)}`, { cache: "no-store" })
        .then(r => r.json())
      const item = (data as any)?.data as Project | null
      if (item) {
        setProject(item)
        setStatus(item.status)
      }
    }
    load()
  }, [params.id])

  const save = async () => {
    if (!project) return
    setIsSaving(true)
    try {
      // CURSOR: Proxied PATCH /api/v1/projects/{id}
      const data = await fetch(`/api/projects/${encodeURIComponent(project.id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status }),
      }).then(r => r.json())
      const updated = (data as any)?.data as Project | null
      if (updated) setProject(updated)
    } finally {
      setIsSaving(false)
    }
  }

  if (!project) {
    return (
      <ProtectedRoute required="view:projects">
        <AppShell>
          <div className="mx-auto w-full max-w-3xl p-6">{t("projects.loading") || "Loading"}...</div>
        </AppShell>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute required="view:projects">
      <AppShell>
        <div className="mx-auto w-full max-w-3xl space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">{t("projects.manager") || "Manager"}</div>
                  <div className="font-medium">{project.manager}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{t("projects.status") || "Status"}</div>
                  <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planned">Planned</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={save} disabled={isSaving}>{isSaving ? (t("common.saving") || "Saving...") : (t("common.save") || "Save")}</Button>
                <Button variant="secondary" onClick={() => router.back()}>{t("common.back") || "Back"}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}


