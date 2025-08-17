import { NextResponse } from 'next/server'

type Contact = { id: string; name: string; role: string; email: string; account: string }

const fallback: Contact[] = [
  { id: 'CT-2001', name: 'Jane Doe', role: 'CFO', email: 'jane@contoso.com', account: 'Contoso Ltd' },
  { id: 'CT-2002', name: 'John Smith', role: 'IT Director', email: 'john@contoso.com', account: 'Contoso Ltd' },
]

export async function GET(req: Request) {
  const incoming = new URL(req.url)
  const page = Math.max(1, parseInt(incoming.searchParams.get('page') || '1', 10) || 1)
  const limit = Math.max(1, Math.min(100, parseInt(incoming.searchParams.get('limit') || '10', 10) || 10))
  const sortBy = (incoming.searchParams.get('sortBy') || 'name') as keyof Contact
  const sortDir = (incoming.searchParams.get('sortDir') || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc'
  const q = (incoming.searchParams.get('q') || '').toLowerCase()

  const base = process.env.API_BASE_URL
  if (!base) {
    let data = [...fallback]
    if (q) {
      data = data.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.account.toLowerCase().includes(q))
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

  const url = new URL('/api/v1/crm/contacts', base)
  url.search = incoming.search
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


