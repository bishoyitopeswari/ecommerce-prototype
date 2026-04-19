import type { LogLevel } from '@shared/logger'

function readBoolean(value: string | undefined, defaultValue: boolean) {
  if (value === undefined) {
    return defaultValue
  }

  return value.toLowerCase() === 'true'
}

function readLogLevel(value: string | undefined): LogLevel {
  if (value === 'debug' || value === 'info' || value === 'warn' || value === 'error') {
    return value
  }

  return 'info'
}

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  enableMocks: readBoolean(import.meta.env.VITE_ENABLE_MOCKS, true),
  logLevel: readLogLevel(import.meta.env.VITE_LOG_LEVEL),
  enablePwa: readBoolean(import.meta.env.VITE_ENABLE_PWA, true),
}
