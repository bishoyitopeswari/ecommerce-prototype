import { screen } from '@testing-library/react'
import type { JSX } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from '@shared/errors/ErrorBoundary'
import { renderWithProviders } from '@test/utils'

function Thrower(): JSX.Element {
  throw new Error('render failed')
}

describe('ErrorBoundary', () => {
  it('renders fallback when child throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    renderWithProviders(
      <ErrorBoundary>
        <Thrower />
      </ErrorBoundary>,
    )

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
  })
})
