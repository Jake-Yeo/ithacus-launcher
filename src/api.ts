import type { LauncherState } from './types'

async function request(path: string, options?: RequestInit): Promise<LauncherState> {
  const response = await fetch(`/__ithacus/api${path}`, options)
  const payload = await response.json()
  if (!response.ok) throw new Error(payload.error || 'The launcher request failed.')
  return payload as LauncherState
}

export const getLauncherState = () => request('/status')
export const startManagedApp = (appId: string) => request(`/apps/${encodeURIComponent(appId)}/start`, { method: 'POST' })
export const stopManagedApp = () => request('/stop', { method: 'POST' })
