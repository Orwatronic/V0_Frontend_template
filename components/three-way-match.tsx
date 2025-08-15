"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Truck, FileCheck2, AlertTriangle, ThumbsUp, Ban } from 'lucide-react'

// Mock Data
const mockPOs = [
  {
    id: 'PO-45001',
    vendor: 'Global Tech Supplies',
    date: '2024-07-10',
    total: 10000,
    items: [
      { id: 'ITEM-01', description: '14" Laptop Pro', qty: 5, price: 2000 },
    ],
    receipts: ['GR-6001'],
    invoices: ['INV-9001'],
  },
];

const mockReceipts = {
  'GR-6001': {
    id: 'GR-6001',
    date: '2024-07-15',
    items: [
      { id: 'ITEM-01', description: '14" Laptop Pro', receivedQty: 5 },
    ],
  },
};

const mockInvoices = {
  'INV-9001': {
    id: 'INV-9001',
    date: '2024-07-20',
    items: [
      { id: 'ITEM-01', description: '14" Laptop Pro', billedQty: 5, price: 2050 },
    ],
  },
};

import { useI18n } from '@/contexts/i18n-context'

export const ThreeWayMatch = () => {
  const { t } = useI18n();
  const [selectedPO, setSelectedPO] = useState(mockPOs[0]);

  const reconciliationData = useMemo(() => {
    if (!selectedPO) return [];
    // CURSOR: API call to GET /api/v1/financials/reconciliation/details?poId={selectedPO.id}
    const receipt = mockReceipts[selectedPO.receipts[0]];
    const invoice = mockInvoices[selectedPO.invoices[0]];

    return selectedPO.items.map(poItem => {
      const receiptItem = receipt?.items.find(ri => ri.id === poItem.id);
      const invoiceItem = invoice?.items.find(ii => ii.id === poItem.id);

      const poQty = poItem.qty;
      const receivedQty = receiptItem?.receivedQty || 0;
      const billedQty = invoiceItem?.billedQty || 0;

      const poPrice = poItem.price;
      const billedPrice = invoiceItem?.price || 0;

      const qtyVariance = billedQty - receivedQty;
      const priceVariance = (billedPrice - poPrice) * billedQty;

      return {
        ...poItem,
        poQty,
        receivedQty,
        billedQty,
        poPrice,
        billedPrice,
        qtyVariance,
        priceVariance,
        totalVariance: priceVariance + (qtyVariance * poPrice),
      };
    });
  }, [selectedPO]);

  const totalVariance = reconciliationData.reduce((sum, item) => sum + item.totalVariance, 0);
  const matchStatus = totalVariance === 0 ? 'Matched' : 'Variance Detected';

  const renderPanel = (title: string, icon: React.ElementType, data: any, type: 'po' | 'gr' | 'inv') => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon && React.createElement(icon, { className: "h-5 w-5 text-muted-foreground" })}
          {title}
        </CardTitle>
        {data && <CardDescription>{data.id} - {data.date}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('common.item')}</TableHead>
              <TableHead>{t('common.quantity')}</TableHead>
              {type !== 'gr' && <TableHead className="text-right">{t('common.price')}</TableHead>}
              {type !== 'gr' && <TableHead className="text-right">{t('common.total')}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.qty || item.receivedQty || item.billedQty}</TableCell>
                {type !== 'gr' && <TableCell className="text-right">${item.price?.toFixed(2)}</TableCell>}
                {type !== 'gr' && <TableCell className="text-right">${((item.qty || item.billedQty) * item.price).toFixed(2)}</TableCell>}
              </TableRow>
            )) || <TableRow><TableCell colSpan={4}>No data</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('3wm.title')}</CardTitle>
          <CardDescription>{t('3wm.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t('3wm.search.placeholder')} className="pl-8" aria-label={t('3wm.search.placeholder')} />
            </div>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderPanel(t('3wm.po.title'), FileText, selectedPO, 'po')}
        {renderPanel(t('3wm.gr.title'), Truck, selectedPO ? mockReceipts[selectedPO.receipts[0]] : null, 'gr')}
        {renderPanel(t('3wm.invoice.title'), FileCheck2, selectedPO ? mockInvoices[selectedPO.invoices[0]] : null, 'inv')}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('3wm.summary.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.item')}</TableHead>
                <TableHead>{t('3wm.summary.qtyVariance')}</TableHead>
                <TableHead>{t('3wm.summary.priceVariance')}</TableHead>
                <TableHead className="text-right">{t('3wm.summary.totalVariance')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reconciliationData.map(item => (
                <TableRow key={item.id} className={item.totalVariance !== 0 ? 'bg-red-50' : ''}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.qtyVariance}</TableCell>
                  <TableCell>${item.priceVariance.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-bold">${item.totalVariance.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t">
            <div className="flex flex-col items-center">
              <dt className="text-sm font-medium text-muted-foreground">{t('3wm.summary.status')}</dt>
              <dd className="mt-1">
                <Badge variant={matchStatus === 'Matched' ? 'default' : 'destructive'} className="text-lg">
                  {matchStatus === 'Matched' ? <ThumbsUp className="mr-2 h-4 w-4" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
                  {matchStatus}
                </Badge>
              </dd>
            </div>
            <div className="flex flex-col items-center">
              <dt className="text-sm font-medium text-muted-foreground">{t('3wm.summary.totalVariance')}</dt>
              <dd className="mt-1 text-lg font-semibold">${totalVariance.toFixed(2)}</dd>
            </div>
            <div className="flex flex-col items-center">
              <dt className="text-sm font-medium text-muted-foreground">{t('3wm.summary.glImpact')} ({t('3wm.summary.debit')})</dt>
              <dd className="mt-1 text-lg font-semibold">${(selectedPO.total + totalVariance).toFixed(2)}</dd>
            </div>
            <div className="flex flex-col items-center">
              <dt className="text-sm font-medium text-muted-foreground">{t('3wm.summary.glImpact')} ({t('3wm.summary.credit')})</dt>
              <dd className="mt-1 text-lg font-semibold">${(selectedPO.total + totalVariance).toFixed(2)}</dd>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button variant="destructive" disabled={matchStatus === 'Matched'}>
                <Ban className="mr-2 h-4 w-4" /> {t('actions.block')}
            </Button>
            <Button disabled={matchStatus !== 'Matched' && totalVariance === 0}>
                <ThumbsUp className="mr-2 h-4 w-4" /> Post
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
