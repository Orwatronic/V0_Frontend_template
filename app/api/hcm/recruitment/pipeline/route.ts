import { NextResponse } from 'next/server'

type Candidate = {
  id: string
  name: string
  email: string
  phone: string
  position: string
  location: string
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'
  appliedDate: string
  source: string
  experience: number
  expectedSalary: number
  currentSalary: number
  skills: string[]
  education: string
  rating: number
  notes: string
  resumeUrl?: string
  imageUrl?: string
  recruiter: string
  priority: 'high' | 'medium' | 'low'
  interviews: any[]
  evaluations: any[]
}

const fallbackPipeline: Candidate[] = [
  { id:'cand-1', name:'Sarah Johnson', email:'sarah.johnson@email.com', phone:'+1 (555) 123-4567', position:'Senior Software Engineer', location:'San Francisco, CA', stage:'interview', appliedDate:'2024-01-15', source:'LinkedIn', experience:5, expectedSalary:140000, currentSalary:120000, skills:['React','TypeScript','Node.js','AWS'], education:'BS Computer Science - Stanford', rating:4.5, notes:'Strong technical background, excellent communication skills', imageUrl:'/placeholder-user.jpg', recruiter:'Jane Smith', priority:'high', interviews:[{ id:'int-1', date:'2024-01-20', time:'10:00 AM', interviewer:'John Doe', type:'video', status:'completed', feedback:'Excellent technical skills, good cultural fit', rating:4 }], evaluations:[{ id:'eval-1', evaluator:'John Doe', date:'2024-01-20', technicalScore:4.5, communicationScore:4.0, culturalFitScore:4.2, overallScore:4.2, comments:'Strong candidate with excellent technical skills' }] },
  { id:'cand-2', name:'Michael Chen', email:'michael.chen@email.com', phone:'+1 (555) 234-5678', position:'Product Manager', location:'New York, NY', stage:'offer', appliedDate:'2024-01-10', source:'Indeed', experience:7, expectedSalary:160000, currentSalary:145000, skills:['Product Strategy','Agile','Analytics','Leadership'], education:'MBA - Harvard Business School', rating:4.8, notes:'Exceptional product management experience', imageUrl:'/placeholder-user.jpg', recruiter:'Jane Smith', priority:'high', interviews:[], evaluations:[] },
  { id:'cand-3', name:'Emily Rodriguez', email:'emily.rodriguez@email.com', phone:'+1 (555) 345-6789', position:'UX Designer', location:'Austin, TX', stage:'screening', appliedDate:'2024-01-18', source:'Company Website', experience:3, expectedSalary:95000, currentSalary:80000, skills:['Figma','User Research','Prototyping','Design Systems'], education:'BFA Design - Art Center', rating:4.0, notes:'Creative portfolio, strong design thinking', imageUrl:'/placeholder-user.jpg', recruiter:'Bob Wilson', priority:'medium', interviews:[], evaluations:[] },
]

export async function GET() {
  // CURSOR: API call to GET /api/v1/hcm/recruitment/pipeline
  const base = process.env.API_BASE_URL
  if (!base) {
    return NextResponse.json({ data: fallbackPipeline })
  }
  try {
    const url = new URL('/api/v1/hcm/recruitment/pipeline', base)
    const res = await fetch(url.toString(), { headers: { accept: 'application/json' }, cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: fallbackPipeline })
    const backendJson = await res.json()
    const data = backendJson?.data ?? backendJson
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ data: fallbackPipeline })
  }
}


