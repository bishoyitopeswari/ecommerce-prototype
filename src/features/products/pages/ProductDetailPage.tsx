import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material'
import { useMemo } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { queryKeys } from '@api/cache'
import { addCartItem } from '@features/cart/api'
import { productDetailQueryOptions } from '@features/products/queries'
import type { ApiError } from '@api/error'

export function ProductDetailPage() {
  const { productId } = useParams()
  const queryClient = useQueryClient()
  const resolvedProductId = productId ?? ''

  const query = useQuery(productDetailQueryOptions(resolvedProductId))

  const addToCartMutation = useMutation({
    mutationFn: () => addCartItem({ productId: resolvedProductId, quantity: 1 }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.cart() })
    },
  })

  const error = query.error as ApiError | null
  const mutationError = addToCartMutation.error as ApiError | null

  const invalidRouteParam = useMemo(() => resolvedProductId.length === 0, [resolvedProductId])

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Product Detail
        </Typography>
        {invalidRouteParam ? <Alert severity="error">Product id is missing from route.</Alert> : null}
        {query.isLoading ? <CircularProgress /> : null}
        {error ? <Alert severity="error">{error.message}</Alert> : null}
        {query.data ? (
          <Stack spacing={1.25}>
            <Typography variant="h5">{query.data.name}</Typography>
            <Typography color="text.secondary" sx={{ my: 1 }}>
              {query.data.description}
            </Typography>
            <Typography>Category: {query.data.category}</Typography>
            <Typography>Price: ${query.data.price}</Typography>
            <Typography>Stock: {query.data.stock}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                disabled={addToCartMutation.isPending || query.data.stock <= 0}
                onClick={() => addToCartMutation.mutate()}
              >
                {addToCartMutation.isPending ? 'Adding...' : 'Add to cart'}
              </Button>
              <Button component={RouterLink} to="/products" variant="outlined">
                Back to products
              </Button>
            </Stack>
            {addToCartMutation.isSuccess ? <Alert severity="success">Added to cart.</Alert> : null}
            {mutationError ? <Alert severity="error">{mutationError.message}</Alert> : null}
          </Stack>
        ) : null}
      </CardContent>
    </Card>
  )
}
