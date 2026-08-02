import { getActiveManagedApp } from './managedAppRuntime.mjs'

export function createPublicApp(managedApp) {
  const activeManagedApp = getActiveManagedApp()
  return {
    id: managedApp.id,
    name: managedApp.name,
    description: managedApp.description,
    accent: managedApp.accent,
    kind: managedApp.kind ?? 'managed',
    url: managedApp.url,
    state: activeManagedApp?.app.id === managedApp.id ? activeManagedApp.state : 'stopped',
  }
}
