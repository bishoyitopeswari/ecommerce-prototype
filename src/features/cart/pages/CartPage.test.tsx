import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CartPage } from '@features/cart/pages/CartPage'
import { renderWithProviders } from '@test/utils'

const fetchCartMock = vi.fn()
const updateCartItemMock = vi.fn()
const removeCartItemMock = vi.fn()

vi.mock('@features/cart/api', () => ({
  fetchCart: (...args: unknown[]) => fetchCartMock(...args),
  updateCartItem: (...args: unknown[]) => updateCartItemMock(...args),
  removeCartItem: (...args: unknown[]) => removeCartItemMock(...args),
  addCartItem: vi.fn(),
}))

describe('CartPage', () => {
  it('rolls back optimistic quantity update on API failure', async () => {
    fetchCartMock.mockResolvedValue({
      items: [
        {
          id: 'c-1',
          productId: 'p-1',
          name: 'Trail Running Sneakers',
          unitPrice: 99,
          quantity: 1,
        },
      ],
      subtotal: 99,
    })

    updateCartItemMock.mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          setTimeout(() => {
            reject({
              code: 'NETWORK',
              message: 'Could not update cart.',
              status: 500,
              details: null,
            })
          }, 25)
        }),
    )

    renderWithProviders(<CartPage />, { route: '/cart' })

    expect(await screen.findByText('1')).toBeInTheDocument()

    const increaseButton = screen.getByRole('button', { name: /increase quantity/i })
    await userEvent.click(increaseButton)

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    expect(await screen.findByText('Could not update cart.')).toBeInTheDocument()
  })
})
