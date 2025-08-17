"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/contexts/i18n-context"

// CURSOR: Data should be fetched from GET /api/v1/financials/reports/aging/ap
const apAgingRaw = [
  { bucket: "current", Amount: 115000 },
  { bucket: "30", Amount: 45000 },
  { bucket: "60", Amount: 22000 },
  { bucket: "90", Amount: 8500 },
  { bucket: "90+", Amount: 12000 },
]

// CURSOR: Data should be fetched from GET /api/v1/financials/reports/aging/ar
const arAgingRaw = [
  { bucket: "current", Amount: 250000 },
  { bucket: "30", Amount: 85000 },
  { bucket: "60", Amount: 45000 },
  { bucket: "90", Amount: 15000 },
  { bucket: "90+", Amount: 25000 },
]

const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

export function AgingAnalysisReports() {
  const { t } = useI18n()
  const apAgingData = apAgingRaw.map(d => ({ name: t(`aging.bucket.${d.bucket}`), Amount: d.Amount }))
  const arAgingData = arAgingRaw.map(d => ({ name: t(`aging.bucket.${d.bucket}`), Amount: d.Amount }))

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t("aging.ap.title")}</CardTitle>
          <CardDescription>{t("aging.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={apAgingData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
              <Tooltip cursor={{ fill: "hsl(var(--muted))" }} contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="Amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("aging.ar.title")}</CardTitle>
          <CardDescription>{t("aging.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={arAgingData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
              <Tooltip cursor={{ fill: "hsl(var(--muted))" }} contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="Amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
