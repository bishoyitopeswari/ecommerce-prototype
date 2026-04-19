import type { Order } from '../types'

export const ordersFixture: Order[] = [
  {
    id: 'o-5001',
    createdAt: '2026-03-10T12:30:00.000Z',
    status: 'delivered',
    items: [
      {
        productId: 'p-1001',
        name: 'Canvas Weekender Bag',
        unitPrice: 89,
        quantity: 1,
      },
    ],
    total: 89,
  },
  {
    id: 'o-5002',
    createdAt: '2026-03-22T09:10:00.000Z',
    status: 'shipped',
    items: [
      {
        productId: 'p-1005',
        name: 'Noise-Isolating Earbuds',
        unitPrice: 79,
        quantity: 1,
      },
      {
        productId: 'p-1006',
        name: 'Soft Knit Throw',
        unitPrice: 39,
        quantity: 2,
      },
    ],
    total: 157,
  },
]
