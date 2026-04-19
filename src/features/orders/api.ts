import { apiClient } from '@api/client'
import type { Order, PaginatedOrders } from '@shared/types/entities'

type OrdersParams = {
  page: number
  limit: number
}

type PlaceOrderResponse = {
  data: Order
}

export async function fetchOrders(params: OrdersParams) {
  const response = await apiClient.get<PaginatedOrders>('/orders', { params })
  return response.data
}

export async function placeOrder() {
  const response = await apiClient.post<PlaceOrderResponse>('/orders')
  return response.data.data
}
