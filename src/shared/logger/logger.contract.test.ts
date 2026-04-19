import { describe, expect, it, vi } from 'vitest'
import { getLogger, setLogger } from '@shared/logger'
import type { Logger } from '@shared/logger'

describe('logger contract', () => {
  it('allows swapping provider without changing call sites', () => {
    const debug = vi.fn()
    const info = vi.fn()
    const warn = vi.fn()
    const error = vi.fn()

    const provider: Logger = {
      debug,
      info,
      warn,
      error,
    }

    setLogger(provider)

    const logger = getLogger()
    logger.debug('debug_event', { step: 1 })
    logger.info('info_event', { step: 2 })
    logger.warn('warn_event', { step: 3 })
    logger.error('error_event', { step: 4 })

    expect(debug).toHaveBeenCalledWith('debug_event', { step: 1 })
    expect(info).toHaveBeenCalledWith('info_event', { step: 2 })
    expect(warn).toHaveBeenCalledWith('warn_event', { step: 3 })
    expect(error).toHaveBeenCalledWith('error_event', { step: 4 })
  })
})
