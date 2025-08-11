import { NextResponse } from 'next/server'

// GET /api/crm/customers/:id/activities
// CURSOR: API call to GET /api/v1/crm/customers/:id/activities
export async function GET(req: Request, ctx: { params: { id: string } }) {
  const base = process.env.API_BASE_URL
  const id = ctx.params.id
  if (!id) return NextResponse.json({ error: { code: 'bad_request', message: 'Missing id' } }, { status: 400 })

  if (!base) {
    return NextResponse.json({
      data: [
        { id: 'a1', type: 'call', at: '2025-08-08T10:00:00Z', subject: 'Quarterly review', createdBy: { id: 'u1', name: 'Sara' } },
        { id: 'a2', type: 'meeting', at: '2025-08-09T09:30:00Z', subject: 'Solution demo', createdBy: { id: 'u2', name: 'Nabil' } },
      ],
    })
  }

  const incoming = new URL(req.url)
  const url = new URL(`/api/v1/crm/customers/${encodeURIComponent(id)}/activities`, base)
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
