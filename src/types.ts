export type AppState = 'stopped' | 'starting' | 'running' | 'stopping' | 'failed'

export type LauncherApp = {
  id: string
  name: string
  description: string
  accent: string
  kind: 'managed' | 'link'
  url?: string
  state: AppState
}

export type LauncherState = {
  activeAppId: string | null
  apps: LauncherApp[]
}
