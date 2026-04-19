import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material'
import { useEffect } from 'react'
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { clearAuthSession, getCurrentUser } from '@features/auth/session'
import { getLogger } from '@shared/logger'

const navItems = [
  { label: 'Products', to: '/products' },
  { label: 'Cart', to: '/cart' },
  { label: 'Orders', to: '/orders' },
]

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getCurrentUser()

  useEffect(() => {
    getLogger().info('route.change', {
      path: location.pathname,
      search: location.search,
    })
  }, [location.pathname, location.search])

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(160deg, #F7F4EA 0%, #E8F1F2 100%)' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Ecommerce Prototype
          </Typography>
          <Stack direction="row" spacing={1}>
            {navItems.map((item) => (
              <Button key={item.to} component={RouterLink} to={item.to} color="inherit">
                {item.label}
              </Button>
            ))}
            <Typography sx={{ alignSelf: 'center', px: 1 }} variant="body2">
              {user?.name ?? 'Guest'}
            </Typography>
            <Button
              color="inherit"
              onClick={() => {
                clearAuthSession()
                navigate('/login', { replace: true })
              }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
