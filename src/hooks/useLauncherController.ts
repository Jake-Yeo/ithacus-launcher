import { useEffect, useMemo, useRef, useState } from 'react'
import { getLauncherState } from '../services/launcherApi'
import type { LauncherState } from '../types'
import { useManagedAppActions } from './useManagedAppActions'

const initialLauncherState: LauncherState = { activeAppId: null, runningAppIds: [], apps: [] }

export function useLauncherController() {
  const [launcherState, setLauncherState] = useState(initialLauncherState)
  const [message, setMessage] = useState('')
  const [isBusy, setIsBusy] = useState(false)
  const [embeddedAppId, setEmbeddedAppId] = useState<string | null>(null)
  const [embeddedAppUrl, setEmbeddedAppUrl] = useState('about:blank')
  const [isEmbeddedAppOpen, setIsEmbeddedAppOpen] = useState(false)
  const actionInProgress = useRef(false)
  const activeApp = useMemo(() => launcherState.apps.find(app => app.id === launcherState.activeAppId) || null, [launcherState])
  const actions = useManagedAppActions({ actionInProgress, setEmbeddedAppId, setEmbeddedAppUrl, setIsBusy, setIsEmbeddedAppOpen, setLauncherState, setMessage })

  useEffect(() => {
    getLauncherState().then(setLauncherState).catch(error => setMessage(error instanceof Error ? error.message : 'Could not reach the launcher service.'))
  }, [])

  return { activeApp, embeddedAppId, embeddedAppUrl, isBusy, isEmbeddedAppOpen, launcherState, message, ...actions }
}
