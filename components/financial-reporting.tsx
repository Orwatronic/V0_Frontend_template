"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"

const useTranslation = () => ({
  t: (key: string) =>
    ({
      "reporting.title": "Financial Reporting",
      "reporting.description": "Generate and analyze key financial statements.",
      "reporting.tabs.pnl": "Profit & Loss",
      "reporting.tabs.bs": "Balance Sheet",
      "reporting.dateRange": "Date Range",
      "reporting.export": "Export to PDF",
      "pnl.revenue": "Total Revenue",
      "pnl.cogs": "Cost of Goods Sold",
      "pnl.grossProfit": "Gross Profit",
      "pnl.opEx": "Operating Expenses",
      "pnl.marketing": "Marketing",
      "pnl.sales": "Sales",
      "pnl.admin": "General & Administrative",
      "pnl.netIncome": "Net Income",
      "bs.assets": "Assets",
      "bs.currentAssets": "Current Assets",
      "bs.cash": "Cash & Equivalents",
      "bs.ar": "Accounts Receivable",
      "bs.inventory": "Inventory",
      "bs.fixedAssets": "Fixed Assets",
      "bs.ppe": "Property, Plant & Equipment",
      "bs.liabilities": "Liabilities",
      "bs.currentLiabilities": "Current Liabilities",
      "bs.ap": "Accounts Payable",
      "bs.longTermLiabilities": "Long-Term Liabilities",
      "bs.debt": "Long-Term Debt",
      "bs.equity": "Equity",
      "bs.totalAssets": "Total Assets",
      "bs.totalLiabilitiesEquity": "Total Liabilities & Equity",
    })[key] || key,
})

// Mock Data
const mockPnlData = {
  revenue: 550000,
  cogs: 210000,
  grossProfit: 340000,
  opEx: {
    total: 180000,
    marketing: 60000,
    sales: 75000,
    admin: 45000,
  },
  netIncome: 160000,
}

const mockBsData = {
  assets: {
    current: {
      total: 350000,
      cash: 150000,
      ar: 120000,
      inventory: 80000,
    },
    fixed: {
      total: 650000,
      ppe: 650000,
    },
    total: 1000000,
  },
  liabilities: {
    current: {
      total: 180000,
      ap: 180000,
    },
    longTerm: {
      total: 320000,
      debt: 320000,
    },
    total: 500000,
  },
  equity: {
    total: 500000,
  },
  totalLiabilitiesEquity: 1000000,
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

export const FinancialReporting = () => {
  const { t } = useTranslation()
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1),
    to: new Date(2024, 6, 31),
  })

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)

  // In a real app, you would fetch data based on the date range.
  // useEffect(() => {
  //   // CURSOR: API call to GET /api/v1/financials/reports/pnl?from={date.from}&to={date.to}
  //   // CURSOR: API call to GET /api/v1/financials/reports/balance-sheet?date={date.to}
  // }, [date])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{t("reporting.title")}</CardTitle>
            <CardDescription>{t("reporting.description")}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {formatDate(date.from)} - {formatDate(date.to)}
                      </>
                    ) : (
                      formatDate(date.from)
                    )
                  ) : (
                    <span>{t("reporting.dateRange")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              {t("reporting.export")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pnl">
          <TabsList>
            <TabsTrigger value="pnl">{t("reporting.tabs.pnl")}</TabsTrigger>
            <TabsTrigger value="bs">{t("reporting.tabs.bs")}</TabsTrigger>
          </TabsList>
          <TabsContent value="pnl" className="pt-4">
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60%]">Account</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="font-bold">
                    <TableCell>{t("pnl.revenue")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockPnlData.revenue)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("pnl.cogs")}</TableCell>
                    <TableCell className="text-right">({formatCurrency(mockPnlData.cogs)})</TableCell>
                  </TableRow>
                  <TableRow className="font-bold border-t">
                    <TableCell>{t("pnl.grossProfit")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockPnlData.grossProfit)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold bg-muted/50">
                    <TableCell>{t("pnl.opEx")}</TableCell>
                    <TableCell className="text-right">({formatCurrency(mockPnlData.opEx.total)})</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("pnl.marketing")}</TableCell>
                    <TableCell className="text-right">({formatCurrency(mockPnlData.opEx.marketing)})</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("pnl.sales")}</TableCell>
                    <TableCell className="text-right">({formatCurrency(mockPnlData.opEx.sales)})</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("pnl.admin")}</TableCell>
                    <TableCell className="text-right">({formatCurrency(mockPnlData.opEx.admin)})</TableCell>
                  </TableRow>
                  <TableRow className="font-bold text-lg border-t-2 border-primary">
                    <TableCell>{t("pnl.netIncome")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockPnlData.netIncome)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="bs" className="pt-4">
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60%]">Account</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell>{t("bs.assets")}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell className="pl-4">{t("bs.currentAssets")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.assets.current.total)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("bs.cash")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.assets.current.cash)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("bs.ar")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.assets.current.ar)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("bs.inventory")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.assets.current.inventory)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell className="pl-4">{t("bs.fixedAssets")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.assets.fixed.total)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("bs.ppe")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.assets.fixed.ppe)}</TableCell>
                  </TableRow>
                  <TableRow className="font-bold border-t">
                    <TableCell>{t("bs.totalAssets")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.assets.total)}</TableCell>
                  </TableRow>

                  <TableRow className="font-bold bg-muted/50">
                    <TableCell>{t("bs.liabilities")}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell className="pl-4">{t("bs.currentLiabilities")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.liabilities.current.total)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("bs.ap")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.liabilities.current.ap)}</TableCell>
                  </TableRow>
                  <TableRow className="font-semibold">
                    <TableCell className="pl-4">{t("bs.longTermLiabilities")}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(mockBsData.liabilities.longTerm.total)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-8">{t("bs.debt")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.liabilities.longTerm.debt)}</TableCell>
                  </TableRow>

                  <TableRow className="font-bold bg-muted/50">
                    <TableCell>{t("bs.equity")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.equity.total)}</TableCell>
                  </TableRow>

                  <TableRow className="font-bold border-t">
                    <TableCell>{t("bs.totalLiabilitiesEquity")}</TableCell>
                    <TableCell className="text-right">{formatCurrency(mockBsData.totalLiabilitiesEquity)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
