import { managedApps } from '../config/runtimeConfiguration.mjs'
import { createPublicApp } from './createPublicApp.mjs'
import { getActiveManagedApp } from './managedAppRuntime.mjs'

export function createLauncherStatus() {
  return { activeAppId: getActiveManagedApp()?.app.id ?? null, apps: managedApps.map(createPublicApp) }
}
