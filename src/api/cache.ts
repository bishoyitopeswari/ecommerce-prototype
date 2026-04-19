import type { QueryClient } from '@tanstack/react-query'

export const queryKeys = {
  products: (search = '', category = '') => ['products', { search, category }] as const,
  productDetail: (productId: string) => ['product', productId] as const,
  cart: () => ['cart'] as const,
  orders: (page: number, limit: number) => ['orders', page, limit] as const,
}

export function bustCartCache(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: queryKeys.cart() })
}

export function bustOrdersCache(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: ['orders'] })
}
