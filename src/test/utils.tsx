import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import type { PropsWithChildren, ReactElement } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const testTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

type RenderOptions = {
  route?: string
}

export function renderWithProviders(ui: ReactElement, options: RenderOptions = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <MemoryRouter initialEntries={[options.route ?? '/']}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={testTheme}>{children}</ThemeProvider>
        </QueryClientProvider>
      </MemoryRouter>
    )
  }

  return render(ui, { wrapper: Wrapper })
}
