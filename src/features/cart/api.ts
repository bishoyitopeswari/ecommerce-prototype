import { apiClient } from '@api/client'
import type { CartSnapshot } from '@shared/types/entities'

type CartResponse = {
  data: CartSnapshot
}

type AddCartItemPayload = {
  productId: string
  quantity?: number
}

export async function fetchCart() {
  const response = await apiClient.get<CartResponse>('/cart')
  return response.data.data
}

export async function addCartItem(payload: AddCartItemPayload) {
  const response = await apiClient.post<CartResponse>('/cart/items', payload)
  return response.data.data
}

export async function updateCartItem(itemId: string, quantity: number) {
  const response = await apiClient.patch<CartResponse>(`/cart/items/${itemId}`, { quantity })
  return response.data.data
}

export async function removeCartItem(itemId: string) {
  const response = await apiClient.delete<CartResponse>(`/cart/items/${itemId}`)
  return response.data.data
}
