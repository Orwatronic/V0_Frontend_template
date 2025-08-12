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
import { FileText, Building, AreaChart, Library, Users, HandCoins, Receipt, Landmark, BookUser } from "lucide-react"
import { useI18n } from "@/contexts/i18n-context"

export default function FinancialManagementContainer() {
  const { t } = useI18n()

  return (
    <Tabs defaultValue="ar" className="w-full">
      <TabsList className="grid w-full grid-cols-10">
        <TabsTrigger value="coa">
          <Library className="mr-2 h-4 w-4" />
          {t("financial.tabs.coa")}
        </TabsTrigger>
        <TabsTrigger value="ap">
          <Receipt className="mr-2 h-4 w-4" />
          {t("financial.tabs.ap")}
        </TabsTrigger>
        <TabsTrigger value="ar">
          <HandCoins className="mr-2 h-4 w-4" />
          {t("financial.tabs.ar")}
        </TabsTrigger>
        <TabsTrigger value="collections">
          <Users className="mr-2 h-4 w-4" />
          {t("financial.tabs.collections")}
        </TabsTrigger>
        <TabsTrigger value="reconciliation">
          <Receipt className="mr-2 h-4 w-4" />
          {t("financial.tabs.reconciliation")}
        </TabsTrigger>
        <TabsTrigger value="assets">
          <Building className="mr-2 h-4 w-4" />
          {t("financial.tabs.assets")}
        </TabsTrigger>
        <TabsTrigger value="reporting">
          <FileText className="mr-2 h-4 w-4" />
          {t("financial.tabs.reporting")}
        </TabsTrigger>
        <TabsTrigger value="aging">
          <AreaChart className="mr-2 h-4 w-4" />
          {t("financial.tabs.aging")}
        </TabsTrigger>
        <TabsTrigger value="bankRec">
          <Landmark className="mr-2 h-4 w-4" />
          {t("financial.tabs.bankRec")}
        </TabsTrigger>
        <TabsTrigger value="je">
          <BookUser className="mr-2 h-4 w-4" />
          {t("financial.tabs.je")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="coa" className="py-4">
        <ChartOfAccounts />
      </TabsContent>
      <TabsContent value="ap" className="py-4">
        <AccountsPayable />
      </TabsContent>
      <TabsContent value="ar" className="py-4">
        <AccountsReceivable />
      </TabsContent>
      <TabsContent value="collections" className="py-4">
        <CollectionsManagementDashboard />
      </TabsContent>
      <TabsContent value="reconciliation" className="py-4">
        <ThreeWayMatch />
      </TabsContent>
      <TabsContent value="assets" className="py-4">
        <AssetAccounting />
      </TabsContent>
      <TabsContent value="reporting" className="py-4">
        <FinancialReporting />
      </TabsContent>
      <TabsContent value="aging" className="py-4">
        <AgingAnalysisReports />
      </TabsContent>
      <TabsContent value="bankRec" className="py-4">
        <BankReconciliation />
      </TabsContent>
      <TabsContent value="je" className="py-4">
        <JournalEntries />
      </TabsContent>
    </Tabs>
  )
}
