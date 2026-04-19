import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoginPage } from '@features/auth/pages/LoginPage'
import { renderWithProviders } from '@test/utils'

const loginMock = vi.fn()
const setAuthSessionMock = vi.fn()
const isAuthenticatedMock = vi.fn(() => false)

vi.mock('@features/auth/api', () => ({
  login: (...args: unknown[]) => loginMock(...args),
}))

vi.mock('@features/auth/session', () => ({
  setAuthSession: (...args: unknown[]) => setAuthSessionMock(...args),
  isAuthenticated: () => isAuthenticatedMock(),
}))

vi.mock('@shared/hooks/useUnsavedChangesGuard', () => ({
  useUnsavedChangesGuard: () => undefined,
}))

beforeEach(() => {
  vi.clearAllMocks()
  isAuthenticatedMock.mockReturnValue(false)
})

describe('LoginPage', () => {
  it('shows success path for valid credentials', async () => {
    loginMock.mockResolvedValueOnce({
      token: 'mock-token',
      user: {
        id: 'u-1',
        username: 'demo',
        name: 'Demo Shopper',
        email: 'demo@example.com',
      },
    })

    renderWithProviders(<LoginPage />, { route: '/login' })

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(setAuthSessionMock).toHaveBeenCalledTimes(1)
    })
  })

  it('shows normalized error for invalid credentials', async () => {
    loginMock.mockRejectedValueOnce({
      code: 'AUTH_INVALID_CREDENTIALS',
      message: 'Invalid username or password.',
      status: 401,
      details: null,
    })

    renderWithProviders(<LoginPage />, { route: '/login' })

    const usernameInput = screen.getAllByLabelText(/username/i)[0]
    const passwordInput = screen.getAllByLabelText(/password/i)[0]

    await userEvent.clear(usernameInput)
    await userEvent.type(usernameInput, 'wrong')
    await userEvent.clear(passwordInput)
    await userEvent.type(passwordInput, 'wrong')

    await userEvent.click(screen.getByRole('button', { name: /continue/i }))

    expect(await screen.findByText('Invalid username or password.')).toBeInTheDocument()
  })
})
