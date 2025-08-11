"use client"

import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle } from 'lucide-react'
import { useI18n } from "@/contexts/i18n-context"
import { type ModuleSlug, slugToAppPath } from "@/lib/modules"

const SUPPORTED: ModuleSlug[] = [
  "financials",
  "sales",
  "materials",
  "hcm",
  "master-data",
  "organization",
  "production",
  "projects",
  "quality",
  "maintenance",
  "crm",
  "reports",
  "customer-portal",
]

const imgBySlug: Record<ModuleSlug, string> = {
  financials: "/financials-dashboard.png",
  sales: "/sales-distribution-module.png",
  materials: "/placeholder-g7kkb.png",
  hcm: "/human-capital-management-team.png",
  "master-data": "/master-data-management.png",
  organization: "/placeholder-xjnig.png",
  production: "/production-planning-manufacturing.png",
  projects: "/project-system-planning.png",
  quality: "/quality-management-qc.png",
  maintenance: "/placeholder-ay9j0.png",
  crm: "/placeholder.svg?height=360&width=640",
  reports: "/placeholder.svg?height=360&width=640",
  "customer-portal": "/placeholder.svg?height=360&width=640",
}

export default function SolutionMarketingPage() {
  const params = useParams()
  const sp = useSearchParams()
  const { t } = useI18n()

  const slug = (params?.slug as ModuleSlug) || "financials"
  const isSupported = SUPPORTED.includes(slug)
  const next = sp.get("next") || slugToAppPath(slug)

  // CURSOR: API call to GET /api/v1/solutions/{slug}/marketing
  // const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/solutions/${slug}`)

  if (!isSupported) {
    return (
      <main className="container mx-auto px-6 py-16">
        <h1 className="text-2xl font-semibold mb-2">{t("solutions.marketing.notFound.title")}</h1>
        <p className="text-muted-foreground mb-6">{t("solutions.marketing.notFound.subtitle")}</p>
        <Link href="/solutions/financials">
          <Button>{t("common.getStarted")}</Button>
        </Link>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-6 py-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Badge className="mb-4" variant="secondary">
            {t("solutions.marketing.badge")}
          </Badge>
          <h1 className="text-4xl font-bold mb-4">{t(`solutions.${slug}.title`)}</h1>
          <p className="text-lg text-muted-foreground mb-6">{t(`solutions.${slug}.subtitle`)}</p>
          <ul className="space-y-2 mb-8">
            {["f1", "f2", "f3"].map((k) => (
              <li key={k} className="flex items-start">
                <CheckCircle className="h-4 w-4 text-primary mt-1 mr-2" />
                <span>{t(`solutions.${slug}.features.${k}`)}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Link href={`/login?next=${encodeURIComponent(next)}&intent=${slug}`}>
              <Button className="gap-2">
                {t("solutions.marketing.cta.login")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/request-demo?intent=${slug}`}>
              <Button variant="outline">{t("solutions.marketing.cta.demo")}</Button>
            </Link>
          </div>
        </div>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border bg-muted">
          <Image
            src={imgBySlug[slug] || "/placeholder.svg"}
            alt={t(`solutions.${slug}.imageAlt`)}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </main>
  )
}
