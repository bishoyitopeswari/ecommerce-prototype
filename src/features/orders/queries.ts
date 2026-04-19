import { queryOptions } from '@tanstack/react-query'
import { queryKeys } from '@api/cache'
import { fetchOrders } from './api'

export function ordersQueryOptions(page: number, limit: number) {
  return queryOptions({
    queryKey: queryKeys.orders(page, limit),
    queryFn: () => fetchOrders({ page, limit }),
    staleTime: 2 * 60 * 1000,
  })
}
