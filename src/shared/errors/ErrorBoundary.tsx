import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'
import { Alert, Container } from '@mui/material'
import { getLogger } from '@shared/logger'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    getLogger().error('ui.error_boundary', {
      errorMessage: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container sx={{ py: 6 }}>
          <Alert severity="error">Something went wrong. Please refresh the page.</Alert>
        </Container>
      )
    }

    return this.props.children
  }
}
