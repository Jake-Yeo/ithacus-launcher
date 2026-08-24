import { getManagedApp, getRunningManagedApps, removeManagedApp } from '../state/managedAppRuntime.mjs'
import { waitForManagedAppShutdown } from './waitForManagedAppShutdown.mjs'

export async function stopManagedApp(managedAppId) {
  const managedAppProcess = getManagedApp(managedAppId)
  if (!managedAppProcess) return
  managedAppProcess.state = 'stopping'
  if (managedAppProcess.child.exitCode === null) {
    try { process.kill(-managedAppProcess.child.pid, 'SIGTERM') }
    catch (error) { if (error.code !== 'ESRCH') throw error }
    await Promise.race([
      new Promise(resolveExit => managedAppProcess.child.once('exit', resolveExit)),
      new Promise(resolveTimeout => setTimeout(resolveTimeout, 5000)),
    ])
    if (managedAppProcess.child.exitCode === null) {
      try { process.kill(-managedAppProcess.child.pid, 'SIGKILL') }
      catch (error) { if (!new Set(['ESRCH', 'EPERM']).has(error.code)) throw error }
    }
  }
  await waitForManagedAppShutdown(managedAppProcess.app)
  removeManagedApp(managedAppId, managedAppProcess)
}

export async function stopAllManagedApps() {
  await Promise.all(getRunningManagedApps().map(managedApp => stopManagedApp(managedApp.app.id)))
}
