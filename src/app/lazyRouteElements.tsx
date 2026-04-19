/* eslint-disable react-refresh/only-export-components */

import { lazy, Suspense } from 'react'
import type { ReactElement } from 'react'
import { PageLoader } from '@shared/components/PageLoader'

const LoginPage = lazy(() =>
  import('@features/auth').then((module) => ({ default: module.LoginPage })),
)
const CartPage = lazy(() =>
  import('@features/cart').then((module) => ({ default: module.CartPage })),
)
const OrdersPage = lazy(() =>
  import('@features/orders').then((module) => ({ default: module.OrdersPage })),
)
const ProductListPage = lazy(() =>
  import('@features/products').then((module) => ({ default: module.ProductListPage })),
)
const ProductDetailPage = lazy(() =>
  import('@features/products').then((module) => ({ default: module.ProductDetailPage })),
)

function withSuspense(element: ReactElement) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>
}

export const lazyRouteElements = {
  login: withSuspense(<LoginPage />),
  products: withSuspense(<ProductListPage />),
  productDetail: withSuspense(<ProductDetailPage />),
  cart: withSuspense(<CartPage />),
  orders: withSuspense(<OrdersPage />),
}
