import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import RemoveIcon from '@mui/icons-material/Remove'
import { bustCartCache, queryKeys } from '@api/cache'
import type { CartSnapshot } from '@shared/types/entities'
import { removeCartItem, updateCartItem } from '@features/cart/api'
import { cartQueryOptions } from '@features/cart/queries'
import type { ApiError } from '@api/error'

export function CartPage() {
  const queryClient = useQueryClient()
  const query = useQuery(cartQueryOptions())

  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart() })

      const previousCart = queryClient.getQueryData<CartSnapshot>(queryKeys.cart())
      if (previousCart) {
        const nextItems = previousCart.items.map((item) =>
          item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item,
        )
        const nextSubtotal = nextItems.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0,
        )

        queryClient.setQueryData<CartSnapshot>(queryKeys.cart(), {
          ...previousCart,
          items: nextItems,
          subtotal: nextSubtotal,
        })
      }

      return { previousCart }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart(), context.previousCart)
      }
    },
    onSettled: async () => {
      await bustCartCache(queryClient)
    },
  })

  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart() })

      const previousCart = queryClient.getQueryData<CartSnapshot>(queryKeys.cart())
      if (previousCart) {
        const nextItems = previousCart.items.filter((item) => item.id !== itemId)
        const nextSubtotal = nextItems.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0,
        )

        queryClient.setQueryData<CartSnapshot>(queryKeys.cart(), {
          ...previousCart,
          items: nextItems,
          subtotal: nextSubtotal,
        })
      }

      return { previousCart }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart(), context.previousCart)
      }
    },
    onSettled: async () => {
      await bustCartCache(queryClient)
    },
  })

  const error = query.error as ApiError | null
  const mutationError = (updateQuantityMutation.error ?? removeItemMutation.error) as
    | ApiError
    | null

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Cart
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              void bustCartCache(queryClient)
            }}
          >
            Refresh from server
          </Button>
        </Stack>

        {query.isLoading ? <CircularProgress /> : null}
        {error ? <Alert severity="error">{error.message}</Alert> : null}
        {mutationError ? <Alert severity="error">{mutationError.message}</Alert> : null}

        <Stack spacing={1}>
          {(query.data?.items ?? []).map((item) => (
            <Stack
              key={item.id}
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Typography>
                {item.name} - ${item.unitPrice}
              </Typography>

              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <IconButton
                  aria-label="decrease quantity"
                  onClick={() =>
                    updateQuantityMutation.mutate({
                      itemId: item.id,
                      quantity: Math.max(1, item.quantity - 1),
                    })
                  }
                  disabled={updateQuantityMutation.isPending}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ minWidth: 24, textAlign: 'center' }}>{item.quantity}</Typography>
                <IconButton
                  aria-label="increase quantity"
                  onClick={() =>
                    updateQuantityMutation.mutate({
                      itemId: item.id,
                      quantity: item.quantity + 1,
                    })
                  }
                  disabled={updateQuantityMutation.isPending}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="remove item"
                  color="error"
                  onClick={() => removeItemMutation.mutate(item.id)}
                  disabled={removeItemMutation.isPending}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          ))}
        </Stack>

        {!query.isLoading && (query.data?.items.length ?? 0) === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            Your cart is empty.
          </Alert>
        ) : null}

        <Typography sx={{ mt: 2 }} variant="h6">
          Subtotal: ${query.data?.subtotal ?? 0}
        </Typography>
      </CardContent>
    </Card>
  )
}
