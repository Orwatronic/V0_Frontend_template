"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Bar,
  Line,
  ComposedChart,
} from "recharts"

const mockData = [
  { name: "May", stock: 1200, demand: 900, forecast: 900 },
  { name: "Jun", stock: 1100, demand: 950, forecast: 950 },
  { name: "Jul", stock: 950, demand: 1000, forecast: 1000 },
  { name: "Aug", stock: 1050, demand: 1100, forecast: 1100 },
  { name: "Sep", stock: 1150, demand: 1050, forecast: 1050 },
  { name: "Oct", stock: 1200, demand: 1150, forecast: 1150 },
  { name: "Nov", stock: null, demand: null, forecast: 1200 },
  { name: "Dec", stock: null, demand: null, forecast: 1250 },
  { name: "Jan", stock: null, demand: null, forecast: 1220 },
]

export function StockDemandForecastChart() {
  // CURSOR: API call to GET /api/v1/analytics/stock-demand-forecast
  const data = mockData

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Stock vs. Demand Forecast</CardTitle>
        <CardDescription>Next 3 months forecast based on historical data.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
              }}
            />
            <Legend />
            <Bar dataKey="stock" fill="hsl(var(--primary) / 0.5)" name="Stock Level" />
            <Line type="monotone" dataKey="demand" stroke="hsl(var(--primary))" strokeWidth={2} name="Actual Demand" />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Forecasted Demand"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
