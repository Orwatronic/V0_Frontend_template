export async function GET() {
  const header = ['Account ID','Name','Type','Status','Country'].join(',')
  const example = ['AC-1004','Globex','enterprise','active','US'].join(',')
  const csv = `${header}\n${example}\n`
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="accounts_template.csv"',
      'Cache-Control': 'no-cache',
    },
  })
}


