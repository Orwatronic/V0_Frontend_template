import { NextResponse } from 'next/server'

type Body = { stage: 'lead' | 'qualified' | 'proposal' | 'won' | 'lost' }

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!body?.stage) return NextResponse.json({ error: 'Missing stage' }, { status: 400 })

  const base = process.env.API_BASE_URL
  if (base) {
    const url = new URL(`/api/v1/crm/opportunities/${id}/stage`, base)
    try {
      const res = await fetch(url.toString(), {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) return NextResponse.json(json || { error: 'Upstream error' }, { status: res.status })
      return NextResponse.json(json)
    } catch {
      return NextResponse.json({ error: 'Upstream failure' }, { status: 502 })
    }
  }

  return NextResponse.json({ id, stage: body.stage })
}


