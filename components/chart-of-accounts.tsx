"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Search, ChevronDown, ChevronRight } from "lucide-react"
import { useI18n } from "@/contexts/i18n-context"
import { useApi } from "@/hooks/use-api"

type Account = {
  id: string
  name: string
  type: "Header" | "Asset" | "Liability" | "Equity" | "Revenue" | "Expense"
  balance: number
  children?: Account[]
}

const mockAccounts: Account[] = [
  {
    id: "1000",
    name: "Assets",
    type: "Header",
    balance: 550000,
    children: [
      {
        id: "1100",
        name: "Current Assets",
        type: "Header",
        balance: 250000,
        children: [
          { id: "1110", name: "Cash and Cash Equivalents", type: "Asset", balance: 150000 },
          { id: "1120", name: "Accounts Receivable", type: "Asset", balance: 100000 },
        ],
      },
      {
        id: "1200",
        name: "Fixed Assets",
        type: "Header",
        balance: 300000,
        children: [{ id: "1210", name: "Property, Plant, & Equipment", type: "Asset", balance: 300000 }],
      },
    ],
  },
  {
    id: "2000",
    name: "Liabilities",
    type: "Header",
    balance: 200000,
    children: [
      {
        id: "2100",
        name: "Current Liabilities",
        type: "Header",
        balance: 200000,
        children: [{ id: "2110", name: "Accounts Payable", type: "Liability", balance: 200000 }],
      },
    ],
  },
  {
    id: "3000",
    name: "Equity",
    type: "Header",
    balance: 350000,
    children: [{ id: "3100", name: "Retained Earnings", type: "Equity", balance: 350000 }],
  },
  {
    id: "4000",
    name: "Revenue",
    type: "Header",
    balance: 1200000,
    children: [{ id: "4100", name: "Product Sales", type: "Revenue", balance: 1200000 }],
  },
  {
    id: "5000",
    name: "Expenses",
    type: "Header",
    balance: 850000,
    children: [
      { id: "5100", name: "Cost of Goods Sold", type: "Expense", balance: 700000 },
      { id: "5200", name: "Operating Expenses", type: "Expense", balance: 150000 },
    ],
  },
]

const AccountRow = ({ account, level = 0, searchTerm }: { account: Account; level?: number; searchTerm: string }) => {
  const [isOpen, setIsOpen] = useState(true)
  const hasChildren = account.children && account.children.length > 0
  const { t, locale } = useI18n()

  const matchesSearch = account.name.toLowerCase().includes(searchTerm) || account.id.includes(searchTerm)

  if (!matchesSearch) {
    return null
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD", // TODO: Make currency configurable per company/user preference
    }).format(amount)
  }

  return (
    <>
      <TableRow className={account.type === "Header" ? "bg-muted/50 hover:bg-muted" : ""}>
        <TableCell style={{ paddingLeft: `${level * 24 + 12}px` }}>
          <div className="flex items-center">
            {hasChildren && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 mr-2"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={
                  isOpen
                    ? t("financial.chartOfAccounts.aria.collapseButton", { name: account.name })
                    : t("financial.chartOfAccounts.aria.expandButton", { name: account.name })
                }
              >
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            )}
            {!hasChildren && <span className="w-8 mr-2"></span>}
            <span className={account.type === "Header" ? "font-semibold" : ""}>{account.name}</span>
          </div>
        </TableCell>
        <TableCell>{account.id}</TableCell>
        <TableCell>{t(`financial.chartOfAccounts.accountTypes.${account.type}`)}</TableCell>
        <TableCell className="text-right">{formatCurrency(account.balance)}</TableCell>
      </TableRow>
      {hasChildren &&
        isOpen &&
        account.children.map((child) => (
          <AccountRow key={child.id} account={child} level={level + 1} searchTerm={searchTerm} />
        ))}
    </>
  )
}

export const ChartOfAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { t } = useI18n()
  const { get } = useApi()

  useEffect(() => {
    // Decide mock vs real based on local flag (feebee:auth:mock). Defaults to true when absent.
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
          // Mock path for local development
          setAccounts(mockAccounts)
          return
        }
        // CURSOR: GET /api/v1/financials/chart-of-accounts
        const data = await get<{ accounts: Account[] }>("/financials/chart-of-accounts")
        setAccounts(Array.isArray((data as any)?.accounts) ? (data as any).accounts : [])
      } catch (e) {
        setError(t("financial.chartOfAccounts.errors.loadFailed"))
        // Fallback to mock so UI remains usable during integration
        setAccounts(mockAccounts)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const filteredAccounts = useMemo(() => {
    if (!searchTerm) return accounts

    const filter = (accs: Account[]): Account[] => {
      return accs.reduce((acc, account) => {
        const children = account.children ? filter(account.children) : []
        if (
          account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.id.includes(searchTerm) ||
          children.length > 0
        ) {
          acc.push({ ...account, children })
        }
        return acc
      }, [] as Account[])
    }
    return filter(accounts)
  }, [accounts, searchTerm])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t("financial.chartOfAccounts.title")}</CardTitle>
            <CardDescription>{t("financial.chartOfAccounts.description")}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("financial.chartOfAccounts.searchPlaceholder")}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label={t("financial.chartOfAccounts.aria.searchLabel")}
              />
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("financial.chartOfAccounts.addAccount")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-sm text-muted-foreground mb-3" role="status" aria-live="polite">
            {t("financial.chartOfAccounts.loading")}
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
                <TableHead className="w-[50%]">{t("financial.chartOfAccounts.columns.accountName")}</TableHead>
                <TableHead>{t("financial.chartOfAccounts.columns.accountNumber")}</TableHead>
                <TableHead>{t("financial.chartOfAccounts.columns.type")}</TableHead>
                <TableHead className="text-right">{t("financial.chartOfAccounts.columns.balance")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody role="treegrid" aria-label={t("financial.chartOfAccounts.aria.accountTree")}>
              {filteredAccounts.map((account) => (
                <AccountRow key={account.id} account={account} searchTerm={searchTerm.toLowerCase()} />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
