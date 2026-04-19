import { apiClient } from '@api/client'
import type { Product } from '@shared/types/entities'

type ProductsResponse = {
  data: Product[]
}

type ProductResponse = {
  data: Product
}

type ProductFilters = {
  search?: string
  category?: string
}

export async function fetchProducts(filters: ProductFilters = {}) {
  const response = await apiClient.get<ProductsResponse>('/products', {
    params: {
      search: filters.search ?? '',
      category: filters.category ?? '',
    },
  })

  return response.data.data
}

export async function fetchProductById(productId: string) {
  const response = await apiClient.get<ProductResponse>(`/products/${productId}`)
  return response.data.data
}
