import { NextResponse } from 'next/server'

type Order = {
  id: string
  equipment: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'Open' | 'InProgress' | 'Closed'
}

const fallbackOrders: Order[] = [
  { id: 'MO-7001', equipment: 'Boiler #2', priority: 'High', status: 'Open' },
  { id: 'MO-7002', equipment: 'Conveyor A', priority: 'Medium', status: 'InProgress' },
  { id: 'MO-7003', equipment: 'Compressor Z', priority: 'Low', status: 'Closed' },
]

export async function GET(_req: Request, context: { params: { id: string } }) {
  // CURSOR: API call to GET /api/v1/maintenance/orders/{id}
  const base = process.env.API_BASE_URL
  if (!base) {
    const item = fallbackOrders.find(o => o.id === context.params.id)
    return NextResponse.json({ data: item ?? null })
  }
  const url = new URL(`/api/v1/maintenance/orders/${encodeURIComponent(context.params.id)}`, base)
  try {
    const res = await fetch(url.toString(), { headers: { accept: 'application/json' }, cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: null })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    const item = fallbackOrders.find(o => o.id === context.params.id)
    return NextResponse.json({ data: item ?? null })
  }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
  // CURSOR: API call to PATCH /api/v1/maintenance/orders/{id}
  const body = await req.json().catch(() => ({}))
  const base = process.env.API_BASE_URL
  if (!base) {
    // Return the merged item without persistence
    const existing = fallbackOrders.find(o => o.id === context.params.id) ?? null
    return NextResponse.json({ data: existing ? { ...existing, ...body } : null })
  }
  const url = new URL(`/api/v1/maintenance/orders/${encodeURIComponent(context.params.id)}`, base)
  try {
    const res = await fetch(url.toString(), {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return NextResponse.json({ data: null })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    const existing = fallbackOrders.find(o => o.id === context.params.id) ?? null
    return NextResponse.json({ data: existing ? { ...existing, ...body } : null })
  }
}


