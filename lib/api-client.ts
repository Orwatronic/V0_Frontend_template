import axios, { AxiosError, AxiosInstance } from 'axios'

const DEFAULT_BASE_URL = 'http://localhost:3001/api/v1'

function getBaseURL(): string {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL
  }
  // Browser-only fallback from globalThis in case env is not inlined
  if (typeof window !== 'undefined') {
    const fromWindow = (window as any).NEXT_PUBLIC_API_BASE_URL
    if (typeof fromWindow === 'string' && fromWindow.length > 0) return fromWindow
  }
  return DEFAULT_BASE_URL
}

function getAccessToken(): string | null {
  try {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('erp-token')
  } catch {
    return null
  }
}

function getRefreshToken(): string | null {
  try {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('erp-refresh-token')
  } catch {
    return null
  }
}

let refreshingPromise: Promise<string | null> | null = null

async function refreshAccessToken(client: AxiosInstance): Promise<string | null> {
  if (refreshingPromise) return refreshingPromise

  refreshingPromise = (async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return null
    try {
      const res = await client.post('/auth/refresh', { refreshToken })
      const newAccessToken: string | undefined = res?.data?.accessToken
      const newRefreshToken: string | undefined = res?.data?.refreshToken
      if (newAccessToken) {
        try {
          localStorage.setItem('erp-token', newAccessToken)
          if (newRefreshToken) localStorage.setItem('erp-refresh-token', newRefreshToken)
        } catch {
          // ignore storage write errors
        }
        return newAccessToken
      }
    } catch {
      // fall through
    }
    return null
  })()

  const result = await refreshingPromise
  refreshingPromise = null
  return result
}

export const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const status = error.response?.status
    // Attempt a single refresh on 401
    if (status === 401 && error.config && !((error.config as any)._retry)) {
      ;(error.config as any)._retry = true
      const newToken = await refreshAccessToken(api)
      if (newToken) {
        error.config.headers = error.config.headers ?? {}
        error.config.headers.Authorization = `Bearer ${newToken}`
        return api.request(error.config)
      }
    }
    return Promise.reject(error)
  },
)

export type ApiError = {
  status: number | null
  message: string
  details?: unknown
}

export function normalizeApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status ?? null
    const message = (err.response?.data as any)?.message || err.message || 'Request failed'
    return { status, message, details: err.response?.data }
  }
  if (err instanceof Error) return { status: null, message: err.message }
  return { status: null, message: 'Unknown error' }
}


