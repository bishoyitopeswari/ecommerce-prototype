import { useBeforeUnload, useBlocker } from 'react-router-dom'
import { useEffect } from 'react'

type UseUnsavedChangesGuardOptions = {
  when: boolean
  message?: string
}

const defaultMessage = 'You have unsaved changes. Are you sure you want to leave this page?'

export function useUnsavedChangesGuard({ when, message = defaultMessage }: UseUnsavedChangesGuardOptions) {
  const blocker = useBlocker(when)

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const shouldProceed = window.confirm(message)
      if (shouldProceed) {
        blocker.proceed()
      } else {
        blocker.reset()
      }
    }
  }, [blocker, message])

  useBeforeUnload(
    (event) => {
      if (!when) {
        return
      }

      event.preventDefault()
      event.returnValue = ''
    },
    { capture: true },
  )
}
