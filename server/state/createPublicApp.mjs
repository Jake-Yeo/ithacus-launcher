import { getManagedApp } from './managedAppRuntime.mjs'

export function createPublicApp(managedApp) {
  const runningManagedApp = getManagedApp(managedApp.id)
  return {
    id: managedApp.id,
    name: managedApp.name,
    description: managedApp.description,
    accent: managedApp.accent,
    kind: managedApp.kind ?? 'managed',
    url: managedApp.url,
    state: runningManagedApp?.state ?? 'stopped',
  }
}
