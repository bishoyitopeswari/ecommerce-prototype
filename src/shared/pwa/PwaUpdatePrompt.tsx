import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Snackbar } from '@mui/material'
import {
  applyServiceWorkerUpdate,
  registerServiceWorker,
} from '@shared/pwa/registerServiceWorker'

export function PwaUpdatePrompt() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [showOfflineReady, setShowOfflineReady] = useState(false)

  useEffect(() => {
    registerServiceWorker({
      onNeedRefresh: () => setShowUpdatePrompt(true),
      onOfflineReady: () => setShowOfflineReady(true),
    })
  }, [])

  const updateAction = useMemo(() => {
    if (!showUpdatePrompt) {
      return null
    }

    return (
      <Button color="inherit" size="small" onClick={() => applyServiceWorkerUpdate()}>
        Reload
      </Button>
    )
  }, [showUpdatePrompt])

  return (
    <>
      <Snackbar open={showUpdatePrompt} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="info" action={updateAction}>
          Update available. Reload to get the latest version.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showOfflineReady}
        autoHideDuration={3000}
        onClose={() => setShowOfflineReady(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success">Offline support is ready.</Alert>
      </Snackbar>
    </>
  )
}
