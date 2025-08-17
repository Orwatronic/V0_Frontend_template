import { NextResponse } from 'next/server'

type ApInvoice = { id: string; vendor: string; issueDate: string; dueDate: string; amount: number; status: 'Paid' | 'Open' | 'Overdue' }

const fallbackInvoices: ApInvoice[] = [
  { id: 'INV-001', vendor: 'Tech Supplies Inc.', issueDate: '2024-07-15', dueDate: '2024-08-14', amount: 1250.0, status: 'Paid' },
  { id: 'INV-002', vendor: 'Office Solutions LLC', issueDate: '2024-07-20', dueDate: '2024-08-19', amount: 750.5, status: 'Open' },
  { id: 'INV-003', vendor: 'Cloud Services Co.', issueDate: '2024-07-22', dueDate: '2024-08-21', amount: 3500.0, status: 'Open' },
  { id: 'INV-004', vendor: 'Marketing Agency', issueDate: '2024-06-30', dueDate: '2024-07-30', amount: 5000.0, status: 'Overdue' },
  { id: 'INV-005', vendor: 'Logistics Partners', issueDate: '2024-07-25', dueDate: '2024-08-24', amount: 2100.75, status: 'Open' },
]

export async function GET() {
  // CURSOR: API call to GET /api/v1/financials/ap/invoices
  const base = process.env.API_BASE_URL
  if (!base) {
    return NextResponse.json({ data: fallbackInvoices })
  }
  try {
    const url = new URL('/api/v1/financials/ap/invoices', base)
    const res = await fetch(url.toString(), { headers: { accept: 'application/json' }, cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: fallbackInvoices })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: fallbackInvoices })
  }
}


