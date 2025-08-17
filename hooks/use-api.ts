"use client"

import { useCallback } from 'react'
import { api, normalizeApiError, type ApiError } from '@/lib/api-client'
import { toast } from '@/hooks/use-toast'

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export function useApi() {
  const request = useCallback(async <T,>(method: HttpMethod, url: string, data?: any, config?: any): Promise<T> => {
    try {
      const res = await (api as any)[method](url, data, config)
      return res.data as T
    } catch (err) {
      const e: ApiError = normalizeApiError(err)
      toast({ title: 'Request failed', description: e.message, variant: 'destructive' })
      throw e
    }
  }, [])

  const get = useCallback(<T,>(url: string, config?: any) => request<T>('get', url, undefined, config), [request])
  const post = useCallback(<T,>(url: string, body?: any, config?: any) => request<T>('post', url, body, config), [request])
  const put = useCallback(<T,>(url: string, body?: any, config?: any) => request<T>('put', url, body, config), [request])
  const patch = useCallback(<T,>(url: string, body?: any, config?: any) => request<T>('patch', url, body, config), [request])
  const del = useCallback(<T,>(url: string, config?: any) => request<T>('delete', url, undefined, config), [request])

  return { get, post, put, patch, del }
}


