import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  type SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { productDetailQueryOptions, productListQueryOptions } from '@features/products/queries'
import type { ApiError } from '@api/error'
import { Link as RouterLink } from 'react-router-dom'

export function ProductListPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategory(event.target.value)
  }

  const allProductsQuery = useQuery(productListQueryOptions())
  const query = useQuery(productListQueryOptions({ search, category }))
  const error = query.error as ApiError | null

  const categories = useMemo(() => {
    const set = new Set((allProductsQuery.data ?? []).map((item) => item.category))
    return Array.from(set)
  }, [allProductsQuery.data])

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Product Listing
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField label="Search" value={search} onChange={(event) => setSearch(event.target.value)} fullWidth />
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              label="Category"
              value={category}
              onChange={handleCategoryChange}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
          {categories.map((item) => (
            <Chip key={item} label={item} onClick={() => setCategory(item)} variant={category === item ? 'filled' : 'outlined'} />
          ))}
        </Stack>

        {query.isLoading ? <CircularProgress /> : null}
        {error ? <Alert severity="error">{error.message}</Alert> : null}
        {!query.isLoading && !error && (query.data?.length ?? 0) === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No products match your current search and filter.
          </Alert>
        ) : null}

        <Grid container spacing={2}>
          {(query.data ?? []).map((product) => (
            <Grid key={product.id} size={{ xs: 12, md: 6 }}>
              <Card
                variant="outlined"
                onMouseEnter={() => {
                  void queryClient.prefetchQuery(productDetailQueryOptions(product.id))
                }}
              >
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {product.description}
                  </Typography>
                  <Typography variant="body2">Category: {product.category}</Typography>
                  <Typography variant="body2">Price: ${product.price}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button component={RouterLink} to={`/products/${product.id}`} variant="contained" size="small">
                      View details
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}
