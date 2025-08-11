"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartOfAccounts } from "./chart-of-accounts"
import { AccountsPayable } from "./accounts-payable"
import { AccountsReceivable } from "./accounts-receivable"
import { JournalEntries } from "./journal-entries"
import { ThreeWayMatch } from "./three-way-match"
import { CollectionsManagementDashboard } from "./collections-management-dashboard"
import { FinancialReporting } from "./financial-reporting"
import { AssetAccounting } from "./asset-accounting"
import { AgingAnalysisReports } from "./aging-analysis-reports"
import { BankReconciliation } from "./bank-reconciliation"
import { FileText, Building, AreaChart, Scale, Library, Users, HandCoins, Receipt, Landmark, BookUser } from 'lucide-react'

const useTranslation = () => ({
  t: (key: string) =>
    ({
      "fi.tabs.coa": "Chart of Accounts",
      "fi.tabs.ap": "Accounts Payable",
      "fi.tabs.ar": "Accounts Receivable",
      "fi.tabs.je": "Journal Entries",
      "fi.tabs.reconciliation": "Reconciliation",
      "fi.tabs.collections": "Collections",
      "fi.tabs.reporting": "Reporting",
      "fi.tabs.assets": "Asset Accounting",
      "fi.tabs.aging": "Aging Analysis",
      "fi.tabs.bankRec": "Bank Rec",
    }[key] || key),
})

export default function FinancialManagementContainer() {
  const { t } = useTranslation()

  return (
    <Tabs defaultValue="ar" className="w-full">
      <TabsList className="grid w-full grid-cols-10">
        <TabsTrigger value="coa"><Library className="mr-2 h-4 w-4" />{t("fi.tabs.coa")}</TabsTrigger>
        <TabsTrigger value="ap"><Receipt className="mr-2 h-4 w-4" />{t("fi.tabs.ap")}</TabsTrigger>
        <TabsTrigger value="ar"><HandCoins className="mr-2 h-4 w-4" />{t("fi.tabs.ar")}</TabsTrigger>
        <TabsTrigger value="collections"><Users className="mr-2 h-4 w-4" />{t("fi.tabs.collections")}</TabsTrigger>
        <TabsTrigger value="reconciliation"><Receipt className="mr-2 h-4 w-4" />{t("fi.tabs.reconciliation")}</TabsTrigger>
        <TabsTrigger value="assets"><Building className="mr-2 h-4 w-4" />{t("fi.tabs.assets")}</TabsTrigger>
        <TabsTrigger value="reporting"><FileText className="mr-2 h-4 w-4" />{t("fi.tabs.reporting")}</TabsTrigger>
        <TabsTrigger value="aging"><AreaChart className="mr-2 h-4 w-4" />{t("fi.tabs.aging")}</TabsTrigger>
        <TabsTrigger value="bankRec"><Landmark className="mr-2 h-4 w-4" />{t("fi.tabs.bankRec")}</TabsTrigger>
        <TabsTrigger value="je"><BookUser className="mr-2 h-4 w-4" />{t("fi.tabs.je")}</TabsTrigger>
      </TabsList>
      <TabsContent value="coa" className="py-4"><ChartOfAccounts /></TabsContent>
      <TabsContent value="ap" className="py-4"><AccountsPayable /></TabsContent>
      <TabsContent value="ar" className="py-4"><AccountsReceivable /></TabsContent>
      <TabsContent value="collections" className="py-4"><CollectionsManagementDashboard /></TabsContent>
      <TabsContent value="reconciliation" className="py-4"><ThreeWayMatch /></TabsContent>
      <TabsContent value="assets" className="py-4"><AssetAccounting /></TabsContent>
      <TabsContent value="reporting" className="py-4"><FinancialReporting /></TabsContent>
      <TabsContent value="aging" className="py-4"><AgingAnalysisReports /></TabsContent>
      <TabsContent value="bankRec" className="py-4"><BankReconciliation /></TabsContent>
      <TabsContent value="je" className="py-4"><JournalEntries /></TabsContent>
    </Tabs>
  )
}
