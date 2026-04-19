import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProductListPage } from '@features/products/pages/ProductListPage'
import { renderWithProviders } from '@test/utils'

const fetchProductsMock = vi.fn()
const fetchProductByIdMock = vi.fn()

vi.mock('@features/products/api', () => ({
  fetchProducts: (...args: unknown[]) => fetchProductsMock(...args),
  fetchProductById: (...args: unknown[]) => fetchProductByIdMock(...args),
}))

describe('ProductListPage', () => {
  it('supports search and category filtering flow', async () => {
    fetchProductsMock.mockImplementation(({ search = '', category = '' }: { search?: string; category?: string }) => {
      const items = [
        {
          id: 'p-1',
          name: 'Trail Running Sneakers',
          description: 'Running shoes',
          category: 'Footwear',
          price: 99,
          stock: 10,
          rating: 4.7,
          imageUrl: '/x',
        },
        {
          id: 'p-2',
          name: 'Linen Shirt',
          description: 'Cotton shirt',
          category: 'Apparel',
          price: 45,
          stock: 12,
          rating: 4.1,
          imageUrl: '/y',
        },
      ]

      return Promise.resolve(
        items.filter((item) => {
          const matchesSearch =
            search.length === 0 || item.name.toLowerCase().includes(search.toLowerCase())
          const matchesCategory = category.length === 0 || item.category === category
          return matchesSearch && matchesCategory
        }),
      )
    })

    renderWithProviders(<ProductListPage />, { route: '/products' })

    expect(await screen.findByText(/trail running sneakers/i)).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText(/search/i), 'linen')

    await waitFor(() => {
      expect(screen.queryByText(/trail running sneakers/i)).not.toBeInTheDocument()
    })

    expect(screen.getByText(/linen shirt/i)).toBeInTheDocument()

    await userEvent.clear(screen.getByLabelText(/search/i))
    await userEvent.click(screen.getByRole('combobox', { name: /category/i }))
    await userEvent.click(await screen.findByRole('option', { name: 'Footwear' }))

    await waitFor(() => {
      expect(screen.getByText(/trail running sneakers/i)).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('combobox', { name: /category/i }))
    expect(await screen.findByRole('option', { name: 'Footwear' })).toBeInTheDocument()
    expect(await screen.findByRole('option', { name: 'Apparel' })).toBeInTheDocument()

    await userEvent.click(await screen.findByRole('option', { name: 'All Categories' }))

    await waitFor(() => {
      expect(screen.getByText(/linen shirt/i)).toBeInTheDocument()
      expect(screen.getByText(/trail running sneakers/i)).toBeInTheDocument()
    })
  })
})
