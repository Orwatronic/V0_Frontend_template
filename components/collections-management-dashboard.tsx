"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DollarSign, TrendingDown, Phone, Mail, Calendar, PlusCircle, Search } from 'lucide-react'
import { type } from "os"

import { useI18n } from "@/contexts/i18n-context"
import { useApi } from "@/hooks/use-api"

type CollectionCustomer = {
  id: string
  name: string
  overdueAmount: number
  lastContact: string
  nextActionDate: string
  status: "Monitoring" | "Action Required" | "PromiseToPay" | "Disputed"
}

type CommunicationLog = {
  id: string
  date: string
  type: "Call" | "Email" | "Promise" | "Note"
  notes: string
  agent: string
  promiseDate?: string
  promiseAmount?: number
}

const mockCustomers: CollectionCustomer[] = [
  { id: 'CUST-001', name: 'Apex Industries', overdueAmount: 22000.00, lastContact: '2024-07-28', nextActionDate: '2024-08-05', status: 'Action Required' },
  { id: 'CUST-002', name: 'Global Tech Inc.', overdueAmount: 18500.75, lastContact: '2024-08-01', nextActionDate: '2024-08-15', status: 'PromiseToPay' },
  { id: 'CUST-003', name: 'Starlight Logistics', overdueAmount: 7300.00, lastContact: '2024-07-25', nextActionDate: '2024-08-02', status: 'Action Required' },
  { id: 'CUST-004', name: 'Quantum Dynamics', overdueAmount: 5400.00, lastContact: '2024-07-30', nextActionDate: '2024-08-10', status: 'Monitoring' },
  { id: 'CUST-005', name: 'Innovate Corp', overdueAmount: 11200.00, lastContact: '2024-07-22', nextActionDate: '2024-07-29', status: 'Disputed' },
]

const mockLogs: { [key: string]: CommunicationLog[] } = {
  'CUST-001': [
    { id: 'LOG-001', date: '2024-07-28', type: 'Call', notes: 'Spoke with John Doe in AP. Said invoice was not received. Resent via email.', agent: 'Alice' },
    { id: 'LOG-002', date: '2024-07-20', type: 'Email', notes: 'Automated reminder sent for overdue invoice CINV-203.', agent: 'System' },
  ],
  'CUST-002': [
    { id: 'LOG-003', date: '2024-08-01', type: 'Promise', notes: 'Jane Smith promised payment will be sent by EOD on Aug 14.', agent: 'Bob', promiseDate: '2024-08-14', promiseAmount: 18500.75 },
  ],
}

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  Monitoring: "secondary",
  ActionRequired: "destructive",
  PromiseToPay: "default",
  Disputed: "outline",
}

