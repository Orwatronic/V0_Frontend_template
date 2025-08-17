import { NextResponse } from 'next/server'

type ApInvoice = { id: string; vendor: string; issueDate: string; dueDate: string; amount: number; status: 'Paid' | 'Open' | 'Overdue' }

const fallbackInvoices: ApInvoice[] = [
  { id: 'INV-001', vendor: 'Tech Supplies Inc.', issueDate: '2024-07-15', dueDate: '2024-08-14', amount: 1250.0, status: 'Paid' },
  { id: 'INV-002', vendor: 'Office Solutions LLC', issueDate: '2024-07-20', dueDate: '2024-08-19', amount: 750.5, status: 'Open' },
  { id: 'INV-003', vendor: 'Cloud Services Co.', issueDate: '2024-07-22', dueDate: '2024-08-21', amount: 3500.0, status: 'Open' },
  { id: 'INV-004', vendor: 'Marketing Agency', issueDate: '2024-06-30', dueDate: '2024-07-30', amount: 5000.0, status: 'Overdue' },
  { id: 'INV-005', vendor: 'Logistics Partners', issueDate: '2024-07-25', dueDate: '2024-08-24', amount: 2100.75, status: 'Open' },
]

export async function GET(_req: Request, context: { params: { id: string } }) {
  // CURSOR: API call to GET /api/v1/financials/ap/invoices/{id}
  const base = process.env.API_BASE_URL
  if (!base) {
    const item = fallbackInvoices.find(i => i.id === context.params.id) || null
    return NextResponse.json({ data: item })
  }
  try {
    const url = new URL(`/api/v1/financials/ap/invoices/${encodeURIComponent(context.params.id)}`, base)
    const res = await fetch(url.toString(), { headers: { accept: 'application/json' }, cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: null })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    const item = fallbackInvoices.find(i => i.id === context.params.id) || null
    return NextResponse.json({ data: item })
  }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
  // CURSOR: API call to PATCH /api/v1/financials/ap/invoices/{id}
  const base = process.env.API_BASE_URL
  const body = await req.json().catch(() => ({}))
  if (!base) {
    const existing = fallbackInvoices.find(i => i.id === context.params.id) || null
    return NextResponse.json({ data: existing ? { ...existing, ...body } : null })
  }
  try {
    const url = new URL(`/api/v1/financials/ap/invoices/${encodeURIComponent(context.params.id)}`, base)
    const res = await fetch(url.toString(), { method: 'PATCH', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(body) })
    if (!res.ok) return NextResponse.json({ data: null })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    const existing = fallbackInvoices.find(i => i.id === context.params.id) || null
    return NextResponse.json({ data: existing ? { ...existing, ...body } : null })
  }
}


