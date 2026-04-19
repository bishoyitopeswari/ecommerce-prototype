import axios from 'axios'

export type ApiError = {
  code: string
  message: string
  status: number
  details: unknown
}

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500
    const data = error.response?.data as Partial<ApiError> | undefined

    return {
      code: data?.code ?? 'UNKNOWN_API_ERROR',
      message: data?.message ?? error.message ?? 'Request failed.',
      status,
      details: data?.details ?? null,
    }
  }

  if (error instanceof Error) {
    return {
      code: 'UNEXPECTED_ERROR',
      message: error.message,
      status: 500,
      details: null,
    }
  }

  return {
    code: 'UNEXPECTED_ERROR',
    message: 'Unknown error occurred.',
    status: 500,
    details: null,
  }
}
