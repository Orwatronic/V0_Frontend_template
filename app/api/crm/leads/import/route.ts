export async function POST(req: Request) {
  // Very light mock validation: expects text/csv body
  const text = await req.text()
  const lines = text.trim().split(/\r?\n/)
  const header = lines[0]?.split(',') ?? []
  const required = ['Lead ID','Company','Owner','Status','Created','Score']
  const missing = required.filter(h => !header.includes(h))
  const errors: Array<{ row: number; message: string }> = []
  if (missing.length) {
    return new Response(JSON.stringify({ ok: false, errors: [{ row: 0, message: `Missing columns: ${missing.join(', ')}` }] }), { headers: { 'content-type': 'application/json' }, status: 400 })
  }
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',')
    if (!cols[0] || !cols[1]) errors.push({ row: i, message: 'Lead ID and Company are required' })
  }
  if (errors.length) {
    return new Response(JSON.stringify({ ok: false, errors }), { headers: { 'content-type': 'application/json' }, status: 422 })
  }
  return new Response(JSON.stringify({ ok: true, imported: Math.max(0, lines.length - 1) }), { headers: { 'content-type': 'application/json' } })
}


