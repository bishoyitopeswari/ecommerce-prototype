import { apiClient } from '@api/client'
import type { AuthSession } from '@shared/types/entities'

type LoginPayload = {
  username: string
  password: string
}

export async function login(payload: LoginPayload) {
  const response = await apiClient.post<AuthSession>('/auth/login', payload)
  return response.data
}
