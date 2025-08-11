import { NextResponse } from 'next/server'

// GET /api/crm/customers/:id/summary
// CURSOR: API call to GET /api/v1/crm/customers/:id/summary
export async function GET(req: Request, ctx: { params: { id: string } }) {
  const base = process.env.API_BASE_URL
  const id = ctx.params.id
  if (!id) return NextResponse.json({ error: { code: 'bad_request', message: 'Missing id' } }, { status: 400 })

  if (!base) {
    return NextResponse.json({
      data: {
        arr: 125000,
        openOpportunities: 6,
        arAging: { current: 32000, d30: 12000, d60: 5000, d90: 3000 },
      },
    })
  }

  const incoming = new URL(req.url)
  const url = new URL(`/api/v1/crm/customers/${encodeURIComponent(id)}/summary`, base)
  url.search = incoming.search

  const ac = new AbortController()
  const to = setTimeout(() => ac.abort(), 10_000)
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        ...(req.headers.get('authorization') ? { authorization: req.headers.get('authorization') as string } : {}),
        ...(req.headers.get('cookie') ? { cookie: req.headers.get('cookie') as string } : {}),
        ...(req.headers.get('x-org-id') ? { 'x-org-id': req.headers.get('x-org-id') as string } : {}),
      },
      cache: 'no-store',
      signal: ac.signal,
    })
    if (!res.ok) {
      return NextResponse.json({ error: { code: 'upstream', message: `Upstream status ${res.status}` } }, { status: 502 })
    }
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: { code: 'proxy_error', message } }, { status: 502 })
  } finally {
    clearTimeout(to)
  }
}
