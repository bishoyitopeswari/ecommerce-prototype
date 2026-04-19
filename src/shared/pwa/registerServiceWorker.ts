import { Workbox } from 'workbox-window'
import { env } from '@shared/config/env'
import { getLogger } from '@shared/logger'

type RegisterServiceWorkerOptions = {
  onNeedRefresh: () => void
  onOfflineReady: () => void
}

let activeWorkbox: Workbox | null = null

export function registerServiceWorker(
  options: RegisterServiceWorkerOptions,
): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  if (!env.enablePwa || import.meta.env.DEV) {
    return
  }

  const wb = new Workbox('/sw.js')
  activeWorkbox = wb

  wb.addEventListener('waiting', () => {
    getLogger().info('pwa.update_available')
    options.onNeedRefresh()
  })

  wb.addEventListener('activated', (event) => {
    if (!event.isUpdate) {
      getLogger().info('pwa.offline_ready')
      options.onOfflineReady()
    }
  })

  wb.addEventListener('controlling', () => {
    window.location.reload()
  })

  void wb.register()
}

export function applyServiceWorkerUpdate() {
  if (!activeWorkbox) {
    return
  }

  void activeWorkbox.messageSkipWaiting()
}
