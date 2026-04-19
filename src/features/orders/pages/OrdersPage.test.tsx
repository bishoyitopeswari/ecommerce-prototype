import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { OrdersPage } from '@features/orders/pages/OrdersPage'
import { renderWithProviders } from '@test/utils'

const fetchOrdersMock = vi.fn()
const placeOrderMock = vi.fn()
const bustOrdersCacheMock = vi.fn(() => Promise.resolve())
const bustCartCacheMock = vi.fn(() => Promise.resolve())

vi.mock('@features/orders/api', () => ({
  fetchOrders: (...args: unknown[]) => fetchOrdersMock(...args),
  placeOrder: (...args: unknown[]) => placeOrderMock(...args),
}))

vi.mock('@api/cache', async () => {
  const actual = await vi.importActual<typeof import('@api/cache')>('@api/cache')
  return {
    ...actual,
    bustOrdersCache: () => bustOrdersCacheMock(),
    bustCartCache: () => bustCartCacheMock(),
  }
})

describe('OrdersPage', () => {
  it('supports pagination and invalidates caches after placing order', async () => {
    fetchOrdersMock.mockImplementation(({ page }: { page: number }) => {
      if (page === 1) {
        return Promise.resolve({
          page: 1,
          limit: 5,
          total: 2,
          totalPages: 2,
          data: [{ id: 'o-1', status: 'placed', total: 99, createdAt: '', items: [] }],
        })
      }

      return Promise.resolve({
        page: 2,
        limit: 5,
        total: 2,
        totalPages: 2,
        data: [{ id: 'o-2', status: 'shipped', total: 120, createdAt: '', items: [] }],
      })
    })

    placeOrderMock.mockResolvedValue({
      id: 'o-3',
      status: 'placed',
      total: 130,
      createdAt: '',
      items: [],
    })

    renderWithProviders(<OrdersPage />, { route: '/orders' })

    expect(await screen.findByText(/o-1/i)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /next/i }))

    expect(await screen.findByText(/o-2/i)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /place order from cart/i }))

    await waitFor(() => {
      expect(bustOrdersCacheMock).toHaveBeenCalledTimes(1)
      expect(bustCartCacheMock).toHaveBeenCalledTimes(1)
    })

    expect(await screen.findByText(/order placed successfully/i)).toBeInTheDocument()
  })
})
