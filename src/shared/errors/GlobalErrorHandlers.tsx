import { useEffect } from 'react'
import { getLogger } from '@shared/logger'

export function GlobalErrorHandlers() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      getLogger().error('window.onerror', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    }

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      getLogger().error('window.onunhandledrejection', {
        reason:
          event.reason instanceof Error
            ? {
                message: event.reason.message,
                stack: event.reason.stack,
              }
            : event.reason,
      })
    }

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onUnhandledRejection)

    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onUnhandledRejection)
    }
  }, [])

  return null
}
