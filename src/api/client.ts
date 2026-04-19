import axios, { type InternalAxiosRequestConfig } from 'axios'
import { normalizeApiError } from '@api/error'
import { getAuthToken } from '@api/tokens'
import { env } from '@shared/config/env'
import { getLogger } from '@shared/logger'

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startedAt: number
    }
  }
}

const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.metadata = { startedAt: Date.now() }

  const token = getAuthToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => {
    const startedAt = response.config.metadata?.startedAt
    if (startedAt) {
      const durationMs = Date.now() - startedAt
      getLogger().info('api.duration', {
        method: response.config.method,
        url: response.config.url,
        status: response.status,
        durationMs,
      })
    }

    return response
  },
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.config?.metadata?.startedAt) {
      const durationMs = Date.now() - error.config.metadata.startedAt
      getLogger().warn('api.duration', {
        method: error.config.method,
        url: error.config.url,
        status: error.response?.status,
        durationMs,
      })
    }

    const normalizedError = normalizeApiError(error)
    getLogger().error('api.error', normalizedError)

    return Promise.reject(normalizedError)
  },
)

export { apiClient }
