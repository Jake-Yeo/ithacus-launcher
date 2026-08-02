import type { LauncherState } from '../types'

async function requestLauncherState(path: string, options?: RequestInit): Promise<LauncherState> {
  const response = await fetch(`/__ithacus/api${path}`, options)
  const payload = await response.json()
  if (!response.ok) throw new Error(payload.error || 'The launcher request failed.')
  return payload as LauncherState
}

export const getLauncherState = () => requestLauncherState('/status')
export const startManagedApp = (appId: string) => requestLauncherState(`/apps/${encodeURIComponent(appId)}/start`, { method: 'POST' })
export const stopManagedApp = () => requestLauncherState('/stop', { method: 'POST' })
