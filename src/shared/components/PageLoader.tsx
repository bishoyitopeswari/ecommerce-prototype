import { Box, CircularProgress } from '@mui/material'

export function PageLoader() {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '40vh' }}>
      <CircularProgress />
    </Box>
  )
}
