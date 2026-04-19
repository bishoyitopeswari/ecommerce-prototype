export type Product = {
  id: string
  name: string
  description: string
  category: string
  price: number
  stock: number
  rating: number
  imageUrl: string
}

export type UserProfile = {
  id: string
  username: string
  name: string
  email: string
}

export type AuthSuccess = {
  token: string
  user: UserProfile
}

export type CartItem = {
  id: string
  productId: string
  name: string
  unitPrice: number
  quantity: number
}

export type CartSnapshot = {
  items: CartItem[]
  subtotal: number
}

export type OrderItem = {
  productId: string
  name: string
  unitPrice: number
  quantity: number
}

export type Order = {
  id: string
  createdAt: string
  status: 'placed' | 'shipped' | 'delivered'
  items: OrderItem[]
  total: number
}

export type PaginatedOrders = {
  page: number
  limit: number
  total: number
  totalPages: number
  data: Order[]
}
