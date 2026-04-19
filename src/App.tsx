import { AppProviders } from '@app/providers'
import { AppRouter } from '@app/router'
import { ErrorBoundary } from '@shared/errors/ErrorBoundary'
import { GlobalErrorHandlers } from '@shared/errors/GlobalErrorHandlers'
import { PwaUpdatePrompt } from '@shared/pwa/PwaUpdatePrompt'

function App() {
  return (
    <ErrorBoundary>
      <GlobalErrorHandlers />
      <AppProviders>
        <AppRouter />
        <PwaUpdatePrompt />
      </AppProviders>
    </ErrorBoundary>
  )
}

export default App
