import { NextResponse } from 'next/server'

type Order = {
  id: string
  equipment: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'Open' | 'InProgress' | 'Closed'
}

// Development fallback data if backend is unavailable
const fallbackOrders: Order[] = [
  { id: 'MO-7001', equipment: 'Boiler #2', priority: 'High', status: 'Open' },
  { id: 'MO-7002', equipment: 'Conveyor A', priority: 'Medium', status: 'InProgress' },
  { id: 'MO-7003', equipment: 'Compressor Z', priority: 'Low', status: 'Closed' },
]

export async function GET(req: Request) {
  // CURSOR: API call to GET /api/v1/maintenance/orders
  const base = process.env.API_BASE_URL
  if (!base) {
    return NextResponse.json({ data: fallbackOrders })
  }

  const url = new URL('/api/v1/maintenance/orders', base)
  const abortController = new AbortController()
  const timeout = setTimeout(() => abortController.abort(), 10_000)

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        accept: 'application/json',
        ...(req.headers.get('authorization') ? { authorization: req.headers.get('authorization') as string } : {}),
        ...(req.headers.get('cookie') ? { cookie: req.headers.get('cookie') as string } : {}),
      },
      cache: 'no-store',
      signal: abortController.signal,
    })
    if (!res.ok) {
      return NextResponse.json({ data: fallbackOrders })
    }
    const backendJson = await res.json()
    const data = Array.isArray(backendJson)
      ? backendJson
      : backendJson?.data ?? backendJson?.items ?? fallbackOrders
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: fallbackOrders })
  } finally {
    clearTimeout(timeout)
  }
}


