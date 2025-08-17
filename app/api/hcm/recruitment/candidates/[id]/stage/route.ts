import { NextResponse } from 'next/server'

export async function PUT(req: Request, context: { params: { id: string } }) {
  // CURSOR: API call to PUT /api/v1/hcm/recruitment/candidates/{id}/stage
  const base = process.env.API_BASE_URL
  const body = await req.json().catch(() => ({}))
  if (!base) {
    // Echo-only fallback
    return NextResponse.json({ data: { id: context.params.id, ...body } })
  }
  try {
    const url = new URL(`/api/v1/hcm/recruitment/candidates/${encodeURIComponent(context.params.id)}/stage`, base)
    const res = await fetch(url.toString(), { method: 'PUT', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(body) })
    if (!res.ok) return NextResponse.json({ data: { id: context.params.id, ...body } })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: { id: context.params.id, ...body } })
  }
}


