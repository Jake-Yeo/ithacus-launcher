export async function waitForManagedAppShutdown(managedApp, timeoutMilliseconds = 10000) {
  const shutdownDeadline = Date.now() + timeoutMilliseconds
  while (Date.now() < shutdownDeadline) {
    try {
      await fetch(`http://127.0.0.1:${managedApp.port}/`, { signal: AbortSignal.timeout(250) })
    } catch {
      return
    }
    await new Promise(resolveShutdownDelay => setTimeout(resolveShutdownDelay, 100))
  }
  throw new Error(`${managedApp.name} did not release port ${managedApp.port}`)
}
