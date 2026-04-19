import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { bustCartCache, bustOrdersCache } from '@api/cache'
import { placeOrder } from '@features/orders/api'
import { ordersQueryOptions } from '@features/orders/queries'
import type { ApiError } from '@api/error'

export function OrdersPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const limit = 5

  const query = useQuery(ordersQueryOptions(page, limit))

  const placeOrderMutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: async () => {
      setPage(1)
      await Promise.all([bustOrdersCache(queryClient), bustCartCache(queryClient)])
    },
  })

  const error = query.error as ApiError | null
  const mutationError = placeOrderMutation.error as ApiError | null

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Order History
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => placeOrderMutation.mutate()}
            disabled={placeOrderMutation.isPending}
          >
            {placeOrderMutation.isPending ? 'Placing order...' : 'Place order from cart'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              void bustOrdersCache(queryClient)
            }}
          >
            Refresh pages cache
          </Button>
        </Stack>

        {query.isLoading ? <CircularProgress /> : null}
        {error ? <Alert severity="error">{error.message}</Alert> : null}
        {mutationError ? <Alert severity="error">{mutationError.message}</Alert> : null}
        {placeOrderMutation.isSuccess ? (
          <Alert severity="success">Order placed successfully. Order history cache refreshed.</Alert>
        ) : null}

        <Stack spacing={1}>
          {(query.data?.data ?? []).map((order) => (
            <Typography key={order.id}>
              {order.id} - {order.status} - ${order.total}
            </Typography>
          ))}
        </Stack>

        {!query.isLoading && (query.data?.data.length ?? 0) === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No orders yet.
          </Alert>
        ) : null}

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
            Previous
          </Button>
          <Typography sx={{ alignSelf: 'center' }}>
            Page {query.data?.page ?? page} of {query.data?.totalPages ?? 1}
          </Typography>
          <Button
            disabled={page >= (query.data?.totalPages ?? 1)}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
