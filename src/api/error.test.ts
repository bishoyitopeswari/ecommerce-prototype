import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'
import { normalizeApiError } from '@api/error'

describe('normalizeApiError', () => {
  it('normalizes axios api error shape', () => {
    const axiosError = new AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        data: {
          code: 'AUTH_INVALID_CREDENTIALS',
          message: 'Invalid username or password.',
          details: { field: 'password' },
        },
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: { headers: AxiosHeaders.from({}) },
      },
    )

    const result = normalizeApiError(axiosError)

    expect(result).toEqual({
      code: 'AUTH_INVALID_CREDENTIALS',
      message: 'Invalid username or password.',
      status: 401,
      details: { field: 'password' },
    })
  })

  it('normalizes generic runtime error', () => {
    const result = normalizeApiError(new Error('Boom'))

    expect(result).toEqual({
      code: 'UNEXPECTED_ERROR',
      message: 'Boom',
      status: 500,
      details: null,
    })
  })
})
