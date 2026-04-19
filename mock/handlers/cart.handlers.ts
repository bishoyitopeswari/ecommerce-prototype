import { HttpResponse, http } from 'msw'
import { mockDb, recalculateCartSubtotal } from '../data/store'

type AddCartItemBody = {
  productId: string
  quantity?: number
}

type UpdateCartItemBody = {
  quantity: number
}

export const cartHandlers = [
  http.get('/api/cart', () => {
    return HttpResponse.json({ data: mockDb.cart })
  }),

  http.post('/api/cart/items', async ({ request }) => {
    const body = (await request.json()) as AddCartItemBody
    const product = mockDb.products.find((item) => item.id === body.productId)

    if (!product) {
      return HttpResponse.json(
        {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Cannot add unknown product to cart.',
          details: null,
        },
        { status: 404 },
      )
    }

    const quantity = Math.max(1, body.quantity ?? 1)
    const existing = mockDb.cart.items.find((item) => item.productId === product.id)

    if (existing) {
      existing.quantity += quantity
    } else {
      mockDb.cart.items.push({
        id: `c-${product.id}`,
        productId: product.id,
        name: product.name,
        unitPrice: product.price,
        quantity,
      })
    }

    recalculateCartSubtotal()

    return HttpResponse.json({ data: mockDb.cart })
  }),

  http.patch('/api/cart/items/:itemId', async ({ params, request }) => {
    const body = (await request.json()) as UpdateCartItemBody
    const item = mockDb.cart.items.find((entry) => entry.id === params.itemId)

    if (!item) {
      return HttpResponse.json(
        {
          code: 'CART_ITEM_NOT_FOUND',
          message: 'Cart item not found.',
          details: null,
        },
        { status: 404 },
      )
    }

    item.quantity = Math.max(1, body.quantity)
    recalculateCartSubtotal()

    return HttpResponse.json({ data: mockDb.cart })
  }),

  http.delete('/api/cart/items/:itemId', ({ params }) => {
    const before = mockDb.cart.items.length
    mockDb.cart.items = mockDb.cart.items.filter((entry) => entry.id !== params.itemId)

    if (before === mockDb.cart.items.length) {
      return HttpResponse.json(
        {
          code: 'CART_ITEM_NOT_FOUND',
          message: 'Cart item not found.',
          details: null,
        },
        { status: 404 },
      )
    }

    recalculateCartSubtotal()

    return HttpResponse.json({ data: mockDb.cart })
  }),
]
