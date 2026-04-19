import { cartFixture } from './cart'
import { ordersFixture } from './orders'
import { productsFixture } from './products'

export const mockDb = {
  products: structuredClone(productsFixture),
  cart: structuredClone(cartFixture),
  orders: structuredClone(ordersFixture),
}

export function recalculateCartSubtotal() {
  mockDb.cart.subtotal = mockDb.cart.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  )
}
