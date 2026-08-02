import { getActiveManagedApp, setActiveManagedApp } from '../state/managedAppRuntime.mjs'
import { waitForManagedAppShutdown } from './waitForManagedAppShutdown.mjs'

export async function stopActiveManagedApp() {
  const activeManagedApp = getActiveManagedApp()
  if (!activeManagedApp) return
  activeManagedApp.state = 'stopping'
  if (activeManagedApp.child.exitCode === null) {
    try { process.kill(-activeManagedApp.child.pid, 'SIGTERM') }
    catch (error) { if (error.code !== 'ESRCH') throw error }
    await Promise.race([
      new Promise(resolveExit => activeManagedApp.child.once('exit', resolveExit)),
      new Promise(resolveTimeout => setTimeout(resolveTimeout, 5000)),
    ])
    if (activeManagedApp.child.exitCode === null) {
      try { process.kill(-activeManagedApp.child.pid, 'SIGKILL') }
      catch (error) { if (!new Set(['ESRCH', 'EPERM']).has(error.code)) throw error }
    }
  }
  await waitForManagedAppShutdown(activeManagedApp.app)
  if (getActiveManagedApp() === activeManagedApp) setActiveManagedApp(null)
}
