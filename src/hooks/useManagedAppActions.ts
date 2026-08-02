import type { Dispatch, MutableRefObject, SetStateAction } from 'react'
import { startManagedApp } from '../services/launcherApi'
import type { LauncherApp, LauncherState } from '../types'

type Setter<T> = Dispatch<SetStateAction<T>>
type ActionOptions = { actionInProgress: MutableRefObject<boolean>; setEmbeddedAppId: Setter<string | null>; setEmbeddedAppUrl: Setter<string>; setIsBusy: Setter<boolean>; setIsEmbeddedAppOpen: Setter<boolean>; setLauncherState: Setter<LauncherState>; setMessage: Setter<string> }

export function useManagedAppActions(options: ActionOptions) {
  const setBusyState = (busy: boolean) => { options.actionInProgress.current = busy; options.setIsBusy(busy) }
  const startSelectedApp = async (app: LauncherApp) => {
    if (options.actionInProgress.current) return
    setBusyState(true); options.setMessage(`Opening ${app.name}…`)
    try { options.setLauncherState(await startManagedApp(app.id)); options.setEmbeddedAppId(app.id); options.setEmbeddedAppUrl(`/?app=${encodeURIComponent(app.id)}&t=${Date.now()}`); options.setIsEmbeddedAppOpen(true); options.setMessage('') }
    catch (error) { options.setMessage(error instanceof Error ? error.message : `Could not open ${app.name}.`) }
    finally { setBusyState(false) }
  }
  return { startSelectedApp }
}
