import { NextResponse } from 'next/server'

type ArInvoice = { id: string; customer: string; issueDate: string; dueDate: string; amount: number; status: 'Sent' | 'Paid' | 'Overdue' | 'Draft' }

const fallbackInvoices: ArInvoice[] = [
  { id: 'CINV-201', customer: 'Innovate Corp', issueDate: '2024-07-18', dueDate: '2024-08-17', amount: 15000.0, status: 'Sent' },
  { id: 'CINV-202', customer: 'Synergy Solutions', issueDate: '2024-07-21', dueDate: '2024-08-20', amount: 8200.5, status: 'Paid' },
  { id: 'CINV-203', customer: 'Apex Industries', issueDate: '2024-06-25', dueDate: '2024-07-25', amount: 22000.0, status: 'Overdue' },
  { id: 'CINV-204', customer: 'Quantum Dynamics', issueDate: '2024-07-28', dueDate: '2024-08-27', amount: 12500.0, status: 'Sent' },
  { id: 'CINV-205', customer: 'Pioneer Ltd', issueDate: '2024-08-01', dueDate: '2024-08-31', amount: 9800.0, status: 'Draft' },
]

export async function GET() {
  // CURSOR: API call to GET /api/v1/financials/ar/invoices
  const base = process.env.API_BASE_URL
  if (!base) {
    return NextResponse.json({ data: fallbackInvoices })
  }
  try {
    const url = new URL('/api/v1/financials/ar/invoices', base)
    const res = await fetch(url.toString(), { headers: { accept: 'application/json' }, cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: fallbackInvoices })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: fallbackInvoices })
  }
}