export const CollectionsManagementDashboard = () => {
  const { t, formatters } = useI18n()
  const { get, post } = useApi()
  const [customers, setCustomers] = useState<CollectionCustomer[]>([])
  const [logs, setLogs] = useState<{ [key: string]: CommunicationLog[] }>({})
  const [selectedCustomer, setSelectedCustomer] = useState<CollectionCustomer | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false)
  const [newLogType, setNewLogType] = useState<string>("Call")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let useMock = true
    try {
      const v = localStorage.getItem("feebee:auth:mock")
      useMock = v ? v === "1" : true
    } catch {}

    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        if (useMock) {
          setCustomers(mockCustomers)
          setLogs(mockLogs)
          return
        }
        // CURSOR: API calls
        const c = await get<{ customers: CollectionCustomer[] }>("/financials/ar/collections/accounts")
        const l = await get<{ logs: { [k: string]: CommunicationLog[] } }>("/financials/ar/collections/logs")
        setCustomers(((c as any)?.customers as any) || [])
        setLogs(((l as any)?.logs as any) || {})
      } catch (e) {
        setError(t("collections.errors.loadFailed"))
        setCustomers(mockCustomers)
        setLogs(mockLogs)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const formatCurrency = (amount: number, currency = "USD") => formatters.formatCurrency(amount, currency)

  const filteredCustomers = customers.filter(
    (customer) => customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectCustomer = (customer: CollectionCustomer) => {
    setSelectedCustomer(customer)
  }

  const handleSaveLog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newLog: CommunicationLog = {
        id: `LOG-${Math.floor(Math.random() * 1000)}`,
        date: new Date().toISOString().split('T')[0],
        type: formData.get('activityType') as CommunicationLog['type'],
        notes: formData.get('notes') as string,
        agent: 'You', // In a real app, this would be the logged-in user
        promiseDate: formData.get('promiseDate') as string || undefined,
        promiseAmount: Number(formData.get('promiseAmount')) || undefined,
    }
    try {
      let useMock = true
      try {
        const v = localStorage.getItem("feebee:auth:mock")
        useMock = v ? v === "1" : true
      } catch {}
      if (!useMock) {
        // CURSOR: API call to POST /api/v1/financials/ar/collections-log
        await post("/financials/ar/collections-log", { customerId: selectedCustomer!.id, log: newLog })
      }
      setLogs(prev => ({
          ...prev,
          [selectedCustomer!.id]: [...(prev[selectedCustomer!.id] || []), newLog]
      }))
    } catch {
      // ignore errors and keep dialog open
      return
    }
    setIsLogDialogOpen(false)
  }

  const metrics = {
    dso: 45, // Mock
    overdueTotal: customers.reduce((sum, cust) => sum + cust.overdueAmount, 0),
    collected: 52340.50, // Mock
  }

  const metricsCards = [
    { title: t("collections.metrics.dso"), value: `${metrics.dso} Days`, icon: Calendar },
    { title: t("collections.metrics.overdueTotal"), value: formatCurrency(metrics.overdueTotal), icon: TrendingDown },
    { title: t("collections.metrics.collected"), value: formatCurrency(metrics.collected), icon: DollarSign },
  ]

  const activityIcons = {
    Call: <Phone className="h-4 w-4" />,
    Email: <Mail className="h-4 w-4" />,
    Promise: <DollarSign className="h-4 w-4" />,
    Note: <PlusCircle className="h-4 w-4" />,
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("collections.title")}</CardTitle>
          <CardDescription>{t("collections.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metricsCards.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>{t("collections.customer.title")}</CardTitle>
                <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder={t("collections.customer.search")} 
                        className="pl-8" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="text-sm text-muted-foreground mb-3" role="status" aria-live="polite">
                {t("collections.loading")}
              </div>
            )}
            {error && (
              <div className="rounded-md border border-red-300 bg-red-50 text-red-700 p-3 mb-3" role="alert">
                {error}
              </div>
            )}
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("collections.customer.name")}</TableHead>
                    <TableHead className="text-right">{t("collections.customer.overdueAmount")}</TableHead>
                    <TableHead>{t("collections.customer.lastContact")}</TableHead>
                    <TableHead>{t("collections.customer.nextAction")}</TableHead>
                    <TableHead className="text-center">{t("collections.customer.status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow 
                        key={customer.id} 
                        onClick={() => handleSelectCustomer(customer)}
                        className={`cursor-pointer hover:bg-muted/50 ${selectedCustomer?.id === customer.id ? 'bg-muted' : ''}`}
                    >
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell className="text-right">{formatCurrency(customer.overdueAmount)}</TableCell>
                      <TableCell>{customer.lastContact}</TableCell>
                      <TableCell>{customer.nextActionDate}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={statusVariant[customer.status]}>{t(`status.${customer.status}`)}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>{t("collections.log.title")}</CardTitle>
                <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" disabled={!selectedCustomer}>
                            <PlusCircle className="mr-2 h-4 w-4" /> {t("collections.log.new")}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleSaveLog}>
                            <DialogHeader>
                                <DialogTitle>{t("collections.log.new")} for {selectedCustomer?.name}</DialogTitle>
                                <DialogDescription>Log a new collection activity. This will be saved to the customer's record.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Select name="activityType" required onValueChange={setNewLogType} defaultValue="Call">
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("collections.log.type")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Call">{t("activity.Call")}</SelectItem>
                                        <SelectItem value="Email">{t("activity.Email")}</SelectItem>
                                        <SelectItem value="Promise">{t("activity.Promise")}</SelectItem>
                                        <SelectItem value="Note">{t("activity.Note")}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Textarea name="notes" placeholder={t("collections.log.notes")} required />
                                {newLogType === 'Promise' && (
                                    <>
                                        <Input name="promiseDate" type="date" placeholder={t("collections.log.promiseDate")} required />
                                        <Input name="promiseAmount" type="number" placeholder={t("collections.log.promiseAmount")} required />
                                    </>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="submit">{t("collections.log.save")}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <CardDescription>{selectedCustomer ? `Activity for ${selectedCustomer.name}` : 'Select a customer to view logs'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedCustomer && (logs[selectedCustomer.id] || []).length > 0 ? (
              (logs[selectedCustomer.id] || []).map(log => (
                <div key={log.id} className="flex items-start gap-4">
                  <div className="bg-muted rounded-full p-2">{activityIcons[log.type]}</div>
                  <div>
                    <p className="text-sm font-medium">{t(`activity.${log.type}`)} by {log.agent} on {log.date}</p>
                    <p className="text-sm text-muted-foreground">{log.notes}</p>
                    {log.type === 'Promise' && (
                        <p className="text-xs text-green-600 font-semibold">Promised: {formatCurrency(log.promiseAmount!)} by {log.promiseDate}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                {selectedCustomer ? 'No collection activities logged.' : 'Select a customer.'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
