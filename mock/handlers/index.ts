import { authHandlers } from './auth.handlers'
import { cartHandlers } from './cart.handlers'
import { ordersHandlers } from './orders.handlers'
import { productsHandlers } from './products.handlers'

export const handlers = [
  ...authHandlers,
  ...productsHandlers,
  ...cartHandlers,
  ...ordersHandlers,
]
