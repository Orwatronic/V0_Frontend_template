"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { type ChartConfig } from "@/components/ui/chart"

const chartData = [
  { month: "January", turnoverRate: 2.1 },
  { month: "February", turnoverRate: 2.5 },
  { month: "March", turnoverRate: 2.2 },
  { month: "April", turnoverRate: 2.8 },
  { month: "May", turnoverRate: 3.1 },
  { month: "June", turnoverRate: 2.9 },
]

const chartConfig = {
  turnoverRate: {
    label: "Turnover Rate (%)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function EmployeeTurnoverChart() {
  // CURSOR: API call to GET /api/v1/analytics/employee-turnover?range={dateRange}
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Turnover Rate</CardTitle>
        <CardDescription>Monthly turnover rate over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer>
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: -10,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Legend />
              <Line
                dataKey="turnoverRate"
                type="monotone"
                stroke="var(--color-turnoverRate)"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
