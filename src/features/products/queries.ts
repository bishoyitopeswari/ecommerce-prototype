import { queryOptions } from '@tanstack/react-query'
import { queryKeys } from '@api/cache'
import { fetchProductById, fetchProducts } from './api'

type ProductListFilters = {
  search?: string
  category?: string
}

export function productListQueryOptions(filters: ProductListFilters = {}) {
  const search = filters.search ?? ''
  const category = filters.category ?? ''

  return queryOptions({
    queryKey: queryKeys.products(search, category),
    queryFn: () => fetchProducts({ search, category }),
    staleTime: 60 * 1000,
  })
}

export function productDetailQueryOptions(productId: string) {
  return queryOptions({
    queryKey: queryKeys.productDetail(productId),
    queryFn: () => fetchProductById(productId),
    staleTime: 60 * 1000,
  })
}
