import { NextResponse } from 'next/server'

const fallback = (id: string) => ({
  id,
  name: 'Jane Doe',
  role: 'CFO',
  email: 'jane@contoso.com',
  account: 'Contoso Ltd',
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const base = process.env.API_BASE_URL
  const { id } = params
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  if (!base) return NextResponse.json({ data: fallback(id) })
  const url = new URL(`/api/v1/crm/contacts/${id}`, base)
  try {
    const res = await fetch(url.toString(), { method: 'GET', cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: fallback(id) })
    const json = await res.json()
    return NextResponse.json({ data: json?.data ?? json })
  } catch {
    return NextResponse.json({ data: fallback(id) })
  }
}


