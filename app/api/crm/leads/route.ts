import { NextResponse } from 'next/server'

type Lead = {
  id: string
  company: string
  owner: string
  status: 'new' | 'contacted' | 'qualified' | 'lost'
  createdAt: string
  score: number
}

const fallbackData: Lead[] = [
  { id: 'L-1001', company: 'Contoso', owner: 'Alice', status: 'new', createdAt: '2025-08-01T09:00:00Z', score: 62 },
  { id: 'L-1002', company: 'Northwind', owner: 'Bob', status: 'contacted', createdAt: '2025-08-03T10:30:00Z', score: 48 },
  { id: 'L-1003', company: 'Fabrikam', owner: 'Chris', status: 'qualified', createdAt: '2025-08-05T13:15:00Z', score: 78 },
  { id: 'L-1004', company: 'Initech', owner: 'Dana', status: 'lost', createdAt: '2025-08-07T16:45:00Z', score: 35 },
]

export async function GET(req: Request) {
  // Supports ?page=&limit=&sortBy=&sortDir=&q=
  const incoming = new URL(req.url)
  const page = Math.max(1, parseInt(incoming.searchParams.get('page') || '1', 10) || 1)
  const limit = Math.max(1, Math.min(100, parseInt(incoming.searchParams.get('limit') || '10', 10) || 10))
  const sortBy = (incoming.searchParams.get('sortBy') || 'createdAt') as keyof Lead
  const sortDir = (incoming.searchParams.get('sortDir') || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc'
  const q = (incoming.searchParams.get('q') || '').toLowerCase()

  const base = process.env.API_BASE_URL
  if (!base) {
    let data = [...fallbackData]
    if (q) {
      data = data.filter((l) =>
        l.id.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.owner.toLowerCase().includes(q),
      )
    }
    data.sort((a, b) => {
      const av: any = (a as any)[sortBy]
      const bv: any = (b as any)[sortBy]
      if (av === bv) return 0
      return (av > bv ? 1 : -1) * (sortDir === 'asc' ? 1 : -1)
    })
    const total = data.length
    const start = (page - 1) * limit
    const paged = data.slice(start, start + limit)
    return NextResponse.json({ data: paged, meta: { total, page, totalPages: Math.max(1, Math.ceil(total / limit)), limit, sortBy, sortDir, q } })
  }

  const url = new URL('/api/v1/crm/leads', base)
  url.search = incoming.search
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
      return NextResponse.json({ data: fallbackData })
    }
    const backendJson = await res.json()
    const data = Array.isArray(backendJson) ? backendJson : backendJson?.data ?? backendJson?.items ?? fallbackData
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: fallbackData })
  } finally {
    clearTimeout(timeout)
  }
}


