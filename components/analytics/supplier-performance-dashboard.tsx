"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const mockSupplierData = [
  { name: "Tech Supplies Inc.", onTime: 98, defectRate: 1.2, volume: 125000 },
  { name: "Global Components", onTime: 92, defectRate: 2.5, volume: 98000 },
  { name: "Innovate Solutions", onTime: 99, defectRate: 0.8, volume: 85000 },
  { name: "Advanced Materials", onTime: 88, defectRate: 3.1, volume: 76000 },
  { name: "Reliable Parts Co.", onTime: 95, defectRate: 1.5, volume: 65000 },
]

export function SupplierPerformanceDashboard() {
  // CURSOR: API call to GET /api/v1/analytics/supplier-performance?range={dateRange}
  const overallOnTime = 94.5
  const overallDefectRate = 1.8

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Supplier Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">On-Time Delivery</p>
            <p className="text-2xl font-bold">{overallOnTime}%</p>
            <Progress value={overallOnTime} className="h-2 mt-1" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Overall Defect Rate</p>
            <p className="text-2xl font-bold text-red-500">{overallDefectRate}%</p>
            <Progress value={overallDefectRate * 10} className="h-2 mt-1" indicatorClassName="bg-red-500" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Top 5 Suppliers by Volume</h4>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSupplierData} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
