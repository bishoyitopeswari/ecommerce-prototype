import { afterEach, describe, expect, it } from 'vitest'
import { apiClient } from '@api/client'
import { clearAuthToken, setAuthToken } from '@api/tokens'

describe('api client interceptors', () => {
  afterEach(() => {
    clearAuthToken()
  })

  it('attaches bearer token to outbound requests', async () => {
    setAuthToken('test-token-123')

    let capturedAuthorization = ''
    const originalAdapter = apiClient.defaults.adapter

    apiClient.defaults.adapter = (async (config) => {
      capturedAuthorization =
        (config.headers as { Authorization?: string } | undefined)?.Authorization ?? ''

      return {
        config,
        data: {},
        headers: {},
        status: 200,
        statusText: 'OK',
        request: {},
      }
    }) as NonNullable<typeof apiClient.defaults.adapter>

    await apiClient.get('/interceptor-check')
    apiClient.defaults.adapter = originalAdapter

    expect(capturedAuthorization).toBe('Bearer test-token-123')
  })
})
