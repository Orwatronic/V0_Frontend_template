import { NextResponse } from 'next/server'
import { discoverOrganizationsByEmail } from '@/app/login/actions'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = (searchParams.get('email') || '').trim()

  try {
    // CURSOR: API call to GET /api/v1/organizations?email={email}
    // Privacy-first default: when no email is provided, return an empty list.
    if (!email) {
      return NextResponse.json({ organizations: [] })
    }
    const organizations = await discoverOrganizationsByEmail(email)
    return NextResponse.json({ organizations })
  } catch {
    return NextResponse.json({ organizations: [] }, { status: 500 })
  }
}
