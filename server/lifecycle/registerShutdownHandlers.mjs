import { runManagedAppTransition } from '../state/managedAppRuntime.mjs'
import { stopAllManagedApps } from '../process/stopManagedApp.mjs'

export function registerShutdownHandlers(httpServer) {
  const shutDownLauncher = async () => {
    await runManagedAppTransition(stopAllManagedApps)
    httpServer.close(() => process.exit(0))
    setTimeout(() => process.exit(1), 7000).unref()
  }
  process.on('SIGINT', shutDownLauncher)
  process.on('SIGTERM', shutDownLauncher)
}
