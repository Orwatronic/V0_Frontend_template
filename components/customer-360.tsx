'use client'

import { useEffect, useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/contexts/i18n-context'
import { User, Building2, Mail, Phone, MapPin, FolderOpen } from 'lucide-react'

type Customer = {
  id: string
  name: string
  code?: string
  segment?: string
  industry?: string
  primaryContact?: { id: string; name: string; email?: string; phone?: string }
  billingAddress?: string
  shippingAddress?: string
}

type Summary = {
  arr?: number
  openOpportunities?: number
  arAging?: { current: number; d30: number; d60: number; d90: number }
}

type Contact = {
  id: string
  name: string
  role?: string
  email?: string
  phone?: string
}

type Opportunity = {
  id: string
  name: string
  stage: 'lead' | 'qualified' | 'proposal' | 'won' | string
  amount?: number
  currency?: string
  closeDate?: string
}

type Activity =
  | { id: string; type: 'call' | 'meeting' | 'email' | 'note'; at: string; subject?: string; createdBy: { id: string; name: string } }

type Invoice = {
  id: string
  number: string
  status: 'draft' | 'open' | 'overdue' | 'paid' | string
  dueDate?: string
  total?: number
  currency?: string
}

type ApiOk<T> = { data: T }
type ApiErr = { error: { code: string; message: string } }

export default function Customer360({ customerId }: { customerId: string }) {
  const { t } = useI18n()

  const [overview, setOverview] = useState<Customer | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [contacts, setContacts] = useState<Contact[] | null>(null)
  const [opps, setOpps] = useState<Opportunity[] | null>(null)
  const [activities, setActivities] = useState<Activity[] | null>(null)
  const [invoices, setInvoices] = useState<Invoice[] | null>(null)
  const [loading, setLoading] = useState(true)

  const dateFormatter = useMemo(() => {
    try {
      return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })
    } catch {
      return null
    }
  }, [])

  async function fetchOverview(): Promise<Customer> {
    // CURSOR: API call to GET /api/v1/crm/customers/:id
    const res = await fetch(`/api/crm/customers/${encodeURIComponent(customerId)}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('overview')
    const json = (await res.json()) as ApiOk<Customer> | ApiErr
    if ('error' in json) throw new Error(json.error.message)
    return json.data
  }

  async function fetchSummary(): Promise<Summary> {
    // CURSOR: API call to GET /api/v1/crm/customers/:id/summary
    const res = await fetch(`/api/crm/customers/${encodeURIComponent(customerId)}/summary`, { cache: 'no-store' })
    if (!res.ok) throw new Error('summary')
    const json = (await res.json()) as ApiOk<Summary> | ApiErr
    if ('error' in json) throw new Error(json.error.message)
    return json.data
  }

  async function fetchContacts(): Promise<Contact[]> {
    // CURSOR: API call to GET /api/v1/crm/customers/:id/contacts
    const res = await fetch(`/api/crm/customers/${encodeURIComponent(customerId)}/contacts`, { cache: 'no-store' })
    if (!res.ok) throw new Error('contacts')
    const json = (await res.json()) as ApiOk<Contact[]> | ApiErr
    if ('error' in json) throw new Error(json.error.message)
    return json.data
  }

  async function fetchOpportunities(): Promise<Opportunity[]> {
    // CURSOR: API call to GET /api/v1/crm/customers/:id/opportunities
    const res = await fetch(`/api/crm/customers/${encodeURIComponent(customerId)}/opportunities`, { cache: 'no-store' })
    if (!res.ok) throw new Error('opportunities')
    const json = (await res.json()) as ApiOk<Opportunity[]> | ApiErr
    if ('error' in json) throw new Error(json.error.message)
    return json.data
  }

  async function fetchActivities(): Promise<Activity[]> {
    // CURSOR: API call to GET /api/v1/crm/customers/:id/activities
    const res = await fetch(`/api/crm/customers/${encodeURIComponent(customerId)}/activities`, { cache: 'no-store' })
    if (!res.ok) throw new Error('activities')
    const json = (await res.json()) as ApiOk<Activity[]> | ApiErr
    if ('error' in json) throw new Error(json.error.message)
    return json.data
  }

  async function fetchInvoices(): Promise<Invoice[]> {
    // CURSOR: API call to GET /api/v1/crm/customers/:id/invoices
    const res = await fetch(`/api/crm/customers/${encodeURIComponent(customerId)}/invoices`, { cache: 'no-store' })
    if (!res.ok) throw new Error('invoices')
    const json = (await res.json()) as ApiOk<Invoice[]> | ApiErr
    if ('error' in json) throw new Error(json.error.message)
    return json.data
  }

  useEffect(() => {
    let mounted = true
    setLoading(true)
    ;(async () => {
      const [o, s, c, oo, a, i] = await Promise.allSettled([
        fetchOverview(),
        fetchSummary(),
        fetchContacts(),
        fetchOpportunities(),
        fetchActivities(),
        fetchInvoices(),
      ])
      if (!mounted) return
      if (o.status === 'fulfilled') setOverview(o.value)
      if (s.status === 'fulfilled') setSummary(s.value)
      if (c.status === 'fulfilled') setContacts(c.value)
      if (oo.status === 'fulfilled') setOpps(oo.value)
      if (a.status === 'fulfilled') setActivities(a.value)
      if (i.status === 'fulfilled') setInvoices(i.value)
      setLoading(false)

      if (o.status === 'rejected') console.error('Customer 360 overview error:', o.reason)
      if (s.status === 'rejected') console.error('Customer 360 summary error:', s.reason)
      if (c.status === 'rejected') console.error('Customer 360 contacts error:', c.reason)
      if (oo.status === 'rejected') console.error('Customer 360 opportunities error:', oo.reason)
      if (a.status === 'rejected') console.error('Customer 360 activities error:', a.reason)
      if (i.status === 'rejected') console.error('Customer 360 invoices error:', i.reason)
    })()
    return () => {
      mounted = false
    }
  }, [customerId])

  const aging = summary?.arAging ?? { current: 0, d30: 0, d60: 0, d90: 0 }

  return (
    <section aria-label={t('crm.customer360.title')} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {overview?.name ?? t('crm.customer360.unknownCustomer')}
          </h1>
          <p className="text-muted-foreground">
            {t('crm.customer360.subtitle')}
          </p>
        </div>
        {overview?.code ? (
          <Badge variant="secondary" aria-label={t('crm.customer360.customerCode', { code: overview.code })}>
            {overview.code}
          </Badge>
        ) : null}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="overview">{t('crm.customer360.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="contacts">{t('crm.customer360.tabs.contacts')}</TabsTrigger>
          <TabsTrigger value="opportunities">{t('crm.customer360.tabs.opportunities')}</TabsTrigger>
          <TabsTrigger value="activities">{t('crm.customer360.tabs.activities')}</TabsTrigger>
          <TabsTrigger value="invoices">{t('crm.customer360.tabs.invoices')}</TabsTrigger>
          <TabsTrigger value="files">{t('crm.customer360.tabs.files')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                  {t('crm.customer360.overview.company')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><span className="font-medium">{t('crm.customer360.overview.segment')}:</span> {overview?.segment ?? '—'}</div>
                <div><span className="font-medium">{t('crm.customer360.overview.industry')}:</span> {overview?.industry ?? '—'}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" aria-hidden="true" />
                  {t('crm.customer360.overview.primaryContact')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="font-medium">{overview?.primaryContact?.name ?? '—'}</div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  <span>{overview?.primaryContact?.email ?? '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>{overview?.primaryContact?.phone ?? '—'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {t('crm.customer360.overview.addresses')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">{t('crm.customer360.overview.billing')}:</span>{' '}
                  {overview?.billingAddress ?? '—'}
                </div>
                <div>
                  <span className="font-medium">{t('crm.customer360.overview.shipping')}:</span>{' '}
                  {overview?.shippingAddress ?? '—'}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">{t('crm.customer360.metrics.arr')}</CardTitle></CardHeader>
              <CardContent className="text-2xl font-semibold">
                {typeof summary?.arr === 'number' ? summary.arr.toLocaleString() : '—'}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">{t('crm.customer360.metrics.openOpps')}</CardTitle></CardHeader>
              <CardContent className="text-2xl font-semibold">
                {typeof summary?.openOpportunities === 'number' ? summary.openOpportunities : '—'}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">{t('crm.customer360.metrics.arAgingCurrent')}</CardTitle></CardHeader>
              <CardContent className="text-2xl font-semibold">
                {aging.current?.toLocaleString?.() ?? '—'}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">{t('crm.customer360.metrics.arAging90')}</CardTitle></CardHeader>
              <CardContent className="text-2xl font-semibold">
                {aging.d90?.toLocaleString?.() ?? '—'}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          {contacts?.length ? (
            <Card>
              <CardHeader><CardTitle>{t('crm.customer360.contacts.title')}</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('crm.customer360.contacts.name')}</TableHead>
                      <TableHead>{t('crm.customer360.contacts.role')}</TableHead>
                      <TableHead>{t('crm.customer360.contacts.email')}</TableHead>
                      <TableHead>{t('crm.customer360.contacts.phone')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>{c.name}</TableCell>
                        <TableCell className="text-muted-foreground">{c.role ?? '—'}</TableCell>
                        <TableCell className="text-muted-foreground">{c.email ?? '—'}</TableCell>
                        <TableCell className="text-muted-foreground">{c.phone ?? '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">{loading ? t('crm.customer360.loading') : t('crm.customer360.contacts.empty')}</p>
          )}
        </TabsContent>

        <TabsContent value="opportunities">
          {opps?.length ? (
            <Card>
              <CardHeader><CardTitle>{t('crm.customer360.opps.title')}</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('crm.customer360.opps.name')}</TableHead>
                      <TableHead>{t('crm.customer360.opps.stage')}</TableHead>
                      <TableHead>{t('crm.customer360.opps.amount')}</TableHead>
                      <TableHead>{t('crm.customer360.opps.closeDate')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opps.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell>{o.name}</TableCell>
                        <TableCell className="text-muted-foreground">{o.stage}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {typeof o.amount === 'number' ? `${o.amount.toLocaleString()} ${o.currency ?? ''}` : '—'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {o.closeDate ? (dateFormatter ? dateFormatter.format(new Date(o.closeDate)) : o.closeDate) : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">{loading ? t('crm.customer360.loading') : t('crm.customer360.opps.empty')}</p>
          )}
        </TabsContent>

        <TabsContent value="activities">
          {activities?.length ? (
            <Card>
              <CardHeader><CardTitle>{t('crm.customer360.activities.title')}</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {activities.map((a) => (
                    <li key={a.id} className="rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{a.type.toUpperCase()} • {a.subject ?? t('crm.customer360.activities.noSubject')}</span>
                        <span className="text-xs text-muted-foreground">
                          {a.at ? (dateFormatter ? dateFormatter.format(new Date(a.at)) : a.at) : '—'}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t('crm.customer360.activities.byUser', { name: a.createdBy?.name ?? '—' })}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">{loading ? t('crm.customer360.loading') : t('crm.customer360.activities.empty')}</p>
          )}
        </TabsContent>

        <TabsContent value="invoices">
          {invoices?.length ? (
            <Card>
              <CardHeader><CardTitle>{t('crm.customer360.invoices.title')}</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('crm.customer360.invoices.number')}</TableHead>
                      <TableHead>{t('crm.customer360.invoices.status')}</TableHead>
                      <TableHead>{t('crm.customer360.invoices.dueDate')}</TableHead>
                      <TableHead>{t('crm.customer360.invoices.total')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell>{inv.number}</TableCell>
                        <TableCell className="text-muted-foreground">{inv.status}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {inv.dueDate ? (dateFormatter ? dateFormatter.format(new Date(inv.dueDate)) : inv.dueDate) : '—'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {typeof inv.total === 'number' ? `${inv.total.toLocaleString()} ${inv.currency ?? ''}` : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">{loading ? t('crm.customer360.loading') : t('crm.customer360.invoices.empty')}</p>
          )}
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" aria-hidden="true" />
                {t('crm.customer360.files.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t('crm.customer360.files.placeholder')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}
