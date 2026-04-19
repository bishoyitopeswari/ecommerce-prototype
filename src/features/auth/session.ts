import type { AuthSession, UserProfile } from '@shared/types/entities'
import { clearAuthToken, getAuthToken, setAuthToken } from '@api/tokens'

const USER_STORAGE_KEY = 'ecommerce.auth.user'

export function setAuthSession(session: AuthSession) {
  setAuthToken(session.token)
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session.user))
}

export function clearAuthSession() {
  clearAuthToken()
  localStorage.removeItem(USER_STORAGE_KEY)
}

export function getCurrentUser(): UserProfile | null {
  const value = localStorage.getItem(USER_STORAGE_KEY)
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as UserProfile
  } catch {
    return null
  }
}

export function isAuthenticated() {
  return Boolean(getAuthToken())
}
