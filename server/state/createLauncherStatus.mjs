import { managedApps } from '../config/runtimeConfiguration.mjs'
import { createPublicApp } from './createPublicApp.mjs'
import { getRunningManagedApps, getSelectedManagedApp } from './managedAppRuntime.mjs'

export function createLauncherStatus() {
  return { activeAppId: getSelectedManagedApp()?.app.id ?? null, runningAppIds: getRunningManagedApps().map(managedApp => managedApp.app.id), apps: managedApps.map(createPublicApp) }
}
