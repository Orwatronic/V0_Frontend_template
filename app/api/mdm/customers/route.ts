import { NextResponse } from 'next/server'

type Customer = { id: string; name: string; type: string; status: string; country: string; creditLimit: number; approvalStatus: string; created: string }

const fallbackCustomers: Customer[] = [
  { id: 'C001', name: 'Innovate Corp', type: 'Enterprise', status: 'active', country: 'USA', creditLimit: 500000, approvalStatus: 'approved', created: '2023-01-15' },
  { id: 'C002', name: 'Quantum Solutions', type: 'SME', status: 'active', country: 'Germany', creditLimit: 150000, approvalStatus: 'approved', created: '2023-02-20' },
  { id: 'C003', name: 'Apex Industries', type: 'Enterprise', status: 'pending', country: 'Japan', creditLimit: 1000000, approvalStatus: 'pending', created: '2023-03-10' },
]

export async function GET() {
  // CURSOR: API call to GET /api/v1/mdm/customers
  const base = process.env.API_BASE_URL
  if (!base) {
    return NextResponse.json({ data: fallbackCustomers })
  }
  try {
    const url = new URL('/api/v1/mdm/customers', base)
    const res = await fetch(url.toString(), { headers: { accept: 'application/json' }, cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: fallbackCustomers })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: fallbackCustomers })
  }
}


