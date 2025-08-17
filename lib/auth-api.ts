import { api, normalizeApiError } from '@/lib/api-client'

export type LoginResponse = {
  accessToken: string
  refreshToken?: string
  user: {
    id: string
    name: string
    email: string
    company?: string
    roles?: string[]
  }
}

export async function apiLogin(email: string, company: string): Promise<LoginResponse> {
  try {
    // CURSOR: API call to POST /api/v1/auth/login
    const res = await api.post('/auth/login', { email, company })
    const data = res.data as LoginResponse
    return data
  } catch (err) {
    throw normalizeApiError(err)
  }
}

export async function apiLogout(): Promise<{ success: boolean }> {
  try {
    // CURSOR: API call to POST /api/v1/auth/logout
    const res = await api.post('/auth/logout')
    return res.data ?? { success: true }
  } catch (err) {
    throw normalizeApiError(err)
  }
}


