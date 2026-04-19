import type { CartSnapshot } from '../types'

export const cartFixture: CartSnapshot = {
  items: [
    {
      id: 'c-1',
      productId: 'p-1002',
      name: 'Classic Linen Shirt',
      unitPrice: 49,
      quantity: 1,
    },
  ],
  subtotal: 49,
}
