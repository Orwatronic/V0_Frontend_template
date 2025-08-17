export async function GET() {
  const header = ['Lead ID','Company','Owner','Status','Created','Score'].join(',')
  const example = ['L-1005','Acme Corp','Eve','new','2025-08-10T09:00:00Z','55'].join(',')
  const csv = `${header}\n${example}\n`
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="leads_template.csv"',
      'Cache-Control': 'no-cache',
    },
  })
}


