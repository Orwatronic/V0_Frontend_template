import { NextResponse } from 'next/server'

type Employee = {
  id: string
  employeeId: string
  name: string
  position: string
  department: string
  manager: string
  location: string
  hireDate: string
  salary: number
  status: 'Active' | 'Inactive'
  email: string
  phone: string
  performance: number
  avatar?: string
}

const fallbackEmployees: Employee[] = [
  { id: 'emp-1', employeeId: 'EMP001', name: 'John Smith', position: 'Senior Software Engineer', department: 'Engineering', manager: 'Sarah Johnson', location: 'San Francisco, CA', hireDate: '2022-03-15', salary: 145000, status: 'Active', email: 'john.smith@company.com', phone: '+1 (555) 123-4567', performance: 4.2, avatar: '/placeholder-user.jpg' },
  { id: 'emp-2', employeeId: 'EMP002', name: 'Sarah Johnson', position: 'Engineering Manager', department: 'Engineering', manager: 'Michael Chen', location: 'San Francisco, CA', hireDate: '2021-01-10', salary: 165000, status: 'Active', email: 'sarah.johnson@company.com', phone: '+1 (555) 234-5678', performance: 4.8, avatar: '/placeholder-user.jpg' },
  { id: 'emp-3', employeeId: 'EMP003', name: 'Michael Chen', position: 'VP of Engineering', department: 'Engineering', manager: 'CEO', location: 'San Francisco, CA', hireDate: '2020-06-01', salary: 220000, status: 'Active', email: 'michael.chen@company.com', phone: '+1 (555) 345-6789', performance: 4.9, avatar: '/placeholder-user.jpg' },
]

export async function GET() {
  // CURSOR: API call to GET /api/v1/hcm/employees
  const base = process.env.API_BASE_URL
  if (!base) {
    return NextResponse.json({ data: fallbackEmployees })
  }
  try {
    const url = new URL('/api/v1/hcm/employees', base)
    const res = await fetch(url.toString(), { headers: { accept: 'application/json' }, cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: fallbackEmployees })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: fallbackEmployees })
  }
}


