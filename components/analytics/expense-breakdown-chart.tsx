"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useMemo } from "react"

// CURSOR: API call to GET /api/v1/analytics/expense-breakdown?range={dateRange}
const mockExpenseData = [
  { name: "Salaries & Wages", value: 450000, color: "#0088FE" },
  { name: "Rent & Utilities", value: 120000, color: "#00C49F" },
  { name: "Marketing & Advertising", value: 85000, color: "#FFBB28" },
  { name: "Raw Materials", value: 210000, color: "#FF8042" },
  { name: "Software & IT", value: 65000, color: "#AF19FF" },
  { name: "Travel & Entertainment", value: 40000, color: "#FF4560" },
  { name: "Other", value: 30000, color: "#777777" },
]

export function ExpenseBreakdownChart() {
  const totalExpenses = useMemo(() => {
    return mockExpenseData.reduce((acc, entry) => acc + entry.value, 0)
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = ((data.value / totalExpenses) * 100).toFixed(2)
      return (
        <div className="p-2 text-sm bg-background/90 backdrop-blur-sm border rounded-lg shadow-lg">
          <p className="font-bold">{data.name}</p>
          <p className="text-foreground">{`${formatCurrency(data.value)} (${percentage}%)`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={mockExpenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {mockExpenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
