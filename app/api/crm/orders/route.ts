import { NextResponse } from 'next/server'

type Order = { id: string; customer: string; orderDate: string; deliveryDate?: string; amount: number; status: 'confirmed' | 'inProgress' | 'delivered' | 'invoiced' | 'completed' }

const fallback: Order[] = [
  { id: 'SO-4001', customer: 'Contoso Ltd', orderDate: '2025-08-06', deliveryDate: '2025-08-10', amount: 12400, status: 'inProgress' },
  { id: 'SO-4002', customer: 'Northwind', orderDate: '2025-08-05', amount: 5200, status: 'confirmed' },
]

export async function GET() {
  const base = process.env.API_BASE_URL
  if (!base) return NextResponse.json({ data: fallback })
  const url = new URL('/api/v1/crm/orders', base)
  try {
    const res = await fetch(url.toString(), { method: 'GET', cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: fallback })
    const json = await res.json()
    const data = Array.isArray(json) ? json : json?.data ?? json?.items ?? fallback
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: fallback })
  }
}


