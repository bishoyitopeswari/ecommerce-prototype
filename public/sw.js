const APP_SHELL_CACHE = 'app-shell-v1'
const PRODUCTS_CACHE = 'products-api-v1'
const STATIC_CACHE = 'static-assets-v1'

const APP_SHELL_URLS = ['/', '/index.html']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL_URLS)
    }),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const validCaches = [APP_SHELL_CACHE, PRODUCTS_CACHE, STATIC_CACHE]
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((key) => !validCaches.includes(key))
          .map((key) => caches.delete(key)),
      )

      await self.clients.claim()
    })(),
  )
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        void cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => cached)

  return cached || networkPromise
}

async function networkFirstHtml(request) {
  const cache = await caches.open(APP_SHELL_CACHE)

  try {
    const response = await fetch(request)
    if (response.ok) {
      await cache.put('/index.html', response.clone())
    }
    return response
  } catch {
    const fallback = await cache.match('/index.html')
    if (fallback) {
      return fallback
    }
    throw new Error('Offline and no app shell cache available')
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  const url = new URL(request.url)

  if (url.origin !== self.location.origin) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstHtml(request))
    return
  }

  if (url.pathname.startsWith('/api/products')) {
    event.respondWith(staleWhileRevalidate(request, PRODUCTS_CACHE))
    return
  }

  const isStaticAsset =
    url.pathname.startsWith('/assets/') ||
    ['script', 'style', 'image', 'font'].includes(request.destination)

  if (isStaticAsset) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE))
  }
})
