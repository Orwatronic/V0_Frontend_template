"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const useTranslation = () => ({
  t: (key: string) =>
    ({
      "aging.ap.title": "Accounts Payable Aging",
      "aging.ar.title": "Accounts Receivable Aging",
      "aging.description": "Outstanding balances by aging bucket.",
      "aging.bucket.current": "Current",
      "aging.bucket.30": "1-30 Days",
      "aging.bucket.60": "31-60 Days",
      "aging.bucket.90": "61-90 Days",
      "aging.bucket.90+": "90+ Days",
      "common.amount": "Amount",
    }[key] || key),
})

// CURSOR: Data should be fetched from GET /api/v1/financials/reports/aging/ap
const apAgingData = [
  { name: "Current", Amount: 115000 },
  { name: "1-30 Days", Amount: 45000 },
  { name: "31-60 Days", Amount: 22000 },
  { name: "61-90 Days", Amount: 8500 },
  { name: "90+ Days", Amount: 12000 },
]

// CURSOR: Data should be fetched from GET /api/v1/financials/reports/aging/ar
const arAgingData = [
  { name: "Current", Amount: 250000 },
  { name: "1-30 Days", Amount: 85000 },
  { name: "31-60 Days", Amount: 45000 },
  { name: "61-90 Days", Amount: 15000 },
  { name: "90+ Days", Amount: 25000 },
]

const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

export function AgingAnalysisReports() {
  const { t } = useTranslation()

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
