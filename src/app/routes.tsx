import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { queryClient } from '@app/queryClient'
import { ProtectedRoute } from '@features/auth/components/ProtectedRoute'
import { lazyRouteElements } from '@app/lazyRouteElements'
import { productDetailQueryOptions, productListQueryOptions } from '@features/products/queries'
import { AppShell } from '@shared/components/AppShell'

export const appRoutes: RouteObject[] = [
  {
    path: '/login',
    element: lazyRouteElements.login,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/products" replace />,
      },
      {
        path: 'products',
        loader: async () => {
          await queryClient.ensureQueryData(productListQueryOptions())
          return null
        },
        element: lazyRouteElements.products,
      },
      {
        path: 'products/:productId',
        loader: async ({ params }) => {
          if (!params.productId) {
            return null
          }

          await queryClient.ensureQueryData(productDetailQueryOptions(params.productId))
          return null
        },
        element: lazyRouteElements.productDetail,
      },
      {
        path: 'cart',
        element: lazyRouteElements.cart,
      },
      {
        path: 'orders',
        element: lazyRouteElements.orders,
      },
    ],
  },
]
