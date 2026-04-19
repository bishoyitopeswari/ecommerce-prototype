import { HttpResponse, http } from 'msw'
import { mockDb } from '../data/store'

export const productsHandlers = [
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url)
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase()
    const category = (url.searchParams.get('category') ?? '').trim().toLowerCase()

    const filtered = mockDb.products.filter((product) => {
      const matchesSearch =
        search.length === 0 ||
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search)
      const matchesCategory =
        category.length === 0 || product.category.toLowerCase() === category

      return matchesSearch && matchesCategory
    })

    return HttpResponse.json({ data: filtered })
  }),

  http.get('/api/products/:id', ({ params }) => {
    const product = mockDb.products.find((item) => item.id === params.id)

    if (!product) {
      return HttpResponse.json(
        {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Requested product does not exist.',
          details: null,
        },
        { status: 404 },
      )
    }

    return HttpResponse.json({ data: product })
  }),
]
