import { useMutation } from '@tanstack/react-query'
import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login } from '@features/auth/api'
import { isAuthenticated, setAuthSession } from '@features/auth/session'
import { useUnsavedChangesGuard } from '@shared/hooks/useUnsavedChangesGuard'
import type { ApiError } from '@api/error'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('demo')
  const [password, setPassword] = useState('demo123')

  const from = (location.state as { from?: string } | null)?.from ?? '/products'
  const alreadyAuthenticated = isAuthenticated()

  useEffect(() => {
    if (alreadyAuthenticated) {
      navigate('/products', { replace: true })
    }
  }, [alreadyAuthenticated, navigate])

  const isDirty = username !== 'demo' || password !== 'demo123'
  useUnsavedChangesGuard({ when: isDirty })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      setAuthSession(session)
      navigate(from, { replace: true })
    },
  })

  const error = mutation.error as ApiError | null

  if (alreadyAuthenticated) {
    return null
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h4">Sign in</Typography>
          <Typography variant="body2" color="text.secondary">
            Use demo credentials to continue.
          </Typography>
          <TextField label="Username" value={username} onChange={(event) => setUsername(event.target.value)} />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button
            variant="contained"
            onClick={() => mutation.mutate({ username, password })}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Signing in...' : 'Continue'}
          </Button>
          {mutation.isSuccess ? <Alert severity="success">Signed in with dummy credentials.</Alert> : null}
          {error ? <Alert severity="error">{error.message}</Alert> : null}
        </Stack>
      </CardContent>
    </Card>
  )
}
