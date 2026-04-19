import { ConsoleLogger } from './consoleLogger'
import type { Logger } from './types'

let currentLogger: Logger = new ConsoleLogger()

export function getLogger() {
  return currentLogger
}

export function setLogger(logger: Logger) {
  currentLogger = logger
}

export type { Logger, LogContext, LogLevel } from './types'
