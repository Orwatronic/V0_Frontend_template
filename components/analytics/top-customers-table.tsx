"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// CURSOR: API call to GET /api/v1/analytics/top-customers?range={dateRange}
const mockTopCustomers = [
  { id: "CUST001", name: "Innovate Inc.", revenue: 450000, avatar: "/placeholder-logo.png", fallback: "II" },
  { id: "CUST002", name: "Quantum Solutions", revenue: 320000, avatar: "/placeholder-logo.png", fallback: "QS" },
  { id: "CUST003", name: "Apex Industries", revenue: 280000, avatar: "/placeholder-logo.png", fallback: "AI" },
  { id: "CUST004", name: "Stellar Corp", revenue: 250000, avatar: "/placeholder-logo.png", fallback: "SC" },
  { id: "CUST005", name: "Nexus Enterprises", revenue: 190000, avatar: "/placeholder-logo.png", fallback: "NE" },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function TopCustomersTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Customers by Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTopCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.name} />
                    <AvatarFallback>{customer.fallback}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-muted-foreground">{customer.id}</div>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(customer.revenue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
