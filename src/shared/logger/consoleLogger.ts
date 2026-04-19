import type { LogContext, Logger } from './types'

function toPayload(level: string, message: string, context?: LogContext) {
  return {
    ts: new Date().toISOString(),
    level,
    message,
    context: context ?? {},
  }
}

export class ConsoleLogger implements Logger {
  debug(message: string, context?: LogContext) {
    console.debug(toPayload('debug', message, context))
  }

  info(message: string, context?: LogContext) {
    console.info(toPayload('info', message, context))
  }

  warn(message: string, context?: LogContext) {
    console.warn(toPayload('warn', message, context))
  }

  error(message: string, context?: LogContext) {
    console.error(toPayload('error', message, context))
  }
}
