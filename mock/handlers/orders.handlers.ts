import { HttpResponse, http } from 'msw'
import { mockDb, recalculateCartSubtotal } from '../data/store'
import type { Order } from '../types'

function paginate<T>(list: T[], page: number, limit: number) {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  return list.slice(startIndex, endIndex)
}

export const ordersHandlers = [
  http.get('/api/orders', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? 1)
    const limit = Number(url.searchParams.get('limit') ?? 5)

    const safePage = Number.isFinite(page) && page > 0 ? page : 1
    const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 5

    const total = mockDb.orders.length
    const totalPages = Math.max(1, Math.ceil(total / safeLimit))
    const data = paginate(mockDb.orders, safePage, safeLimit)

    return HttpResponse.json({
      data,
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
    })
  }),

  http.post('/api/orders', () => {
    if (mockDb.cart.items.length === 0) {
      return HttpResponse.json(
        {
          code: 'EMPTY_CART',
          message: 'Cannot place an order with an empty cart.',
          details: null,
        },
        { status: 400 },
      )
    }

    const order: Order = {
      id: `o-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'placed',
      items: mockDb.cart.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      })),
      total: mockDb.cart.subtotal,
    }

    mockDb.orders.unshift(order)
    mockDb.cart.items = []
    recalculateCartSubtotal()

    return HttpResponse.json({ data: order }, { status: 201 })
  }),
]
