import { queryOptions } from '@tanstack/react-query'
import { queryKeys } from '@api/cache'
import { fetchCart } from './api'

export function cartQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.cart(),
    queryFn: fetchCart,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  })
}
