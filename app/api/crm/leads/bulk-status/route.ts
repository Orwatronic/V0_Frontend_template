import { NextResponse } from 'next/server'

type BulkStatusBody = {
  ids: string[]
  status: 'new' | 'contacted' | 'qualified' | 'lost'
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as BulkStatusBody
    if (!Array.isArray(body.ids) || !body.status) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const base = process.env.API_BASE_URL
    if (base) {
      const url = new URL('/api/v1/crm/leads/bulk-status', base)
      const res = await fetch(url.toString(), {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          ...(req.headers.get('authorization') ? { authorization: req.headers.get('authorization') as string } : {}),
          ...(req.headers.get('cookie') ? { cookie: req.headers.get('cookie') as string } : {}),
        },
        cache: 'no-store',
        body: JSON.stringify(body),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) return NextResponse.json(json || { error: 'Upstream error' }, { status: res.status })
      return NextResponse.json(json)
    }

    return NextResponse.json({ updated: body.ids, status: body.status })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}


