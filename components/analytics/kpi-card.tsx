import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TypeIcon as type, LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string
  icon: LucideIcon
  change: string
  changeType: "increase" | "decrease"
}

export function KpiCard({ title, value, icon: Icon, change, changeType }: KpiCardProps) {
  const changeColor = changeType === "increase" ? "text-green-500" : "text-red-500"
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${changeColor}`}>{change}</p>
      </CardContent>
    </Card>
  )
}
