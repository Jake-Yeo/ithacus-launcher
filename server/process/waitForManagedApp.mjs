export async function waitForManagedApp(managedApp, childProcess, timeoutMilliseconds = 45000) {
  const readinessDeadline = Date.now() + timeoutMilliseconds
  while (Date.now() < readinessDeadline) {
    if (childProcess.exitCode !== null) throw new Error(`${managedApp.name} exited before becoming ready`)
    try {
      const readinessResponse = await fetch(`http://127.0.0.1:${managedApp.port}/`, { signal: AbortSignal.timeout(1500) })
      if (readinessResponse.status < 500) return
    } catch {}
    await new Promise(resolveReadinessDelay => setTimeout(resolveReadinessDelay, 500))
  }
  throw new Error(`${managedApp.name} did not become ready within 45 seconds`)
}
