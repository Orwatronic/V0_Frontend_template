import { NextResponse } from 'next/server'

const fallbackMetrics = {
  totalCandidates: 156,
  newThisWeek: 12,
  averageTimeToHire: 18,
  conversionRate: 23,
  topSources: [
    { source: 'LinkedIn', count: 45 },
    { source: 'Indeed', count: 32 },
    { source: 'Referral', count: 28 },
    { source: 'Company Website', count: 25 },
  ],
  stageDistribution: [
    { stage: 'Applied', count: 42 },
    { stage: 'Screening', count: 28 },
    { stage: 'Interview', count: 18 },
    { stage: 'Offer', count: 8 },
    { stage: 'Hired', count: 35 },
    { stage: 'Rejected', count: 25 },
  ],
}

export async function GET() {
  // CURSOR: API call to GET /api/v1/hcm/recruitment/metrics
  const base = process.env.API_BASE_URL
  if (!base) {
    return NextResponse.json({ data: fallbackMetrics })
  }
  try {
    const url = new URL('/api/v1/hcm/recruitment/metrics', base)
    const res = await fetch(url.toString(), { headers: { accept: 'application/json' }, cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: fallbackMetrics })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: fallbackMetrics })
  }
}


